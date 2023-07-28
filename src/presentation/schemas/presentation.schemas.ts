import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from 'mongoose';
import { Comment } from "./comment.schemas";
// import { Question } from "./question.schemas";
import { TimeData } from "./time.schemas";
import { WordData } from "./word.schemas";

export type PresentationDocument = Presentation & Document;
    
@Schema()
export class Presentation extends Document{ //Presentation
    @Prop()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Prop()
    @IsString()
    pdfURL: string;

    @Prop()
    recommendedWord: WordData[];

    @Prop()
    forbiddenWord: WordData[];

    @Prop()
    @IsString()
    sttScript: string;

    @Prop()
    @IsString()
    resultVideo: string;

    @Prop()
    comment: Comment[];

    @Prop()
    pdfTime: TimeData[];

    @Prop()
    qna: string;
}

export const PresentationSchema = SchemaFactory.createForClass(Presentation);