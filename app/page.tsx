"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { StepIndicator } from "@/components/step-indicator"
import { LAYOUT_TEMPLATES } from "@/lib/layouts"
import { cn } from "@/lib/utils"
import { useSession } from "./providers"

export default function LayoutSelectionPage() {
  const router = useRouter()
  const {
    state: { selectedLayoutId },
    actions: { selectLayout, reset },
  } = useSession()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-8 py-12">
        <header className="flex flex-col gap-6">
          <StepIndicator current={1} total={4} label="Select Layout" />
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">Choose a layout</h1>
              <p className="mt-2 max-w-xl text-lg text-slate-500">
                Pick one of the predefined templates. Each layout is tuned for Replicate&apos;s
                google/nano-banana model and optimized for iPad photobooth flows.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-600"
            >
              Reset session
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {LAYOUT_TEMPLATES.map((layout) => {
            const isSelected = layout.id === selectedLayoutId
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => selectLayout(layout.id)}
                className={cn(
                  "group flex h-full flex-col gap-4 rounded-3xl border-2 border-transparent bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4",
                  isSelected ? "border-slate-900 focus:ring-slate-200" : "border-slate-200 focus:ring-slate-100"
                )}
              >
                <div className="overflow-hidden rounded-2xl bg-slate-900">
                  <Image
                    src={layout.preview}
                    alt={`${layout.name} preview`}
                    width={600}
                    height={400}
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">{layout.name}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                      {layout.aspectRatio}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{layout.description}</p>
                  {isSelected ? (
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                      Selected
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="mt-auto text-sm text-slate-400">Tap to select</span>
                  )}
                </div>
              </button>
            )
          })}
        </main>

        <footer className="sticky bottom-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/capture")}
            disabled={!selectedLayoutId}
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-medium text-white transition",
              selectedLayoutId
                ? "bg-slate-900 hover:bg-slate-700"
                : "cursor-not-allowed bg-slate-300 text-slate-500"
            )}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </footer>
      </div>
    </div>
  )
}
