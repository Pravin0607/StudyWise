import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useUserStore from '@/store/userStore';
// import { useRouter } from 'next/navigation';
import { useMaterialStore } from '@/store/useMaterialStore';

const AddMaterialModal = ({
    children,
    classId,
    onMaterialUpload
}: {
    children: React.ReactNode;
    classId: string;
    onMaterialUpload?: (files: File[]) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const token=useUserStore(state=>state.user.token);
    const {fetchMaterialsByClassId}=useMaterialStore();
    // const router=useRouter();
    const { uploadNewMaterial } = useMaterialStore();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            // Check if adding new files would exceed the 5 file limit
            if (selectedFiles.length + files.length > 5) {
                setError("You can upload a maximum of 5 files at once.");
                return;
            }

            Array.from(files).forEach((file) => {
                const fileType = file.type.toLowerCase();
                const fileName = file.name.toLowerCase();
            
                if (
                    allowedTypes.includes(fileType) ||
                    fileName.endsWith('.docx')
                ) {
                    validFiles.push(file);
                } else {
                    invalidFiles.push(file.name);
                }
            });

            if (invalidFiles.length > 0) {
                setError(`Invalid file types: ${invalidFiles.join(', ')}. Only PDF, PPT, Text, and DOC files are allowed.`);
            } else {
                setError(null);
            }

            setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
    };

    const confirmUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select at least one file to upload.");
            return;
        }

        if (selectedFiles.length > 5) {
            setError("You can upload a maximum of 5 files at once.");
            return;
        }

        setIsUploading(true);
        try {
            // Create FormData and append files
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });
            // add classId to the form data
            formData.append('class_id', classId);
            // Call the upload service
            const result=await uploadNewMaterial(classId, formData,token as string);
            // Notify parent component
            if (onMaterialUpload) {
                onMaterialUpload(selectedFiles);
            }
            await fetchMaterialsByClassId(classId, token as string);
            toast.success("Materials uploaded successfully!");
            setOpen(false); // Close the modal after confirmation
            setSelectedFiles([]); // Reset the selected files
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload materials. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = (fileName: string) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Materials</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <Upload />
                            <Input
                                type="file"
                                accept=".pdf,.ppt,.pptx,.txt,.doc,.docx"
                                onChange={handleFileChange}
                                multiple // Allow multiple file selection
                                className="cursor-pointer"
                                disabled={selectedFiles.length >= 5 || isUploading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                            Max 5 files (PDF, PPT, TXT, DOC formats only)
                        </p>
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-sm text-gray-700">Selected Files ({selectedFiles.length}/5):</p>
                            <ul className="list-disc pl-5 space-y-2">
                                {selectedFiles.map((file) => (
                                    <li key={file.name} className="flex items-center justify-between">
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFile(file.name)}
                                            className="text-red-500 md:text-sm"
                                            disabled={isUploading}
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <DialogFooter className="flex items-center justify-between space-y-2 md:flex-col">
                    <p className="text-sm text-gray-700 order-1">
                        {selectedFiles.length > 0 ? 
                            `Confirm upload of ${selectedFiles.length} file(s)?` : 
                            "Please select at least one file to upload."}
                    </p>
                    <div className="flex gap-2 md:order-1">
                        <Button 
                            variant="outline" 
                            onClick={() => setSelectedFiles([])}
                            disabled={isUploading || selectedFiles.length === 0}
                        >
                            Clear All
                        </Button>
                        <Button 
                            onClick={confirmUpload} 
                            variant="outline" 
                            className="bg-green-300"
                            disabled={selectedFiles.length === 0 || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Confirm Upload"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMaterialModal;