import mongoose, { Schema, Document } from "mongoose";
import {IUser} from "./User";

export interface IResult extends Document {
    user: String | mongoose.Types.ObjectId | IUser,
    testId: String,
    time: Number,
    accuracy: Number
    points: Number
}

const ResultSchema: Schema = new Schema( {
    'user': {
        'type': Schema.Types.ObjectId,
        'ref': 'User'
    },
    'testId': {
        'type': String,
        'required': true,
    },
    'accuracy': {
        'type': Number,
        'required': true,
    },
    'time': {
        'type': Number,
        'required': true,
    },
    'points': {
        'type': Number,
        'required': true,
    },
}, { 'timestamps': true } );

ResultSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    delete obj._id;
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj.user;
    return obj;
}

export default mongoose.model<IResult>('Result', ResultSchema)