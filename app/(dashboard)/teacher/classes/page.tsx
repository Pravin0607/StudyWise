"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
const classes = [{ name: "Class 1" }, { name: "Class 2" }, { name: "Class 3" }];
type ClassForm = {
    name: string;
};
const Classes = () => {
    return (
        <div>
            <CreateClassDialog />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
                {classes.map((classItem, index) => (
                    <Link href={`/teacher/classes/${index}`} key={index}>
                        <Card className="p-0 h-32 cursor-pointer">
                            <CardContent className="p-2 flex h-full flex-col items-center justify-center">
                                <h1>{classItem.name}</h1>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const CreateClassDialog = () => {
    const {
        reset,
        handleSubmit,
        formState: { errors },
        watch,
        register,
    } = useForm<ClassForm>({
        defaultValues: {
            name: "",
        },
    });
    const onSubmit: SubmitHandler<ClassForm> = (data) => {
        console.log(data);
        toast.success("Class Created");
        reset();
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="my-2">
                    <Plus /> Create Class
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        Create Class
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {/* form for taking name of class and Submimt button */}
                        <Input
                            type="text"
                            placeholder="Enter Class Name"
                            {...register("name", {
                                required: "Class Name is required",
                                validate: (value) => {
                                    if (value.trim() === "") {
                                        return "Class Name cannot be empty";
                                    }
                                    return true;
                                },
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-500">
                                {errors.name.message?.toString()}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant={"outline"}
                            className="mt-2"
                        >
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default Classes;
