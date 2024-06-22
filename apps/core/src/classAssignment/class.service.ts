import { Injectable } from "@nestjs/common";
import { ClassModel } from "@repo/models";
import { Types } from "mongoose";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";

@Injectable()
export class ClassService {
    async assignAdministrator(classId: string, administratorId: string) {
        const classDoc = await ClassModel.findOne({ _id: new Types.ObjectId(classId) })

        if (!classDoc) {
            return ServerErrorResponse(
                new Error("Specified class could not be found"),
                404,
            )
        }

        classDoc.administrator = new Types.ObjectId(administratorId)
        await classDoc.save()

        return ServerSuccessResponse(classDoc)
    }
}