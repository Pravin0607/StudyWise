import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';
import User from '@/lib/models/user.model'; // Adjust the path to your user model
import dbConnect from '@/lib/mongoDb'; // Adjust the path to your MongoDB connection function

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string(), // Teacher or Student
});

// POST route handler
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    // Validate the input using Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, role } = body;
    // Connect to the database
    await dbConnect();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User does not exist' },
        { status: 404 }
      );
    }

    // Check if the role matches
    if (role && user.role !== role) {
      return NextResponse.json(
        { message: 'Invalid Crediantials.' },
        { status: 403 }
      );
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid Crediantials.' },
        { status: 401 }
      );
    }

    // Generate a JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    // Set the HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
