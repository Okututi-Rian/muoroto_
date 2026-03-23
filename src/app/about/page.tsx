import { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Radio, Heart, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Muoroto FM's mission and vision.",
};

export default function AboutPage() {
    const pillars = [
        {
            title: "Veracious Content",
            desc: "Truthful, accurate, and reliable information is at the heart of everything we broadcast.",
            icon: Radio,
            id: "01"
        },
        {
            title: "Affirmative Role",
            desc: "We take pride in our role of building and uplifting Kenyan society through positive discourse.",
            icon: Heart,
            id: "02"
        },
        {
            title: "Professional Excellence",
            desc: "Our super-talented staff ensures the highest standards of broadcasting professionalism.",
            icon: Users,
            id: "03"
        }
    ];

    const frequencies = [
        { region: "Nairobi / Kiambu", freq: "98.1 FM" },
        { region: "Nakuru / Laikipia", freq: "107.8 FM" },
        { region: "Meru", freq: "99.1 FM" },
        { region: "Mt. Kenya Region", freq: "94.6 FM" },
        { region: "Kirinyaga / Embu", freq: "99.9 FM" },
    ];

    return (
        <div className="min-h-screen">
            {/* Dark Editorial Header */}
            <Section variant="dark" className="pt-32 pb-24 text-center">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
                    <div className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full border border-brand-yellow/20">
                        The Truthful Voice
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-none">
                        WHO WE <span className="text-brand-green italic pr-4">ARE.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-serif italic text-brand-yellow/80 max-w-2xl mx-auto">
                        &quot;Mugambo Wa Ma&quot; — The Voice of Truth
                    </p>
                </div>

                {/* Background Branding */}
                <div className="absolute top-1/2 left-0 text-[25rem] font-black text-white/[0.015] leading-none select-none pointer-events-none -translate-y-1/2 -translate-x-1/4 uppercase tracking-tighter">
                    Truth
                </div>
            </Section>

            {/* Core Narrative */}
            <Section variant="light" className="py-24">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-brand-yellow rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Establishment</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-brand-black leading-tight">
                            Broadcasting with <span className="text-brand-green italic">Purpose.</span>
                        </h2>
                        <div className="prose prose-xl prose-gray font-medium text-gray-600 leading-relaxed">
                            <p>
                                <strong>Muoroto FM</strong> is a leading National Radio Station based in the heart of Nairobi County, Kenya.
                                We serve as a vital link between traditional Gikuyu culture and modern Kenyan aspirations.
                            </p>
                            <p>
                                Our programming is meticulously crafted to address the diverse interests of our audience,
                                spanning breaking news, deep human-interest discussions, spiritual nourishment, and premium entertainment.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] bg-brand-green rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                            {/* Placeholder for About Image / Branding */}
                            <div className="absolute inset-0 noise-grain opacity-50"></div>
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <Radio className="w-40 h-40 text-brand-yellow opacity-20" />
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-yellow rounded-full -z-10 blur-3xl opacity-20"></div>
                    </div>
                </div>
            </Section>

            {/* Pillars Grid */}
            <Section variant="card" className="py-24 border-y border-border/50">
                <div className="grid md:grid-cols-3 gap-12">
                    {pillars.map((pillar, i) => (
                        <div key={i} className="group p-10 bg-white rounded-[2.5rem] shadow-xl border border-border/5 transition-all duration-500 hover:-translate-y-2">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-brand-green/5 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
                                    <pillar.icon className="h-8 w-8 text-brand-green group-hover:text-brand-yellow transition-colors" />
                                </div>
                                <span className="text-4xl font-serif italic text-brand-black/5 font-black">{pillar.id}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-brand-black mb-4 uppercase tracking-tight group-hover:text-brand-green transition-colors">{pillar.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Frequencies Loop Section */}
            <Section variant="dark" className="py-24 overflow-hidden">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-serif">Reach Across <span className="text-brand-yellow italic">Kenya.</span></h2>
                    <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">Frequency Network</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                    {frequencies.map((f, i) => (
                        <div key={i} className="px-8 py-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:border-brand-yellow transition-colors text-center w-full sm:w-64">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow block mb-2">{f.region}</span>
                            <span className="text-3xl font-serif italic text-white group-hover:text-brand-yellow transition-colors">{f.freq}</span>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
