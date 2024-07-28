import { BadRequestException, PipeTransform } from '@nestjs/common';


export class ImageFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    const allowedMimeTypes = [
        'image/jpeg',  // .jpg .jpeg
        'image/png',  // .png
        'image/webp', // .wepb
        'application/pdf', // .pdf
        'application/vnd.ms-powerpoint', // .ppt
        'application/msword', // .dov
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'text/plain', // .txt
        'application/vnd.ms-excel', //.xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //.xlsx
        'application/zip', //.zip
        'application/x-zip-compressed' // .zip
    ];

    if(!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type.');
    }
    
    return file;
  }
}