import { Body, Controller, Post, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatGptAiService } from './chat-gpt-ai.service';
import { GetAiModelAnswer } from './model/get-ai-model-answer';
import { SetSelctedModel } from './model/set-selected-model';

@Controller('chat-gpt-ai')
export class ChatGptAiController {
    constructor(private readonly service: ChatGptAiService){}

    @Post("/message")
    @UsePipes(ValidationPipe)
    getModelAnswer(@Body() data: GetAiModelAnswer){
        return this.service.getModelAnswer(data)

    }

    @Get("/model")
    listModels(){
        return this.service.listModels()

    }

    @Post("/model")
    @UsePipes(ValidationPipe)
    setModel(@Body() data: SetSelctedModel){
        this.service.setModelId(data.modelId)
    }
}
