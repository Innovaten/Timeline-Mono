import { Injectable } from '@nestjs/common';
import { RegistrationModel } from '@repo/models';
import { Types } from 'mongoose';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';

@Injectable()
export class RegistrationsService {

    async getRegistrations(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await RegistrationModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0)
        return results;
    }

    async approveRegistration(_id: string){
        const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})

        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        registration.approvedAt = new Date();
        await registration.save()

        return ServerSuccessResponse(registration);
    }

}
