'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  Users, 
  Database, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle 
} from 'lucide-react';

export default function DashboardPage() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleTestNotifications = () => {
    showSuccess('Success!', 'This is a success notification');
    setTimeout(() => showError('Error!', 'This is an error notification'), 1000);
    setTimeout(() => showWarning('Warning!', 'This is a warning notification'), 2000);
    setTimeout(() => showInfo('Info!', 'This is an info notification'), 3000);
  };

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'API Requests',
      value: '45,231',
      change: '+8%',
      icon: Database,
      color: 'text-green-500',
    },
    {
      title: 'Security Events',
      value: '12',
      change: '-4%',
      icon: Shield,
      color: 'text-yellow-500',
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
      color: 'text-emerald-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your application dashboard
            </p>
          </div>
          <Button onClick={handleTestNotifications}>
            Test Notifications
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest events and system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'User login', user: 'john@example.com', time: '2 minutes ago' },
                  { action: 'API request', user: 'System', time: '5 minutes ago' },
                  { action: 'Database backup', user: 'System', time: '1 hour ago' },
                  { action: 'User registration', user: 'jane@example.com', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                Current system health and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">Warning</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                View API Logs
              </Button>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
              <Button variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                System Health
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
