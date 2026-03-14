import { useState } from 'react';
import { User, Moon, Sun, Bell, Shield, Database, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Toast from '@/components/Toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cached data? This will not affect your authentication.')) {
      const auth = sessionStorage.getItem('auth');
      const username = sessionStorage.getItem('username');
      
      localStorage.clear();
      
      // Restore auth
      if (auth) sessionStorage.setItem('auth', auth);
      if (username) sessionStorage.setItem('username', username);
      
      setToast({ message: 'Cache cleared successfully', type: 'success' });
      
      // Re-initialize with fresh mock data
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account and application preferences</p>
      </div>

      {/* Profile */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-hover">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.username}</p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base font-medium">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts about important events</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={handleClearCache}
          >
            Clear Local Cache
          </Button>
          <p className="text-xs text-muted-foreground">
            This will reset all locally stored data including batches and scan history. Your authentication will be preserved.
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full rounded-xl"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass-effect border-none shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Version:</span> 1.0.0</p>
            <p><span className="font-medium">Build:</span> Production</p>
            <p className="text-muted-foreground">© 2024 BlocMeds Admin Portal. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Settings;
