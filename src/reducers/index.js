import { combineReducers } from 'redux';

import collectionReducer from './collectionReducer';
import cardsReducer from './cardsReducer';
import userReducer from './userReducer';

export default combineReducers({ collections: collectionReducer,
                                 cards: cardsReducer,
                                 user: userReducer
});
