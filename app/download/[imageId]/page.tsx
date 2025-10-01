import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DownloadCloud, Home } from "lucide-react"
import { config } from "@/lib/config"
import { getSupabaseAnonClient } from "@/lib/supabase"

type PageProps = {
  params: {
    imageId: string
  }
  searchParams: {
    path?: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `SocialBooth Download ${params.imageId}`,
  }
}

export default async function DownloadPage({ params, searchParams }: PageProps) {
  const storagePath = searchParams.path ? decodeURIComponent(searchParams.path) : null
  if (!storagePath) {
    notFound()
  }

  const bucket = config.supabaseBucket()
  const supabase = getSupabaseAnonClient()
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  const publicUrl = publicUrlData.publicUrl

  if (!publicUrl) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Your photo is ready</h1>
          <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
            {params.imageId.slice(0, 8)}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Thanks for visiting the booth! Download the final composite below.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <Image
            src={publicUrl}
            alt="Generated photobooth image"
            width={1080}
            height={1350}
            className="w-full object-cover"
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={publicUrl}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            download
          >
            <DownloadCloud className="h-4 w-4" /> Download image
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Home className="h-4 w-4" /> Back to start
          </Link>
        </div>
      </div>
    </div>
  )
}
