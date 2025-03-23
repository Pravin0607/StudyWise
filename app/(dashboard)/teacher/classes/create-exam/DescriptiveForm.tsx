import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useExamStore } from '@/store/useExamStore';
import { Input } from '@/components/ui/input';

const descriptiveSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  marks: z.number().min(1, 'Marks must be at least 1'), // Added marks field
});

type DescriptiveQuestion = z.infer<typeof descriptiveSchema>;

const DescriptiveForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DescriptiveQuestion>({
    resolver: zodResolver(descriptiveSchema),
    defaultValues: {
      text: '',
      marks: 1, // Default marks value
    },
  });

  const addQuestionToStore = useExamStore((state) => state.addQuestion);

  const onSubmit = (data: DescriptiveQuestion) => {
    addQuestionToStore({
      type: 'descriptive',
      question: data.text,
      marks: data.marks, // Added marks to the store
    });

    reset({
      text: '',
      marks: 1, // Reset marks to default
    });
  };

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
      <Button type="submit" className="w-full">
        Create Question
      </Button>
    </form>
  );
};

export default DescriptiveForm;