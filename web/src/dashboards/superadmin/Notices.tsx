import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { CalendarIcon } from "lucide-react"
import CRUDPage from "./CRUDPage"
import { format } from "date-fns"

interface Notice {
  id: string
  title: string
  description: string
  date: string
}

const columns = [
  { key: "title" as const, header: "Title" },
  { key: "description" as const, header: "Description" },
  { key: "date" as const, header: "Date" },
]

const DatePicker = ({ value, onChange }: { value: string; onChange: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-2 shadow-sm text-left focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Select Date"}
        <CalendarIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-65 bg-white border border-gray-200 rounded-lg shadow-lg">
          <Calendar
            onChange={(date) => {
              if (date instanceof Date) {
                setSelectedDate(date)
                onChange(format(date, "yyy-MM-dd"))
              }
              setIsOpen(false)
            }}
            value={selectedDate || new Date()}
          />
        </div>
      )}
    </div>
  )
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchNotices()
  }, [currentPage])

  const fetchNotices = async () => {
    try {
      const response = await fetch(`/api/v1/notices/getAllNotice?page=${currentPage}`)
      const data = await response.json()
      setNotices(
        data.data.notice.map((n: Notice) => ({
          ...n,
          date: format(new Date(n.date), "yyyy-MM-dd"),
        }))
      )
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching notices:", error)
    }
  }

  const handleSave = async (notice: Notice) => {
    try {
      const formattedNotice = {
        ...notice,
        date: notice.date ? new Date(notice.date).toISOString() : null,
      }

      const response = notice.id
        ? await fetch(`/api/v1/notices/update/${notice.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedNotice),
          })
        : await fetch("/api/v1/notices/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedNotice),
          })

      if (response.ok) {
        fetchNotices()
      }
    } catch (error) {
      console.error("Error saving notice:", error)
    }
  }

  const handleDelete = async (notice: { id: string }) => {
    try {
      const response = await fetch(`/api/v1/notices/delete/${notice.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchNotices()
      }
    } catch (error) {
      console.error("Error deleting notice:", error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderForm = (notice: Notice, setNotice: (item: Notice) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={notice.title}
            onChange={(e) => setNotice({ ...notice, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={notice.description}
            onChange={(e) => setNotice({ ...notice, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <DatePicker
            value={notice.date}
            onChange={(date) => setNotice({ ...notice, date: date })}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Notices</h1>
      <CRUDPage
        title="Notices"
        data={notices}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        renderForm={renderForm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}