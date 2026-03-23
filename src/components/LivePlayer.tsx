"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2, Volume2, VolumeX, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./layout/Section";

export function LivePlayer() {
    const { isPlaying, isLoading, isMuted, togglePlay, toggleMute } = usePlayer();

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] bg-surface-dark border-t-2 border-brand-yellow/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 noise-grain">
            <Container className="h-20 flex items-center justify-between gap-4">

                {/* Left: Station Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="bg-brand-green p-2 rounded-lg">
                        <Radio className={cn("h-6 w-6 text-brand-yellow", isPlaying && "animate-pulse")} />
                    </div>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2">
                            <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.3em]">Live Now</span>
                            {isPlaying && <span className="flex h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>}
                        </div>
                        <h4 className="text-white font-bold text-sm truncate max-w-[150px]">Muoroto FM Online</h4>
                    </div>
                </div>

                {/* Center: Waveform (Pure CSS) */}
                <div className="flex-1 flex justify-center items-center h-full px-4 overflow-hidden">
                    <div className="flex gap-1 items-end h-8">
                        {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((v, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 bg-brand-yellow/40 rounded-full transition-all duration-500",
                                    isPlaying ? "animate-wave" : "h-1 opacity-20"
                                )}
                                style={{
                                    animationDelay: `${i * 0.05}s`,
                                    animationDuration: `${0.8 + (i % 4) * 0.2}s`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-2 md:gap-6 min-w-[200px] justify-end">
                    {/* Volume */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-white/60 hover:text-brand-yellow hover:bg-white/5 transition-colors"
                    >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>

                    {/* Play/Pause Main */}
                    <Button
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause Live Stream" : "Play Live Stream"}
                        className={cn(
                            "h-14 w-14 rounded-full p-0 shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 border-white/5",
                            isPlaying ? "bg-white text-brand-green" : "bg-brand-yellow text-brand-green hover:bg-brand-yellow-dark"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                        ) : (
                            <Play className="h-6 w-6 fill-current ml-1" />
                        )}
                    </Button>

                    {isLoading && (
                        <div className="absolute -top-8 right-8 bg-brand-green text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce shadow-xl border border-brand-yellow/20">
                            Connecting...
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
