"use client";

const VIDEO_ID = "yj0vx4sypr";

export default function AdvertPage() {
    return (
        <div className="min-h-screen p-4">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black aspect-video">
                <iframe
                    src={`https://fast.wistia.com/embed/iframe/${VIDEO_ID}?videoFoam=true`}
                    allow="autoplay; fullscreen; playback; controls"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                />
            </div>
        </div>
    );
}