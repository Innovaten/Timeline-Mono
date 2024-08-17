import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { createRandomAnnouncements, createRandomAnnouncementSet, createRandomClasses, createRandomUser } from '../../test/mocks'
import { AnnouncementModel, AnnouncementSetModel, ClassModel, IAnnouncement, IAnnouncementSet, IClass, UserModel } from '@repo/models';
import { Types } from 'mongoose';
import { CreateAnnouncementDto } from './announcements.dto';
import { faker } from '@faker-js/faker';
import { IUser } from '../../../../packages/models/src/user/index.types';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let docs: (IAnnouncement & {_id: Types.ObjectId} )[]
  let classes: (IClass & {_id: Types.ObjectId }) []
  let sudoUser: (IUser & {_id: Types.ObjectId})
  let announcementSet: (IAnnouncementSet & {_id: Types.ObjectId })

  beforeAll(async () => {
    announcementSet = createRandomAnnouncementSet({})
    classes = createRandomClasses(3, { announcementSet: announcementSet._id})
    docs = createRandomAnnouncements(10, { classId: classes[0]._id})
    sudoUser = createRandomUser({ role: "SUDO" });

    announcementSet.class = classes[0]._id

    await AnnouncementSetModel.insertMany(announcementSet)
    await AnnouncementModel.insertMany(docs)
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
      expect(results).toEqual(docs.length)
    })
  })

  describe('getAnnouncement', () => {
    it('should return a specific announcement', async () => {
      const result = await service.getAnnouncement({ code: docs[0].code })
      expect(result!.code).toEqual(docs[0].code)
    })
  })

  describe('createAnnouncement', () => {
    it('should create a new assignment for a specified class', async () => {

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
    })

  })


  afterAll(async () => {
    await AnnouncementSetModel.deleteMany()
    await AnnouncementModel.deleteMany()
    await ClassModel.deleteMany()
    await UserModel.deleteMany()
  })
});
