# Camera UI Design Implementation

Based on the reference screenshot: `/Users/leverate/Downloads/1-detail_1630410929295.png`

## Plan

- [x] Set up camera page structure at `/app/camera/page.tsx`
- [x] Create camera preview component with full-screen layout
- [x] Implement bottom control panel with white background and rounded corners
- [x] Add three-tab navigation (NIGHT | PHOTO | PORTRAIT) with active state indicator
- [x] Create large circular shutter button component
- [x] Add thumbnail preview button (left) and camera flip button (right)
- [x] Configure color palette using Tailwind CSS
- [x] Add typography styling matching the iOS design
- [x] Implement responsive layout with safe area padding for iPad
- [x] Integrate with existing camera functionality from Phase 2

## Design Specifications

### Color Palette
- Background: `#F5F5F5` (light gray)
- Text Primary: `#000000` (black)
- Text Secondary: `#AAAAAA` (light gray for inactive tabs)
- Active Indicator: `#000000` (black underline)
- Panel Background: `#FFFFFF` (white)
- Icon Backgrounds: `#FFFFFF` with subtle shadow

### Layout Structure
```
┌─────────────────────────────────┐
│                                 │
│     Full Camera Preview         │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  NIGHT  |  PHOTO  | PORTRAIT │ │
│ │            ──────            │ │
│ │  [📷]     ( ● )        [↻]  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Typography
- Font Family: System font (SF Pro on iOS, system-ui fallback)
- Tab Labels: Uppercase, medium weight, 11-12px
- Letter spacing: Wide (0.5-1px)

### Components
1. **Tab Navigation**: Horizontal, evenly spaced, active underline indicator
2. **Shutter Button**: Large circle (~70px), black border, white fill
3. **Thumbnail**: Small square (~50px), rounded corners, shows last photo
4. **Flip Camera**: Icon button (~40px), circular background

## Review

### Implementation Summary

Successfully implemented iOS-style camera UI matching the reference design:

#### Created Files
- `/app/camera/page.tsx` - New camera page with iOS-style interface

#### Modified Files
- `/app/globals.css` - Added safe area inset support for iOS devices

#### Key Features Implemented

1. **Full-screen Camera Preview**
   - Uses `react-webcam` for live camera feed
   - Supports both user-facing and environment cameras
   - Responsive video constraints based on orientation

2. **Bottom Control Panel**
   - White background with rounded corners (`rounded-[2rem]`)
   - Glassmorphism effect with `bg-white/95` and `backdrop-blur-md`
   - Subtle shadow for depth

3. **Three-Tab Navigation**
   - NIGHT | PHOTO | PORTRAIT modes
   - Uppercase labels with wide letter spacing (`tracking-wider`)
   - Active state with black underline indicator
   - Inactive tabs in light gray (#AAAAAA)

4. **Camera Controls**
   - **Shutter Button**: 72px circular button with black border and white fill, inner black circle
   - **Thumbnail Preview**: Left-side 48px square showing last captured photo
   - **Flip Camera**: Right-side 48px circular button with FlipHorizontal icon

5. **Color Palette**
   - Background: `#F5F5F5`
   - Active text: `#000000`
   - Inactive text: `#AAAAAA`
   - Panel: `#FFFFFF` with transparency

6. **iOS Safe Area Support**
   - Added `--spacing-safe` CSS variable using `env(safe-area-inset-bottom)`
   - Created `.pb-safe` utility class for bottom padding
   - Ensures controls don't overlap with iOS home indicator

7. **User Experience**
   - Tap shutter to capture photo
   - Auto-navigate to existing capture/review page
   - Toggle between front/back cameras
   - Tab switching for different camera modes (UI-only, functional implementation pending)

#### Integration Notes
- Integrates with existing session state management
- Redirects to `/capture` page after photo capture for review/confirm workflow
- Uses existing image compression utility
- Maintains compatibility with orientation detection hook
