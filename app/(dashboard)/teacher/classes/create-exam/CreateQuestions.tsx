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

const ExamCreationForm = () => {
  const [questionType, setQuestionType] = useState<'mcq' | 'descriptive'>('mcq');

  const handleQuestionTypeChange = (type: 'mcq' | 'descriptive') => {
    setQuestionType(type);
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create Question</h2>

      {/* Question Type Selection */}
      <div className="space-y-2">
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
