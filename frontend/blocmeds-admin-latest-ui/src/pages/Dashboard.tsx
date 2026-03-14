import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Activity, MapPin, Trophy, TrendingUp, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Batch, ScanRecord } from '@/lib/mockData';

const Dashboard = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState({
    verified: 0,
    pending: 0,
    flagged: 0,
    totalScans: 0
  });

  useEffect(() => {
    const batchesData = JSON.parse(localStorage.getItem('batches') || '[]');
    const scansData = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    
    setBatches(batchesData);
    setScans(scansData);
    
    setStats({
      verified: batchesData.filter((b: Batch) => b.status === 'verified').length,
      pending: batchesData.filter((b: Batch) => b.status === 'pending').length,
      flagged: batchesData.filter((b: Batch) => b.status === 'flagged').length,
      totalScans: scansData.length
    });
  }, []);

  const chartData = [
    { name: 'Verified', value: stats.verified, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Flagged', value: stats.flagged, color: '#ef4444' }
  ];

  const recentActivity = scans
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your pharmaceutical tracking summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Package, label: 'Verified Batches', value: stats.verified, color: 'text-green-500' },
          { icon: Activity, label: 'Total Scans', value: stats.totalScans, color: 'text-blue-500' },
          { icon: Clock, label: 'Pending Review', value: stats.pending, color: 'text-orange-500' },
          { icon: Trophy, label: 'Flagged Items', value: stats.flagged, color: 'text-red-500' }
        ].map((stat, idx) => (
          <Card key={idx} className="glass-effect border-none shadow-glass hover:shadow-hover transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl gradient-primary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <Card className="glass-effect border-none shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Batch Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect border-none shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Batch {activity.batchId} scanned</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {activity.isAnomaly && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      Anomaly
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 rounded-xl" asChild>
              <Link to="/batches">
                <div className="text-center w-full">
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="block font-medium">Add New Batch</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 rounded-xl" asChild>
              <Link to="/analytics">
                <div className="text-center w-full">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="block font-medium">View Analytics</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 rounded-xl" asChild>
              <Link to="/reports">
                <div className="text-center w-full">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <span className="block font-medium">Generate Report</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
