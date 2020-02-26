import React, { Component } from 'react';
import {connect} from 'react-redux';
import MathJax from 'react-mathjax-preview';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import history from '../../history';
//halla

import {getCards, setSelectedEquation} from '../../actions';
import "./CreateCardForm.css";
import CollectionConfig from './CollectionConfig';

class CreateCardForm extends Component {
    constructor(props) {
        super(props)
        this.state={
          equation:" ",
          showFields:false,
          selectedIndex: null,
          selectedEquation: null,
          randomOrderBool: false,
          cards: [{question:"", answer:"", displayTime:0, id:0},{question:"", answer:"", displayTime:0, id:1},{question:"", answer:"", displayTime:0, id:2}],
          lastId: 2,
          timeDisplayBool: false,
          displayTime: 0,
          equationArray: [{question:"", answer:"", id:0},{question:"", answer:"", id:1},{question:"", answer:"", id:2}],
          showConfig:false
                }
        this.onDragEnd =  this.onDragEnd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onRandomChange = (randomOrderBool) => {
        this.setState({randomOrderBool});
    }
    onTimeDisplayChange = (timeDisplayBool) => {
      console.log(timeDisplayBool);
    }
    onTimeChange = (time) => {
      let newCardlist = this.state.cards;
      let newCard = newCardlist.find(card => card.id === this.state.selectedIndex);
      newCard = {...newCard, displayTime:time};
      let index = 0;
      for (let i = 0; i < this.state.cards.length; i++) {
        if(this.state.cards[i].id === this.state.selectedIndex){
          index = i;
        }
        
      } //probleme mit id weil id !== index --> Dokumentation
      newCardlist.splice(index, 1, newCard);
      this.setState({cards:newCardlist})
    }

    async componentDidMount(){
      if (this.props.cards.cardlist === null) {
        await this.props.getCards();
      }
    }

    reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return result;
    };

    renderCardDisplay(){
      return(
        <div>
          <div className="ui segment" id="equation-box">
            {this.state.selectedIndex === null ? (
              <div></div>
            ):(
              <div className="equation">
            <MathJax math={this.state.selectedEquation} />
            </div>
            )}
          </div>
        </div>
      )
    }

    getItemStyle = (isDragging, draggableStyle) => ({
      userSelect: 'none',
      ...draggableStyle,
    });

    handleChange = (event, id, type) => {
      event.preventDefault();
      let newCardlist = this.state.cards;
      let newEquationlist = this.state.equationArray;
      let newCard = newCardlist.find(card => card.id === id);
      let newEquation = newEquationlist.find(card => card.id === id);
      let math = "`" + event.target.value + "`";
      if(type === "question"){
        newCard = {...newCard, question: event.target.value};
        newEquation = {...newEquation, question:math};
      }
      else{
        newCard = {...newCard, answer: event.target.value};
        newEquation = {...newEquation, answer:math};
      }
      let index = 0;
      for (let i = 0; i < this.state.cards.length; i++) {
        if(this.state.cards[i].id === id){
          index = i;
        }
        
      } //probleme mit id weil id !== index --> Dokumentation
      newCardlist.splice(index, 1, newCard);
      newEquationlist.splice(index, 1, newEquation);
      this.setState({cards: newCardlist});
      this.setState({selectedEquation: math});
      this.setState({equationArray: newEquationlist});
      this.props.setSelectedEquation(math);
    }

    handleFocus = event => {
      event.preventDefault();
      const math = "`" + event.target.value + "`";
      this.setState({selectedEquation: math})
    };

    onDragEnd(result) {
      // dropped outside the list
      if (!result.destination) {
        return;
      }
      //ids müssen neu vergeben werden
      const items = this.reorder(
        this.state.cards,
        result.source.index,
        result.destination.index
      );
        console.log(items);
      this.setState({
        cards:items,
      });
    }

    removeCard = (event, id) => {
      let newEquations = this.state.equationArray.filter(equation => equation.id !== id);
      const newCards = this.state.cards.filter(card => card.id !== id);
      this.setState({equationArray: newEquations});
      this.setState({cards:newCards});
    }

    onSubmit = () => {
      this.props.onSubmit(this.state.cards, this.state.randomOrderBool);
      this.setState({equationArray: null});
      console.log("halla")
      history.push(`/`);
    }

    onAddClick = (event) => {
      event.preventDefault();
      let cards = this.state.cards
      cards.push({question: "", answer: "", displayTime:0, id: this.state.lastId+1});
      this.setState({cards: cards,
      lastId: this.state.lastId+1
      });
      console.log(cards, this.state.equationArray);
    }

    renderBars(){
      return(
      <div>
          <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            
              <div>
              <button className="ui primary negative button"
                    type="button"
                    onClick={this.onAddClick}
                    >
                      ADD CARD
                    </button>
              <div className="flex-container">
                          <CollectionConfig displayTime={this.state.cards[this.state.selectedIndex]} showConfig={this.state.showConfig} onRandomChange={this.onRandomChange} onTimeDisplayChange={this.onTimeDisplayChange} onTimeChange={this.onTimeChange} />
                        {this.renderCardDisplay()}
                    </div>
                <form onSubmit={this.onSubmit}>
                    <div  id="scroll-container" className="ui segment">
                    <div className="flex-container">
                      {console.log("renderfunktion",this.state.cards, this.state.equationArray)}
                    {this.state.cards.map((card) => (
                        <div className="flex-container" key={card.id} >
                          <Draggable key={""+card.id} draggableId={""+card.id} index={card.id}>
                            
                            {(provided, snapshot) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                            >
                            
                              <div className="ui segment">
                                {this.state.showFields && this.state.selectedIndex === card.id ? (
                                  <div>
                                  <input
                                    value={this.state.cards.find(cardd => cardd.id === card.id).question}
                                    name={`cards[${card.id}].question`}
                                    type="question"
                                    placeholder="Question"
                                    onChange={e => {this.handleChange(e, card.id, "question")}}
                                    onFocus={this.handleFocus}
                                  />
                                  <div>
                                  <input
                                    value={this.state.cards.find(cardd => cardd.id === card.id).answer}
                                    name={`cards[${card.id}].answer`}
                                    type="answer"
                                    placeholder="Answer"
                                    onChange={e => this.handleChange(e, card.id, "answer")}
                                    onFocus={this.handleFocus}
                                  />
                                  </div>
                                <div>{card.id}</div>
                                <div>
                                  <button className="ui primary button" type="button" onClick={e => this.removeCard(e, card.id)}>
                                  <i className="delete icon"></i>
                                  </button>
                                </div>               
                                </div>
                                ):(
                                <div className="clear-segment" onClick={() => this.setState({showFields:true, showConfig:true, selectedIndex: card.id})}>
                                    <MathJax math={"`"+this.state.cards.find(equa => equa.id === card.id).question+"`"} />  
                                </div>
                                )}
                                
                              </div>
                              
                              </div>
                              )}
                              </Draggable>
                        </div>
                        
                ))}
                {provided.placeholder}
                </div>
                </div>
                <button className="ui button" type="submit">Submit</button>
                </form>
              </div>
            
          
          </div>
          )}
          </Droppable>
          </DragDropContext>
    
  </div>
      )
    }

    //Tickbox einfügen für random wiedergabe

    render() {
        return(
          <div>
            <div className="card-container">
                {this.renderBars()}
            </div>
          </div>
        )
    }

}

const mapStateToProps = state => {
  return {
      cards: state.cards
  }
}

const mapDispatchToProps = {
  getCards: getCards,
  setSelectedEquation: setSelectedEquation
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCardForm);