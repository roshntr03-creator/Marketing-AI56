
export interface BrandProfile {
  brandName: string;
  mission: string;
  audience: string;
  toneOfVoice: string;
  coreValues: string[];
  keywords: string[];
}

export type CreationJobType = 'UGC_VIDEO' | 'PROMO_VIDEO' | 'IMAGE' | 'CONTENT' | 'COMPETITOR_ANALYSIS';
export type CreationJobStatus = 'Pending' | 'Generating' | 'Completed' | 'Failed';

export interface CreationJob {
  id: string;
  type: CreationJobType;
  title: string;
  status: CreationJobStatus;
  createdAt: string;
  updatedAt: string;
  params: Record<string, any>;
  resultUrl?: string;
  resultText?: string;
  error?: string;
}

export interface CampaignBlueprint {
  campaignName: string;
  description: string;
  keyMessaging: string[];
  recommendedChannels: string[];
}

export interface CompetitorAnalysisReport {
  targetAudience: string;
  toneOfVoice: string;
  contentStrengths: string[];
  contentWeaknesses: string[];
  howToCompete: string[];
  keyTopics?: string[];
  socialPlatforms?: string[];
  marketPosition?: 'Leader' | 'Challenger' | 'Niche' | 'Follower';
}

export interface EnhancedPrompt {
  subject: string;
  style: string;
  composition: string;
  lighting: string;
  colorPalette: string;
  mood: string;
  negativePrompt: string;
  finalPrompt: string;
}

export interface SocialPost {
    mainText: string;
    hashtags: string[];
}

export interface CoachMessage {
    id: string;
    sender: 'user' | 'coach';
    text: string;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  credits: number;
  termsAccepted?: boolean;
}

export interface ChecklistState {
  exploredTools: boolean;
}

// Workflow Builder Types
export type WorkflowStepType = 'TRIGGER' | 'GENERATE_CONTENT' | 'GENERATE_IMAGE' | 'GENERATE_VIDEO';
export type WorkflowStepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface WorkflowStep {
    id: string;
    type: WorkflowStepType;
    title: string;
    status: WorkflowStepStatus;
    config: {
        prompt?: string;
        style?: string;
        aspectRatio?: string;
        duration?: string;
        usePreviousOutput?: boolean; // If true, input comes from previous step result
    };
    output?: {
        text?: string;
        imageUrl?: string;
        videoUrl?: string;
    };
}