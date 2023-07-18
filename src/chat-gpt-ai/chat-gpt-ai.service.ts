import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi, CreateCompletionRequest} from 'openai';
import { GetAiModelAnswer } from './model/get-ai-model-answer';

const DEFAULT_MODEL_ID = "text-davinci-003"
const DEFAULT_TEMPERATURE = 0.9
const DEFAULT_MAX_TOKENS = 2048

@Injectable()
export class ChatGptAiService {

    private readonly openAiApi:OpenAIApi
    private selectedModelId:string|undefined

    constructor(){
        const configuration = new Configuration({
            organization: process.env.ORGANIZATION_ID,
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.openAiApi = new OpenAIApi(configuration);
    }   

    setModelId(modelId:string){
        this.selectedModelId = this.cleanModelId(modelId)
    }

    cleanModelId(modelId:string){
        if(modelId.includes(":")){
            return modelId.replace(":","-")
        }
        return modelId
    }


    async listModels(){
        const models = await this.openAiApi.listModels()
        return models.data
    }
    async getModelAnswer(input:GetAiModelAnswer){

        
        try {
            const {question,temperature,modelId,maxTokens} = input 
             let model = DEFAULT_MODEL_ID
             if(modelId){
                model = modelId
             }else if(this.selectedModelId){
                model = this.selectedModelId
             } 
             
             const prompt = `${question} 위 스크립트 문장을 발표 형식에 맞게 매끄럽게 다듬어주세요`

             const params:CreateCompletionRequest ={
                prompt: prompt,
                model : this.cleanModelId(model),
                temperature:temperature!=undefined?temperature:DEFAULT_TEMPERATURE,
                max_tokens:maxTokens?maxTokens:DEFAULT_MAX_TOKENS
             }

             const response = await this.openAiApi.createCompletion(params)

             const {data} =response
             if(data.choices.length){

                return data.choices[0]['text'].replace(/\n/g, '');;
             }

             return response.data[0]['text'].replace(/\n/g, '');;

        } catch (error) {
            
        }

    }
}
