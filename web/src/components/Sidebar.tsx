import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Home, ClipboardCheck, GraduationCap, Calendar, Settings, LogOut, School, Briefcase, BookOpen, Bell, Users, UserPlus, User } from 'lucide-react'
import { handleError } from '@/utils/errorAndSuccess'

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
  { icon: Home, label: 'Home', href: '/dashboard/superadmin' },
  { icon: School, label: 'Schools', href: '/dashboard/superadmin/school' },
  { icon: Calendar, label: 'Semesters', href: '/dashboard/superadmin/semester' },
  { icon: Briefcase, label: 'Departments', href: '/dashboard/superadmin/department' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/superadmin/course' },
  { icon: Bell, label: 'Notices', href: '/dashboard/superadmin/notice' },
  { icon: Users, label: 'Batches', href: '/dashboard/superadmin/batch' },
  { icon: UserPlus, label: 'Create Users', href: '/dashboard/superadmin/create-user' },
  { icon: Settings, label: 'Settings', href: '/dashboard/superadmin/setting' },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  role: 'student' | 'admin' | 'superadmin';
}

export function Sidebar({ open, setOpen, role }: SidebarProps) {
  const navigate = useNavigate();
  
  // Select sidebar items based on role
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

  const logout = async () => {
    try {
      const url = '/api/v1/users/logout';
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'  
        },
      });
      if(response.ok){
        navigate('/', { replace: true });
      } else {
        return handleError("Failed to Logout");
      }
    } catch (error) {
      return handleError("Failed to Logout");
    }
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out ${
      open ? "translate-x-0" : "-translate-x-full"
    } md:relative md:translate-x-0`}
    style={{ backgroundColor: 'hsl(var(--background))', borderRight: '1px solid hsl(var(--border))' }}>
      <div className="flex flex-col items-center justify-center p-6" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 md:hidden" onClick={() => setOpen(false)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mb-1">John Doe</h2>
        <p className="text-sm mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
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
        <Button variant="ghost" className="w-full justify-start" style={{ color: 'hsl(var(--destructive))'}} onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}