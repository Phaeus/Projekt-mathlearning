import React, { Component } from 'react';

export default class Timerr{
    constructor(props){
        
        this.state = {
            time:0,
            online: props.online
        }
        let intervall = null;
    }

    startTimer = () => {
        this.setState({online: false});
        const start = Date.now();
        console.log(Date.now() - start);
        this.intervall = setInterval(() => this.setInterval({time: (Date.now() - start)}), 1);
    }

    async componentDidMount(){
        this.startTimer();
    }

    async componentWillUnmmount(){
        console.log(this.state.time)
        clearInterval(this.intervall);
    }

    msToTime = (ms) => {
        return new Date(ms).toISOString().slice(11, -1);
    }

    render(){
        return(
            <div>
                <h3>Timer: {this.msToTime(this.state.time)} </h3>
            </div>
        )
    }
}