export type PromptVariables = Record<string, string>;

export type LayoutTemplate = {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  promptDefaults?: PromptVariables;
  preview: string;
  aspectRatio: string;
};

export function buildPrompt(
  layout: LayoutTemplate,
  overrides: PromptVariables = {}
): string {
  const variables = { ...layout.promptDefaults, ...overrides };
  return layout.promptTemplate.replace(/{{(\w+)}}/g, (match, key) => {
    return key in variables ? variables[key] : match;
  });
}

export function getLayoutById(id: string): LayoutTemplate | undefined {
  return LAYOUT_TEMPLATES.find((layout) => layout.id === id);
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: "retro-pop",
    name: "Retro Pop",
    description: "Bold primary colors with halftone overlay for upbeat shoots.",
    promptTemplate:
      "retro pop-art halftone portrait, bold primary colors, playful composition, crisp lighting",
    preview: "/layout/layout-1.jpeg",
    aspectRatio: "3:4",
  },
  {
    id: "modern-luxe",
    name: "Modern Luxe",
    description: "Soft gradients, clean typography, ideal for formal events.",
    promptTemplate:
      "minimalist luxury portrait, soft gradients, elegant sans serif typography, diffused lighting",
    preview: "/layout/layout-2.jpeg",
    aspectRatio: "4:5",
  },
  {
    id: "festival-glow",
    name: "Festival Glow",
    description:
      "Neon accents and lens flares suited for nightlife activations.",
    promptTemplate:
      "vibrant festival portrait, neon lighting, shimmer effects, high energy, cinematic",
    preview: "/layout/layout-3.jpeg",
    aspectRatio: "1:1",
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Black and white grid ready for editorial style outputs.",
    promptTemplate:
      "black and white editorial portrait, clean grid layout, high contrast, studio lighting",
    preview: "/layout/layout-4.jpeg",
    aspectRatio: "3:2",
  },
  {
    id: "creator-frame",
    name: "Creator Frame",
    description:
      "Event-branded hero portrait with top-aligned banner and TikTok logo accent—no additional text.",
    promptTemplate:
      "Stylish portrait of the character in a confident pose on a cinematic dark background with the Winning The Season of Sales graphic locked across the top and the official TikTok logo glowing nearby. Ultra-realistic lighting, branded particle effects, immersive depth, no additional typography.",
    promptDefaults: {
      platform: "TikTok",
      handle: "@leverategroup",
    },
    preview: "/layout/layout-6.jpeg",
    aspectRatio: "9:16",
  },
];
