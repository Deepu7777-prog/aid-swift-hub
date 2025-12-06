import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Menu, 
  X, 
  AlertTriangle, 
  Phone, 
  Shield, 
  Trophy, 
  LogIn, 
  LogOut,
  Siren
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = storage.getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    storage.clearUser();
    setMenuOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: AlertTriangle, label: 'Report Accident', path: '/', action: 'report' },
    { icon: Phone, label: 'Contact Ambulance', path: '/', action: 'ambulance' },
    { icon: Shield, label: 'Contact Police', path: '/', action: 'police' },
    { icon: Trophy, label: 'Rewards Dashboard', path: '/dashboard' },
    { icon: user ? LogOut : LogIn, label: user ? 'Logout' : 'Login', path: '/login', action: user ? 'logout' : undefined },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setMenuOpen(false);
    
    if (item.action === 'logout') {
      handleLogout();
      return;
    }
    
    if (item.action === 'ambulance') {
      window.location.href = 'tel:108';
      return;
    }
    
    if (item.action === 'police') {
      window.location.href = 'tel:100';
      return;
    }
    
    navigate(item.path);
  };

  return (
    <>
      <header className="glass-effect sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Home Button */}
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/">
              <Home className="w-5 h-5" />
            </Link>
          </Button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-primary" />
            <h1 className="text-base font-bold text-foreground">
              Accident Emergency System
            </h1>
          </div>

          {/* Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMenuOpen(true)}
            className="shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-72 glass-effect z-50 transform transition-transform duration-300 ease-in-out ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="font-bold text-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path && !item.action;
            
            return (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{user.name[0]}</span>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
