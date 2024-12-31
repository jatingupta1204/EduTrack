import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Attendance() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Attendance Rate</span>
            <span className="text-sm font-medium">85%</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">You've attended 34 out of 40 classes this semester.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attendance by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {['Mathematics', 'Computer Science', 'Physics', 'English'].map((subject) => (
              <li key={subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{subject}</span>
                  <span className="text-sm font-medium">{Math.floor(Math.random() * 20 + 80)}%</span>
                </div>
                <Progress value={Math.floor(Math.random() * 20 + 80)} className="h-2" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}