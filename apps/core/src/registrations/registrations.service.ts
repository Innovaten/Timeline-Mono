import { Injectable } from '@nestjs/common';
import { IRegistrationDoc, RegistrationModel } from '@repo/models';
import { model, Types } from 'mongoose';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { RegistrationDTO } from './registrations.dto';
import lodash from 'lodash';
import { KafkaService } from '../common/services/kafka.service';
import { CoreConfig } from '../config';
import { UserService } from '../common/services/user.service';

@Injectable()
export class RegistrationsService {
    constructor(
        private kafka: KafkaService,
        private user: UserService,
    ) { }

    async getRegistrations(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await RegistrationModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0).sort({ createdAt: -1})
        return results;
    }

    async approveRegistration(_id: string, approvedClasses: string[], approver: string){
        const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})

        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }
        
        registration.approvedClasses = approvedClasses.map(c => new Types.ObjectId(c));
        registration.approvedAt = new Date();
        registration.approvedBy = new Types.ObjectId(approver);
        registration.status = 'Approved';
        
        await registration.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "registration-approved",
            {
                email: registration.email,
                code: registration.code,
                firstName: registration.firstName,
                link: `${CoreConfig.url.lms}/register/accept/${registration._id}`
            }
        )

        return ServerSuccessResponse(registration);
    }

    async rejectRegistration(_id: string, rejector: string){
        const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})

        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        registration.rejectedAt = new Date();
        registration.rejectedBy = new Types.ObjectId(rejector);
        registration.updatedAt = new Date();
        registration.status = 'Rejected';
        
        await registration.save()

        await this.kafka.produceMessage(
            "notifications.send-email",
            "registration-rejected",
            {
                email: registration.email,
                firstName: registration.firstName,
            }
        )

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
            
            await this.kafka.produceMessage(
                "notifications.send-email",
                "registration",
                {
                    email: registration.email,
                    code: registration.code,
                    firstName: registration.firstName,
                }
            )

            console.log(`Created new registration: ${registration.code}`)



            return ServerSuccessResponse<IRegistrationDoc>(registration)
        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500)
        }
    }

    async getRegistration(_id: Types.ObjectId){
        const registration = await RegistrationModel.findOne({ _id})
        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        return ServerSuccessResponse(registration);
    }

    async approveAdmission(_id: string){
        try{
            const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})
            if(!registration){
                return ServerErrorResponse(
                    new Error("Specified registration could not be found"),
                    404,
                )
            }
    
            if(registration.status === 'Rejected'){
                return ServerErrorResponse(
                    new Error("Registration has already been rejected"),
                    403,
                )
    
            }
            
            else if(registration.status === 'Approved'){
                registration.status = 'Accepted'
                registration.updatedAt = new Date();
    
                await registration.save()
                await this.user.createStudent(registration)
    
                return ServerSuccessResponse(registration);
            }

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }
        

    async denyAdmission(_id: string){
        
        try{
            const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})
            if(!registration){
                return ServerErrorResponse(
                    new Error("Specified registration could not be found"),
                    404,
                )
            }
    
            if(registration.status === 'Rejected'){
                return ServerErrorResponse(
                    new Error("Registration has already been rejected"),
                    403,
                )
    
            }
    
            registration.status = 'Denied';
            registration.updatedAt = new Date();
            await registration.save()
    
            return ServerSuccessResponse(registration);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    
    }



    async getPendingCount(){
        
        try{
            const count = await RegistrationModel.countDocuments({status:"Pending"});
            return count;

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

 }

