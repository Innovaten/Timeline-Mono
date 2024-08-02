import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssignmentModel, IAssignmentSetDoc, IClassDoc, IUserDoc } from '@repo/models';
import { Types } from 'mongoose';
import { UpdateAssignmentDto } from './assignments.dto';

@Injectable()
export class AssignmentsService {

    async getAssignments(
        limit: number = 0,
        offset: number = 0,
        filter: Record<string, any> = {}
    ) {

        const result = await AssignmentModel.find(
            {
                ...filter,
                meta: {
                    isDeleted: false
                }
            }
        )
        .limit(limit)
        .skip(offset)
        .populate("assignmentSet createdBy updatedBy resources")
        .lean()

        return result;
    }

    async getCount(filter: Record<string, any> = {}){
        return AssignmentModel.countDocuments({ ...filter, meta: { isDeleted: false }})
    }

    async getAssignment(specifier: string, isId: boolean, user: IUserDoc){

        const filter = isId ? { _id: new Types.ObjectId(specifier) } : { code: specifier}

        const result = await AssignmentModel.findOne(filter)
        .populate<{ class: IClassDoc }>("assignmentSet class createdBy updatedBy resources")
        .lean()


        if(!result){
            return null;
        }

        if(user.role == "SUDO" || ( user.role == "ADMIN" && result.class.administrators.map(id => id.toString()).includes(`${user._id}`) )){
           return result;
        }

        const stringAccessList =  result.accessList.map( _id => _id.toString())
        
        if(!stringAccessList.includes(`${user._id}`)){
            throw new ForbiddenException()
        }

        return result;

    }

    async updateAssignment(id: string, updateData: UpdateAssignmentDto, user: IUserDoc){

        const assignment = await AssignmentModel.findById(id).populate<{ class: IClassDoc, assignmentSet: IAssignmentSetDoc }>("assignment class");

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

        if(user.role !== "SUDO" || !result.class.administrators.map(id => id.toString()).includes(`${user._id}`) ){
           throw new ForbiddenException()
        }

        result.meta.isDraft = false;

        result.updatedAt = new Date();
        result.updatedBy = new Types.ObjectId(`${user._id}`)
        await result.save()

        return result;

    }

    async deleteAssignment(id: string, user: IUserDoc){

        const assignment = await AssignmentModel.findById(id).populate<{ class: IClassDoc, assignmentSet: IAssignmentSetDoc }>("assignment class");

        if(!assignment){
            throw new NotFoundException()
        }

        if(user.role !== "SUDO" && ( user.role == "ADMIN" && !assignment.class.administrators.map(id => id.toString()).includes(`${user._id}`) ) ){
            throw new ForbiddenException()
        }

        assignment.meta.isDeleted = true;
        assignment.updatedBy =  new Types.ObjectId(`${user._id}`)

        assignment.assignmentSet.assignments = assignment.assignmentSet.assignments.filter( a => a._id.toString() != id);
        assignment.assignmentSet.updatedBy = new Types.ObjectId(`${user._id}`);

        await assignment.save();

        return assignment;
    }
}


