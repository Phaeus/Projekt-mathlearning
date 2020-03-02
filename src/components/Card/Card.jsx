import React, { Component } from 'react';
import { connect } from 'react-redux';

import history from '../../history';
import { getCard, getCards } from '../../actions';
import './Card.css';
import Timebar from './Timebar';

class Card extends Component {
  constructor(props){
    super(props);
    this.state={
      cards: null,
      cardCounter: 0,
      time:5,
    }
  }
  async componentDidMount() {
    if (this.props.cards.cardlist === null) {
      await this.props.getCards();
    }
    console.log(this.props.cards.cardlist);
    this.getCardsFromIds();
  }

  getCardsFromIds = () => {
    const cardIdList = this.props.cardIdList;
    console.log(cardIdList);
    console.log(this.props.cardIdList);
    let cards = [];
    for (let i = 0; i < cardIdList.length; i++) {
      cards.push(this.props.cards.cardlist.find(tar => tar.id === cardIdList[i]));
    }
    console.log(cards);
    this.setState({cards:cards});
  }

  renderCard(){
    const {cards, cardCounter} = this.state;
    return(
      <div className="ui segment">
        <div className="card">
          {cards[cardCounter].question}
        </div>
      </div>
    )
  }

  setCompleted = () => {
    this.setState({cardCounter: this.state.cardCounter+1, time:this.state.time+1});
  }
  
  renderBar = () => {
    const {cards, cardCounter} = this.state;
    if(cards[cardCounter].displayTime === 0){
      return <div></div>
    }
    else{
      return(
        <Timebar time={cards[cardCounter].displayTime} id={cards[cardCounter].id} setCompleted={this.setCompleted} />
      )
    }
  }

  render() {
    const {cards, cardCounter} = this.state;

    if (cards === null) {
      return <div>Loading...</div>;
    }
    else if(cardCounter === cards.length){
      history.push(`/collection/${this.props.id}/GameResults`);
      return <div></div>
    }
    else{
      return (
        <div className="ui container">
          <div>
           {this.renderBar()} 
           {this.renderCard()}
           {console.log(this.state)}
           <button className="ui negative button" onClick={() => this.setState({cardCounter: cardCounter+1})}>NEXT</button>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards,
  };
};

const mapDispatchToProps = {
  getCard: getCard,
  getCards: getCards,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
