import React from 'react';
import { 
    HomeIcon, 
    SparklesIcon, 
    BuildingStorefrontIcon, 
    Cog6ToothIcon, 
    VideoCameraIcon, 
    PhotoIcon,
    PresentationChartBarIcon,
    RectangleStackIcon,
    PencilSquareIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    MagnifyingGlassIcon,
    BoltIcon,
    ChartBarIcon,
    RectangleGroupIcon
} from '@heroicons/react/24/outline';

export const SIDEBAR_CATEGORIES = [
  {
    title: null,
    links: [
      { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-6 h-6" /> },
      { name: 'Creations Hub', href: '/creations', icon: <RectangleStackIcon className="w-6 h-6" /> },
    ]
  },
  {
    title: 'Create',
    links: [
      { name: 'UGC Video Creator', href: '/ugc-videos', icon: <VideoCameraIcon className="w-6 h-6" /> },
      { name: 'Promo Video', href: '/promo-videos', icon: <VideoCameraIcon className="w-6 h-6" /> },
      { name: 'Image Generation', href: '/image-generator', icon: <PhotoIcon className="w-6 h-6" /> },
      { name:'Content Generation', href: '/content-generator', icon: <PencilSquareIcon className="w-6 h-6" /> },
    ],
  },
  {
    title: 'Automation',
    links: [
        { name: 'Workflow Builder', href: '/workflow-builder', icon: <RectangleGroupIcon className="w-6 h-6" /> },
    ]
  },
  {
    title: 'Refine',
    links: [
      { name: 'Image Editor', href: '/image-editor', icon: <PencilSquareIcon className="w-6 h-6" /> },
      { name: 'Post Assistant', href: '/post-assistant', icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" /> },
      { name: 'Prompt Enhancer', href: '/prompt-enhancer', icon: <SparklesIcon className="w-6 h-6" /> },
    ],
  },
  {
    title: 'Strategy',
    links: [
      { name: 'Brand Identity', href: '/brand', icon: <BuildingStorefrontIcon className="w-6 h-6" /> },
      { name: 'Campaigns', href: '/campaigns', icon: <PresentationChartBarIcon className="w-6 h-6" /> },
      { name: 'Competitor Analysis', href: '/competitor-analysis', icon: <MagnifyingGlassIcon className="w-6 h-6" /> },
    ],
  },
  {
    title: 'General',
    links: [
      { name: 'Settings', href: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
    ]
  }
];


// FIX: Export NAV_LINKS to resolve error in BottomNav.tsx
export const NAV_LINKS = [
    { name: 'Home', href: '/dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Creations Hub', href: '/creations', icon: <RectangleStackIcon className="w-6 h-6" /> },
    { name: 'Brand', href: '/brand', icon: <BuildingStorefrontIcon className="w-6 h-6" /> },
    { name: 'More', href: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

// FIX: Add 'icon' property to each tool to resolve error in CreateHub.tsx
export const TOOLS = {
  'ugc-video': { name: 'UGC Video Creator', description: "Generate user-generated style videos.", icon: <VideoCameraIcon className="w-6 h-6" /> },
  'promo-video': { name: 'Promo Video Creator', description: "Create promotional videos from a prompt.", icon: <VideoCameraIcon className="w-6 h-6" /> },
  'image-generator': { name: 'Image Generation', description: "Create stunning images from text.", icon: <PhotoIcon className="w-6 h-6" /> },
  'image-editor': { name: 'AI Image Editor', description: "Edit images with AI instructions.", icon: <PencilSquareIcon className="w-6 h-6" /> },
  'content-generator': { name: 'Content Generation', description: "Generate various types of written content.", icon: <PencilSquareIcon className="w-6 h-6" /> },
  'post-assistant': { name: 'Post Assistant', description: "Craft posts for social media platforms.", icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" /> },
  'campaigns': { name: 'Campaigns', description: "Develop marketing campaign strategies.", icon: <PresentationChartBarIcon className="w-6 h-6" /> },
  'competitor-analysis': { name: 'Competitor Analysis', description: "Analyze your competitors' strategies.", icon: <MagnifyingGlassIcon className="w-6 h-6" /> },
  'prompt-enhancer': { name: 'Prompt Enhancer', description: "Refine your ideas into powerful prompts.", icon: <SparklesIcon className="w-6 h-6" /> },
  'workflow-builder': { name: 'Workflow Builder', description: "Build automated creative pipelines.", icon: <RectangleGroupIcon className="w-6 h-6" /> },
};

export type ToolId = keyof typeof TOOLS;

// FIX: Export ALL_TOOLS_ORDER to resolve errors in CreateHub.tsx and SettingsPage.tsx
export const ALL_TOOLS_ORDER: ToolId[] = [
    'ugc-video',
    'promo-video',
    'image-generator',
    'image-editor',
    'content-generator',
    'post-assistant',
    'campaigns',
    'competitor-analysis',
    'prompt-enhancer',
    'workflow-builder',
];

export const LANDING_FEATURES = [
  {
    icon: <VideoCameraIcon className="w-8 h-8 text-primary" />,
    name: 'AI Video Generation',
    description: 'Create compelling UGC-style and promotional videos from simple text prompts in minutes.'
  },
  {
    icon: <PhotoIcon className="w-8 h-8 text-primary" />,
    name: 'Stunning Image Creation',
    description: 'Generate high-quality, unique images and ad creatives that perfectly match your brand aesthetic.'
  },
  {
    icon: <PencilSquareIcon className="w-8 h-8 text-primary" />,
    name: 'Content & Copy Writing',
    description: 'Craft engaging blog posts, social media updates, and ad copy that converts.'
  },
  {
    icon: <ChartBarIcon className="w-8 h-8 text-primary" />,
    name: 'Marketing Strategy',
    description: 'Analyze competitors and develop data-driven campaign strategies to dominate your market.'
  }
];

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    frequency: '/ month',
    description: 'For individuals and small teams just getting started.',
    features: [
      '10 Video Generations',
      '50 Image Generations',
      'Basic Content Tools',
      'Email Support'
    ],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    frequency: '/ month',
    description: 'For growing businesses that need more power and scale.',
    features: [
      '50 Video Generations',
      'Unlimited Image Generations',
      'Advanced Content Tools',
      'Brand Identity Analysis',
      'Priority Support'
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    frequency: '',
    description: 'For large organizations with custom needs.',
    features: [
      'Unlimited Generations',
      'Team Collaboration Tools',
      'Dedicated Account Manager',
      'API Access & Integrations',
      'Custom Solutions'
    ],
    isPopular: false,
  }
];