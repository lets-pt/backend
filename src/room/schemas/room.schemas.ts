import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

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
}

export const RoomSchema = SchemaFactory.createForClass(Room);