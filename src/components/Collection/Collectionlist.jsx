import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollections, getLoginSuccess, getUserlist } from '../../actions';
import './Collectionlist.css'
import history from '../../history';

class Collectionlist extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false, collectionlist:null};
  }
  async componentDidMount() {
    if (this.props.collections.collectionlist === null) {
      await this.props.getCollections();
    }
    await this.props.getLoginSuccess();
    if (this.props.user.getUserlist === null) {
      await this.props.getUserlist();
    }
  }

  findCreator = (creatorId) => {
    const creator = this.props.user.userlist.find(user => user.id === creatorId).username;
    return creator;
  }

  renderCollections() {
    const { collectionlist } = this.props.collections;
    return (
      collectionlist.map(collection => {
        return (
            <div key={collection.id} className="collection" onClick={() => history.push(`/collections/${collection.id}`)}>
                <div className="title">{collection.title}</div>
                <div className="ui segment">
                  <div>Modus:</div>
                <div>{collection.modus}</div>
                </div>
                <div>{collection.cardIdList.length} Cards</div>
                <div className="ui divider"/>
              <div>
                        <i aria-hidden="true" className="user icon"></i>
                        Creator:{this.findCreator(collection.creatorId)}
            </div>
            </div>

        )
      }
      ))
  }

  render() {
    const { collectionlist } = this.props.collections;

    if (collectionlist === null) {
      return <div>Loading...</div>;
    }
    else if (!this.props.user.loginSuccess) {
      return (
        <div className="ui container">
          {collectionlist === null ? (
            <div>
              No Collections available: Login or Sign in and be the first one who created a collection
            </div>
          ) : (
              <div>
                <h1 className="ui header">
                  Collectionlist:
            </h1 >
            <div className="flex-container">
                {this.renderCollections()}
                </div>
              </div>
            )}
        </div>
      )
    }
    else {
      return (
        <div className="ui container">
          {collectionlist.length === 0 ? (
            <div>
              <h1 className="ui header">
                Be the first one and Create a Collection
          <button className="ui button" style={{ float: "right" }} onClick={() => history.push(`/createCollection`)}>Neue Kollektion</button>
              </h1>
            </div>
          ) : (
              <div>
                <h1 className="ui header">
                  Collectionlist:
          <button className="ui button" style={{ float: "right" }} onClick={() => history.push(`/createCollection`)}>New Collection</button>
                </h1>
                <div className="flex-container">
                {this.renderCollections()}
                </div>
              </div>
            )}
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
  getCollections: getCollections,
  getLoginSuccess,
  getUserlist
};

export default connect(mapStateToProps, mapDispatchToProps)(Collectionlist);
