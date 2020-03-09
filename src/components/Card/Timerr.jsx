import React, { Component } from 'react';
//https://medium.com/@peterjd42/building-timers-in-react-stopwatch-and-countdown-bc06486560a2
export default class Timerr extends Component{
    constructor(props){
        super(props)
        this.state={
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            timerStatus:props.timerStatus,
        }
    }

    msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    setStoppedTime = () => {
        this.props.setStoppedTime(this.state.timerTime)
    }

    

    stopTimer = () => {
        console.log(this.props.timerStatus)
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        this.setStoppedTime()
      };

    render(){
        console.log(this.props.timerStatus)
        if(this.props.timerStatus && !this.state.timerOn){
            this.startTimer();
        }
        else if(this.props.timerStatus){
            this.stopTimer();
        }
        return(
            <div>
                <h3>Timer: {this.msToTime(this.state.timerTime)} </h3>
            </div>
        )
    }
}