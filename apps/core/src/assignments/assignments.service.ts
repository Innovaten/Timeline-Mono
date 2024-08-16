import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssignmentModel, AssignmentSetModel, AssignmentSubmissionModel, IAssignmentSetDoc, IAssignmentSubmissionDoc, IClassDoc, IUserDoc, ResourcesModel } from '@repo/models';
import { Types } from 'mongoose';
import { CreateSubmissionDto, GradeSubmissionDto, UpdateAssignmentDto } from './assignments.dto';
import { Roles } from '../common/enums/roles.enum';
import { generateCode } from '../utils';
import { assert } from 'console';

@Injectable()
export class AssignmentsService {

    async getAssignments(
        limit: number = 0,
        offset: number = 0,
        filter: Record<string, any> = {}
    ) {

        const finalFilter = {
            ...filter,
            "meta.isDeleted": false
        }

        console.log(finalFilter)

        const result = await AssignmentModel.find(finalFilter)
        .limit(limit)
        .skip(offset)
        .populate("assignmentSet createdBy updatedBy resources")
        .lean()

        return result;
    }

    async getCount(filter: Record<string, any> = {}){
        return AssignmentModel.countDocuments({
            ...filter,
            "meta.isDeleted": false
        })
    }

    async getAssignment(specifier: string, isId: boolean, user: IUserDoc){

        const filter = isId ? { _id: new Types.ObjectId(specifier) } : { code: specifier}

        const result = await AssignmentModel.findOne(filter)
        .populate<{ class: IClassDoc }>("assignmentSet class createdBy updatedBy resources")
        .lean()

        if(!result){
            throw new NotFoundException("Assignment could not be found");
        }

        if(user.role == Roles.SUDO){
            return { assignment: result, submission: null}
        }

        if((user.role == Roles.ADMIN) && result.class.administrators.map(id => id.toString()).includes(`${user._id}`)){
           return { assignment: result, submission: null}
        }

        const stringAccessList =  result.accessList.map( _id => _id.toString())
        
        if(!stringAccessList.includes(`${user._id}`)){
            throw new ForbiddenException()
        }

        const relatedSubmission = await AssignmentSubmissionModel.findOne({ assignment: result._id.toString(), submittedBy: `${user._id}` }).populate("gradedBy").lean()

        return { assignment: result, submission: relatedSubmission}

    }

    async listAssignmentSubmissionsByAssignment(
        specifier: string,
        isId: boolean,
        user: IUserDoc,
        limit: number = 10,
        offset: number = 10,
        filter: Record<string, any> = {},
    ): Promise<IAssignmentSubmissionDoc[]>{

        const specifierFilter = isId ? { _id: new Types.ObjectId(specifier)} : { code: specifier }

        const relatedAssignment = await AssignmentModel.findOne(specifierFilter).populate<{ class: IClassDoc }>("class");

        if(!relatedAssignment){
            throw new NotFoundException(`Specified assignment${ isId ? "" : " #" + specifier} could not be found`)
        }

        if(
            user.role != Roles.SUDO && 
            !relatedAssignment.class.administrators.map(a => a._id.toString()).includes(`${user._id}`)
        ){
            throw new ForbiddenException("You are not authorized to access this information")
        }

        const finalFilter = {
            ...filter,
            assignment: relatedAssignment._id,
            "meta.isDeleted": false,
        }

        const assignmentSubmissions = await AssignmentSubmissionModel
            .find(finalFilter)
            .limit(limit)
            .sort({ createdAt: -1 })
            .skip(offset)
            .populate("submittedBy")

        return assignmentSubmissions;

    }

    async getAssignmentSubmissionsCount(specifier: string, isId: boolean, filter: Record<string, any> = {}){
        
        const finalFilter = {
            ...filter,
            ...( isId ? { assignment: new Types.ObjectId(specifier) } : { assignmentCode: specifier }),
            "meta.isDeleted": false,
        }

        return AssignmentSubmissionModel.countDocuments(finalFilter);

    }

    async updateAssignment(id: string, updateData: UpdateAssignmentDto, user: IUserDoc){

        const assignment = await AssignmentModel.findById(id).populate<{ class: IClassDoc, assignmentSet: IAssignmentSetDoc }>("assignmentSet class");

        if(!assignment){
            throw new NotFoundException()
        }

        if(user.role !== "SUDO" && ( user.role == "ADMIN" && !assignment.class.administrators.map(id => id.toString()).includes(`${user._id}`) ) ){
            throw new ForbiddenException()
        }

        const { authToken, ...actualUpdates } = updateData;

        assignment.set({
            ...actualUpdates,
            ...(
                actualUpdates.accessList 
                ? { accessList: actualUpdates.accessList.map(a => new Types.ObjectId(a)) } 
                :{}
            ),
            ...(
                actualUpdates.resources 
                ? { resources: actualUpdates.resources.map(r => new Types.ObjectId(r))} 
                : {}
            )
        })

        assignment.updatedBy = new Types.ObjectId(`${user._id}`)
        await assignment.save();

        return assignment;
    }

    async publishAssignment(specifier: string, isId: boolean, user: IUserDoc){

        const filter = isId ? { _id: new Types.ObjectId(specifier) } : { code: specifier}

        const result = await AssignmentModel.findOne(filter)
        .populate<{ class: IClassDoc }>("class")

        if(!result){
            throw new NotFoundException();
        }

        if(
            user.role !== "SUDO" && 
            !result.class.administrators.map(id => id.toString()).includes(`${user._id}`) ){
           throw new ForbiddenException()
        }

        result.meta.isDraft = false;

        result.updatedAt = new Date();
        result.updatedBy = new Types.ObjectId(`${user._id}`)
        await result.save()

        return result;

    }

