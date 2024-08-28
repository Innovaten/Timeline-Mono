import { IAssignment } from '@repo/models'
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import dayjs from 'dayjs';

type CreateRandomAssignmentProps = {
  classId?: Types.ObjectId 
  creatorId?: Types.ObjectId 
  updatorId?: Types.ObjectId,
  maxScore?: number,
  assignmentSet?: Types.ObjectId,
  accessList?: Types.ObjectId[]
  isDraft?: boolean,
  classCode?: string,
  startDate?: Date,
  endDate?: Date,
}

export function createRandomAssigment(
  { 
    classId, 
    creatorId, 
    updatorId, 
    assignmentSet,
    isDraft,
    maxScore,
    accessList,
    classCode,
    startDate,
    endDate
  }: CreateRandomAssignmentProps 
): IAssignment & {_id: Types.ObjectId} {

  return {
    _id: new Types.ObjectId(),
    code: faker.number.int().toString(),
    title: faker.lorem.sentence(),
    instructions: faker.lorem.sentences(),
    maxScore: maxScore ?? 10,

    assignmentSet: assignmentSet ?? new Types.ObjectId(),

    class: classId ?? new Types.ObjectId(),
    classCode: classCode ?? faker.number.int().toString(),

    resources: [],
    accessList: accessList ?? [],

    startDate: startDate ?? faker.date.between({ from: dayjs().startOf('year').toISOString() , to: dayjs().endOf('year').toISOString()  }),
    endDate: endDate ?? faker.date.past({ years: 1 }),

    meta: {
      isDeleted: false,
      isDraft: isDraft ?? false,
    },

    createdBy: creatorId ?? new Types.ObjectId(),
    updatedBy:  updatorId ?? new Types.ObjectId(),

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }

}

export function createRandomAssignments(length: number, { classId, creatorId, updatorId, assignmentSet, accessList, classCode, endDate, maxScore, startDate, isDraft }: CreateRandomAssignmentProps): (IAssignment & {_id: Types.ObjectId}) [] {

  const assignments: (IAssignment & {_id: Types.ObjectId}) [] = []
  for(let i = 0; i < length; i++){
    assignments.push( createRandomAssigment({ classId, creatorId, updatorId, assignmentSet, accessList, classCode, endDate, maxScore, startDate, isDraft: isDraft ?? false }) )
  }
  return assignments;
}