import CRUDPage from './CRUDPage'

const mockNotices = [
  { id: '1', title: 'Exam Schedule', description: 'Final exam schedule for Fall 2023', date: '2023-12-01' },
  { id: '2', title: 'Holiday Announcement', description: 'University will be closed for winter break', date: '2023-12-15' },
  // Add more mock data as needed
]

const columns = [
  { key: 'title' as const, header: 'Title' },
  { key: 'description' as const, header: 'Description' },
  { key: 'date' as const, header: 'Date' },
]

export default function Notices() {
  const handleSave = (notice: typeof mockNotices[0]) => {
    console.log('Save notice:', notice)
    // Implement the actual save logic here
  }

  const handleDelete = (notice: typeof mockNotices[0]) => {
    console.log('Delete notice:', notice)
    // Implement the actual delete logic here
  }

  return (
    <CRUDPage
      title="Notices"
      data={mockNotices}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
