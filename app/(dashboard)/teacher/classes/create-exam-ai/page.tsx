'use client'
import useClassStore from '@/store/useClassStore';
import { useMaterialStore } from '@/store/useMaterialStore';
import useUserStore from '@/store/userStore';
import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/shared/TimePicker";
import useAiQuestions from '@/store/useAiQuestions';
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Edit } from "lucide-react";
import toast from 'react-hot-toast';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const CreateExamAI = () => {
  const selectedClass = useClassStore(state => state.selectedClass);
  const { classMaterials, fetchMaterialsByClassId } = useMaterialStore();
  const token = useUserStore(state => state.user.token);
  useEffect(() => {
    (async () => {
      await fetchMaterialsByClassId(selectedClass?.class_id as string, token as string);
    })()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <AIExamForm materials={classMaterials} />
    </div>
  )
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Exam title is required",
  }),
  classId: z.string().min(1, {
    message: "Class is required",
  }),
  date: z
    .string()
    .min(1, { message: "Date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  totalMarks: z.coerce
    .number()
    .min(1, { message: "Total marks must be greater than 0" }),
  numberOfQuestions: z.coerce
    .number()
    .min(1, { message: "Number of questions must be greater than 0" })
    .max(30, { message: "Maximum 30 questions allowed" }),
  materialId: z.string().min(1, { message: "Material is required" }),
})

