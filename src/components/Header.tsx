import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';

export function Header() {
  const navigate = useNavigate();
  const user = storage.getUser();

  const handleLogout = () => {
    storage.clearUser();
    navigate('/login');
  };

  return (
    <header className="glass-effect sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">SafeAlert</h1>
            <p className="text-xs text-muted-foreground">Emergency System</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="glass" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
