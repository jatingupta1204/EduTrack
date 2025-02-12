import { useState, useEffect } from "react"
import CRUDPage from "./CRUDPage"

interface Department {
  id: string
  name: string
  code: string
  description: string
  schoolId: string
}

interface School {
  id: string
  name: string
}

const columns = [
  { key: "name" as const, header: "Name" },
  { key: "code" as const, header: "Code" },
  { key: "description" as const, header: "Description" },
  { key: "schoolId" as const, header: "School" },
]

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [schoolsLoaded, setSchoolsLoaded] = useState(false) // Track if schools are loaded

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    if (schoolsLoaded) {
      fetchDepartments()
    }
  }, [currentPage, schoolsLoaded]) // Fetch departments only after schools are loaded

  const fetchSchools = async () => {
    try {
      const response = await fetch(`/api/v1/schools/getAllSchool?paginate=false`)
      const data = await response.json()
      setSchools(data.data.school)
      setSchoolsLoaded(true) // Mark that schools have been loaded
    } catch (error) {
      console.error("Error fetching schools:", error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`/api/v1/departments/getAllDepartment?page=${currentPage}`)
      const data = await response.json()

      setDepartments(
        data.data.department.map((dept: Department) => ({
          ...dept,
          schoolId: schools.find((s) => s.id === dept.schoolId)?.name || "Unknown",
        }))
      )
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const handleSave = async (department: Department) => {
    try {
      const school = schools.find((s) => s.name === department.schoolId)
      const payload = { ...department, schoolId: school?.id || "" }

      const response = department.id
        ? await fetch(`/api/v1/departments/update/${department.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/v1/departments/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      if (response.ok) {
        fetchDepartments()
      }
    } catch (error) {
      console.error("Error saving department:", error)
    }
  }

  const handleDelete = async (department: { id: string }) => {
    try {
      const response = await fetch(`/api/v1/departments/delete/${department.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchDepartments()
      }
    } catch (error) {
      console.error("Error deleting department:", error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const SchoolDropdown = ({ value, onChange }: { value: string; onChange: (school: string) => void }) => (
    <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select School</option>
      {schools.map((school) => (
        <option key={school.id} value={school.name}>
          {school.name}
        </option>
      ))}
    </select>
  )

  const renderForm = (department: Department, setDepartment: (item: Department) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={department.name}
            onChange={(e) => setDepartment({ ...department, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Code</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={department.code}
            onChange={(e) => setDepartment({ ...department, code: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={department.description}
            onChange={(e) => setDepartment({ ...department, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">School</label>
          <SchoolDropdown value={department.schoolId} onChange={(school) => setDepartment({ ...department, schoolId: school })} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Departments</h1>
      <CRUDPage
        title="Departments"
        data={departments}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        renderForm={renderForm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
