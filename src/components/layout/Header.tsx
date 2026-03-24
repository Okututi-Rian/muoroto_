"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Play, Loader2, Radio } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { Container } from './Section';

const ListenButton = ({ mobile = false }: { mobile?: boolean }) => {
    const { isPlaying, isLoading, togglePlay } = usePlayer();

    if (mobile) {
        return (
            <Button
                onClick={togglePlay}
                className="bg-brand-yellow text-brand-green w-full mt-8 font-bold uppercase h-14 text-lg hover:bg-brand-yellow-dark rounded-full shadow-lg transition-transform active:scale-95"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                    <div className="flex items-center gap-2">
                        <Radio className="h-5 w-5 text-brand-green animate-pulse" />
                        Stop
                    </div>
                ) : (
                    <Play className="mr-2 h-5 w-5 fill-current" />
                )}
                {isLoading ? 'Connecting...' : isPlaying ? '' : 'Listen Live'}
            </Button>
        );
    }

    return (
        <Button
            onClick={togglePlay}
            className={cn(
                "font-black uppercase tracking-widest ml-4 shadow-xl rounded-full h-12 px-8 transition-all duration-500 scale-100 hover:scale-105 active:scale-95",
                isPlaying
                    ? 'bg-brand-green text-white hover:bg-brand-green-dark'
                    : 'bg-brand-yellow hover:bg-brand-yellow-dark text-brand-green'
            )}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isPlaying ? (
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
                    </span>
                    Stop
                </div>
            ) : (
                <Play className="mr-2 h-4 w-4 fill-current" />
            )}
            {isLoading ? '...' : isPlaying ? '' : 'Listen Live'}
        </Button>
    );
};

export function Header() {
    const { isPlaying } = usePlayer();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Programs', href: '/programs' },
        { label: 'Presenters', href: '/presenters' },
        { label: 'News', href: '/news' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];


    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-500 border-b",
            isScrolled
                ? "bg-white/90 backdrop-blur-md h-20 border-border shadow-sm"
                : "bg-white h-24 border-transparent"
        )}>
            <Container className="h-full flex items-center justify-between">
                {/* Official Logo */}
                <Link href="/" className="flex items-center group gap-3">
                    <div className="relative">
                        <Image
                            src="/MuorotoLogo.png"
                            alt="Muoroto FM"
                            width={200}
                            height={60}
                            className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                        {isPlaying && (
                            <div className="absolute -top-1 -right-4">
                                <Radio className="h-4 w-4 text-brand-yellow animate-pulse" />
                            </div>
                        )}
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navItems.map((item, idx) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-bold text-brand-black hover:text-brand-green uppercase tracking-widest transition-all relative group py-2"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {item.label}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-yellow scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ))}
                    <ListenButton />
                </nav>

                {/* Mobile Nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="lg:hidden" size="icon">
                            <Menu className="h-8 w-8 text-brand-black" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] border-l-0 bg-brand-green text-white p-0 overflow-hidden">
                        <div className="p-8 h-full flex flex-col noise-grain">
                            <SheetTitle className="text-left font-serif text-3xl text-brand-yellow mb-10 border-b border-white/10 pb-6">
                                Menu
                            </SheetTitle>
                            <nav className="flex flex-col gap-4">
                                {navItems.map((item, idx) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-2xl font-bold hover:text-brand-yellow transition-colors uppercase tracking-tight flex items-center gap-4 group"
                                    >
                                        <span className="text-brand-yellow/30 text-xs font-mono">0{idx + 1}</span>
                                        {item.label}
                                    </Link>
                                ))}
                                <ListenButton mobile />
                            </nav>

                            <div className="mt-auto pt-10 border-t border-white/10 text-brand-yellow/50 text-[10px] uppercase tracking-[0.3em] font-bold">
                                Mugambo Wa Ma
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </Container>
        </header>
    );
}
