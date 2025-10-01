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
  params: {
    predictionId: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const prediction = await getReplicateClient().predictions.get(params.predictionId)

    return Response.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    })
  } catch (error) {
    console.error(`/api/generate/${params.predictionId} error`, error)
    return Response.json({ error: "Failed to fetch prediction status" }, { status: 500 })
  }
}
