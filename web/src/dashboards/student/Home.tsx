import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome, John!</h1>
      
      {/* Attendance Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Attendance</span>
            <span className="text-sm font-medium">85%</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">You've attended 34 out of 40 classes this semester.</p>
        </CardContent>
      </Card>

      {/* Grades Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Current GPA</p>
              <p className="text-3xl font-bold text-teal-600">3.7</p>
              <p className="text-xs text-gray-500">out of 4.0</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Last Semester GPA</p>
              <p className="text-3xl font-bold text-teal-600">3.5</p>
              <p className="text-xs text-gray-500">out of 4.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Database Management</p>
                <p className="text-sm text-gray-500">Mid-term Exam</p>
              </div>
              <p className="text-sm font-medium">May 15, 2024</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Web Development</p>
                <p className="text-sm text-gray-500">Project Submission</p>
              </div>
              <p className="text-sm font-medium">May 20, 2024</p>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Algorithms</p>
                <p className="text-sm text-gray-500">Quiz</p>
              </div>
              <p className="text-sm font-medium">May 22, 2024</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}