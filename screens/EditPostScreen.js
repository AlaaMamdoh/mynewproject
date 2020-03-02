import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image, ImageBackground, TextInput, FlatList } from 'react-native';
import { Avatar, Divider, Icon } from 'react-native-elements';
import { _launchCameraRoll, _takePhoto } from './Camera'
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

export default class CreateNewPostScreen extends React.Component {
    state = {
        postTxt: this.props.navigation.getParam("postTxt"),
        postImg:'',
        imgPicked: false,
        postExist: false,
    }
    submit = () =>{
        if (this.state.postTxt === '' && this.state.postImg === ''){
            this.props.navigation.navigate('CommunityOverView')
        }else{
            firebase.database().ref('posts').push({
                communityKey : /*'-M0-eK5qPULnEK3entq8',*/this.props.navigation.getParam("communityKey"),
                user : 'fHI1izTOJ5VeC7ZnjXUducickzj1'/* 'PCrBx38NcjZdsgmRS805sk7lgWn1' firebase.auth().currentUser || {}).uid */ ,
                text : this.state.postTxt,
                image : this.state.postImg,
                likesNumber : 0,
                commentsNumber : 0,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
            })
            .then(this.props.navigation.navigate('CommunityOverView'))
            .catch(error => {
                alert(error.toString())
                return
            })
        }
    }
    pickImage = () => {
        _launchCameraRoll().then(res => this.setState({ postImg : res }))
        this.setState(prevState => ({imgPicked: !prevState.imgPicked}))
    }
    render(){
        return(
            <View style={{paddingHorizontal:20, paddingVertical: 20}}>
                <View style={styles.postContainer}>
                    <TextInput style={styles.post}
                        placeholder="Type something ... "
                        placeholderTextColor='#888'
                        autoCapitalize="none"
                        value={this.state.postTxt}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={postTxt => this.setState({postTxt})} />
                        
                </View>
                { this.state.imgPicked && 
                    <View>
                        <Text>pick</Text>
                        <Image source={{ uri: this.state.postImg }} /> 
                    </View>
                }
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={this.pickImage}>
                        <Icon name='picture-o' type='font-awesome' size={25} color='#555'  />
                    </TouchableOpacity>
                    <View style={styles.iconSeparator}></View>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name='camera' type='font-awesome' size={25} color='#555'  />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.submitBtn} onPress={this.submit}>
                    <Text style={styles.submitBtnTxt}>Edit</Text>
                </TouchableOpacity>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    iconsContainer:{
        flexDirection: 'row',
        alignSelf:'center',
        marginTop:20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555'
    },
    iconSeparator:{
        width: 1,
        backgroundColor: '#555'
    },
    icon:{
        margin: 15
    },
    submitBtn:{
        backgroundColor:'#555',
        paddingVertical:15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius:5,
    },
    submitBtnTxt:{
        color:'#fff',
        fontSize:16,
        fontWeight: 'bold'
    },
    postContainer:{
        borderWidth:0.5,
        borderColor: '#555',
        borderRadius:5,
        flexDirection:'row', 
        paddingHorizontal: 20,
        paddingVertical:5,
        alignItems: 'center',
    },
    post: {
        fontSize: 17,
        flex: 1,
    },
});