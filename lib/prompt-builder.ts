import { getRandomCaption } from "./caption-templates";

interface PromptConfig {
  platform: string;
  backgroundVariant: string;
  backgroundName: string;
  socialHandle?: string;
  aspectRatio?: string;
}

export function buildStructuredPrompt(config: PromptConfig): string {
  const {
    platform,
    backgroundVariant,
    backgroundName,
    socialHandle,
    aspectRatio = "9:16",
  } = config;
  const randomCaption = getRandomCaption();

  const promptStructure = {
    meta: {
      task: "image-edit",
      params: {
        person_ref: "first reference image (person)",
        background_ref: "second reference image (background set)",
        background_variant: backgroundVariant,
        event_logo_ref:
          "third reference image (Leverate Group × Meta - META Masterclass logo)",
        social_frame_type: `${platform}_profile_frame_3d`,
        aspect_ratio: aspectRatio,
      },
    },

    subject: {
      primary: "The same person as in the first reference image",
      secondary: [
        `${platform} profile 3D frame cutout with ${platform} logo`,
        "Event branding logo (Leverate Group × Meta - META Masterclass)",
      ],
    },

    style: {
      genre: ["photorealistic", "editorial"],
      mood: ["empowering", "professional"],
      influences: ["professional photo shoot", "brand event visuals"],
    },

    lighting: {
      type: "cinematic",
      direction: "soft key with subtle rim",
      intensity: "medium",
      notes:
        "Studio-quality, even skin rendering; avoid harsh specular hot spots",
    },

    environment: {
      location: "Studio composite",
      background: `Use ${backgroundVariant} from the second reference image set (${backgroundName})`,
    },

    composition: {
      layout: `Event logo fixed at top center; subject inside white 3D ${platform} profile frame centered below the logo; balanced negative space`,
      symmetry: "strong",
      notes:
        "Ensure clear visual hierarchy: logo (top), framed subject (center), caption placement without overlapping the logo.",
    },

    quality: {
      resolution: "print-ready",
      texture_detail: "natural skin texture, fabric fidelity",
      postprocess: [
        "subtle film grain",
        "precise color management to match brand",
      ],
    },

    output: {
      aspect_ratio: aspectRatio,
      caption: randomCaption,
    },

    edits: [
      {
        type: "exact_placement",
        target: "event_logo",
        instruction: `Place the event branding sticker at the top center exactly as in the third reference image. It's a white rounded rectangle sticker/badge with subtle drop shadow containing: Top row - 'leverate GROUP' (black text with dots icon) × Meta logo (blue infinity symbol). Bottom row - 'META' (cyan/turquoise bold sans-serif) overlapping with 'Masterclass' (dark navy handwritten script font). Reproduce with perfect pixel accuracy: identical white background, colors (black, cyan #00D4D4, blue Meta, navy script), fonts, spacing, rounded corners, and drop shadow. Do not modify, distort, or change any element. Maintain clear space around the sticker and ensure it remains perfectly unchanged and clearly visible.`,
      },
      {
        type: "person_edit",
        target: "person",
        instruction: `Remove background from the person in the first reference image, then preserve exact facial features, identity, skin tone, hair, and clothing style. Then generate a COMPLETE FULL-BODY shot showing the entire person from head to feet with consistent proportions, clothing, and lighting. Then adjust the pose to a relaxed sitting position (seated on an invisible chair or ledge) with legs visible and natural posture while maintaining perfect anatomy and the subject's exact identity. The final result MUST show the complete person sitting with their full body visible from head to feet.`,
      },
      {
        type: "frame_and_caption",
        target: "social_media_frame",
        instruction: `Create a white physical 3D ${platform} profile frame cutout (like a dimensional cardboard photo prop) with the ${platform} logo prominently displayed. The frame should be a thick white border with depth and dimension (not flat, not a phone mockup). Then position the sitting person inside this 3D frame cutout so they appear to be posing within it, and add the caption text '${randomCaption}' at the bottom inside the frame using clean, modern typography that's clearly legible. Ensure correct 3D perspective, realistic drop shadows, and proper occlusion where the frame overlaps the person. The frame must look like a tangible 3D object with thickness and shadow, not a 2D graphic or device screen.`,
      },
      {
        type: "background_replacement",
        target: "background",
        instruction: `Set the background to ${backgroundName} from the second reference image collection, then match overall lighting to cinematic style, then maintain clean separation between subject, frame, and background with proper depth of field.`,
      },
    ],

    negatives: [
      "any modification of the event logo (color, font, spacing, layout)",
      "logo distortion, skewing, stretching, or blurring",
      "mismatched skin tone or altered facial identity",
      "unnatural body proportions or awkward sitting pose",
      "partial body (cropped legs, missing feet, incomplete torso)",
      "person standing instead of sitting",
      "flat 2D frame or phone/device mockup instead of 3D physical frame",
      "frame that looks like a screen or digital interface",
      "text artifacts or warped letters",
      "over-smooth 'plastic' skin",
      "haloing or hard cutout edges",
      "inconsistent lighting between subject, frame, and background",
      "compression artifacts",
    ],
  };

  // Add social handle if provided
  if (socialHandle && socialHandle.trim()) {
    promptStructure.edits.push({
      type: "text_add",
      target: "social_handle",
      instruction: `Add ${platform} id: ${socialHandle} with blue verification checkmark.`,
    });
  }

  // Return as JSON string
  return JSON.stringify(promptStructure, null, 2);
}
