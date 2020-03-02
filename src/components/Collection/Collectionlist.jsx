import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCollections, getLoginSuccess} from '../../actions';
import { Link} from 'react-router-dom';

import history from '../../history';

class Collectionlist extends Component {
  constructor(props) {
    super(props);
    this.state={redirect:false};
  }
  async componentDidMount() {
    if (this.props.collections.collectionlist === null) {
      await this.props.getCollections();
    }
    if(this.props.user.loginSuccess === null){
      await this.props.getLoginSuccess();
    }
  }

  renderCollections() {
    const { collectionlist } = this.props.collections;
      return (
        collectionlist.map(collection => {
            return(
                <div key={collection.id} className="ui segment" id="collection" onClick={() => {history.push(`/collections/${collection.id}`)}}>
                  {collection.title}
            </div>
            )
        }
      ))
    }

  render() {
    const { collectionlist } = this.props.collections;

    if (collectionlist === null){
      return <div>Loading...</div>;
    }
    else if(!this.props.user.loginSuccess){
      return(
      <div>
        {collectionlist === null?(
          <div>
            No Collections available: Login or Sign in and be the first one who created a collection
          </div>
        ):(
          <div>
            <div className="ui header">
              Collectionlist:
            </div>
            {this.renderCollections()}
          </div>
        )}
      </div>
      )
    }
    else{
      console.log(collectionlist)
    return (
      <div className="ui container">
        {collectionlist.length === 0 ?( 
          <div>
              <h1 className="ui header">
          Be the first one and Create a Collection
          <button className="ui button" style={{float: "right"}} onClick={() => history.push(`/createCollection`)}>Neue Kollektion</button>
        </h1>
          </div>
        ):(
          <div>
          <h1 className="ui header">
          Collectionlist:
          <button className="ui button" style={{float: "right"}} onClick={() => history.push(`/createCollection`)}>Neue Kollektion</button>
        </h1>
        {this.renderCollections()}
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
  getLoginSuccess
};

export default connect(mapStateToProps, mapDispatchToProps)(Collectionlist);
