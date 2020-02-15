import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList } from 'react-native';
import { Ionicons, FontAwesome, Octicons } from '@expo/vector-icons';
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
    constructor(props) {
        super(props);
        
        this.state = {
            communityImg: 'http://placehold.it/150',
            communityBackgroundImg: 'http://placehold.it/150',
            communityName: 'lll',
            communityDis: '',
        }
    }
    componentDidMount(){
        this.listenForRooms()
    }
    listenForRooms = () =>  {
        firebase.database().ref('communities').child(this.props.navigation.getParam("communityKey"))
        .child('name').on('value', snap =>{
            this.setState({communityName: snap.val()})
        })
        firebase.database().ref('communities').child(this.props.navigation.getParam("communityKey"))
        .child('discription').on('value', snap =>{
            this.setState({communityDis: snap.val()})
        })
        firebase.database().ref('communities').child(this.props.navigation.getParam("communityKey"))
        .child('communityImage').on('value', snap =>{
            this.setState({communityImg: snap.val()})
        })
        firebase.database().ref('communities').child(this.props.navigation.getParam("communityKey"))
        .child('communityBackgroundImg').on('value', snap =>{
            this.setState({communityBackgroundImg: snap.val()})
        })
    }
    render() {
        //console.log(this.state.communityName , )
       
        return (
            <View style={{ borderWidth: 1, borderColor: 'blue', flex: 1 }}>
                <View style={styles.communityBgImgContainer}>
                    <ImageBackground source={{ uri: this.state.communityBackgroundImg }}
                        style={styles.communityBgImg}
                    >
                    </ImageBackground>
                </View>
                <View style={{ borderWidth: 1, borderColor: 'red', flex: 1 }}>
                    <View style={styles.communityImgContainer}>
                        <ImageBackground source={{ uri: this.state.communityImg }}
                            style={styles.communityImg}
                            >
                            
                        </ImageBackground>
                        <Text style={styles.communityNameTxtInput}>{this.state.communityName}</Text>
                        <Text style={styles.communityDisTxtInput}>{this.state.communityDis}</Text>
                    </View>
                </View>
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
    communityNameTxtInput: {
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    communityDisTxtInput: {
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'stretch',
    },
    addUserBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    addUserBtnTxt: {
        marginLeft: 6,
        fontSize: 18,
        color: '#666',
    },
});