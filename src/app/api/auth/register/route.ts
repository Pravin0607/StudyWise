import { NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import dbConnect from "@/lib/mongoDb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const data = await req.json();

    const { firstName, lastName, email, password, confirmPassword, role } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { message: "Please fill in all fields", status: 400 },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match", status: 400 },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", status: 400 },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Generate a token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const token = await new SignJWT({
      userId: newUser._id,
      role,
      firstName,
      lastName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Set the cookie
    const response = NextResponse.json(
      { message: "User created successfully", status: 200, token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
