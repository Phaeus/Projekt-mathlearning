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

  export const createCollection = (collection, cardIdList, creatorId) => async dispatch => {
      console.log(cardIdList);
      dispatch({
          type: 'CREATE_COLLECTION',
          payload:{
              collection: collection,
              cardIdList: cardIdList,
              creatorId
          }
      })
  }

  export const getLastCollectionId = () => async dispatch => {
      const response = [];
        dispatch({
            type: 'GET_LAST_COLLECTION_ID',
            payload:response
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

  export const addPlayedCollection = (collectionId) => async dispatch => {
      console.log("Halla")
      dispatch({
          type:'ADD_PLAYED_COLLECTION',
          payload:collectionId
      })
  }

  export const addCreatedCollection = (collectionId) => async dispatch => {
      dispatch({
          type:'ADD_CREATED_COLLECTION',
          payload:collectionId
      })
  }