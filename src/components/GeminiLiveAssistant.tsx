import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Volume2, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { cn } from '../utils';

export const GeminiLiveAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const [error, setError] = useState<string | null>(null);

  const startVoice = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are InternShield's voice assistant. Help students identify internship scams. Be professional, reassuring, and concise. If they describe a situation, tell them if it sounds like a scam based on common red flags like asking for money, vague job descriptions, or unofficial communication channels.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          }
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            processorRef.current!.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' } });
            };
            sourceRef.current!.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: (message) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
              audioContextRef.current?.decodeAudioData(audioData, (buffer) => {
                const source = audioContextRef.current!.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current!.destination);
                source.start();
              });
            }
          },
          onclose: () => stopVoice(),
          onerror: (e) => {
            console.error("Voice error:", e);
            setError("Connection error. Please try again.");
            stopVoice();
          }
        }
      });
      sessionRef.current = session;
    } catch (err: any) {
      console.error("Failed to start voice:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Microphone access denied. Please enable it in your browser settings.");
      } else {
        setError("Failed to start voice assistant. Please check your connection.");
      }
      setIsConnecting(false);
    }
  };

  const stopVoice = () => {
    setIsActive(false);
    setIsConnecting(false);
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    sessionRef.current?.close();
  };

  useEffect(() => {
    return () => {
      if (isActive) stopVoice();
    };
  }, [isActive]);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {(isActive || error) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-24 right-0 w-80 glass-card p-6 shadow-2xl border-brand-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", error ? "bg-red-500" : "bg-brand-500 animate-pulse")} />
                <span className={cn("text-xs font-bold uppercase tracking-widest", error ? "text-red-600" : "text-brand-600")}>
                  {error ? "Error" : "Live AI Assistant"}
                </span>
              </div>
              <button onClick={() => { stopVoice(); setError(null); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {error ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                  {error}
                </p>
                <button 
                  onClick={startVoice}
                  className="text-xs font-bold text-brand-600 hover:underline text-left"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Describe an internship offer or a suspicious message you received. I'll help you analyze it for red flags.
                </p>
                <div className="flex justify-center items-center h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-brand-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={isActive ? stopVoice : startVoice}
        disabled={isConnecting}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group relative overflow-hidden",
          isActive ? "bg-red-500 text-white" : "bg-brand-600 text-white",
          isConnecting && "animate-pulse opacity-70"
        )}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isActive ? <MicOff className="w-7 h-7 relative z-10" /> : <Mic className="w-7 h-7 relative z-10" />}
      </button>
    </div>
  );
};
