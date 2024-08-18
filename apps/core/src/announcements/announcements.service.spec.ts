import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { createRandomAnnouncement, createRandomAnnouncements, createRandomAnnouncementSet, createRandomClasses, createRandomUser } from '../../test/mocks'
import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncement, IAnnouncementSet, IClass, UserModel } from '@repo/models';
import { Types } from 'mongoose';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcements.dto';
import { faker } from '@faker-js/faker';
import { IUser } from '../../../../packages/models/src/user/index.types';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let docs: (IAnnouncement & {_id: Types.ObjectId} )[]
  let draftAnnouncements: (IAnnouncement & {_id: Types.ObjectId} )[]
  let classes: (IClass & {_id: Types.ObjectId }) []
  let sudoUser: (IUser & {_id: Types.ObjectId})
  let announcementSet: (IAnnouncementSet & {_id: Types.ObjectId })

  beforeAll(async () => {
    announcementSet = createRandomAnnouncementSet({})
    classes = createRandomClasses(3, { announcementSet: announcementSet._id})
    docs = createRandomAnnouncements(10, { classId: classes[0]._id})
    draftAnnouncements = createRandomAnnouncements(3, { classId: classes[0]._id, isDraft: true})
    
    sudoUser = createRandomUser({ role: "SUDO" });

    announcementSet.class = classes[0]._id

    await AnnouncementSetModel.insertMany(announcementSet)
    await AnnouncementModel.insertMany(docs)
    await AnnouncementModel.insertMany(draftAnnouncements)
    await ClassModel.insertMany(classes)
    await UserModel.insertMany(sudoUser)

  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnouncementsService],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listAnnouncements', () => {
    it('should return a list of announcements', async () => {
      const results = await service.listAnnouncements()
      expect(results.length).toEqual(docs.length)
    })

    it('should return a limited list of announcements when a limit is provided', async () => {
      const limit = 5
      const results = await service.listAnnouncements(limit)
      expect(results.length).toEqual(limit)
    })
  })
  
  describe('getAnnouncementsCount', () => {
    it('should return the number of announcements', async () => {
      const results = await service.getAnnouncementsCount();
      expect(results).toEqual(docs.length + draftAnnouncements.length)
    })
  })

  describe('getAnnouncement', () => {
    it('should return a specific announcement', async () => {
      const result = await service.getAnnouncement({ code: docs[0].code })
      expect(result!.code).toEqual(docs[0].code)
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

      const result = await service.createAnnouncement(false, sudoUser._id, data, announcementSet._id)
      
      expect(result).toBeDefined()
      expect(result.class).toEqual(classes[0]._id)
      expect(result.announcementSet).toEqual(announcementSet._id)
      expect(result.createdBy).toEqual(sudoUser._id)
      expect(result.updatedBy).toEqual(sudoUser._id)
  
      const relatedAnnouncementSet = await AnnouncementSetModel.findById(announcementSet._id);
      expect(relatedAnnouncementSet?.announcements.map(a=> `${a}`).includes(`${result._id}`));
    })

    it('should create a new general announcement for all classes', async () => {

      const data: CreateAnnouncementDto = {
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        isDraft: false,
        classCode: classes[0].code,
        authToken: 'GonnaHaveToRefactorThisModuleToUseTheNewAuthGuard'
      }

      const result = await service.createAnnouncement(true, sudoUser._id, data, announcementSet._id)
      
      expect(result).toBeDefined()
      expect(result.createdBy).toEqual(sudoUser._id)
      expect(result.updatedBy).toEqual(sudoUser._id)

      const allAnnouncementSets = await AnnouncementSetModel.find();

      for (let i = 0; i < allAnnouncementSets.length; i++){
        expect(allAnnouncementSets[i].announcements.map(a=> `${a}`).includes(`${result._id}`));
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

      const result = await service.updateAnnouncement(docs[0]._id.toString(), sudoUser._id.toString(), data);

      expect(result).toBeDefined()
      expect(result.title).toEqual("newTitle");
      expect(result.isDraft).toEqual(true);
      expect(result.content).toEqual("newContent");
      expect(result.updatedBy).toEqual(sudoUser._id);
    })
  })

  describe('deleteAnnouncement', () => {
    it('should delete a specified announcement', async () => {

      const result = await service.deleteAnnouncement(docs[docs.length-1]._id.toString(), sudoUser._id.toString());

      expect(result).toBeDefined()
      expect(result.meta.isDeleted).toEqual(true)
      expect(result.updatedBy).toEqual(sudoUser._id);

      const deletedAnnouncement = await AnnouncementModel.findById(docs[docs.length-1]._id);
      // it shouldn't actually delete it
      expect(deletedAnnouncement).toBeDefined()
    })
  })

  describe('publish announcement', () => {
    it('should publish a drafted assignment', async () => {

      const result = await service.publishAnnouncement(draftAnnouncements[0]._id.toString(), true, sudoUser._id.toString());

      expect(result).toBeDefined();
      expect(result.isDraft).toEqual(false);
      expect(result.updatedBy).toEqual(sudoUser._id);
      
      let threwError = false
      let newError: Error | undefined;

      try {
        await service.publishAnnouncement(
          docs[1]._id.toString(), 
          true, 
          sudoUser._id.toString()
        )
      } catch(err: any) {
        threwError = true
        newError = err;
      }

      expect(threwError).toEqual(true)
      expect(newError).toBeDefined()
      expect(newError?.message).toEqual("Specified announcement is already public")
    })
  })


  afterAll(async () => {
    await AnnouncementSetModel.deleteMany()
    await AnnouncementModel.deleteMany()
    await ClassModel.deleteMany()
    await UserModel.deleteMany()
  })
});
