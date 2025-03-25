'use client';

import { useState } from "react"
import ExamMetaDataStep from "./ExamMetaDataStep";
import ExamQuestionsStep from "./ExamQuestionsStep";

const CreateExamManualy = () => {
    const [formStep,setFormStep]=useState(0);
  return (
    <div className="p-3 flex-1 h-full">
        {formStep===0 && <ExamMetaDataStep nextStep={()=>{setFormStep(prev=>prev+1)}}/>}
        {
            formStep===1 && <ExamQuestionsStep prevStep={()=>{setFormStep(prev=>prev-1)}}/>
        }
    </div>
  )
}

export default CreateExamManualy