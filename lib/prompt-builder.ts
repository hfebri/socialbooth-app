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
    aspectRatio = "9:16",
  } = config;

  const promptStructure = {
    meta: {
      task: "image-edit",
      params: {
        person_ref: "first reference image (person or group of people)",
        background_ref: "second reference image (background set)",
        background_variant: backgroundVariant,
        event_graphic_ref:
          "third reference image (Winning The Season of Sales brand graphic)",
        aspect_ratio: aspectRatio,
      },
    },

    subject: {
      primary:
        "The same person or group of people from reference image #1 (first image)",
      secondary: [
        "Winning The Season of Sales event graphic pulled from reference image #3",
        `${platform} hero graphic accents`,
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
      background: `Use ${backgroundVariant} from reference image #2 (${backgroundName})`,
    },

    composition: {
      layout: `Winning The Season of Sales graphic anchored across the top edge; subject centered beneath with confident posture; maintain spacious composition with cinematic depth`,
      symmetry: "strong",
      notes:
        "Ensure clear visual hierarchy: event graphic locked to the top edge, hero subject centered below. Do not invent additional typography or extra logos beyond the provided banner asset.",
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
        target: "event_graphic",
        instruction: `Composite the Winning The Season of Sales brand graphic exactly as shown in reference image #3. Use the asset without alteration—no recoloring, redrawing, or retyping. Anchor it flush to the very top of the composition as a glowing banner while keeping all original lettering crisp and unobstructed.`,
      },
      {
        type: "person_edit",
        target: "person",
        instruction: `Remove the background around the person or group in reference image #1 while preserving the SAME individuals, facial features, identities, skin tones, hair, clothing, and original pose. Do not add new people or remove anyone—keep the identical subjects from reference image #1 intact. Ensure every individual is shown FULL BODY from head to toe with natural proportions—if feet or lower body are missing, reconstruct them faithfully to match the original subjects. Perform only subtle refinements (clean cut edges, balanced lighting, grounded contact shadows) so the subjects sit naturally in the new scene.`,
      },
      {
        type: "background_replacement",
        target: "background",
        instruction: `Set the environment to ${backgroundName} using reference image #2, then match overall lighting to cinematic style, then maintain clean separation between subject and background with proper depth of field.`,
      },
    ],

    negatives: [
      "any modification of the event banner asset (color, font, spacing, layout)",
      "banner distortion, skewing, stretching, or blurring",
      "mismatched skin tone or altered facial identity",
      "unnatural body proportions or awkward poses",
      "partial body (cropped legs, missing feet, incomplete torso)",
      "missing people from group shots",
      "obscured faces or identities in group arrangements",
      "floating feet or ungrounded poses",
      "typographic text overlays, captions, or banner headlines",
      "new or altered typography that is not part of the provided event graphic asset",
      "event graphic positioned away from the top edge",
      "additional logos or icons not supplied in the references",
      "background that does not match reference image #2",
      "event graphic altered from reference image #3",
      "UI icons or navigation buttons (home, plus, heart, menu icons)",
      "bottom navigation bar or social media interface elements",
      "generic social media UI that doesn't match the platform",
      "over-smooth 'plastic' skin",
      "haloing or hard cutout edges",
      "inconsistent lighting between subject and background",
      "compression artifacts",
    ],
  };

  // Return as JSON string
  return JSON.stringify(promptStructure, null, 2);
}
