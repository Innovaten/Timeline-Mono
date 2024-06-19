import { Injectable } from '@nestjs/common';
import { RegistrationModel } from '@repo/models';

@Injectable()
export class RegistrationsService {

    async getRegistrations(limit?: number, offset?: number, filter?: Record<string, any>){
        const results = await RegistrationModel.find(filter ?? {}).limit(limit ?? 10).skip(offset ?? 0)
        return results;
    }

}
