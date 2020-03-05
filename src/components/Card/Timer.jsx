import React, { useState, useEffect } from 'react';

export default function Timer(props){
    const [time, setTime] = useState(0);
    const [isOn, setIsOn] = useState(props.startTimer);
    const [timer, setTimer] = useState(null);
    const [pause, setPause] = useState(false);

    //https://medium.com/@650egor/react-30-day-challenge-day-1-simple-timer-df85d0867553

    const startTimer = () => {
        setIsOn(false);
        const start = Date.now()
        console.log(Date.now() - start)
        setTimer(setInterval(() => setTime(Date.now() - start), 1));
    }

    useEffect(() => {
        if(isOn){
            startTimer()
        }
    })

    useEffect(() => {
        return function cleanUp(){
            console.log(msToTime(time))
            setPause(true);
        }
    },[])
        function stopTime(){
            console.log("Halla")
            setPause(true);
        }

    //https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript

    const msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    if(pause){
        stopTime();
    }
    else if(isOn){
    //    startTimer();
    }
        return(
            <div>
                <h3>Timer: {msToTime(time)} </h3>
            </div>
        )
    
}