'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { H1, Small, Subtle, Large } from "@/components/ui/typography"
import Link from "next/link"
import { motion } from "motion/react"

const LogIn = () => {
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
            <form className="space-y-6">
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
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full transition-colors focus:border-blue-500"
                />
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
                  <Large>Log In</Large>
                </Button>
              </motion.div>

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