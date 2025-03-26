"use client";
import axios from "axios";
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
import useUserStore from "@/store/userStore";
import { Endpoints } from "@/lib/apiEndpoints";
import { useEffect, useState } from "react";
import useClasses from "@/hooks/utility/useClasses";
import useClassStore from "@/store/useClassStore";
type ClassForm = {
    name: string;
};

const Classes = () => {
    const { classList } = useClasses();
    const {selectClass}=useClassStore();
    return (
        <div>
            <CreateClassDialog />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
                {classList.map((classItem) => (
                    <Link href={`/teacher/classes/${classItem.class_id}`} key={classItem.class_id}>
                        <Card className="p-0 h-32 cursor-pointer" onClick={()=>{selectClass(classItem.class_id)}}>
                            <CardContent className="p-2 flex h-full flex-col items-center justify-center">
                                <h1>{classItem.class_name}</h1>
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
    const {user:{token}}=useUserStore();
    const [open, setOpen] = useState(false);
    const onSubmit: SubmitHandler<ClassForm> = async(data) => {
        // make a post request to create class
        try{
            const result=await axios.post(Endpoints.CLASS.CREATECLASS,{class_name:data.name},{headers:{Authorization:`Bearer ${token}`}});
            if(result.status!==201){
                toast.error("An error occured");
            }
            const {class_id,class_name}=result.data?.ClassResp;
            console.log(class_id,class_name);
            toast.success("Class Created");
            reset();
            setOpen(false);
        }catch(err){
            console.error(err);
            toast.error("An error occured");
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
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