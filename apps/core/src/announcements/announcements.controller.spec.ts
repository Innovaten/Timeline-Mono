import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { JwtService } from '../common/services/jwt.service';
import { ClassesService } from '../classes/classes.service';
import { jest } from '@jest/globals'
import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncement, IAnnouncementSet, IClass, IUser, UserModel } from '@repo/models';
import { Types } from 'mongoose';
import { createRandomAnnouncements, createRandomAnnouncementSet, createRandomClasses, createRandomUser } from '../../test/mocks';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcements.dto';
import { faker } from '@faker-js/faker';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let announcements: (IAnnouncement & {_id: Types.ObjectId} )[]
  let draftAnnouncements: (IAnnouncement & {_id: Types.ObjectId} )[]
  let classes: (IClass & {_id: Types.ObjectId }) []
  let sudoUser: (IUser & {_id: Types.ObjectId})
  let adminUser: (IUser & {_id: Types.ObjectId})
  let announcementSet: (IAnnouncementSet & {_id: Types.ObjectId })

  beforeAll(async () => {
    announcementSet = createRandomAnnouncementSet({})
    classes = createRandomClasses(3, { announcementSet: announcementSet._id})
    announcements = createRandomAnnouncements(10, { classId: classes[0]._id})
    draftAnnouncements = createRandomAnnouncements(3, { classId: classes[0]._id, isDraft: true})
    
    sudoUser = createRandomUser({ role: "SUDO" });
    adminUser = createRandomUser({ role: "ADMIN"});
    announcementSet.class = classes[0]._id

    await AnnouncementSetModel.insertMany(announcementSet)
    await AnnouncementModel.insertMany(announcements)
    await AnnouncementModel.insertMany(draftAnnouncements)
    await ClassModel.insertMany(classes)
    await UserModel.insertMany([ sudoUser, adminUser ])

  }, 10000)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [AnnouncementsService, JwtService, ClassesService]
    })
    .compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAnnouncements', () => {
    it('should list all announcements', async () => {
      const limit = `${announcements.length + draftAnnouncements.length}`;
      const offset = "";
      const filter = JSON.stringify({}) 
  
      let req = { user: sudoUser }
      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
  
      expect(result).toBeDefined();
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.announcements.length).toEqual(announcements.length + draftAnnouncements.length)
      expect(result.data?.count).toEqual(announcements.length + draftAnnouncements.length)
    })
  
    it('should limit announcements if no limit is provided', async () => {
      const limit = "";
      const offset = "";
      const filter = JSON.stringify({}) 
  
      let req = { user: sudoUser }
      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
  
      expect(result).toBeDefined();
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.announcements.length).toEqual(10)
      expect(result.data?.count).toEqual(announcements.length + draftAnnouncements.length)
    })
  
    it('should limit announcements if a limit is provided', async () => {
      const limit = "5";
      const offset = "";
      const filter = JSON.stringify({}) 
  
      let req = { user: sudoUser }
      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
  
      expect(result).toBeDefined();
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.announcements.length).toEqual(JSON.parse(limit))
      expect(result.data?.count).toEqual(announcements.length + draftAnnouncements.length)
    })
  
    it('should offset announcements if an offset is provided', async () => {
      const limit = "3";
      const offset = "9";
      const filter = JSON.stringify({}) 
  
      let req = { user: sudoUser }
      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
  
      expect(result).toBeDefined();
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data?.announcements.length).toEqual(JSON.parse(limit))
      expect(result.data?.announcements[0].code).toEqual(
        [...announcements, ...draftAnnouncements]
        .sort(
          (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[9].code
        // oh charle
      )
      expect(result.data?.count).toEqual(announcements.length + draftAnnouncements.length)
    })

    it('should throw an error when the user is not provided', async () => {

      const limit = `${announcements.length + draftAnnouncements.length}`;
      const offset = "";
      const filter = JSON.stringify({}) 

      const req = { }
      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(401)
      expect(result.error?.msg).toEqual("Unauthenticated Request");

    })

    it('should throw an error when the user is not a sudo user', async () => {

      const limit = `${announcements.length + draftAnnouncements.length}`;
      const offset = "";
      const filter = JSON.stringify({}) 

      const req = { user: adminUser }

      // @ts-ignore
      const result = await controller.listAnnouncements(limit, offset, filter, req)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(403)
      expect(result.error?.msg).toEqual("You are not permitted to perform this action");
    })
  })

  describe('getAnnouncementCount', () => {
    it('should return the number of announcements', async () => {

      const filter = {}

      const req = { user: sudoUser }

      const result = await controller.getAnnouncementCount(JSON.stringify(filter), req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(true)
      expect(result.data).toBeDefined()
      expect(result.error).toBeNull()
      expect(result.data).toEqual(announcements.length + draftAnnouncements.length)

    })
  })
  
  describe('createAnnouncement', () => {
    it('should create a new announcement for a specified class', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: classes[0].code,
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const req = { user: sudoUser }

      const result = await controller.createAnnouncement(
        data, req
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.error).toBeNull()

      expect(result.data?.class).toEqual(classes[0]._id)
      expect(result.data?.announcementSet).toEqual(announcementSet._id)
      expect(result.data?.createdBy).toEqual(sudoUser._id)
      expect(result.data?.updatedBy).toEqual(sudoUser._id)
  
      const relatedAnnouncementSet = await AnnouncementSetModel.findById(announcementSet._id);
      expect(relatedAnnouncementSet?.announcements.map(a=> `${a}`).includes(`${result.data?._id}`));
    })

    it('should throw an error if the user not provided', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: classes[0].code,
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const req = { }

      const result = await controller.createAnnouncement(
        data, req
      )

      expect(result).toBeDefined()
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(401)
      expect(result.error?.msg).toEqual("Unauthenticated Request")
    })

    it('should throw an error if the related class does not exist', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: 'ANonExistentClass',
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const req = { user: sudoUser }

      const result = await controller.createAnnouncement(
        data, req
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(404)
      expect(result.error?.msg).toEqual("Specified class does not exist")
    })

    it('should throw an error if the admin user is not assigned to the class', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: classes[0].code,
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const req = { user: adminUser }

      const result = await controller.createAnnouncement(
        data, req
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(403)
      expect(result.error?.msg).toEqual("You are not permitted to perform this action")
    })

    it('should create a new general announcement for all classes', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: classes[0].code,
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const req = { user: sudoUser }

      const result = await controller.createAnnouncement(
        data, req)
      
      expect(result).toBeDefined()
      expect(result.data?.createdBy).toEqual(sudoUser._id)
      expect(result.data?.updatedBy).toEqual(sudoUser._id)

      const allAnnouncementSets = await AnnouncementSetModel.find();

      for (let i = 0; i < allAnnouncementSets.length; i++){
        expect(allAnnouncementSets[i].announcements.map(a=> `${a}`).includes(`${result.data?._id}`));
      }
    })
  })

  describe('updateAnnouncement',() => {
    it('should update an existing announcement', async () => {

      const data: UpdateAnnouncementDto = {
        title: "newTitle",
        isDraft: true,
        content: "newContent",
        classCode: classes[1].code,
        authToken: "RefactorToUseAuthGuard",
      }

      const req = { user: sudoUser }

      const result = await controller.updateAnnouncement(announcements[0]._id.toString(), data, req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.title).toEqual("newTitle");
      expect(result.data?.isDraft).toEqual(true);
      expect(result.data?.content).toEqual("newContent");
      expect(result.data?.updatedBy).toEqual(sudoUser._id);
    })

    it('should throw an error when user is not provided', async () => {

      const data: UpdateAnnouncementDto = {
        title: "newTitle",
        isDraft: true,
        content: "newContent",
        classCode: classes[1].code,
        authToken: "RefactorToUseAuthGuard",
      }

      const req = {  }

      const result = await controller.updateAnnouncement(announcements[0]._id.toString(), data, req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('Unauthenticated Request');
      expect(result.error?.code).toEqual(401);
    })

    it('should throw an error when related class is non-existent', async () => {

      const data: UpdateAnnouncementDto = {
        title: "newTitle",
        isDraft: true,
        content: "newContent",
        classCode: "NonExistentClass",
        authToken: "RefactorToUseAuthGuard",
      }

      const req = { user: sudoUser  }

      const result = await controller.updateAnnouncement(announcements[0]._id.toString(), data, req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('Specified class does not exist');
      expect(result.error?.code).toEqual(404);
    })

    it('should update the announcement when the admin user is assigned to the class', async () => {

      await ClassModel.updateOne({ code: classes[0].code}, {$push: { administrators: adminUser._id }})
      classes[0].administrators.push(adminUser._id)
      const data: UpdateAnnouncementDto = {
        title: "newTitle",
        isDraft: true,
        content: "newContent",
        classCode: classes[0].code,
        authToken: "RefactorToUseAuthGuard",
      }

      const req = { user: adminUser  }

      const result = await controller.updateAnnouncement(announcements[0]._id.toString(), data, req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.title).toEqual("newTitle");
      expect(result.data?.isDraft).toEqual(true);
      expect(result.data?.content).toEqual("newContent");
      expect(result.data?.updatedBy).toEqual(adminUser._id);
      
    })

    it('should throw an error when admin user is not assigned to the class', async () => {

      const data: UpdateAnnouncementDto = {
        title: "newTitle",
        isDraft: true,
        content: "newContent",
        classCode: classes[1].code,
        authToken: "RefactorToUseAuthGuard",
      }

      const req = { user: adminUser  }

      const result = await controller.updateAnnouncement(announcements[0]._id.toString(), data, req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('You are not permitted to perform this action');
      expect(result.error?.code).toEqual(403);
    })
  })

  describe('deleteAnnouncement', () => {
    it('should delete a specified announcement', async () => {

      const lastPublicAnnouncement = announcements[announcements.length-1]

      const req = { user: sudoUser}

      // @ts-ignore
      const result = await controller.deleteAnnouncement(lastPublicAnnouncement._id.toString(), classes[0].code,  req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.meta.isDeleted).toEqual(true)
      expect(result.data?.updatedBy).toEqual(sudoUser._id);

      const deletedAnnouncement = await AnnouncementModel.findById(lastPublicAnnouncement._id);
      // it shouldn't actually delete it
      expect(deletedAnnouncement).toBeDefined()
    })

    it('should throw an error when user is not provided', async () => {

      const lastPublicAnnouncement = announcements[announcements.length-1]

      const req = { }

      // @ts-ignore
      const result = await controller.deleteAnnouncement(lastPublicAnnouncement._id.toString(), classes[0].code,  req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('Unauthenticated Request');
      expect(result.error?.code).toEqual(401);
    })

    it('should throw an error when the related class does not exist', async () => {

      const lastPublicAnnouncement = announcements[announcements.length-1]

      const req = { user: sudoUser }

      // @ts-ignore
      const result = await controller.deleteAnnouncement(lastPublicAnnouncement._id.toString(), "NonExistentClass",  req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('Specified class does not exist');
      expect(result.error?.code).toEqual(404);
    })

    it('should throw an error when the admin is not assigned to the class', async () => {

      const lastPublicAnnouncement = announcements[announcements.length-1]

      const req = { user: adminUser }

      // @ts-ignore
      const result = await controller.deleteAnnouncement(lastPublicAnnouncement._id.toString(), classes[1].code,  req);

      expect(result).toBeDefined()
      expect(result.success).toEqual(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.msg).toEqual('You are not permitted to perform this action');
      expect(result.error?.code).toEqual(403);
  })
  })

  describe('publish announcement', () => {
    it('should publish a drafted assignment', async () => {

      const req = { user: sudoUser}

      const result = await controller.publishDraftedAnnouncement(
        draftAnnouncements[0]._id.toString(), 
        classes[0].code,
        true, 
        //@ts-ignore
        req
      )

      expect(result).toBeDefined();
      expect(result.success).toEqual(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined()
      expect(result.data?.isDraft).toEqual(false);
      expect(result.data?.updatedBy).toEqual(sudoUser._id);
    })

    it('should throw an error when user is not provided', async () => {

      const req = { }

      const result = await controller.publishDraftedAnnouncement(
        draftAnnouncements[0]._id.toString(), 
        classes[0].code,
        true, 
        //@ts-ignore
        req
      )

      expect(result).toBeDefined();
      expect(result.success).toEqual(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(401);
      expect(result.error?.msg).toEqual("Unauthenticated Request");
    })

    it('should throw an error when the class is nonexistent', async () => {

      const req = { user: sudoUser }

      const result = await controller.publishDraftedAnnouncement(
        draftAnnouncements[0]._id.toString(), 
        "ANonExistentClass",
        true, 
        //@ts-ignore
        req
      )

      expect(result).toBeDefined();
      expect(result.success).toEqual(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(404);
      expect(result.error?.msg).toEqual("Specified class does not exist");
    })

    it('should throw an error when the admin is not assigned to the class', async () => {

      const req = { user: adminUser }

      const result = await controller.publishDraftedAnnouncement(
        draftAnnouncements[0]._id.toString(), 
        classes[1].code,
        true, 
        //@ts-ignore
        req
      )

      expect(result).toBeDefined();
      expect(result.success).toEqual(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined()
      expect(result.error?.code).toEqual(403);
      expect(result.error?.msg).toEqual("You are not permitted to perform this action");
    })

  })

  afterAll(async () => {
    await AnnouncementSetModel.deleteMany()
    await AnnouncementModel.deleteMany()
    await AnnouncementModel.deleteMany()
    await ClassModel.deleteMany()
    await UserModel.deleteMany()
  })
});