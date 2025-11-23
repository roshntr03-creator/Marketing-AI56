import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { BrandProfile, CampaignBlueprint, CompetitorAnalysisReport, EnhancedPrompt, SocialPost, CoachMessage } from '../types';

const KIE_API_KEY = '8774ae5d8c69b9009c49a774e9b12555';

// Initialize Gemini
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
        }
    }
};

// Helper for Kie AI Tasks - Updated to return array of strings
const runKieTask = async (model: string, input: any): Promise<string[]> => {
    const createRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIE_API_KEY}`
        },
        body: JSON.stringify({
            model,
            input
        })
    });

    const createData = await createRes.json();
    if (createData.code !== 200) throw new Error(createData.msg || 'Failed to start generation');
    const taskId = createData.data.taskId;

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const statusRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
            headers: { 'Authorization': `Bearer ${KIE_API_KEY}` }
        });
        const statusData = await statusRes.json();
        if (statusData.data.state === 'fail') throw new Error(statusData.data.failMsg || 'Generation failed');
        if (statusData.data.state === 'success') {
             const resultJson = JSON.parse(statusData.data.resultJson);
             return resultJson.resultUrls || [];
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

  generateUGCScript: async (imageFile: File, duration: string, brandProfile?: BrandProfile): Promise<{ hook: string; body: string; cta: string; visualDescription: string }> => {
    const ai = createAI();
    
    const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.readAsDataURL(imageFile);
    });

    const prompt = `Create a structured UGC (User Generated Content) video script for TikTok/Reels based on this product image. 
    Target Video Duration: ${duration}.
    Brand Context: ${brandProfile ? JSON.stringify(brandProfile) : 'N/A'}.
    
    REQUIREMENTS:
    1. Split the script into 3 distinct parts: Hook (0-3s), Body (Benefits/Features), and CTA (Call to Action).
    2. Total word count should fit ${duration} (approx 2.5 words per second).
    3. Tone: Authentic, enthusiastic, peer-to-peer.
    4. visualDescription: A detailed prompt for an AI video generator describing the actor, setting, and action matching the script.`;

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
                hook: { type: Type.STRING, description: "The opening line to grab attention (first 3 seconds)." },
                body: { type: Type.STRING, description: "The main value proposition or demonstration." },
                cta: { type: Type.STRING, description: "The closing call to action." },
                visualDescription: { type: Type.STRING, description: "Detailed visual prompt for the video generation model." }
            },
            required: ["hook", "body", "cta", "visualDescription"]
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
    // Combine structured script if present, else fall back to legacy 'script' param
    const fullScript = params.scriptHook ? `${params.scriptHook} ${params.scriptBody} ${params.scriptCTA}` : params.script;
    
    const prompt = `
    TYPE: UGC Social Media Video (TikTok/Reels)
    FORMAT: Vertical 9:16
    DURATION: ${params.videoLength}
    
    VISUAL SCENE:
    ${params.videoPrompt || 'A user holding the product in a natural setting.'}
    
    CASTING:
    - Actor Description: ${params.avatarDescription || 'Authentic UGC creator'}
    - Environment: ${params.setting}
    
    SCRIPT CONTEXT (For lip-sync/timing):
    "${fullScript}"
    
    TECHNICAL:
    - 4k resolution, realistic texture.
    - Handheld camera shake (subtle).
    - Good lighting but natural shadow falloff.
    `;
    
    // Handle Sora 2 duration logic (10s or 15s)
    let n_frames = '10';
    if (params.videoLength.includes('15')) {
        n_frames = '15';
    }

    const model = params.model || 'sora-2-text-to-video';

    const results = await runKieTask(model, {
        prompt: prompt,
        aspect_ratio: 'portrait',
        n_frames: n_frames,
        remove_watermark: true
    });
    return results[0] || '';
  },

  generatePromoVideo: async (params: any): Promise<string> => {
    const model = params.model || 'sora-2-text-to-video';
    
    // Construct sophisticated prompt with camera precision
    let finalPrompt = params.prompt;
    
    if (params.style) {
        finalPrompt += `. Aesthetic Style: ${params.style}`;
    }
    
    // Precision Camera Controls
    if (params.camera) {
        const { zoom, pan, tilt } = params.camera;
        const moves = [];
        if (zoom && zoom !== 'None') moves.push(`Camera Zoom: ${zoom}`);
        if (pan && pan !== 'None') moves.push(`Camera Pan: ${pan}`);
        if (tilt && tilt !== 'None') moves.push(`Camera Tilt: ${tilt}`);
        
        if (moves.length > 0) {
            finalPrompt += `. Cinematography: ${moves.join(', ')}. Smooth, professional movement.`;
        }
    }

    // Grok Video Logic (Fixed duration ~6s based on capabilities)
    if (model === 'grok-imagine/text-to-video') {
         let grokAr = '1:1';
         if (params.aspectRatio === '16:9') grokAr = '3:2';
         if (params.aspectRatio === '9:16') grokAr = '2:3';
         
         const results = await runKieTask(model, {
             prompt: finalPrompt,
             aspect_ratio: grokAr,
             mode: 'normal',
         });
         return results[0] || '';
    }

    // Sora Logic (10s or 15s)
    const ar = params.aspectRatio === '9:16' ? 'portrait' : params.aspectRatio === '1:1' ? 'square' : 'landscape';
    const n_frames = params.duration === '15s' ? '15' : '10';

    const results = await runKieTask(model, {
        prompt: finalPrompt,
        negative_prompt: params.negativePrompt || "blur, distortion, watermark, text, low quality, ugly, bad hands",
        aspect_ratio: ar,
        n_frames: n_frames,
        remove_watermark: true,
        seed: params.seed ? parseInt(params.seed) : undefined
    });
    return results[0] || '';
  },

  // Mock function to simulate video editing/rendering
  exportVideoWithEdits: async (originalUrl: string, edits: any): Promise<string> => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return originalUrl;
  },

  generateImage: async (prompt: string, aspectRatio: string, model: string = 'bytedance/seedream-v4-text-to-image', numImages: number = 1): Promise<string[]> => {
    // 1. Gemini Flash
    if (model === 'gemini-2.5-flash-image') {
        const url = await aiService.generateFastImage(prompt);
        return [url];
    }

    // 2. Grok Imagine
    if (model === 'grok-imagine/text-to-image') {
        let ar = '1:1';
        // Grok only supports 2:3, 3:2, 1:1
        if (aspectRatio === '16:9' || aspectRatio === '4:3') ar = '3:2';
        if (aspectRatio === '9:16' || aspectRatio === '3:4') ar = '2:3';
        
        const urls = await runKieTask(model, {
            prompt,
            aspect_ratio: ar,
            image_num: numImages,
            num_images: numImages // Some variants use different casing
        });
        // STRICTLY LIMIT OUTPUT: Only return the requested number of images
        return urls.slice(0, numImages);
    }

    // 3. Nano Banana Pro
    if (model === 'nano-banana-pro') {
        const urls = await runKieTask(model, {
            prompt,
            aspect_ratio: aspectRatio,
            resolution: '2K',
            output_format: 'png'
        });
        return urls.slice(0, 1);
    }

    // 4. Seedream v4 (Default Fallback)
    if (model === 'bytedance/seedream-v4-text-to-image') {
        const sizeMap: Record<string, string> = {
            '1:1': 'square_hd',
            '16:9': 'landscape_16_9',
            '9:16': 'portrait_16_9',
            '4:3': 'landscape_4_3',
            '3:4': 'portrait_4_3',
        };
        const imageSize = sizeMap[aspectRatio] || 'square_hd';
        
        const urls = await runKieTask(model, {
            prompt,
            image_size: imageSize,
            image_resolution: '2K',
            max_images: 1,
            seed: Math.floor(Math.random() * 1000000)
        });
        return urls.slice(0, 1);
    }

    throw new Error("Unsupported model");
  },

  generateFastImage: async (prompt: string): Promise<string> => {
      const ai = createAI();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
              parts: [{ text: prompt }]
          },
          config: {
              responseModalities: [Modality.IMAGE]
          }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
      }
      throw new Error("Generation Failed");
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

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Image editing failed");
  },

  compositeImages: async (backgroundBase64: string, foregroundBase64: string, prompt: string): Promise<string> => {
      const ai = createAI();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
              parts: [
                  { inlineData: { mimeType: 'image/jpeg', data: backgroundBase64 } },
                  { inlineData: { mimeType: 'image/jpeg', data: foregroundBase64 } },
                  { text: `Composite these two images. ${prompt}` }
              ]
          },
          config: {
               responseModalities: [Modality.IMAGE]
          }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
      }
      throw new Error("Composition failed");
  },
  
  generateText: async (prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
    const ai = createAI();
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text || '';
  },

  generateContent: async (params: { 
      type: string; 
      topic: string; 
      audience?: string; 
      tone?: string; 
      keywords?: string[]; 
      length?: string;
      language?: string; 
  }): Promise<string> => {
    const ai = createAI();
    
    const prompt = `
      Act as a professional world-class copywriter.
      
      TASK: Write a ${params.length || 'medium length'} ${params.type}.
      TOPIC: ${params.topic}
      TARGET AUDIENCE: ${params.audience || 'General Audience'}
      TONE: ${params.tone || 'Professional'}
      ${params.keywords?.length ? `KEYWORDS TO INCLUDE: ${params.keywords.join(', ')}` : ''}
      ${params.language ? `LANGUAGE: Write strictly in ${params.language}` : ''}
      
      FORMATTING RULES:
      - Use proper Markdown formatting (H1, H2, bold, bullet points).
      - Be engaging and concise.
      - Do not include preamble or conversational filler (e.g. "Here is your blog post"). Just output the content body.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
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
        Provide a detailed report on their target audience, brand tone, content strategy (strengths/weaknesses), competitive positioning, key topics they discuss, and active social platforms.`,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });
    
    const structureResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract the following fields from this analysis text into JSON:
        Text: ${response.text}
        
        Fields: targetAudience, toneOfVoice, contentStrengths (array), contentWeaknesses (array), howToCompete (array), keyTopics (array), socialPlatforms (array), marketPosition ("Leader", "Challenger", "Niche", "Follower")`,
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
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    socialPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    marketPosition: { type: Type.STRING, enum: ["Leader", "Challenger", "Niche", "Follower"] }
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
  },

  connectToCoachLive: async (callbacks: { 
    onopen?: () => void; 
    onmessage: (message: LiveServerMessage) => void; 
    onclose?: (e: CloseEvent) => void; 
    onerror?: (e: ErrorEvent) => void; 
  }) => {
      const ai = createAI();
      return ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
              },
              systemInstruction: "You are a friendly, energetic marketing expert.",
          },
          callbacks
      });
  }
};

export default aiService;