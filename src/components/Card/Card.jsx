import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mathjax from 'react-mathjax-preview'

import history from '../../history';
import { getCard, getCards, getUser, addPlayedCollection} from '../../actions';
import './Card.css';
import Timebar from './Timebar';
import Timer from './Timer';
import AnswerInput from './AnswerInput';

class Card extends Component {
  constructor(props){
    super(props);
    this.state={
      cards: null,
      cardCounter: 0,
      time:5,
      currentAnswer:null,
      answers:[],
      answer: "",
      timerStatus: false,
      stoppedTime: 0
    }
    
    this.saveAnswer = this.saveAnswer.bind(this);
  }
  async componentDidMount() {
    if (this.props.cards.cardlist === null) {
      await this.props.getCards();
    }
    if(this.props.user.user === null){
      await this.props.getUser();
    }
    this.getCardsFromIds();
  }


  getCardsFromIds = () => {
    const cardIdList = this.props.cardIdList;
    let cards = [];
    for (let i = 0; i < cardIdList.length; i++) {
      cards.push(this.props.cards.cardlist.find(tar => tar.id === cardIdList[i]));
    }
    this.setState({cards:cards});
  }

  saveAnswer = (answer) => {
    let answers = this.state.answers;
    answers.push(answer);
    this.setState({answers});
    console.log(answers)
    this.setState({cardCounter: this.state.cardCounter+1});
    if(this.state.cardCounter === this.state.cards){
      this.setState({timerStatus: false});
    }
  }

  renderCard(){
    const {cards, cardCounter} = this.state;
    return(
    <div>
      <div className="ui segment">
        <div className="card">
          <Mathjax math={"`" + cards[cardCounter].question + "`"}/>
        </div>
     
      </div>
      <AnswerInput saveAnswer={this.saveAnswer} handleChange={this.handleChange} />
    </div>
    )
  }

  setCompleted = () => {
    this.saveAnswer("");
    this.setState({time:this.state.time+1});
  }

  setStoppedTime = (stoppedTime) => {
    this.setState({stoppedTime});
  }
  
  renderBar = () => {
    const {cards, cardCounter} = this.state;
    console.log(cards)
    console.log(cards[cardCounter])
    if((!cards[cardCounter].showTimebar && this.props.modus === "Countdownmodus") || this.props.modus === "Learningmodus" || (cards[cardCounter].displayTime === 0 && this.props.modus === "Countdownmodus")){
      return <div></div>
    }
    else if(this.props.modus === "Timermodus"){
      return <Timer startTimer={true} stopTimer={this.state.timerStatus} setStoppedTime={this.setStoppedTime} />
    }
    else{
      return(
        <Timebar time={cards[cardCounter].displayTime} id={cards[cardCounter].id} setCompleted={this.setCompleted} />
      )
    }
  }

  render() {
    const {cards, cardCounter} = this.state;

    if (cards === null){
      return <div>Loading...</div>;
    }
    else if(cardCounter === cards.length){
      history.push(`/collection/${this.props.id}/GameResults`);
      if(this.props.user.loginSuccess){
        this.props.addPlayedCollection(Number(this.props.id));
      }
      return <div></div>
    }
    else{
      return (
        <div className="ui container">
          <div>
           {this.renderBar()} 
           {this.renderCard()}
           {console.log(this.state)}
           <button className="ui negative button" onClick={() => {this.saveAnswer()}}>NEXT</button>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards,
    user: state.user
  };
};

const mapDispatchToProps = {
  getCard: getCard,
  getCards: getCards,
  getUser: getUser,
  addPlayedCollection:addPlayedCollection
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);