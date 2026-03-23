import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface PresenterCardProps {
    name: string;
    bio?: string;
    imageUrl?: string;
}

export function PresenterCard({ name, bio, imageUrl }: PresenterCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-none bg-transparent text-center group">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-brand-yellow/10 group-hover:border-brand-yellow transition-colors duration-300 bg-gray-100 mb-4">
                {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 font-bold text-4xl bg-gray-50">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <CardContent className="p-0">
                <h3 className="font-bold text-xl text-brand-black group-hover:text-brand-green transition-colors">{name}</h3>
                <p className="text-sm text-brand-green font-medium uppercase tracking-wider mt-1 line-clamp-1">{bio}</p>
            </CardContent>
        </Card>
    );
}
