import React, { useState} from 'react';



export default function AnswerInput(props){
    const [answer, setAnswer] =  useState("");

    const saveAnswer = (event) => {
        event.preventDefault();
        console.log(answer);
        props.saveAnswer(answer);
        setAnswer("");
    }
    const handleAnswerChange = (event) => {
        event.preventDefault();
        console.log(event.target.value)
        setAnswer(event.target.value);
      }
    
    return(
        <div>
         <form onSubmit={saveAnswer}>
          <div className="ui input">
            <input
                autoFocus
                onChange={handleAnswerChange}
                value={answer}
            />
          </div>
        </form>
        </div>
    )
}