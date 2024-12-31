import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SemesterRegistration() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Semester Registration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Registration for the Fall 2024 semester is now open.</p>
          <Button>Start Registration</Button>
        </CardContent>
      </Card>
    </>
  )
}