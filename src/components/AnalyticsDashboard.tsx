
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Phone, Clock, Users, Target } from "lucide-react";

export const AnalyticsDashboard = () => {
  const callVolumeData = [
    { day: 'Mon', calls: 65, connected: 23 },
    { day: 'Tue', calls: 78, connected: 31 },
    { day: 'Wed', calls: 82, connected: 29 },
    { day: 'Thu', calls: 95, connected: 38 },
    { day: 'Fri', calls: 88, connected: 35 },
  ];

  const dispositionData = [
    { name: 'Connected', value: 156, color: '#22c55e' },
    { name: 'Voicemail', value: 89, color: '#3b82f6' },
    { name: 'No Answer', value: 124, color: '#f59e0b' },
    { name: 'Busy', value: 45, color: '#ef4444' },
    { name: 'Do Not Call', value: 12, color: '#6b7280' },
  ];

  const performanceData = [
    { hour: '9AM', rate: 24 },
    { hour: '10AM', rate: 31 },
    { hour: '11AM', rate: 28 },
    { hour: '12PM', rate: 18 },
    { hour: '1PM', rate: 15 },
    { hour: '2PM', rate: 35 },
    { hour: '3PM', rate: 42 },
    { hour: '4PM', rate: 38 },
    { hour: '5PM', rate: 29 },
  ];

  const totalCalls = callVolumeData.reduce((sum, day) => sum + day.calls, 0);
  const totalConnected = callVolumeData.reduce((sum, day) => sum + day.connected, 0);
  const connectionRate = Math.round((totalConnected / totalCalls) * 100);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:24</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -8% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +18% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Call Volume</CardTitle>
            <CardDescription>Calls made vs connections this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
                <Bar dataKey="connected" fill="#22c55e" name="Connected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Call Disposition Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Call Dispositions</CardTitle>
            <CardDescription>Breakdown of call outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dispositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dispositionData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Connection Rate</CardTitle>
          <CardDescription>Connection rate by hour of the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Connection Rate']} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Progress and metrics for active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Q4 Sales Outreach</h4>
                  <p className="text-sm text-gray-600">187/500 contacts reached</p>
                </div>
                <Badge variant="outline" className="bg-green-500 text-white border-0">
                  37% completion
                </Badge>
              </div>
              <Progress value={37} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Connected:</span>
                  <span className="font-medium ml-2">23</span>
                </div>
                <div>
                  <span className="text-gray-600">Voicemails:</span>
                  <span className="font-medium ml-2">89</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium ml-2">12.3%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Product Demo Follow-up</h4>
                  <p className="text-sm text-gray-600">89/250 contacts reached</p>
                </div>
                <Badge variant="outline" className="bg-yellow-500 text-white border-0">
                  Paused
                </Badge>
              </div>
              <Progress value={36} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Connected:</span>
                  <span className="font-medium ml-2">12</span>
                </div>
                <div>
                  <span className="text-gray-600">Voicemails:</span>
                  <span className="font-medium ml-2">45</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium ml-2">13.5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
