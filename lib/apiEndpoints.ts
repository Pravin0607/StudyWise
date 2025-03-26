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
    }    
}