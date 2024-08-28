import { faker } from "@faker-js/faker"
import { IAssignmentSet } from "@repo/models"
import { Types } from "mongoose"

type CreateRandomAssignmentSetProps = {
  classId?: Types.ObjectId,
  classCode?: string,
  assignments?: Types.ObjectId[],
  updator?: Types.ObjectId,
}

export function createRandomAssignmentSet({
    classId,
    classCode,
    assignments,
    updator,
  }: CreateRandomAssignmentSetProps
): IAssignmentSet & { _id: Types.ObjectId } {

  return {
    _id: new Types.ObjectId(),
    code: faker.number.int().toString(),
    class: classId ?? new Types.ObjectId(),
    classCode: classCode ?? faker.number.int().toString(),
    assignments: assignments ?? [],
    updatedBy: updator ?? new Types.ObjectId(),

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
}