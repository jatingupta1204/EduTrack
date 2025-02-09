import { useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '../../components/ui/alert-dialog'

interface BaseItem {
  id: string
  name: string
}

interface CRUDPageProps<T extends BaseItem> {
  title: string
  data: T[]
  columns: { key: keyof T; header: string }[]
  onSave: (item: T) => void
  onDelete: (item: T) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function CRUDPage<T extends BaseItem>({ 
  title, 
  data, 
  columns, 
  onSave, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange 
}: CRUDPageProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<T>>({})
  const [deleteItem, setDeleteItem] = useState<T | null>(null) // Track delete item

  const handleCreate = () => {
    setCurrentItem({} as T) // Ensure type safety
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

  return (
    <div className="space-y-6">
      <DataTable
        data={data}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteItem(item)} // Open delete modal
        onCreate={handleCreate}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Create/Edit Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to delete <strong>{deleteItem?.name}</strong>?</p>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(deleteItem!); setDeleteItem(null) }}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}