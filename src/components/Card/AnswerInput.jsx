import React, { useState} from 'react';

export default function AnswerInput(props){
    const [answer, setAnswer] =  useState("");

    const saveAnswer = (event) => {
        event.preventDefault();
        props.saveAnswer();
        setAnswer("");
    }
    const handleAnswerChange = (event) => {
        event.preventDefault()
        props.handleAnswerChange(event.target.value);
        setAnswer(event.target.value)
      }
    
    return(
        <div>
         <form onSubmit={saveAnswer}>
          <div className="ui input" >
            <input
                style={{width:"200px"}}
                autoFocus
                onChange={handleAnswerChange}
                value={answer}
            />
          </div>
        </form>
        </div>
    )
}