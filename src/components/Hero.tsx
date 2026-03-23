"use client";

import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Radio } from 'lucide-react';
import Link from 'next/link';
import { Container } from './layout/Section';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';

export function Hero() {
    const { isPlaying, togglePlay, isLoading } = usePlayer();

    // Region Frequencies Data
    const frequencies = [
        { city: "Nairobi", fm: "98.1" },
        { city: "Nakuru", fm: "107.8" },
        { city: "Meru", fm: "99.1" },
        { city: "Mt. Kenya", fm: "94.6" },
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center bg-surface-dark overflow-hidden noise-grain pt-20">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-green/5 skew-x-12 transform origin-bottom translate-x-24 -z-0"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl -z-0"></div>

            <Container className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
                {/* Left: Headline & Content */}
                <div className="space-y-10 relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-yellow font-bold text-xs uppercase tracking-[0.3em] animate-fade-in">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-yellow"></span>
                        </span>
                        98.1 FM • Mugambo Wa Ma
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85] animate-fade-up">
                            MUOROTO <br />
                            <span className="text-brand-yellow italic pr-4">FM.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed italic border-l-4 border-brand-yellow pl-8 py-2 animate-fade-up delay-150">
                            &quot;The Voice of Truth&quot; — Nairobi&apos;s leading gospel for spiritual nourishment and community empowerment.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 animate-fade-up delay-300">
                        <Button
                            size="lg"
                            onClick={togglePlay}
                            className={cn(
                                "h-16 px-10 rounded-full font-bold text-lg transition-all duration-500 shadow-2xl live-pulse",
                                isPlaying
                                    ? "bg-white text-brand-green hover:bg-white/90"
                                    : "bg-brand-yellow text-brand-green hover:bg-brand-yellow-dark"
                            )}
                        >
                            {isLoading ? (
                                <Radio className="mr-3 h-6 w-6 animate-pulse" />
                            ) : isPlaying ? (
                                <span className="flex items-center gap-2">Stop Stream</span>
                            ) : (
                                <Play className="mr-3 h-6 w-6 fill-current" />
                            )}
                            {isLoading ? 'Connecting...' : isPlaying ? '' : 'Listen Live'}
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="h-16 px-10 rounded-full border-2 border-white/20 text-white hover:bg-white hover:text-brand-green font-bold text-lg transition-all"
                        >
                            <Link href="/programs">
                                Schedule <ArrowRight className="ml-3 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Frequency Pills */}
                    <div className="flex flex-wrap gap-3 pt-4 animate-fade-up delay-500">
                        {frequencies.map((f, i) => (
                            <div key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                <span className="text-brand-yellow mr-2">{f.fm}</span> {f.city}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visual "On Air" Card */}
                <div className="relative group lg:block hidden animate-fade-in delay-700">
                    <div className="absolute -inset-4 bg-brand-yellow/10 rounded-[2.5rem] blur-2xl group-hover:bg-brand-yellow/20 transition-all duration-700"></div>
                    <div className="relative bg-brand-green-dark border-4 border-brand-green/30 rounded-[2rem] p-10 overflow-hidden min-h-[400px] flex flex-col justify-between shadow-2xl">
                        <div className="absolute top-0 right-0 p-8">
                            <Radio className="h-12 w-12 text-brand-yellow/20" />
                        </div>

                        <div className="space-y-2">
                            <div className="text-brand-yellow font-black uppercase tracking-[0.4em] text-xs">Currently</div>
                            <h3 className="text-4xl font-serif text-white">Broadcasting <br />Live</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-2 h-16 items-end">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 bg-brand-yellow rounded-full transition-all duration-500",
                                            isPlaying ? "animate-wave" : "h-2 opacity-20"
                                        )}
                                        style={{
                                            animationDelay: `${i * 0.1}s`,
                                            height: !isPlaying ? '8px' : 'auto'
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center">
                                Tuning in from Nairobi, Kenya
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
