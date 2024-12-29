import { Button } from "@/components/ui/button"
import { HelpCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

function Header() {
  return (
    <header className={cn("flex items-center justify-between p-4 bg-white text-gray-900 shadow-md")}>
      <div className="flex items-center space-x-2">
        <img src="/src/assets/Logo.png" alt="EduTrack Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold text-teal-600">EduTrack</h1>
      </div>
      <Button variant="outline" size="sm" className={cn("text-teal-600 border-teal-600 hover:bg-teal-50")}>
        <HelpCircle className="w-4 h-4 mr-2" />
        Help
      </Button>
    </header>
  )
}

export default Header;