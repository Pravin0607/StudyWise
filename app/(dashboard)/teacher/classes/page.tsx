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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
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
    const { classList, fetchClasses } = useClasses();
    const { selectClass } = useClassStore();
    const { user: { token } } = useUserStore();
    
    // State variables
    const [editOpen, setEditOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState<any>(null);
    
    // Edit class function
    const updateClass = async (classId: string, newName: string) => {
        const toastId = toast.loading("Updating class...");
        try {
            const result = await axios.put(
                `${Endpoints.CLASS.UPDATECLASS}/${classId}`,
                { class_name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (result.status === 200) {
                toast.success("Class updated successfully", { id: toastId });
                fetchClasses();
                setEditOpen(false);
            } else {
                toast.error("Failed to update class", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating the class", { id: toastId });
        }
    };
    
    // Delete class function
    const deleteClass = async (classId: string) => {
        const toastId = toast.loading("Deleting class...");
        try {
            const result = await axios.delete(`${Endpoints.CLASS.DELETECLASS}/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (result.status === 200) {
                toast.success("Class deleted successfully", { id: toastId });
                fetchClasses();
            } else {
                toast.error("Failed to delete class", { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while deleting the class", { id: toastId });
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-800">
                        My Classes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your teaching classes and courses
                    </p>
                </div>
                <CreateClassDialog />
            </div>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
                {classList.map((classItem) => (
                    <Link
                        href={`/teacher/classes/${classItem.class_id}`}
                        prefetch={true}
                        key={classItem.class_id}
                    >
                        <Card
                            className="p-0 h-32 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-indigo-500"
                            onClick={(e) => {
                                selectClass(classItem.class_id);
                            }}
                        >
                            <CardContent className="p-3 flex h-full flex-col justify-between bg-gradient-to-br from-white to-slate-50">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-bold text-lg text-indigo-700 pr-16">
                                        {classItem.class_name}
                                    </h2>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 p-0 rounded-full hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCurrentClass(classItem);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <Edit className="h-3.5 w-3.5 text-blue-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 p-0 rounded-full hover:bg-red-50"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCurrentClass(classItem);
                                                setDeleteAlertOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <span>
                                            Students:{" "}
                                            {classItem.students?.length || 0}
                                        </span>
                                        <span>
                                            Exams:{" "}
                                            {classItem.exams?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {/* Delete Alert Dialog */}
            {currentClass && (
                <AlertDialog
                    open={deleteAlertOpen}
                    onOpenChange={setDeleteAlertOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Class</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "
                                {currentClass.class_name}"? This action cannot
                                be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() =>
                                    deleteClass(currentClass.class_id)
                                }
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

{currentClass && (
            <EditClassDialog
                open={editOpen}
                setOpen={setEditOpen}
                currentClass={currentClass}
                updateClass={updateClass}
            />
        )}
        </div>
    );
};

// Edit Class Dialog Component
const EditClassDialog = ({ open, setOpen, currentClass, updateClass }: { 
    open: boolean, 
    setOpen: (open: boolean) => void, 
    currentClass: any, 
    updateClass: (classId: string, name: string) => Promise<void> 
}) => {
    const {
        reset,
        handleSubmit,
        formState: { errors },
        register,
        setValue
    } = useForm<ClassForm>({
        defaultValues: {
            name: "",
        },
    });

    // Set default value when currentClass changes
    useEffect(() => {
        if (currentClass && open) {
            setValue("name", currentClass.class_name);
        }
    }, [currentClass, open, setValue]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit: SubmitHandler<ClassForm> = async (data) => {
        if (currentClass) {
            await updateClass(currentClass.class_id, data.name);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        Edit Class
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
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
                            variant="default"
                            className="mt-2"
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
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