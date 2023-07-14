import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
    @Prop()
    @IsString()
    @IsNotEmpty()
    id: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);