"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface PlayerContextType {
    isPlaying: boolean;
    isLoading: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const STREAM_URL = "http://uk4-vn.mixstream.net:8136/;;";

    useEffect(() => {
        // Initialize audio instance
        audioRef.current = new Audio(STREAM_URL);
        audioRef.current.preload = "none";

        const audio = audioRef.current;

        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => {
            setIsLoading(false);
            setIsPlaying(true);
        };
        const handlePause = () => setIsPlaying(false);
        const handleError = (e: Event) => {
            console.error("Audio error:", e);
            setIsLoading(false);
            setIsPlaying(false);
        };

        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("error", handleError);

        return () => {
            audio.pause();
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("error", handleError);
            audioRef.current = null;
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            setIsLoading(true);
            // Re-set src to ensure we connect to the live stream tail and not cached buffer
            audioRef.current.src = STREAM_URL;
            audioRef.current.load();
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                setIsLoading(false);
                setIsPlaying(false);
            });
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
    };

    return (
        <PlayerContext.Provider value={{ isPlaying, isLoading, isMuted, togglePlay, toggleMute }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
}
