import { ContactForm } from "@/components/ContactForm";
import { Metadata } from "next";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from 'next/link';
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Muoroto FM.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section variant="dark" className="pt-32 pb-24 border-b border-white/5 overflow-hidden text-center">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in">
                    <div className="inline-block bg-brand-green/20 text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full border border-brand-green/30">
                        Get In Touch
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-none">
                        LET&apos;S <span className="text-brand-green pr-4">TALK.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-serif">
                        Whether it&apos;s a song request, a testimony, or a business inquiry, we&apos;re here to listen and respond.
                    </p>
                </div>

                {/* Background ghost text */}
                <div className="absolute bottom-0 right-0 text-[20rem] font-black text-white/[0.01] leading-none select-none pointer-events-none translate-y-1/2 translate-x-1/4 uppercase tracking-tighter">
                    Contact
                </div>
            </Section>

            {/* Main Content */}
            <Section variant="light" className="py-24">
                <div className="grid lg:grid-cols-2 gap-20 items-start">

                    {/* Contact Info Column */}
                    <div className="space-y-16">
                        <div className="space-y-12">
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-1 bg-brand-yellow rounded-full"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Station Details</span>
                            </div>

                            <div className="grid gap-12">
                                {/* Address */}
                                <div className="group">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="w-14 h-14 bg-brand-green/5 flex items-center justify-center rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                                            <MapPin className="h-6 w-6 text-brand-green group-hover:text-brand-yellow transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight">Broadcast Center</h3>
                                    </div>
                                    <p className="text-lg text-gray-500 font-medium pl-20 leading-relaxed">
                                        Muoroto Center, <br />
                                        Nairobi County, Kenya
                                    </p>
                                </div>

                                {/* Phone */}
                                <div className="group">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="w-14 h-14 bg-brand-green/5 flex items-center justify-center rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                                            <Phone className="h-6 w-6 text-brand-green group-hover:text-brand-yellow transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight">Call / WhatsApp</h3>
                                    </div>
                                    <div className="pl-20 space-y-2">
                                        <a href="tel:0719303030" className="block text-2xl font-serif text-brand-black hover:text-brand-green transition-colors">0719 30 30 30</a>
                                        <a href="tel:+254703773524" className="block text-2xl font-serif text-brand-black hover:text-brand-green transition-colors">+254 703 773 524</a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="group">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="w-14 h-14 bg-brand-green/5 flex items-center justify-center rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                                            <Mail className="h-6 w-6 text-brand-green group-hover:text-brand-yellow transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight">Direct Mail</h3>
                                    </div>
                                    <div className="pl-20">
                                        <a href="mailto:muorototv@gmail.com" className="text-2xl font-serif text-brand-black hover:text-brand-green transition-colors">
                                            muorototv@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Presence */}
                        <div className="pt-16 border-t border-gray-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green mb-8">Follow Our Voice</h3>
                            <div className="flex gap-4">
                                {[
                                    { href: "https://www.facebook.com/share/1Cs91tmFJS/", icon: Facebook, color: "hover:bg-[#1877F2]" },
                                    { href: "https://x.com/MuorotoFM", icon: Twitter, color: "hover:bg-black" },
                                    { href: "https://instagram.com/MuorotoFM", icon: Instagram, color: "hover:bg-[#E4405F]" },
                                    { href: "https://youtube.com/@muoroto_fm", icon: Youtube, color: "hover:bg-[#FF0000]" }
                                ].map((social, i) => (
                                    <Link
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-16 h-16 bg-white border border-gray-100 shadow-lg flex items-center justify-center rounded-2xl text-gray-400 ${social.color} hover:text-white hover:border-transparent transition-all duration-500`}
                                    >
                                        <social.icon className="h-6 w-6" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:sticky lg:top-32">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-brand-green/5 rounded-[3rem] blur-2xl group-hover:bg-brand-green/10 transition-all duration-500"></div>
                            <div className="relative z-10">
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                </div>
            </Section>
        </div>
    );
}
