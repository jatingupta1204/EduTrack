import { useState, useEffect } from "react";
import CRUDPage from "./CRUDPage";

interface Admin {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
    password?: string;
    role: string;
}

const columns = [
  { key: "first_name" as const, header: "First Name" },
  { key: "last_name" as const, header: "Last Name" },
  { key: "email" as const, header: "Email" },
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const generateUsername = (first_name: string, last_name: string) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000) // Random 4-digit number
    return `${first_name.toLowerCase()}.${last_name.toLowerCase()}${randomNumber}`
  }

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`/api/v1/users/getAllUser?page=${currentPage}&role=Admin`);
      const data = await response.json();

      if (!data?.data?.user) {
        console.error("Invalid API response:", data);
        return;
      }

      setAdmins(
        data.data.user
          .filter((user: { role: string }) => user.role === "Admin") // Ensure only Admin users
          .map((admin: Admin) => ({
            ...admin,
            id: admin.id || "",
            first_name: admin.first_name || "Unknown",
            last_name: admin.last_name || "Unknown",
            username: admin.username || generateUsername(admin.first_name, admin.last_name), // Generate if missing
          }))
      );
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleSave = async (admin: Admin) => {
    try {
      const isNewAdmin = !admin.id;

      const adminData = isNewAdmin
        ? {
            ...admin,
            username: generateUsername(admin.first_name, admin.last_name), // Generate username for new admin
            password: "admin@123", // Default password
            role: "Admin", // Ensure role is Admin
          }
        : admin;

      const response = isNewAdmin
        ? await fetch("/api/v1/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData),
          })
        : await fetch(`/api/v1/users/update/${admin.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admin),
          });

      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };


  const handleDelete = async (admin: Admin) => {
    try {
      const response = await fetch(`/api/v1/users/delete/${admin.id}`, { method: "DELETE" });
      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderForm = (admin: Admin, setAdmin: (item: Admin) => void) => {
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto p-2">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={admin.first_name}
            onChange={(e) => setAdmin({ ...admin, first_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={admin.last_name}
            onChange={(e) => setAdmin({ ...admin, last_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Admins</h1>
      <CRUDPage
        title="Admins"
        data={admins}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        renderForm={renderForm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
