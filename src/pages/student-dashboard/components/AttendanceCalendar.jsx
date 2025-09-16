import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock attendance data - green for present, red for absent
  const attendanceData = {
    '2024-12-01': 'present',
    '2024-12-02': 'present',
    '2024-12-03': 'absent',
    '2024-12-04': 'present',
    '2024-12-05': 'present',
    '2024-12-06': 'present',
    '2024-12-09': 'present',
    '2024-12-10': 'absent',
    '2024-12-11': 'present',
    '2024-12-12': 'present',
    '2024-12-13': 'present',
    '2024-12-16': 'present',
    '2024-12-17': 'present',
    '2024-12-18': 'present',
    '2024-12-19': 'absent',
    '2024-12-20': 'present'
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(day);
    }
    
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
  };

  const getAttendanceStatus = (day) => {
    if (!day) return null;
    const dateKey = formatDateKey(currentMonth?.getFullYear(), currentMonth?.getMonth(), day);
    return attendanceData?.[dateKey];
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth?.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Attendance Calendar</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Absent</span>
            </div>
          </div>
        </div>
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
        >
          <Icon name="ChevronLeft" size={20} className="text-muted-foreground" />
        </button>
        
        <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
        >
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </button>
      </div>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days?.map((day, index) => {
          const status = getAttendanceStatus(day);
          const isToday = day && 
            currentMonth?.getFullYear() === new Date()?.getFullYear() &&
            currentMonth?.getMonth() === new Date()?.getMonth() &&
            day === new Date()?.getDate();

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm relative rounded-lg transition-colors duration-150 ${
                day ? 'hover:bg-muted cursor-pointer' : ''
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              {day && (
                <>
                  <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day}
                  </span>
                  {status && (
                    <div
                      className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                        status === 'present' ? 'bg-success' : 'bg-error'
                      }`}
                    ></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* Calendar Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">This month:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-foreground font-medium">15 Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-foreground font-medium">3 Absent</span>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-150">
            <Icon name="Download" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;