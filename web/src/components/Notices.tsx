import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const notices = [
  { id: 1, title: "Exam Schedule Update", content: "Mid-term exams postponed by one week." },
  { id: 2, title: "Library Closure", content: "Library will be closed for renovation next weekend." },
  { id: 3, title: "New Course Offering", content: "Introduction to AI course now available for enrollment." },
  { id: 4, title: "Campus Event", content: "Annual tech fest 'Innovate 2024' dates announced." },
  { id: 5, title: "Scholarship Opportunity", content: "Applications open for merit-based scholarships." },
  { id: 6, title: "Career Fair", content: "Upcoming career fair with top tech companies next month." },
];

function Notices() {
  return (
    <Card className={cn("w-full max-w-md mx-auto")}>
      <CardHeader className={cn("bg-gradient-to-r from-teal-500 to-teal-600 text-white")}>
        <CardTitle className={cn("text-2xl font-bold text-center")}>Latest Notices</CardTitle>
        <p className={cn("text-center text-sm text-teal-100 mt-2")}>Check out the latest updates and notifications.</p>
      </CardHeader>
      <CardContent className={cn("p-4")}>
        <div className={cn("space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide")}>
          {notices.map((notice) => (
            <div key={notice.id} className={cn("bg-white p-4 rounded-lg shadow-md border border-gray-200")}>
              <h3 className={cn("font-semibold text-gray-900 mb-2")}>{notice.title}</h3>
              <p className={cn("text-gray-600 text-sm")}>{notice.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Notices;