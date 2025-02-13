import { useState, useEffect } from "react";
import CRUDPage from "./CRUDPage";
import { CalendarIcon } from "lucide-react";
import Calendar from "react-calendar";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  departmentId: string;
  admissionYear: number;
  currentSemester: number;
  batchId: string;
  status: "Active" | "Inactive" | "Graduated" | "Suspended";
}

interface Department {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
}

const columns = [
  { key: "first_name" as const, header: "First Name" },
  { key: "last_name" as const, header: "Last Name" },
  { key: "email" as const, header: "Email" },
  { key: "departmentId" as const, header: "Department" },
  { key: "batchId" as const, header: "Batch" },
  { key: "admissionYear" as const, header: "Admission Year" },
  { key: "currentSemester" as const, header: "Current Semester" },
  { key: "status" as const, header: "Status" },
];

const YearPicker = ({ value, onChange }: { value: number | null; onChange: (year: number) => void }) => {
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
            value={value ? new Date(value, 0, 1) : new Date()}
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

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      fetchStudents();
    }
  }, [currentPage, dataLoaded]);

  const fetchMetadata = async () => {
    try {
      const [deptRes, batchRes] = await Promise.all([
        fetch("/api/v1/departments/getAllDepartment?paginate=false"),
        fetch("/api/v1/batches/getAllBatch?paginate=false"),
      ]);
      const [deptData, batchData] = await Promise.all([
        deptRes.json(),
        batchRes.json(),
      ]);
      setDepartments(deptData.data?.department || []);
      setBatches(batchData.data?.batch || []);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/v1/users/getAllUser?page=${currentPage}`);
      const data = await response.json();
      setStudents(
        data.data.user
          .filter((user: { role: string }) => user.role === "Student") // Only fetch students
          .map((student: Student) => ({
            ...student,
            id: student.id || "",
            departmentId: departments.find((d) => d.id === student.departmentId)?.name || "Unknown",
            batchId: batches.find((b) => b.id === student.batchId)?.name || "Unknown",
            status: student.status || "Active",
          }))
      );
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSave = async (student: Student) => {
    try {
      const payload = {
        ...student,
        departmentId: departments.find((d) => d.name === student.departmentId)?.id || "",
        batchId: batches.find((b) => b.name === student.batchId)?.id || "",
      };

      const response = student.id
        ? await fetch(`/api/v1/users/update/${student.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/v1/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDelete = async (student: Student) => {
    try {
      const response = await fetch(`/api/v1/users/delete/${student.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        fetchStudents(); // Refresh student list after successful deletion
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  

  const renderForm = (student: Student, setStudent: (item: Student) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input type="text" className="w-full border rounded p-2" value={student.first_name} onChange={(e) => setStudent({ ...student, first_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input type="text" className="w-full border rounded p-2" value={student.last_name} onChange={(e) => setStudent({ ...student, last_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full border rounded p-2" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Department</label>
          <select className="w-full border rounded p-2" value={student.departmentId} onChange={(e) => setStudent({ ...student, departmentId: e.target.value })}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Batch</label>
          <select className="w-full border rounded p-2" value={student.batchId} onChange={(e) => setStudent({ ...student, batchId: e.target.value })}>
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>{batch.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Admission Year</label>
          <YearPicker value={student.admissionYear || null} onChange={(year) => setStudent({ ...student, admissionYear: year })} />
        </div>
        <div>
          <label className="block text-sm font-medium">Current Semester</label>
          <select className="w-full border rounded p-2" value={student.currentSemester || ""} onChange={(e) => setStudent({ ...student, currentSemester: Number(e.target.value) })}>
            <option value="">Select Semester</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select className="w-full border rounded p-2" value={student.status || ""} onChange={(e) => setStudent({ ...student, status: e.target.value as Student["status"] })}>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Students</h1>
      <CRUDPage 
        title="Manage Students" 
        data={students} 
        columns={columns} 
        onSave={handleSave} 
        onDelete={handleDelete} 
        renderForm={renderForm} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  ) 
}