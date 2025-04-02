'use client'
import { TimePicker } from "@/components/shared/TimePicker";
import useExamEditStore from "@/store/useExamEditStore";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import MetadataUpdateForm from "./MetadataUpdateForm";
import QuestionUpdateForm from "./QuestionUpdateForm";
import { Button } from "@/components/ui/button";


const page = () => {
    const {exam_id}=useParams();
    const [step, setStep]=useState(0);
    const {fetchExamQuestionsWithMetadata,examQuestionsWithMetadata}=useExamEditStore();
    useEffect(()=>{
(async()=>{
    await fetchExamQuestionsWithMetadata(exam_id as string);
})()
    },[exam_id, fetchExamQuestionsWithMetadata])
  return (
    <div className="flex h-full w-full flex-col p-2">
        <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Exam</h1>
        </div>
        <div className="flex-1">
        {step===0 ? (<MetadataUpdateForm gotoNext={()=>{setStep(1)}}/>): <QuestionUpdateForm/>}
        </div>
        <div className="flex w-full items-center justify-between">
            <Button className="btn btn-primary" onClick={()=>setStep(0)}>Metadata</Button>
            <Button className="btn btn-primary" onClick={()=>setStep(1)}>Questions</Button>
        </div>
    </div>
  )
}

export default page