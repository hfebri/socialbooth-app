"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { StepIndicator } from "@/components/step-indicator";
import { useSession } from "../providers";
import { imageUrlToBase64 } from "@/lib/image-to-base64";
import { getRandomCaption } from "@/lib/caption-templates";

const POLL_INTERVAL = 3000;

function buildProgressCopy(status: string) {
  switch (status) {
    case "submitting":
      return "Uploading your photo";
    case "processing":
      return "AI is generating your layout";
    case "succeeded":
      return "Generation complete";
    case "failed":
      return "Something went wrong";
    default:
      return "Preparing generation";
  }
}

export default function GeneratePage() {
  const router = useRouter();
  const {
    state: {
      selectedPlatform,
      selectedBackground,
      socialHandle,
      caption,
      photoDataUrl,
      predictionId,
      generationStatus,
      error,
    },
    actions: { setStatus, setError, setPrediction, setGenerationResult },
  } = useSession();
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef(false);
  const hasStartedRef = useRef(false);

  const backgroundNames: Record<string, string> = {
    "bg-1": "mountain",
    "bg-2": "beach",
    "bg-3": "city night",
    "bg-4": "lake",
  };

  const backgroundName =
    backgroundNames[selectedBackground || ""] || selectedBackground;

  // Simulate progress while generating
  useEffect(() => {
    if (generationStatus === "submitting") {
      setProgress(10);
    } else if (generationStatus === "processing") {
      // Gradually increase progress from 20% to 90%
      setProgress(20);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (generationStatus === "succeeded") {
      setProgress(100);
    } else if (generationStatus === "failed") {
      setProgress(0);
    }
  }, [generationStatus]);

  const startGeneration = useCallback(async () => {
    // Prevent duplicate calls
    if (hasStartedRef.current) {
      console.log("Generation already started, skipping duplicate call");
      return;
    }

    if (
      !selectedPlatform ||
      !selectedBackground ||
      !socialHandle ||
      !caption ||
      !photoDataUrl ||
      isStarting
    ) {
      return;
    }

    hasStartedRef.current = true;

    // Build the prompt with optional handle and caption
    const promptParts = [
      `At the top of the image, place the event branding logo exactly as shown in the third reference image (Leverate Group × Meta - META Masterclass). The logo must be reproduced with perfect accuracy - identical colors, fonts, spacing, and layout. Do not modify, distort, or change any element of the logo.`,
      `Below the logo: Remove background from the person in the first reference image. Generate a complete full-body shot if only partial body is visible, maintaining exact facial features and appearance of the person.`,
      `The person should be in a relaxed sitting position inside a white 3D ${selectedPlatform} frame cutout with the logo.`,
      `Background is a ${backgroundName} from the second reference image, cinematic lighting, ultra-realistic, professional photo shoot quality.`,
    ];

    // Add handle if provided
    if (socialHandle && socialHandle.trim()) {
      promptParts.push(
        `${selectedPlatform} id: ${socialHandle} with blue verification checkmark.`
      );
    }

    // Add random caption
    const randomCaption = getRandomCaption();
    promptParts.push(`Caption text: ${randomCaption}`);

    promptParts.push(
      `Keep the person's identity, face, skin tone, hair, and clothing style identical to the first reference image. The event logo at the top must remain perfectly unchanged and clearly visible.`
    );

    const prompt = promptParts.join(" ");

    try {
      setIsStarting(true);
      setStatus("submitting");
      setError(undefined);

      console.log("Starting generation with prompt:", prompt);

      // Convert background image and event logo to base64
      const backgroundImageUrl = `${window.location.origin}/background/${selectedBackground}.png`;
      const backgroundDataUrl = await imageUrlToBase64(backgroundImageUrl);

      const eventLogoUrl = `${window.location.origin}/event.jpg`;
      const eventLogoDataUrl = await imageUrlToBase64(eventLogoUrl);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          photoDataUrl,
          backgroundImageUrl: backgroundDataUrl,
          eventLogoDataUrl: eventLogoDataUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start generation (${response.status})`);
      }

      const { predictionId: newPredictionId } = await response.json();
      console.log("Generation started, prediction ID:", newPredictionId);
      setPrediction(newPredictionId);
      setStatus("processing");
    } catch (err) {
      console.error("Generation failed:", err);
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Unexpected error");
      hasStartedRef.current = false; // Reset on error so retry can work
    } finally {
      setIsStarting(false);
    }
  }, [
    isStarting,
    selectedPlatform,
    selectedBackground,
    socialHandle,
    caption,
    backgroundName,
    photoDataUrl,
    setError,
    setPrediction,
    setStatus,
  ]);

  useEffect(() => {
    if (
      !selectedPlatform ||
      !selectedBackground ||
      !socialHandle ||
      !caption ||
      !photoDataUrl ||
      predictionId ||
      generationStatus !== "idle"
    ) {
      return;
    }

    startGeneration();
  }, [
    selectedPlatform,
    selectedBackground,
    socialHandle,
    caption,
    photoDataUrl,
    predictionId,
    generationStatus,
    startGeneration,
  ]);

  useEffect(() => {
    if (!predictionId || generationStatus !== "processing") {
      return;
    }

    abortRef.current = false;

    async function pollPrediction() {
      try {
        const response = await fetch(`/api/generate/${predictionId}`);
        if (!response.ok) {
          throw new Error(`Status check failed (${response.status})`);
        }

        const payload = await response.json();

        if (payload.status === "failed") {
          throw new Error(payload.error ?? "Generation failed");
        }

        if (payload.status === "succeeded" && payload.output) {
          const imageUrl = Array.isArray(payload.output)
            ? payload.output[0]
            : payload.output;

          setGenerationResult(imageUrl, imageUrl);
          setStatus("succeeded");
          abortRef.current = true;
          router.replace("/success");
        }
      } catch (err) {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    }

    const interval = setInterval(() => {
      if (!abortRef.current) {
        pollPrediction();
      }
    }, POLL_INTERVAL);

    return () => {
      abortRef.current = true;
      clearInterval(interval);
    };
  }, [
    generationStatus,
    predictionId,
    router,
    setError,
    setGenerationResult,
    setStatus,
  ]);

  const statusCopy = buildProgressCopy(generationStatus);

  const handleRetry = useCallback(() => {
    hasStartedRef.current = false; // Reset the ref to allow retry
    setPrediction(undefined);
    setError(undefined);
    setStatus("idle");
    abortRef.current = false;
    startGeneration();
  }, [setPrediction, setError, setStatus, startGeneration]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-8 py-16 text-center">
        <StepIndicator current={3} total={4} label="AI Generation" />
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            <Sparkles className="h-4 w-4" />
            {selectedPlatform ? `${selectedPlatform} Frame` : "Preparing"}
          </div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Generating your photobooth layout
          </h1>
          <p className="max-w-2xl text-base text-gray-600">
            We&apos;re compositing your photo with the {backgroundName}{" "}
            background.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
          </div>

          {/* Progress bar */}
          {(generationStatus === "submitting" ||
            generationStatus === "processing") && (
            <div className="w-full max-w-md">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-medium text-gray-800">
                  {statusCopy}
                </p>
                <p className="text-sm font-semibold text-blue-600">
                  {Math.round(progress)}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {generationStatus === "succeeded" && (
            <p className="text-lg font-medium text-gray-800">{statusCopy}</p>
          )}

          {generationStatus === "failed" && (
            <div className="flex flex-col items-center gap-4">
              <p className="max-w-lg text-sm text-red-600">
                {error ??
                  "We hit an unexpected issue. Try again or start over."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full border-2 border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleRetry}
                  disabled={isStarting}
                >
                  Retry generation
                </button>
                <button
                  type="button"
                  className="rounded-full border-2 border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => router.replace("/capture")}
                >
                  Retake photo
                </button>
                <button
                  type="button"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => router.replace("/")}
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
