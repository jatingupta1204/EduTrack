import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { StudentLayout } from './layouts/StudentLayout.tsx'
import StudentHome from './dashboards/student/Home.tsx'
import Attendance from './dashboards/student/Attendance.tsx'
import Grades from './dashboards/student/Grades.tsx'
import SemesterRegistration from './dashboards/student/SemesterRegistration.tsx'
import Settings from './dashboards/student/Settings.tsx'
import AdminHome from './dashboards/admin/Home.tsx'
import { AdminLayout } from './layouts/AdminLayout.tsx'
import SuperAdminHome from './dashboards/superadmin/Home.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />} />
      <Route path='/dashboard' element={<StudentLayout />}>
        <Route index element={<StudentHome />} />
        <Route path='attendance' element={<Attendance />} />
        <Route path='grades' element={<Grades />} />
        <Route path='semester-registration' element={<SemesterRegistration />} />
        <Route path='settings' element={<Settings />} />
      </Route>
      <Route path='/dashboard/admin' element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
      </Route>
      <Route path='/dashboard/superadmin' element={<AdminLayout />}>
        <Route index element={<SuperAdminHome />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
