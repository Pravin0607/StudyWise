import { create } from 'zustand';
import { Material, getMaterialsByClassId, getMaterialsByTeacher, uploadMaterial, downloadMaterial, deleteMaterial } from '../services/materialsServices';

interface MaterialState {
    materials: Material[];
    classMaterials: Material[];
    teacherMaterials: Material[];
    isLoading: boolean;
    error: string | null;
    setMaterials: (materials: Material[]) => void;
    setClassMaterials: (classMaterials: Material[]) => void;
    setTeacherMaterials: (teacherMaterials: Material[]) => void;
    fetchMaterialsByClassId: (classId: string, token: string) => Promise<void>;
    fetchMaterialsByTeacher: (token: string) => Promise<void>;
    uploadNewMaterial: (classId: string, files: FormData, token: string) => Promise<void>;
    downloadMaterialById: (materialId: string, token: string) => Promise<string | undefined>;
    deleteMaterialById: (materialId: string, token: string) => Promise<boolean>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
    materials: [],
    classMaterials: [],
    teacherMaterials: [],
    isLoading: false,
    error: null,
    setMaterials: (materials) => set({ materials: materials }),
    setClassMaterials: (classMaterials) => set({ classMaterials: classMaterials }),
    setTeacherMaterials: (teacherMaterials) => set({ teacherMaterials: teacherMaterials }),
    fetchMaterialsByClassId: async (classId, token) => {
        set({ isLoading: true, error: null });
        try {
            const materials = await getMaterialsByClassId(classId, token);
            if (materials) {
                set({ classMaterials: materials, isLoading: false });
            } else {
                set({ classMaterials: [], isLoading: false, error: 'Failed to fetch materials for this class.' });
            }
        } catch (error: any) {
            set({ classMaterials: [], isLoading: false, error: error.message || 'An error occurred while fetching materials.' });
        }
    },
    fetchMaterialsByTeacher: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const materials = await getMaterialsByTeacher(token);
            if (materials) {
                set({ teacherMaterials: materials, isLoading: false });
            } else {
                set({ teacherMaterials: [], isLoading: false, error: 'Failed to fetch materials for this teacher.' });
            }
        } catch (error: any) {
            set({ teacherMaterials: [], isLoading: false, error: error.message || 'An error occurred while fetching materials.' });
        }
    },
    uploadNewMaterial: async (classId, files, token) => {
        set({ isLoading: true, error: null });
        try {
            const uploadedMaterials = await uploadMaterial(classId, files, token);
            if (uploadedMaterials) {
                set((state) => ({
                    materials: [...state.materials, ...uploadedMaterials],
                    classMaterials: [...state.classMaterials, ...uploadedMaterials],
                    isLoading: false,
                }));
            } else {
                set({ isLoading: false, error: 'Failed to upload materials.' });
            }
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'An error occurred while uploading materials.' });
        }
    },
    downloadMaterialById: async (materialId, token) => {
        try {
            const downloadUrl = await downloadMaterial(materialId, token);
            return downloadUrl;
        } catch (error: any) {
            set({ error: error.message || 'An error occurred while downloading the material.' });
            return undefined;
        }
    },
    deleteMaterialById: async (materialId, token) => {
        set({ isLoading: true, error: null });
        try {
            const success = await deleteMaterial(materialId, token);
            if (success) {
                set((state) => ({
                    materials: state.materials.filter((material) => material.material_id !== materialId),
                    classMaterials: state.classMaterials.filter((material) => material.material_id !== materialId),
                    teacherMaterials: state.teacherMaterials.filter((material) => material.material_id !== materialId),
                    isLoading: false,
                }));
                return true;
            } else {
                set({ isLoading: false, error: 'Failed to delete material.' });
                return false;
            }
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'An error occurred while deleting the material.' });
            return false;
        }
    },
}));