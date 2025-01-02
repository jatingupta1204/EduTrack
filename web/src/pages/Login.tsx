import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CircleUserRound, Lock } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { handleError } from "@/utils/errorAndSuccess"
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required")
});

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: ''
  })

  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      loginSchema.parse(loginInfo);
      setErrors({});
      const url = '/api/v1/users/login';
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, error } = result;
      if(success){
        setTimeout(() => {
          if(result.data.role == "Student"){
            console.log(result.data.role);
            navigate('/dashboard')
          }else if(result.data.role == "Admin"){
            navigate('/dashboard/admin')
          }else if(result.data.role == "SuperAdmin"){
            navigate('/dashboard/superadmin')
          }
        }, 1000)
      }else if(error){
        const details = error?.details[0].message || 'An error occurred';
        return handleError(details);
      }else if(!success){
        return handleError(message);
      }
    } catch (ZodError) {
      if(ZodError instanceof z.ZodError){
        const fieldError = ZodError.flatten().fieldErrors;
        setErrors({
          username: fieldError.username?.[0],
          password: fieldError.password?.[0]
        });
      }else{
        handleError('Invalid User Credentials');
      }
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto overflow-hidden")}>
      <div className={cn("bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-white text-center")}>
        <CircleUserRound className={cn("w-20 h-20 mx-auto mb-4")} />
        <h2 className={cn("text-3xl font-bold mb-2")}>Welcome Back</h2>
        <p className={cn("text-teal-100")}>Sign in to access your account</p>
      </div>
      <CardContent className={cn("p-8")}>
        <form className={cn("space-y-6")} onSubmit={handleLoginIn}>
          <div className={cn("space-y-2")}>
            <Label htmlFor="username" className={cn("text-sm font-medium text-gray-700")}>Username</Label>
            <div className={cn("relative")}>
              <Input
                onChange={handleChange}
                type="text"
                name="username"
                placeholder="Enter your username"
                className={cn("pl-10 w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500")}
                value={loginInfo.username}
              />
              <CircleUserRound className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400")} size={18} />
            </div>
            {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
          </div>

          <div className={cn("space-y-2")}>
            <Label htmlFor="password" className={cn("text-sm font-medium text-gray-700")}>Password</Label>
            <div className={cn("relative")}>
              <Input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password"
                className={cn("pl-10 w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500")}
                value={loginInfo.password}
              />
              <Lock className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400")} size={18} />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit" className={cn("w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg")}>
            Sign In
          </Button>
        </form>

        <div className={cn("flex items-center justify-between mt-6 text-sm")}>
          <div className={cn("flex items-center space-x-2")}>
            <Checkbox id="remember" />
            <label htmlFor="remember" className={cn("text-gray-600")}>Remember Me</label>
          </div>
          <a href="#" className={cn("text-teal-600 hover:underline")}>Forgot password?</a>
        </div>
      </CardContent>
    </Card>
  )
}

export default Login;