import { Role } from "../role/role.enum";

export interface IJWTPayload {
    userId : number;
    fullname : string,
    email: string;
    role: Role[];
    phoneNum:string;
    department:string,
    userNumber:string,
}