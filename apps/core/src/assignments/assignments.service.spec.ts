import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { AssignmentModel, AssignmentSetModel, ClassModel, IClass, IUser, UserModel } from '@repo/models';
import { IAssignment } from '@repo/models';
import { Types } from 'mongoose';
import { IAssignmentSet } from '@repo/models';
import { createRandomAssignments, createRandomAssignmentSet, createRandomClasses, createRandomUser } from '../../test/mocks';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let assignments: (IAssignment & {_id: Types.ObjectId} )[]
  let draftAssignments: (IAssignment & {_id: Types.ObjectId} )[]
  let classes: (IClass & {_id: Types.ObjectId }) []
  let sudoUser: (IUser & {_id: Types.ObjectId})
  let studentUser: (IUser & {_id: Types.ObjectId})
  let studentUserWithNoAccess: (IUser & {_id: Types.ObjectId})
  let assignmentSet: (IAssignmentSet & {_id: Types.ObjectId })


  beforeAll(async () => {
    studentUser = createRandomUser({ role: "STUDENT" });
    studentUserWithNoAccess = createRandomUser({ role: "STUDENT" });
    sudoUser = createRandomUser({ role: "SUDO" });

    assignmentSet = createRandomAssignmentSet({})
    classes = createRandomClasses(3, { assignmentSet: assignmentSet._id})
    assignments = createRandomAssignments(10, { 
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignmentSet: assignmentSet._id,
      accessList: [studentUser._id]
    })

    draftAssignments = createRandomAssignments(3, { 
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignmentSet: assignmentSet._id,
      accessList: [studentUser._id],
      isDraft: true
    })
    

    assignmentSet.class = classes[0]._id
    assignmentSet.classCode = classes[0].code

    await AssignmentSetModel.insertMany(assignmentSet)
    await AssignmentModel.insertMany(assignments)
    await AssignmentModel.insertMany(draftAssignments)
    await ClassModel.insertMany(classes)
    await UserModel.insertMany(sudoUser)

  }, 10000)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignmentsService],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnnouncements', () => {
    it('should return a list of assignments', async () => {
      const results = await service.getAssignments()
      expect(results.length).toEqual(assignments.length + draftAssignments.length)
    })

    it('should return a limited list of assignments when a limit is provided', async () => {
      const limit = 5
      const results = await service.getAssignments(limit)
      expect(results.length).toEqual(limit)
    })
  })

  describe('getCount', () => {
    it('should return the number of assignments', async () => {
      const results = await service.getCount();
      expect(results).toEqual(assignments.length + draftAssignments.length)
    })
  })

  describe('getAssignment', () => {
    it('should return a specific assignment', async () => {
      // @ts-ignore
      const result = await service.getAssignment(assignments[0].code, false, sudoUser)
      expect(result).toBeDefined()
      expect(result.assignment).toBeDefined()
      expect(result.assignment.code).toEqual(assignments[0].code)
    })

    it('should return a specific assignment for a student in the access list', async () => {
      // @ts-ignore
      const result = await service.getAssignment(assignments[0].code, false, studentUser)
      expect(result).toBeDefined()
      expect(result.assignment).toBeDefined()
      expect(result.assignment.code).toEqual(assignments[0].code)
    })

    it('should throw an error if a nonexistent assigment is requested', async () => {
      // @ts-ignore
      await expect(service.getAssignment("ANonexistentAssignment", false, sudoUser))
        .rejects
        .toThrow("Assignment could not be found")
    })

    it('should throw an error when queried by a student outside in the access list', async () => {
      // @ts-ignore
      await expect(service.getAssignment(assignments[0].code, false, studentUserWithNoAccess))
        .rejects
        .toThrow("You are not permitted to access this assignment")
    })
  })

  // TODO: Assignment Submissions

});
