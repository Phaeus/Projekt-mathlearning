import React,{useState} from 'react';
import {Progress} from 'semantic-ui-react'
import Countdown from 'react-countdown';

export default function Timebar(props){

    //let [time, setTime] = useState(props.time*1000);

    const setCompleted = (time) => {
        props.setCompleted(time);
    }

    const renderer = ({hours, minutes, seconds, milliseconds, completed}) => {
        if(props.stopTimebar){
            setCompleted((hours*60*60)+(minutes*60)+(seconds)+(milliseconds));
            return <div></div>
        }
        else if(completed){
            setCompleted((hours*60*60)+(minutes*60)+(seconds)+(milliseconds));
            return <div>Halla</div>
        }
        else{
            let inSeconds = (seconds + minutes*60 + hours*360 + milliseconds/1000);
            return(
                <div>
                    <p>{minutes}:{seconds}:{milliseconds}</p>
                    <Progress
                    progress='value'
                    value={inSeconds}
                    total={props.time}
                    color='blue'
                    />
                </div>
            )
        }
    }

        return (
            <div key={props.id}>
                {console.log(props.id)}
               <Countdown
               date={Date.now() + props.time*1000}
               intervalDelay={0}
               precision={1}
               renderer={renderer}
               />
            </div>
        )
}