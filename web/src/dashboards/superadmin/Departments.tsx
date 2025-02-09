import CRUDPage from './CRUDPage'

const mockDepartments = [
  { id: '1', name: 'Computer Science', code: 'CS', description: 'Computer Science and Engineering', schoolId: '1' },
  { id: '2', name: 'Electrical Engineering', code: 'EE', description: 'Electrical and Electronic Engineering', schoolId: '1' },
  // Add more mock data as needed
]

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'code' as const, header: 'Code' },
  { key: 'description' as const, header: 'Description' },
  { key: 'schoolId' as const, header: 'School ID' },
]

export default function Departments() {
  const handleSave = (department: typeof mockDepartments[0]) => {
    console.log('Save department:', department)
    // Implement the actual save logic here
  }

  const handleDelete = (department: typeof mockDepartments[0]) => {
    console.log('Delete department:', department)
    // Implement the actual delete logic here
  }

  return (
    <CRUDPage
      title="Departments"
      data={mockDepartments}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
