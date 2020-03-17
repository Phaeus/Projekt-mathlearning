import React, { Component } from 'react';
import {connect} from 'react-redux';
import MathJax from 'react-mathjax-preview';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {getCards, setSelectedEquation} from '../../actions';
import "./EditCardForm.css";
import CollectionConfig from './EditCollectionConfig';
import {questionInputVali, answerInputVali, cardVali} from '../ValidationHelper';

class CreateCardForm extends Component {
    constructor(props) {
        super(props)
        this.state={
          equation:" ",
          showFields:false,
          selectedId: null,
          selectedEquation: null,
          cards: props.cardArray,
          lastId: props.lastId,
          timeDisplayBool: false,
          randomOrderBool: props.randomOrderBool,
          displayTime: 0,
          showConfig:false,
          showQuestionValidation: false,
          showAnswerValidation: false,
          errors: false,
          description: props.description
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
      let newCardlist = this.state.cards;
      let newCard = newCardlist.find(card => card.id === this.state.selectedId);
      newCard = {...newCard, showTimebar:timeDisplayBool};
      let index = 0;
      for (let i = 0; i < this.state.cards.length; i++){
        if(this.state.cards[i].id === this.state.selectedId){
          index = i;
        }
        
      } //probleme mit id weil id !== index --> Dokumentation
      newCardlist.splice(index, 1, newCard);
      this.setState({cards:newCardlist})
    }
    onTimeChange = (time) => {
      let newCardlist = this.state.cards;
      let newCard = newCardlist.find(card => card.id === this.state.selectedId);
      newCard = {...newCard, displayTime:time};
      let index = 0;
      for (let i = 0; i < this.state.cards.length; i++){
        if(this.state.cards[i].id === this.state.selectedId){
          index = i;
        }
      } //probleme mit id weil id !== index --> Dokumentation
      newCardlist.splice(index, 1, newCard);
      this.setState({cards:newCardlist})
    }

    componentDidUpdate(){
        if(this.state.cards === null){
            this.setState({cards: this.props.cardArray})
        }
    }

    async componentDidMount(){
      if (this.props.cards.cardlist === null) {
        await this.props.getCards();
      }
    }

    reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      let startId = result[startIndex].id;
      let endId = result[endIndex].id;
      result[endIndex] = {...result[endIndex], id:startId}
      result[startIndex] = {...result[startIndex], id:endId}
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return result;
    };

