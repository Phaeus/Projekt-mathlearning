import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollection, getCollections } from '../../actions';

import history from '../../history';
import Card from '../Card/Card';
import './Collection.css';

class Collection extends Component {
  constructor(props){
    super(props);
    this.state={
        collectionId:null,
        cardIdList: [],
        showButton: true,
    }
  }
  async componentDidMount() {
    if (this.props.collections.collectionlist === null) {
      await this.props.getCollections();
    }

    const { id } = this.props.match.params;
    this.setState({collectionId:id});
    this.props.getCollection(id);
  }
  
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  orderCardIds = () => {
    const {randomOrderBool, cardIdList} = this.props.collections.collection;
    if(randomOrderBool){
        let currentIndex = cardIdList.length, temp, randomIndex;
        let randomCardIdList = cardIdList;

        while(0 !== currentIndex){
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temp = randomCardIdList[currentIndex];
          randomCardIdList[currentIndex] = randomCardIdList[randomIndex];
          randomCardIdList[randomIndex] = temp;
        }
        this.setState({cardIdList: randomCardIdList});
    }
    else{
      this.setState({cardIdList: cardIdList});
    }
  }

  renderStartGame(){
    if(this.state.showButton){
      return(
        <button className="ui primary button" onClick={() => {this.setState({showButton:false}); this.orderCardIds()}}>START MATHGAME</button>
      )
    }
    else{
      return(
        <Card cardIdList={this.state.cardIdList} id={this.state.collectionId} cardCounter={this.state.cardCounter} modus={this.props.collections.collection.modus}/>
      )
    }
    }  

  render() {
    const { collection } = this.props.collections;

    if (collection === null) {
      return <div>Loading...</div>;
    }
    else{
    return (
      <div className="ui container" id="container">
        <h1 className="ui header">{collection.title}</h1>
        <h2 className="ui secondary header">Kartenanzahl: {collection.cardIdList.length}</h2>
        {this.renderStartGame()}
        <button className="ui button" onClick={()=>{history.push(`/`)}}>Zurück zur Liste</button>
      </div>
    );
  }
}
}

const mapStateToProps = state => {
  return {
    collections: state.collections,
  };
};

const mapDispatchToProps = {
  getCollection: getCollection,
  getCollections: getCollections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
