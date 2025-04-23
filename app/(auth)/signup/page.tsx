'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { H1, Small, Subtle, Large } from "@/components/ui/typography"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { base_url } from "@/lib/constants"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import Link from "next/link";
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: string;
  password: string;
  confirmPassword: string;
}

const validatePassword = (value: string, password: string) => {
  if (!value) {
    return "Confirm password is required";
  }
  if (value !== password) {
    return "Passwords do not match";
  }
  return true;
};

const SignIn = () => {
  // Check if user is already logged in
  useAuthRedirect();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>();
  const [role, setRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting Data : ",data)
      const response = await axios.post(`${base_url}/auth/register`, {
        ...data,
        role
      });
  
      if (response.status === 200) {
        toast.success("Account created successfully!");
        window.location.href = "/login";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
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
                          <H1>Create an Account</H1>
                      </CardTitle>
                      <Subtle>Enter your details to get started</Subtle>
                  </CardHeader>
                  <CardContent>
                      <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-6"
                      >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <motion.div
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="space-y-2"
                              >
                                  <label
                                      htmlFor="firstName"
                                      className="text-sm font-medium"
                                  >
                                      <Small>First Name</Small>
                                  </label>
                                  <Input
                                      {...register("firstName", {
                                          required: "First name is required",
                                      })}
                                      type="text"
                                      placeholder="John"
                                      className="w-full transition-colors focus:border-blue-500"
                                  />
                                  {errors.firstName && (
                                      <Small className="text-red-500">
                                          {errors.firstName.message}
                                      </Small>
                                  )}
                              </motion.div>
                              <motion.div
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="space-y-2"
                              >
                                  <label
                                      htmlFor="lastName"
                                      className="text-sm font-medium"
                                  >
                                      <Small>Last Name</Small>
                                  </label>
                                  <Input
                                      {...register("lastName", {
                                          required: "Last name is required",
                                      })}
                                      type="text"
                                      placeholder="Doe"
                                      className="w-full transition-colors focus:border-blue-500"
                                  />
                                  {errors.lastName && (
                                      <Small className="text-red-500">
                                          {errors.lastName.message?.toString()}
                                      </Small>
                                  )}
                              </motion.div>
                          </div>

                          <motion.div
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-2"
                          >
                              <label
                                  htmlFor="email"
                                  className="text-sm font-medium"
                              >
                                  <Small>Email</Small>
                              </label>
                              <Input
                                  {...register("email", {
                                      required: "Email is required",
                                  })}
                                  type="email"
                                  placeholder="you@example.com"
                                  className="w-full transition-colors focus:border-blue-500"
                              />
                              {errors.email && (
                                  <Small className="text-red-500">
                                      {errors.email.message?.toString()}
                                  </Small>
                              )}
                          </motion.div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <motion.div
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="space-y-2"
                              >
                                  <label
                                      htmlFor="mobile"
                                      className="text-sm font-medium"
                                  >
                                      <Small>Mobile No</Small>
                                  </label>
                                  <Input
                                      {...register("mobile", {
                                          required: "Mobile number is required",
                                      })}
                                      type="tel"
                                      placeholder="+91 9876543210"
                                      className="w-full transition-colors focus:border-blue-500"
                                  />
                                  {errors.mobile && (
                                      <Small className="text-red-500">
                                          {errors.mobile.message?.toString()}
                                      </Small>
                                  )}
                              </motion.div>
                              <motion.div
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5 }}
                                  className="space-y-2"
                              >
                                  <label
                                      htmlFor="dob"
                                      className="text-sm font-medium"
                                  >
                                      <Small>Date of Birth</Small>
                                  </label>
                                  <Input
                                      {...register("dob", {
                                          required: "Date of birth is required",
                                      })}
                                      type="date"
                                      className="w-full transition-colors focus:border-blue-500"
                                  />
                                  {errors.dob && (
                                      <Small className="text-red-500">
                                          {errors.dob.message?.toString()}
                                      </Small>
                                  )}
                              </motion.div>
                          </div>

                          <motion.div
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-2"
                          >
                              <label
                                  htmlFor="password"
                                  className="text-sm font-medium"
                              >
                                  <Small>Password</Small>
                              </label>
                              <Input
                                  {...register("password", {
                                      required: "Password is required",
                                      minLength: {
                                          value: 8,
                                          message:
                                              "Password must be at least 8 characters long",
                                      },
                                  })}
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full transition-colors focus:border-blue-500"
                              />
                              {errors.password && (
                                  <Small className="text-red-500">
                                      {errors.password.message?.toString()}
                                  </Small>
                              )}
                          </motion.div>

                          <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-2"
                          >
                              <label
                                  htmlFor="confirmPassword"
                                  className="text-sm font-medium"
                              >
                                  <Small>Confirm Password</Small>
                              </label>
                              <Input
                                  {...register("confirmPassword", {
                                      validate: (value) => validatePassword(value, watch("password"))
                                  })}
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full transition-colors focus:border-blue-500"
                              />
                              {errors.confirmPassword && (
                                  <Small className="text-red-500">
                                      {errors.confirmPassword.message?.toString()}
                                  </Small>
                              )}
                          </motion.div>

                          <motion.div
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-2"
                          >
                              <label
                                  htmlFor="role"
                                  className="text-sm font-medium"
                              >
                                  <Small>Role</Small>
                              </label>
                              <Select onValueChange={(value) => setRole(value)}>
                                  <SelectTrigger className="w-full transition-colors focus:border-blue-500">
                                      <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {/* <SelectItem value="admin">Admin</SelectItem> */}
                                      <SelectItem value="teacher">
                                          Teacher
                                      </SelectItem>
                                      <SelectItem value="student">
                                          Student
                                      </SelectItem>
                                  </SelectContent>
                              </Select>
                          </motion.div>

                          <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                          >
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
                                      <Large>Sign Up</Large>
                                  )}
                              </Button>
                          </motion.div>

                          <div className="flex items-center justify-between text-sm">
                              <Link
                                  href="/login"
                                  className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                  <Small>Already have an account?</Small>
                              </Link>
                              {/* <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Forgot password?</Small>
                </a> */}
                          </div>
                      </form>
                  </CardContent>
              </Card>
          </motion.div>
      </div>
  );
}

export default SignIn