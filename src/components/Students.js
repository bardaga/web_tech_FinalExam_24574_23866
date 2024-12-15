import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newStudent, setNewStudent] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '',
    studentClass: null 
  });
  const [showForm, setShowForm] = useState(false);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  

  const [searchCriteria, setSearchCriteria] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    studentClass: ''
  });

  useEffect(() => {
    
    fetchStudents();
    fetchClasses();
  }, []);

  useEffect(() => {
   
    filterStudents();
  }, [students, searchCriteria]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const filterStudents = () => {
    const filtered = students.filter(student => {
      return (
       
        (searchCriteria.id === '' || student.id.toString().includes(searchCriteria.id)) &&
       
        (searchCriteria.firstName === '' || 
         student.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase())) &&
        
        (searchCriteria.lastName === '' || 
         student.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase())) &&
       
        (searchCriteria.email === '' || 
         student.email.toLowerCase().includes(searchCriteria.email.toLowerCase())) &&
       
        (searchCriteria.studentClass === '' || 
         (student.studentClass && 
          student.studentClass.className.toLowerCase().includes(searchCriteria.studentClass.toLowerCase())))
      );
    });

    setFilteredStudents(filtered);
    setCurrentPage(1); 
  };

  const handleAddStudent = async () => {
    try {
     
      const studentToSubmit = {
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        studentClass: newStudent.studentClass ? { id: newStudent.studentClass } : null
      };

      const response = await axios.post('http://localhost:8081/api/students', studentToSubmit);
      setStudents([...students, response.data]);
      setShowForm(false); 
      // Reset the form fields
      setNewStudent({ 
        firstName: '', 
        lastName: '', 
        email: '',
        studentClass: null 
      }); 
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/students/${id}`);
      setStudents(students.filter((student) => student.id !== id)); // Remove the student locally
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="First Name" 
            value={newStudent.firstName}
            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
            className="border p-2"
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
            className="border p-2"
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="border p-2"
          />
          <select
            value={newStudent.studentClass || ''}
            onChange={(e) => setNewStudent({ 
              ...newStudent, 
              studentClass: e.target.value ? parseInt(e.target.value) : null 
            })}
            className="border p-2 col-span-3"
          >
            <option value="">Select Class (Optional)</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddStudent} 
            className="bg-green-500 text-white px-4 py-2 rounded col-span-3"
          >
            Save Student
          </button>
        </div>
      )}

      {/* Search Inputs */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        <div className="col-span-1">
          <input 
            type="text" 
            placeholder="Search ID" 
            value={searchCriteria.id}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, id: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="col-span-1">
          <input 
            type="text" 
            placeholder="Search First Name" 
            value={searchCriteria.firstName}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, firstName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="col-span-1">
          <input 
            type="text" 
            placeholder="Search Last Name" 
            value={searchCriteria.lastName}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, lastName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="col-span-1">
          <input 
            type="text" 
            placeholder="Search Email" 
            value={searchCriteria.email}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, email: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="col-span-2">
          <select
            value={searchCriteria.studentClass}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, studentClass: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Search Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 w-[10%]">ID</th>
            <th className="border p-2 w-[20%]">First Name</th>
            <th className="border p-2 w-[20%]">Last Name</th>
            <th className="border p-2 w-[20%]">Email</th>
            <th className="border p-2 w-[20%]">Class</th>
            <th className="border p-2 w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id}>
              <td className="border p-2">{student.id}</td>
              <td className="border p-2">{student.firstName}</td>
              <td className="border p-2">{student.lastName}</td>
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">
                {student.studentClass ? student.studentClass.className : 'No Class'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteStudent(student.id)}
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
            value={studentsPerPage}
            onChange={(e) => {
              setStudentsPerPage(Number(e.target.value));
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
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} 
          {' '}of {filteredStudents.length} entries
        </div>
      </div>
    </div>
  );
};

export default Students;