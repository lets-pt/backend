import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class WordData {
    @Prop()
    word: string;

    @Prop()
    count: number;
};