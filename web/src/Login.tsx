import { CircleUserRound } from "lucide-react";
import { Button } from "./components/ui/button"

function Login() {
    return (
        <div className="flex items-center justify-center my-14">
            <div className="p-8 rounded-lg shadow-lg w-full max-w-md h-[500px] bg-white text-gray-800">
                <div className="flex justify-center mb-6">
                    <CircleUserRound className="w-24 h-24 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>
                {/* Username Field */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        name="Username"
                        id="Username"
                        className="w-full px-4 py-2 text-gray-800 bg-transparent border-b-2 border-blue-500 placeholder-transparent focus:outline-none focus:ring-0 peer"
                        placeholder="Username"
                    />
                    <label
                        htmlFor="Username"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-400 peer-focus:text-xs px-1"
                    >
                        Username
                    </label>
                </div>
                {/* Password Field */}
                <div className="relative mb-6">
                    <input
                        type="password"
                        name="Password"
                        id="Password"
                        className="w-full px-4 py-2 text-gray-800 bg-transparent border-b-2 border-blue-500 placeholder-transparent focus:outline-none focus:ring-0 peer"
                        placeholder="Password"
                    />
                    <label
                        htmlFor="Password"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-400 peer-focus:text-xs px-1"
                    >
                        Password
                    </label>
                </div>
                {/* Login Button */}
                <div className="flex justify-center mb-6">
                    <Button>
                        Login
                    </Button>
                </div>
                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="Remember_Me"
                            id="Remember_Me"
                            className="mr-2"
                        />
                        <label htmlFor="Remember_Me" className="text-sm">
                            Remember Me
                        </label>
                    </div>
                    <a href="#" className="text-blue-400 hover:text-blue-500 text-sm">
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;
