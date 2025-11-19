
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BrandProfile, CampaignBlueprint, CompetitorAnalysisReport, EnhancedPrompt, SocialPost, CoachMessage } from '../types';

const KIE_API_KEY = '8774ae5d8c69b9009c49a774e9b12555';

// Initialize Gemini
// We do NOT create a static instance for Video calls because the key might change via the UI selector.
const createAI = (apiKey?: string) => new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });

// Helper to check for Veo key selection
export const ensureVeoKey = async (): Promise<void> => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // We assume the user selects it. If they cancel, the subsequent API call will fail,
            // which is handled by the try/catch blocks in the caller.
        }
    }
};

const aiService = {
  analyzeBrand: async (description: string): Promise<BrandProfile> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following business description or website URL and extract the brand identity.
      Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                brandName: { type: Type.STRING },
                mission: { type: Type.STRING },
                audience: { type: Type.STRING },
                toneOfVoice: { type: Type.STRING },
                coreValues: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["brandName", "mission", "audience", "toneOfVoice", "coreValues", "keywords"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  generateUGCScript: async (imageFile: File, brandProfile?: BrandProfile): Promise<{ script: string; interactionStyles: string[] }> => {
    const ai = createAI();
    
    // Convert File to Base64
    const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data url prefix for the API call if passing as inline data without mimeType handled by the SDK
            // SDK handles pure base64 string if we pass it correctly.
            resolve(base64String.split(',')[1]);
        };
        reader.readAsDataURL(imageFile);
    });

    const prompt = `Create a UGC (User Generated Content) video script for TikTok/Reels based on this product image. 
    Brand Context: ${brandProfile ? JSON.stringify(brandProfile) : 'N/A'}.
    The script should be natural, engaging, and sound like a real user recommendation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            { inlineData: { mimeType: imageFile.type, data: base64Data } },
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                script: { type: Type.STRING, description: "The spoken script for the video." },
                interactionStyles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested physical actions or camera movements." }
            }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },
  
  splitScript: async (script: string): Promise<{ part1: string; part2: string }> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Split the following script into two roughly equal natural segments for a 2-part video.
        Script: ${script}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    part1: { type: Type.STRING },
                    part2: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || '{}');
  },

  generateUGCVideo: async (params: any): Promise<string> => {
    // Using Sora 2 via Kie AI API for UGC
    // Note: Sora 2 Text-to-Video does not currently support image input in this API version,
    // so we construct a highly descriptive prompt based on the UGC parameters.
    
    const scriptContent = Array.isArray(params.script) ? params.script.join(' ') : params.script;
    const prompt = `UGC style video for social media. Scene: ${params.videoPrompt || 'Product showcase'}. Vibe: ${params.vibe}. Setting: ${params.setting}. Character: ${params.gender}. Action: ${params.selectedInteraction}. Script context: ${scriptContent}`;
    
    // Map video length: Sora 2 supports '10' or '15'. 
    // For '2x15s', we generate a single 15s clip for now as the base.
    const n_frames = (params.videoLength === '15s' || params.videoLength === '2x15s') ? '15' : '10';

    // 1. Create Task
    const createRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIE_API_KEY}`
        },
        body: JSON.stringify({
            model: 'sora-2-text-to-video',
            input: {
                prompt: prompt,
                aspect_ratio: 'portrait', // UGC is typically 9:16
                n_frames: n_frames,
                remove_watermark: true
            }
        })
    });

    const createData = await createRes.json();
    if (createData.code !== 200) throw new Error(createData.msg || 'Failed to start video generation');
    const taskId = createData.data.taskId;

    // 2. Poll Status
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        
        const statusRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            headers: {
                 'Authorization': `Bearer ${KIE_API_KEY}`
            }
        });
        const statusData = await statusRes.json();
        
        if (statusData.data.state === 'fail') {
            throw new Error(statusData.data.failMsg || 'Video generation failed');
        }
        
        if (statusData.data.state === 'success') {
             const resultJson = JSON.parse(statusData.data.resultJson);
             return resultJson.resultUrls?.[0] || '';
        }
    }
  },

  generatePromoVideo: async (params: any): Promise<string> => {
    // Using Sora 2 via Kie AI API
    const finalPrompt = params.style ? `${params.prompt}. Style: ${params.style}` : params.prompt;
    const ar = params.aspectRatio === '9:16' ? 'portrait' : 'landscape';
    const n_frames = params.duration === '15s' ? '15' : '10';

    // 1. Create Task
    const createRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIE_API_KEY}`
        },
        body: JSON.stringify({
            model: 'sora-2-text-to-video',
            input: {
                prompt: finalPrompt,
                aspect_ratio: ar,
                n_frames: n_frames,
                remove_watermark: true
            }
        })
    });

    const createData = await createRes.json();
    if (createData.code !== 200) throw new Error(createData.msg || 'Failed to start video generation');
    const taskId = createData.data.taskId;

    // 2. Poll Status
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        
        const statusRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            headers: {
                 'Authorization': `Bearer ${KIE_API_KEY}`
            }
        });
        const statusData = await statusRes.json();
        
        if (statusData.data.state === 'fail') {
            throw new Error(statusData.data.failMsg || 'Video generation failed');
        }
        
        if (statusData.data.state === 'success') {
             const resultJson = JSON.parse(statusData.data.resultJson);
             return resultJson.resultUrls?.[0] || '';
        }
    }
  },

  generateImage: async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = createAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio as any,
        },
    });
    
    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("Image generation failed");
    
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  },
  
  editImage: async (imageFile: File, instruction: string): Promise<string> => {
    const ai = createAI();
    const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(imageFile);
    });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { mimeType: imageFile.type, data: base64Data } },
                { text: instruction }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Image editing failed");
  },
  
  generateContent: async (contentType: string, topic: string, tone?: string): Promise<string> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a ${contentType} about ${topic}. Tone: ${tone}. 
        Format using Markdown. Include sections and bullet points.`,
    });
    return response.text || '';
  },
  
  generateSocialPosts: async (topic: string, platform: string): Promise<SocialPost[]> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create 3 engaging social media posts for ${platform} about ${topic}. 
        Include hashtags.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        mainText: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text || '[]');
  },
  
  generateCampaigns: async (product: string, audience: string): Promise<CampaignBlueprint[]> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Develop 3 comprehensive marketing campaign strategies for ${product} targeting ${audience}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        campaignName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        keyMessaging: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendedChannels: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text || '[]');
  },
  
  analyzeCompetitor: async (url: string): Promise<CompetitorAnalysisReport> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the brand at this URL: ${url}. 
        Provide a report on their target audience, tone of voice, content strengths, weaknesses, and how to compete.`,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });
    
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Second pass to structure the data from the text response
    const structureResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract the following fields from this analysis text into JSON:
        Text: ${response.text}
        Fields: targetAudience, toneOfVoice, contentStrengths (array), contentWeaknesses (array), howToCompete (array).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    targetAudience: { type: Type.STRING },
                    toneOfVoice: { type: Type.STRING },
                    contentStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    contentWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    howToCompete: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
    });
    
    return JSON.parse(structureResponse.text || '{}');
  },

  enhancePrompt: async (idea: string): Promise<EnhancedPrompt> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Enhance this simple idea into a detailed image generation prompt: "${idea}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING },
                    style: { type: Type.STRING },
                    composition: { type: Type.STRING },
                    lighting: { type: Type.STRING },
                    colorPalette: { type: Type.STRING },
                    mood: { type: Type.STRING },
                    negativePrompt: { type: Type.STRING },
                    finalPrompt: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || '{}');
  },

  coachReply: async(message: string): Promise<CoachMessage> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: "You are an expert marketing coach. Provide helpful, concise, and actionable advice."
        }
    });
    
    return {
        id: Date.now().toString(),
        sender: 'coach',
        text: response.text || "I'm sorry, I couldn't generate a response."
    };
  }
};

export default aiService;
