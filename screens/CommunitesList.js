import React from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
console.disableYellowBox = true
import * as firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyABjDdiaYm83rEkUsEG-u5aeegZrhNDSKs",
  authDomain: "family-social-communicat-b54bb.firebaseapp.com",
  databaseURL: "https://family-social-communicat-b54bb.firebaseio.com",
  projectId: "family-social-communicat-b54bb",
  storageBucket: "family-social-communicat-b54bb.appspot.com",
  messagingSenderId: "954697433619",
  appId: "1:954697433619:web:24ed30743d12f703e835e6"
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = firebase.auth()
const db = firebase.database()

function Comp({ content, sender, timestamp, chatName, uri }) { //every chat rendering 

  return (
    <TouchableOpacity style={{ borderWidth: 1, margin: 10, padding: 10, backgroundColor: '#e3e3e3' }}>
      <View style={{ flexDirection: 'row' }}>
      <Avatar source={{ uri: 'http://placehold.it/150' }} rounded size='medium' />
        <View style={{ width: '60%' }}>
          <Text style={{  marginLeft: 10, fontSize: 12, fontWeight: 'bold' }}> {chatName} </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, color: 'green' }}> {sender}</Text>
            <Text> : {content} </Text>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 10 ,flexDirection: 'column' , alignItems:'flex-end'}}> {timestamp} </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      email: 'firestorage@gmail.com', //will be deleted later
      password: '1234567890',//will be deleted later
      msg: 'logged in successfully',//will be deleted later
      chats: [], //store chats messages
      Messages: [],// do nothing
      list: [], //retrieve rooms addresses from users' data

    }
  }

  async signInToDB(email, password) { //will be deleted later
    try {
      await auth.signInWithEmailAndPassword(email, password)
      Alert.alert('logged In')
      this.setState({ view: true })
    }
    catch (e) {
      console.log(e)
    }
  }

  signIn = () => {//will be deleted later
    this.signInToDB(this.state.email, this.state.password)
  }


  getChatList() {
    let address = `Users/user1/joined/communities/community_1/joined/rooms/` //address of personal Logs of user
    let list = [] //will contain the addresses of each room chat fetched from log
    db.ref(address).on('value', snap => {
      snap.forEach(child => {
        list.push({
          room_route: child.val(), //addresses of different rooms/chats
        })
      })
      this.setState({ list })
    })
    this.getChats() //progress to the next stage
  }

  getChats() {
    let chats = [] //each object will contain messages of a chat. array contains all messages
    this.state.list.forEach(element => { //enters each chat/room through address
      db.ref('/' + element.room_route).on('value', snap => {
        let flag1 = false //makes sure that app will retrieve only one msg from chat
        let timestamp = 0 //initilization
        let temp = element.room_route.split('/')//سباكه .. بجيب بيها اسم ال chat
        let chatName = temp[2] // index of the folder in the firebase, change it depending on database
        snap.forEach(child => {// where i compare messages' timestamps. and only stores one
          if (timestamp <= child.val().timestamp) {
            timestamp = child.val().timestamp
            if (flag1) chats.pop()
            chats.push({ // pushing choosing message to the array.
              key: child.key,
              content: child.val().content,
              timestamp: child.val().timestamp,
              uri: child.val().uri,
              senderId: child.val().senderId,
              chatName: chatName
            })
            flag1 = true
          }
        })
      })
    })
    chats.sort(this.compareValues('timestamp', 'desc'))// sort arrays with messages by its timestamps
    this.setState({ chats })
  }

  /*
  uploadToRealTimeDatabase() {
      let address = 'MessagesEx/ChatEx3/'
      db.ref(address).push({
        content: "17",
        senderId: "gk25MM4LwvOBK3T4Fr8MWV40FDE2",
        timestamp: 1581694751656,
        uri: "https://images.emojiterra.com/google/android-10/512px/1f97a.png"
      })
    }
  */
  compareValues(key, order = 'asc') { //Object sorting function
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  mountIt() { //manually component updating 
    this.getChatList()
  }

  render() {
    return (
      <ScrollView style={{ padding: 10 }}>
        <Button title='sign in' onPress={this.signIn} />
        <Button title='Mount' onPress={this.mountIt.bind(this)} /> 
        <FlatList
          data={this.state.chats}
          renderItem={({ item }) => (
            <Comp
              sender={item.senderId}
              content={item.content}
              timestamp={item.timestamp}
              chatName={item.chatName}
              uri={item.uri}
            />
          )} />
      </ScrollView>
    )
  }
}