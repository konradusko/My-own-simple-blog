
export const createErrorResponse = (status,message = null)=>{
    throw {status:status,message:message}
}