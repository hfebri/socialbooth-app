import { Buffer } from "node:buffer"
import { randomUUID } from "node:crypto"
import { config } from "@/lib/config"
import { getSupabaseServiceRoleClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { remoteImageUrl, predictionId, layoutId } = body ?? {}

    if (!remoteImageUrl || typeof remoteImageUrl !== "string") {
      return Response.json({ error: "remoteImageUrl is required" }, { status: 400 })
    }

    const response = await fetch(remoteImageUrl)
    if (!response.ok) {
      return Response.json({ error: "Failed to fetch remote image" }, { status: 502 })
    }

    const contentType = response.headers.get("content-type") ?? "image/png"
    const extension = resolveExtension(contentType)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = getSupabaseServiceRoleClient()
    const bucket = config.supabaseBucket()
    const imageId = randomUUID()
    const storagePath = `${imageId}/composite.${extension}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
      contentType,
      upsert: false,
    })

    if (uploadError) {
      console.error("Supabase upload error", uploadError)
      return Response.json({ error: "Failed to persist image" }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)
    const publicUrl = publicUrlData.publicUrl
    const downloadUrl = `/download/${imageId}?path=${encodeURIComponent(storagePath)}`

    return Response.json({
      imageId,
      storagePath,
      generatedImageUrl: publicUrl,
      downloadUrl,
      layoutId,
      predictionId,
    })
  } catch (error) {
    console.error("/api/upload error", error)
    return Response.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

function resolveExtension(contentType: string) {
  if (contentType.includes("jpeg")) return "jpg"
  if (contentType.includes("png")) return "png"
  if (contentType.includes("webp")) return "webp"
  return "png"
}
