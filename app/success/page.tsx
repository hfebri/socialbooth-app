"use client"

import { useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import { ArrowLeft, DownloadCloud, RefreshCw } from "lucide-react"
import { useSession } from "../providers"

export default function SuccessPage() {
  const router = useRouter()
  const {
    state: { generatedImageUrl, downloadUrl },
    actions: { reset },
  } = useSession()

  useEffect(() => {
    if (!generatedImageUrl) {
      router.replace("/")
    }
  }, [generatedImageUrl, router])

  const qrValue = useMemo(() => {
    if (!downloadUrl) return ""
    if (downloadUrl.startsWith("http")) {
      return downloadUrl
    }
    if (typeof window === "undefined") {
      return downloadUrl
    }
    return new URL(downloadUrl, window.location.origin).toString()
  }, [downloadUrl])

  if (!generatedImageUrl || !downloadUrl) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-12 md:px-10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> Start over
          </button>
          <div className="text-sm font-semibold text-gray-800">COMPLETE</div>
        </div>

        <main className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-900">All done!</h1>
              <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
                Ready to share
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              The final composite is stored securely in Supabase. Scan the QR code or tap the download button to collect your image.
            </p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
              <Image
                src={generatedImageUrl}
                alt="Generated layout"
                width={1080}
                height={1350}
                className="w-full object-cover"
              />
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-900">Download via QR</h2>
              <div className="mt-4 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <QRCode value={qrValue} size={180} bgColor="transparent" fgColor="#020617" />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Scan with your phone to download instantly. Link expires after 48 hours.
              </p>
              <a
                href={downloadUrl}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <DownloadCloud className="h-4 w-4" /> Download image
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Next session
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Ready for another guest? Reset the workflow to jump back to layout selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  reset()
                  router.replace("/")
                }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <RefreshCw className="h-4 w-4" /> New session
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
