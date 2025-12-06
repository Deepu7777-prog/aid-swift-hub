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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-black text-foreground mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Your emergency response dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-effect rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Reward Points</span>
            </div>
            <div className="text-3xl font-black text-foreground">{stats.rewardPoints}</div>
          </div>

          <div className="glass-effect rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-accent/20">
                <Medal className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Current Rank</span>
            </div>
            <div className={`text-lg font-bold ${getRankColor(stats.rank)}`}>{stats.rank}</div>
          </div>

          <div className="glass-effect rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-secondary/20">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Reports</span>
            </div>
            <div className="text-3xl font-black text-foreground">{stats.totalReports}</div>
          </div>

          <div className="glass-effect rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Verified</span>
            </div>
            <div className="text-3xl font-black text-foreground">{stats.verifiedReports}</div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="glass-effect rounded-2xl p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Rank Progress</h3>
          </div>
          <div className="space-y-3">
            {['Newcomer', 'Active Reporter', 'First Responder', 'Safety Champion', 'Guardian Hero'].map((rank, index) => {
              const thresholds = [0, 50, 150, 300, 500];
              const isAchieved = stats.rewardPoints >= thresholds[index];
              const isCurrent = stats.rank === rank;
              
              return (
                <div key={rank} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAchieved ? 'bg-success/20' : 'bg-muted'
                  }`}>
                    {isAchieved ? (
                      <Star className="w-4 h-4 text-success" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : isAchieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {rank}
                    </div>
                    <div className="text-xs text-muted-foreground">{thresholds[index]} points</div>
                  </div>
                  {isCurrent && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Current</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Reports
          </h3>
          
          {reports.length === 0 ? (
            <div className="glass-effect rounded-2xl p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports yet</p>
              <p className="text-sm text-muted-foreground">Report an accident to earn reward points</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="glass-effect rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.type === 'shake-detected' ? 'Auto-detected' : 'Manual report'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(report.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2 line-clamp-2">{report.description}</p>
                  {report.latitude && report.longitude && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
