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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useClasses from "@/hooks/utility/useClasses";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TimePicker } from "@/components/shared/TimePicker";
import useExamEditStore from "@/store/useExamEditStore";
import toast from "react-hot-toast";

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
    totalMarks: z.coerce
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

const MetadataUpdateForm = ({gotoNext}:{gotoNext:()=>void}) => {
    const {setExamQuestionsWithMetadata,examQuestionsWithMetadata,updateExam} =useExamEditStore();
    const {classList}=useClasses();

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
        reset
    } = useForm<TExamMetaData>({
        defaultValues: {
            title: examQuestionsWithMetadata?.title || "",
            classId: examQuestionsWithMetadata?.class_id || "",
            date: examQuestionsWithMetadata?.date || "",
            startTime: examQuestionsWithMetadata?.start_time || "",
            endTime: examQuestionsWithMetadata?.end_time || "",
            totalMarks: examQuestionsWithMetadata?.total_marks || 0,
        },
        resolver: zodResolver(examMetadataSchema),
    });
    useEffect(() => {
        // Check if we have any persisted data and populate the form
        if(examQuestionsWithMetadata){
        setValue("title", examQuestionsWithMetadata.title);
        setValue("classId", examQuestionsWithMetadata.class_id);
        setValue("date", examQuestionsWithMetadata.date);
        setValue("startTime", examQuestionsWithMetadata.start_time);
        setValue("endTime", examQuestionsWithMetadata.end_time);
        setValue("totalMarks", examQuestionsWithMetadata.total_marks);
        }
    }, [examQuestionsWithMetadata, setValue]);
    
    const onSubmit: SubmitHandler<TExamMetaData> = async (data) => {
        if (String(watch("totalMarks")) !== "") {
            if(examQuestionsWithMetadata){
                const updatedExamData = {
                    ...examQuestionsWithMetadata,
                    title: data.title,
                    class_id: data.classId,
                    date: data.date,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    total_marks: data.totalMarks,
                };
                setExamQuestionsWithMetadata(updatedExamData);
                gotoNext();
            }
        } else {
            setError("totalMarks", {
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
                                    <SelectValue
                                        placeholder="Select a Class"
                                        className="text-black"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {classList.map((classItem) => (
                                            <SelectItem
                                                key={classItem.class_id}
                                                value={classItem.class_id}
                                                className="hover:bg-primary-100 cursor-pointer"
                                            >
                                                {classItem.class_name}
                                            </SelectItem>
                                        ))}
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "group bg-background hover:bg-background border-input w-full justify-between px-3 h-10 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                                            !watch("date") &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "truncate",
                                                !watch("date") &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {watch("date")
                                                ? format(
                                                      new Date(watch("date")),
                                                      "PPP"
                                                  )
                                                : "Pick a date"}
                                        </span>
                                        <CalendarIcon
                                            size={16}
                                            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-2"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            watch("date")
                                                ? new Date(watch("date"))
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (date) {
                                                setValue(
                                                    "date",
                                                    format(date, "yyyy-MM-dd")
                                                );
                                            }
                                        }}
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return date < today;
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date && (
                                <span className="text-sm text-red-500">
                                    {errors.date?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Start Time</Label>
                            <TimePicker
                                value={watch("startTime")}
                                onChange={(time) => setValue("startTime", time)}
                                error={errors.startTime?.message}
                            />
                        </div>
                        <div>
                            <Label>End Time</Label>
                            <TimePicker
                                value={watch("endTime")}
                                onChange={(time) => setValue("endTime", time)}
                                error={errors.endTime?.message}
                            />
                        </div>
                        <div>
                            <Label>Total Marks </Label>
                            <Input type="number" {...register("totalMarks")} />
                            {errors.totalMarks && (
                                <span className="text-sm text-red-500">
                                    {errors.totalMarks?.message}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" onClick={handleSubmit(onSubmit)}>
                        Update And Go to Questions
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MetadataUpdateForm;