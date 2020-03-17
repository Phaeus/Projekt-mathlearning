const initialState = {
    userlist: [
        {
            username: "h", password: "h", createdCollection: [1, 2, 3],
            playedCollection: [
                {
                    correctAnswerArray: [
                        {
                            userAnswer: '2',
                            correctAnswer: '1',
                            correct: true,
                            cardId: 1
                        },
                        {
                            userAnswer: '2',
                            correctAnswer: '2',
                            correct: true,
                            cardId: 2
                        },
                        {
                            userAnswer: '3',
                            correctAnswer: '3',
                            correct: true,
                            cardId: 3
                        }
                    ],
                    userTime: 5300,
                    wholeTime: 9,
                    collectionId: 1
                },
                {
                    correctAnswerArray: [
                        {
                            userAnswer: '2',
                            correctAnswer: '2',
                            correct: true,
                            cardId: 1
                        },
                        {
                            userAnswer: '4',
                            correctAnswer: '4',
                            correct: true,
                            cardId: 2
                        },
                        {
                            userAnswer: '8',
                            correctAnswer: '8',
                            correct: true,
                            cardId: 3
                        }
                    ],
                    time: 2,
                    collectionId: 2
                },{
                    collectionId: 3
                }
                
            ],
            id: 0
        }
    ],
    user: null,
    loginSuccess: false,
    usernameAvailable: false,
    guest:null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "GET_USERLIST":
            return { ...state, userlist: action.payload }

        case "GET_USER":
            const searchedUsername = action.payload;
            let user = null
            if (searchedUsername !== null) {
                user = state.userlist.find(user => user.username === searchedUsername);
            }
            return { ...state, user }

        case "CREATE_USER":
            let idNew = 0;
            for (let i = 0; i < state.userlist.length; i++) {
                if (idNew < state.userlist[i].id) {
                    idNew = (state.userlist[i].id);
                }
            }
            const newUser = { ...action.payload, createdCollection: [], playedCollection: [], id: idNew + 1 };
            let newList = state.userlist;
            newList.push(newUser);
            return { ...state, userlist: newList }

        case "CHECK_USER":
            const username = action.payload.username;
            const password = action.payload.password;
            for (let i = 0; i < state.userlist.length; i++) {
                if (username === state.userlist[i].username && password === state.userlist[i].password) {
                    return { ...state, loginSuccess: true }
                }
            }
            return { ...state, loginSuccess: false }

        case "LOGIN_USER":
            const loggedInUsername = action.payload;
            const loggedInUser = state.userlist.find(user => user.username === loggedInUsername);
            return { ...state, user: loggedInUser, loginSuccess: true };

        case "GET_LOGIN_SUCCESS":
            return { ...state, loginSuccess: state.loginSuccess }

        case "LOGOUT_USER":
            return { ...state, user: null, loginSuccess: false };

        case "CHECK_AVAILABLE_USER":
            const potUsername = action.payload.username;
            for (let i = 0; i < state.userlist.length; i++) {
                if (potUsername === state.userlist[i].username) {
                    return { ...state, usernameAvailable: false, loginSuccess: false }
                }
            }
            return { ...state, usernameAvailable: true, loginSuccess: true }
        
        case 'SET_GUEST_STATS':
            return {...state, guest:action.payload}

        case "ADD_PLAYED_COLLECTION":
            let playedCollection = state.user.playedCollection;
            let nUser = state.userlist.find(user => user.id === state.user.id);
            playedCollection.push(action.payload);
            nUser = { ...nUser, playedCollection };
            let userlistNew = state.userlist;
            for (let i = 0; i < userlistNew.length; i++) {
                if (userlistNew[i].id === nUser.id) {
                    userlistNew[i] = nUser;
                }
            }
            return { ...state, userlist: userlistNew }

        case "ADD_CREATED_COLLECTION":
            let createdCollection = state.user.createdCollection;
            let neUser = state.userlist.find(user => user.id === state.user.id);
            createdCollection.push(action.payload);
            neUser = { ...neUser, createdCollection: createdCollection };
            let newUserlist = state.userlist;
            for (let i = 0; i < newUserlist.length; i++) {
                if (newUserlist[i].id === neUser.id) {
                    newUserlist[i] = neUser;
                }
            }
            return { ...state, userlist: newUserlist }

        case 'DELETE_CREATED_COLLECTION':
            let dCollId = action.payload;
            let delUserList = state.userlist;
            for (let i = 0; i < delUserList.length; i++) {
                for (let a = 0; a < delUserList[i].createdCollection.length; a++) {
                    if (delUserList[i].createdCollection[a] === dCollId) {
                        let nCreatedList = delUserList[i].createdCollection.filter(coll => coll !== dCollId);
                        delUserList[i] = { ...delUserList[i], createdCollection: nCreatedList }
                    }
                }
            }
            return { ...state, userlist: delUserList }
        case 'DELETE_PLAYED_COLLECTION':
            let deCollId = action.payload;
            let deUserList = state.userlist;
            for (let i = 0; i < deUserList.length; i++) {
                for (let a = 0; a < deUserList[i].playedCollection.length; a++) {
                    if (deUserList[i].playedCollection[a].collectionId === deCollId) {
                        let nePlayedList = deUserList[i].playedCollection.filter(coll => coll.collectionId !== deCollId);
                        deUserList[i] = { ...deUserList[i], playedCollection: nePlayedList }
                    }
                }
            }
            return { ...state, userlist: deUserList }

        case 'SET_GUEST_TO_NULL':
            return {...state, guest:null}    
        default:
            return state;
    }
}