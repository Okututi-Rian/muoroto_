import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Presenter {
    id: string;
    name: string;
}

interface ProgramCardProps {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    days: string[];
    imageUrl?: string | null;
    presenters?: Presenter[];
}

export function ProgramCardVertical({
    title,
    startTime,
    endTime,
    imageUrl,
    presenters = []
}: ProgramCardProps) {
    return (
        <Card className="group overflow-hidden border-0 bg-transparent shadow-none transition-all duration-500 hover:-translate-y-2">
            <CardContent className="p-0 space-y-5">
                {/* Editorial Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/50">
                    <Image
                        src={imageUrl || "/ProgramPlaceholder.png"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Time Badge */}
                    <div className="absolute bottom-4 left-4">
                        <Badge variant="brand" className="font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-lg">
                            <Clock className="mr-1.5 h-3 w-3" />
                            {startTime} - {endTime}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3 px-2">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-0.5 bg-brand-yellow rounded-full group-hover:w-12 transition-all duration-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">On Air</span>
                    </div>

                    <h3 className="text-2xl font-serif text-brand-black leading-tight group-hover:text-brand-green transition-colors">
                        {title}
                    </h3>

                    {presenters.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <Users className="h-3 w-3 text-brand-yellow" />
                            <span>{presenters.map(p => p.name).join(" & ")}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
