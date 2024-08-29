import { ClassStatusType, IClass, modeOfClassType } from '@repo/models';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker'

type ClassFactoryProps = {
  modeOfClass?: modeOfClassType,
  status?: ClassStatusType,
  administrators?: Types.ObjectId[],
  students?: Types.ObjectId[],
  modules?: Types.ObjectId[],
  resources?: Types.ObjectId[],
  timetable?: Types.ObjectId,
  announcementSet?: Types.ObjectId,
  assignmentSet?: Types.ObjectId,
  isDeleted?: boolean,
  creator?: Types.ObjectId,
  updator?: Types.ObjectId,
}

export function ClassFactory(
  length: number, {
    modeOfClass,
    status,
    administrators,
    students,
    modules,
    resources,
    timetable,
    announcementSet,
    assignmentSet,
    isDeleted,
    creator,
    updator,
  }: ClassFactoryProps  
): (IClass & {_id: Types.ObjectId})[] {
  const classes: (IClass & {_id: Types.ObjectId})[] = []

  for(let i = 0; i < length; i++){
    classes.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),
      name: faker.lorem.words(),
      modeOfClass: modeOfClass ?? "In-Person",
      status: status ?? 'Active',
      administrators: administrators ?? [],
      students: students ?? [],
      modules: modules ?? [],
      resources: resources ?? [],
      timetable: timetable ?? new Types.ObjectId(),
      announcementSet: announcementSet ?? new Types.ObjectId(),
      assignmentSet: assignmentSet ?? new Types.ObjectId(),
      meta: {
        isDeleted: isDeleted ?? false
      },
      createdBy: creator ?? new Types.ObjectId(),
      updatedBy: updator ?? new Types.ObjectId()
    })
  }

  return classes;

}