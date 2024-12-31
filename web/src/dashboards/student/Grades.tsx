import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Grades() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Grades</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current GPA</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-teal-600">3.7</p>
          <p className="text-sm text-gray-500 mt-2">Your GPA for this semester is 3.7 out of 4.0</p>
        </CardContent>
      </Card>
    </>
  )
}