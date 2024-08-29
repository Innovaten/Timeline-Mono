import { faker } from "@faker-js/faker"
import { IAssignmentSet } from "@repo/models"
import { Types } from "mongoose"

type AssignmentSetFactoryProps = {
  classId?: Types.ObjectId,
  classCode?: string,
  assignments?: Types.ObjectId[],
  updator?: Types.ObjectId,
}

export function AssigmentSetFactory(length: number, {
    classId,
    classCode,
    assignments,
    updator,
  }: AssignmentSetFactoryProps
): (IAssignmentSet & { _id: Types.ObjectId })[] {

  const assignmentSets: (IAssignmentSet & { _id: Types.ObjectId })[] = []

  for(let i = 0; i < length; i++){
    assignmentSets.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),
      class: classId ?? new Types.ObjectId(),
      classCode: classCode ?? faker.number.int().toString(),
      assignments: assignments ?? [],
      updatedBy: updator ?? new Types.ObjectId(),

      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    })
  }

  return assignmentSets;
}