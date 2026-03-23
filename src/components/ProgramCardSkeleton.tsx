import { Card, CardContent } from "@/components/ui/card";

export function ProgramCardSkeleton() {
    return (
        <Card className="group overflow-hidden border-0 bg-transparent shadow-none">
            <CardContent className="p-0 space-y-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-gray-200 animate-pulse"></div>
                <div className="space-y-3 px-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-3/4 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </CardContent>
        </Card>
    );
}
