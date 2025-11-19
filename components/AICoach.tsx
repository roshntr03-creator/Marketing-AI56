
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import Modal from './ui/Modal';
import { Input } from './ui/Input';
import Button from './ui/Button';
import { CoachMessage } from '../types';
import aiService from '../services/aiService';
import { LiveServerMessage, Blob } from "@google/genai";

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  
  // Text Mode State
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Mode State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Ready');
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Cleanup audio on close
  useEffect(() => {
      if (!isOpen) {
          stopVoiceSession();
      }
  }, [isOpen]);

  // --- Text Mode Handlers ---

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: CoachMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const coachResponse = await aiService.coachReply(input);
        setMessages(prev => [...prev, coachResponse]);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Voice Mode Handlers (Live API) ---

  const startVoiceSession = async () => {
      try {
          setIsConnecting(true);
          setVoiceStatus('Connecting...');
          
          // 1. Init Audio Contexts
          inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          
          // 2. Get Mic Stream
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          // 3. Connect to Gemini Live
          sessionPromiseRef.current = aiService.connectToCoachLive({
              onopen: () => {
                  console.log("Live Session Opened");
                  setVoiceStatus('Listening...');
                  setIsConnecting(false);
                  setIsVoiceActive(true);
                  
                  // Start streaming input
                  const ctx = inputAudioContextRef.current!;
                  sourceRef.current = ctx.createMediaStreamSource(stream);
                  processorRef.current = ctx.createScriptProcessor(4096, 1, 1);
                  
                  processorRef.current.onaudioprocess = (e) => {
                      const inputData = e.inputBuffer.getChannelData(0);
                      const pcmBlob = createPcmBlob(inputData);
                      sessionPromiseRef.current?.then(session => {
                          session.sendRealtimeInput({ media: pcmBlob });
                      });
                  };

                  sourceRef.current.connect(processorRef.current);
                  processorRef.current.connect(ctx.destination);
              },
              onmessage: async (msg: LiveServerMessage) => {
                  // Handle Audio Output
                  const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                  if (base64Audio) {
                      setVoiceStatus('Speaking...');
                      playAudioChunk(base64Audio);
                  }
                  
                  if (msg.serverContent?.turnComplete) {
                      setVoiceStatus('Listening...');
                  }
              },
              onclose: () => {
                  console.log("Live Session Closed");
                  stopVoiceSession();
              },
              onerror: (e) => {
                  console.error("Live Session Error", e);
                  setVoiceStatus('Error');
                  stopVoiceSession();
              }
          });

      } catch (error) {
          console.error("Failed to start voice session", error);
          setVoiceStatus('Failed');
          setIsConnecting(false);
      }
  };

  const stopVoiceSession = () => {
      setIsVoiceActive(false);
      setVoiceStatus('Ready');
      
      // Close Session
      if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then(session => session.close());
          sessionPromiseRef.current = null;
      }

      // Stop Mic Processing
      if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current.onaudioprocess = null;
          processorRef.current = null;
      }
      if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
      }
      if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
      }
      
      // Close Audio Contexts
      if (inputAudioContextRef.current) {
          inputAudioContextRef.current.close();
          inputAudioContextRef.current = null;
      }
      if (outputAudioContextRef.current) {
          outputAudioContextRef.current.close();
          outputAudioContextRef.current = null;
      }
      
      nextStartTimeRef.current = 0;
  };

  // --- Audio Helpers ---

  const createPcmBlob = (data: Float32Array): Blob => {
      const l = data.length;
      const int16 = new Int16Array(l);
      for (let i = 0; i < l; i++) {
          int16[i] = data[i] * 32768;
      }
      return {
          data: encodeBase64(new Uint8Array(int16.buffer)),
          mimeType: 'audio/pcm;rate=16000',
      };
  };

  const playAudioChunk = async (base64Audio: string) => {
      const ctx = outputAudioContextRef.current;
      if (!ctx) return;

      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const currentTime = ctx.currentTime;
      const startTime = Math.max(currentTime, nextStartTimeRef.current);
      
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
  };

  const encodeBase64 = (bytes: Uint8Array) => {
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
  };

  const decodeBase64 = (base64: string) => {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
      }
      return buffer;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'text' ? "AI Marketing Coach" : "Live Voice Session"}>
      <div className="flex flex-col h-[70vh]">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-4 border-b border-white/5 pb-4">
              <div className="bg-zinc-900 p-1 rounded-lg flex">
                  <button 
                      onClick={() => { stopVoiceSession(); setMode('text'); }}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'text' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                      Text Chat
                  </button>
                  <button 
                      onClick={() => setMode('voice')}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'voice' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                      Voice Call
                  </button>
              </div>
          </div>

          {mode === 'text' ? (
            <>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'coach' && (
                                <div className="bg-indigo-600 p-2 rounded-full shadow-lg shadow-indigo-500/20">
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-500/10' : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <div className="text-zinc-500">
                                    <UserCircleIcon className="w-9 h-9" />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-white/5">
                    <Input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        placeholder="Ask a marketing question..."
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        className="bg-zinc-900 border-white/10"
                    />
                    <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()} className="px-4">
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    </Button>
                </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900/50 rounded-2xl border border-white/5">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                {/* Status Indicator */}
                <div className="relative z-10 flex flex-col items-center gap-8">
                    <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isVoiceActive ? 'bg-indigo-500/10' : 'bg-zinc-800/50'}`}>
                        {/* Pulse Ring */}
                        {isVoiceActive && voiceStatus !== 'Speaking...' && (
                            <div className="absolute inset-0 border-2 border-indigo-500 rounded-full animate-ping opacity-20"></div>
                        )}
                        
                        {/* Speaking Visualizer */}
                        {voiceStatus === 'Speaking...' && (
                            <div className="absolute inset-0 flex items-center justify-center gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-1 bg-indigo-400 rounded-full animate-pulse" style={{
                                        height: `${Math.random() * 60 + 20}%`, 
                                        animationDuration: '0.5s',
                                        animationDelay: `${i * 0.1}s`
                                    }}></div>
                                ))}
                            </div>
                        )}

                        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isVoiceActive ? 'bg-indigo-600 scale-105' : 'bg-zinc-700'}`}>
                            <MicrophoneIcon className={`w-10 h-10 text-white ${isVoiceActive ? 'animate-pulse' : ''}`} />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-display font-bold text-white">{voiceStatus}</h3>
                        <p className="text-zinc-400 text-sm max-w-xs">
                            {isVoiceActive ? "I'm listening. Go ahead and speak." : "Tap the microphone to start."}
                        </p>
                    </div>

                    {!isVoiceActive ? (
                        <Button size="lg" onClick={startVoiceSession} isLoading={isConnecting} className="rounded-full px-8 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            Start Session
                        </Button>
                    ) : (
                         <Button size="lg" variant="danger" onClick={stopVoiceSession} className="rounded-full px-8">
                            <StopIcon className="w-5 h-5 mr-2" />
                            End Session
                        </Button>
                    )}
                </div>
            </div>
          )}
      </div>
    </Modal>
  );
};

export default AICoach;
