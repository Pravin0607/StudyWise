import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "Please provide a first name."],
    maxlength: [60, "First name cannot be more than 60 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name."],
    maxlength: [60, "Last name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address."],
    unique: true,
    maxlength: [100, "Email cannot be more than 100 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  role: {
    type: String,
    required: [true, "Please specify the role."],
  },
});

const User=mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;