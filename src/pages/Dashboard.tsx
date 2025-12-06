import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  FileText, 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock,
  ArrowLeft,
  Medal,
  TrendingUp
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { storage, type AccidentReport, type UserStats, type User } from '@/lib/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [reports, setReports] = useState<AccidentReport[]>([]);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setStats(storage.getStats());
    setReports(storage.getReports());
  }, [navigate]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Guardian Hero': return 'text-accent';
      case 'Safety Champion': return 'text-primary';
      case 'First Responder': return 'text-secondary';
      case 'Active Reporter': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-success/20 text-success';
      case 'verified': return 'bg-accent/20 text-accent';
      default: return 'bg-secondary/20 text-secondary';
    }
  };

  if (!user || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-emergency-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-4 h-8">
          <Link to="/" className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        {/* Welcome Section */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-xl font-black text-foreground mb-1">
            Welcome, {user.name}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your emergency response dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-effect rounded-xl p-4 animate-fade-in flex flex-col items-center justify-center text-center" style={{ animationDelay: '0.1s' }}>
            <div className="p-2 rounded-lg bg-primary/20 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Reward Points</span>
            <div className="text-2xl font-black text-foreground">{stats.rewardPoints}</div>
          </div>

          <div className="glass-effect rounded-xl p-4 animate-fade-in flex flex-col items-center justify-center text-center" style={{ animationDelay: '0.2s' }}>
            <div className="p-2 rounded-lg bg-accent/20 mb-2">
              <Medal className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">Current Rank</span>
            <div className={`text-sm font-bold ${getRankColor(stats.rank)}`}>{stats.rank}</div>
          </div>

          <div className="glass-effect rounded-xl p-4 animate-fade-in flex flex-col items-center justify-center text-center" style={{ animationDelay: '0.3s' }}>
            <div className="p-2 rounded-lg bg-secondary/20 mb-2">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Total Reports</span>
            <div className="text-2xl font-black text-foreground">{stats.totalReports}</div>
          </div>

          <div className="glass-effect rounded-xl p-4 animate-fade-in flex flex-col items-center justify-center text-center" style={{ animationDelay: '0.4s' }}>
            <div className="p-2 rounded-lg bg-success/20 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">Verified</span>
            <div className="text-2xl font-black text-foreground">{stats.verifiedReports}</div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="glass-effect rounded-xl p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-foreground text-sm">Rank Progress</h3>
          </div>
          <div className="space-y-2">
            {['Newcomer', 'Active Reporter', 'First Responder', 'Safety Champion', 'Guardian Hero'].map((rank, index) => {
              const thresholds = [0, 50, 150, 300, 500];
              const isAchieved = stats.rewardPoints >= thresholds[index];
              const isCurrent = stats.rank === rank;
              
              return (
                <div key={rank} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isAchieved ? 'bg-success/20' : 'bg-muted'
                  }`}>
                    {isAchieved ? (
                      <Star className="w-3 h-3 text-success" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${isCurrent ? 'text-primary' : isAchieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {rank}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{thresholds[index]} pts</span>
                  {isCurrent && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Current</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            Recent Reports
          </h3>
          
          {reports.length === 0 ? (
            <div className="glass-effect rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No reports yet</p>
              <p className="text-xs text-muted-foreground">Report an accident to earn points</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="glass-effect rounded-xl p-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {report.type === 'shake-detected' ? 'Auto' : 'Manual'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(report.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-xs text-foreground mb-1 line-clamp-2">{report.description}</p>
                  {report.latitude && report.longitude && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
