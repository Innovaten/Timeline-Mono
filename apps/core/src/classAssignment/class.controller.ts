import { Controller, Post, Body } from "@nestjs/common";
import { ClassService } from "./class.service";
import { AssignAdminDTO } from "./assign-admin.dto";
import { ServerErrorResponse, ServerSuccessResponse } from "../common/entities/responses.entity";

@Controller({
    path: 'classes',
    version: '1'
})

export class ClassesController {
    constructor(private service: ClassService) {}

    @Post('assign-administrator')
    async assignAdministrator(@Body() assignAdminDto: AssignAdminDTO) {
        try {
            const result = await this.service.assignAdministrator(assignAdminDto.classId, assignAdminDto.administratorId)
            return ServerSuccessResponse(result)
        } catch (err) {
            return ServerErrorResponse(new Error(`${err}`), 500)
        }
    }
}

