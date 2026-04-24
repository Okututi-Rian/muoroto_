import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Advertise with Muoroto FM",
    description: "Advertise with Muoroto FM - Reach thousands of listeners across Kenya.",
};

export default function AdvertLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}