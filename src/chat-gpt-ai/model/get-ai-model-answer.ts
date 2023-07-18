import{IsNotEmpty, IsNumber,IsOptional,IsString} from "class-validator"

export class GetAiModelAnswer{

    @IsString()
    @IsNotEmpty()
    question:string

    @IsString()
    @IsOptional()
    modelId:string

    @IsNumber()
    @IsOptional()
    temperature:number

    @IsNumber()
    @IsOptional()
    maxTokens:number

}