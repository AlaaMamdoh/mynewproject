import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList } from 'react-native'
import {SearchBar, Icon} from 'react-native-elements'
import Post from './Post'
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

export default class NewsFeedScreen extends React.Component {
    state = {
        search: '',
        postsList:[],
    }
    componentDidMount() {
        firebase.database().ref('posts').child('-M0aeUVj1gSm6wpsAM2T').on('value', snap => {
            var posts = []
            snap.forEach(child => {
                posts.push({
                    key: child.key,
                    timestamp: child.val().timestamp,
                    text: child.val().text,
                    image: child.val().image,
                    likesNumber: child.val().likesNumber,
                    commentsNumber: child.val().commentsNumber,
                    //user: child.val().user
                })
            })
            this.setState({postsList: posts })
        })
    }
    render(){
        const renderPost = (item) =>(
            <View>
                <Post 
                    userName= 'lol'//{item.user}//{item.user}
                    userAvatar = 'https:placehold.it/150'
                    postText={item.text}
                    likesNumber={item.likesNumber}
                    CommentsNumber={item.commentsNumber}
                    postKey={item.postKey}
                />
            </View>
        )
        return(
            <View style={{ borderWidth: 1, borderColor: 'blue', flex: 1 }}>
                <View style={styles.communityBgImgContainer}>
                    <SearchBar
                        lightTheme
                        containerStyle={{ backgroundColor: '#FFF' }}
                        inputContainerStyle={{ backgroundColor: '#DDD' }}
                        placeholder="Search a Member"
                        value={this.state.search}
                        onChangeText ={
                            alert('search')
                        } 
                    />
                </View>
                <View style={{ borderWidth: 1, borderColor: 'red', flex: 1 }}>
                    <View>
                        <FlatList
                            style={{ padding: 6, borderWidth: 1,borderColor: 'orange', marginTop: 5, marginBottom: 120}}
                            data={this.state.postsList}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => renderPost(item)}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('CreateNewPost', {communityKey: '-M07uNj9HbQxc_ich644'/*this.props.navigation.getParam("communityKey")*/})}} style={{hight:40,width:40,borderRadius:40,position: 'absolute', bottom: 20, left: 0, right: 0,}}>
                    <Icon name='plus' type='font-awesome' size={30} color='#fff' style={{}} />
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    communityBgImgContainer: {
        borderWidth: 1,
        borderColor: 'green',
        flex: 0.3
    },
    communityBgImg: {
        flex: 1,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: 'black',
    },
    communityImg: {
        width: 150,
        height: 150,
        borderRadius: 150,
        borderWidth: 1,
        borderColor: '#d6d7da',
        alignItems: 'center',
        marginTop: -100,
    },
    communityImgContainer: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'orange',
    },
    bottomContainer: {
        flexDirection: 'column',
    },
    btnContainer: {
        borderWidth: 1,
        borderColor: 'yellow',
        flex: 1,
        paddingHorizontal: 20,
    },
    addMemberBtn: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    addIcon: {
        marginRight: 10,
    },
    addText: {
        fontSize: 18,
        color: '#555'
    },
    createCommunityBtn: {
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d6d7da',
        backgroundColor: '#555',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 20,
    },
    createCommunityBtnTxt: {
        color: '#fff',
        fontSize: 16,
    },
    
    communityDisTxtInput: {
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'stretch',
    },
    postContainer:{
        borderWidth:0.5,
        borderColor: 'orange',
        borderRadius:30,
        //height: 50,
        flexDirection:'row', 
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    post: {
        fontSize: 17,
        flex: 1,
    },
});