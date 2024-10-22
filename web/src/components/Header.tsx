import { LifeBuoy } from "lucide-react";

function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-4 text-white">
            <div className="flex items-center space-x-4">
                <img src="/src/assets/Logo.png" alt="logo" className="w-10 h-10" />
                <span className="text-lg font-bold">EDUTRACK</span>
            </div>
            <nav className="flex items-center space-x-6">
                <a 
                    href="#signin" 
                    className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-white transition duration-300 shadow-md hover:shadow-lg"
                >
                    <LifeBuoy className="mr-2" />
                    <span className="font-medium">Help</span>
                </a>
            </nav>
        </header>
    );
}

export default Header;
