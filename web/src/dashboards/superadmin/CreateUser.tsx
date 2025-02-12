import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

interface User {
  first_name: string
  last_name: string
  email: string
  role: string
  departmentId: number | null
  admissionYear: number | null
  currentSemester: number | null
  batchId: number | null
  username: string
  password: string
}

export default function CreateUsers() {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<User[]>([])
  const [skippedUsers, setSkippedUsers] = useState<User[]>([]) // State for skipped users
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const generateUsername = (first_name: string, last_name: string) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000) // Random 4-digit number
    return `${first_name.toLowerCase()}.${last_name.toLowerCase()}${randomNumber}`
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split("\n").map((line) => line.trim()).filter((line) => line.length > 0)
      const expectedHeaders = ["first_name", "last_name", "email", "role", "departmentId", "admissionYear", "currentSemester", "batchId", "username", "password"];
      const headers = lines[0].split(",").map((h) => h.trim())

      const isValidCSV = expectedHeaders.every(header => headers.includes(header));
      if (!isValidCSV) {
        setMessage("Invalid CSV format. Please use the correct template.");
        return;
      }

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        return {
          first_name: values[0],
          last_name: values[1],
          email: values[2],
          role: values[3] || "Student",
          departmentId: values[4] ? parseInt(values[4]) : null,
          admissionYear: values[5] ? parseInt(values[5]) : null,
          currentSemester: values[6] ? parseInt(values[6]) : null,
          batchId: values[7] ? parseInt(values[7]) : null,
          username: generateUsername(values[0], values[1]),
          password: values[8] || "Student@123"
        }
      })

      setPreviewData(data) // Preview first 5 rows
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);
    setSkippedUsers([]); // Reset skipped users state

    try {
        const response = await fetch("/api/v1/users/bulkCreate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: previewData })
        });

        const result = await response.json();
        console.log("Upload response:", result); // Debugging

        // Handle skipped users even if the response is an error (statusCode 400)
        if (result.data?.skippedEmails?.length > 0) {
            console.log("Skipped Emails:", result.data.skippedEmails); // Debugging
            const skipped = previewData.filter(user => 
                result.data.skippedEmails.includes(user.email)
            );
            setSkippedUsers(skipped);
            console.log("Skipped Users State:", skipped);
        }

        if (response.ok) {
            setMessage(result.message || "Users uploaded successfully.");
            setPreviewData([]);
            setFile(null);
        } else {
            setMessage(result.message || "Failed to upload students.");
        }
    } catch (error: any) {
        setMessage(error.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Create Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <Button onClick={handleUpload} disabled={!file || loading}>
              {loading ? "Uploading..." : "Upload and Process"}
            </Button>
            {message && <p className="text-sm font-medium">{message}</p>}
          </div>
        </CardContent>
      </Card>

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Admission Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((student, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.role}</TableCell>
                    <TableCell>{student.departmentId || "N/A"}</TableCell>
                    <TableCell>{student.admissionYear || "N/A"}</TableCell>
                    <TableCell>{student.currentSemester || "N/A"}</TableCell>
                    <TableCell>{student.batchId || "N/A"}</TableCell>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {skippedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skipped Users (Already Exists)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skippedUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell className="text-red-500">{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}