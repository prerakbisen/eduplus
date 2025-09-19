import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendanceTrends = ({ selectedClass }) => {
  const weeklyTrends = [
    { day: 'Mon', attendance: 85, total: 9 },
    { day: 'Tue', attendance: 92, total: 9 },
    { day: 'Wed', attendance: 78, total: 9 },
    { day: 'Thu', attendance: 88, total: 9 },
    { day: 'Fri', attendance: 82, total: 9 },
    { day: 'Sat', attendance: 75, total: 9 }
  ];

  const monthlyTrends = [
    { month: 'Jan', percentage: 88.5 },
    { month: 'Feb', percentage: 85.2 },
    { month: 'Mar', percentage: 91.3 },
    { month: 'Apr', percentage: 87.8 },
    { month: 'May', percentage: 83.4 },
    { month: 'Jun', percentage: 89.1 },
    { month: 'Jul', percentage: 86.7 },
    { month: 'Aug', percentage: 90.2 },
    { month: 'Sep', percentage: 84.9 }
  ];

  const detainedStudents = [
    { name: 'Anjali', percentage: 58.2, rollNumber: '057' },
    { name: 'Anshul', percentage: 45.7, rollNumber: '066' },
    { name: 'Deepti', percentage: 52.3, rollNumber: '145' }
  ];

  const classStats = {
    totalStudents: 9,
    averageAttendance: 78.5,
    presentToday: 3,
    absentToday: 6,
    detainedCount: 3
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{classStats?.totalStudents}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-2xl font-bold text-success">{classStats?.averageAttendance}%</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Present Today</p>
              <p className="text-2xl font-bold text-primary">{classStats?.presentToday}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Detained Students</p>
              <p className="text-2xl font-bold text-error">{classStats?.detainedCount}</p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Weekly Attendance</h3>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="attendance" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <h3 className="text-lg font-semibold text-foreground">Monthly Trends</h3>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="var(--color-success)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Detained Students Alert */}
      {detainedStudents?.length > 0 && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <h3 className="text-lg font-semibold text-error">Detained Students Alert</h3>
            <span className="bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-medium">
              {detainedStudents?.length} Students
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            The following students have attendance below 60% and are at risk of detention:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detainedStudents?.map((student, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{student?.name}</p>
                  <span className="text-error font-semibold">{student?.percentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{student?.rollNumber}</p>
                <div className="flex items-center space-x-2">
                  <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors">
                    Send Alert
                  </button>
                  <button className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/90 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTrends;