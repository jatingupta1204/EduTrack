import Header from "./components/Header"
import Login from "./pages/Login"
import Notices from "./pages/Notices"
import { cn } from "@/lib/utils"
import { ToastProvider } from "./utils/toastProvider"

function App() {
  return (
    <div className={cn("min-h-screen flex flex-col bg-gray-100")}>
      <ToastProvider />
      <Header />
      <main className={cn("flex-grow flex items-center justify-center p-4")}>
        <div className={cn("w-full max-w-6xl grid md:grid-cols-2 gap-8")}>
          <Login />
          <Notices />
        </div>
      </main>
    </div>
  )
}

export default App;