
//summariz an outlook mail containing also the conversation history to a paragraph summary and a three bullet point summary

export interface SummarizedMailItems {
    type:'SummarizedMailItems';
    // language that user asked for to have summary
    summarizationLanguage: 'arabic' | 'english' | 'french' | 'spanish';
    // mail summary paragraph
    summaryShortParagraph:string ;
    // mail summary in bullet points
    summaryBulletpoints: string[];
    
}

export interface UnknownText {
    type:'unknown';
    text: string; // The text that wasn't understood
}

export interface SummarizedMail  {
    type:"SummarizedMail";
    //mail summaryObject
    summary: SummarizedMailItems | UnknownText;
};