const AIExamForm = ({ materials }: { materials: any[] }) => {
  const selectedClass = useClassStore(state => state.selectedClass);
  const {getQuestions, questions, isLoading,submitExam}=useAiQuestions();
  const token=useUserStore(state=>state.user.token);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      classId: selectedClass?.class_id || "",
      date: "",
      startTime: "",
      endTime: "",
      totalMarks: 0,
      numberOfQuestions: 0,
      materialId: "",
    },
    mode: "onChange",
  })

  const [loadingSteps, setLoadingSteps] = React.useState<string[]>([]);
  const [showQuestions, setShowQuestions] = React.useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = React.useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = React.useState<any>(null);
  const [editForm, setEditForm] = React.useState<any>(null);

  const { setQuestions: setStoreQuestions } = useAiQuestions();

  const handleDeleteQuestion = (indexToDelete: number) => {
    setStoreQuestions(
      questions.filter((_, index) => index !== indexToDelete),
      form.getValues("totalMarks") // or recalculate if needed
    );
  };

  const questionSchema = z.object({
    question: z.string().min(1, { message: "Question is required" }),
    choices: z.array(z.string().min(1, { message: "Choice is required" })).min(2, { message: "At least two choices are required" }),
    correctAnswer: z.string().min(1, { message: "Correct answer is required" }), // Ensure correctAnswer is required
    marks: z.coerce.number().nonnegative({ message: "Marks cannot be negative" }), // Allow marks to be 0 or greater
  });

  const editFormResolver = zodResolver(questionSchema);

  const editQuestionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: editFormResolver,
    defaultValues: {
      question: "",
      choices: ["", ""],
      correctAnswer: "",
    },
  });

  useEffect(() => {
    if (editedQuestion) {
      editQuestionForm.reset({
        question: editedQuestion.question,
        choices: editedQuestion.choices,
        correctAnswer: editedQuestion.correctAnswer,
        marks: editedQuestion.marks, // Include marks here
      });
    }
  }, [editedQuestion, editQuestionForm]);

  useEffect(() => {
    // Reset questions when component mounts
    setStoreQuestions([], 0);
    // Reset loading steps
    setLoadingSteps([]);
  }, []);

  const handleEditQuestion = (index: number) => {
    setEditQuestionIndex(index);
    setEditedQuestion({ ...questions[index] });
  };

  const handleSaveQuestion = () => {
    editQuestionForm.handleSubmit((values) => {
      if (editQuestionIndex !== null) {
        const updatedQuestions = [...questions];
          updatedQuestions[editQuestionIndex] = {
            ...values,
            type: updatedQuestions[editQuestionIndex].type,
            marks: updatedQuestions[editQuestionIndex].marks,
          };
        setStoreQuestions(updatedQuestions, form.getValues("totalMarks"));
        setEditQuestionIndex(null);
        setEditedQuestion(null);
      }
    })();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    editQuestionForm.setValue(field as "question" | "correctAnswer", e.target.value);
  };

  const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedChoices = [...editQuestionForm.getValues().choices];
    updatedChoices[index] = e.target.value;
    editQuestionForm.setValue("choices", updatedChoices);
  };

  useEffect(() => {
    if (isLoading) {
      setLoadingSteps([]); // Reset steps when loading starts
      const steps = [
        "Analyzing material content...",
        "Preparing exam structure...",
        "Generating questions...",
        "Validating questions...",
        "Finalizing exam..."
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setLoadingSteps(prev => [...prev, steps[currentStep]]);
          currentStep++;
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await getQuestions(
        values.materialId,
        "mcq",
        values.numberOfQuestions,
        values.totalMarks,
        token!
      );
      
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating questions");
    }
  }

  const handleSubmitExam = async () => {
    // Implement your submit exam logic here
    // You can access the form values using form.getValues()
    // and the questions using the questions state
    await submitExam({...form.getValues(), questions},token as string)
    router.back();
    // toast.success("Exam submitted successfully!");
    // router.push('/teacher/classes');
  };

  return (
      <div className="min-h-screen p-8 flex items-start gap-8">
          {" "}
          {/* Modified line */}
          <Form {...form}>
              <Card className="w-[500px]">
                  <CardHeader>
                      <CardTitle>Create AI Exam</CardTitle>
                      <CardDescription>
                          Enter the details for the exam.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                      {/* Form fields here */}
                      <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Exam Title</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Exam Title"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="classId"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Class</FormLabel>
                                  <Select
                                      disabled
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a class" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          <SelectGroup>
                                              <SelectItem
                                                  value={
                                                      selectedClass?.class_id ||
                                                      ""
                                                  }
                                              >
                                                  {selectedClass?.class_name}
                                              </SelectItem>
                                          </SelectGroup>
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="materialId"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Material</FormLabel>
                                  <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                  >
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a material" />
                                          </SelectTrigger>
                                      </FormControl>
                                      {materials.length === 0 ? (
                                          <p className="text-sm text-gray-500">
                                              No materials available for this
                                              class.
                                          </p>
                                      ) : (
                                          <SelectContent>
                                              <SelectGroup>
                                                  {materials.map((material) => (
                                                      <SelectItem
                                                          key={
                                                              material.material_id
                                                          }
                                                          value={
                                                              material.material_id
                                                          }
                                                      >
                                                          {material.file_name}
                                                      </SelectItem>
                                                  ))}
                                              </SelectGroup>
                                          </SelectContent>
                                      )}
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>Date</FormLabel>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <Button
                                              variant={"outline"}
                                              className={cn(
                                                  "w-[240px] justify-start text-left font-normal",
                                                  !field.value &&
                                                      "text-muted-foreground"
                                              )}
                                          >
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {field.value ? (
                                                  format(
                                                      new Date(field.value),
                                                      "PPP"
                                                  )
                                              ) : (
                                                  <span>Pick a date</span>
                                              )}
                                          </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                      >
                                          <Calendar
                                              mode="single"
                                              selected={
                                                  field.value
                                                      ? new Date(field.value)
                                                      : undefined
                                              }
                                              onSelect={(date) => {
                                                  if (date) {
                                                      field.onChange(
                                                          format(
                                                              date,
                                                              "yyyy-MM-dd"
                                                          )
                                                      );
                                                  }
                                              }}
                                              disabled={(date) => {
                                                  const today = new Date();
                                                  today.setHours(0, 0, 0, 0);
                                                  return date < today;
                                              }}
                                              initialFocus
                                          />
                                      </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className="flex gap-2">
                          <FormField
                              control={form.control}
                              name="startTime"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Start Time</FormLabel>
                                      <TimePicker
                                          value={field.value}
                                          onChange={field.onChange}
                                          error={
                                              form.formState.errors.startTime
                                                  ?.message
                                          }
                                      />
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>End Time</FormLabel>
                                      <TimePicker
                                          value={field.value}
                                          onChange={field.onChange}
                                          error={
                                              form.formState.errors.endTime
                                                  ?.message
                                          }
                                      />
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                      <div className="flex gap-2">
                          {" "}
                          {/* Added flex container */}
                          <FormField
                              control={form.control}
                              name="numberOfQuestions"
                              render={({ field }) => (
                                  <FormItem className="w-1/2">
                                      <FormLabel>Number of Questions</FormLabel>
                                      <FormControl>
                                          <Input
                                              type="number"
                                              placeholder="Number of Questions"
                                              {...field}
                                              value={field.value || ""}
                                              max={30}
                                          />
                                      </FormControl>
                                      <p className="text-xs text-muted-foreground">
                                          Maximum 30 questions allowed
                                      </p>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="totalMarks"
                              render={({ field }) => (
                                  <FormItem className="w-1/2">
                                      {" "}
                                      {/* Adjusted width */}
                                      <FormLabel>Total Marks</FormLabel>
                                      <FormControl>
                                          <Input
                                              type="number"
                                              placeholder="Total Marks"
                                              {...field}
                                              value={field.value || ""}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>{" "}
                      {/* Close flex container */}
                  </CardContent>
                  <CardFooter>
                      <Button
                          type="submit"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all duration-300"
                      >
                          {isLoading ? (
                              <div className="flex items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                                  <span>Generating Exam...</span>
                              </div>
                          ) : (
                              <div className="flex items-center gap-2">
                                  <svg
                                      className="h-5 w-5 text-yellow-300"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path d="M12 16L4 8l1.41-1.41L12 13.17l6.59-6.58L20 8l-8 8z" />
                                  </svg>
                                  <span>Generate Exam</span>
                              </div>
                          )}
                      </Button>
                  </CardFooter>
              </Card>
          </Form>
          <AnimatePresence mode="wait">
              {isLoading && (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-[500px]"
                  >
                      <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  Generating Exam {}
                              </CardTitle>
                          </CardHeader>
                          <CardContent>
                              <div className="space-y-4">
                                  {loadingSteps.map((step, index) => (
                                      <motion.div
                                          key={index}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex items-center gap-2"
                                      >
                                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                                          <p>{step}</p>
                                      </motion.div>
                                  ))}
                              </div>
                          </CardContent>
                      </Card>
                  </motion.div>
              )}

              {!isLoading && questions.length > 0 && (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-4xl"
                  >
                      <Card>
                          <CardHeader>
                              <CardTitle>Generated Questions</CardTitle>
                              <CardDescription>
                                  Total Questions: {questions.length} | Total
                                  Marks:{" "}
                                  {questions.reduce(
                                      (acc, question) => acc + question.marks,
                                      0
                                  )}
                              </CardDescription>
                          </CardHeader>
                          <CardContent>
                              <ScrollArea className="h-[500px] w-full pr-4">
                                  <div className="space-y-8">
                                      {questions.map((question, index) => (
                                          <div
                                              key={index}
                                              className="p-4 rounded-lg border bg-card text-card-foreground"
                                          >
                                              <div className="flex items-center justify-between mb-4">
                                                  <div className="flex items-center gap-2">
                                                      <span className="font-semibold text-lg">
                                                          Q{index + 1}.
                                                      </span>
                                                      <p className="text-lg">
                                                          {question.question}
                                                      </p>
                                                  </div>
                                                  <div className="flex gap-2">
                                                      <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                              handleEditQuestion(
                                                                  index
                                                              )
                                                          }
                                                          className="hover:bg-blue-50"
                                                      >
                                                          <Edit className="h-4 w-4 text-blue-500" />
                                                      </Button>
                                                      <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                              handleDeleteQuestion(
                                                                  index
                                                              )
                                                          }
                                                          className="hover:bg-red-50"
                                                      >
                                                          <Trash2 className="h-4 w-4 text-red-500" />
                                                      </Button>
                                                  </div>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                  {question.choices.map(
                                                      (choice, choiceIndex) => (
                                                          <div
                                                              key={choiceIndex}
                                                              className={`p-3 rounded-md border ${
                                                                  String(
                                                                      choiceIndex
                                                                  ) ===
                                                                  question.correctAnswer
                                                                      ? "border-green-500 bg-green-50"
                                                                      : "border-gray-200"
                                                              }`}
                                                          >
                                                              {choice}
                                                          </div>
                                                      )
                                                  )}
                                              </div>
                                              <div className=" flex gap-x-3 mt-4 text-sm text-green-600">
                                                  <div>
                                                      Correct Answer:{" "}
                                                      {question.correctAnswer}
                                                  </div>
                                                  <div>
                                                      Marks:{" "}
                                                      <span className="font-semibold">
                                                          {question.marks}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </ScrollArea>
                          </CardContent>
                          <CardFooter>
                              <Button
                                  onClick={handleSubmitExam}
                                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all duration-300"
                              >
                                  <div className="flex items-center gap-2">
                                      <svg
                                          className="h-5 w-5 text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                      >
                                          <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                          />
                                      </svg>
                                      <span>Submit Exam</span>
                                  </div>
                              </Button>
                          </CardFooter>
                      </Card>
                  </motion.div>
              )}
          </AnimatePresence>
          <Dialog
              open={editQuestionIndex !== null}
              onOpenChange={() => setEditQuestionIndex(null)}
          >
              <DialogContent className="sm:max-w-[600px]">
                  {" "}
                  {/* Increased modal width */}
                  <DialogHeader>
                      <DialogTitle>Edit Question</DialogTitle>
                      <DialogDescription>
                          Make changes to the question, choices, correct answer,
                          and marks.
                      </DialogDescription>
                  </DialogHeader>
                  <Form {...editQuestionForm}>
                      <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                              <FormItem>
                                  <FormLabel htmlFor="question">
                                      Question
                                  </FormLabel>
                                  <FormControl>
                                      <Textarea
                                          id="question"
                                          placeholder="Question"
                                          {...editQuestionForm.register(
                                              "question"
                                          )}
                                      />
                                  </FormControl>
                                  <FormMessage />{" "}
                                  {/* Display error for question */}
                              </FormItem>
                          </div>
                          {editQuestionForm
                              .watch("choices")
                              ?.map((choice, index) => (
                                  <div key={index} className="grid gap-2">
                                      <FormItem>
                                          <FormLabel
                                              htmlFor={`choice-${index}`}
                                          >
                                              Choice {index + 1}
                                          </FormLabel>
                                          <FormControl>
                                              <Input
                                                  type="text"
                                                  id={`choice-${index}`}
                                                  placeholder={`Choice ${
                                                      index + 1
                                                  }`}
                                                  {...editQuestionForm.register(
                                                      `choices.${index}`,
                                                      {
                                                          required:
                                                              "Choice is required", // Add required validation
                                                      }
                                                  )}
                                              />
                                          </FormControl>
                                          {/* Display error for each choice */}
                                          {editQuestionForm.formState.errors
                                              .choices?.[index] && (
                                              <FormMessage>
                                                  {
                                                      editQuestionForm.formState
                                                          .errors.choices[index]
                                                          ?.message
                                                  }
                                              </FormMessage>
                                          )}
                                      </FormItem>
                                  </div>
                              ))}
                          <div className="flex gap-4">
                              {" "}
                              {/* Flex container for marks and correct answer */}
                              <div className="w-1/2">
                                  {" "}
                                  {/* Adjusted width */}
                                  <FormItem>
                                      <FormLabel htmlFor="correctAnswer">
                                          Correct Answer
                                      </FormLabel>
                                      <FormControl>
                                          <Input
                                              type="text"
                                              id="correctAnswer"
                                              placeholder="Correct Answer"
                                              {...editQuestionForm.register(
                                                  "correctAnswer",
                                                  {
                                                      required:
                                                          "Correct answer is required", // Ensure correctAnswer is required
                                                  }
                                              )}
                                          />
                                      </FormControl>
                                      <FormMessage />{" "}
                                      {/* Display error for correct answer */}
                                  </FormItem>
                              </div>
                              <div className="w-1/2">
                                  {" "}
                                  {/* Adjusted width */}
                                  <FormItem>
                                      <FormLabel htmlFor="marks">
                                          Marks
                                      </FormLabel>
                                      <FormControl>
                                          <Input
                                              type="number"
                                              id="marks"
                                              placeholder="Marks"
                                              {...editQuestionForm.register(
                                                  "marks",
                                                  {
                                                      valueAsNumber: true, // Ensure the value is treated as a number
                                                  }
                                              )}
                                          />
                                      </FormControl>
                                      <FormMessage />{" "}
                                      {/* Display error for marks */}
                                  </FormItem>
                              </div>
                          </div>
                      </div>
                      <div className="flex justify-end">
                          <Button
                              type="button"
                              onClick={editQuestionForm.handleSubmit(
                                  handleSaveQuestion
                              )}
                          >
                              {" "}
                              {/* Use handleSubmit */}
                              Save changes
                          </Button>
                      </div>
                  </Form>
              </DialogContent>
          </Dialog>
      </div>
  );
};

export default CreateExamAI