import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import Icon from '../../../components/AppIcon';

import axios from 'axios';

const AttendanceTable = ({ selectedClass, onBulkAction }) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStatus, setEditStatus] = useState('Present');
  const [messagingStudent, setMessagingStudent] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // const studentsData = [
  //   {
  //     id: 'st001',
  //     name: 'Alice Johnson',
  //     rollNumber: 'CS101001',
  //     attendancePercentage: 85.5,
  //     recentStatus: 'Present',
  //     lastUpdated: '2025-09-16',
  //     totalClasses: 45,
  //     attendedClasses: 38,
  //     email: 'alice.johnson@university.edu'
  //   },
  //   {
  //     id: 'st002',
  //     name: 'Bob Smith',
  //     rollNumber: 'CS101002',
  //     attendancePercentage: 92.3,
  //     recentStatus: 'Present',
  //     lastUpdated: '2025-09-16',
  //     totalClasses: 45,
  //     attendedClasses: 42,
  //     email: 'bob.smith@university.edu'
  //   },
  //   {
  //     id: 'st003',
  //     name: 'Carol Davis',
  //     rollNumber: 'CS101003',
  //     attendancePercentage: 58.2,
  //     recentStatus: 'Absent',
  //     lastUpdated: '2025-09-15',
  //     totalClasses: 45,
  //     attendedClasses: 26,
  //     email: 'carol.davis@university.edu'
  //   },
  //   {
  //     id: 'st004',
  //     name: 'David Wilson',
  //     rollNumber: 'CS101004',
  //     attendancePercentage: 76.8,
  //     recentStatus: 'Present',
  //     lastUpdated: '2025-09-16',
  //     totalClasses: 45,
  //     attendedClasses: 35,
  //     email: 'david.wilson@university.edu'
  //   },
  //   {
  //     id: 'st005',
  //     name: 'Emma Brown',
  //     rollNumber: 'CS101005',
  //     attendancePercentage: 45.7,
  //     recentStatus: 'Absent',
  //     lastUpdated: '2025-09-14',
  //     totalClasses: 45,
  //     attendedClasses: 21,
  //     email: 'emma.brown@university.edu'
  //   }
  // ];

  // if not already imported

  

  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [studentsRes, presentRes] = await Promise.all([
        axios.get('http://localhost:8081/all_student'),
        axios.get('http://localhost:8081/present-rolls')
      ]);

      const presentRolls = new Set(presentRes.data); // fast lookup

      const mergedData = studentsRes.data.map(student => ({
        ...student,
        // ensure a stable id exists for UI operations
        id: student?.id ?? student?.Roll_no,
        recentStatus: presentRolls.has(student.Roll_no) ? 'Present' : 'Absent'
      }));

      setStudentsData(mergedData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  fetchData();
}, []);




