import React, {useState} from 'react';
import './CollectionConfig.css';

const onRandomChange = (props, randomChecked) => {
    props.onRandomChange(randomChecked);
}
const onTimeDisplayChange = (props, timeChecked) => {
    props.onTimeDisplayChange(timeChecked);
}
const onTimeChange = (props, event) => {
    event.preventDefault();
    console.log(event.target.value);
    props.onTimeChange(event.target.value);
}

export default function CollectionConfig(props){
    const [randomChecked, setRandomChecked] = useState(false);
    const [timeChecked, setTimeChecked] = useState(false);

    return(
        <div className="ui segment" id="config-box">
            <div className="renditon">
                <div className="random-label">
                Random rendition
                </div>
                <div className="ui toggle checkbox">
                  <input type="checkbox" checked={randomChecked} onChange={() => { onRandomChange(props, !randomChecked); setRandomChecked(!randomChecked)}} />
                  <label></label>
                </div>
                {randomChecked ? (
                  <p>Random</p>
                    ):(
                  <p>Chronological</p>
              )}
            </div>
            {props.showConfig ? (
                <div>
                <div className="ui divider"/>
                <div className="rendition-time">
                <div className="random-label">
                    Rendition Time
                </div>
                <div className="ui toggle checkbox">
                  <input type="checkbox" checked={timeChecked} onChange={() => { onTimeDisplayChange(props, !timeChecked); setTimeChecked(!timeChecked)}} />
                  <label></label>   
                </div>
                {timeChecked ? (
                    <div>
                        <form>
                            <input 
                            type="number"
                            placeholder="Time in seconds"
                            value={props.displayTime.displayTime}
                            onChange={e => onTimeChange(props, e)}
                            />
                        </form>
                    </div>
                ):(
                    <div>

                    </div>
                )}
            </div>
            </div>
            ):(
                <div/>
            )}
            
        </div>
        )
}