import { Prop, Schema } from "@nestjs/mongoose";
import { TimeData } from "./time.schemas";

@Schema()
export class Comment { //comment
    @Prop()
    name: string;

    @Prop({type: TimeData})
    time: TimeData;

    @Prop()
    message: string;
};