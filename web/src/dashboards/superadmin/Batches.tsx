import { useState, useEffect } from "react"
import CRUDPage from "./CRUDPage"

interface Batch {
  id: string
  name: string
  departmentId: string
  semesterId: string
  capacity: number
  coordinatorId: string
}

interface Department {
  id: string
  name: string
}

interface Semester {
  id: string
  name: string
}

interface Coordinator {
  id: string
  name: string
}

const columns = [
  { key: "name" as const, header: "Name" },
  { key: "departmentId" as const, header: "Department" },
  { key: "semesterId" as const, header: "Semester" },
  { key: "capacity" as const, header: "Capacity" },
  { key: "coordinatorId" as const, header: "Coordinator" },
]

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    fetchMetadata()
  }, [])

  useEffect(() => {
    if (dataLoaded) {
      fetchBatches()
    }
  }, [currentPage, dataLoaded])

  const fetchMetadata = async () => {
    try {
      const [deptRes, semRes, coordRes] = await Promise.all([
        fetch("/api/v1/departments/getAllDepartment?paginate=false"),
        fetch("/api/v1/semesters/getAllSemester?paginate=false"),
        fetch("/api/v1/users/getAllUser?paginate=false"),
      ])
      const [deptData, semData, coordData] = await Promise.all([
        deptRes.json(),
        semRes.json(),
        coordRes.json(),
      ])

      setDepartments(deptData.data?.department)
      setSemesters(
        semData.data?.semester?.map((sem: { id: string; number: number }) => ({
          id: sem.id,
          name: `${sem.number}`, // Converting number to string for dropdown compatibility
        })) || []
      );
      setCoordinators(
        coordData.data?.user
        ?.filter((user: { role: string }) => user.role === "Admin")
        .map((user: { id: string; first_name: string; last_name: string }) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
      })) || []
    );
      setDataLoaded(true)
    } catch (error) {
      console.error("Error fetching metadata:", error)
    }
  }

  const fetchBatches = async () => {
    try {
      const response = await fetch(`/api/v1/batches/getAllBatch?page=${currentPage}`);
      const data = await response.json();
  
      setBatches(
        data.data.batch.map((batch: Batch) => ({
          ...batch,
          departmentId: departments.find((d) => d.id === batch.departmentId)?.name || "Unknown",
          semesterId: semesters.find((s) => s.id === batch.semesterId)?.name || "Unknown",
          coordinatorId: coordinators.find((c) => c.id === batch.coordinatorId)
            ? `${coordinators.find((c) => c.id === batch.coordinatorId)?.name}`
            : "Unknown",
        }))
      );
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };
  
  

  const handleSave = async (batch: Batch) => {
    if (batch.capacity > 50) {
      alert("Capacity cannot exceed 50.");
      return;
    }

    try {
      const payload = {
        ...batch,
        departmentId: departments.find((d) => d.name === batch.departmentId)?.id || "",
        semesterId: semesters.find((s) => s.name === batch.semesterId)?.id || "",
        coordinatorId: coordinators.find((c) => c.name === batch.coordinatorId)?.id || "", // Convert name back to ID
      };
  
      const response = batch.id
        ? await fetch(`/api/v1/batches/update/${batch.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/v1/batches/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
      if (response.ok) {
        fetchBatches();
      }
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };  

  const handleDelete = async (batch: Batch) => {
    try {
      const response = await fetch(`/api/v1/batches/delete/${batch.id}`, { method: "DELETE" })
      if (response.ok) {
        fetchBatches()
      }
    } catch (error) {
      console.error("Error deleting batch:", error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const Dropdown = ({
    value,
    onChange,
    options,
    label,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: { id: string; name: string }[];
    label: string;
  }) => (
    <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{`Select ${label}`}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name} {/* Displays full name but stores ID */}
        </option>
      ))}
    </select>
  );
  

  const renderForm = (batch: Batch, setBatch: (item: Batch) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={batch.name}
            onChange={(e) => setBatch({ ...batch, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <Dropdown
            value={batch.departmentId}
            onChange={(id) => setBatch({ ...batch, departmentId: id })}
            options={departments}
            label="Department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Semester</label>
          <Dropdown
            value={batch.semesterId}
            onChange={(id) => setBatch({ ...batch, semesterId: id })}
            options={semesters}
            label="Semester"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={batch.capacity}
            onChange={(e) => {
              const newCapacity = Number(e.target.value);
              if (newCapacity <= 50) {
                setBatch({ ...batch, capacity: newCapacity });
              } else {
                alert("Capacity cannot exceed 50.");
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Coordinator</label>
          <Dropdown
            value={batch.coordinatorId}
            onChange={(id) => setBatch({ ...batch, coordinatorId: id })}
            options={coordinators}
            label="Coordinator"
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Batches</h1>
      <CRUDPage 
        title="Batches" 
        data={batches} 
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