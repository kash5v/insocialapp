# INSocial/Connect+ Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based (Social Platform Hybrid)

**Justification:** INSocial combines multiple leading social platforms (Instagram's visual feed, Twitter's microblogging, Snapchat's stories/camera, WhatsApp's messaging). This experience-focused, visual-rich application for the Indian market requires a distinctive identity that feels familiar yet fresh.

**Key References:**
- **Instagram:** Feed layout, stories carousel, profile grids, reels interface
- **Twitter/X:** Thread layouts, microblog cards, clean typography
- **Snapchat:** Camera-first experience, memories interface, story viewers
- **Telegram:** Chat bubbles, channel UI, group management
- **Spotify:** Music library grids, playback controls

**Design Principles:**
1. **Unified but Distinct:** Each section (chat, feed, stories) feels native to its purpose while maintaining brand cohesion
2. **Density with Clarity:** Information-rich without overwhelming (critical for feature-heavy platform)
3. **India-First:** Vibrant colors, multilingual support ready, optimized for varied network conditions
4. **Mobile-Native:** Touch-first interactions, thumb-friendly navigation

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 220 15% 8% (deep charcoal)
- Surface: 220 14% 12% (elevated cards)
- Surface Elevated: 220 13% 16% (modals, popovers)
- Brand Primary: 260 85% 58% (vibrant purple - energetic, modern)
- Brand Secondary: 280 80% 55% (rich violet for accents)
- Success: 142 71% 45% (emerald for verified badges, online status)
- Danger: 0 84% 60% (coral red for destructive actions)
- Text Primary: 220 10% 95%
- Text Secondary: 220 8% 70%
- Text Tertiary: 220 6% 50%

**Light Mode:**
- Background: 0 0% 100% (pure white)
- Surface: 220 20% 98% (off-white cards)
- Surface Elevated: 220 15% 96%
- Brand Primary: 260 90% 52% (deeper purple for light mode)
- Text Primary: 220 15% 10%
- Text Secondary: 220 10% 35%
- Text Tertiary: 220 8% 55%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI elements, body text, captions
- Display: 'Plus Jakarta Sans' (Google Fonts) - Headlines, profile names, section titles
- Monospace: 'JetBrains Mono' (Google Fonts) - Usernames, handles, code snippets

**Type Scale:**
- Display Large: 2.5rem / 700 (profile headers, landing hero)
- Display: 2rem / 700 (section headers)
- Headline: 1.5rem / 600 (post headers, chat titles)
- Body Large: 1.125rem / 500 (primary content)
- Body: 1rem / 400 (standard text)
- Body Small: 0.875rem / 400 (metadata, timestamps)
- Caption: 0.75rem / 500 (labels, counts)

### C. Layout System

**Spacing Primitives:** Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20 (limiting to consistent rhythm)

**Grid Strategy:**
- Feed: Single column mobile, max-w-2xl centered on desktop
- Stories: Horizontal scroll carousel (gap-2)
- Communities: 2-column grid on tablet+, single on mobile
- Music Library: 3-4 column grid (square tiles)
- Memories Grid: 3 columns mobile, 4-5 desktop (Instagram-style)

**Container Widths:**
- Chat Interface: Full width with max-w-7xl
- Feed Container: max-w-2xl
- Profile Container: max-w-5xl
- Modal/Sheet: max-w-lg for forms, max-w-4xl for media viewers

### D. Component Library

**Navigation:**
- Bottom Tab Bar (Mobile): 5 icons - Home, Search, Create, Messages, Profile (60px height, fixed, icons with active fill)
- Top App Bar: 56px height, sticky, with context title and action buttons
- Side Navigation (Desktop): 240px fixed left sidebar, collapsible to 72px icon-only

**Feed Components:**
- Post Card: White/surface background, rounded-xl, p-4, shadow-sm
- Post Header: Avatar (40px) + username + timestamp + menu (justify-between)
- Media Container: Aspect ratio preserved, rounded-lg, max-h-[600px]
- Action Bar: Like (heart), Comment (bubble), Share, Save (bookmark) - icons 24px, gap-6
- Multi-image: Carousel with dots indicator, swipe gesture

**Story Elements:**
- Story Ring: 64px circle with gradient border (brand colors), 3px stroke
- Story Viewer: Full-screen overlay, swipe navigation, progress bars at top (2px height, gap-1)
- Story Creation: Camera interface with top toolbar (flash, flip, timer) and bottom actions (gallery, capture, filters)

