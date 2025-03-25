import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExamStore } from '@/store/useExamStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define schemas for both question types
const mcqSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  choices: z.array(z.object({
    value: z.string().min(1, 'Choice text is required'),
  })).min(2, 'At least two choices are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  marks: z.number().min(1, 'Marks must be at least 1'),
});

const descriptiveSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  marks: z.number().min(1, 'Marks must be at least 1'),
});

// Union type for both question formats
type QuestionFormData = {
  type: 'mcq' | 'descriptive';
  question: string;
  choices?: { value: string }[];
  correctAnswer?: string;
  marks: number;
};

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionIndex: number;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  questionIndex,
}) => {
  // Get questions from store
  const questions = useExamStore(state => state.questions);
  
  // We'll need to add updateQuestion to the store
  // This is just a placeholder to show how it would be used
  const updateQuestion = useExamStore(state => state.updateQuestion);

  const questionToEdit = questions[questionIndex];
  const isMCQ = questionToEdit?.type === 'mcq';

  // Set up form with the appropriate schema based on question type
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isMCQ ? mcqSchema : descriptiveSchema),
    defaultValues: {
      type: questionToEdit?.type,
      question: questionToEdit?.question || '',
      choices: questionToEdit?.choices?.map(choice => ({ value: choice })) || [{ value: '' }, { value: '' }],
      correctAnswer: questionToEdit?.correctAnswer || '0',
      marks: questionToEdit?.marks || 1,
    },
  });

  // Field array for MCQ choices
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  // Reset form when question changes
  useEffect(() => {
    if (questionToEdit) {
      reset({
        type: questionToEdit.type,
        question: questionToEdit.question,
        choices: questionToEdit.choices?.map(choice => ({ value: choice })) || [{ value: '' }, { value: '' }],
        correctAnswer: questionToEdit.correctAnswer || '0',
        marks: questionToEdit.marks,
      });
    }
  }, [questionToEdit, reset]);

  const onSubmit = (data: QuestionFormData) => {
    const updatedQuestion = {
      type: questionToEdit.type,
      question: data.question,
      marks: data.marks,
      ...(isMCQ ? {
        choices: data.choices?.map(c => c.value),
        correctAnswer: data.correctAnswer
      } : {})
    };
    
    // Actually call the updateQuestion function
    updateQuestion(questionIndex, updatedQuestion);
    console.log("Updated question:", updatedQuestion);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit {isMCQ ? 'Multiple Choice' : 'Descriptive'} Question
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Question Text */}
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium block">
              Question Text
            </label>
            <Controller
              name="question"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="question"
                  placeholder="Enter your question here..."
                  className="w-full"
                  {...field}
                />
              )}
            />
            {errors.question && (
              <p className="text-sm text-red-500">{String(errors?.question?.message)}</p>
            )}
          </div>

          {/* MCQ Specific Fields */}
          {isMCQ && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Choices</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Controller
                      name={`choices.${index}.value`}
                      control={control}
                      render={({ field: choiceField }) => (
                        <Input
                          placeholder={`Choice ${index + 1}`}
                          className="flex-1"
                          {...choiceField}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 2}
                      className={cn(
                        "transition-colors",
                        fields.length <= 2
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-700"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ value: '' })}
                  size="sm"
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Choice
                </Button>
                {errors.choices && (
                  <p className="text-sm text-red-500">{String(errors.choices.message)}</p>
                )}
              </div>

              {/* Correct Answer Selection */}
              <div className="space-y-2">
                <label htmlFor="correctAnswer" className="text-sm font-medium block">
                  Correct Answer
                </label>
                <Controller
                  name="correctAnswer"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="correctAnswer">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((_, index) => (
                          <SelectItem key={index} value={String(index)}>
                            Choice {index + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </>
          )}

          {/* Marks Input */}
          <div className="space-y-2">
            <label htmlFor="marks" className="text-sm font-medium block">
              Marks
            </label>
            <Controller
              name="marks"
              control={control}
              render={({ field }) => (
                <Input
                  id="marks"
                  type="number"
                  placeholder="Enter marks for this question"
                  className="w-full"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.marks && (
              <p className="text-sm text-red-500">{String(errors.marks.message)}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionModal;