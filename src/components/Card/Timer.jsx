import React, { useState, useEffect } from 'react';

export default function Timer(props){
    const [time, setTime] = useState(0);
    const [isOn, setIsOn] = useState(props.startTimer);
    const [timer, setTimer] = useState(null);
    const [pause, setPause] = useState(false);

    //https://medium.com/@650egor/react-30-day-challenge-day-1-simple-timer-df85d0867553

    const startTimer = (timer) => {
        setIsOn(false);
        const start = Date.now()
        console.log(Date.now() - start)
        timer =  setInterval(() => setTime(Date.now() - start), 1);
    }

    //useEffect(() => {
    //    if(isOn){
    //        startTimer()
    //    }
    //})

    useEffect(() => {
        let timer= null;
        if(isOn){
            setIsOn(false);
            const start = Date.now()
            console.log(Date.now() - start)
            timer =  setInterval(() => setTime(Date.now() - start), 1);
        }
        return function cleanUp(){
            console.log(msToTime(time))
            clearInterval(timer);
        }
    },[])

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