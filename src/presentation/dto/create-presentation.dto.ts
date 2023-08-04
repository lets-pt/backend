import { TimeData } from "../schemas/time.schemas";

export class CreatePresentationDTO {
    userId: string;
    title: string;
    pdfURL: string;
    recommendedWord: any[];
    forbiddenWord: any[];
    sttScript: string;
    pdfTime: any[];
    settingTime: TimeData;
    progressingTime: TimeData;
}