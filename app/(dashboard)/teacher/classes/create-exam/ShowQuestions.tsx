import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamStore } from "@/store/useExamStore";
import { Edit, Trash2, Star } from "lucide-react";
import { useState } from "react";
import EditQuestionModal from "./EditQuestionModal";

const ShowQuestions = () => {
  const Questions = useExamStore(state => state.questions);
  const removeQuestion = useExamStore(state => state.removeQuestion);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
const handleEditQuestion = (index: number) => {
  setEditingQuestionIndex(index);
  setIsEditModalOpen(true);
};
  return (
    <div className="p-4 sm:p-6 bg-slate-50 rounded-xl shadow-lg w-full max-w-2xl mx-auto border border-slate-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Created Questions
      </h2>
      <ScrollArea className="h-[80%] w-full rounded-md">
        <div className="space-y-4 sm:space-y-5">
          {Questions.length === 0 ? (
            <div className="p-6 sm:p-8 text-gray-500 text-center bg-white rounded-lg border border-dashed">
              <p>No questions created yet.</p>
            </div>
          ) : (
            Questions.map((question, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 bg-white rounded-lg border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative accent */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  question.type === 'mcq' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                
                <div className="ml-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        question.type === 'mcq' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                        {question.type === 'mcq' ? 'MCQ' : 'Descriptive'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Question {index + 1}
                      </span>
                      
                      {/* Updated marks tag with more distinctive styling */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md text-amber-700 font-medium text-xs ml-auto sm:ml-0">
                        <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                        <span>{question.marks} {question.marks === 1 ? 'mark' : 'marks'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                        onClick={() => handleEditQuestion(index)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <p className="text-base sm:text-lg font-medium text-slate-800">{question?.question}</p>
                    
                    {question.type === 'mcq' && (
                      <div className="mt-3 pl-3 border-l-2 border-slate-200">
                        <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                          Choices:
                        </p>
                        <ul className="space-y-2">
                          {question.choices?.map((choice, i) => (
                            <li key={i} className={`flex items-center px-3 py-2 rounded-md text-sm ${
                              question.correctAnswer === String(i) 
                                ? 'bg-green-50 border border-green-100' 
                                : 'bg-slate-50 border border-slate-100'
                            }`}>
                              <span className="mr-2 h-5 w-5 flex items-center justify-center rounded-full bg-slate-200 text-xs">
                                {i + 1}
                              </span>
                              <span className="text-xs sm:text-sm">{choice}</span>
                              {question.correctAnswer === String(i) && (
                                <span className="ml-auto text-xs font-medium text-green-600 px-2 py-0.5 rounded-full bg-green-100">
                                  Correct
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <EditQuestionModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  questionIndex={editingQuestionIndex}
/>
    </div>
  );
};

export default ShowQuestions;