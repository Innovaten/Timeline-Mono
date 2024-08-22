import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors, Req, UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageFileValidationPipe } from './assets.validators';
import { JwtService } from '../common/services/jwt.service';
import { AssetsService } from './assets.service';
import { ServerErrorResponse } from '../common/entities/responses.entity';
import { AuthGuard } from '../common/guards/jwt.guard';

@Controller({
    path: 'assets',
    version: "1",
})


export class AssetsController {

    constructor (
        private service: AssetsService,
    ) { }

    @UseGuards(AuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFiles(
        @Req() req: any,
        @UploadedFile(
            new ParseFilePipeBuilder()
            .addMaxSizeValidator({ 
                maxSize: 10 * 1000 * 1000, 
                message: "File is too large" 
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
        ) file: Express.Multer.File
    ){
        try {
            new ImageFileValidationPipe().transform(file)
    
            const uploader = req.user
            if(!uploader){
                throw new UnauthorizedException()
            }

            const title = req.headers["original-file-name"];
            const extension = req.headers["original-file-ext"];

            if(!title || !extension){
                throw new BadRequestException("Invalid Headers")
            }
            return this.service.uploadFile(`${uploader._id}`, title, extension, file)
            
        } catch (err: any) {
            return ServerErrorResponse(new Error(`${err.message ? err.message : err}`), 500)
        }

    }
}
