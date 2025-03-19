'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { H1, Small, Subtle, Large } from "@/components/ui/typography"
import { motion } from "motion/react"

const SignIn = () => {
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="firstName" className="text-sm font-medium">
                    <Small>First Name</Small>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    className="w-full transition-colors focus:border-blue-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="lastName" className="text-sm font-medium">
                    <Small>Last Name</Small>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                    className="w-full transition-colors focus:border-blue-500"
                  />
                </motion.div>
              </div>

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
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full transition-colors focus:border-blue-500"
                />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="mobile" className="text-sm font-medium">
                    <Small>Mobile No</Small>
                  </label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="+91 9876543210"
                    autoComplete="tel"
                    required
                    className="w-full transition-colors focus:border-blue-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="dob" className="text-sm font-medium">
                    <Small>Date of Birth</Small>
                  </label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    className="w-full transition-colors focus:border-blue-500"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="text-sm font-medium">
                  <Small>Password</Small>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full transition-colors focus:border-blue-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  <Small>Confirm Password</Small>
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full transition-colors focus:border-blue-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="role" className="text-sm font-medium">
                  <Small>Role</Small>
                </label>
                <Select>
                  <SelectTrigger className="w-full transition-colors focus:border-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
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
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Large>Create Account</Large>
                </Button>
              </motion.div>

              <div className="flex items-center justify-between text-sm">
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Already have an account?</Small>
                </a>
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  <Small>Forgot password?</Small>
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default SignIn