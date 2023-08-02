import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi, CreateCompletionRequest} from 'openai';
import { GetAiModelAnswer } from './model/get-ai-model-answer';
import { PresentationService } from 'src/presentation/presentation.service';

const DEFAULT_MODEL_ID = "text-davinci-003"
const DEFAULT_TEMPERATURE = 0.3
const DEFAULT_MAX_TOKENS = 1000

@Injectable()
export class ChatGptAiService {
    private readonly openAiApi:OpenAIApi
    private selectedModelId:string|undefined
    private presentationService: PresentationService
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
             
             const prompt = `다음 스크립트를 간결하게 한국어로 다듬어주세요: ${question}`   
             const params:CreateCompletionRequest ={
                prompt: prompt,
                model : this.cleanModelId(model),
                temperature:temperature!=undefined?temperature:DEFAULT_TEMPERATURE,
                max_tokens:maxTokens?maxTokens:DEFAULT_MAX_TOKENS
             }

             const response = await this.openAiApi.createCompletion(params)
             const {data} =response
            
             let answer = data.choices[0]['text'].replace(/\n/g, '');
             answer = answer.replace(/^\.+/, '');
             return answer

        } catch (error) {
            console.log(error);
        }
    }


    async getModelQna(sttScript:string): Promise<string>{
        try {
                       
             const prompt = `다음 스크립트의 예상 질문과 간결한 답변 3가지 알려주세요: ${sttScript}`

             const params:CreateCompletionRequest ={
                prompt: prompt,
                model : DEFAULT_MODEL_ID,
                temperature: DEFAULT_TEMPERATURE,
                max_tokens: DEFAULT_MAX_TOKENS
             }

             const response = await this.openAiApi.createCompletion(params)
             const {data} =response
            
             let answer = data.choices[0]['text'].trim()
                return answer = answer.replace(/Q/g, '\nQ').replace(/A/g, '\nA');

        } catch (error) {
            console.log(error);
        }
    }
}
