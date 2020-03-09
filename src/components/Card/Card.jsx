import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mathjax from 'react-mathjax-preview'

import history from '../../history';
import { getCard, getCards, getUser, addPlayedCollection, setCollectionStats } from '../../actions';
import './Card.css';
import Timebar from './Timebar';
import AnswerInput from './AnswerInput';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      cardCounter: 0,
      currentAnswer: null,
      answers: [],
      answer: "",
      time: 5,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
    }

    this.saveAnswer = this.saveAnswer.bind(this);
  }
  async componentDidMount() {
    if (this.props.cards.cardlist === null) {
      await this.props.getCards();
    }
    if (this.props.user.user === null) {
      await this.props.getUser();
    }
    this.getCardsFromIds();
    if (this.props.modus === "Timermodus") {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer()
    if (this.props.user.loginSuccess) {
      this.props.addPlayedCollection(Number(this.props.id));
      if (this.props.modus === "Timermodus") {
        //add Timestatistics + right answers + scoreboard
        let correctedAnswers = this.setCorrectAnswersTimer();
        correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id }
        console.log(correctedAnswers)
        this.props.setCollectionStats({ ...correctedAnswers, collectionId: Number(this.props.id) });
      }
      else if (this.props.modus === "Countdownmodus") {
        let correctedAnswers = this.setCorrectAnswersTimer();
        correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id }
        console.log(correctedAnswers)
        this.props.setCollectionStats({ ...correctedAnswers, collectionId: Number(this.props.id) });
      }
    }
  }


  getCardsFromIds = () => {
    const cardIdList = this.props.cardIdList;
    let cards = [];
    for (let i = 0; i < cardIdList.length; i++) {
      cards.push(this.props.cards.cardlist.find(tar => tar.id === cardIdList[i]));
    }
    this.setState({ cards: cards });
  }

  saveAnswer = (answer) => {
    let answers = this.state.answers;
    answers.push(answer);
    this.setState({ answers });
    this.setState({ cardCounter: this.state.cardCounter + 1 });
    if (this.state.cardCounter === this.state.cards) {
      this.setState({ timerStatus: false });
      this.stopTimer()
    }
  }

  renderCard() {
    const { cards, cardCounter } = this.state;
    if(cardCounter < cards.length){
      return (
        <div>
          <div className="ui segment">
            <div className="card">
              <Mathjax math={"`" + cards[cardCounter].question + "`"} />
            </div>
  
          </div>
          <AnswerInput saveAnswer={this.saveAnswer} handleChange={this.handleChange} />
        </div>
      )
    }
  }

  setCompleted = () => {
    this.saveAnswer("");
    this.setState({ time: this.state.time + 1 });
  }


  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);
  }

  stopTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);
  };

  msToTime = (ms) => {
    return new Date(ms).toISOString().slice(11, -1);
  }

  setCorrectAnswersTimer = () => {
    const { answers, cards } = this.state;
    let correctAnswerArray = [];
    let correctAnswers = null;
    if (this.props.modus === "Countdownmodus" || this.props.modus === "Timermodus") {
      for (let i = 0; i < cards.length; i++) {
        if (answers[i] === cards[i].answer) {
          correctAnswerArray.push({ userAnswer: answers[i], correctAnswer: cards[i].answer, correct: true, cardId: cards[i].id })
        }
        else {
          correctAnswerArray.push({ userAnswer: answers[i], correctAnswer: cards[i].answer, correct: false, cardId: cards[i].id })
        }
      }
    }
    if (this.props.modus === "Timermodus"){
      correctAnswers = { correctAnswerArray, time: this.state.timerTime };
    }
    else if(this.props.modus === "Countdownmodus"){
      correctAnswers = {correctAnswerArray}
    }
    
    return correctAnswers;
  }

  renderBar = () => {
    const { cards, cardCounter } = this.state;
    if(cardCounter < cards.length){
      if ((!cards[cardCounter].showTimebar && this.props.modus === "Countdownmodus") || this.props.modus === "Learningmodus" || (cards[cardCounter].displayTime === 0 && this.props.modus === "Countdownmodus")) {
        return <div></div>
      }
    else if (this.props.modus === "Timermodus") {
      return <div>{this.msToTime(this.state.timerTime)}</div>
    }
    else {
      return (
        <Timebar time={cards[cardCounter].displayTime} id={cards[cardCounter].id} setCompleted={this.setCompleted} />
      )
    }
  }
  }

  render() {
    const { cards, cardCounter } = this.state;

    if (cards === null) {
      return <div>Loading...</div>;
    }
    else if (cardCounter === cards.length && this.state.timerOn) {
      history.push(`/collection/${this.props.id}/GameResults`);
      return <div></div>
    }
    else if(cardCounter === cards.length && this.props.modus !== "Timermodus"){
      history.push(`/collection/${this.props.id}/GameResults`);
      return <div></div>
    }
    else {
      return (
        <div className="ui container">
          <div>
            {this.renderBar()}
            {this.renderCard()}
            <button className="ui negative button" onClick={() => { this.saveAnswer() }}>NEXT</button>
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
  addPlayedCollection: addPlayedCollection,
  setCollectionStats
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);