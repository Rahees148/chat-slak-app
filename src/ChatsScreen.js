import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import TeamList from './components/TeamList'
import FriendsList from './components/FriendsList'
import TeamMembers from './components/TeamMembers'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import PersonAdd from '@material-ui/icons/PersonAdd';
import People from '@material-ui/icons/People';
import Popover from '@material-ui/core/Popover';
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import Delete from '@material-ui/icons/Delete'

class ChatScreen extends Component {
    defaultRoomId = 15759972;
    userSubscriptions = [this.defaultRoomId];
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: [],
            teamname: '',
            teamprivacy: false,
            currentUserTeams: {},
            currentUserFriends: {},
            currentRoomId: this.defaultRoomId,
            addUser: false,
            addusername: '',
            anchorEl: null,
            teamMembers: [],
            currentFriendId: ''
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this)
        this.handleAddUserClick = this.handleAddUserClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.createTeam = this.createTeam.bind(this)
        this.addUser = this.addUser.bind(this);
        this.handleAddUserChange = this.handleAddUserChange.bind(this)
        this.chatManager = '';
        this.onLogout = this.onLogout.bind(this);
        this.onFriendChat = this.onFriendChat.bind(this)
        this.leaveRoom = this.leaveRoom.bind(this)
        this.deleteRoom = this.deleteRoom.bind(this)
        localStorage.setItem('subscribedRooms', JSON.stringify(this.userSubscriptions))
    }

    componentDidMount() {
        this.chatMangerInit();
        this.chatManagerLoad(this.state.currentRoomId);
    }

    onLogout(e) {
        e.preventDefault();
        this.chatManager.disconnect();
        this.props.onLogout();
    }

    handleChange(e) {
        this.setState({ teamname: e.target.value })
    }

    handleAddUserChange(e) {
        this.setState({ addusername: e.target.value })
    }

    handleAddUserClick (e) {
        this.setState({addUser: true, addusername: ''});
    }

    handlePrivacyChange(e, isChecked) {
        this.setState({ teamprivacy: isChecked })
    }

    addUser(e) {
        if(e.keyCode === 13) {
            if (this.state.addusername) {
                this.setState({addUser: false});
                this.chatManagerCreateUser(this.state.addusername, this.state.currentRoomId);
                this.getTeamMembers( this.state.currentRoomId);
            } else {
                this.setState({addUser: false});
            }
        }
    }

    createTeam(e) {
        if(e.keyCode === 13) {
            this.chatManagerCreateRoom(this.state.teamname, this.state.teamprivacy);
        }
    }

    sendTypingEvent() {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.currentRoomId })
            .catch(error => console.error('error', error))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoomId,
        })
        this.chatManagerLoadRoomMessages(this.state.currentRoomId);
    }

    chatMangerInit() {
        this.chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:58197bf3-cd05-4562-ab6d-371e117fa29b',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: '/authenticate',
            }),
        })
    }

    chatManagerCreateRoom(roomName, privacy=false, individual=false) {
        this.state.currentUser
                .createRoom({
                name: roomName,
                private: privacy,
                addUserIds: []
            }).then(room => {
                if (!individual) {
                    this.setState({ teamname: '' })
                    let newList = this.state.currentUserTeams;
                    newList.push(room);
                    this.setState({ currentUserTeams: newList });
                } else {
                    return room.id;
                }
            })
            .catch(err => {
                console.log(`Error creating room ${err}`)
            })
    }

    chatManagerCreateUser(username, roomId) {
        this.state.currentUser.addUserToRoom({
            userId: username,
            roomId: roomId
        })
        .then(() => {console.log('Added user')
        })
        .catch(err => {console.log(`Error adding keith to room 123: ${err}`)
        })
    }

    chatManagerLoad(roomId) {
        this.chatManager
            .connect()
            .then(currentUser => {
                const friends = currentUser.users.filter(function (el) { return el.id !== currentUser.id; });
                this.setState({ currentUser })
                this.setState({ currentUserTeams: currentUser.rooms })
                this.setState({ currentUserFriends: friends})
                if (currentUser.rooms.length > 0) this.getTeamMembers(roomId)
                return currentUser.subscribeToRoom({
                    roomId: roomId,
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                            })
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                                    username => username !== user.name
                                ),
                            })
                        },
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
                if (this.state.currentUserTeams.length === 0) {
                    this.chatManager.disconnect()
                    this.chatMangerInit();
                    this.chatManagerLoad(this.state.currentRoomId);  
                } 
            })
            .catch(error => console.error('error', error))
    }

    chatManagerLoadRoomMessages(roomId) {
        this.setState({messages: [] })
        this.chatManager
        .connect()
        .then(currentUser => {
            this.setState({ currentUser })
            this.setState({ currentUserTeams: currentUser.rooms })
            return currentUser.fetchMessages({
                roomId: roomId,
            }).then(messages => {
                this.setState({messages: messages })
              })
              .catch(err => {
                console.log(`Error fetching messages: ${err}`)
              })
        })
        .catch(error => console.error('error', error))
    }

    chatManagerSubscribeRoom(roomId) {
        return this.state.currentUser.subscribeToRoom({
            roomId: roomId,
            messageLimit: 100,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message],
                    })
                },
                onUserStartedTyping: user => {
                    this.setState({
                        usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                    })
                },
                onUserStoppedTyping: user => {
                    this.setState({
                        usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                            username => username !== user.name
                        ),
                    })
                },
            },
        })   
    }

    onTeamChange(id) {
        this.setState({currentFriendId: ''})
        const newRoom = this.state.currentUserTeams.filter(function (el) { return el.id === id; });
        this.setState({currentRoomId : id });
        this.setState({currentRoom : newRoom[0] });
        if (newRoom[0].userIds.length > 0) {
             this.getTeamMembers(id);
        }
        this.chatManagerLoadRoomMessages(id);
        this.handleTeamSubscription(id)
    }

    handleTeamSubscription(roomid) {
        const subscribed = JSON.parse(localStorage.getItem('subscribedRooms'))
        const isSubscribed = subscribed.indexOf(roomid);
        if (isSubscribed < 0) {
            this.userSubscriptions.push(roomid)
            localStorage.setItem('subscribedRooms', JSON.stringify(this.userSubscriptions));
            this.chatManagerSubscribeRoom(roomid);
        }
    }

    getTeamMembers(id, flag=false) {
        const teamData = this.state.currentUserTeams.filter(function (el) { return el.id === id; });
        const data = (flag) ? teamData[0] : teamData[0];
        setTimeout(()=>{ 
            this.setState({ teamMembers: data.userIds});
        }, 2000);
        
    }

    onFriendChat(friendId) {
        this.setState({currentFriendId: friendId});
        this.setState({currentRoomId: ''});
        // create private room for chat, add user and load messages
        // const roomId = this.chatManagerCreateRoom(friendId+'-'+this.state.currentUser.name, true);
        // this.chatManagerCreateUser(friendId, roomId);
        // this.chatManagerLoadRoomMessages(friendId);
        this.setState({messages: []});
    }

    leaveRoom() {
        const teams = this.state.currentUserTeams
        const defaultId = this.defaultRoomId
        this.state.currentUser.leaveRoom({ roomId: this.state.currentRoomId })
        .then(room => {
            console.log(`Left room with ID: ${room.id}`)
            const defaultRoom = teams.filter(function (el) { return el.id === defaultId });
            this.setState({currentRoom : defaultRoom[0] });
            this.setState({currentRoomId: defaultId})
            const newTeams = teams.filter(function (el) { return el.id !== room.id; });
            this.setState({currentUserTeams : newTeams})
            this.chatManagerLoadRoomMessages(defaultId)
        })
        .catch(err => {
            console.log(`Error leaving room: ${err}`)
        })
    }

    deleteRoom() {
        const teams = this.state.currentUserTeams
        const defaultId = this.defaultRoomId
        const delRoom = this.state.currentRoomId 
        this.state.currentUser.deleteRoom({ roomId: delRoom })
        .then( () => {
            const defaultRoom = teams.filter(function (el) { return el.id === defaultId });
            this.setState({currentRoom : defaultRoom[0] });
            this.setState({currentRoomId: defaultId})
            const newTeams = teams.filter(function (el) { return el.id !== delRoom });
            this.setState({currentUserTeams : newTeams})
            this.chatManagerLoadRoomMessages(defaultId)
        })
        .catch(err => {
            console.log(`Error deleting room: ${err}`)
        })
    }

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };
    
    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        const open = Boolean(this.state.anchorEl);
        const styles = {
            container: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }, 
            chatContainer: {
                display: 'flex',
                flex: 1,
            },
            whosOnlineListContainer: {
                width: 240,
                flex: 'none',
                padding: 15,
                backgroundColor: 'lightgoldenrodyellow',
                color: 'black',
                logoImage: {
                    marginLeft: 60,
                    height: 100
                },
                textField: {
                    marginBottom: '10px'
                },
                logout: {
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    float: 'right'
                },
                h2Title: {
                    marginTop: 15,
                    marginBottom: 5
                }
            },
            chatListContainer: {
                padding: '20px 0 0',
                width: '85%',
                display: 'flex',
                flexDirection: 'column',
                h2Title: {
                    marginLeft: 20,
                },
                addUser: {
                    marginRight: 10,
                    textAlign: 'end',
                    cursor: 'pointer',
                    color: 'green'
                },
                listUser: {
                    marginRight: 10,
                    cursor: 'pointer',
                    color: 'cornflowerblue'
                },
                delete: {
                    marginRight: 10,
                    cursor: 'pointer',
                    color: 'crimson'
                },
                panel: {
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    position: 'absolute',
                    right: 0
                },
                section: {
                    display: 'flex',
                    backgroundColor: '#f2f2f2',
                    padding: 2
                },
                modal: {
                    padding: 10
                }
            },
        }
        return (
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    <aside style={styles.whosOnlineListContainer}>
                        <img src="images/chat.png" alt="logo" style={styles.whosOnlineListContainer.logoImage}/>
                        {this.state.currentUser.name ? 
                            <div>
                                <h5 style={styles.whosOnlineListContainer.h2Title}>
                            Welcome, {this.state.currentUser.name}
                            <a style={styles.whosOnlineListContainer.logout} onClick={this.onLogout}>Logout</a>
                        </h5></div> : '' }
                        <FormControl>
                            <Input placeholder="Create Team"   
                            value={this.state.teamname}
                            onKeyDown={this.createTeam}
                            onChange={this.handleChange} />
                        </FormControl>
                        <FormControlLabel control={
                            <Checkbox icon={<LockOpen />} checkedIcon={<Lock />} onChange={this.handlePrivacyChange} value="checkedH" />} />
                            { this.state.currentUserTeams.length > 0 ? 
                                <div><h4 style={styles.whosOnlineListContainer.h2Title}>Teams</h4><hr /></div> : '' }
                            
                            { this.state.currentUserTeams.length > 0 ? 
                                <TeamList userTeams={this.state.currentUserTeams} currentTeamId={this.state.currentRoomId} onTeamChange={this.onTeamChange.bind(this)} />
                                : ''}
                            { this.state.currentUserFriends.length > 0 ? 
                            <div><h4 style={styles.whosOnlineListContainer.h2Title}> Friends </h4><hr /></div> : ''}
                            { this.state.currentUserFriends.length > 0 ? 
                                <FriendsList friendsList={this.state.currentUserFriends} currentFriendId={this.state.currentFriendId} onFriendChat={this.onFriendChat.bind(this)} />
                                : ''}
                    </aside>
                    <section style={styles.chatListContainer}>
                        <div style={styles.chatListContainer.section}>
                        { !this.state.currentFriendId ?
                            <h3 style={styles.chatListContainer.h2Title}>Lets's chat in {this.state.currentRoom.name} Team</h3>
                            : <h3 style={styles.chatListContainer.h2Title}>Lets's chat with {this.state.currentFriendId}</h3>}
                        { this.state.currentUserTeams.length > 0 && !this.state.currentFriendId ?    
                            <div style={styles.chatListContainer.panel}>
                            {this.state.currentRoomId !== this.defaultRoomId ?
                                <div>
                                    {this.state.currentRoom.createdByUserId === this.state.currentUser.name ? 
                                        <div style={styles.chatListContainer.delete}> <Delete onClick={this.deleteRoom}/></div>
                                    : <div style={styles.chatListContainer.delete}> <DirectionsRun onClick={this.leaveRoom}/></div>
                                    }
                                 </div>
                            : ''}
                            <div style={styles.chatListContainer.addUser} onClick={this.handleAddUserClick}>
                                {this.state.addUser ? 
                                <FormControl>
                                    <Input placeholder="Add user"   
                                    value={this.state.addusername}
                                    onKeyDown={this.addUser}
                                    onChange={this.handleAddUserChange} />
                                </FormControl> : <PersonAdd /> }
                            </div>
                            <div style={styles.chatListContainer.listUser}>
                            <People
                            aria-owns={open ? 'simple-popper' : null}
                            aria-haspopup="true"
                            variant="contained"
                            onClick={this.handleClick}>
                                    </People>
                                    <Popover
                                        id="simple-popper"
                                        open={open}
                                        anchorEl={this.state.anchorEl}
                                        onClose={this.handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                    <h6 style={styles.chatListContainer.modal}>Members of Team </h6>
                                    <TeamMembers members={this.state.teamMembers}/>
                                    </Popover>
                                </div>
                            </div>
                             : ''}
                            </div>
                            { !this.state.currentFriendId ? <div>
                                <MessageList currentUser={this.state.currentUser.name} messages={this.state.messages} style={styles.chatList}/>
                                <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                                <SendMessageForm
                                    onSubmit={this.sendMessage}
                                    onChange={this.sendTypingEvent}
                                /></div>
                                : <h4 className="under-maintain">Under Maintenance</h4> }
                        
                    </section>
                </div>
            </div>
        )

    }
}

export default ChatScreen