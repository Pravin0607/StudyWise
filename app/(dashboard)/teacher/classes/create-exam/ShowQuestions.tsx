import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamStore } from "@/store/useExamStore";
import { Edit, Trash2 } from "lucide-react";

const ShowQuestions=()=>{
    const Questions=useExamStore(state=>state.questions);
    const removeQuestion=useExamStore(state=>state.removeQuestion);
    return(
        <div className="p-3 bg-card rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Created Questions
        </h2>
        <ScrollArea className="h-[80%] w-full rounded-md">
          <div className="p-2 space-y-4">
            {Questions.length === 0 ? (
              <p className="text-gray-500 text-center">No questions created yet.</p>
            ) : (
              Questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted rounded-lg border flex items-start justify-between"
                >
                  <div className="space-y-2 flex-grow mr-4">
                    <p className="font-medium">
                      {question.type === 'mcq' ? 'MCQ' : 'Descriptive'} Question
                      {index + 1}
                    </p>
                    <p className="text-gray-700">{question?.question}</p>
                    {question.type === 'mcq' && (
                      <div className="space-y-1">
                        <p>
                          <span className="font-semibold">Choices:</span>
                        </p>
                        <ul className="list-disc list-inside">
                          {question.choices?.map((choice, i) => {
                            return(
                                <li key={i}>
                                  {choice}
                                  {question.correctAnswer === String(i) ? (
                                    <span className="text-green-500 ml-2">
                                      (Correct)
                                    </span>
                                  ) : null}
                                </li>
                              )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                    //   onClick={() => handleEditQuestion(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>)
};

export default ShowQuestions;