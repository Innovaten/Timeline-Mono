import { Injectable } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { ClassModel, UserModel, RegistrationModel } from '@repo/models';

@Injectable()
export class ResourcesService {
    async getClassesCount(){
        const count = await ClassModel.find({});
        return count.length;
    }

    async getAdminCount(){
        const count = await UserModel.find({});
        return count.length;
    }

    async getStudentsCount(){
        const count = await RegistrationModel.find({admissionStatus:'Accepted'});
        return count.length;
    }

    async getPendingCount(){
        const count = await RegistrationModel.find({status:'Pending'});
        return count.length;
    }
}
