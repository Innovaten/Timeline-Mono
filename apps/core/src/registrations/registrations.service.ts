import { Injectable } from '@nestjs/common';
import { IRegistrationDoc, RegistrationModel } from '@repo/models';
import { Types } from 'mongoose';
import { ServerErrorResponse, ServerSuccessResponse } from '../common/entities/responses.entity';
import { RegistrationDTO } from './registrations.dto';
import { KafkaService } from '../common/services/kafka.service';
import { CoreConfig } from '../config';
import { UserService } from '../common/services/user.service';
import { generateCode } from '../utils';
import { validPhoneNumber } from '../utils'

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

        if(registration.status == "Rejected"){
            return ServerErrorResponse(
                new Error("Specified registration has been rejected"),
                400,
            )
        }

        const similarRegistrations = await RegistrationModel.find({ email: registration.email, status: "Approved" })

        if(similarRegistrations.length != 0){
            return ServerErrorResponse(
                new Error("Cannot have more than one approved registration for the same registrant. Kindly check the existing registrations"),
                400
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

        console.log("Approved registration:", registration.code);
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

        if(registration.status != "Pending"){
            return ServerErrorResponse(
                new Error("Specified registration could not be rejected."),
                400,
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

        console.log("Rejected registration:", registration.code);
        return ServerSuccessResponse(registration);
    }

    async createNewRegistration(regData: RegistrationDTO){

        try {
            const newCode = await generateCode(await RegistrationModel.countDocuments(), "REG");

            const {authToken , phone, ...actualData} = regData
            const registration = new RegistrationModel({
                ...actualData,
                phone: `+${validPhoneNumber(phone)}`,
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
        const registration = await RegistrationModel.findOne({ _id}).populate("approvedClasses")
        if(!registration){
            return ServerErrorResponse(
                new Error("Specified registration could not be found"),
                404,
            )
        }

        return ServerSuccessResponse(registration);
    }

    async acceptAdmission(_id: string){
        try{
            const registration = await RegistrationModel.findOne({ _id: new Types.ObjectId(_id)})
            if(!registration){
                return ServerErrorResponse(
                    new Error("Specified registration could not be found"),
                    404,
                )
            }
    
            if(registration.status === 'Rejected' || registration.status == "Denied"){
                return ServerErrorResponse(
                    new Error("Registration has already been rejected"),
                    400,
                )
    
            }

            if(registration.status !== "Approved"){
                return ServerErrorResponse(
                    new Error("This registration has not been approved"),
                    400
                )
            }
            
            registration.status = 'Accepted'
            registration.updatedAt = new Date();
            registration.acceptedAt = new Date();

            const relatedUser = await this.user.createStudent(registration)
            registration.acceptedBy = new Types.ObjectId(`${relatedUser._id}`);

            await registration.save()

            console.log("Accepted registration:", registration.code);
            return ServerSuccessResponse(registration);

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
    
            if(registration.status === 'Denied'){
                return ServerErrorResponse(
                    new Error("Registration has already been denied"),
                    400,
                )
            }

            if(registration.status === 'Accepted'){
                return ServerErrorResponse(
                    new Error("Registration has already been accepted"),
                    400,
                )
            }

            if(registration.status !== "Approved"){
                return ServerErrorResponse(
                    new Error("Registration has not been approved"),
                    403,
                )
            }
    
            registration.status = 'Denied';
            registration.deniedAt = new Date();
            registration.updatedAt = new Date();
            await registration.save()
    
            console.log("Denied registration:", registration.code);
            return ServerSuccessResponse(registration);

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    
    }


    async getCount(filter: Record<string, any>){
        
        try{
            const count = await RegistrationModel.countDocuments(filter);
            return count;

        } catch(err) {
            return ServerErrorResponse(new Error(`${err}`), 500);
        } 
    }

 }

