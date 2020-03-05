const lengthError = {value:"lengthError", label:"Your Title is too long: Title length should be under 20 signs"};
const noInputError = {value:"noInputError", label:"You have to put something in this input!"}
const noCardValueError = {value:"noCardValueError", label:"Click to add Values"}
const noCardQuestionError = {value:"noCardQuestionError", label:"Click to add a Question"}
const noCardAnswerError = {value:"noCardAnswerError", label:"Click to add a Answer"}

export const titleInputVali = (input) => {
    if(input.length > 20){
        return lengthError;
    }
    if(input.length === 0){
        return noInputError;
    }
    return null;
}

export const questionInputVali = (input) => {
    if(input.length == 0){
        return noInputError;
    }
    return null;
}

export const answerInputVali = (input) => {
    if(input.length == 0){
        return noInputError;
    }
    return null
}

export const cardVali = (qInput, aInput) => {
    if(qInput.length === 0 && aInput.length === 0){
        return noCardValueError
    }
    else if(qInput.length === 0){
        return noCardQuestionError
    }
    else if(aInput.length === 0){
        return noCardAnswerError
    }
    return null;
}