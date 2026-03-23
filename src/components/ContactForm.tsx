"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleBlur = (field: string, value: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: value.trim() === ""
        }));
    };

    if (isSubmitted) {
        return (
            <Card className="w-full max-w-lg mx-auto border-0 bg-brand-green text-white noise-grain overflow-hidden animate-fade-in shadow-2xl">
                <CardContent className="p-12 text-center space-y-6">
                    <div className="relative inline-block">
                        <CheckCircle2 className="h-20 w-20 text-brand-yellow mx-auto" />
                        <div className="absolute inset-0 bg-brand-yellow/20 blur-2xl rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-serif italic">Message Received!</h3>
                        <p className="text-white/70 font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4 border-white/20 text-white hover:bg-white hover:text-brand-green rounded-full px-8"
                    >
                        Send Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white rounded-[2rem] overflow-hidden">
            <div className="h-2 bg-brand-green w-full"></div>
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-0.5 bg-brand-yellow"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Contact Us</span>
                </div>
                <CardTitle className="text-4xl font-serif text-brand-black">Send a <span className="text-brand-green italic">Message.</span></CardTitle>
                <CardDescription className="text-base font-medium">
                    Have a song request, testimony, or inquiry? We&apos;re listening.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-400">Your Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            onBlur={(e) => handleBlur("name", e.target.value)}
                            className={cn(
                                "h-14 px-6 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg",
                                errors.name && "border-red-500 focus:ring-red-100"
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            className={cn(
                                "h-14 px-6 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg",
                                errors.email && "border-red-500 focus:ring-red-100"
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-gray-400">Message / Request</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Type your message here..."
                            required
                            onBlur={(e) => handleBlur("message", e.target.value)}
                            className={cn(
                                "min-h-[150px] p-6 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg",
                                errors.message && "border-red-500 focus:ring-red-100"
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold h-16 text-lg rounded-full shadow-xl transition-all active:scale-95 group"
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
