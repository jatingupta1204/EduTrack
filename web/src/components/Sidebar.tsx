import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Home,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  BookOpen,
  Bell,
  Users,
  UserPlus,
  User,
  LayoutDashboard,
  Building2,
  Clock,
  Columns,
  BookA,
  Megaphone,
  UsersRound,
  ShieldCheck,
  Settings2
} from 'lucide-react';
import { handleError } from '@/utils/errorAndSuccess';
import { useState, useEffect } from 'react';

const studentSidebarItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: ClipboardCheck, label: 'Attendance', href: '/dashboard/attendance' },
  { icon: GraduationCap, label: 'Grades', href: '/dashboard/grades' },
  { icon: Calendar, label: 'Semester Registration', href: '/dashboard/semester-registration' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const adminSidebarItems = [
  { icon: Home, label: 'Home', href: '/dashboard/admin' },
  { icon: Users, label: 'Manage Students', href: '/dashboard/admin/students' },
  { icon: Briefcase, label: 'Departments', href: '/dashboard/admin/departments' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/admin/courses' },
  { icon: Bell, label: 'Notices', href: '/dashboard/admin/notices' },
  { icon: User, label: 'Teachers', href: '/dashboard/admin/teachers' },
  { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
];

const superAdminSidebarItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard/superadmin' },
  { icon: Building2, label: 'Schools', href: '/dashboard/superadmin/school' },
  { icon: Clock, label: 'Semesters', href: '/dashboard/superadmin/semester' },
  { icon: Columns, label: 'Departments', href: '/dashboard/superadmin/department' },
  { icon: BookA, label: 'Courses', href: '/dashboard/superadmin/course' },
  { icon: Megaphone, label: 'Notices', href: '/dashboard/superadmin/notice' },
  { icon: UsersRound, label: 'Batches', href: '/dashboard/superadmin/batch' },
  { icon: UserPlus, label: 'Create Users', href: '/dashboard/superadmin/create-user' },
  { icon: GraduationCap, label: 'Manage Students', href: '/dashboard/superadmin/manage-student' },
  { icon: ShieldCheck, label: 'Manage Admins', href: '/dashboard/superadmin/manage-admin' },
  { icon: Settings2, label: 'Settings', href: '/dashboard/superadmin/settings' },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  role: 'student' | 'admin' | 'superadmin';
}

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string;
  departmentId?: string; // stored as ID
  currentSemester?: number;
  batchId?: string; // stored as ID
}

interface Department {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
}

export function Sidebar({ open, setOpen, role }: SidebarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    fetchMetadata();
    fetchUserProfile();
  }, []);

  const fetchMetadata = async () => {
    try {
      const deptRes = await fetch("/api/v1/departments/getAllDepartment?paginate=false");
      const batchRes = await fetch("/api/v1/batches/getAllBatch?paginate=false");
      const deptData = await deptRes.json();
      const batchData = await batchRes.json();
      setDepartments(deptData.data?.department || []);
      setBatches(batchData.data?.batch || []);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/v1/users/getSingleUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  

  const logout = async () => {
    try {
      const url = '/api/v1/users/logout';
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        navigate('/', { replace: true });
      } else {
        return handleError("Failed to Logout");
      }
    } catch (error) {
      return handleError("Failed to Logout");
    }
  };

  // Convert stored IDs into display names using fetched metadata
  const departmentName = departments.find(d => d.id === user?.departmentId)?.name || "Unknown";
  const batchName = batches.find(b => b.id === user?.batchId)?.name || "Unknown";
  const semesterNumber = user?.currentSemester ? user.currentSemester.toString() : "Unknown";

  let sidebarItems;
  switch (role) {
    case 'admin':
      sidebarItems = adminSidebarItems;
      break;
    case 'superadmin':
      sidebarItems = superAdminSidebarItems;
      break;
    default:
      sidebarItems = studentSidebarItems;
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
      style={{ backgroundColor: 'hsl(var(--background))', borderRight: '1px solid hsl(var(--border))' }}
    >
      <div
        className="flex flex-col items-center justify-center p-6"
        style={{ borderBottom: '1px solid hsl(var(--border))' }}
      >
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 md:hidden" onClick={() => setOpen(false)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
          <AvatarFallback>
            {user?.avatar ? user.username[0] : <User className="w-6 h-6" />}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mb-1">
          {user ? `${user.first_name || user.username} ${user.last_name || ""}` : "Loading..."}
        </h2>
        <p className="text-sm mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {departmentName}
        </p>
        <p className="text-sm mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Semester: {semesterNumber}
        </p>
        <p className="text-sm mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Batch: {batchName}
        </p>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.href}>
              <Button variant="ghost" className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4" style={{ borderTop: '1px solid hsl(var(--border))' }}>
        <Button variant="ghost" className="w-full justify-start" style={{ color: 'hsl(var(--destructive))' }} onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}