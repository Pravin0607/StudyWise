'use client';
import CreateQuestions from "./CreateQuestions";
import ShowQuestions from "./ShowQuestions";

const ExamQuestionsStep = () => {
  return (
    <div className="h-full w-full flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 ">
        <CreateQuestions/>
        <ShowQuestions/>
    </div>
  )
}

export default ExamQuestionsStep