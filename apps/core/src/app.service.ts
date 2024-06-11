import { Injectable } from '@nestjs/common';
import { ServerSuccessResponse } from './common/entities/responses.entity';

@Injectable()
export class AppService {
  getHealth(){
    return ServerSuccessResponse<Record<string, string>>({
      ping: "pong"
    })
  }
}
