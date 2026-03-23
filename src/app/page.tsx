import { Hero } from "@/components/Hero";
import Link from "next/link";
import { ArrowRight, Mic2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ProgramCardVertical } from "@/components/ProgramCardVertical";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/utils";

type ProgramWithPresenters = Prisma.ProgramGetPayload<{
  include: { presenters: true }
}>

export const dynamic = 'force-dynamic';

export default async function Home() {
  let programs: ProgramWithPresenters[] = []
  try {
    programs = await prisma.program.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: { presenters: true }
    }).then(res => res.slice(0, 4))
  } catch (err) {
    console.error('DB error on home fetch', err)
    programs = []
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Redesigned Premium Hero */}
      <Hero />

      {/* Editorial Highlights Section */}
      <Section variant="light" className="border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="inline-block bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 rounded-full">
              What&apos;s Trending
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-black leading-none">
              On The <span className="text-brand-green italic">Air.</span>
            </h2>
            <div className="w-12 h-1 bg-brand-yellow rounded-full"></div>
          </div>
          <Link href="/programs" className="flex items-center text-brand-black font-bold uppercase text-xs tracking-widest group border-b-2 border-brand-yellow pb-2 hover:border-brand-green transition-all">
            Full Broadcast Schedule <ArrowRight className="ml-3 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((prog) => (
            <ProgramCardVertical
              key={prog.id}
              title={prog.title}
              description={prog.description}
              startTime={prog.startTime}
              endTime={prog.endTime}
              days={prog.days}
              imageUrl={prog.imageUrl}
              presenters={prog.presenters}
            />
          ))}

          {programs.length === 0 && (
            <div className="col-span-full text-center py-24 bg-surface-card rounded-2xl border border-dashed border-brand-green/20">
              <p className="text-brand-green/40 font-bold uppercase tracking-[0.2em]">Schedule Coming Soon</p>
            </div>
          )}
        </div>
      </Section>

      {/* Mission / Identity Section */}
      <Section variant="dark" className="text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="relative inline-block">
            <Mic2 className="h-20 w-20 text-brand-yellow/80 mx-auto mb-4 opacity-80" />
            <div className="absolute inset-0 bg-brand-yellow/20 blur-3xl rounded-full"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif leading-tight">
            Affirmative Role in <br /><span className="text-brand-yellow italic">Kenyan Society</span>
          </h2>

          <p className="text-2xl md:text-3xl text-white/70 font-light leading-relaxed font-serif italic max-w-2xl mx-auto">
            &quot;We always produce veracious content through our super talented staff.&quot;
          </p>

          <div className="grid md:grid-cols-3 gap-12 text-left pt-16 border-t border-white/10">
            {[
              { title: "News", desc: "Accurate, timely, and relevant local and national news coverage.", color: "text-brand-yellow" },
              { title: "Spirit", desc: "Spiritual nourishment through gospel music and sermons.", color: "text-brand-yellow" },
              { title: "Society", desc: "Human interest discussions that matter to the community.", color: "text-brand-yellow" }
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <h4 className={cn("font-bold uppercase tracking-widest mb-3 transition-colors", item.color)}>{item.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

    </div>
  );
}
