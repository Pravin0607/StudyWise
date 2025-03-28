import axios from "axios";
import { Endpoints } from "../lib/apiEndpoints";
import { toast } from "react-hot-toast";

// Define the type for the material object
export interface Material {
    _id?: string;
    material_id: string;
    class_id: string;
    uploaded_by: string;
    file_name: string;
    file_ext: string;
    file_size: number;
    s3_link: string;
    uploaded_date?: Date;
    class_name?: string;
}

// Function to upload material
export const uploadMaterial = async (
    class_id: string,
    files: FormData,
    token: string
): Promise<Material[] | undefined> => {
    try {
        const response = await axios.post(Endpoints.MATERIALS.UPLOADMATERIAL, files, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 201) {
            toast.success("Files uploaded successfully");
            return response.data.materials as Material[];
        } else {
            toast.error("Failed to upload files");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error uploading material:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        return undefined;
    }
};

// Function to download material
export const downloadMaterial = async (
    material_id: string,
    token: string
): Promise<string | undefined> => {
    try {
        const response = await axios.get(
            Endpoints.MATERIALS.DOWNLOADMATERIAL.replace(":material_id", material_id),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            return response.data.url as string;
        } else {
            toast.error("Failed to download file");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error downloading material:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        return undefined;
    }
};

// Function to get materials by class ID
export const getMaterialsByClassId = async (
    class_id: string,
    token: string
): Promise<Material[] | undefined> => {
    try {
        const response = await axios.get(
            Endpoints.MATERIALS.GETMATERIALS.replace(":class_id", class_id),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            return response.data.materials as Material[];
        } else {
            toast.error("Failed to fetch materials");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error getting materials:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        return undefined;
    }
};

// Function to get materials by teacher
export const getMaterialsByTeacher = async (
    token: string
): Promise<Material[] | undefined> => {
    try {
        const response = await axios.get(
            Endpoints.MATERIALS.GETMATERIALSBYTEACHER,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            return response.data.materials as Material[];
        } else {
            toast.error("Failed to fetch materials");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error getting materials:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        return undefined;
    }
};

// Function to delete material
export const deleteMaterial = async (
    material_id: string,
    token: string
): Promise<boolean> => {
    try {
        const response = await axios.delete(
            Endpoints.MATERIALS.DELETEMATERIAL.replace(":material_id", material_id),
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            toast.success("Material deleted successfully");
            return true;
        } else {
            toast.error("Failed to delete material");
            return false;
        }
    } catch (error: any) {
        console.error("Error deleting material:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        return false;
    }
};