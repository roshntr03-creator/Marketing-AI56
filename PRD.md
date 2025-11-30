# Product Requirements Document: Marketing AI

## 1. Executive Summary
**Marketing AI** is an enterprise-grade "Creative Operating System" designed to unify fragmented AI generation tools into a single, cohesive workflow. It empowers SMBs, solo creators, and marketing teams to generate high-fidelity assets (video, image, text) and strategic insights using a credit-based consumption model.

## 2. Target Audience
*   **Solo Creators**: Need rapid content for TikTok/Reels (UGC) without hiring actors.
*   **SMB Owners**: Need professional ad creatives and brand consistency without an agency.
*   **Enterprise Marketing Teams**: Need scalable asset production, competitive intelligence, and workflow automation.

## 3. Core Features & Tools

### 3.1. Authentication & Onboarding
*   **Sign Up/Sign In**: Email/Password and Google OAuth simulation.
*   **Terms Gate**: Mandatory "Terms of Service & Privacy Policy" acceptance flow.
    *   **Behavior**: Users cannot access the dashboard until they scroll to the bottom of the policy page and click "I Agree".
    *   **Routing**: Strict route guarding redirects unverified users to `/terms-agreement`.
*   **Brand Setup**: Users define their Brand Name, Audience, Tone, and Values immediately to contextualize future AI generations.

### 3.2. Dashboard (Command Center)
*   **Visuals**: High-tech, dark-mode interface with a "System Operational" status.
*   **Key Metrics**: Real-time display of:
    *   Total Assets Created
    *   Video Generation Count
    *   Image Generation Count
    *   **Credit Balance** (Prominently displayed).
*   **Quick Actions**: One-click entry points to the most used tools (UGC, Image, Content).
*   **Recent Activity**: A list of the latest jobs with status indicators (Pending, Generating, Completed).

### 3.3. Creative Tools

#### **A. UGC Video Studio**
*   **Purpose**: Generate viral-style TikTok/Reels videos using AI avatars and script generation.
*   **Workflow**:
    1.  **Blueprint**: Upload product image → AI generates a 3-part script (Hook, Body, CTA).
    2.  **Casting**: Select Avatar Persona and Environment (Living Room, Studio, etc.).
    3.  **Production**: Generate video (Cost: 60-65 credits).
*   **Tech**: Simulates video generation via `aiService`.

#### **B. Promo Video Studio**
*   **Purpose**: High-end cinematic commercials (16:9, 9:16).
*   **Features**:
    *   **Timeline Editor**: Multi-track visualization (Video, Overlay, Audio).
    *   **Camera Controls**: Zoom, Pan, Tilt settings.
    *   **Style Presets**: Cinematic, Cyberpunk, 3D Render, Anime.
    *   **Overlays**: Ability to add text layers on top of video.
*   **Models**: Supports Sora 2.0 (10s/15s) and Grok 3 (6s).

#### **C. Image Generator Studio**
*   **Purpose**: Create high-resolution visual assets.
*   **Features**:
    *   **Magic Enhance**: One-click prompt optimization using LLM.
    *   **Advanced Settings**: Negative Prompt, Seed Control, Batch Size.
    *   **Scanning UI**: Visual feedback showing "Diffusing Noise", "Upscaling" during generation.
    *   **History Ribbon**: Quick access to previous generations.
*   **Cost**: 8 Credits per image.

#### **D. Content Generator**
*   **Purpose**: SEO blogs, ad copy, social captions.
*   **Features**:
    *   **Templates**: Blog, Social, Email, Video Script.
    *   **Typewriter Effect**: Real-time text streaming visualization.
    *   **Markdown Support**: Full formatting (Bold, Headers, Lists).

#### **E. Competitor Analysis (Market Intel)**
*   **Purpose**: Deep-dive audit of competitor websites.
*   **Output**: Generates a "Threat Score", SWOT analysis, content pillars, and strategic counter-measures.
*   **Visuals**: Radial gauges and terminal-style logging during the scan.

#### **F. Workflow Builder**
*   **Purpose**: No-code automation of creative tasks.
*   **UI**: Node-based editor with drag-and-drop canvas.
*   **Nodes**: Trigger, LLM Processor, Image Generator, Viewer.
*   **Logic**: Data flows from left to right; output of one node becomes context for the next.

## 4. Monetization & Credit System
The platform operates on a "Credits" economy. Users purchase monthly plans to top up credits.

*   **Starter Plan**: 1,000 Credits ($29/mo).
*   **Pro Plan**: 5,000 Credits ($99/mo).
*   **Cost Structure**:
    *   **High-Res Image**: 8 Credits
    *   **Video (6s)**: 40 Credits
    *   **Video (10s)**: 60 Credits
    *   **Video (15s)**: 65 Credits
    *   **Text Analysis/Gen**: 0 Credits (Included).
*   **Logic**: The system checks `userProfile.credits` before every generation. If balance < cost, the action is blocked with a Toast notification.

## 5. Technical Architecture
*   **Frontend**: React 18, TypeScript, Vite.
*   **Styling**: Tailwind CSS with custom animations (Glassmorphism, Neon Glows).
*   **State Management**: React Context API (`AppContext`) for global user state, credits, and notifications.
*   **Storage**:
    *   `localStorage`: User profile, settings, small metadata.
    *   `IndexedDB`: Heavy assets (Base64 images, generated video blobs) to ensure offline persistence and performance.
*   **AI Layer**:
    *   **Google Gemini API**: Powering text analysis, script generation, prompt enhancement, and "smart" logic.
    *   **Simulated Endpoints**: Grok/Sora video generation is simulated via service delays and mock responses for the prototype phase.

## 6. User Experience (UX) Design
*   **Aesthetic**: Dark Mode "Cyberpunk SaaS". Deep blacks (`#050505`), subtle borders, and vibrant accent colors (Indigo/Purple/Emerald).
*   **Feedback**: Global Toast Notification system replaces browser alerts for a premium feel.
*   **Navigation**: Collapsible Sidebar for desktop, bottom nav for mobile (hidden/optimized), and "Creations Hub" for asset management.