"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, Users, Radio, Newspaper, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Presenters', href: '/admin/presenters', icon: Users },
        { label: 'Programs', href: '/admin/programs', icon: Radio },
        { label: 'News', href: '/admin/news', icon: Newspaper },
        { label: 'Content', href: '/admin/content', icon: FileText, border: true },
    ];

    return (
        <nav className="bg-brand-black text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4 md:gap-8">
                <span className="font-black text-lg md:text-xl tracking-tighter text-brand-yellow">MUOROTO CMS</span>
                
                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2",
                                pathname === item.href 
                                    ? "bg-brand-green text-white" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5",
                                item.border && "ml-4 border-l border-white/10 pl-4 rounded-l-none"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                    <ExternalLink className="h-3 w-3" />
                    View Site
                </Link>

                {/* Mobile Nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] bg-brand-black border-r-brand-green/20 p-0 text-white">
                        <div className="p-8 space-y-8">
                            <SheetTitle className="text-brand-yellow font-black text-2xl tracking-tighter border-b border-white/5 pb-6">
                                CMS PANEL
                            </SheetTitle>
                            
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl font-bold text-lg transition-all",
                                            pathname === item.href
                                                ? "bg-brand-green text-white shadow-lg"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="pt-8 mt-8 border-t border-white/5">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-4 p-4 text-gray-500 font-bold hover:text-white"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                        Back to Website
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
