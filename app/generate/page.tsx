"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles } from "lucide-react"
import { StepIndicator } from "@/components/step-indicator"
import { LAYOUT_TEMPLATES } from "@/lib/layouts"
import { useSession } from "../providers"

const POLL_INTERVAL = 3000

function buildProgressCopy(status: string) {
  switch (status) {
    case "submitting":
      return "Uploading photo to Replicate"
    case "processing":
      return "Replicate is generating your layout"
    case "succeeded":
      return "Generation complete"
    case "failed":
      return "Something went wrong"
    default:
      return "Preparing generation"
  }
}

export default function GeneratePage() {
  const router = useRouter()
  const {
    state: { selectedLayoutId, photoDataUrl, predictionId, generationStatus, error },
    actions: { setStatus, setError, setPrediction, setGenerationResult },
  } = useSession()
  const [isStarting, setIsStarting] = useState(false)
  const abortRef = useRef(false)

  useEffect(() => {
    if (!selectedLayoutId || !photoDataUrl) {
      router.replace("/")
    }
  }, [photoDataUrl, selectedLayoutId, router])

  const layout = useMemo(
    () => LAYOUT_TEMPLATES.find((item) => item.id === selectedLayoutId),
    [selectedLayoutId]
  )

  const startGeneration = useCallback(async () => {
    if (!layout || !photoDataUrl || isStarting) {
      return
    }

    try {
      setIsStarting(true)
      setStatus("submitting")
      setError(undefined)

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layoutId: layout.id,
          photoDataUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to start generation (${response.status})`)
      }

      const { predictionId: newPredictionId } = await response.json()
      setPrediction(newPredictionId)
      setStatus("processing")
    } catch (err) {
      setStatus("failed")
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setIsStarting(false)
    }
  }, [isStarting, layout, photoDataUrl, setError, setPrediction, setStatus])

  useEffect(() => {
    if (!layout || !photoDataUrl || predictionId || generationStatus !== "idle") {
      return
    }

    startGeneration()
  }, [layout, photoDataUrl, predictionId, generationStatus, startGeneration])

  useEffect(() => {
    if (!predictionId || generationStatus !== "processing") {
      return
    }

    abortRef.current = false

    async function pollPrediction() {
      try {
        const response = await fetch(`/api/generate/${predictionId}`)
        if (!response.ok) {
          throw new Error(`Status check failed (${response.status})`)
        }

        const payload = await response.json()

        if (payload.status === "failed") {
          throw new Error(payload.error ?? "Generation failed")
        }

        if (payload.status === "succeeded" && Array.isArray(payload.output) && payload.output[0]) {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              layoutId: selectedLayoutId,
              predictionId,
              remoteImageUrl: payload.output[0],
            }),
          })

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed (${uploadResponse.status})`)
          }

          const uploadPayload = await uploadResponse.json()
          setGenerationResult(uploadPayload.generatedImageUrl, uploadPayload.downloadUrl)
          setStatus("succeeded")
          abortRef.current = true
          router.replace("/success")
        }
      } catch (err) {
        setStatus("failed")
        setError(err instanceof Error ? err.message : "Unexpected error")
      }
    }

    const interval = setInterval(() => {
      if (!abortRef.current) {
        pollPrediction()
      }
    }, POLL_INTERVAL)

    return () => {
      abortRef.current = true
      clearInterval(interval)
    }
  }, [generationStatus, predictionId, router, selectedLayoutId, setError, setGenerationResult, setStatus])

  const statusCopy = buildProgressCopy(generationStatus)

  const handleRetry = useCallback(() => {
    setPrediction(undefined)
    setError(undefined)
    setStatus("idle")
    abortRef.current = false
    startGeneration()
  }, [setPrediction, setError, setStatus, startGeneration])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-8 py-16 text-center">
        <StepIndicator current={3} total={4} label="AI Generation" />
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-200">
            <Sparkles className="h-4 w-4" />
            {layout?.name ?? "Preparing"}
          </div>
          <h1 className="text-4xl font-semibold text-white">Generating your photobooth layout</h1>
          <p className="max-w-2xl text-base text-slate-300">
            We&apos;re compositing your photo with the <strong>{layout?.name}</strong> template using
            Replicate&apos;s google/nano-banana model. This usually takes 20-40 seconds.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <Loader2 className="h-16 w-16 animate-spin text-emerald-300" />
          </div>
          <p className="text-lg font-medium text-white">{statusCopy}</p>
          {generationStatus === "failed" && (
            <div className="flex flex-col items-center gap-4">
              <p className="max-w-lg text-sm text-rose-200">
                {error ?? "We hit an unexpected issue. Try again or start over."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
                  onClick={handleRetry}
                  disabled={isStarting}
                >
                  Retry generation
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20"
                  onClick={() => router.replace("/capture")}
                >
                  Retake photo
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
                  onClick={() => router.replace("/")}
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto flex w-full max-w-md justify-center">
          <div className="w-full rounded-3xl bg-white/5 p-6 text-left">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-300">What happens next?</p>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. Replicate completes the composite render.</li>
              <li>2. We upload the output to Supabase storage.</li>
              <li>3. You receive a QR code to download the final image.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
