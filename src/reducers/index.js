import { combineReducers } from 'redux';
import {firestoreReducer} from 'redux-firestore'

import collectionReducer from './collectionReducer';
import cardsReducer from './cardsReducer';
import userReducer from './userReducer';

export default combineReducers({ collections: collectionReducer,
                                 cards: cardsReducer,
                                 user: userReducer,
                                 firestore: firestoreReducer
});
