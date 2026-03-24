import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { Clock } from "lucide-react";
import { ProgramCard } from "@/components/ProgramCard";
import { Section } from "@/components/layout/Section";

type ProgramWithPresenters = Prisma.ProgramGetPayload<{
    include: { presenters: true }
}>

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Program Schedule",
    description: "Weekly broadcast schedule for Muoroto FM.",
};

export default async function ProgramsPage() {
    let programs: ProgramWithPresenters[] = []
    try {
        programs = await prisma.program.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { order: 'asc' },
            include: { presenters: true }
        });
    } catch (err) {
        console.error('DB error on programs fetch', err)
        programs = []
    }

    return (
        <div className="min-h-screen">
            {/* Premium Header Section */}
            <Section variant="dark" className="pt-24 pb-20 overflow-hidden">
                <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-green/20 border border-brand-green/30 text-brand-yellow font-black text-[10px] uppercase tracking-[0.3em] mb-8 animate-fade-in">
                        98.1 FM • Nairobi, Kenya
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85] mb-8 animate-fade-up">
                        THE <br />
                        <span className="text-brand-yellow pr-4">SCHEDULE.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 leading-relaxed border-l-4 border-brand-yellow pl-8 py-2 animate-fade-up delay-150">
                        Experience the spirit of Gikuyu culture through our carefully curated broadcast lineup.
                        Informed, inspired, and always connected to the truth.
                    </p>
                </div>

                {/* Decorative ghost text */}
                <div className="absolute top-1/2 right-0 text-[20rem] font-black text-white/[0.02] leading-none select-none pointer-events-none -translate-y-1/2 translate-x-1/3 uppercase tracking-tighter">
                    Audio
                </div>
            </Section>

            {/* Program List Section */}
            <Section variant="light" className="py-24">
                <div className="max-w-5xl mx-auto space-y-16">
                    {programs.map((prog, idx) => (
                        <div key={prog.id} className="animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <ProgramCard
                                title={prog.title}
                                description={prog.description}
                                startTime={prog.startTime}
                                endTime={prog.endTime}
                                days={prog.days}
                                imageUrl={prog.imageUrl}
                                presenters={prog.presenters}
                            />
                        </div>
                    ))}

                    {programs.length === 0 && (
                        <div className="text-center py-32 rounded-[2rem] border-2 border-dashed border-brand-green/20 bg-surface-card">
                            <div className="text-brand-green mb-6 flex justify-center">
                                <Clock className="h-16 w-16 opacity-20" />
                            </div>
                            <p className="text-brand-green/40 text-lg font-black uppercase tracking-[0.4em]">Schedule Being Updated</p>
                            <p className="text-gray-400 text-sm mt-4 font-medium">Check back soon for the latest lineup</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
