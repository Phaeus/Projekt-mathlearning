import React from 'react';
import {Progress} from 'semantic-ui-react'
import Countdown from 'react-countdown';
import { useState } from 'react';

export default function Timebar(props){

    //let [time, setTime] = useState(props.time*1000);

    const setCompleted = () => {
        props.setCompleted();
    }

    const renderer = ({hours, minutes, seconds, milliseconds, completed}) => {
        if(completed){
            setCompleted();
            return <div>Halla</div>
        }
        else{
            let inSeconds = (seconds + minutes*60 + hours*360 + milliseconds/1000);
            //setTime(inSeconds);
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