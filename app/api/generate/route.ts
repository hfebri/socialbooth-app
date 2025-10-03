import Replicate from "replicate"
import { config } from "@/lib/config"

let cachedClient: Replicate | null = null

function getReplicateClient() {
  if (!cachedClient) {
    cachedClient = new Replicate({ auth: config.replicateToken() })
  }
  return cachedClient
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, photoDataUrl, backgroundImageUrl, eventLogoDataUrl } = body ?? {}

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    if (!photoDataUrl || typeof photoDataUrl !== "string" || !photoDataUrl.startsWith("data:image")) {
      return Response.json({ error: "photoDataUrl must be a base64 image data URL" }, { status: 400 })
    }

    if (!backgroundImageUrl || typeof backgroundImageUrl !== "string") {
      return Response.json({ error: "backgroundImageUrl is required" }, { status: 400 })
    }

    if (!eventLogoDataUrl || typeof eventLogoDataUrl !== "string") {
      return Response.json({ error: "eventLogoDataUrl is required" }, { status: 400 })
    }

    // google/nano-banana expects image_input as an array: [user photo, background image, event logo]
    const prediction = await getReplicateClient().predictions.create({
      model: "google/nano-banana",
      input: {
        prompt,
        image_input: [photoDataUrl, backgroundImageUrl, eventLogoDataUrl],
        output_format: "jpg",
      },
    })

    return Response.json({ predictionId: prediction.id, status: prediction.status })
  } catch (error) {
    console.error("/api/generate error", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to start generation"
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

export function GET() {
  return new Response(undefined, { status: 405, statusText: "Method Not Allowed" })
}
