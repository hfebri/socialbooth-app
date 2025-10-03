import Replicate from "replicate"
import { config } from "@/lib/config"

let cachedClient: Replicate | null = null

function getReplicateClient() {
  if (!cachedClient) {
    cachedClient = new Replicate({ auth: config.replicateToken() })
  }
  return cachedClient
}

type Params = {
  params: Promise<{
    predictionId: string
  }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { predictionId } = await params
    const prediction = await getReplicateClient().predictions.get(predictionId)

    return Response.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    })
  } catch (error) {
    const { predictionId } = await params
    console.error(`/api/generate/${predictionId} error`, error)
    return Response.json({ error: "Failed to fetch prediction status" }, { status: 500 })
  }
}
