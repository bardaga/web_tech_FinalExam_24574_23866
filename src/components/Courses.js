import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    teacherName: '',
    classLevel: null
  });
  const [showForm, setShowForm] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(10);

 
  const [searchCriteria, setSearchCriteria] = useState({
    courseName: '',
    teacherName: '',
    classLevel: ''
  });
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    
    fetchCourses();
    fetchClasses();
  }, []);

  useEffect(() => {
    
    filterCourses();
  }, [courses, searchCriteria]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const filterCourses = () => {
    const filtered = courses.filter(course => {
      return (
       
        (searchCriteria.courseName === '' || 
         course.courseName.toLowerCase().includes(searchCriteria.courseName.toLowerCase())) &&
       
        (searchCriteria.teacherName === '' || 
         course.teacherName.toLowerCase().includes(searchCriteria.teacherName.toLowerCase())) &&
        
        (searchCriteria.classLevel === '' || 
         (course.classLevel && 
          course.classLevel.className.toLowerCase().includes(searchCriteria.classLevel.toLowerCase())))
      );
    });

    setFilteredCourses(filtered);
    setCurrentPage(1); 
  };

  const handleAddCourse = async () => {
    try {
      
      const courseToSubmit = {
        courseName: newCourse.courseName,
        teacherName: newCourse.teacherName,
        classLevel: newCourse.classLevel ? { id: newCourse.classLevel } : null
      };

      const response = await axios.post('http://localhost:8081/api/courses', courseToSubmit);
      setCourses([...courses, response.data]);
      setShowForm(false); 
      
      setNewCourse({ 
        courseName: '', 
        teacherName: '',
        classLevel: null 
      }); 
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/courses/${id}`);
      setCourses(courses.filter((course) => course.id !== id)); 
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Course Name" 
            value={newCourse.courseName}
            onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
            className="border p-2"
          />
          <input 
            type="text" 
            placeholder="Teacher Name" 
            value={newCourse.teacherName}
            onChange={(e) => setNewCourse({ ...newCourse, teacherName: e.target.value })}
            className="border p-2"
          />
          <select
            value={newCourse.classLevel || ''}
            onChange={(e) => setNewCourse({ 
              ...newCourse, 
              classLevel: e.target.value ? parseInt(e.target.value) : null 
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
            onClick={handleAddCourse} 
            className="bg-green-500 text-white px-4 py-2 rounded col-span-3"
          >
            Save Course
          </button>
        </div>
      )}

      {/* Search Inputs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <input 
            type="text" 
            placeholder="Search Course Name" 
            value={searchCriteria.courseName}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, courseName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Search Teacher Name" 
            value={searchCriteria.teacherName}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, teacherName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <select
            value={searchCriteria.classLevel}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, classLevel: e.target.value })}
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

      {/* Courses Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 w-[10%]">ID</th>
            <th className="border p-2 w-[25%]">Course Name</th>
            <th className="border p-2 w-[25%]">Teacher Name</th>
            <th className="border p-2 w-[25%]">Class</th>
            <th className="border p-2 w-[15%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course.id}>
              <td className="border p-2">{course.id}</td>
              <td className="border p-2">{course.courseName}</td>
              <td className="border p-2">{course.teacherName}</td>
              <td className="border p-2">
                {course.classLevel ? course.classLevel.className : 'No Class'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteCourse(course.id)}
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
            value={coursesPerPage}
            onChange={(e) => {
              setCoursesPerPage(Number(e.target.value));
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
          Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, filteredCourses.length)} 
          {' '}of {filteredCourses.length} entries
        </div>
      </div>
    </div>
  );
};

export default Courses;