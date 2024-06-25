import { Injectable } from '@nestjs/common';
import { IRegistrationDoc, RegistrationModel } from '@repo/models';
import { Types } from 'mongoose';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { RegistrationDTO } from './registrations.dto';
import lodash from 'lodash';

@Injectable()
export class RegistrationsService {

    async getRegistrations(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await RegistrationModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ createdAt: -1})
        return results;
    }

    async approveRegistration(_id: string, approver: string){
        const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})

        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        registration.approvedAt = new Date();
        registration.approvedBy = new Types.ObjectId(approver);
        registration.status = 'Approved';
        
        await registration.save()

        return ServerSuccessResponse(registration);
    }

    async rejectRegistration(_id: string, approver: string){
        const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})

        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        registration.rejectedAt = new Date();
        registration.rejectedBy = new Types.ObjectId(approver);
        registration.status = 'Rejected';
        
        await registration.save()

        return ServerSuccessResponse(registration);
    }

    async createNewRegistration(regData: RegistrationDTO){

        try {
            const newCode =  "REG" + lodash.padStart(`${await(RegistrationModel.countDocuments()) + 1}`, 6, "0");
            
            const {authToken , ...actualData} = regData
            const registration = new RegistrationModel({
                ...actualData,
                code: newCode,
            });

            await registration.save();
            console.log(`Created new registration: ${registration.code}`)
            return ServerSuccessResponse<IRegistrationDoc>(registration)
        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500)
        }
    }

}
