import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import Image from "next/image";
import { Mic2, Radio } from "lucide-react";
import { Section } from "@/components/layout/Section";

type PresenterRow = Prisma.PresenterGetPayload<Record<string, never>>

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "On-Air Personalities",
    description: "The voices behind Muoroto FM.",
};

export default async function PresentersPage() {
    let presenters: PresenterRow[] = []
    try {
        presenters = await prisma.presenter.findMany({
            orderBy: [
                { createdAt: 'desc' },
                { id: 'asc' }
            ]
        });
    } catch (err) {
        console.error('DB error on presenters fetch', err)
        presenters = []
    }

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <Section variant="light" className="text-center pt-32">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="relative inline-block">
                        <div className="p-5 rounded-full bg-brand-green/10 mb-2 border border-brand-green/5">
                            <Mic2 className="h-10 w-10 text-brand-green" />
                        </div>
                        <div className="absolute inset-0 bg-brand-green/10 blur-3xl rounded-full -z-10"></div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-block bg-brand-yellow/10 text-brand-green text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full">
                            Meet The Team
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif text-brand-black tracking-tighter leading-none">
                            OUR <span className="text-brand-green">VOICES.</span>
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-serif leading-relaxed">
                        Meet the talented individuals who utilize their gifts to produce veracious content and spiritual nourishment for our community.
                    </p>
                </div>
            </Section>

            {/* Presenters Grid */}
            <Section variant="card" className="py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {presenters.map((pres, idx) => (
                        <div
                            key={pres.id}
                            className="group animate-fade-up"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {/* Portrait Image with Premium Overlay */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-200 shadow-xl border-4 border-white group-hover:border-brand-green/20 transition-all duration-500 group-hover:-translate-y-2">
                                {pres.imageUrl ? (
                                    <Image
                                        src={pres.imageUrl}
                                        alt={pres.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-brand-green/10 font-black text-9xl select-none">
                                        {pres.name.charAt(0)}
                                    </div>
                                )}

                                {/* Hover Info Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                    <p className="text-white/80 text-sm font-medium leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        {pres.bio || "Muoroto FM On-Air Personality bringing you the best in spiritual and society discussions."}
                                    </p>
                                </div>

                                {/* Label for "On Air" - Decorative */}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-brand-yellow p-3 rounded-full shadow-2xl">
                                        <Radio className="h-4 w-4 text-brand-green animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Name & Title */}
                            <div className="mt-8 space-y-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-0.5 bg-brand-yellow rounded-full transition-all duration-500 group-hover:w-12"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Personality</span>
                                </div>
                                <h3 className="text-3xl font-serif text-brand-black tracking-tight group-hover:text-brand-green transition-colors leading-none">
                                    {pres.name}
                                </h3>
                            </div>
                        </div>
                    ))}

                    {presenters.length === 0 && (
                        <div className="col-span-full text-center py-32 rounded-[2rem] border-2 border-dashed border-brand-green/20">
                            <p className="text-brand-green/30 font-bold uppercase tracking-[0.4em]">Meet Our Team Soon</p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
