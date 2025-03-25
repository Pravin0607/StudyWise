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
import { Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '@/store/useExamStore';

const mcqSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  choices: z.array(z.object({
    value: z.string().min(1, 'Choice text is required'),
  })).min(2, 'At least two choices are required'),
  correctAnswer: z.string().optional(),
  marks: z.number().min(1, 'Marks must be at least 1'), // Added marks field
});

type MCQQuestion = z.infer<typeof mcqSchema>;

const MCQForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MCQQuestion>({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      text: '',
      choices: [{ value: '' }, { value: '' }],
      correctAnswer: '0',
      marks: 1, // Default marks value
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  const addQuestionToStore = useExamStore((state) => state.addQuestion);

  const onSubmit = (data: MCQQuestion) => {
    addQuestionToStore({
      type: 'mcq',
      question: data.text,
      choices: data.choices.map(c => c.value),
      correctAnswer: data.correctAnswer,
      marks: Number(data.marks), // Added marks to the store
    });

    reset({
      text: '',
      choices: [{ value: '' }, { value: '' }],
      correctAnswer: '0',
      marks: 1, // Reset marks to default
    });
  };

  const handleAddChoice = () => {
    append({ value: '' });
  };

  const handleRemoveChoice = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    // Effect for updating options, if needed
  }, [fields]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Question Text Area */}
      <div className="space-y-2">
        <label htmlFor="text" className="text-sm font-medium block">
          Question Text
        </label>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <Textarea
              id="text"
              placeholder="Enter your question here..."
              className="w-full"
              {...field}
            />
          )}
        />
        {errors.text && (
          <p className="text-sm text-red-500">{errors.text.message}</p>
        )}
      </div>

      {/* Choices for MCQ */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Choices</h3>
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-4"
            >
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
                onClick={() => handleRemoveChoice(index)}
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
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddChoice}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Choice
        </Button>
        {errors.choices && (
          <p className="text-sm text-red-500">{errors.choices.message}</p>
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
          <p className="text-sm text-red-500">{errors.marks.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
        Create Question
      </Button>
    </form>
  );
};

export default MCQForm;