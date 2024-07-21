import { ServerErrorResponse } from "../common/entities/responses.entity";


export function sendInternalServerError(err: any){
    return ServerErrorResponse(
        new Error(`${err}`),
        500
    )
}