    async deleteAssignment(id: string, user: IUserDoc){

        const assignment = await AssignmentModel.findById(id).populate<{ class: IClassDoc, assignmentSet: IAssignmentSetDoc }>("assignmentSet class");

        if(!assignment){
            throw new NotFoundException()
        }

        if(user.role !== "SUDO" && ( user.role == "ADMIN" && !assignment.class.administrators.map(id => id.toString()).includes(`${user._id}`) ) ){
            throw new ForbiddenException()
        }

        const relatedAssignmentSet = await AssignmentSetModel.findById(assignment.assignmentSet._id);

        if(!relatedAssignmentSet){
            throw new NotFoundException("Could not find related assignment set")
        }

        assignment.meta.isDeleted = true;
        assignment.updatedBy =  new Types.ObjectId(`${user._id}`)

        relatedAssignmentSet.assignments = assignment.assignmentSet.assignments.filter( a => a._id.toString() != id);
        relatedAssignmentSet.updatedBy = new Types.ObjectId(`${user._id}`);

        await relatedAssignmentSet.save()
        await assignment.save();

        return assignment;
    }

    async createAssignmentSubmission(specifier: string, isId: boolean, data: CreateSubmissionDto, user: IUserDoc){

        const timestamp = new Date();

        const assignmentFilter = isId ? { _id: new Types.ObjectId(specifier)} : { code: specifier }

        const relatedAssignment = await AssignmentModel.findOne(assignmentFilter).lean();

        if(!relatedAssignment){
            throw new NotFoundException("Specified assignment not found")
        }

        if( (timestamp.getTime() < new Date(relatedAssignment.startDate).getTime()) || (timestamp.getTime() > new Date(relatedAssignment.endDate).getTime()) ){
            throw new BadRequestException("Submission time is not within assignment deadlines")
        }

        const newSubmission = new AssignmentSubmissionModel({
            code: await generateCode( await AssignmentModel.countDocuments(), "ASSUB", 10),
            
            class: relatedAssignment.class,
            classCode: relatedAssignment.classCode,
            assignment: relatedAssignment._id,

            resources: data.resources.map(r => new Types.ObjectId(r)),
            status: "Submitted",

            meta: {
                isDeleted: false,
                isDraft: false,
            },

            createdBy: new Types.ObjectId(`${user._id}`),
            submittedBy: new Types.ObjectId(`${user._id}`),
            
            submittedAt: timestamp,
        })

        await newSubmission.save()

        return newSubmission


    }

    async getAssignmentSubmission(assignmentSpecifier: string, submissionSpecifier: string, isId: boolean, user: IUserDoc){

        const assignmentFilter = isId ? { _id: new Types.ObjectId(assignmentSpecifier)} : { code: assignmentSpecifier}
        const submissionFilter = isId ? { _id: new Types.ObjectId(submissionSpecifier)} : { code: submissionSpecifier}
    
        const submission = await AssignmentSubmissionModel.findOne(submissionFilter).populate<{ class?: IClassDoc, submittedBy?: IUserDoc, gradedBy?: IUserDoc }>('class submittedBy resources gradedBy').lean()
    
        if(!submission){
          throw new NotFoundException("Specified assignment submission could not be found")
        }
    
        const assignment = await AssignmentModel.findOne(assignmentFilter).populate("resources createdBy updatedBy");
     
        if(!assignment){
          throw new NotFoundException("Related assignment could not be found");
        }

        if(submission.assignment.toString() != assignment._id.toString()) {
            throw new BadRequestException("Specified assignment or submission is mismatched")
        }

    
        if(user.role == Roles.SUDO){
          return { submission, assignment };
        }
    
        if(
          user.role == Roles.ADMIN &&
          submission.class?.administrators.map(a => `${a}`).includes(`${user._id}`)
        ) {
          return { submission, assignment}
        }
    
        if(
          user.role == Roles.STUDENT &&
          (submission.submittedBy ? submission.submittedBy._id?.toString() : submission.submittedBy) == `${user._id}`
        ) {
          return { submission, assignment }
        }
    
        throw new ForbiddenException("You are not authorized to access this document")
    
      }

    async gradeAssignmentSubmission(assignmentSpecifier: string, submissionSpecifier: string, isId: boolean, gradeData: GradeSubmissionDto, user: IUserDoc){

        const timestamp = new Date()

        const assignmentFilter = isId ? { _id: new Types.ObjectId(assignmentSpecifier)} : { code: assignmentSpecifier}
        const submissionFilter = isId ? { _id: new Types.ObjectId(submissionSpecifier)} : { code: submissionSpecifier}

        const submission = await AssignmentSubmissionModel.findOne(submissionFilter).populate<{ class?: IClassDoc}>('class')

        if(!submission){
        throw new NotFoundException("Specified assignment submission could not be found")
        }

        const assignment = await AssignmentModel.findOne(assignmentFilter);
    
        if(!assignment){
        throw new NotFoundException("Related assignment could not be found");
        }

        if(submission.assignment.toString() != assignment._id.toString()) {
            throw new BadRequestException("Specified assignment or submission is mismatched")
        }

        console.log(submission.class)

        if(
            user.role !== Roles.SUDO ||
            submission.class?.administrators?.map(a => `${a}`).includes(`${user._id}`)
        ) {
            throw new ForbiddenException("You are not authorized to perform this action")
        }

        submission.status = "Graded";
        
        submission.score = gradeData.score,
        submission.feedback = gradeData.feedback ?? "",

        submission.gradedBy = new Types.ObjectId(`${user._id}`)
        submission.gradedAt = timestamp
        submission.updatedAt = timestamp

        // TODO: Emit event

        await submission.save()

        return  submission;


    }

}