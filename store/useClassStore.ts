import { create } from 'zustand';
import axios from 'axios';
import { Endpoints } from '@/lib/apiEndpoints';
import toast from 'react-hot-toast';
import useUserStore from './userStore';
import { persist,devtools ,createJSONStorage} from 'zustand/middleware';

export type ClassType = {
  class_id: string;
  class_name: string;
  students: string[];
  teacher_id: string;
  subjects?: any[];
};

type ClassState = {
  classes: ClassType[];
  isLoading: boolean;
  error: string | null;
  selectedClass: ClassType | null;
  studentsDetails:{user_id:string,first_name:string,last_name:string,email:string}[];
  // Actions
  fetchClasses: () => Promise<void>;
  fetchStudentsByClassId: (classId: string) => Promise<void>;
  createClass: (className: string) => Promise<ClassType | null>;
  updateClass: (classId: string, className: string) => Promise<boolean>;
  deleteClass: (classId: string) => Promise<boolean>;
  addStudent: (classId: string, studentId: string) => Promise<boolean>;
  removeStudent: (classId: string, studentId: string) => Promise<boolean>;
  selectClass: (classId: string) => void;
  clearSelectedClass: () => void;
  reset: () => void;
};

const useClassStore = create<ClassState>()(
    devtools(persist(
        (set, get) => ({
            classes: [],
            isLoading: false,
            error: null,
            selectedClass: null,
            studentsDetails:[],          
            // working
            fetchClasses: async () => {
              set({ isLoading: true, error: null });
              try {
                const token = useUserStore.getState().user.token;
                const response = await axios.get(Endpoints.CLASS.GETCLASSES, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.status === 200 && response.data?.success) {
                  set({ classes: response.data.classes, isLoading: false });
                  return;
                }
                
                throw new Error('Failed to fetch classes');
              } catch (error) {
                console.error('Error fetching classes:', error);
                toast.error('Failed to load classes');
                set({ error: 'Failed to fetch classes', isLoading: false });
              }
            },
            // working
            fetchStudentsByClassId: async (classId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const token = useUserStore.getState().user.token;
                    const response = await axios.get(
                    Endpoints.CLASS.GETSTUDENTSBYCLASSID.replace(':classId', classId),
                    { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    if (response.status === 200 && response.data?.success) {
                    const students=response.data.students.map((student:any)=>({user_id:student.user_id,first_name:student.first_name,last_name:student.last_name,email:student.email}));

                    set({ studentsDetails: students, isLoading: false });
                    return;
                    }
                    
                    throw new Error('Failed to fetch students');
                } catch (error) {
                    console.error('Error fetching students:', error);
                    toast.error('Failed to load students');
                    set({ error: 'Failed to fetch students', isLoading: false });
                }
            },
            //working 
            createClass: async (className: string) => {
              set({ isLoading: true, error: null });
              try {
                const token = useUserStore.getState().user.token;
                const response = await axios.post(
                  Endpoints.CLASS.CREATECLASS,
                  { class_name: className },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.status === 201) {
                  const newClass = response.data.ClassResp;
                  set(state => ({ 
                    classes: [...state.classes, newClass],
                    isLoading: false 
                  }));
                  toast.success('Class created successfully');
                  return newClass;
                }
                
                throw new Error('Failed to create class');
              } catch (error) {
                console.error('Error creating class:', error);
                toast.error('Failed to create class');
                set({ error: 'Failed to create class', isLoading: false });
                return null;
              }
            },
          
            updateClass: async (classId: string, className: string) => {
              set({ isLoading: true, error: null });
              try {
                const token = useUserStore.getState().user.token;
                const response = await axios.put(
                  Endpoints.CLASS.UPDATECLASS,
                  { class_id: classId, class_name: className },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.status === 200) {
                  set(state => ({ 
                    classes: state.classes.map(cls => 
                      cls.class_id === classId ? { ...cls, class_name: className } : cls
                    ),
                    selectedClass: state.selectedClass?.class_id === classId 
                      ? { ...state.selectedClass, class_name: className } 
                      : state.selectedClass,
                    isLoading: false 
                  }));
                  toast.success('Class updated successfully');
                  return true;
                }
                
                throw new Error('Failed to update class');
              } catch (error) {
                console.error('Error updating class:', error);
                toast.error('Failed to update class');
                set({ error: 'Failed to update class', isLoading: false });
                return false;
              }
            },
          
            deleteClass: async (classId: string) => {
              set({ isLoading: true, error: null });
              try {
                const token = useUserStore.getState().user.token;
                const response = await axios.delete(
                  `${Endpoints.CLASS.DELETECLASS}/${classId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.status === 200) {
                  set(state => ({ 
                    classes: state.classes.filter(cls => cls.class_id !== classId),
                    selectedClass: state.selectedClass?.class_id === classId ? null : state.selectedClass,
                    isLoading: false 
                  }));
                  toast.success('Class deleted successfully');
                  return true;
                }
                
                throw new Error('Failed to delete class');
              } catch (error) {
                console.error('Error deleting class:', error);
                toast.error('Failed to delete class');
                set({ error: 'Failed to delete class', isLoading: false });
                return false;
              }
            },
          
            addStudent: async (classId: string, studentId: string) => {
              set({ isLoading: true, error: null });
              try {
                console.log(classId,studentId);
                const token = useUserStore.getState().user.token;
                const response = await axios.post(
                  Endpoints.CLASS.ADDSTUDENT.replace(':classId', classId),
                  {studentId: studentId },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.status === 200) {
                  // Update the classes list and selected class if it's the one being modified
                  set(state => {
                    const updatedClasses = state.classes.map(cls => {
                      if (cls.class_id === classId) {
                        return { 
                          ...cls, 
                          students: [...cls.students, studentId],

                        };
                      }
                      return cls;
                    });
                    
                    const updatedSelectedClass = state.selectedClass?.class_id === classId
                      ? { ...state.selectedClass, students: [...state.selectedClass.students, studentId] }
                      : state.selectedClass;
                      
                    return { 
                      classes: updatedClasses,
                      selectedClass: updatedSelectedClass,
                      isLoading: false 
                    };
                  });
                //   fetch students by classs id
                  await get().fetchStudentsByClassId(classId);                     
                  toast.success('Student added to class');
                  return true;
                }
                
                throw new Error('Failed to add student');
              } catch (error) {
                console.error('Error adding student:', error);
                toast.error('Failed to add student to class');
                set({ error: 'Failed to add student', isLoading: false });
                return false;
              }
            },
          
            removeStudent: async (classId: string, studentId: string) => {
              set({ isLoading: true, error: null });
              try {
                const token = useUserStore.getState().user.token;
                const response = await axios.delete(
                  Endpoints.CLASS.REMOVESTUDENT
                    .replace(':classId', classId)
                    .replace(':studentId', studentId),
                  { 
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                
                if (response.status === 200) {
                  // Update the classes list and selected class if it's the one being modified
                  set(state => {
                    const updatedClasses = state.classes.map(cls => {
                      if (cls.class_id === classId) {
                        return { 
                          ...cls, 
                          students: cls.students.filter(id => id !== studentId)
                        };
                      }
                      return cls;
                    });
                    
                    const updatedSelectedClass = state.selectedClass?.class_id === classId
                      ? { 
                          ...state.selectedClass, 
                          students: state.selectedClass.students.filter(id => id !== studentId) 
                        }
                      : state.selectedClass;
                      
                    return { 
                      classes: updatedClasses,
                      selectedClass: updatedSelectedClass,
                      isLoading: false 
                    };
                  });
                  get().fetchStudentsByClassId(classId);
                  toast.success('Student removed from class');
                  return true;
                }
                
                throw new Error('Failed to remove student');
              } catch (error) {
                console.error('Error removing student:', error);
                toast.error('Failed to remove student from class');
                set({ error: 'Failed to remove student', isLoading: false });
                return false;
              }
            },
          
            selectClass: (classId: string) => {
              const selectedClass = get().classes.find(cls => cls.class_id === classId) || null;
              set({ selectedClass });
            },
          
            clearSelectedClass: () => {
              set({ selectedClass: null });
            },
            // add
          
            reset: () => {
              set({ 
                classes: [],
                isLoading: false,
                error: null,
                selectedClass: null,
                studentsDetails:[]
              });
            }
          })
        ,{
            name: 'class-storage',
        }))
);

export default useClassStore;