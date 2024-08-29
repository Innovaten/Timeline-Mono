import { IAnnouncement } from '@repo/models'
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

type AnnouncementFactoryProps = {
  classId?: Types.ObjectId 
  creatorId?: Types.ObjectId 
  updatorId?: Types.ObjectId 
  announcementSet?: Types.ObjectId,
  isDraft?: boolean,
}

export function AnnouncementFactory(length: number, { classId, creatorId, updatorId, announcementSet, isDraft }: AnnouncementFactoryProps): (IAnnouncement & {_id: Types.ObjectId}) [] {

  const announcements: (IAnnouncement & {_id: Types.ObjectId}) [] = []
  for(let i = 0; i < length; i++){
    announcements.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),
      title: faker.lorem.sentence(),
      content: faker.lorem.sentences(),
      announcementSet: announcementSet ?? new Types.ObjectId(),
  
      class: classId ?? new Types.ObjectId(),
  
      meta: {
        isDeleted: false,
      },
  
      isDraft: isDraft ?? false,
  
      createdBy: creatorId ?? new Types.ObjectId(),
      updatedBy:  updatorId ?? new Types.ObjectId(),
  
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    })
  }
  return announcements;
}