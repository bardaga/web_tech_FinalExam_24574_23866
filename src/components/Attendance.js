import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    student: null,
    course: null,
    attendanceDate: '',
    status: 'Present'
  });
  const [showForm, setShowForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Search state
  const [searchCriteria, setSearchCriteria] = useState({
    studentName: '',
    courseName: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    // Fetch attendance records, students, and courses
    fetchAttendanceRecords();
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter records whenever search criteria or records change
    filterAttendanceRecords();
  }, [attendanceRecords, searchCriteria]);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/attendance');
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const filterAttendanceRecords = () => {
    const filtered = attendanceRecords.filter(record => {
      const studentFullName = `${record.student?.firstName} ${record.student?.lastName}`.toLowerCase();
      const recordDate = new Date(record.attendanceDate);

      return (
        // Student Name search (case-insensitive partial match)
        (searchCriteria.studentName === '' || 
         studentFullName.includes(searchCriteria.studentName.toLowerCase())) &&
        // Course Name search (case-insensitive partial match)
        (searchCriteria.courseName === '' || 
         record.course?.courseName.toLowerCase().includes(searchCriteria.courseName.toLowerCase())) &&
        // Status search
        (searchCriteria.status === '' || record.status === searchCriteria.status) &&
        // Date range filter
        (!searchCriteria.dateFrom || recordDate >= new Date(searchCriteria.dateFrom)) &&
        (!searchCriteria.dateTo || recordDate <= new Date(searchCriteria.dateTo))
      );
    });

    setFilteredRecords(filtered);
    setCurrentPage(1); 
  };

  const handleAddAttendance = async () => {
    try {
      // Prepare the attendance object to match backend expectations
      const attendanceToSubmit = {
        student: { id: newAttendance.student },
        course: { id: newAttendance.course },
        attendanceDate: newAttendance.attendanceDate,
        status: newAttendance.status
      };

      const response = await axios.post('http://localhost:8081/api/attendance', attendanceToSubmit);
      setAttendanceRecords([...attendanceRecords, response.data]);
      setShowForm(false); // Close the form after adding
      // Reset the form fields
      setNewAttendance({ 
        student: null, 
        course: null,
        attendanceDate: '',
        status: 'Present'
      }); 
    } catch (error) {
      console.error('Error adding attendance record:', error);
    }
  };

  const handleDeleteAttendance = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/attendance/${id}`);
      setAttendanceRecords(attendanceRecords.filter((record) => record.id !== id)); // Remove the record locally
    } catch (error) {
      console.error('Error deleting attendance record:', error);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Attendance'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <select
            value={newAttendance.student || ''}
            onChange={(e) => setNewAttendance({ 
              ...newAttendance, 
              student: e.target.value ? parseInt(e.target.value) : null 
            })}
            className="border p-2"
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          <select
            value={newAttendance.course || ''}
            onChange={(e) => setNewAttendance({ 
              ...newAttendance, 
              course: e.target.value ? parseInt(e.target.value) : null 
            })}
            className="border p-2"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>

          <input 
            type="date" 
            value={newAttendance.attendanceDate}
            onChange={(e) => setNewAttendance({ ...newAttendance, attendanceDate: e.target.value })}
            className="border p-2"
            required
          />

          <select
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
            className="border p-2 col-span-3"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

          <button 
            onClick={handleAddAttendance} 
            className="bg-green-500 text-white px-4 py-2 rounded col-span-3"
            disabled={!newAttendance.student || !newAttendance.course || !newAttendance.attendanceDate}
          >
            Save Attendance
          </button>
        </div>
      )}

      {/* Search Inputs */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Search Student Name" 
          value={searchCriteria.studentName}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, studentName: e.target.value })}
          className="border p-2"
        />
        <select
          value={searchCriteria.courseName}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, courseName: e.target.value })}
          className="border p-2"
        >
          <option value="">Search Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.courseName}>
              {course.courseName}
            </option>
          ))}
        </select>
        <select
          value={searchCriteria.status}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, status: e.target.value })}
          className="border p-2"
        >
          <option value="">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
        <input 
          type="date" 
          value={searchCriteria.dateFrom}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, dateFrom: e.target.value })}
          placeholder="From Date"
          className="border p-2"
        />
        <input 
          type="date" 
          value={searchCriteria.dateTo}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, dateTo: e.target.value })}
          placeholder="To Date"
          className="border p-2"
        />
      </div>

      {/* Attendance Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Student</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record) => (
            <tr key={record.id}>
              <td className="border p-2">{record.id}</td>
              <td className="border p-2">
                {record.student?.firstName} {record.student?.lastName}
              </td>
              <td className="border p-2">{record.course?.courseName}</td>
              <td className="border p-2">
                {new Date(record.attendanceDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{record.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteAttendance(record.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Items per page selector */}
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <select 
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="border p-2"
          >
            {[5, 10, 15, 20, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="ml-2">entries</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-4 py-2 border rounded ${
                currentPage === page ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Page info */}
        <div>
          Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} 
          {' '}of {filteredRecords.length} entries
        </div>
      </div>
    </div>
  );
};

export default Attendance;