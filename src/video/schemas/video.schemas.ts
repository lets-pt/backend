import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video extends Document {
    @Prop()
    @IsString()
    @IsNotEmpty()
    id: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    filename: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    fileurl: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);