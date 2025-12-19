
import React, { useState, useRef, useCallback } from 'react';
import { BlockerStatus } from './types';
import FloatingBadge from './components/FloatingBadge';

const App: React.FC = () => {
  const [status, setStatus] = useState<BlockerStatus>(BlockerStatus.INACTIVE);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopBlocking = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setStatus(BlockerStatus.INACTIVE);
  }, []);

  const startBlocking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const gainNode = audioCtx.createGain();
      
      gainNode.gain.value = 0;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      setStatus(BlockerStatus.BLOCKING);
    } catch (err) {
      console.error("Microphone access failed:", err);
      alert("无法开启测试：请在设置中允许麦克风访问权限。");
    }
  };

  const toggleBlocker = () => {
    if (status === BlockerStatus.BLOCKING) {
      stopBlocking();
    } else {
      startBlocking();
    }
  };

  const isBlocking = status === BlockerStatus.BLOCKING;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between p-8 pt-20 pb-12 overflow-hidden">
      <FloatingBadge isActive={isBlocking} />

      {/* Header */}
      <header className="text-center space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isBlocking ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/20'}`} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">System Diagnostic</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white">
          MIC<span className={isBlocking ? 'text-red-600 transition-colors' : 'text-white/20 transition-colors'}>BLOCK</span>
        </h1>
      </header>

      {/* Center Control */}
      <div className="relative flex items-center justify-center w-full max-w-xs aspect-square">
        {/* Decorative Circles */}
        <div className={`absolute inset-0 rounded-full border border-white/5 transition-transform duration-1000 ${isBlocking ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`} />
        <div className={`absolute inset-[-20%] rounded-full bg-red-600/5 blur-[80px] transition-opacity duration-700 ${isBlocking ? 'opacity-100' : 'opacity-0'}`} />
        
        <button
          onClick={toggleBlocker}
          className={`relative z-10 w-56 h-56 rounded-full border-[1px] flex flex-col items-center justify-center gap-4 transition-all duration-500 active:scale-90 ${
            isBlocking 
              ? 'bg-red-600/10 border-red-500/50 shadow-[0_0_60px_rgba(220,38,38,0.2)]' 
              : 'bg-white/[0.02] border-white/10 hover:border-white/20 shadow-xl'
          }`}
        >
          <div className={`text-5xl transition-all duration-700 ${isBlocking ? 'text-red-500 scale-110' : 'text-white/10'}`}>
            <i className={`fas ${isBlocking ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          </div>
          <div className="flex flex-col items-center">
            <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors ${isBlocking ? 'text-red-500' : 'text-white/40'}`}>
              {isBlocking ? 'Blocking' : 'Start Test'}
            </span>
            <span className="text-[9px] font-medium text-white/20 uppercase mt-1">Tap to toggle</span>
          </div>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-sm space-y-6 text-center z-10">
        <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Hardware Port</span>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isBlocking ? 'text-red-500' : 'text-white/40'}`}>
              {isBlocking ? 'Locked' : 'Available'}
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${isBlocking ? 'w-full bg-red-600' : 'w-0 bg-blue-600'}`} 
            />
          </div>
        </div>
        
        <p className="text-[10px] text-white/20 px-4 leading-relaxed uppercase tracking-[0.15em] font-medium">
          启用后将占用麦克风通道。<br/>
          请保持本程序在后台运行进行测试。
        </p>
      </footer>

      <div className="absolute bottom-4 text-[8px] text-white/10 tracking-[1em] font-black">
        DEV-TOOL v1.0.2
      </div>
    </div>
  );
};

export default App;
