import { faker } from "@faker-js/faker"
import { IAnnouncementSet } from "@repo/models"
import { Types } from "mongoose"


type CreateRandomAnnouncementSet = {
  classId?: Types.ObjectId,
  announcements?: Types.ObjectId[],
  updator?: Types.ObjectId,
}

export function createRandomAnnouncementSet({
    classId,
    announcements,
    updator,
  }: CreateRandomAnnouncementSet 
): IAnnouncementSet & { _id: Types.ObjectId } {

  return {
    _id: new Types.ObjectId(),
    code: faker.number.int().toString(),
    class: classId ?? new Types.ObjectId(),
    announcements: announcements ?? [],
    updatedBy: updator ?? new Types.ObjectId(),

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }


}