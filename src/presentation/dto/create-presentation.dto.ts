export class CreatePresentationDTO {
    userId: string;
    title: string;
    pdfURL: string;
    recommendedWord: any[];
    forbiddenWord: any[];
    sttScript: string;
    comment: any[];
    pdfTime: any[];
    settingTime: any;
    progressingTime: any;
}