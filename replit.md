# INSocial Connect+ - India's Social Platform

## Overview

INSocial Connect+ is an India-focused social media platform combining features from multiple leading platforms (Instagram, Twitter, Snapchat, WhatsApp, Telegram) into a unified experience. The application provides a web-first interface with plans for mobile expansion, featuring feed-based content sharing, real-time messaging, stories, video content (shorts and long-form), and community channels.

The platform emphasizes a mobile-native, camera-first experience optimized for India's market with vibrant design, multilingual support readiness, and network condition optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing with the following main routes:
- Home (`/`) - Feed with stories and posts
- Search (`/search`) - Discovery and exploration
- Watch (`/watch`) - Video content (shorts and long-form)
- Create (`/create`) - Content creation hub
- Messages (`/messages`) - Real-time messaging
- Profile (`/profile`) - User profiles and settings

**UI Components**: Radix UI primitives with shadcn/ui design system for accessible, composable components. Custom components built for social media features including:
- Story rings with view states
- Feed posts with like/comment interactions
- Chat messages with read receipts
- Camera interface for content creation
- Thread-style microblogging posts

**State Management**: TanStack Query (React Query) for server state, with custom query client configuration for API requests and caching

**Styling**: 
- TailwindCSS with custom design tokens
- Dual theme support (light/dark mode) with purple/violet gradient brand colors
- Custom utility classes for elevation effects (`hover-elevate`, `active-elevate-2`)
- Responsive design with mobile-first approach

**Design System**:
- Reference-based approach combining Instagram (feed, stories), Twitter (threads), Snapchat (camera), Telegram (chat)
- Dark mode primary with vibrant purple branding (260° hue, 85% saturation)
- Typography using Space Grotesk, DM Sans, Fira Code, and Geist Mono font families
- Glass morphism effects for modern UI aesthetics

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API architecture with `/api/*` prefix for all application routes

**Development Setup**: 
- Vite middleware integration for HMR in development
- Separate production build process with esbuild bundling
- Custom error handling and request logging middleware

**Storage Interface**: Abstracted storage layer (`IStorage`) supporting CRUD operations, currently implemented with in-memory storage (`MemStorage`) but designed for easy database integration

**Session Management**: Express sessions configured for user authentication

### Data Storage

**Database**: PostgreSQL via Neon serverless with connection pooling

**ORM**: Drizzle ORM for type-safe database operations with:
- Schema-first approach in `shared/schema.ts`
- Migrations managed via Drizzle Kit
- Zod integration for runtime validation

**Current Schema**: Basic user table with username/password authentication (minimal MVP schema, designed for expansion to support posts, messages, stories, follows, etc.)

**WebSocket Support**: Configured for WebSocket connections using the `ws` library for real-time features

### Authentication & Authorization

**Planned Approach**: 
- OAuth2/OIDC integration (Google login mentioned in design docs)
- JWT-based session tokens
- Optional Aadhaar verification for India-specific identity validation
- Keycloak or Supabase Auth for identity management (documented but not yet implemented)

### Component Architecture

**Shared Code**: Common types and schemas in `shared/` directory accessible to both client and server

**Code Organization**:
- Client components split into UI primitives (`components/ui/`) and feature components
- Example components demonstrating usage patterns
- Custom hooks for mobile detection and toast notifications
- Centralized utility functions for class name merging

**Path Aliases**: 
- `@/` maps to client source
- `@shared/` for shared code
- `@assets/` for attached assets

## External Dependencies

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (accordion, dialog, dropdown, etc.)
- **TailwindCSS**: Utility-first CSS framework with PostCSS
- **class-variance-authority**: For component variant management
- **tailwind-merge**: Intelligent class name merging
- **cmdk**: Command palette interface

### State & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with Zod resolver integration
- **Wouter**: Lightweight routing library

### Database & Backend
- **Neon Database**: Serverless PostgreSQL platform
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect
- **Drizzle Zod**: Schema validation integration
- **Express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment banner

### Planned Integrations (from design documents)
- **Matrix/Synapse** or **Socket.IO**: Real-time messaging infrastructure
- **FFmpeg**: Media transcoding for video/audio processing
- **MinIO/S3**: Object storage for media files
- **Keycloak**: Identity and access management
- **libsignal**: End-to-end encryption for messages

### Font Services
- Google Fonts: Space Grotesk, Architects Daughter, DM Sans, Fira Code, Geist Mono