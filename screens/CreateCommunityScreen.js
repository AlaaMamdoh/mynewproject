import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList } from 'react-native';
import { Ionicons, FontAwesome, Octicons } from '@expo/vector-icons';
import { _launchCameraRoll, _takePhoto } from './Camera'
import * as firebase from 'firebase'
import { SearchBar, Avatar, CheckBox } from 'react-native-elements';

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
        var firebaseDB = firebase.database();
        this.roomsRef = firebaseDB.ref('users').orderByChild('name');
        this.state = {
            communityImg: 'http://placehold.it/150',
            communityBackgroundImg: 'http://placehold.it/150',
            newCommunityName: '',
            newCommunityDis: '',
            search: '',
            users: [],
            choosenMembers: [],
            checked: false,
            key:'',
        }
    }
    //componentDidMount() {this.listenForRooms(this.roomsRef);}
    listenForRooms2 = (roomsRef) => {
        roomsRef
        .startAt(this.state.search)
        .endAt(this.state.search+"\uf8ff")
        .on('value', (dataSnapshot) => {
            var roomsFB = [];
            dataSnapshot.forEach((child) => {
                roomsFB.push({
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({ users: roomsFB });
        });
    }
    listenForRooms(roomsRef) {
        roomsRef.on('value', (dataSnapshot) => {
            var roomsFB = [];
            dataSnapshot.forEach((child) => {
                roomsFB.push({
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({ users: roomsFB });
        });
    }
    pickBgImage = () => {
        _launchCameraRoll().then(res => this.setState({ communityBackgroundImg: res }))
    }
    pickImage = () => {
        _launchCameraRoll().then(res => this.setState({ communityImg: res }))
    }
    addMember = () => {
        //this.props.navigation.navigate('AddMembers');
    }
    chooseMember(member) {
        var indexm = this.state.choosenMembers.findIndex(
            function(post, index) {
                if(post.id == member.key)
                return true;
            }
        );
        if(indexm === -1){
            this.setState({ choosenMembers: [...this.state.choosenMembers, { name: member.name, id: member.key }] })
        }
        else{this.state.choosenMembers.splice(indexm, 1)}
    }
    createCommunity = () => {
        
        firebase.database().ref('communities').push({
            name: this.state.newCommunityName,
            discription: this.state.newCommunityDis,
            communityImage: this.state.communityImg,
            communityBackgroundImg: this.state.communityBackgroundImg
        })
        .then((res) => {this.setState({key: res.key})})
        .then(() => {
            this.state.choosenMembers.forEach((choosenMember) => {
                firebase.database().ref(`choosenMembers/${this.state.key}`).push({
                    name: choosenMember.name,
                    key: choosenMember.id
                })
            })
        })
        .then(() =>{this.props.navigation.navigate('CommunityOverView', { communityKey: this.state.key }) } )
        .catch(error => {
            alert(error.toString())
            return
        }) 
    }
    render() {
        const renderUser = (item) =>(
            <View>
                <TouchableOpacity style={styles.addUserBtn} onPress={() => this.chooseMember(item)}>
                    <Avatar rounded size="medium" source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' }} />
                    <Text style={styles.addUserBtnTxt}>{item.name}</Text>
                </TouchableOpacity>
            </View>)
        return (
            <View style={{ borderWidth: 1, borderColor: 'blue', flex: 1 }}>
                <View style={styles.communityBgImgContainer}>
                    <ImageBackground source={{ uri: this.state.communityBackgroundImg }}
                        style={styles.communityBgImg}
                    >
                        <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 10 }} onPress={this.pickBgImage}>
                            <FontAwesome
                                name="picture-o"
                                size={30}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={{ borderWidth: 1, borderColor: 'red', flex: 1 }}>
                    <View style={styles.communityImgContainer}>
                        <ImageBackground source={{ uri: this.state.communityImg }}
                            style={styles.communityImg}
                        >
                            <TouchableOpacity style={{
                                position: 'absolute',
                                bottom: 10,
                            }}
                                onPress={this.pickImage}>
                                <FontAwesome
                                    name="picture-o"
                                    size={30}

                                    color="#555"
                                />
                            </TouchableOpacity>
                        </ImageBackground>
                        <TextInput
                            style={styles.communityNameTxtInput}
                            placeholder="Enter Community Name"
                            placeholderTextColor='#444'
                            autoCapitalize="none"
                            value={this.state.newCommunityName}
                            onChangeText={newCommunityName => this.setState({ newCommunityName })}
                        />
                        <TextInput
                            style={styles.communityDisTxtInput}
                            placeholder="Enter Community discription"
                            placeholderTextColor='#444'
                            autoCapitalize="none"
                            value={this.state.newCommunityDis}
                            onChangeText={newCommunityDis => this.setState({ newCommunityDis })}
                        />
                    </View>
                    <View style={styles.btnContainer}>
                        <View style={{ padding: 5 }}>
                            <SearchBar
                                lightTheme
                                containerStyle={{ backgroundColor: '#FFF' }}
                                inputContainerStyle={{ backgroundColor: '#DDD' }}
                                placeholder="Search a Member"
                                value={this.state.search}
                                onChangeText =
                                    {search => {
                                        this.setState({ search })
                                        this.listenForRooms2(this.roomsRef)
                                    }
                                } />
                            <FlatList
                                style={{ padding: 6, borderWidth: 1,borderColor: 'orange', marginTop: 5, marginBottom: 120}}
                                data={this.state.users}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => renderUser(item)}
                            />
                        </View>
                        <TouchableOpacity style={styles.createCommunityBtn} onPress={this.createCommunity}>
                            <Text style={styles.createCommunityBtnTxt}>Create Community</Text>
                        </TouchableOpacity>
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
        alignSelf: 'stretch',
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