    renderCardDisplay(){
      return(
        <div>
          <div className="ui segment" id="equation-box">
            {this.state.selectedId === null ? (
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
      let newCard = newCardlist.find(card => card.id === id);
      let math = "`" + event.target.value + "`";
      if(type === "question"){
        newCard = {...newCard, question: event.target.value};
      }
      else{
        newCard = {...newCard, answer: event.target.value};
      }
      let index = 0;
      for (let i = 0; i < this.state.cards.length; i++) {
        if(this.state.cards[i].id === id){
          index = i;
        }
        
      }
      newCardlist.splice(index, 1, newCard);
      this.setState({cards: newCardlist, selectedEquation: math});
      this.props.setSelectedEquation(math);
    }

    renderQuestionValidation(question){
      if(this.state.showQuestionValidation){
        if(questionInputVali(question) !== null){
          return(
            <div>
              {questionInputVali(question).label}
            </div>
          )
        }
        else{ return <div/>}
      }
      else{return <div/>}
    }

    renderAnswerValidation(answer){
      if(this.state.showAnswerValidation){
        if(answerInputVali(answer) !== null){
          return(
            <div>
              {answerInputVali(answer).label}
            </div>
          )
        }
        else{ return <div/>}
      }
      else{return <div/>}
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
      this.setState({
        cards:items,
      });
    }

    removeCard = (event, id) => {
      const newCards = this.state.cards.filter(card => card.id !== id);
      this.setState({cards:newCards, selectedId:null});
    }

    onSubmit = (event) => {
      event.preventDefault();
      let submit = true;
        
        for (let i = 0; i < this.state.cards.length; i++) {
          if(this.state.cards[i].question === ""){
            this.setState({showQuestionValidation: true});
            submit=false;
          }
          if(this.state.cards[i].answer === ""){
            this.setState({showAnswerValidation: true});
            submit=false
          }
        }
        if(submit){
          this.props.onSubmit(this.state.cards, this.state.randomOrderBool, this.state.description);
        }
    }

    onAddClick = (event) => {
      event.preventDefault();
      let cards = this.state.cards
      cards.push({question: "", answer: "", displayTime:0, showTimebar: false, id: this.state.lastId+1});
      this.setState({cards: cards,
      lastId: this.state.lastId+1
      });
    }

    findIndex = (id) => {
      const cards = this.state.cards;
      for (let i = 0; i < cards.length; i++) {
        if(cards[i].id === id){
          return i;
        }
      }
      return null;
    }

    showRendition = () => {
      if(this.state.selectedId !== null){
        return this.state.cards[this.findIndex(this.state.selectedId)].showTimebar
      }
      else{
        return false
      }
    }

    handleDescriptionChange = (event) => {
      this.setState({description: event.target.value})
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
                          <CollectionConfig
                          random={this.state.randomOrderBool} showTimebar={this.showRendition()}
                          modus={this.props.modus} displayTime={this.state.cards[this.findIndex(this.state.selectedId)]}
                          showConfig={this.state.showConfig} onRandomChange={this.onRandomChange}
                          onTimeDisplayChange={this.onTimeDisplayChange} onTimeChange={this.onTimeChange} />
                        {this.renderCardDisplay()}
                    </div>
                <form onSubmit={this.onSubmit}>
                    <div  id="scroll-container" className="ui segment">
                    <div className="flex-container">
                    {this.state.cards.map((card) => (
                        <div className="flex-container" key={card.id} >
                          <Draggable key={""+card.id} draggableId={""+card.id} index={this.findIndex(card.id)}>
                            
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
                                {this.state.showFields && this.state.selectedId === card.id ? (
                                  <div>
                                  <input
                                    value={this.state.cards.find(cardd => cardd.id === card.id).question}
                                    name={`cards[${card.id}].question`}
                                    type="question"
                                    placeholder="Question"
                                    onChange={e => {this.handleChange(e, card.id, "question")}}
                                    onFocus={this.handleFocus}
                                  />
                                  {this.renderQuestionValidation(this.state.cards.find(cardd => cardd.id === card.id).question)}
                                  <div>
                                  <input
                                    value={this.state.cards.find(cardd => cardd.id === card.id).answer}
                                    name={`cards[${card.id}].answer`}
                                    type="answer"
                                    placeholder="Answer"
                                    onChange={e => this.handleChange(e, card.id, "answer")}
                                    onFocus={this.handleFocus}
                                  />
                                  {this.renderAnswerValidation(this.state.cards.find(cardd => cardd.id === card.id).answer)}
                                  </div>
                                <div>{card.id}</div>
                                <div>
                                  <button className="ui primary button" type="button" onClick={e => this.removeCard(e, card.id)}>
                                  <i className="delete icon"></i>
                                  </button>
                                </div>               
                                </div>
                                ):(
                                <div className="clear-segment" onClick={() => this.setState({showFields:true, showConfig:true, selectedId: card.id})}>
                                  {cardVali(this.state.cards.find(equa => equa.id === card.id).question, this.state.cards.find(equa => equa.id === card.id).answer) === null ?
                                  (
                                    <MathJax math={"`"+this.state.cards.find(equa => equa.id === card.id).question+"`"} />  
                                  ):(
                                    <div>{cardVali(this.state.cards.find(equa => equa.id === card.id).question, this.state.cards.find(equa => equa.id === card.id).answer).label}</div>
                                  )
                                  }
                                    
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
                <div>
                <input
                  value={this.state.description}
                  type="text"
                  placeholder="Description"
                  onChange={this.handleDescriptionChange}
                  />
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

    render() {
        if(this.state.cards === null){
            return <div></div>
        }
        else{
            return(
                <div>
                  <div className="card-container">
                      {this.renderBars()}
                  </div>
                </div>
              )
        }
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