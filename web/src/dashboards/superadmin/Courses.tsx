import { useState, useEffect } from "react"
import CRUDPage from "./CRUDPage"

interface Course {
  id: string
  code: string
  name: string
  description: string
  credits: number
  lecture_classes: number
  tutorial_classes: number
  practical_classes: number
  semesterNumber: number
  departmentId: string
}

interface Department {
  id: string
  name: string
}

const columns = [
  { key: "code" as const, header: "Code" },
  { key: "name" as const, header: "Name" },
  { key: "description" as const, header: "Description" },
  { key: "credits" as const, header: "Credits" },
  { key: "lecture_classes" as const, header: "Lecture Classes" },
  { key: "tutorial_classes" as const, header: "Tutorial Classes" },
  { key: "practical_classes" as const, header: "Practical Classes" },
  { key: "semesterNumber" as const, header: "Semester" },
  { key: "departmentId" as const, header: "Department" },
]

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    if(departmentsLoaded) {
      fetchCourses()
    }
  }, [currentPage, departmentsLoaded])

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`/api/v1/departments/getAllDepartment?paginate=false`)
      const data = await response.json()
      setDepartments(data.data.department)
      setDepartmentsLoaded(true)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/v1/courses/getAllCourse?page=${currentPage}`)
      const data = await response.json()
      setCourses(
        data.data.course.map((cor: Course) => ({
          ...cor,
          departmentId: departments.find((s) => s.id === cor.departmentId)?.name || "Unknown",
        }))
      )
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleSave = async (course: Course) => {
    try {
      const department = departments.find((s) => s.name === course.departmentId)
      const payload = { ...course, departmentId: department?.id || "" }

      const response = course.id
        ? await fetch(`/api/v1/courses/update/${course.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/v1/courses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error("Error saving course:", error)
    }
  }

  const handleDelete = async (course: { id: string }) => {
    if (!window.confirm(`Are you sure you want to delete course ${course.id}?`)) return

    try {
      const response = await fetch(`/api/v1/courses/delete/${course.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const DepartmentDropdown = ({ value, onChange }: { value: string; onChange: (department: string) => void }) => (
    <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select Department</option>
      {departments.map((department) => (
        <option key={department.id} value={department.id}>
          {department.name}
        </option>
      ))}
    </select>
  )

  const renderForm = (course: Course, setCourse: (item: Course) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">Code</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={course.code}
            onChange={(e) => setCourse({ ...course, code: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Credits</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={course.credits}
            onChange={(e) => setCourse({ ...course, credits: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Lecture Classes</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={course.lecture_classes}
            onChange={(e) => setCourse({ ...course, lecture_classes: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tutorial Classes</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={course.tutorial_classes}
            onChange={(e) => setCourse({ ...course, tutorial_classes: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Practical Classes</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={course.practical_classes}
            onChange={(e) => setCourse({ ...course, practical_classes: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Semester</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={course.semesterNumber}
            onChange={(e) => setCourse({ ...course, semesterNumber: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <DepartmentDropdown value={course.departmentId} onChange={(department) => setCourse({ ...course, departmentId: department })} />
        </div>
      </div>
    )
  }

  return (
    <CRUDPage
      title="Courses"
      data={courses}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
      renderForm={renderForm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}