import { useState, useEffect } from "react"
import CRUDPage from "./CRUDPage"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface BaseItem {
  id: string
  name: string
}

interface Semester extends BaseItem {
  academicYear: number
  type: string
  number: number
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  status: string
}

const columns: { key: keyof Semester; header: string }[] = [
  { key: "academicYear", header: "Academic Year" },
  { key: "type", header: "Type" },
  { key: "number", header: "Number" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "registrationStart", header: "Registration Start" },
  { key: "registrationEnd", header: "Registration End" },
  { key: "status", header: "Status" },
]

const TypeDropdown = ({ value, onChange }: { value: string; onChange: (type: string) => void }) => (
  <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">Select Type</option>
    <option value="Odd">Odd</option>
    <option value="Even">Even</option>
  </select>
)

const NumberDropdown = ({ type, value, onChange }: { type: string; value: number; onChange: (num: number) => void }) => {
  const options = type === "Odd" ? [1, 3, 5, 7] : [2, 4, 6, 8]
  return (
    <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={!type}>
      <option value="">Select Number</option>
      {options.map((num) => (
        <option key={num} value={num}>{num}</option>
      ))}
    </select>
  )
}

const StatusDropdown = ({ value, onChange }: { value: string; onChange: (status: string) => void }) => (
  <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">Select Status</option>
    <option value="Active">Active</option>
    <option value="Completed">Completed</option>
    <option value="Upcoming">Upcoming</option>
  </select>
)

// **Year Picker using React-Calendar**
const YearPicker = ({ value, onChange }: { value: number; onChange: (year: number) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-2 shadow-sm text-left focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Select Year"}
        <CalendarIcon className="w-5 h-5 text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-65 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <Calendar
            onChange={(date) => {
              if (date instanceof Date) {
                onChange(date.getFullYear());
              }
              setIsOpen(false);
            }}
            value={value ? new Date(Number(value), 0, 1) : new Date()}
            view="decade"
            onClickYear={(date) => {
              onChange(date.getFullYear());
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

// **Date Picker using React-Calendar**
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

export default function Semesters() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5

  useEffect(() => {
    fetchSemesters(currentPage)
  }, [currentPage])

  const fetchSemesters = async (page: number) => {
    try {
      const response = await fetch(`/api/v1/semesters/getAllSemester?page=${page}&limit=${pageSize}`)
      const data = await response.json()
      setSemesters(
        data.data.semester.map((s: Semester) => ({
          ...s,
          academicYear: s.academicYear,
          startDate: format(new Date(s.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(s.endDate), "yyyy-MM-dd"),
          registrationStart: format(new Date(s.registrationStart), "yyyy-MM-dd"),
          registrationEnd: format(new Date(s.registrationEnd), "yyyy-MM-dd"),
        }))
      )
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching semesters:", error)
    }
  }

  const handleSave = async (semester: Semester) => {
    try {
      const formattedSemester = {
        ...semester,
        startDate: semester.startDate ? new Date(semester.startDate).toISOString() : null,
        endDate: semester.endDate ? new Date(semester.endDate).toISOString() : null,
        registrationStart: semester.registrationStart ? new Date(semester.registrationStart).toISOString() : null,
        registrationEnd: semester.registrationEnd ? new Date(semester.registrationEnd).toISOString() : null,
      };

      const response = semester.id
        ? await fetch(`/api/v1/semesters/update/${semester.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedSemester),
          })
        : await fetch("/api/v1/semesters/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedSemester),
          })

      if (response.ok) {
        fetchSemesters(currentPage)
      }
    } catch (error) {
      console.error("Error saving semester:", error)
    }
  }

  const handleDelete = async (semester: { id: string }) => {
    try {
      const response = await fetch(`/api/v1/semesters/delete/${semester.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchSemesters(currentPage)
      }
    } catch (error) {
      console.error("Error deleting semester:", error)
    }
  }

  // Custom Form Renderer
  const renderForm = (semester: Semester, setSemester: (item: Semester) => void) => {
    return (
      <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Type</label>
          <TypeDropdown value={semester.type} onChange={(type) => setSemester({ ...semester, type, number: 0 })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Academic Year</label>
          <YearPicker value={semester.academicYear ? Number(semester.academicYear) : new Date().getFullYear()} onChange={(year) => setSemester({ ...semester, academicYear: year })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Number</label>
          <NumberDropdown type={semester.type} value={semester.number} onChange={(num) => setSemester({ ...semester, number: num })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <DatePicker value={semester.startDate} onChange={(date) => setSemester({ ...semester, startDate: date })} />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <DatePicker value={semester.endDate} onChange={(date) => setSemester({ ...semester, endDate: date })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Registration Start</label>
          <DatePicker value={semester.registrationStart} onChange={(date) => setSemester({ ...semester, registrationStart: date })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Registration End</label>
          <DatePicker value={semester.registrationEnd} onChange={(date) => setSemester({ ...semester, registrationEnd: date })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <StatusDropdown value={semester.status} onChange={(status) => setSemester({ ...semester, status })} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Semesters</h1>
      <CRUDPage 
        title="Semesters" 
        data={semesters} 
        columns={columns} 
        onSave={handleSave} 
        onDelete={handleDelete} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
        renderForm={renderForm} 
      />
    </div>
  )
}