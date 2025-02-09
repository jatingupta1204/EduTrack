import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

const mockBatches = [
  { id: '1', name: 'CS2023', departmentId: '1', semesterId: '1', capacity: 50, coordinatorId: '1' },
  { id: '2', name: 'EE2023', departmentId: '2', semesterId: '1', capacity: 40, coordinatorId: '2' },
  // Add more mock data as needed
]

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'departmentId' as const, header: 'Department' },
  { key: 'semesterId' as const, header: 'Semester' },
  { key: 'capacity' as const, header: 'Capacity' },
  { key: 'coordinatorId' as const, header: 'Coordinator' },
]

export default function Batches() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentBatch, setCurrentBatch] = useState<Partial<typeof mockBatches[0]>>({})

  const handleCreate = () => {
    setCurrentBatch({})
    setIsDialogOpen(true)
  }

  const handleEdit = (batch: typeof mockBatches[0]) => {
    setCurrentBatch(batch)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    console.log('Save batch:', currentBatch)
    // Implement the actual save logic here
    setIsDialogOpen(false)
  }

  const handleDelete = (batch: typeof mockBatches[0]) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      console.log('Delete batch:', batch)
      // Implement the actual delete logic here
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Batches</h1>
      <DataTable
        data={mockBatches}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBatch.id ? 'Edit Batch' : 'Create Batch'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentBatch.name || ''}
                onChange={(e) => setCurrentBatch({ ...currentBatch, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={currentBatch.departmentId}
                onValueChange={(value) => setCurrentBatch({ ...currentBatch, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Computer Science</SelectItem>
                  <SelectItem value="2">Electrical Engineering</SelectItem>
                  {/* Add more departments as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={currentBatch.semesterId}
                onValueChange={(value) => setCurrentBatch({ ...currentBatch, semesterId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Fall 2023</SelectItem>
                  <SelectItem value="2">Spring 2024</SelectItem>
                  {/* Add more semesters as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={currentBatch.capacity || ''}
                onChange={(e) => setCurrentBatch({ ...currentBatch, capacity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="coordinator">Coordinator</Label>
              <Select
                value={currentBatch.coordinatorId}
                onValueChange={(value) => setCurrentBatch({ ...currentBatch, coordinatorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select coordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                  {/* Add more coordinators as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}