import React from 'react';
import './CollectionConfig.css';

const onRandomChange = (props, randomChecked) => {
    props.onRandomChange(randomChecked);
}
const onTimeDisplayChange = (props, timeChecked) => {
    props.onTimeDisplayChange(timeChecked);
}
const onTimeChange = (props, event) => {
    event.preventDefault();
    props.onTimeChange(Number(event.target.value));
}

export default function EditCollectionConfig(props){

    const displayTimeValidation = () => {
        let time = props.displayTime.displayTime
        if(time <= 2){
          time = 3;
        }
        if(time >= 600){
            time = 3;
        }
        return time
      }

    function renderCountdownmodus(){
        if(props.modus === "Countdownmodus" && props.showConfig){
            return(
                <div>
                <div className="ui divider"/>
                <div className="rendition-time">
                <div className="random-label">
                    Rendition Time
                </div>
                <div className="ui toggle checkbox">
                  <input type="checkbox" checked={props.showTimebar} onChange={() => { onTimeDisplayChange(props, !props.showTimebar)}} />
                  <label></label>   
                </div>
                </div>
                {props.showTimebar ? (
                    <div>
                        <form>
                            <input 
                            type="number"
                            placeholder="Time in seconds"
                            value={displayTimeValidation()}
                            onChange={e => onTimeChange(props, e)}
                            />
                        </form>
                    </div>
                ):(<div/>)}
                </div>
                )
        }
        else{
            return(
                <div />
            )
        }
    }

    return(
        <div className="ui segment" id="config-box">
            <div className="renditon">
                <div className="random-label">
                Random rendition
                </div>
                <div className="ui toggle checkbox">
                  <input type="checkbox" checked={props.random} onChange={() => { onRandomChange(props, !props.random)}} />
                  <label></label>
                </div>
                {props.random ? (
                  <p>Random</p>
                    ):(
                  <p>Chronological</p>
              )}
            </div>
            {renderCountdownmodus()}
        </div>
        )
}