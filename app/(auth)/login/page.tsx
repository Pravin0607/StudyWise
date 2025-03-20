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

  const onSubmit = async (data: LoginFormData) => {
    try {
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
          token: response.data.token
        });
        
        toast.success("Login successful!");
        router.push('/home');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
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
                <Input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                />
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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <Button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white"
              >
                <Large>Log In</Large>
              </Button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Don&#39;t have an account? Sign Up</Small>
                </Link>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Forgot password?</Small>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LogIn