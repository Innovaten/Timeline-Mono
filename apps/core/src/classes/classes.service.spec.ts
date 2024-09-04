import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { ClassModel, IClass } from '@repo/models';
import { Types } from 'mongoose';
import { ClassFactory } from '../../test/mocks';

describe('ClassesService', () => {
  let service: ClassesService;

  let classes: ( IClass & { _id: Types.ObjectId } )[]
  let deletedClasses: ( IClass & { _id: Types.ObjectId } )[]

  beforeAll( async () => {

    classes = ClassFactory(5, {  })
    deletedClasses = ClassFactory(2, { isDeleted: true })

    await ClassModel.insertMany([...classes, ...deletedClasses]);

  })


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassesService],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClass', () => {

    it('returns a specific class', async () => {

      const firstClass = classes[0]

      const result = await service.getClass({ _id: firstClass._id })
    
      expect(result).toBeDefined()
      expect(result!.code).toEqual(firstClass.code)
      expect(result!.name).toEqual(firstClass.name)
      expect(result!.modeOfClass).toEqual(firstClass.modeOfClass)
      expect(result!.status).toEqual(firstClass.status)
      expect(result!.students).toEqual(firstClass.students)
      expect(result!.administrators).toEqual(firstClass.administrators)
      expect(result!.modules).toEqual(firstClass.modules)
      expect(result!.resources).toEqual(firstClass.resources)
      expect(result!.timetable).toEqual(firstClass.timetable)
      expect(result!.meta.isDeleted).toEqual(firstClass.meta.isDeleted)
    })
  })

  describe('getClassById', () => { 
    it('returns a specific class by id', async () => {

      const firstClass = classes[0]

      const result = await service.getClassById(firstClass._id.toString())
    
      expect(result).toBeDefined()
      expect(result!.code).toEqual(firstClass.code)
      expect(result!.name).toEqual(firstClass.name)
      expect(result!.modeOfClass).toEqual(firstClass.modeOfClass)
      expect(result!.status).toEqual(firstClass.status)
      expect(result!.students).toEqual(firstClass.students)
      expect(result!.administrators).toEqual(firstClass.administrators)
      expect(result!.modules).toEqual(firstClass.modules)
      expect(result!.resources).toEqual(firstClass.resources)
      expect(result!.timetable).toEqual(firstClass.timetable)
      expect(result!.meta.isDeleted).toEqual(firstClass.meta.isDeleted)

    })
  })
  
  describe('getClasses', () => { 
    it('returns a set of classes' , async () => {
      const limit = 10;
      const offset = 0;

      const result = await service.getClasses(limit, offset, {});

      expect(result).toBeDefined()
      expect(result.length).toEqual(classes.length)

    })
   })

  afterAll(async () => {
    await ClassModel.deleteMany()
  })
});
