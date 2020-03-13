import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollection, getCollections, getUserlist } from '../../actions';
import { Table, Column } from 'react-rainbow-components';

import history from '../../history';
import Header from '../Header';
import Card from '../Card/Card';
import './Collection.css';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionId: null,
      cardIdList: [],
      showButton: true,
      bestPlayers: null,
      showUserStats:false
    }
  }
  async componentDidMount() {
    if (this.props.collections.collectionlist === null) {
      await this.props.getCollections();
    }
    if (this.props.user.userlist === null) {
      await this.props.getUserlist()
    }

    const { id } = this.props.match.params;
    this.setState({ collectionId: id });
    await this.props.getCollection(id);
    console.log(this.props.collections)
    if (this.props.collections.collection.modus !== "Learningmodus") {
      this.setBestPlayers()
    }
  }

  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  orderCardIds = () => {
    const { randomOrderBool, cardIdList } = this.props.collections.collection;
    if (randomOrderBool) {
      let currentIndex = cardIdList.length, temp, randomIndex;
      let randomCardIdList = cardIdList;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temp = randomCardIdList[currentIndex];
        randomCardIdList[currentIndex] = randomCardIdList[randomIndex];
        randomCardIdList[randomIndex] = temp;
      }
      this.setState({ cardIdList: randomCardIdList });
    }
    else {
      this.setState({ cardIdList: cardIdList });
    }
  }

  getUsernameFromId = (id) => {
    console.log(this.props.user)
    return this.props.user.userlist.find(user => user.id === id).username;
  }

  setBestPlayers = () => {
    const { bestPlayers } = this.props.collections.collection;
    console.log(this.props.collections.collection)
    let bestPlayer = [];
    for (let i = 0; i < bestPlayers.length; i++) {
      if (bestPlayers[i].userId === null) {
        if(this.props.collections.collection.modus === "Timermodus"){
          bestPlayer.push({ place: i+1, userId: "---", time: "---" })
        }
        else{
          bestPlayer.push({ place: i+1, userId: "---", points: "---" })
        }
      }
      else {
        if(this.props.collections.collection.modus === "Timermodus"){
          bestPlayer.push({ place: i+1, userId: "" + this.getUsernameFromId(bestPlayers[i].userId), time: "" + this.msToTime(bestPlayers[i].time) })
        }
        else{
          bestPlayer.push({ place: i+1, userId: "" + this.getUsernameFromId(bestPlayers[i].userId), points: ""+ bestPlayers[i].points })
        }
      }
    }
    console.log(bestPlayer)
    this.setState({ bestPlayer })
  }

  renderStartGame() {
    if (this.state.showButton) {
      return (
        <button className="ui primary button" onClick={() => { this.setState({ showButton: false }); this.orderCardIds() }}>START MATHGAME</button>
      )
    }
    else {
      return (
        <Card cardIdList={this.state.cardIdList} id={this.state.collectionId} cardCounter={this.state.cardCounter} modus={this.props.collections.collection.modus} />
      )
    }
  }

  msToTime = (ms) => {
    return new Date(ms).toISOString().slice(11, -1);
  }

  renderCollectionInfos() {
    const { collection } = this.props.collections;
    if (this.state.showButton) {
      return (
        <div>
          <h1 className="ui header">{collection.title}</h1>
          <h2 className="ui secondary header">Kartenanzahl: {collection.cardIdList.length}</h2>
          <div>{collection.description}</div>
          <div>Played: {collection.player}</div>
          <div>{collection.modus}</div>
          {collection.modus === "Timermodus" ? (
            <div>
              <div>Timeaverage: {this.msToTime(collection.timeAverage)}</div>
              <div>CorrectnessAverage: {collection.correctAnswerAverage}</div>
              <Table data={this.state.bestPlayer} keyField="{collection.id}">
                <Column header="Place" field="place" />
                <Column header="Player" field="userId" />
                <Column header="Time" field="time" />
              </Table>
            </div>
          ) : (<div />)}
          {collection.modus === "Countdownmodus" ? (
            <div>
              <div>Pointaverage: {collection.pointAverage}</div>
               <div>CorrectnessAverage: {collection.correctAnswerAverage}</div>
              <Table data={this.state.bestPlayer} keyField="g">
                <Column header="Place" field="place" />
                <Column header="Player" field="userId" />
                <Column header="Points" field="points" />
              </Table>
            </div>
          ) : (<div />)}
        </div>
      )
    }
  }

  render() {
    const { collection } = this.props.collections;
    if (collection === null) {
      return <div>Loading...</div>;
    }
    else {
      return (
        <div>
          <Header />
          <div className="ui container" id="container">
            {this.renderCollectionInfos()}
            {this.renderStartGame()}
            <button className="ui button" onClick={() => { history.push(`/`) }}>Zurück zur Liste</button>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    collections: state.collections,
    user: state.user
  };
};

const mapDispatchToProps = {
  getCollection: getCollection,
  getCollections: getCollections,
  getUserlist
};

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
