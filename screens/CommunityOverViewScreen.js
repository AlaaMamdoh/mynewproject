import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground,ScrollView , TextInput, FlatList } from 'react-native';
import { Ionicons, FontAwesome, Octicons } from '@expo/vector-icons';
import { Avatar, Divider, Icon } from 'react-native-elements';
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


export default class CreateCommunityScreen extends React.Component {
    state = {
        communityDetails: {},
        postTxt:'',
        newPostDetails:{},
        posts: [],
        postMakingUserName:'',
    }
    componentDidMount(){this.listenForCommunityAndPosts()}
    postmaker = (userId) => {
        alert("postmaker")
        
    }
    
    listenForCommunityAndPosts = () =>  {
        firebase.database().ref('posts').orderByChild('communityKey')
        .equalTo('-M0lO8LPYwPdDsdrSvMJ')
        .on('value', (dataSnapshot) =>{
            let promises = [];
            dataSnapshot.forEach((child) => {
                var userId = child.val().user
                let userRef = firebase.database().ref('authenticatedUsers').child(userId);
                promises.push(userRef.child('fullName').once('value'));
            })
            Promise.all(promises).then((snapshots) => {
                return snapshots.map((userNameSnapshot) => userNameSnapshot.val());
            })
            .then((userNames) => {
                let postsList = [];
                let index = 0;
                dataSnapshot.forEach((child) => {
                    postsList.push({
                        image: child.val().image,
                        text: child.val().text,
                        user: userNames[index],
                        likesNumber: child.val().likesNumber,
                        commentsNumber: child.val().commentsNumber,
                        postKey: child.key,
                        userKey: child.val().user
                    })
                    index = index + 1;
                });

                this.setState({ posts: postsList })
            })
        })
    }
    
    render() {
        const renderPost = (item) =>(
            <View>
                <Post 
                    userName= {item.user}//{item.user}
                    userAvatar = 'https:placehold.it/150'
                    postText={item.text}
                    likesNumber={item.likesNumber}
                    CommentsNumber={item.commentsNumber}
                    postKey={item.postKey}
                    navigation = {this.props.navigation}
                    communityKey =  '-M07uNj9HbQxc_ich644'/*{this.props.navigation.getParam("communityKey")}*/
                />
            </View>)
        return (

            <View style={{ borderWidth: 1, borderColor: 'blue', flex: 1 }}>
                <View style={styles.communityBgImgContainer}>
                    <ImageBackground 
                        source={{ uri: this.state.communityDetails.communityBackgroundImg }}
                        style={styles.communityBgImg}
                    >
                    </ImageBackground>
                </View>
                <View style={{ borderWidth: 1, borderColor: 'red', flex: 1 }}>
                    <View style={styles.communityImgContainer}>
                        <TouchableOpacity style={{marginTop: -70}}>
                            <Avatar
                                rounded
                                size={130}
                                source={{ uri: this.state.communityDetails.communityImage }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.communityNameTxtInput}>{this.state.communityDetails.name}</Text>
                        <Text style={styles.communityDisTxtInput}>{this.state.communityDetails.discription}</Text>
                    </View>
                    <View>
                        <FlatList
                            style={{ padding: 6, borderWidth: 1,borderColor: 'orange', marginTop: 5, marginBottom: 120}}
                            data={this.state.posts}
                            keyExtractor={(item) => item.id}
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
