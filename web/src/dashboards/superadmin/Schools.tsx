import { useEffect, useState } from 'react'
import CRUDPage from './CRUDPage'

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'code' as const, header: 'Code' },
  { key: 'description' as const, header: 'Description' },
]

interface School {
  id: string
  name: string
  code: string
  description: string
}

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5 // Number of schools per page

  useEffect(() => {
    fetchSchools(currentPage)
  }, [currentPage])

  const fetchSchools = async (page: number) => {
    try {
      const response = await fetch(`/api/v1/schools/getAllSchool?page=${page}&limit=${pageSize}`)
      const data = await response.json()
      setSchools(data.data.school)
      setTotalPages(data.data.totalPages) // Assuming backend returns total pages
    } catch (error) {
      console.error('Error fetching schools:', error)
    }
  }

  const handleSave = async (school: School) => {
    try {
      const response = school.id
        ? await fetch(`/api/v1/schools/update/${school.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(school),
          })
        : await fetch('/api/v1/schools/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(school),
          })

      if (response.ok) {
        fetchSchools(currentPage)
      }
    } catch (error) {
      console.error('Error saving school:', error)
    }
  }

  const handleDelete = async (school: { id: string }) => {
    try {
      const response = await fetch(`/api/v1/schools/delete/${school.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchSchools(currentPage)
      }
    } catch (error) {
      console.error('Error deleting school:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Schools</h1>      
      <CRUDPage
        title="Schools"
        data={schools}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}