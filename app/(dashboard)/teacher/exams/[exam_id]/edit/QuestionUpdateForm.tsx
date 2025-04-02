import { useEffect, useState } from "react";
import useExamEditStore from "@/store/useExamEditStore"; 
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, Edit, HelpCircle, Award, Check, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface Question {
    question: string;
    choices: string[];
    correctAnswer: string;
    marks: number;
}

const EditQuestionComponent = () => {
    const { examQuestionsWithMetadata, updateQuestion, deleteQuestion,updateExam } = useExamEditStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const question = examQuestionsWithMetadata?.questions[selectedIndex];
    const router=useRouter();
    const [editedQuestion, setEditedQuestion] = useState<any>(question);

    useEffect(() => {
        // Update editedQuestion whenever question changes
        setEditedQuestion(question || {}); // Use empty object as default
    }, [question]);

    if (!examQuestionsWithMetadata?.questions.length) return (
        <Card className="w-full border-2 border-amber-200">
            <CardContent className="pt-6 flex items-center justify-center">
                <div className="text-center p-8">
                    <HelpCircle className="mx-auto h-12 w-12 text-amber-500 opacity-80" />
                    <p className="mt-4 text-lg font-medium text-amber-700">No questions available</p>
                    <p className="text-muted-foreground">Add your first question to get started</p>
                </div>
            </CardContent>
        </Card>
    );

    const handleInputChange = (field: keyof Question, value: any) => {
        setEditedQuestion((prev:any) => ({ ...prev, [field]: value }));
    };

    const handleChoiceChange = (index: number, value: string) => {
        const updatedChoices = [...editedQuestion!.choices];
        updatedChoices[index] = value;
        setEditedQuestion((prev:any) => ({ ...prev!, choices: updatedChoices }));
    };

    const addChoice = () => {
        setEditedQuestion((prev:any) => ({
            ...prev!,
            choices: [...prev!.choices, ""],
        }));
    };

    const removeChoice = (index: number) => {
        const updatedChoices = editedQuestion!.choices.filter((_:any, i:number) => i !== index);
        setEditedQuestion((prev:any) => ({ ...prev!, choices: updatedChoices }));
    };

    const handleSave = () => {
        if (!editedQuestion) return;
        updateQuestion(selectedIndex, editedQuestion);
        toast.success("Question updated successfully");
    };

    return (
        <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Edit Card */}
                <Card className="w-full shadow-lg border-2 border-blue-100 hover:border-blue-200 transition-all">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Edit className="h-5 w-5 text-blue-600" />
                                </TooltipTrigger>
                                <TooltipContent>Edit question details</TooltipContent>
                            </Tooltip>
                            Edit Question
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question-select" className="text-blue-700">Select Question</Label>
                            <Select 
                                value={selectedIndex.toString()} 
                                onValueChange={(value) => setSelectedIndex(Number(value))}
                            >
                                <SelectTrigger className="w-full border-blue-200 focus:ring-blue-500">
                                    <SelectValue placeholder="Select a question" />
                                </SelectTrigger>
                                <SelectContent>
                                    {examQuestionsWithMetadata?.questions.map((_, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            Question {index + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="bg-blue-100" />

                        <div className="space-y-2">
                            <Label htmlFor="question-text" className="flex items-center gap-1.5 text-blue-700">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-blue-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>The main question text</TooltipContent>
                                </Tooltip>
                                Question Text
                            </Label>
                            <Input
                                id="question-text"
                                value={editedQuestion?.question}
                                onChange={(e) => handleInputChange("question", e.target.value)}
                                className="border-blue-200 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-1.5 text-blue-700">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Check className="h-4 w-4 text-green-600" />
                                        </TooltipTrigger>
                                        <TooltipContent>Answer options for the question</TooltipContent>
                                    </Tooltip>
                                    Choices
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={addChoice}
                                            className="flex items-center gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                        >
                                            <Plus className="h-4 w-4" /> Add Choice
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Add a new answer choice</TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="space-y-2 mt-2">
                                {editedQuestion?.choices?.map((choice:any, index:number) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Badge variant="outline" className="w-7 h-7 flex items-center justify-center shrink-0 bg-blue-50 border-blue-200 text-blue-700">
                                            {index}
                                        </Badge>
                                        <Input
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                            className="flex-grow border-blue-200 focus:ring-blue-500"
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => removeChoice(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Remove this choice</TooltipContent>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correct-answer" className="flex items-center gap-1.5 text-green-700">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Check className="h-4 w-4 text-green-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>The correct answer to this question</TooltipContent>
                                </Tooltip>
                                Correct Answer
                            </Label>
                            <Input
                                id="correct-answer"
                                value={editedQuestion?.correctAnswer}
                                onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
                                className="border-green-200 focus:ring-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="marks" className="flex items-center gap-1.5 text-amber-700">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Award className="h-4 w-4 text-amber-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>Points awarded for correct answer</TooltipContent>
                                </Tooltip>
                                Marks
                            </Label>
                            <Input
                                id="marks"
                                type="number"
                                value={editedQuestion?.marks}
                                onChange={(e) => handleInputChange("marks", Number(e.target.value))}
                                className="border-amber-200 focus:ring-amber-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-end gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Question
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save changes to this question</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        deleteQuestion(selectedIndex);
                                        toast.success("Question deleted successfully");
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Question
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Permanently delete this question</TooltipContent>
                        </Tooltip>
                    </CardFooter>
                </Card>

                {/* Preview Card */}
                <Card className="w-full shadow-lg border-2 border-purple-100 hover:border-purple-200 transition-all">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Eye className="h-5 w-5 text-purple-600" />
                                </TooltipTrigger>
                                <TooltipContent>Preview how questions will appear</TooltipContent>
                            </Tooltip>
                            Question Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-6">
                                {examQuestionsWithMetadata?.questions.map((q, index) => (
                                    <div key={index} className={`p-4 rounded-md border-2 ${selectedIndex === index ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'} transition-all`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant={selectedIndex === index ? "default" : "outline"} className={selectedIndex === index ? "bg-purple-600" : "border-purple-300 text-purple-700"}>
                                                Question {index + 1}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1 border-amber-300 text-amber-700 bg-amber-50">
                                                <Award className="h-3 w-3" /> {q.marks} marks
                                            </Badge>
                                        </div>
                                        <p className="font-medium mb-2 text-purple-900">{q.question}</p>
                                        <div className="space-y-1 ml-2">
                                            {q.choices?.map((choice, choiceIndex) => (
                                                <div key={choiceIndex} className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`w-6 h-6 flex items-center justify-center ${q.correctAnswer === choice ? "bg-green-100 border-green-300 text-green-700" : "bg-gray-50"}`}>
                                                        {choiceIndex}
                                                    </Badge>
                                                    <p className={q.correctAnswer === choice ? "text-green-600 font-medium" : "text-gray-700"}>
                                                        {choice}
                                                        {q.correctAnswer === choice && 
                                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-green-100 text-green-700 rounded-full">✓</span>
                                                        }
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => setSelectedIndex(index)}
                                                        className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" /> Edit
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit this question</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-purple-50 to-pink-50 flex justify-end">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="default" className="bg-purple-600 hover:bg-purple-700" onClick={async()=>{await updateExam()
                                    router.back();
                                }}>
                                    Submit Updated Exam
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save all changes to the exam</TooltipContent>
                        </Tooltip>
                    </CardFooter>
                </Card>
            </div>
        </TooltipProvider>
    );
};

export default EditQuestionComponent;