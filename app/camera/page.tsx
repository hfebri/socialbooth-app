"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { FlipHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "../providers"
import { useOrientation } from "@/hooks/use-orientation"
import { compressDataUrl } from "@/lib/image"

const Webcam = dynamic(() => import("react-webcam"), { ssr: false })

type WebcamInstance = {
  getScreenshot: () => string | null
}

type CameraMode = "night" | "photo" | "portrait"

export default function CameraPage() {
  const router = useRouter()
  const {
    state: { selectedLayoutId },
    actions: { storePhoto },
  } = useSession()
  const webcamRef = useRef<WebcamInstance | null>(null)
  const [mode, setMode] = useState<CameraMode>("photo")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [lastPhoto, setLastPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const orientation = useOrientation()

  const videoConstraints = useMemo(
    () => ({
      facingMode,
      width: { ideal: orientation === "landscape" ? 1920 : 1280 },
      height: { ideal: orientation === "landscape" ? 1080 : 1440 },
    }),
    [facingMode, orientation]
  )

  useEffect(() => {
    if (!selectedLayoutId) {
      router.replace("/")
    }
  }, [selectedLayoutId, router])

  const handleCapture = async () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot || isCapturing) return

    setIsCapturing(true)
    try {
      const compressed = await compressDataUrl(screenshot, {
        maxWidth: orientation === "landscape" ? 1920 : 1440,
        maxHeight: orientation === "landscape" ? 1080 : 1920,
        quality: 0.85,
        mimeType: "image/jpeg",
      })
      setLastPhoto(compressed ?? screenshot)
      storePhoto(compressed ?? screenshot)
      router.push("/capture")
    } catch (error) {
      console.error("Capture failed", error)
      setLastPhoto(screenshot)
      storePhoto(screenshot)
      router.push("/capture")
    } finally {
      setIsCapturing(false)
    }
  }

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F5F5F5]">
      {/* Full-screen camera preview */}
      <div className="absolute inset-0">
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.85}
          className="h-full w-full object-cover"
          videoConstraints={videoConstraints}
          ref={(instance) => {
            webcamRef.current = instance as unknown as WebcamInstance
          }}
        />
      </div>

      {/* Bottom control panel */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-safe">
        <div className="w-full max-w-2xl px-4 pb-6">
          <div className="rounded-[2rem] bg-white/95 shadow-lg backdrop-blur-md">
            {/* Mode tabs */}
            <div className="flex items-center justify-center gap-8 border-b border-black/5 px-6 pt-4 pb-3">
              <button
                type="button"
                onClick={() => setMode("night")}
                className={cn(
                  "relative pb-2 text-xs font-medium uppercase tracking-wider transition-colors",
                  mode === "night" ? "text-black" : "text-[#AAAAAA]"
                )}
              >
                NIGHT
                {mode === "night" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode("photo")}
                className={cn(
                  "relative pb-2 text-xs font-medium uppercase tracking-wider transition-colors",
                  mode === "photo" ? "text-black" : "text-[#AAAAAA]"
                )}
              >
                PHOTO
                {mode === "photo" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode("portrait")}
                className={cn(
                  "relative pb-2 text-xs font-medium uppercase tracking-wider transition-colors",
                  mode === "portrait" ? "text-black" : "text-[#AAAAAA]"
                )}
              >
                PORTRAIT
                {mode === "portrait" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            </div>

            {/* Camera controls */}
            <div className="flex items-center justify-between px-8 py-6">
              {/* Left: Thumbnail */}
              <button
                type="button"
                onClick={() => lastPhoto && router.push("/capture")}
                disabled={!lastPhoto}
                className={cn(
                  "h-12 w-12 overflow-hidden rounded-lg border-2 transition-opacity",
                  lastPhoto
                    ? "border-white shadow-md"
                    : "border-white/40 bg-white/20"
                )}
              >
                {lastPhoto && (
                  <img
                    src={lastPhoto}
                    alt="Last photo"
                    className="h-full w-full object-cover"
                  />
                )}
              </button>

              {/* Center: Shutter button */}
              <button
                type="button"
                onClick={handleCapture}
                disabled={isCapturing}
                className={cn(
                  "h-[72px] w-[72px] rounded-full border-[3px] border-black bg-white shadow-lg transition-transform active:scale-95",
                  isCapturing && "opacity-50"
                )}
              >
                <div className="m-1 h-full w-full rounded-full bg-black" />
              </button>

              {/* Right: Flip camera */}
              <button
                type="button"
                onClick={toggleCamera}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-95"
              >
                <FlipHorizontal className="h-6 w-6 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
