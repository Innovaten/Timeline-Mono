import { Types } from "mongoose";
import { AssignmentSubmissionStatusType, IAssignmentSubmission } from '@repo/models'
import { faker } from '@faker-js/faker'

type AssignmentSubmissionFactoryProps = {
  classId?: Types.ObjectId,
  classCode?: string,
  assignment?: Types.ObjectId,
  resources?: Types.ObjectId[],
  status: AssignmentSubmissionStatusType,
  isDeleted?: boolean,
  isDraft?: boolean,

  feedBack?: string,
  score?: number;
  
  createdBy?: Types.ObjectId;
  submittedBy?: Types.ObjectId;
  gradedBy?: Types.ObjectId;


}

export function AssignmentSubmissionFactory(length: number, {
  classId,
  classCode,
  assignment,
  resources,
  status,
  isDeleted,
  isDraft,
  feedBack,
  score,
  createdBy,
  submittedBy,
  gradedBy,
  }: AssignmentSubmissionFactoryProps
): (IAssignmentSubmission & { _id: Types.ObjectId} )[] {

  const assignmentSubmissions: (IAssignmentSubmission & { _id: Types.ObjectId} )[]  = []

  for(let i = 0; i < length; i++){

    assignmentSubmissions.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),

      class: classId ??  new Types.ObjectId(),
      classCode: classCode ?? faker.number.int().toString(),
      assignment: assignment ?? new Types.ObjectId(),

      resources: resources ?? [],
      
      status: status ?? "Submitted",

      meta: {
          isDeleted: isDeleted ?? false,
          isDraft: isDraft ?? false,
      },

      feedback: feedBack ?? faker.lorem.sentence(),
      score: score ?? 100,
      
      createdBy: createdBy ?? new Types.ObjectId(),
      submittedBy: submittedBy ?? new  Types.ObjectId(),
      gradedBy: gradedBy ?? new Types.ObjectId(),
    
      submittedAt: faker.date.recent(),
      gradedAt: faker.date.past(),
    
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    })
  }

  return assignmentSubmissions;
}