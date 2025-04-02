import { useEffect, useState } from "react";
import useExamEditStore from "@/store/useExamEditStore"; 
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditQuestionComponent = () => {
    const { examQuestionsWithMetadata, updateQuestion } = useExamEditStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const question = examQuestionsWithMetadata?.questions[selectedIndex];

    const [editedQuestion, setEditedQuestion] = useState<any>(question);

    useEffect(() => {
        // Update editedQuestion whenever question changes
        setEditedQuestion(question || {}); // Use empty object as default
    }, [question]);

    if (!question) return <p>No questions available</p>;

    const handleInputChange = (field: keyof typeof question, value: any) => {
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
        <div className="p-4 border rounded-lg shadow-md">
            <label className="block mb-2 font-semibold">Select Question:</label>
            <select
                value={selectedIndex}
                onChange={(e) => {
                    console.log(e.target.value);
                    setSelectedIndex(Number(e.target.value))
                }}
                className="mb-3 p-2 border rounded"
            >
                {examQuestionsWithMetadata?.questions.map((_, index) => (
                    <option key={index} value={index}>
                        Question {index + 1}
                    </option>
                ))}
            </select>
            <label className="block mb-2 font-semibold">Question:</label>
            <Input
                type="text"
                value={editedQuestion?.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                className="mb-3"
            />
            <label className="block mb-2 font-semibold">Choices:</label>
            {editedQuestion?.choices.map((choice:any, index:number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                        type="text"
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                    />
                    <Button variant="destructive" onClick={() => removeChoice(index)}>
                        X
                    </Button>
                </div>
            ))}
            <Button onClick={addChoice} className="mb-3">
                Add Choice
            </Button>
            <label className="block mb-2 font-semibold">Correct Answer:</label>
            <Input
                type="text"
                value={editedQuestion?.correctAnswer}
                onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
                className="mb-3"
            />
            <label className="block mb-2 font-semibold">Marks:</label>
            <Input
                type="number"
                value={editedQuestion?.marks}
                onChange={(e) => handleInputChange("marks", Number(e.target.value))}
                className="mb-3"
            />
            <Button onClick={handleSave}>Save Question</Button>
        </div>
    );
};

export default EditQuestionComponent;