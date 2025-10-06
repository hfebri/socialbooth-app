"use client";
// @ts-nocheck - react-webcam has type issues with Next.js 15

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "../providers";
import { useOrientation } from "@/hooks/use-orientation";
import { compressDataUrl } from "@/lib/image";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

type WebcamInstance = {
  getScreenshot: () => string | null;
  video?: {
    srcObject?: MediaStream;
  };
};

export default function CapturePage() {
  const router = useRouter();
  const {
    state: { selectedPlatform, selectedBackground, photoDataUrl },
    actions: { storePhoto },
  } = useSession();
  const webcamRef = useRef<WebcamInstance | null>(null);
  const [preview, setPreview] = useState<string | undefined>(photoDataUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(5);
  const orientation = useOrientation();

  const videoConstraints = useMemo(
    () => ({
      facingMode: "user" as const,
      width: { ideal: orientation === "landscape" ? 1920 : 1280 },
      height: { ideal: orientation === "landscape" ? 1080 : 1440 },
    }),
    [orientation]
  );

  useEffect(() => {
    if (!selectedPlatform || !selectedBackground) {
      router.replace("/layouts");
    }
  }, [selectedPlatform, selectedBackground, router]);

  // Countdown timer - starts automatically when camera is ready and no preview
  useEffect(() => {
    if (preview || countdown === null) return;

    if (countdown === 0) {
      // Auto-capture when countdown reaches 0
      handleCapture();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, preview]);

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setPreview(screenshot);
    }
  };

  const handleConfirm = async () => {
    if (!preview || isSaving) return;
    setIsSaving(true);
    try {
      const compressed = await compressDataUrl(preview, {
        maxWidth: orientation === "landscape" ? 1920 : 1440,
        maxHeight: orientation === "landscape" ? 1080 : 1920,
        quality: 0.82,
        mimeType: "image/jpeg",
      });
      storePhoto(compressed ?? preview);
      router.push("/generate");
    } catch (error) {
      console.error("Image compression failed", error);
      storePhoto(preview);
      router.push("/generate");
    } finally {
      setIsSaving(false);
    }
  };

  if (!selectedPlatform || !selectedBackground) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Full-screen camera/preview */}
      <div className="absolute inset-0">
        {preview ? (
          <Image
            src={preview}
            alt="Captured photo"
            fill
            className="object-cover"
          />
        ) : (
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.92}
            className="h-full w-full object-cover"
            videoConstraints={videoConstraints}
            ref={(instance) => {
              webcamRef.current = instance as unknown as WebcamInstance;
            }}
          />
        )}
      </div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {!preview && countdown !== null && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-[200px] font-bold text-white drop-shadow-2xl"
                style={{
                  textShadow: "0 0 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 0, 0, 0.6)",
                }}
              >
                {countdown}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl font-semibold text-white drop-shadow-lg"
              >
                Get ready!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(undefined);
              setCountdown(5); // Restart countdown
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 backdrop-blur-sm transition hover:bg-gray-300"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom toolbar with backdrop blur */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overlay-toolbar pb-safe">
        <div className="px-8 py-6">
          {/* Camera controls */}
          <div className="flex items-center justify-center gap-16">
            {/* Left: Retry button (when preview) */}
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(undefined);
                  setCountdown(5); // Restart countdown
                }}
                disabled={isSaving}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
              >
                <RotateCcw className="h-7 w-7" />
              </button>
            )}

            {/* Center: Capture/Confirm button */}
            <button
              type="button"
              onClick={preview ? handleConfirm : handleCapture}
              disabled={isSaving}
              className={cn(
                "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition",
                preview
                  ? "border-blue-600 bg-blue-600"
                  : "border-white bg-transparent",
                isSaving && "opacity-50"
              )}
            >
              {preview ? (
                isSaving ? (
                  <span className="text-xs font-semibold text-white">...</span>
                ) : (
                  <Check className="h-8 w-8 text-white" />
                )
              ) : (
                <div className="h-16 w-16 rounded-full bg-white" />
              )}
            </button>

            {preview && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full opacity-0"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