**Chat Interface:**
- Conversation List: Avatar (48px) + name + last message preview + timestamp, unread badge
- Message Bubbles: Sent (brand primary bg, white text), Received (surface bg), rounded-2xl, max-w-[75%], p-3
- Input Bar: Fixed bottom, 52px height, rounded-full input with attachment/emoji/send buttons

**Profile Components:**
- Profile Header: Cover gradient (h-32), avatar (96px, -mt-12 overlap), name, @handle, bio, stats row (posts/followers/following)
- Action Buttons: Follow (primary), Add Friend (outline), Message (outline) - row with gap-2
- Tab Navigation: Posts, Reels, Tagged, Memories (sticky below header)
- Content Grid: 3 columns, square tiles with 1px gap, lazy load

**Communities:**
- Channel Card: Cover image (16:9), title, member count, join button
- Group Header: Cover + avatar + name + description + member avatars preview
- Group Post: Similar to feed post but with group context badge

**Music Components:**
- Track Tile: Square album art, title, artist, duration - 4 columns desktop, 3 mobile
- Now Playing Bar: Fixed bottom (above nav), track info + play controls + progress slider
- Audio Waveform: Visualizer for voice messages (bars animation)

**Modals & Overlays:**
- Bottom Sheet (Mobile): Slide up with handle, rounded-t-3xl, backdrop blur
- Modal (Desktop): Centered, max-w-lg, rounded-2xl, shadow-2xl, backdrop-blur-sm
- Toast Notifications: Top-right, slide-in, 4s auto-dismiss, rounded-lg, shadow-lg

### E. Interactions & Animations

**Micro-interactions (Use Sparingly):**
- Like Button: Scale + color change (no heart explosion)
- Story Ring: Subtle pulse for unseen stories
- Message Send: Simple opacity fade-in for new messages
- Tab Switch: Crossfade content (150ms)
- Pull to Refresh: Subtle spinner, no elaborate animations

**Transitions:**
- Page Navigation: Fade (100ms) - instant feel
- Modal Entry: Scale from 95% to 100% + fade (200ms)
- Bottom Sheet: Slide up (250ms ease-out)
- Image Zoom: Smooth scale transform (300ms)

---

## Feature-Specific Design Notes

### Camera Interface
- Full-screen takeover with minimal UI
- Top bar: Flash, flip camera, timer icons (white with subtle bg)
- Center: Large capture button (72px, brand primary ring)
- Bottom: Gallery thumbnail (left), filters carousel (swipe)

### Memories/Albums
- Cover flow style album selection
- Grid view with date headers (sticky)
- Map view toggle for location-based memories
- Share/export options in floating action button

### Music Library
- Grid view default, list view toggle
- Category filters: Trending, Saved, Uploaded
- Quick preview on tap (3s sample)
- Add to post button on each track

### Threads/Microblogging
- Vertical line connecting replies (2px, text-tertiary)
- Indentation for nested replies (pl-8)
- Compact layout (less padding than feed posts)
- Quick actions: Like, Retweet, Reply inline

---

## Images & Visual Assets

**Hero Images:**
- Landing Page: Vibrant illustration showing chat bubbles + feed posts + stories ring in isometric view (approx 600px height)
- About Page: Team photo or India map with connection lines visualization

**Feature Illustrations:**
- Communities: Group of diverse avatars in circular arrangement
- Privacy: Shield with lock icon, modern minimalist style
- Verified Badge: Checkmark in circle, gradient fill (brand colors)

**Icons:**
- Use **Heroicons** (outline for inactive, solid for active states)
- Custom SVG for brand logo (stylized "IN" with Connect+ wordmark)

**Placeholder Content:**
- Profile avatars: Gradient backgrounds with initials
- Post images: Subtle geometric patterns with brand colors
- Album covers: Music note icon on gradient

---

## Accessibility & Performance

- Maintain 4.5:1 contrast ratio minimum
- All form inputs with proper dark mode styling (bg-surface, border-text-tertiary)
- Touch targets minimum 44px
- Reduce motion option support
- Lazy load images with blur-up placeholders
- Infinite scroll with virtualization for feeds
- Optimistic UI updates for instant feel