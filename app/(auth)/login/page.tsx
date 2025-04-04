'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { H1, Small, Subtle, Large } from "@/components/ui/typography"
import Link from "next/link"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { base_url } from "@/lib/constants"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useUserStore from "@/store/userStore"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

interface LoginFormData {
  email: string;
  password: string;
}

const LogIn = () => {
  // Check if user is already logged in
  useAuthRedirect();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [role, setRole] = useState("")
  const router = useRouter()
  const setUser = useUserStore(state => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${base_url}/auth/login`, {
        ...data,
        role
      });
  
      if (response.status === 200) {
        // No need to manually set localStorage anymore
        // Just update the Zustand store
        setUser({
          name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token,
          id: response.data.user.userId,
        });
        
        toast.success("Login successful!");
        router.push('/home');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
    }finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg shadow-xl relative">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              <H1>Log In to Your Account</H1>
            </CardTitle>
            <Subtle>Enter your credentials to access your account</Subtle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="text-sm font-medium">
                  <Small>Email</Small>
                </label>
                <Input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full"
                />
                {errors.email && (
                  <Small className="text-red-500">{errors.email.message}</Small>
                )}
              </motion.div>

                <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
                >
                <label htmlFor="password" className="text-sm font-medium">
                  <Small>Password</Small>
                </label>
                <div className="relative">
                  <Input
                  {...register("password", { required: "Password is required" })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pr-10"
                  />
                  <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  </button>
                </div>
                {errors.password && (
                  <Small className="text-red-500">{errors.password.message}</Small>
                )}
                </motion.div>

              <motion.div>
                <label htmlFor="role" className="text-sm font-medium">
                  <Small>Role</Small>
                </label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

                <Button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white"
                disabled={isSubmitting}
                >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    ></circle>
                    <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                  </div>
                ) : (
                  <Large>Log In</Large>
                )}
                </Button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Don&#39;t have an account? Sign Up</Small>
                </Link>
                {/* <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Forgot password?</Small>
                </Link> */}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LogIn