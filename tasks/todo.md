# AI Photobooth MVP Plan

## Project Overview

Create an AI-powered photobooth web application optimized for iPad where users can:

1. **Select a layout** - Browse and choose from a gallery of predefined layout templates
2. **Take their photo** - Capture their face using the device camera
3. **AI generation** - Generate final image with selected layout + user's face using Replicate API (google/nano-banana model)
4. **Download via QR code** - Scan QR code to download the generated image

**Tech Stack:**

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- AI: Replicate API (google/nano-banana model)
- Storage: Supabase (for generated images)
- Target Device: iPad (touch-optimized)

## User Flow

```
Layout Selection → Camera Capture → AI Processing → QR Code Display → Download
```

## Core MVP Features

### Phase 1: Layout Gallery & Selection

- [x] Create layout gallery component with grid/carousel view
- [x] Design 3-5 predefined layout templates with preview images
- [x] Store layout metadata (template images, prompts for Replicate)
- [x] Implement touch-optimized layout selection UI for iPad
- [x] Add "Next" button to proceed to camera after selection
- [x] Store selected layout in session state

### Phase 2: Camera & Photo Capture

- [x] Set up iPad camera permissions and access
- [x] Create camera component with live preview (optimized for iPad viewport)
- [x] Implement photo capture functionality
- [x] Add photo review screen with retake/confirm options
- [x] Handle iPad orientation (landscape/portrait)
- [x] Implement client-side image compression for upload

### Phase 3: Replicate API Integration

- [x] Set up Replicate API credentials (environment variables)
- [x] Create API route for image generation (`/api/generate`)
- [x] Integrate google/nano-banana model
- [x] Upload user photo + layout to Replicate
- [x] Handle Replicate webhook/polling for completion
- [x] Implement error handling and retry logic
- [x] Add loading screen with progress indicator
- [x] Parameterize prompt template variables (platform/handle/caption)

### Phase 4: Supabase Storage Integration

- [ ] Configure Supabase storage bucket for generated images (owner action)
- [x] Create API route to upload generated image to Supabase
- [x] Generate unique filename/ID for each image
- [x] Set up public URL access for downloads
- [x] Implement automatic cleanup (delete images after 24-48 hours)

### Phase 5: QR Code & Download System

- [x] Generate unique download URL for each generated image
- [x] Create QR code from download URL (use `qrcode` or similar library)
- [x] Display QR code on success screen
- [x] Build simple download page (`/download/[imageId]`)
- [x] Implement direct image download from Supabase
- [x] Add "Start Over" button to begin new session

### Phase 6: UI/UX Polish (iPad-optimized)

- [x] Design full-screen iPad interface (1024x768 / 2048x1536)
- [ ] Implement smooth page transitions between steps
- [x] Add clear step indicators (1/4, 2/4, etc.)
- [x] Create loading animations during AI generation
- [x] Add error states with user-friendly messages
- [x] Optimize touch targets (min 44x44px)
- [ ] Test on iPad Safari and Chrome

## Technical Implementation Details

### Environment Variables

```
REPLICATE_API_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Key API Routes

- `POST /api/generate` - Submit photo + layout for AI generation
- `GET /api/generate/[predictionId]` - Check generation status
- `POST /api/upload` - Upload generated image to Supabase
- `GET /api/cleanup` - Cron job to delete expired images

### State Management

- [x] Use React Context or Zustand for session state
- [x] Track: selectedLayout, capturedPhoto, generatedImageUrl, qrCodeUrl

### Dependencies to Install

- [x] `replicate` - Replicate API client
- [x] `@supabase/supabase-js` - Supabase client
- [x] `qrcode` or `react-qr-code` - QR code generation
- [x] `react-webcam` (optional) - Camera component helper

## Success Metrics

- [ ] Users can select layout and see clear preview
- [ ] Camera captures clear photos on iPad
- [ ] AI generation completes within 30-60 seconds
- [ ] QR codes scan successfully on mobile devices
- [ ] Download works seamlessly from Supabase
- [ ] App is responsive and works on iPad Safari

## Known Considerations

- **iPad camera access**: Requires HTTPS in production
- **Replicate processing time**: google/nano-banana typically takes 20-40s
- **Supabase storage limits**: Monitor quota on free tier
- **QR code size**: Ensure QR is large enough to scan easily
- **Session management**: Consider unique session IDs to prevent collisions

## Improvement

[x] make Caption and username optional, ensure the prompt also has the conditional
[ ] in the last page, implement the qr code using react qrcode
[ ] in the last page, add option for user to either scan qr code or send the picture using whatsapp.
[x] I added an event.png include that as the prompt make sure the event name is always on top of the image
[x] add start capture with camera icon after selecting layout and background to go to the next step
[x] in the capture page, add 5 seconds countdown timer and effect use https://motion.dev/ to impelement the effect. And automatically capture the photo.
