import React from 'react';


const CalendarGrid = ({ 
  currentDate, 
  attendanceData, 
  onDateClick, 
  hoveredDate, 
  onDateHover,
  onDateLeave 
}) => {
  const today = new Date();
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay?.getDate();
  const startingDayOfWeek = firstDay?.getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays?.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays?.push(day);
  }
  
  const getAttendanceStatus = (day) => {
    const dateKey = `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return attendanceData?.[dateKey] || null;
  };
  
  const isToday = (day) => {
    return today?.getDate() === day && 
           today?.getMonth() === month && 
           today?.getFullYear() === year;
  };
  
  const isFutureDate = (day) => {
    const dateToCheck = new Date(year, month, day);
    return dateToCheck > today;
  };
  
  const getDayClasses = (day) => {
    if (!day) return '';
    
    const attendance = getAttendanceStatus(day);
    const future = isFutureDate(day);
    const todayClass = isToday(day) ? 'ring-2 ring-primary' : '';
    
    let baseClasses = `relative h-12 w-full flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${todayClass}`;
    
    if (future) {
      baseClasses += ' text-muted-foreground';
    } else if (attendance) {
      if (attendance?.status === 'present') {
        baseClasses += ' text-foreground';
      } else if (attendance?.status === 'absent') {
        baseClasses += ' text-foreground';
      } else {
        baseClasses += ' text-foreground';
      }
    }
    
    return baseClasses;
  };
  
  const getAttendanceIndicator = (day) => {
    if (!day || isFutureDate(day)) return null;
    
    const attendance = getAttendanceStatus(day);
    if (!attendance) return null;
    
    if (attendance?.status === 'present') {
      return (
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-success rounded-full"></div>
      );
    } else if (attendance?.status === 'absent') {
      return (
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-error rounded-full"></div>
      );
    }
    
    return null;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays?.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays?.map((day, index) => (
          <div
            key={index}
            className={getDayClasses(day)}
            onClick={() => day && onDateClick(day)}
            onMouseEnter={() => day && onDateHover(day)}
            onMouseLeave={() => day && onDateLeave()}
          >
            {day && (
              <>
                <span className="text-sm font-medium">{day}</span>
                {getAttendanceIndicator(day)}
              </>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-sm text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <span className="text-sm text-muted-foreground">No Class</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;