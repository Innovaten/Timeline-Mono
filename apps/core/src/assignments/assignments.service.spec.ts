import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { AssignmentModel, AssignmentSetModel, AssignmentSubmissionModel, ClassModel, IClass, IUser, UserModel } from '@repo/models';
import { IAssignment } from '@repo/models';
import { Types } from 'mongoose';
import { IAssignmentSet } from '@repo/models';
import {AssigmentSetFactory, AssignmentFactory, UserFactory, ClassFactory, AssignmentSubmissionFactory} from '../../test/mocks';
import { CreateSubmissionDto, GradeSubmissionDto, UpdateAssignmentDto } from './assignments.dto';
import dayjs from 'dayjs';
import { IAssignmentSubmission } from '@repo/models';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let assignments: (IAssignment & {_id: Types.ObjectId} )[]
  let overDueAssignment: (IAssignment & {_id: Types.ObjectId} )
  let draftAssignments: (IAssignment & {_id: Types.ObjectId} )[]
  let classes: (IClass & {_id: Types.ObjectId }) []
  let sudoUser: (IUser & {_id: Types.ObjectId})
  let adminUser: (IUser & {_id: Types.ObjectId})
  let studentUser: (IUser & {_id: Types.ObjectId})
  let studentUserWithNoAccess: (IUser & {_id: Types.ObjectId})
  let assignmentSet: (IAssignmentSet & {_id: Types.ObjectId })
  let assignmentSubmission: (IAssignmentSubmission & {_id: Types.ObjectId})

  beforeAll(async () => {
    studentUser = UserFactory(1, { role: "STUDENT" })[0];
    studentUserWithNoAccess = UserFactory(1, { role: "STUDENT" })[0];
    sudoUser = UserFactory(1, { role: "SUDO" })[0];
    adminUser = UserFactory(1, { role: "ADMIN" })[0];

    assignmentSet = AssigmentSetFactory(1, { })[0]
    classes = ClassFactory(3, { 
      assignmentSet: assignmentSet._id,
    })
    assignments = AssignmentFactory(10, { 
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignmentSet: assignmentSet._id,
      accessList: [studentUser._id],
      startDate: dayjs().subtract(1, "day").toDate(),
      endDate: dayjs().add(1, "day").toDate()
    })

    overDueAssignment = AssignmentFactory(1, { 
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignmentSet: assignmentSet._id,
      accessList: [studentUser._id],
      startDate: dayjs().subtract(1, "day").toDate(),
      endDate: dayjs().subtract(1, "day").toDate()
    })[0]

    draftAssignments = AssignmentFactory(3, { 
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignmentSet: assignmentSet._id,
      accessList: [studentUser._id],
      isDraft: true
    })
    
    assignmentSubmission = AssignmentSubmissionFactory(1, {
      classId: classes[0]._id,
      classCode: classes[0].code,
      assignment: assignments[0]._id,
      status: "Pending",
    })[0]

    assignmentSet.class = classes[0]._id
    assignmentSet.classCode = classes[0].code

    await AssignmentSetModel.insertMany(assignmentSet)
    await AssignmentModel.insertMany(assignments)
    await AssignmentModel.insertMany(draftAssignments)
    await AssignmentModel.insertMany(overDueAssignment)
    await AssignmentSubmissionModel.insertMany(assignmentSubmission)
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
      expect(results.length).toEqual(assignments.length + draftAssignments.length + 1)
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
      expect(results).toEqual(assignments.length + draftAssignments.length + 1)
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

  describe('updateAssignment', () => {

    it('should update an assignment', async() => {

      const data: UpdateAssignmentDto = {
        title: "NewTitle",
        instructions: "NewInstructions",
        maxScore: 100,
        startDate: new Date('1970-01-01'),
        endDate: new Date('2030-01-01'),
        resources: [new Types.ObjectId().toString()],        
        accessList: [new Types.ObjectId().toString()]        
      }

      // @ts-ignore
      const result = await service.updateAssignment(assignments[0]._id.toString(), data, sudoUser)

      expect(result).toBeDefined()
      expect(result.title).toEqual(data.title)
      expect(result.instructions).toEqual(data.instructions)
      expect(result.maxScore).toEqual(data.maxScore)
      expect(result.startDate).toEqual(data.startDate)
      expect(result.endDate).toEqual(data.endDate)
      expect(result.accessList).toEqual(data.accessList?.map(a => new Types.ObjectId(a)))
      expect(result.resources).toEqual(data.resources?.map(r => new Types.ObjectId(r)))
      expect(result.updatedBy).toEqual(sudoUser._id)
    })

    it('should throw an error when the requesting user is unauthorized', async () => {
      const data: UpdateAssignmentDto = {
        title: "NewTitle",
      }

      //@ts-ignore
      await expect(service.updateAssignment(assignments[0]._id.toString(), data, adminUser))
      .rejects.toThrow("You are not authorized to perform this action")
    })

  })

  describe('publishAssignment', () => {

    it('should publish an assignment', async () => {
      // @ts-ignore
      const result = await service.publishAssignment(draftAssignments[0]._id.toString(), true, sudoUser);

      expect(result).toBeDefined()
      expect(result.meta.isDraft).toEqual(false)
      expect(result.updatedBy).toEqual(sudoUser._id)
    })
    
    it('should throw an error when the requesting user is unauthorized', async () =>{
      //@ts-ignore
      await expect(service.publishAssignment(draftAssignments[0]._id.toString(), true, adminUser))
      .rejects.toThrow("You are not authorized to perform this action")
    })
  })

  describe('deleteAsignment', () => {
    it('should soft delete an assignment', async () => {

      const lastAssigment = assignments[assignments.length -1]

      //@ts-ignore
      const result = await service.deleteAssignment(lastAssigment._id.toString(), sudoUser);

      expect(result).toBeDefined()
      expect(result.meta.isDeleted).toEqual(true)
      expect(result.updatedBy).toEqual(sudoUser._id)

      const relatedAssignmentSet = await AssignmentSetModel.findById(assignmentSet._id);
      expect(relatedAssignmentSet?.assignments).not.toContain(result._id);
      expect(relatedAssignmentSet?.updatedBy).toEqual(sudoUser._id)
    })

    it('should throw an error when the requesting user is unauthorized', async () => {
      
      const lastAssigment = assignments[assignments.length -1]
      //@ts-ignore
      await expect(service.deleteAssignment(lastAssigment._id.toString(), adminUser))
      .rejects.toThrow("You are not authorized to perform this action")
    })

  })

  describe('listAssignmentSubmissionsByAssignment', () => {
    it('should return a list of submissions related to the specified assignment', async () => {
      // @ts-ignore
      const result = await service.listAssignmentSubmissionsByAssignment(assignments[0]._id, true, sudoUser);
      expect(result).toBeDefined()
      expect(result.length).toEqual(1)
    })

    it('should return the number of submissions related to the specified assignment', async () => {
      // @ts-ignore
      const result = await service.getAssignmentSubmissionsCount(assignments[0]._id, true, {});
      expect(result).toBeDefined()
      expect(result).toEqual(1)
    })
  })

  describe('createAssignmentSubmission', () => { 
    it('should create a new assignment submission', async () => {

      const data: CreateSubmissionDto = {
        resources: [new Types.ObjectId().toString()]
      }
      // @ts-ignore
      const result = await service.createAssignmentSubmission(assignments[0].code, false, data, studentUser);
    
      expect(result).toBeDefined()
      expect(result.code).toEqual("ASSUB0000000001")
      expect(result.status).toEqual("Submitted")
      expect(result.resources).toEqual(data.resources.map(r => new Types.ObjectId(r)))
      expect(result.submittedBy).toEqual(studentUser._id)
    })

    it('should reject overdue assignments', async () => {

      const data: CreateSubmissionDto = {
        resources: [new Types.ObjectId().toString()]
      }
      // @ts-ignore
      await expect(service.createAssignmentSubmission(overDueAssignment.code, false, data, studentUser))
        .rejects.toThrow("Submission time is not within assignment deadlines")
    })
  })

  describe('getAssignmentSubmission', () => {
    
    it('should return an assignment-submission pair for a specified assignment', async () => {
      // @ts-ignore
      const result = await service.getAssignmentSubmission(assignments[0]._id.toString(), assignmentSubmission._id.toString(), true, sudoUser)
    
      expect(result).toBeDefined()
      expect(result.assignment.code).toEqual(assignments[0].code)
      expect(result.submission.code).toEqual(assignmentSubmission.code)
    })

    it('should throw an error when the requesting user is unauthorized', async () => {
      await expect(
        // @ts-ignore
        service.getAssignmentSubmission(assignments[0]._id.toString(), assignmentSubmission._id.toString(), true, studentUserWithNoAccess)
      ).rejects.toThrow("You are not authorized to access this document")
    })
  })

  describe('gradeAssignmentSubmission', () => {

    it('should grade an assignment', async () => {
      const data: GradeSubmissionDto = {
        score: 419,
        feedback: "Okay."
      }

      // @ts-ignore
      const result = await service.gradeAssignmentSubmission(assignments[0]._id.toString(), assignmentSubmission._id.toString(), true, data, sudoUser)

      expect(result).toBeDefined()
      expect(result.status).toEqual("Graded")
      expect(result.score).toEqual(data.score)
      expect(result.feedback).toEqual(data.feedback)
      expect(result.gradedBy).toEqual(sudoUser._id)
    })

    it('should throw an error when the requesting user is unauthorized', async () => {
      const data: GradeSubmissionDto = {
        score: 419,
        feedback: "Okay."
      }

      await expect(
        // @ts-ignore
        service.gradeAssignmentSubmission(assignments[0]._id.toString(), assignmentSubmission._id.toString(), true, data, adminUser)
      ).rejects.toThrow("You are not authorized to perform this action")
    })

  })



});
