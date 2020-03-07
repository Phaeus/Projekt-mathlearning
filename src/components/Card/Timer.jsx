import React, { useState, useEffect } from 'react';

export default function Timer(props){
    const [time, setTime] = useState(0);
    const [isOn, setIsOn] = useState(props.startTimer);

    //https://medium.com/@650egor/react-30-day-challenge-day-1-simple-timer-df85d0867553


    const setStoppedTime = (stoppedTime) => {
        console.log(stoppedTime)
        props.setStoppedTime(stoppedTime);
    }

    useEffect(() => {
        let timer= null;
        let timee = null;
        if(isOn){
            setIsOn(false);
            const start = Date.now()
            timer =  setInterval(() => {setTime(Date.now() - start); timee = Date.now() - start}, 1);
        }
        return function cleanUp(){
            setStoppedTime(msToTime(timee));
            clearInterval(timer);
        }
    },[])
    //useEffect muss nochmal angeguckt werden

    //https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript

    const msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

        return(
            <div>
                <h3>Timer: {msToTime(time)} </h3>
            </div>
        )
    
}