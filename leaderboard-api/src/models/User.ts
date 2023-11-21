import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    nickname: string,
    password: string
}

const UserSchema: Schema = new Schema( {
    'nickname': {
        'type': String,
        'required': true,
    },
    'password': {
        'type': String,
        'required': true,
    },
}, { 'timestamps': true } );

UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
}

export default mongoose.model<IUser>('User', UserSchema)