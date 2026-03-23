import { Card } from "@/components/ui/card";
import { Clock, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProgramCardProps {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    days: string[];
    imageUrl: string | null;
    presenters: { name: string }[];
}

export function ProgramCard({
    title,
    description,
    startTime,
    endTime,
    days,
    imageUrl,
    presenters,
}: ProgramCardProps) {
    return (
        <Card className="group overflow-hidden border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
            <div className="flex flex-col md:flex-row min-h-[350px]">
                {/* Editorial Image Section */}
                <div className="md:w-[40%] relative min-h-[250px] md:min-h-full overflow-hidden shrink-0">
                    <Image
                        src={imageUrl || "/ProgramPlaceholder.png"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-black/40 via-transparent to-transparent opacity-60"></div>

                    {/* Day Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <Badge variant="brand" className="font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-lg">
                            {days.map(d => d.substring(0, 3)).join(' • ')}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs font-black uppercase tracking-widest">{startTime} - {endTime}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-black/20">Broadcast</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-4xl lg:text-5xl font-serif text-brand-black leading-tight group-hover:text-brand-green transition-colors italic">
                                {title}
                            </h3>
                            <p className="text-base text-gray-500 line-clamp-3 font-medium leading-relaxed max-w-xl">
                                {description}
                            </p>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center border border-brand-yellow/20">
                                    <User className="w-5 h-5 text-brand-green" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-none mb-1">Presented By</div>
                                    <div className="text-sm font-bold text-brand-black">
                                        {presenters.length > 0 ? presenters.map(p => p.name).join(' & ') : 'Station Host'}
                                    </div>
                                </div>
                            </div>

                            <div className="text-brand-green group-hover:translate-x-2 transition-transform duration-300">
                                <ArrowRight className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
