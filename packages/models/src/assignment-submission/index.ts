
import { Schema, SchemaTypes, model } from "mongoose";
import { AssignmentSubmissionStatuses, IAssignmentSubmission } from "./index.types";


export const AssignmentSubmissionSchema = new Schema<IAssignmentSubmission>({
    
    code: {
        type: SchemaTypes.String,
        unique: true,
        index: true,
        required: [true, `Please indicate the submission code` ]
    },

    class: {
        type: SchemaTypes.ObjectId,
        required: [true, `Please indicate the submission's related class`]
    },
    classCode: {
        type: SchemaTypes.String,
        required: [true, `Please indicate the submission's related class code`]
    },

    status: {
        type: SchemaTypes.String,
        required:[true, "Please indicate the submission status"],
        enum: AssignmentSubmissionStatuses,
    },
    
    assignment: {
        type: SchemaTypes.ObjectId,
        ref: "Assignments",
        required: true,
    },
    
    resources: {
        type: [{type: SchemaTypes.ObjectId, ref: 'Resources' }],
    },

    meta: {
        type: new Schema({
            isDeleted: {
                type: SchemaTypes.Boolean,
                default: false,
            },
            isDraft: {
                type: SchemaTypes.Boolean,
                default: true,
            }
        })
    },

    feedback: {
        type: SchemaTypes.String,
        required: false,
    },
    score: {
        type: SchemaTypes.Number,
        required: false,
    },

    createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    submittedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'Users',
    },


    gradedBy: {
        ref: 'Users',
        type: SchemaTypes.ObjectId, 
    },

    submittedAt: {
        type: SchemaTypes.Date,
        required: false,
    },

    gradedAt: {
        type: SchemaTypes.Date,
        required: false,
    }
  

}, { timestamps: true })


export const AssignmentSubmissionModel = model("AssignmentSubmissions", AssignmentSubmissionSchema);


