import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

const AddMaterialModal = ({
    children,
    onMaterialUpload
}: {
    children: React.ReactNode;
    onMaterialUpload?: (files: File[]) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'text/plain', 'application/msword'];
            const validFiles: File[] = [];
            const invalidFiles: string[] = [];

            Array.from(files).forEach((file) => {
                if (allowedTypes.includes(file.type)) {
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

    const confirmUpload = () => {
        if (selectedFiles.length > 0 && onMaterialUpload) {
            onMaterialUpload(selectedFiles);
        }
        setOpen(false); // Close the modal after confirmation
        setSelectedFiles([]); // Reset the selected files
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
                                accept=".pdf,.ppt,.txt,.doc"
                                onChange={handleFileChange}
                                multiple // Allow multiple file selection
                                className="cursor-pointer"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-sm text-gray-700">Selected Files:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                {selectedFiles.map((file) => (
                                    <li key={file.name} className="flex items-center justify-between">
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFile(file.name)}
                                            className="text-red-500 md:text-sm"
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {selectedFiles.length > 0 && (
                    <DialogFooter className="flex items-center justify-between space-y-2 md:flex-col">
                        <p className="text-sm text-gray-700 order-1">
                            Confirm upload of <span className="font-bold">{selectedFiles.length}</span> file(s)?
                        </p>
                        <div className="flex gap-2 md:order-1">
                            <Button variant="outline" onClick={() => setSelectedFiles([])}>
                                Cancel
                            </Button>
                            <Button onClick={confirmUpload} variant="outline" className="bg-green-300">
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddMaterialModal;