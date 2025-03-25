'use client';
import { useState, useEffect } from "react";
import CreateQuestions from "./CreateQuestions";
import ShowQuestions from "./ShowQuestions";
import { Edit, Trash2, Star, Info, X, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExamQuestionsStep = ({ prevStep }: { prevStep: () => void }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Show the dialog when the component mounts
    setShowDialog(true);
  }, []);

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <div className="relative p-3 md:p-6 h-full">
      {/* Welcome Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-slate-200 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Welcome to Exam Creation
              </h2>
              <button
                onClick={handleCloseDialog}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-slate-600">
              <p>Here you can create questions for your exam:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Use the left panel to create new MCQ or descriptive questions</li>
                <li>View and manage your questions in the right panel</li>
                <li>Edit or delete questions as needed</li>
              </ul>
              <p className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 border border-amber-200 mt-4">
                <strong>Note:</strong> In order to complete creation of exam you need to click the 
                <span className="mx-1 px-2 py-0.5 bg-blue-500 text-white rounded">Create Exam</span> button.
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={toggleGuide}>
                View Icon Guide
              </Button>
              <Button onClick={handleCloseDialog} className="bg-blue-500 hover:bg-blue-600">
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help Guide Button */}
      <div className="absolute top-4 right-4 z-40">
        <Button 
          onClick={toggleGuide}
          variant="outline"
          className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
          size="sm"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Icon Guide</span>
        </Button>
      </div>

      {/* Guide Popover */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 border border-slate-200 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Icon Guide</h2>
              <button
                onClick={toggleGuide}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-slate-600">
                <p className="mb-3">Here's what each icon in the exam creation process means:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <Edit className="h-5 w-5 text-blue-600" />
                    <span><strong>Edit</strong> - Click to modify an existing question</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <span><strong>Delete</strong> - Remove a question from the exam</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <Star className="h-5 w-5 fill-amber-500 stroke-amber-500" />
                    <span><strong>Marks</strong> - Indicates the point value of a question</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <ArrowLeft className="h-5 w-5 text-blue-500" />
                    <span><strong>Back</strong> - Return to the previous step</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <div className="h-4 w-1.5 bg-blue-500 rounded-full"></div>
                    <span><strong>Blue indicator</strong> - Marks Multiple Choice Questions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <div className="h-4 w-1.5 bg-purple-500 rounded-full"></div>
                    <span><strong>Purple indicator</strong> - Marks Descriptive Questions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={toggleGuide} className="bg-blue-500 hover:bg-blue-600">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto mt-12 md:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="lg:order-1 order-1">
            <CreateQuestions prevStep={prevStep} />
          </div>
          <div className="lg:order-2 order-2">
            <ShowQuestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamQuestionsStep;