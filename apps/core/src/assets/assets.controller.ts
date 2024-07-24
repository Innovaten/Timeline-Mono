import { Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFiles, UseInterceptors, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { ImageFileValidationPipe } from './assets.validators';
import { JwtService } from '../common/services/jwt.service';
import { AssetsService } from './assets.service';
import { ServerErrorResponse } from '../common/entities/responses.entity';

@Controller({
    path: 'assets',
    version: "1",
})


export class AssetsController {

    constructor (
        private service: AssetsService,
        private jwt: JwtService,
    ) { }

    

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFiles(
        @Req() req: Request,
        @UploadedFiles(
            new ParseFilePipeBuilder()
            .addMaxSizeValidator({ 
                maxSize: 10000, 
                message: "File is too large"
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
        ) files: Array<Express.Multer.File>
    ){
        try {
            new ImageFileValidationPipe().transform(files)
            console.log(files)
    
            const uploader = await this.jwt.validateToken(req.headers.get("Authorization") ?? "")
    
            if(!uploader){
                throw new UnauthorizedException()
            }
    
            await Promise.all(
                files.map(file => {
                    const title = req.headers.get("Original-File-Name");
                    const extension = req.headers.get("Original-File-Ext")
    
                    if(!title || !extension){
                        throw new BadRequestException("Invalid Headers")
                    }
                    return this.service.uploadFiles(`${uploader._id}`, title, extension, file)
                })
            )
    
            return 

        } catch (err) {
            return ServerErrorResponse(new Error(`${err}`), 5000)
        }

    }
}
