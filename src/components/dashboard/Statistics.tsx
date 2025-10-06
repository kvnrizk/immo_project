import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI } from '@/services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  Globe,
  Server,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Statistics = () => {
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsAPI.getAnalytics(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch health check
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => analyticsAPI.getHealth(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const isLoading = analyticsLoading || healthLoading;

  // Format uptime
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Format bytes to MB/GB
  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Statistiques & Performances</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Vue d'ensemble des performances du site et des analyses de trafic
        </p>
      </div>

      {/* Server Health Status */}
      {health && (
        <Card className={health.status === 'healthy' ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                <CardTitle>État du serveur</CardTitle>
              </div>
              <Badge variant={health.status === 'healthy' ? 'default' : 'destructive'}>
                {health.status === 'healthy' ? 'En ligne' : 'Hors ligne'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Status */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>Base de données</span>
                </div>
                <Badge variant={health.database === 'connected' ? 'default' : 'destructive'}>
                  {health.database === 'connected' ? 'Connectée' : 'Déconnectée'}
                </Badge>
              </div>

              {/* Uptime */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Temps de disponibilité</span>
                </div>
                <p className="text-2xl font-bold">{formatUptime(health.uptime)}</p>
              </div>

              {/* Memory Usage */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HardDrive className="w-4 h-4" />
                  <span>Mémoire</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{health.memory.percentage.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(health.memory.used)} / {formatBytes(health.memory.total)}
                  </p>
                </div>
              </div>

              {/* CPU Usage */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="w-4 h-4" />
                  <span>CPU</span>
                </div>
                <p className="text-2xl font-bold">{health.cpu.usage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visitor Statistics Cards */}
      {analytics && (
        <>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium">Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{analytics.visitorStats.total}</div>
                <p className="text-xs text-muted-foreground hidden md:block">Depuis le lancement</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium">Aujourd'hui</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{analytics.visitorStats.today}</div>
                <p className="text-xs text-muted-foreground hidden md:block">Visiteurs actifs</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium">Semaine</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{analytics.visitorStats.thisWeek}</div>
                <p className="text-xs text-muted-foreground hidden md:block">7 derniers jours</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium">Mois</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{analytics.visitorStats.thisMonth}</div>
                <p className="text-xs text-muted-foreground hidden md:block">30 derniers jours</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Visitors Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visiteurs quotidiens</CardTitle>
                <CardDescription>Trafic des 30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyVisitors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: fr })}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(new Date(date), 'PPP', { locale: fr })}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      name="Visiteurs"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Country Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution géographique</CardTitle>
                <CardDescription>Visiteurs par pays</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.countryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Visiteurs" fill="#8884d8">
                      {analytics.countryStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Pages les plus visitées</CardTitle>
                <CardDescription>Classement par nombre de vues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPages.length > 0 ? (
                    analytics.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium">{page.page}</span>
                        </div>
                        <Badge variant="secondary">{page.count} vues</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Country Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Statistiques par pays
                  </div>
                </CardTitle>
                <CardDescription>Répartition détaillée des visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.countryStats.length > 0 ? (
                    analytics.countryStats.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{country.count} visiteurs</span>
                          <Badge variant="outline">
                            {((country.count / analytics.visitorStats.total) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* No Data Message */}
      {!analytics && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Aucune donnée disponible</p>
            <p className="text-sm text-muted-foreground">
              Les statistiques s'afficheront une fois que le système de suivi sera configuré
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Statistics;
