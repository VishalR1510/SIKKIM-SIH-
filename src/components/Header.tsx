import React from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

const Header: React.FC = () => {
  const { state, setCurrentView, adminLogout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', view: 'landing' as const },
    { label: 'Experiences', view: 'experiences' as const },
    { label: 'Tourism', view: 'tourism' as const },
    { label: 'Community', view: 'community' as const },
    { label: 'Digital Archive', view: 'archive' as const },
    { label: 'Bookings', view: 'bookings' as const }
  ];

  const aboutDropdownItems = [
    { label: 'Districts in Sikkim', view: 'about-sikkim' as const },
    { label: 'Foods', view: 'foods' as const },
    { label: 'Dance', view: 'dance' as const },
    { label: 'Jewellery', view: 'jewellery' as const },
    { label: 'Languages', view: 'languages' as const },
    { label: 'Instruments', view: 'instruments' as const },
  ];

  const handleAdminAction = () => {
    if (state.isAdminLoggedIn) {
      if (state.currentView === 'admin-dashboard') {
        adminLogout();
      } else {
        setCurrentView('admin-dashboard');
      }
    } else {
      setCurrentView('admin-login');
    }
  };

  const getAdminButtonText = () => {
    if (state.isAdminLoggedIn) {
      return state.currentView === 'admin-dashboard' ? 'Logout' : 'Admin Dashboard';
    }
    return 'Admin Login';
  };

  const isAboutSectionActive = aboutDropdownItems.some(item => state.currentView === item.view);

  // Get the current About section label
  const getCurrentAboutLabel = () => {
    const currentItem = aboutDropdownItems.find(item => state.currentView === item.view);
    return currentItem ? currentItem.label : 'About';
  };

  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo Left */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <div className="relative">
              <img 
                src="/monastery360-logo.jpeg" 
                alt="Monastery360 Logo"
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  console.log('Logo failed to load, falling back to Logo.png');
                  e.currentTarget.src = '/Logo.png';
                }}
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-widest drop-shadow">MONASTERY360</h1>
              <p className="text-xs text-monastery-gold/80">Government of Sikkim</p>
            </div>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mx-auto">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`px-4 py-1 text-base font-semibold rounded-full transition-all duration-200 focus:outline-none
                  ${state.currentView === item.view
                    ? 'bg-gradient-to-r from-monastery-gold/70 via-monastery-gold/40 to-monastery-gold/70 text-monastery-gold shadow-lg scale-105'
                    : 'text-white/80 hover:shadow-[0_0_12px_2px_rgba(212,175,55,0.3)] hover:bg-monastery-gold/10 hover:text-monastery-gold'}
                `}
              >
                {item.label}
              </button>
            ))}
            
            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <button
                className={`px-4 py-1 text-base font-semibold rounded-full transition-all duration-200 focus:outline-none flex items-center gap-1
                  ${isAboutSectionActive
                    ? 'bg-gradient-to-r from-monastery-gold/70 via-monastery-gold/40 to-monastery-gold/70 text-monastery-gold shadow-lg scale-105'
                    : 'text-white/80 hover:shadow-[0_0_12px_2px_rgba(212,175,55,0.3)] hover:bg-monastery-gold/10 hover:text-monastery-gold'}
                `}
              >
                {getCurrentAboutLabel()}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl py-2 z-50"
                     style={{ marginTop: '0px' }}>
                  {/* Invisible bridge to prevent gap */}
                  <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                  
                  {aboutDropdownItems.map((item) => (
                    <button
                      key={item.view + item.label}
                      onClick={() => setCurrentView(item.view)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-200
                        ${state.currentView === item.view
                          ? 'text-monastery-gold bg-monastery-gold/10'
                          : 'text-white/80 hover:text-monastery-gold hover:bg-monastery-gold/5'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAdminAction}
              variant={state.isAdminLoggedIn ? "outline" : "default"}
              size="sm"
              className="ml-4 bg-monastery-gold text-monastery-gold-foreground font-semibold shadow hover:opacity-90"
            >
              {getAdminButtonText()}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 absolute right-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors py-2 ${
                    state.currentView === item.view
                      ? 'text-monastery-gold'
                      : 'text-muted-foreground hover:text-monastery-gold'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile About Section */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-monastery-gold/80 uppercase tracking-wide">
                  About
                </div>
                {aboutDropdownItems.map((item) => (
                  <button
                    key={item.view + item.label}
                    onClick={() => {
                      setCurrentView(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm font-medium transition-colors py-1 pl-4 ${
                      state.currentView === item.view
                        ? 'text-monastery-gold'
                        : 'text-muted-foreground hover:text-monastery-gold'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={() => {
                  handleAdminAction();
                  setIsMobileMenuOpen(false);
                }}
                variant={state.isAdminLoggedIn ? "outline" : "default"}
                size="sm"
                className="mt-3 self-start"
              >
                {getAdminButtonText()}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;