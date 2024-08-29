import { faker } from "@faker-js/faker"
import { IAnnouncementSet } from "@repo/models"
import { Types } from "mongoose"


type AnnouncementSetFactoryProps = {
  classId?: Types.ObjectId,
  announcements?: Types.ObjectId[],
  updator?: Types.ObjectId,
}

export function AnnouncementSetFactory(length: number, {
    classId,
    announcements,
    updator,
  }: AnnouncementSetFactoryProps
): (IAnnouncementSet & { _id: Types.ObjectId })[] {

  const announcementSets: (IAnnouncementSet & { _id: Types.ObjectId })[] = []

  for(let i = 0; i < length; i++){
    announcementSets.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),
      class: classId ?? new Types.ObjectId(),
      announcements: announcements ?? [],
      updatedBy: updator ?? new Types.ObjectId(),
  
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    })
  }

  return announcementSets;
}