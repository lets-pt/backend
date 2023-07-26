import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class TimeData { //pdfTime
    @Prop()
    minute: Number;

    @Prop()
    second: Number;
};