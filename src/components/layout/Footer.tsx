import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, Radio } from 'lucide-react';
import { Container } from './Section';

export function Footer() {
    const frequencies = [
        { region: "Nairobi", freq: "98.1 FM" },
        { region: "Nakuru", freq: "107.8 FM" },
        { region: "Meru", freq: "99.1 FM" },
        { region: "Mt. Kenya", freq: "94.6 FM" },
    ];

    return (
        <footer className="bg-surface-dark text-white/50 relative overflow-hidden noise-grain border-t border-white/5">
            {/* Background branding */}
            <div className="absolute bottom-0 right-0 text-[15rem] font-black text-white/[0.02] leading-none select-none pointer-events-none translate-y-1/2 translate-x-1/4 uppercase tracking-tighter">
                Muoroto
            </div>

            <Container className="py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">

                    {/* Brand & Mission */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-brand-green rounded-lg">
                                    <Radio className="h-6 w-6 text-brand-yellow" />
                                </div>
                                 <h3 className="text-3xl font-serif text-white tracking-tighter">Muoroto <span className="text-brand-yellow font-sans font-black ml-1">FM.</span></h3>
                            </div>
                            <p className="text-brand-green font-bold uppercase tracking-[0.4em] text-[10px]">Mugambo Wa Ma</p>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs font-medium">
                            Nairobi&apos;s truthful voice in broadcasting. Delivering gospel, news, and community empowerment with cultural integrity and excellence.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "https://www.facebook.com/share/1Cs91tmFJS/", bg: "hover:bg-[#1877F2]" },
                                { Icon: Twitter, href: "https://x.com/MuorotoFM", bg: "hover:bg-black" },
                                { Icon: Instagram, href: "https://instagram.com/MuorotoFM", bg: "hover:bg-[#E4405F]" },
                                { Icon: Youtube, href: "https://youtube.com/@muoroto_fm", bg: "hover:bg-[#FF0000]" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 ${social.bg} hover:text-white hover:border-transparent transition-all duration-300`}
                                >
                                    <social.Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Frequencies */}
                    <div className="space-y-8">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-brand-yellow rounded-full"></span>
                            Radio Frequencies
                        </h4>
                        <ul className="space-y-4">
                            {frequencies.map((f, i) => (
                                <li key={i} className="group cursor-default">
                                    <span className="text-xs uppercase font-bold tracking-widest block text-white/30 group-hover:text-brand-yellow transition-colors">{f.region}</span>
                                    <span className="text-lg font-serif text-white/70 group-hover:text-white transition-colors">{f.freq}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-brand-yellow rounded-full"></span>
                            Explore
                        </h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { label: 'Broadcast Schedule', href: '/programs' },
                                { label: 'Radio Presenters', href: '/presenters' },
                                { label: 'Our Mission', href: '/about' },
                                { label: 'Get In Touch', href: '/contact' }
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="text-white/60 hover:text-brand-yellow transition-all flex items-center gap-2 group font-medium"
                                >
                                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-8">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-brand-yellow rounded-full"></span>
                            Contact
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <MapPin className="h-4 w-4 text-brand-green" />
                                </div>
                                <div>
                                    <span className="text-xs text-white block">Muoroto Center</span>
                                    <span className="text-xs text-white/40">Nairobi, Kenya</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <Phone className="h-4 w-4 text-brand-green" />
                                </div>
                                <div className="flex flex-col gap-1 text-xs text-white/70">
                                    <a href="tel:0719303030" className="hover:text-brand-yellow transition-colors">0719 30 30 30</a>
                                    <a href="tel:+254703773524" className="hover:text-brand-yellow transition-colors">+254 703 773 524</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <Mail className="h-4 w-4 text-brand-green" />
                                </div>
                                <a href="mailto:muorototv@gmail.com" className="text-xs text-white/70 hover:text-brand-yellow transition-colors">muorototv@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 relative z-10">
                    <div>© {new Date().getFullYear()} Muoroto FM. All Rights Reserved.</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

// Add ArrowRight since I used it but forgot to import initially
import { ArrowRight } from "lucide-react";
