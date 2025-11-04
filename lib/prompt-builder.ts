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

  const promptStructure = {
    meta: {
      task: "image-edit",
      params: {
        person_ref: "first reference image (person or group of people)",
        background_ref: "second reference image (background set)",
        background_variant: backgroundVariant,
        event_logo_ref:
          "third reference image (Winning The Season of Sales event logo)",
        social_frame_type: `${platform}_profile_frame_3d`,
        aspect_ratio: aspectRatio,
      },
    },

    subject: {
      primary: "The same person or group of people as in the first reference image",
      secondary: [
        `${platform} profile 3D frame cutout with ${platform} logo`,
        "Event branding logo (Winning The Season of Sales)",
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
    },

    edits: [
      {
        type: "exact_placement",
        target: "event_logo",
        instruction: `Place the "Winning The Season of Sales" event branding logo at the top center exactly as shown in the third reference image. Reproduce the logo with perfect pixel accuracy: maintain identical colors, fonts, spacing, and any design elements. Do not modify, distort, resize, or change any element. Maintain clear space around the logo and ensure it remains perfectly unchanged and clearly visible.`,
      },
      {
        type: "person_edit",
        target: "person",
        instruction: `Remove background from the person or group in the first reference image. Preserve exact facial features, identities, skin tones, hair, and clothing styles of ALL people. Generate a COMPLETE FULL-BODY shot in a confident, natural pose. The pose can be sitting, standing, or a dynamic group arrangement - choose what works best for the number of people and composition. Subjects can be positioned inside the frame cutout, around it, or interacting with it creatively. For single subjects: show full body from head to feet with natural posing. For groups: arrange people naturally while keeping everyone clearly visible. Ensure all body parts are naturally proportioned, clearly visible, and well-positioned in the composition. Maintain perfect anatomy, exact identities, and original clothing for all subjects.`,
      },
      {
        type: "frame_placement",
        target: "social_media_frame",
        instruction: `Create a clean white physical 3D ${platform} profile frame cutout (like a dimensional cardboard photo prop) with ONLY the ${platform} logo at the top. The frame should be a thick white border with depth and dimension (not flat, not a phone mockup). DO NOT add any UI elements like home icons, plus icons, heart icons, or navigation buttons at the bottom - keep the frame simple and clean with just the logo. Position the person or group either inside the frame cutout OR creatively around/behind the frame - choose the arrangement that works best for the composition and number of people. The subjects can interact with the frame naturally, whether posing within it or beside/around it. Ensure correct 3D perspective, realistic drop shadows, and proper occlusion where the frame overlaps or interacts with the subject(s). The frame must look like a tangible 3D object with thickness and shadow, not a 2D graphic or device screen.`,
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
      "unnatural body proportions or awkward poses",
      "partial body (cropped legs, missing feet, incomplete torso)",
      "missing people from group shots",
      "obscured faces or identities in group arrangements",
      "floating feet or ungrounded poses",
      "flat 2D frame or phone/device mockup instead of 3D physical frame",
      "frame that looks like a screen or digital interface",
      "UI icons or navigation buttons (home, plus, heart, menu icons)",
      "bottom navigation bar or social media interface elements",
      "generic social media UI that doesn't match the platform",
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
