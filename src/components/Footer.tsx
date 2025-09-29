import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';

const Footer: React.FC = () => {
  const { state, setCurrentView } = useAppContext();

  const navItems = [
    { label: 'Home', view: 'landing' as const },
    { label: 'About', view: 'about-sikkim' as const },
    { label: 'Experiences', view: 'experiences' as const },
    { label: 'Tourism', view: 'tourism' as const },
    { label: 'Community', view: 'community' as const },
    { label: 'Digital Archive', view: 'archive' as const },
    { label: 'Bookings', view: 'bookings' as const }
  ];

  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/70 text-slate-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/monastery360-logo.jpeg"
                alt="Monastery360 Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Logo.png';
                }}
              />
              <div>
                <h2 className="text-lg font-extrabold tracking-widest text-white">MONASTERY360</h2>
                <p className="text-sm text-monastery-gold/80">Government of sikkim</p>
                
              </div>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`text-sm transition-colors hover:text-monastery-gold ${
                    state.currentView === item.view ? 'text-monastery-gold' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Subscribe (right side) */}
          <div className="space-y-3 md:justify-self-end w-full md:w-auto">
            <h3 className="text-sm font-semibold text-white">Subscribe for event updates</h3>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-400"
              />
              <Button className="bg-monastery-gold text-black hover:opacity-90">Subscribe</Button>
            </div>
            <p className="text-xs text-slate-400">
              By subscribing you agree to receive updates about cultural events. Read our
              <span className="px-1 text-monastery-gold/80">Privacy Policy</span>.
            </p>
            <a
              href="https://sikkimtourism.gov.in/Public/Index/Helpline" /* TODO: replace with provided link */
              className="inline-block text-sm text-red-300 hover:text-red-400 underline underline-offset-4"
            >
              Emergency contact
            </a>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {/* Bottom bar */}
        <div className="pt-3 flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Monastery360. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-monastery-gold">Privacy Policy</a>
            <a href="#" className="hover:text-monastery-gold">Terms of Service</a>
            <a href="#" className="hover:text-monastery-gold">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


