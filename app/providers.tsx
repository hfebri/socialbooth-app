"use client"

import { createContext, useContext, useMemo, useReducer } from "react"

export type SessionState = {
  userName?: string
  whatsappNumber?: string
  selectedPlatform: "tiktok" // Hardcoded to TikTok only
  selectedBackground?: string
  socialHandle?: string
  caption?: string
  photoDataUrl?: string
  predictionId?: string
  generatedImageUrl?: string
  downloadUrl?: string
  generationStatus: "idle" | "submitting" | "processing" | "succeeded" | "failed"
  error?: string
}

type SessionAction =
  | { type: "set_user_info"; payload: { userName: string; whatsappNumber: string } }
  | { type: "select_platform"; payload: { platform: "facebook" | "instagram" | "tiktok" } } // Keep for compatibility but always set to tiktok
  | { type: "select_background"; payload: { background: string } }
  | { type: "set_social_details"; payload: { socialHandle: string; caption: string } }
  | { type: "store_photo"; payload: { photoDataUrl: string } }
  | { type: "set_prediction"; payload: { predictionId?: string } }
  | {
      type: "set_generation_result"
      payload: { generatedImageUrl: string; downloadUrl: string }
    }
  | { type: "set_status"; payload: { status: SessionState["generationStatus"] } }
  | { type: "set_error"; payload: { error?: string } }
  | { type: "reset" }

const initialState: SessionState = {
  selectedPlatform: "tiktok", // Always TikTok
  generationStatus: "idle",
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "set_user_info":
      return {
        ...state,
        userName: action.payload.userName,
        whatsappNumber: action.payload.whatsappNumber,
      }
    case "select_platform":
      // Always set to tiktok regardless of payload (for compatibility)
      return {
        ...state,
        selectedPlatform: "tiktok",
      }
    case "select_background":
      return {
        ...state,
        selectedBackground: action.payload.background,
      }
    case "set_social_details":
      return {
        ...state,
        socialHandle: action.payload.socialHandle,
        caption: action.payload.caption,
      }
    case "store_photo":
      return {
        ...state,
        photoDataUrl: action.payload.photoDataUrl,
      }
    case "set_prediction":
      return {
        ...state,
        predictionId: action.payload.predictionId,
      }
    case "set_generation_result":
      return {
        ...state,
        generatedImageUrl: action.payload.generatedImageUrl,
        downloadUrl: action.payload.downloadUrl,
      }
    case "set_status":
      return {
        ...state,
        generationStatus: action.payload.status,
        error: action.payload.status === "failed" ? state.error : undefined,
      }
    case "set_error":
      return {
        ...state,
        error: action.payload.error,
      }
    case "reset":
      return initialState
    default:
      return state
  }
}

type SessionContextValue = {
  state: SessionState
  actions: {
    setUserInfo: (userName: string, whatsappNumber: string) => void
    selectPlatform: (platform: "facebook" | "instagram" | "tiktok") => void
    selectBackground: (background: string) => void
    setSocialDetails: (socialHandle: string, caption: string) => void
    storePhoto: (photoDataUrl: string) => void
    setPrediction: (predictionId?: string) => void
    setGenerationResult: (generatedImageUrl: string, downloadUrl: string) => void
    setStatus: (status: SessionState["generationStatus"]) => void
    setError: (error?: string) => void
    reset: () => void
  }
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)

  const actions = useMemo(() => ({
    setUserInfo: (userName: string, whatsappNumber: string) =>
      dispatch({ type: "set_user_info", payload: { userName, whatsappNumber } }),
    selectPlatform: (platform: "facebook" | "instagram" | "tiktok") =>
      dispatch({ type: "select_platform", payload: { platform } }),
    selectBackground: (background: string) =>
      dispatch({ type: "select_background", payload: { background } }),
    setSocialDetails: (socialHandle: string, caption: string) =>
      dispatch({ type: "set_social_details", payload: { socialHandle, caption } }),
    storePhoto: (photoDataUrl: string) =>
      dispatch({ type: "store_photo", payload: { photoDataUrl } }),
    setPrediction: (predictionId?: string) =>
      dispatch({ type: "set_prediction", payload: { predictionId } }),
    setGenerationResult: (generatedImageUrl: string, downloadUrl: string) =>
      dispatch({
        type: "set_generation_result",
        payload: { generatedImageUrl, downloadUrl },
      }),
    setStatus: (status: SessionState["generationStatus"]) =>
      dispatch({ type: "set_status", payload: { status } }),
    setError: (error?: string) => dispatch({ type: "set_error", payload: { error } }),
    reset: () => dispatch({ type: "reset" }),
  }), [])

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return ctx
}
