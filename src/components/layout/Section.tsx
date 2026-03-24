import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "light" | "dark" | "green" | "card";
    container?: boolean;
}

export function Section({
    children,
    variant = "light",
    container = true,
    className,
    ...props
}: SectionProps) {
    const variants = {
        light: "bg-white",
        dark: "bg-surface-dark text-white noise-grain",
        green: "bg-brand-green text-white",
        card: "bg-surface-card",
    };

    return (
        <section
            className={cn("py-12 md:py-24 relative overflow-hidden", variants[variant], className)}
            {...props}
        >
            {container ? <Container>{children}</Container> : children}
        </section>
    );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("max-w-7xl mx-auto px-4 md:px-8 relative z-10", className)}>
            {children}
        </div>
    );
}
