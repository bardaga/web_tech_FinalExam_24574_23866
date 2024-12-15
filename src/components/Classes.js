import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ 
    className: '', 
    subject: '', 
    teacherName: '',
    description: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleAddClass = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/classes', newClass);
      setClasses([...classes, response.data]);
      setShowForm(false); // Close the form after adding
      // Reset the form fields
      setNewClass({ 
        className: '', 
        subject: '', 
        teacherName: '',
        description: ''
      }); 
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/classes/${id}`);
      setClasses(classes.filter((classItem) => classItem.id !== id)); // Remove the class locally
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleViewStudents = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/students/class/${classId}`);

      alert(`Students in this class: ${JSON.stringify(response.data.map(student => student.firstName + ' ' + student.lastName))}`);
    } catch (error) {
      console.error('Error fetching class students:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Class'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Class Name" 
            value={newClass.className}
            onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
            className="border p-2"
          />
          <input 
            type="text" 
            placeholder="Subject" 
            value={newClass.subject}
            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
            className="border p-2"
          />
          <input 
            type="text" 
            placeholder="Teacher Name" 
            value={newClass.teacherName}
            onChange={(e) => setNewClass({ ...newClass, teacherName: e.target.value })}
            className="border p-2"
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={newClass.description}
            onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
            className="border p-2"
          />
          <button 
            onClick={handleAddClass} 
            className="bg-green-500 text-white px-4 py-2 rounded col-span-2"
          >
            Save Class
          </button>
        </div>
      )}

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Class Name</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="border p-2">{classItem.id}</td>
              <td className="border p-2">{classItem.className}</td>
              <td className="border p-2">{classItem.subject}</td>
              <td className="border p-2">{classItem.teacherName}</td>
              <td className="border p-2">{classItem.description}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleViewStudents(classItem.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View Students
                </button>
                <button
                  onClick={() => handleDeleteClass(classItem.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;