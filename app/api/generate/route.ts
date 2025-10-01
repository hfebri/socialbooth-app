import Replicate from "replicate"
import { config } from "@/lib/config"
import { buildPrompt, getLayoutById, type PromptVariables } from "@/lib/layouts"

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
    const { layoutId, photoDataUrl, promptVariables } = body ?? {}

    if (!layoutId || typeof layoutId !== "string") {
      return Response.json({ error: "layoutId is required" }, { status: 400 })
    }

    const layout = getLayoutById(layoutId)
    if (!layout) {
      return Response.json({ error: "Unknown layout" }, { status: 404 })
    }

    if (!photoDataUrl || typeof photoDataUrl !== "string" || !photoDataUrl.startsWith("data:image")) {
      return Response.json({ error: "photoDataUrl must be a base64 image data URL" }, { status: 400 })
    }

    let promptOverrides: PromptVariables | undefined
    if (promptVariables) {
      if (typeof promptVariables !== "object" || Array.isArray(promptVariables)) {
        return Response.json({ error: "promptVariables must be an object" }, { status: 400 })
      }
      promptOverrides = Object.fromEntries(
        Object.entries(promptVariables).filter(([, value]) => typeof value === "string")
      )
    }

    const prompt = buildPrompt(layout, promptOverrides)

    const prediction = await getReplicateClient().predictions.create({
      model: config.replicateModel(),
      input: {
        prompt,
        image: photoDataUrl,
        negative_prompt: "blurry, distorted, artifacts, watermark",
        output_format: "png",
      },
    })

    return Response.json({ predictionId: prediction.id, status: prediction.status })
  } catch (error) {
    console.error("/api/generate error", error)
    return Response.json({ error: "Failed to start generation" }, { status: 500 })
  }
}

export function GET() {
  return new Response(undefined, { status: 405, statusText: "Method Not Allowed" })
}
