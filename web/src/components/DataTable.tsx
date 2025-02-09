import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Plus } from 'lucide-react'

interface DataTableProps<T> {
  data: T[]
  columns: { key: keyof T; header: string }[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onCreate: () => void
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  totalPages,
  currentPage,
  onPageChange
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter((item) =>
    Object.values(item as Record<string, unknown>).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key.toString()}>{column.header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key.toString()}>
                  {item[column.key] as string}
                </TableCell>
              ))}
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(item)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div>Page {currentPage} of {totalPages}</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {currentPage}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
