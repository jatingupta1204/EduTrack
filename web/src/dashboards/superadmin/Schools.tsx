import { useEffect, useState } from 'react'
import CRUDPage from './CRUDPage'

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'code' as const, header: 'Code' },
  { key: 'description' as const, header: 'Description' },
]

export default function Schools() {
  const [schools, setSchools] = useState<{id: string; name:string; code:string; description: string }[]>([])

  useEffect(() => {
    fetch('/api/v1/schools/getAllSchool')
      .then((res) => res.json())
      .then((data) => setSchools(data.data))
      .catch((err) => console.error('Error fetching schools: ', err))
  }, [])

  const handleSave = async (school: { name: string; code: string; description: string }) => {
    try {
      const response = await fetch('/api/v1/schools/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(school),
      })
      if(response.ok) {
        const result = await response.json()
        setSchools((prev) => [...prev, result.data])
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
      if(response.ok) {
        setSchools((prev) => prev.filter((s) => s.id !== school.id))
      }
    } catch (error) {
      console.error('Error deleting school:', error)
    }
  }

  return (
    <CRUDPage
      title="Schools"
      data={schools}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
