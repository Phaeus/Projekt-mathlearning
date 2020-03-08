const initialState = {
    userlist: [
        {username:"h", password:"h", createdCollection:[1,2,3], playedCollection:[1,2,3], id:0}
    ],
    user:null,
    loginSuccess:false,
    usernameAvailable: false,
  };

export default(state = initialState, action) => {
    switch (action.type) {
        case "GET_USERLIST":
            return {...state, userlist: action.payload}

        case "GET_USER":
            const searchedUsername = action.payload;
            let user = null
            if(searchedUsername !== null){
                user = state.userlist.find(user => user.username === searchedUsername);
            }
            console.log(user)
            return {...state, user}

        case "CREATE_USER":
            let idNew = 0;
            for (let i = 0; i < state.userlist.length; i++) {
                if(idNew < state.userlist[i].id){
                    idNew = (state.userlist[i].id);
                }
            }
            console.log(action.payload)
            const newUser = {...action.payload, createdCollection:[], playedCollection:[], id:idNew+1};
            let newList = state.userlist;
            newList.push(newUser);
            return {...state, userlist:newList}

        case "CHECK_USER":
            const username = action.payload.username;
            const password = action.payload.password;
            console.log(state.userlist);
            for (let i = 0; i < state.userlist.length; i++) {
                if(username === state.userlist[i].username && password === state.userlist[i].password){
                    console.log(username, state.userlist[i])
                    console.log(password, )
                    return {...state, loginSuccess:true}
                }
            }
            return {...state, loginSuccess:false}
        
        case "LOGIN_USER":
            const loggedInUsername = action.payload;
            const loggedInUser = state.userlist.find(user => user.username === loggedInUsername);
            console.log(loggedInUser);
            return {...state, user:loggedInUser, loginSuccess:true};
        
        case "GET_LOGIN_SUCCESS":
            return {...state, loginSuccess:state.loginSuccess}
        
        case "LOGOUT_USER":
            return {...state, user:null, loginSuccess:false};

        case "CHECK_AVAILABLE_USER":
            const potUsername = action.payload.username;
            for (let i = 0; i < state.userlist.length; i++) {
                if(potUsername === state.userlist[i].username){
                    return {...state, usernameAvailable:false, loginSuccess:false}
                }
            }
            return {...state, usernameAvailable:true, loginSuccess:true}

        case "ADD_PLAYED_COLLECTION":
            let playedCollection = state.user.playedCollection;
            let nUser = state.userlist.find(user => user.id === state.user.id);
            playedCollection.push(action.payload);
            nUser = {...nUser, playedCollection: playedCollection};
            let userlistNew = state.userlist;
            for (let i = 0; i < userlistNew.length; i++) {
                if(userlistNew[i].id === nUser.id){
                    userlistNew[i] = nUser;
                }
            }
            console.log(userlistNew)
            console.log("halla")
            return {...state, userlist: userlistNew}
        
        case "ADD_CREATED_COLLECTION":
            let createdCollection = state.user.createdCollection;
            let neUser = state.userlist.find(user => user.id === state.user.id);
            createdCollection.push(action.payload);
            neUser = {...neUser, createdCollection: createdCollection};
            let newUserlist = state.userlist;
            for (let i = 0; i < newUserlist.length; i++) {
                if(newUserlist[i].id === neUser.id){
                    newUserlist[i] = neUser;
                }
            }
            console.log(newUserlist)
            return {...state, userlist: newUserlist}

        case 'DELETE_CREATED_COLLECTION':
            let dCollId = action.payload;
            let delUserList = state.userlist;
            for (let i = 0; i < delUserList.length; i++) { 
                for (let a = 0; a < delUserList[i].createdCollection.length; a++) {
                    if(delUserList[i].createdCollection[a] === dCollId){
                        let nCreatedList = delUserList[i].createdCollection.filter(coll => coll !== dCollId);
                        delUserList[i] = {...delUserList[i], createdCollection:nCreatedList}
                    }
                }
            }
            console.log(delUserList)
            return {...state, userlist:delUserList}
        case 'DELETE_PLAYED_COLLECTION':
            let deCollId = action.payload;
            let deUserList = state.userlist;
            for (let i = 0; i < deUserList.length; i++) { 
                for (let a = 0; a < deUserList[i].playedCollection.length; a++) {
                    if(deUserList[i].playedCollection[a] === deCollId){
                        let nePlayedList = deUserList[i].playedCollection.filter(coll => coll !== deCollId);
                        deUserList[i] = {...deUserList[i], playedCollection:nePlayedList}
                    }
                }
            }
            return {...state, userlist:deUserList}
        default:
            return state;
    }
}