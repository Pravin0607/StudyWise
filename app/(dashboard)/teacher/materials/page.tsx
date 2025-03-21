"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MaterialsTable from "./MaterialsTable";

interface Material {
    id: string;
    filename: string;
    url: string;
    type: string;
}

const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [classes, setClasses] = useState<string[]>([
        "Class A",
        "Class B",
        "Class C",
    ]); // Example classes
    const [selectedClass, setSelectedClass] = useState<string>("");

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            //  const response = await axios.get('/api/materials');
            setMaterials([]);
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast.error("Failed to load materials.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass(event.target.value);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select a file.");
            return;
        }

        if (!selectedClass) {
            toast.error("Please select a class.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append("files", file); // Use 'files' as the key for multiple files
            });
            formData.append("class", selectedClass); // Add the class to the form data

            await axios.post("/api/materials/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Files uploaded successfully!");
            fetchMaterials(); // Refresh the list after upload
            setSelectedFiles([]);
            setSelectedClass("");
        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error("Failed to upload files.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/materials/${id}`);
            toast.success("File deleted successfully!");
            fetchMaterials(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Failed to delete file.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Materials</h1>

            {/* File Upload Section */}
            <div className="mb-4 flex flex-col justify-center items-center">
                {/* Class Selection Dropdown */}
                <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                >
                    <option value="">Select Class</option>
                    {classes.map((className) => (
                        <option key={className} value={className}>
                            {className}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-2"
                />
                <button
                    onClick={handleUpload}
                    disabled={
                        uploading ||
                        selectedFiles.length === 0 ||
                        !selectedClass
                    }
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* File List Section */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Uploaded Files</h2>
                <MaterialsTable/>               
            </div>
        </div>
    );
};

export default MaterialsPage;
