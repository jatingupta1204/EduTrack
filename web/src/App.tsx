import Header from "./components/Header"
import Updates from "./components/Updates"
import Login from "./Login"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 to-blue-900">
      <Header />
      <div className="flex w-full">
        <div className="w-1/2">
          <Login />
        </div>
        <div className="w-1/2">
          <Updates />
        </div>
      </div>
    </div>
  )
}

export default App
