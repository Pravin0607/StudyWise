import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MCQForm from './MCQForm';
import DescriptiveForm from './DescriptiveForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ExamCreationForm = ({prevStep}:{prevStep:()=>void}) => {
  const [questionType, setQuestionType] = useState<'mcq' | 'descriptive'>('mcq');

  const handleQuestionTypeChange = (type: 'mcq' | 'descriptive') => {
    setQuestionType(type);
  };

  return (
    <div className="p-2 md:p-6 bg-card rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <div className='flex justify-between items-center mb-6'>
      <Button size={'sm'} className='bg-blue-500 text-white hover:bg-blue-600' onClick={prevStep}>
        <ArrowLeft className="h-6 w-6" />
        Back
      </Button>
      <h2 className="text-lg md:text-2xl font-semibold flex-1 text-center">
        Create Question</h2>
      </div>

      {/* Question Type Selection */}
      <div className="space-y-2 mb-2">
        <label htmlFor="type" className="text-sm font-medium block">
          Question Type
        </label>
        <Select onValueChange={handleQuestionTypeChange} defaultValue={questionType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mcq">Multiple Choice</SelectItem>
            <SelectItem value="descriptive">Descriptive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questionType === 'mcq' ? <MCQForm /> : <DescriptiveForm />}
    </div>
  );
};

export default ExamCreationForm;
