"use client"

import { cn } from "@/lib/utils"

type StepIndicatorProps = {
  current: number
  total: number
  label?: string
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full text-sm text-slate-400 uppercase tracking-wide">
      <span>{label ?? "Workflow"}</span>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const step = index + 1
          return (
            <span
              key={step}
              className={cn(
                "h-2 rounded-full transition-all",
                step === current ? "w-8 bg-slate-900" : "w-3 bg-slate-300"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
