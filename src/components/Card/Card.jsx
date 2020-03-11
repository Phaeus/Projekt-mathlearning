import React, { Component } from 'react';
import { connect } from 'react-redux';
import Mathjax from 'react-mathjax-preview'
import { Progress } from 'semantic-ui-react'

import history from '../../history';
import { getCard, getCards, getUser, addPlayedCollection, setCollectionStats } from '../../actions';
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
      userTime:0
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
    await this.getCardsFromIds();
    if (this.props.modus === "Timermodus") {
      this.startTimer();
    }
    console.log(this.state)
    if (this.props.modus === "Countdownmodus" && this.state.cards !== null) {
      this.startCountdown();
      
    }
    console.log(this.props)
    console.log(this.state)
  }

  async componentWillUnmount() {
    if (this.props.modus === "Timermodus") {
      this.stopTimer()
    }
    else if (this.props.modus === "Countdownmodus") {
      this.stopCountdown()
    }

    if (this.props.user.loginSuccess) {
      if (this.props.modus === "Timermodus") {
        //add Timestatistics + right answers + scoreboard
        let correctedAnswers = this.setCorrectAnswers();
        correctedAnswers = { ...correctedAnswers, collectionId: Number(this.props.id) }
        console.log(correctedAnswers)

        this.props.addPlayedCollection(correctedAnswers);
        correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id, modus: this.props.modus }
        await this.props.setCollectionStats(correctedAnswers);
        console.log("Haaaaaaaaaaaaaa", correctedAnswers)
      }
      else if (this.props.modus === "Countdownmodus") {
        let correctedAnswers = this.setCorrectAnswers();
        correctedAnswers = { ...correctedAnswers, collectionId: Number(this.props.id) }
        console.log(correctedAnswers)
        this.props.addPlayedCollection(correctedAnswers);
        correctedAnswers = { ...correctedAnswers, userId: this.props.user.user.id, modus: this.props.modus }
        this.props.setCollectionStats(correctedAnswers);

      }
      else {
        this.props.addPlayedCollection({collectionId:Number(this.props.id)});
        this.props.setCollectionStats({collectionId: Number(this.props.id), })
      }
    }
  }

  startCountdown = () => {
    console.log(this.state.cards[this.state.cardCounter].displayTime)
    this.setState({
      countdownOn: true,
      countTime: this.state.cards[this.state.cardCounter].displayTime * 1000,
      countStart: this.state.cards[this.state.cardCounter].displayTime * 1000
    })
    this.countdown = setInterval(() => {
      const newTime = this.state.countTime - 100;
      if (newTime >= 0) {
        this.setState({
          countTime: newTime
        })
      }
      else {
        console.log("halla")
        this.setState({ countdownOn: false })
        this.saveAnswer();
      }
      console.log(newTime)
    }
      , 100)
  }

  stopCountdown = () => {
    clearInterval(this.countdown);
    console.log(this.state.countTime)
    this.setState({ countdownOn: false, countTime: this.state.timerStart })
  }

  getCardsFromIds = () => {
    const cardIdList = this.props.cardIdList;
    let cards = [];
    for (let i = 0; i < cardIdList.length; i++) {
      cards.push(this.props.cards.cardlist.find(tar => tar.id === cardIdList[i]));
    }
    console.log(cards)
    this.setState({ cards: cards });
  }

  saveAnswer = () => {
    let answers = this.state.answers;
    answers.push(this.state.currentAnswer)
    this.setState({answers})
    this.setState({ cardCounter: this.state.cardCounter + 1 });
    if (this.props.modus === "Timermodus") {
      if (this.state.cardCounter === this.state.cards) {
        this.setState({ timerStatus: false });
        this.stopTimer()
      }
    }
    if (this.props.modus === "Countdownmodus") {
      this.setState({userTime: this.state.countTime + this.state.userTime})
      this.stopCountdown()
      if (this.state.cardCounter !== this.state.cards) {
        this.startCountdown();
      }
    }
    console.log(this.state.answers)
  }

  handleAnswerChange = (answer) => {
    this.setState({currentAnswer:answer})
  }

  renderCard() {
    const { cards, cardCounter } = this.state;
    if (cardCounter < cards.length) {
      return (
        <div>
          <div className="ui segment">
            <div className="card">
              <Mathjax math={"`" + cards[cardCounter].question + "`"} />
            </div>

          </div>
          <AnswerInput saveAnswer={this.saveAnswer} handleAnswerChange={this.handleAnswerChange} />
        </div>
      )
    }
  }

  setCompleted = (time) => {
    console.log(this.state.answers)
    let answers = this.state.answers;
    answers.push(answers)
    console.log(answers)
    this.setState({ answers });
    this.setState({ cardCounter: this.state.cardCounter + 1 });
    this.setState({ time, stopTimebar: false });
    console.log(time)
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
    console.log(correctAnswers)
    return correctAnswers;
  }

  renderBar = () => {
    const { cards, cardCounter } = this.state;
    if (cardCounter < cards.length) {
      if ((!cards[cardCounter].showTimebar && this.props.modus === "Countdownmodus") || this.props.modus === "Learningmodus" || (cards[cardCounter].displayTime === 0 && this.props.modus === "Countdownmodus")) {
        return <div></div>
      }
      else if (this.props.modus === "Timermodus") {
        return <div>{this.msToTime(this.state.timerTime)}</div>
      }
      else {
        return (
          <Progress
            progress='value'
            value={this.state.countTime / 1000}
            total={cards[cardCounter].displayTime}
            color='blue'
          />
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
  getUser: getUser,
  addPlayedCollection: addPlayedCollection,
  setCollectionStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);