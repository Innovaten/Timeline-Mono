import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssignmentModel, AssignmentSetModel, IAssignmentSetDoc, IClassDoc, IUserDoc } from '@repo/models';
import { Types } from 'mongoose';
import { UpdateAssignmentDto } from './assignments.dto';

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

        if(user.role !== "SUDO" && ( user.role == "ADMIN" && result.class.administrators.map(id => id.toString()).includes(`${user._id}`) )){
           return result;
        }

        const stringAccessList =  result.accessList.map( _id => _id.toString())
        
        if(user.role !== "SUDO" && !stringAccessList.includes(`${user._id}`)){
            throw new ForbiddenException()
        }

        return result;

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
}


