import React, { Component } from 'react';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';
import './index.css';
import Chatkit from '@pusher/chatkit-client';
import {instanceLocator,userId,tokenUrl} from './config';
// https://docs.pusher.com/chatkit/reference/javascript
class App extends Component {
  // state is private for component
  //  props are not private
  constructor(){
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
  }
  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId,
      tokenProvider : new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })
    chatManager
    .connect()
      .then(currentUser=>{
        this.currentUser = currentUser;
        this.getRooms();
   })
 .catch(error=>{
   console.log("error",error);
 });
   }
   getRooms(){
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      })
    }).catch(error => {
      console.log(`Error getting joinable rooms: ${error}`);
    });
   }
   subscribeToRoom(roomId){
    this.setState({messages: []});
    this.currentUser.subscribeToRoom({
      roomId : roomId ,
      hooks: {
        onMessage : message => {
          this.setState({
            messages: [...this.state.messages,message]
          })
       }
      },
      messageLimit: 20
   })
   .then(room=>{
     this.setState({
       roomId: room.id
     })
     this.getRooms();
   })
   .catch(error => console.log(`error in getting subscription : ${error}`));
 }
   
   sendMessage(text){
     this.currentUser.sendMessage({
       text,
       roomId: this.state.roomId
     });
   }
  render() {
    return (
      <div className="app">
                <RoomList 
                roomId={this.state.roomId}
                subscribeToRoom={this.subscribeToRoom}
                rooms={[...this.state.joinedRooms,...this.state.joinableRooms]}
                />
                <MessageList 
                messages={this.state.messages}
                />
                <SendMessageForm 
                sendMessage={this.sendMessage}
                />
                <NewRoomForm />
      </div>
    );
  }
}

export default App;
