import CRUDPage from './CRUDPage'

const mockCourses = [
  { id: '1', code: 'CS101', title: 'Introduction to Programming', description: 'Basic programming concepts', credits: 3, lecture_classes: 3, tutorial_classes: 1, practical_classes: 2, semesterNumber: 1, departmentId: '1' },
  { id: '2', code: 'CS201', title: 'Data Structures', description: 'Advanced data structures', credits: 4, lecture_classes: 3, tutorial_classes: 1, practical_classes: 2, semesterNumber: 3, departmentId: '1' },
  // Add more mock data as needed
]

const columns = [
  { key: 'code' as const, header: 'Code' },
  { key: 'title' as const, header: 'Title' },
  { key: 'credits' as const, header: 'Credits' },
  { key: 'semesterNumber' as const, header: 'Semester' },
  { key: 'departmentId' as const, header: 'Department ID' },
]

export default function Courses() {
  const handleSave = (course: typeof mockCourses[0]) => {
    console.log('Save course:', course)
    // Implement the actual save logic here
  }

  const handleDelete = (course: typeof mockCourses[0]) => {
    console.log('Delete course:', course)
    // Implement the actual delete logic here
  }

  return (
    <CRUDPage
      title="Courses"
      data={mockCourses}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
