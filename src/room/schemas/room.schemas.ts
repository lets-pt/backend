import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

export interface Comment {
    time: string;
    userid: string;
    message: string;
}

@Schema()
export class Room extends Document {
    @Prop()
    @IsString()
    @IsNotEmpty()
    visitorcode: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    id: string;

    @Prop({ type: [{ time: String, userid: String, message: String }] })
    comment: Comment[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);