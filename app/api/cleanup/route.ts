import { config } from "@/lib/config"
import { getSupabaseServiceRoleClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServiceRoleClient()
    const bucket = config.supabaseBucket()
    const url = new URL(request.url)
    const maxAgeHoursParam = url.searchParams.get("maxAgeHours")
    const maxAgeHours = maxAgeHoursParam ? Number(maxAgeHoursParam) : 48
    const cutoff = Date.now() - maxAgeHours * 60 * 60 * 1000

    const { data: prefixes, error } = await supabase.storage.from(bucket).list(undefined, {
      limit: 1000,
    })

    if (error) {
      console.error("Supabase list error", error)
      return Response.json({ error: "Failed to list storage objects" }, { status: 500 })
    }

    const removals: string[] = []

    for (const entry of prefixes ?? []) {
      // Each entry corresponds to the folder named after imageId
      const { data: files, error: listError } = await supabase.storage.from(bucket).list(entry.name, {
        limit: 50,
      })

      if (listError) {
        console.error("Supabase nested list error", listError)
        continue
      }

      for (const file of files ?? []) {
        const updatedAt = file.updated_at ? Date.parse(file.updated_at) : undefined
        if (updatedAt && updatedAt < cutoff) {
          removals.push(`${entry.name}/${file.name}`)
        }
      }
    }

    if (removals.length > 0) {
      const { error: removeError } = await supabase.storage.from(bucket).remove(removals)
      if (removeError) {
        console.error("Supabase remove error", removeError)
        return Response.json({ error: "Failed to remove stale files" }, { status: 500 })
      }
    }

    return Response.json({ removed: removals.length })
  } catch (error) {
    console.error("/api/cleanup error", error)
    return Response.json({ error: "Cleanup failed" }, { status: 500 })
  }
}
