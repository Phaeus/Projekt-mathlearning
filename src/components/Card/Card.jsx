import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mathjax from 'react-mathjax-preview'
import { Progress } from 'semantic-ui-react'

import history from '../../history';
import { getCard, getCards,  addPlayedCollection, setCollectionStats, setGuestStats} from '../../actions';
import './Card.css';
import AnswerInput from './AnswerInput';


class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      cardCounter: 0,
      currentAnswer: "",
      answers: [],
      answer: "",
      time: 5,
      stopTimebar: false,
      timerOn: false,
      timerStart: 0,
      timerTime: 0,
      countdownOn: false,
      countStart: 0,
      countTime: 0,
      userTime:0,
      currentIndex:0
    }
    this.countdown = null;
    this.saveAnswer = this.saveAnswer.bind(this);
  }
  async componentDidMount() {
    if (this.props.cards.cardlist === null) {
      await this.props.getCards();
    }
    await this.getCardsFromIds();
    if (this.props.modus === "Timermodus") {
      this.startTimer();
    }
    if (this.props.modus === "Countdownmodus" && this.state.cards !== null && this.state.cards[this.state.currentIndex].showTimebar) {
      this.startCountdown();
      //this.setState({currentIndex:1, cardCounter: 1})
    }
  }

  componentWillUnmount() {
    if (this.props.modus === "Timermodus") {
      clearInterval(this.timer);
    }
    else if (this.props.modus === "Countdownmodus") {
      clearInterval(this.timer);
    }

      if (this.props.modus === "Timermodus") {
        let correctedAnswers = this.setCorrectAnswers();
        correctedAnswers = { ...correctedAnswers, collectionId: Number(this.props.id) }
        if(this.props.user.loginSuccess){
          console.log("hee")
          this.props.addPlayedCollection(correctedAnswers);
          correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id, modus: this.props.modus }
          console.log("hahahhahaha")
          this.props.setCollectionStats(correctedAnswers);
          console.log("Halla")
        }
        else{
          this.props.setGuestStats(correctedAnswers);
          correctedAnswers = { ...correctedAnswers, userId: -1, modus: this.props.modus }
          this.props.setCollectionStats(correctedAnswers);
        }
      }
      else if (this.props.modus === "Countdownmodus") {
        let correctedAnswers = this.setCorrectAnswers();
        correctedAnswers = { ...correctedAnswers, collectionId: Number(this.props.id) }
        if(this.props.user.loginSuccess){
          this.props.addPlayedCollection(correctedAnswers);
          correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id, modus: this.props.modus }
          this.props.setCollectionStats(correctedAnswers);
        }
        else{
          this.props.setGuestStats(correctedAnswers);
          correctedAnswers = { ...correctedAnswers, userId: -1, modus: this.props.modus }
          this.props.setCollectionStats(correctedAnswers);
        }
      }
      else {
        if(this.props.user.loginSuccess){
          this.props.addPlayedCollection({collectionId:Number(this.props.id)});
          this.props.setCollectionStats({collectionId: Number(this.props.id), userId: this.props.user.user.id})
        }
        else{
          this.props.setGuestStats({collectionId:Number(this.props.id)});
          this.props.setCollectionStats({collectionId: Number(this.props.id), userId:-1})
        }
      }
  }

  startCountdown = () => {
    this.setState({
      countdownOn: true,
      countTime: this.state.cards[this.state.currentIndex].displayTime * 1000,
      countStart: this.state.timerTime //this.state.cards[this.state.currentIndex].displayTime * 1000
    })
    this.countdown = setInterval(() => {
      const newTime = this.state.countTime - 100;
      if (newTime >= 0) {
        this.setState({
          countTime: newTime
        })
      }
      else {
        this.saveAnswer();
      }
    }
      , 100)
  }

  stopCountdown = () => {
    clearInterval(this.countdown);
    this.setState({ countdownOn: false, countTime: this.state.timerStart })
  }

  getCardsFromIds = () => {
    const cardIdList = this.props.cardIdList;
    let cards = [];
    for (let i = 0; i < cardIdList.length; i++) {
      cards.push(this.props.cards.cardlist.find(tar => tar.id === cardIdList[i]));
    }
    this.setState({ cards: cards });
  }

  async saveAnswer() {
    let answers = this.state.answers;
    answers.push(this.state.currentAnswer)
    this.setState({answers})
    
    await this.setState({cardCounter: this.state.cardCounter + 1, currentIndex: this.state.currentIndex + 1});
    if (this.props.modus === "Timermodus") {
      if (this.state.cardCounter >= this.state.cards.length) {
        this.setState({ timerStatus: false });
        this.stopTimer()
      }
    }
    if (this.props.modus === "Countdownmodus") {
      this.setState({userTime: this.state.countTime + this.state.userTime})
      this.stopCountdown()
      if (this.state.cardCounter < this.state.cards.length && this.state.cards[this.state.currentIndex].showTimebar) {
        this.startCountdown();
      }
    }
  }

  handleAnswerChange = (answer) => {
    this.setState({currentAnswer:answer})
  }

  renderCard() {
    const { cards, currentIndex, cardCounter} = this.state;
    if (cardCounter < cards.length) {
      return (
        <div>
          <div className="ui segment">
            <div className="card">
              <Mathjax math={"`" + cards[currentIndex].question + "`"} />
            </div>

          </div>
          <AnswerInput saveAnswer={this.saveAnswer} handleAnswerChange={this.handleAnswerChange} />
        </div>
      )
    }
  }

  setCompleted = (time) => {
    let answers = this.state.answers;
    answers.push(answers)

    this.setState({ answers });
    this.setState({ cardCounter: this.state.cardCounter + 1 });
    this.setState({ time, stopTimebar: false });
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

  setCorrectAnswers = () => {
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
    if (this.props.modus === "Timermodus") {
      correctAnswers = { correctAnswerArray, time: this.state.timerTime };
    }
    else if (this.props.modus === "Countdownmodus") {
      let wholeTime = 0;
      for (let i = 0; i < this.state.cards.length; i++) {
        if (this.state.cards[i].showTimebar) {
          wholeTime = wholeTime + this.state.cards[i].displayTime
        }
      }
      correctAnswers = { correctAnswerArray, wholeTime,userTime: this.state.userTime}
    }
    return correctAnswers;
  }

  renderBar = () => {
    const { cards, cardCounter, currentIndex } = this.state;
    if (cardCounter < cards.length) {
      if ((!cards[currentIndex].showTimebar && this.props.modus === "Countdownmodus") || this.props.modus === "Learningmodus" || (cards[currentIndex].displayTime === 0 && this.props.modus === "Countdownmodus")) {
        return <div></div>
      }
      else if (this.props.modus === "Timermodus") {
        return <div>{this.msToTime(this.state.timerTime)}</div>
      }
      else {
        return (
          <div>
          <Progress
            progress='value'
            value={this.state.countTime / 1000}
            total={cards[currentIndex].displayTime}
            color='blue'
          />
          </div>
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
    else if (cardCounter === cards.length && this.props.modus !== "Timermodus") {
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
  addPlayedCollection: addPlayedCollection,
  setCollectionStats,
  setGuestStats
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);