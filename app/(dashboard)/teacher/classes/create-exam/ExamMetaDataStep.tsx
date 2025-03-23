"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExamStore } from "@/store/useExamStore";
import { Button } from "@/components/ui/button";

const examMetadataSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    classId: z.string().min(1, { message: "Class ID is required" }),
    date: z
        .string()
        .min(1, { message: "Date is required" })
        .refine(
            (data) => {
                const selectedDate = new Date(data);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Compare only the date part
                return selectedDate >= today;
            },
            {
                message: "Date must be today or in the future",
            }
        ),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    marks: z.coerce
        .number()
        .min(0, { message: "Marks must be a non-negative number" })
        .refine((data) => !isNaN(data), {
            message: "Marks must be a valid number",
        })
        .refine((data) => data !== null && data !== undefined, {
            message: "Marks are required",
        }),
});

type TExamMetaData = z.infer<typeof examMetadataSchema>;

const ExamMetaDataStep = ({ nextStep }: { nextStep: () => void }) => {
    const { setExamMetaData } = useExamStore();
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<TExamMetaData>({
        defaultValues: {
            marks: 0,
            classId: "",
        },
        resolver: zodResolver(examMetadataSchema),
    });
    const onSubmit: SubmitHandler<TExamMetaData> = (data) => {
        if (String(watch("marks")) !== "") {
            setExamMetaData(data);
            nextStep();
        } else {
            setError("marks", {
                message: "Marks cant't be Empty.",
            });
        }
    };
    const handleClassSelect = (value: string) => {
        setValue("classId", value);
    };

    return (
        <div className="h-full flex md:justify-center md:items-center">
            <Card className="p-2 w-full h-fit md:w-[500px]">
                <CardHeader>
                    <CardTitle>Exam details</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="space-y-2">
                        <div>
                            <Label>Exam Title </Label>
                            <Input {...register("title")} />
                            {errors.title && (
                                <span className="text-sm text-red-500">
                                    {errors.title?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Class </Label>
                            <Select
                                onValueChange={handleClassSelect}
                                value={watch("classId")}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent
                                    className={
                                        "bg-background w-[280px] md:w-[470px] max-h-60"
                                    }
                                >
                                    <SelectGroup>
                                        <SelectItem value="classId_1">
                                            class 1
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.classId && (
                                <span className="text-sm text-red-500">
                                    {errors.classId?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Date </Label>
                            <Input type="date" {...register("date")} />
                            {errors.date && (
                                <span className="text-sm text-red-500">
                                    {errors.date?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Start Time </Label>
                            <Input type="time" {...register("startTime")} />
                            {errors.startTime && (
                                <span className="text-sm text-red-500">
                                    {errors.startTime?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>End Time </Label>
                            <Input type="time" {...register("endTime")} />
                            {errors.endTime && (
                                <span className="text-sm text-red-500">
                                    {errors.endTime?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Total Marks </Label>
                            <Input type="number" {...register("marks")} />
                            {errors.marks && (
                                <span className="text-sm text-red-500">
                                    {errors.marks?.message}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" onClick={handleSubmit(onSubmit)}>
                        Next
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ExamMetaDataStep;
