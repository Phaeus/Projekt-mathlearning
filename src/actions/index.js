export const getCollections = () => async dispatch => {
    const response = [];
    dispatch({
      type: 'GET_COLLECTIONS',
      payload: response
    });
  }

  export const getCollection = (id) => async dispatch => {
    dispatch({
      type: 'GET_COLLECTION',
      payload: id
    })
  }

  export const createCollection = (collection) => async dispatch => {
      dispatch({
          type: 'CREATE_COLLECTION',
          payload:{
              collection
          }
      })
  }

  export const updateCollection = (collection) => async dispatch => {
      dispatch({
          type: 'UPDATE_COLLECTION',
          payload:collection
      })
  }

  export const deleteCollection = (collectionId) => async dispatch => {
      dispatch({
        type: 'DELETE_COLLECTION',
        payload: collectionId
      })
  }

  export const getLastCollectionId = () => async dispatch => {
      const response = [];
        dispatch({
            type: 'GET_LAST_COLLECTION_ID',
            payload:response
        })
  }

  export const setCollectionStats = (answers) => async dispatch => {
      dispatch({
          type:'SET_COLLECTION_STATS',
          payload:answers
      })
  }

  export const getCards = () => async dispatch => {
      const response = [];
      dispatch({
          type:'GET_CARDS',
          payload: response
      })
  }

  export const getCard = (id) => async dispatch => {
      dispatch({
          type:'GET_CARD',
          payload:id
      })
  }

  export const getCardId = (card) => async dispatch => {
      dispatch({
          type:"GET_CARD_ID",
          payload:card
      })
  }

  export const createCard = (cardList) => async dispatch => {
      dispatch({
          type:'CREATE_CARD',
          payload: cardList
      })
  }

  export const updateCard = (cards) => async dispatch => {
      dispatch({
          type:'UPDATE_CARD',
          payload:cards
      })
  }

  export const deleteCards = (cardIds) => async dispatch => {
      dispatch({
          type:'DELETE_CARDS',
          payload:cardIds
      })
  }

  export const cardIdsToValue = (cardIds) => async dispatch => {
      dispatch({
          type: 'CARD_IDS_TO_VALUE',
          payload:cardIds
      })
  }

  export const setIdsToValueArray = () => async dispatch =>{
      dispatch({
          type: 'SET_IDS_TO_VALUE_ARRAY'
      })
  }

  export const setSelectedEquation = (equation) => async dispatch => {
      dispatch({
          type:'SET_SELECTED_EQUATION',
          payload: equation
      })
  }

  export const createUser = (user) => async dispatch => {
      dispatch({
          type:'CREATE_USER',
          payload: user
      })
  }

  export const getUser = (username) => async dispatch => {
      dispatch({
          type: 'GET_USER',
          payload: username
      })
  }

  export const setUserToNull = () => async dispatch => {
      dispatch({
          type: 'SET_USER_TO_NULL'
      })
  }

  export const getUserlist = () => async dispatch => {
      const response = [];
      dispatch({
          type:'GET_USERLIST',
          payload:response
      })
  }
  
  export const checkUser = (username, password) => async dispatch => {
      dispatch({
          type:'CHECK_USER',
          payload:{
              username,
              password
          }
      })
  }

  export const getLoginSuccess = () => async dispatch => {
      const response = [];
      dispatch({
          type:'GET_LOGIN_SUCCESS',
          payload:response
      })
  }

  export const loginUser = (username) => async dispatch => {
      dispatch({
          type:'LOGIN_USER',
          payload:username
      })
  }

  export const logoutUser = () => async dispatch => {
      dispatch({
          type:'LOGOUT_USER',
          payload: []
      })
  }

  export const checkAvailableUser = (username) => async dispatch => {
      dispatch({
          type:'CHECK_AVAILABLE_USER',
          payload:username
      })
  }

  export const addPlayedCollection = (answers) => async dispatch => {
      console.log("Halla")
      dispatch({
          type:'ADD_PLAYED_COLLECTION',
          payload:answers
      })
  }

  export const addCreatedCollection = (collectionId) => async dispatch => {
      dispatch({
          type:'ADD_CREATED_COLLECTION',
          payload:collectionId
      })
  }
  export const deleteCreatedCollection = (collectionId) => async dispatch => {
    dispatch({
      type: 'DELETE_CREATED_COLLECTION',
      payload: collectionId
    })
}
export const deletePlayedCollection = (collectionId) => async dispatch => {
    dispatch({
      type: 'DELETE_PLAYED_COLLECTION',
      payload: collectionId
    })
}


export const setGuestStats = (stats) => async dispatch => {
    dispatch({
        type: 'SET_GUEST_STATS',
        payload:stats
    })
}