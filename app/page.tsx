"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Facebook, Instagram } from "lucide-react";
import { StepIndicator } from "@/components/step-indicator";
import { cn } from "@/lib/utils";
import { useSession } from "./providers";

const BACKGROUNDS = [
  { id: "bg-1", name: "Mountain", image: "/background/bg-1.png" },
  { id: "bg-2", name: "Beach", image: "/background/bg-2.png" },
  { id: "bg-3", name: "City Night", image: "/background/bg-3.png" },
  { id: "bg-4", name: "Lake", image: "/background/bg-4.png" },
];

export default function HomePage() {
  const router = useRouter();
  const {
    state: { selectedPlatform, selectedBackground, socialHandle, caption },
    actions: { selectPlatform, selectBackground, setSocialDetails, reset },
  } = useSession();

  const [handle, setHandle] = useState(socialHandle || "");
  const [userCaption, setUserCaption] = useState(caption || "");
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll carousel with smooth infinite scrolling
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // pixels per frame (lower = smoother)

    const smoothScroll = () => {
      // Scroll continuously
      carousel.scrollLeft += scrollSpeed;

      // When we've scrolled past the first set of images, seamlessly jump back
      // The user won't notice because we have duplicated images
      const singleSetWidth = 6 * (256 + 16); // 6 images × (width + gap)
      if (carousel.scrollLeft >= singleSetWidth) {
        carousel.scrollLeft -= singleSetWidth;
      }

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-8 py-12">
        {/* Event Branding */}
        <div className="flex justify-center">
          <Image
            src="/event.png"
            alt="Leverate Group × Meta - META Masterclass"
            width={400}
            height={80}
            className="h-auto w-auto max-w-md"
            priority
          />
        </div>

        {/* Example Results Carousel */}
        <section className="space-y-4">
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {/* Duplicate images twice for seamless infinite scroll */}
              {[...Array(2)].map((_, setIndex) =>
                [1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={`${setIndex}-${num}`} className="flex-shrink-0">
                    <div className="relative h-80 w-64 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
                      <Image
                        src={`/layout/layout-${num}.jpeg`}
                        alt={`Example result ${num}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <header className="flex flex-col gap-6">
          <StepIndicator
            current={1}
            total={4}
            label="Select Platform & Layout"
          />
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-gray-800">
                Choose your platform
              </h1>
              <p className="mt-2 max-w-xl text-lg text-gray-600">
                Select your social media platform and background.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-400 underline decoration-dotted underline-offset-4 hover:text-gray-600"
            >
              Reset session
            </button>
          </div>
        </header>

        {/* Social Media Platform Selection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Select Social Media
          </h2>
          <div className="grid grid-cols-2 gap-6 md:max-w-md">
            <button
              type="button"
              onClick={() => selectPlatform("facebook")}
              className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-8 transition hover:shadow-lg focus:outline-none focus:ring-4",
                selectedPlatform === "facebook"
                  ? "border-blue-600 focus:ring-blue-100"
                  : "border-gray-200 focus:ring-gray-100"
              )}
            >
              <Facebook
                className={cn(
                  "h-16 w-16",
                  selectedPlatform === "facebook"
                    ? "text-blue-600"
                    : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-lg font-semibold",
                  selectedPlatform === "facebook"
                    ? "text-blue-600"
                    : "text-gray-700"
                )}
              >
                Facebook
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectPlatform("instagram")}
              className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-8 transition hover:shadow-lg focus:outline-none focus:ring-4",
                selectedPlatform === "instagram"
                  ? "border-blue-600 focus:ring-blue-100"
                  : "border-gray-200 focus:ring-gray-100"
              )}
            >
              <Instagram
                className={cn(
                  "h-16 w-16",
                  selectedPlatform === "instagram"
                    ? "text-blue-600"
                    : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-lg font-semibold",
                  selectedPlatform === "instagram"
                    ? "text-blue-600"
                    : "text-gray-700"
                )}
              >
                Instagram
              </span>
            </button>
          </div>
        </section>

        {/* Background Selection */}
        {selectedPlatform && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Select Background
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {BACKGROUNDS.map((bg) => {
                const isSelected = bg.id === selectedBackground;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => selectBackground(bg.id)}
                    className={cn(
                      "group flex flex-col gap-3 rounded-2xl border-2 bg-white p-4 transition hover:shadow-lg focus:outline-none focus:ring-4",
                      isSelected
                        ? "border-blue-600 focus:ring-blue-100"
                        : "border-gray-200 focus:ring-gray-100"
                    )}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        src={bg.image}
                        alt={bg.name}
                        width={400}
                        height={300}
                        className="h-32 w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <span
                      className={cn(
                        "text-base font-semibold",
                        isSelected ? "text-blue-600" : "text-gray-700"
                      )}
                    >
                      {bg.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Social Details Form */}
        {selectedPlatform && selectedBackground && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Social Media Details (Optional)
            </h2>
            <div className="max-w-md space-y-4">
              <div>
                <label
                  htmlFor="handle"
                  className="block text-sm font-medium text-gray-700"
                >
                  {selectedPlatform === "facebook" ? "Facebook" : "Instagram"}{" "}
                  Handle <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder={
                    selectedPlatform === "facebook"
                      ? "@yourfacebook"
                      : "@yourinstagram"
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caption <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="caption"
                  value={userCaption}
                  onChange={(e) => setUserCaption(e.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your caption"
                />
              </div>
            </div>
          </section>
        )}

        <footer className="sticky bottom-8 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSocialDetails(handle, userCaption);
              router.push("/capture");
            }}
            disabled={!selectedPlatform || !selectedBackground}
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-medium text-white transition",
              selectedPlatform && selectedBackground
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            )}
          >
            Start Capture
            <Camera className="h-5 w-5" />
          </button>
        </footer>
      </div>
    </div>
  );
}