const totalClasses=101;




  const filteredStudents = studentsData?.filter(student =>
    student?.Name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(filteredStudents?.map(s => s?.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId, checked) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev?.filter(id => id !== studentId));
    }
  };

  const handleEditStudent = (studentId) => {
    const student = studentsData?.find(s => s?.id === studentId);
    setEditStatus(student?.recentStatus ?? 'Present');
    setEditingStudent(studentId);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleSaveEdit = async (studentId) => {
    // update local state optimistically
    setStudentsData(prev => prev.map(s => s?.id === studentId ? { ...s, recentStatus: editStatus } : s));

    // call optional external handler
    if (typeof onBulkAction === 'function') {
      // reuse onBulkAction as an update mechanism if provided
      try {
        onBulkAction('update-status', { id: studentId, status: editStatus });
      } catch (err) {
        console.error('onBulkAction update-status handler threw', err);
      }
    }

    // Example: send change to backend (best-effort, non-blocking)
    try {
      await axios.post('http://localhost:8081/update-attendance', { id: studentId, status: editStatus });
    } catch (err) {
      // log and keep optimistic change; in real app, rollback or show toast
      console.error('Failed to persist attendance change', err);
    }

    setEditingStudent(null);
  };

  const handleStartMessage = (studentId) => {
    setMessagingStudent(studentId);
    setMessageText('');
  };

  const handleCancelMessage = () => {
    setMessagingStudent(null);
    setMessageText('');
  };

  const handleSendMessage = async (studentId) => {
    const student = studentsData?.find(s => s?.id === studentId);
    const payload = { id: studentId, message: messageText, to: student?.email };

    if (typeof onBulkAction === 'function') {
      try {
        onBulkAction('send-message', payload);
      } catch (err) {
        console.error('onBulkAction send-message handler threw', err);
      }
    }

    try {
      await axios.post('http://localhost:8081/send-message', payload);
    } catch (err) {
      console.error('Failed to send message', err);
    }

    setMessagingStudent(null);
    setMessageText('');
  };

  const handleBulkUpdate = async (status) => {
    if (!selectedStudents || selectedStudents.length === 0) return;

    // Optimistic local update
    setStudentsData(prev => prev.map(s => selectedStudents.includes(s?.id) ? { ...s, recentStatus: status } : s));

    // notify parent if available
    if (typeof onBulkAction === 'function') {
      try {
        onBulkAction('bulk-update-status', { ids: selectedStudents, status });
      } catch (err) {
        console.error('onBulkAction bulk-update-status handler threw', err);
      }
    }

    // send to backend (best-effort)
    try {
      await axios.post('http://localhost:8081/bulk-update-attendance', { ids: selectedStudents, status });
    } catch (err) {
      console.error('Failed to persist bulk attendance change', err);
    }

    // clear selection
    setSelectedStudents([]);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getStatusBadge = (status, percentage) => {
    const isDetained = percentage < 60;
    if (isDetained) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
          <Icon name="AlertTriangle" size={12} className="mr-1" />
          Detained
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status === 'Present' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
        <Icon name={status === 'Present' ? 'Check' : 'X'} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Class Attendance</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track student attendance records
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-64"
            />

            {selectedStudents?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('Present')}
                  iconName="CheckSquare"
                  iconPosition="left"
                >
                  Mark Present ({selectedStudents?.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkUpdate('Absent')}
                  iconName="X"
                  iconPosition="left"
                >
                  Mark Absent ({selectedStudents?.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedStudents?.length === filteredStudents?.length && filteredStudents?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Student</th>
              <th className="text-left p-4 font-medium text-foreground">Roll Number</th>
              <th className="text-left p-4 font-medium text-foreground">Attendance %</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">Last Updated</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.map((student) => (
              <tr key={student?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={(e) => handleSelectStudent(student?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {student?.Name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student?.Name}</p>
                      <p className="text-sm text-muted-foreground">{student?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-foreground">{student?.Roll_no}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getAttendanceColor(student?.attendancePercentage)}`}>
                      {student?.attendancePercentage}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({student?.attendedClasses}/{totalClasses})
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {editingStudent === student?.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e?.target?.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => handleSaveEdit(student?.id)}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    getStatusBadge(student?.recentStatus, student?.attendancePercentage)
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{student?.lastUpdated}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStudent(student?.id)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit
                    </Button>
                    {messagingStudent === student?.id ? (
                      <div className="flex items-center space-x-2">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e?.target?.value)}
                          placeholder={`Message to ${student?.Name}`}
                          className="border px-2 py-1 rounded w-64 h-20"
                        />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => handleSendMessage(student?.id)}>Send</Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelMessage}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MessageSquare"
                        onClick={() => handleStartMessage(student?.id)}
                      >
                        Message
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {filteredStudents?.map((student) => (
          <div key={student?.id} className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedStudents?.includes(student?.id)}
                  onChange={(e) => handleSelectStudent(student?.id, e?.target?.checked)}
                  className="rounded border-border mt-1"
                />
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {student?.Name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{student?.Name}</p>
                  <p className="text-sm text-muted-foreground">{student?.Roll_no}</p>
                </div>
              </div>
              {getStatusBadge(student?.recentStatus, student?.attendancePercentage)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className={`font-semibold ${getAttendanceColor(student?.attendancePercentage)}`}>
                  {student?.attendancePercentage}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Classes</p>
                <p className="font-medium text-foreground">
                  {student?.attendedClasses}/{totalClasses}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Updated: {student?.lastUpdated}
              </p>
                <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="Edit" onClick={() => handleEditStudent(student?.id)} />
                {messagingStudent === student?.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e?.target?.value)}
                      placeholder={`Message to ${student?.Name}`}
                      className="border px-2 py-1 rounded w-48 h-20"
                    />
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => handleSendMessage(student?.id)}>Send</Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelMessage}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" iconName="MessageSquare" onClick={() => handleStartMessage(student?.id)} />
                )}
                </div>
            </div>
          </div>
        ))}
      </div>
      {filteredStudents?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;