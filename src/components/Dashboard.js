import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Search, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: '0',
    staffMembers: '0',
    coursesOffered: '0'
  });

  const location = useLocation();
  const navigate = useNavigate();

  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    axios.post("http://localhost:8081/api/logout")
      .then(() => console.log("Logged out successfully"))
      .catch(err => console.error("Error logging out", err));
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', color: 'bg-blue-500' },
    { icon: Users, label: 'Students', path: '/dashboard/students', color: 'bg-indigo-500' },
    { icon: Book, label: 'Classes', path: '/dashboard/classes', color: 'bg-green-500' },
    { icon: Search, label: 'Global Search', path: '/dashboard/global-search', color: 'bg-yellow-500' },
    { icon: Book, label: 'Courses', path: '/dashboard/courses', color: 'bg-orange-500' },
    { icon: Book, label: 'Attendance', path: '/dashboard/attendance', color: 'bg-red-500' },
    { icon: LogOut, label: 'Logout', path: '/logout', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    
    axios.get('http://localhost:8081/api/dashboard/stats')
      .then((response) => {
        setDashboardStats({
          totalStudents: response.data.totalStudents?.toString() || '0',
          staffMembers: response.data.allClasses?.toString() || '0',
          coursesOffered: response.data.coursesOffered?.toString() || '0'
        });
      })
      .catch((error) => {
        console.error('Error fetching dashboard stats', error);
      });
  }, []);

  const showCards = location.pathname === '/dashboard';

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen p-4 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-6">AUCA SmartStudent</h2>
        {sidebarItems.map((item, index) => {
          const isLogout = item.label === "Logout";
          return (
            <div
              key={index}
              className={cn(
                "flex items-center p-3 mb-2 hover:bg-gray-700 rounded cursor-pointer",
                isLogout ? "bg-red-500 text-white" : "text-gray-400",
                location.pathname === item.path && item.color
              )}
              onClick={isLogout ? handleLogout : () => navigate(item.path)}
            >
              <item.icon className="mr-3" />
              {item.label}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl mb-6">Welcome to AUCA SmartStudent Dashboard</h1>
        {showCards && (
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-blue-500 text-white shadow-lg">
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{dashboardStats.totalStudents}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-500 text-white shadow-lg">
              <CardHeader>
                <CardTitle>All Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{dashboardStats.staffMembers}</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500 text-white shadow-lg">
              <CardHeader>
                <CardTitle>Courses Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{dashboardStats.coursesOffered}</div>
              </CardContent>
            </Card>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
