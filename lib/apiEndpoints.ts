import { base_url } from "./constants";

export const Endpoints={
    LOGIN:`${base_url}/auth/login`,
    REGISTER:`${base_url}/auth/register`,
    VERIFYTOKEN:`${base_url}/auth/me`,
    CLASS:{
        // POST
        CREATECLASS:`${base_url}/teacher/create-class`,
        // PUT
        UPDATECLASS:`${base_url}/teacher/update-class`,
        // DELETE
        DELETECLASS:`${base_url}/teacher/delete-class`,
        // POST
        ADDSTUDENT:`${base_url}/teacher/add-student/:classId`,
        // DELETE
        REMOVESTUDENT:`${base_url}/teacher/remove-student/:classId/:studentId`,
        // GET
        GETCLASSES:`${base_url}/teacher/get-classes`,
        // GET
        GETSTUDENTSBYCLASSID:`${base_url}/teacher/get-students/:classId`,
        // GET ?search
        GETSTUDENTSBYSEARCH:`${base_url}/teacher/get-students`,
        // POST
        CREATEEXAM:`${base_url}/teacher/create-exam`,
        // 
        DELETEEXAM:`${base_url}/teacher/delete-exam/:examId`,
    },
    MATERIALS:{
        // POST
        UPLOADMATERIAL: `${base_url}/material/upload-material`,
        // GET
        DOWNLOADMATERIAL: `${base_url}/material/download-material/:material_id`,
        // GET
        GETMATERIALS: `${base_url}/material/get-materials/:class_id`,
        // GET
        GETMATERIALSBYTEACHER: `${base_url}/material/get-materials-by-teacher`,
        // DELETE
        DELETEMATERIAL: `${base_url}/material/delete-material/:material_id`,
    },
    COMMON:{
        UPDATEUSER:`${base_url}/common/update-user`,
    },
    STUDENT:{
        // GET
        GETCLASSLIST:`${base_url}/student/get-classlist`,
        // GET
        GETEXAMLIST: `${base_url}/student/get-examlist`,
        // GET
        GETEXAMLISTBYCLASS: `${base_url}/student/get-examlist-by-class/:classId`,
        // GET
        GETMATERIALLIST: `${base_url}/student/get-materiallist/:classId`,
        // GET
        GETEXAMLISTBYSTUDENT: `${base_url}/student/get-examlist/:classId`,
        // GET
        GETTEACHERDETAILS: `${base_url}/student/get-teacherdetails/:classId`,
    },
    EXAM:{
        // GET
        GETEXAMMETADATA: `${base_url}/exam/metadata/:examId`,
        // GET 
        GETEXAM: `${base_url}/exam/:examId`,
        // PUT
        UPDATEEXAM: `${base_url}/exam/:examId`,
    }
}