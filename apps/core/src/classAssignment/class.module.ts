import { Module } from "@nestjs/common";
import { ClassesController } from "./class.controller";
import { ClassService } from "./class.service";

@Module({
    controllers: [ClassesController],
    providers: [ClassService]
})

export class ClassesModule {}