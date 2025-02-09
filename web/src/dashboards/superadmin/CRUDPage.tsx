import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

interface CRUDPageProps<T> {
  title: string
  data: T[]
  columns: { key: keyof T; header: string }[]
  onSave: (item: T) => void
  onDelete: (item: T) => void
}

export default function CRUDPage<T extends { id: string }>({ 
  title, 
  data, 
  columns, 
  onSave, 
  onDelete 
}: CRUDPageProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<T>>({})

  const handleCreate = () => {
    setCurrentItem({})
    setIsDialogOpen(true)
  }

  const handleEdit = (item: T) => {
    setCurrentItem(item)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    onSave(currentItem as T)
    setIsDialogOpen(false)
  }

  const handleDelete = (item: T) => {
    if (window.confirm(`Are you sure you want to delete this ${title.slice(0, -1)}?`)) {
      onDelete(item)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <DataTable
        data={data}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem.id ? `Edit ${title.slice(0, -1)}` : `Create ${title.slice(0, -1)}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {columns.map((column) => (
              <div key={column.key.toString()}>
                <Label htmlFor={column.key.toString()}>{column.header}</Label>
                <Input
                  id={column.key.toString()}
                  value={currentItem[column.key] as string || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, [column.key]: e.target.value })}
                />
              </div>
            ))}
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
