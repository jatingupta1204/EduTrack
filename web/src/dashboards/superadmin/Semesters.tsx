import CRUDPage from './CRUDPage'

const mockSemesters = [
  { id: '1', name: 'School of Engineering', code: 'ENG', description: 'Engineering and Technology' },
  { id: '2', name: 'School of Business', code: 'BUS', description: 'Business and Management' },
  // Add more mock data as needed
]

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'code' as const, header: 'Code' },
  { key: 'description' as const, header: 'Description' },
]

export default function Semesters() {
  const handleSave = (semester: typeof mockSemesters[0]) => {
    console.log('Save semester:', semester)
    // Implement the actual save logic here
  }

  const handleDelete = (semester: typeof mockSemesters[0]) => {
    console.log('Delete semester:', semester)
    // Implement the actual delete logic here
  }

  return (
    <CRUDPage
      title="Semesters"
      data={mockSemesters}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
