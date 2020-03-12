import React from 'react'
import { View, Text, StatusBar, StyleSheet ,TouchableOpacity , TextInput , FlatList , Modal} from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import PopMenu from '../shared/PopMenu'
//import Modal from "react-native-modal";
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
export default class Post extends React.Component {
    state ={
        commentsModalVisible: false,
        likersModalVisible: false,
        editCommentModalVisible: false,
        liked: true,
        comments:[],
        commentTxt:'',
        likers:[],
        editComment:'',
        editCommentKey:'',
    }
    componentDidMount(){
        firebase.database().ref('posts').child(this.props.postKey).child('likers')
        .orderByChild("user").equalTo('fHI1izTOJ5VeC7ZnjXUducickzj1'/* 'PCrBx38NcjZdsgmRS805sk7lgWn1' firebase.auth().currentUser || {}).uid */)
        .once("value",snapshot => {
            if (snapshot.exists()){this.setState(prevState => ({liked : !prevState.liked}))}
        });
    }
    setCommentModalVisible(visible) {this.setState({commentsModalVisible: visible});}
    setLikersModalVisible(visible) {this.setState({likersModalVisible: visible});}
    setEditCommentModalUnVisible(){this.setState({editCommentModalVisible: false});}
    likeNumberIncrement
    like = () =>{
        firebase.database().ref('posts').child(this.props.postKey/*'-M0IviCqMGE_PxoqNd0W'*/)
        .on('value', snap => {this.likeNumberIncrement =  snap.val().likesNumber})
        //alert(this.likeNumberIncrement)

        if(this.state.liked){
            this.likeNumberIncrement= this.likeNumberIncrement+1
            firebase.database().ref(`posts/${this.props.postKey}/likesNumber`).set(this.likeNumberIncrement)
            
            // the code down below is right 
            firebase.database().ref('posts').child(this.props.postKey/*'-M0IviCqMGE_PxoqNd0W'*/).child('likers').push({user : 'fHI1izTOJ5VeC7ZnjXUducickzj1'/* 'PCrBx38NcjZdsgmRS805sk7lgWn1' firebase.auth().currentUser || {}).uid */ })
            .catch(error => {
                alert(error.toString())
                return
            }) 
            //alert('inc')
            
        }else{
            this.likeNumberIncrement= this.likeNumberIncrement-1
            firebase.database().ref(`posts/${this.props.postKey}/likesNumber`).set(this.likeNumberIncrement)
            //let likerr = ''
            firebase.database().ref(`posts/${this.props.postKey}/likers`)
            .orderByChild('user')
            .equalTo('fHI1izTOJ5VeC7ZnjXUducickzj1'/* 'PCrBx38NcjZdsgmRS805sk7lgWn1' firebase.auth().currentUser || {}).uid */)
            .once('value', results => {
                results.forEach((snapshot) => {
                    this.liker =  snapshot.key
                });
            })
            .then(
                firebase.database().ref('posts')
                .child(this.props.postKey/*'-M0IviCqMGE_PxoqNd0W'*/)
                .child('likers').child(this.liker).remove()
            )
            .catch(error => {
                alert(error.toString())
                return
            }) 
            
            //.remove()
            
        }
        this.setState(prevState => ({liked : !prevState.liked}))
        //alert(this.likeNumberIncrement)
        ////////////////////////////////////////
        
    }
    makeCommentIncrement
    makeComment =()=>{
        firebase.database().ref('posts').child(this.props.postKey/*'-M0IviCqMGE_PxoqNd0W'*/)
        .on('value', snap => {this.makeCommentIncrement =  snap.val().commentsNumber})
        this.makeCommentIncrement= this.makeCommentIncrement+1
        firebase.database().ref(`posts/${this.props.postKey}/commentsNumber`).set(this.makeCommentIncrement)
        .then (() =>{
                firebase.database().ref('posts').child(this.props.postKey).child('comments').push({
                    user: 'fHI1izTOJ5VeC7ZnjXUducickzj1'/* 'PCrBx38NcjZdsgmRS805sk7lgWn1' firebase.auth().currentUser || {}).uid */,
                    commentTxt: this.state.commentTxt,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                })
                this.setState({commentTxt: ''})
            }
        )
        .catch(error => {
            alert(error.toString())
            return
        }) 
    }
    likersHandler = () =>{
        firebase.database().ref('posts').child(this.props.postKey).child('likers')
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
                let likersList = [];
                let index = 0;
                dataSnapshot.forEach((child) => {
                    likersList.push({
                        user: userNames[index],
                        userKey : child.val().user//userId,
                    })
                    index = index + 1;
                });

                this.setState({ likers: likersList })
            })
        })
    }    
    commentHandler = () =>{
        firebase.database().ref('posts').child(this.props.postKey).child('comments')
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
                let commentsList = [];
                let index = 0;
                dataSnapshot.forEach((child) => {
                    commentsList.push({
                        commentTxt: child.val().commentTxt,
                        user: userNames[index],
                        commentKey: child.key,
                        userKey : child.val().user
                    })
                    index = index + 1;
                });

                this.setState({ comments: commentsList })
            })
        })  
    }
    setEditCommentModalVisible = (item) =>{
        this.setState({
            editComment : item.commentTxt , 
            editCommentKey: item.commentKey,
            editCommentModalVisible: true
        })
    }
    editComment = () => {
        firebase.database()
        .ref(`posts/${this.props.postKey}/comments/${this.state.editCommentKey}`)
        .once('value', snapshot =>{
            if (this.state.editComment === snapshot.val().commentTxt){
                this.setState({editCommentModalVisible: false})
            }
            else{
                firebase.database()
                .ref(`posts/${this.props.postKey}/comments/${this.state.editCommentKey}/commentTxt`)
                .set(this.state.editComment)
                this.setState({editCommentModalVisible: false})
            }
        })
    }
    deleteComment = (item) => {
        firebase.database().ref('posts').child(this.props.postKey/*'-M0IviCqMGE_PxoqNd0W'*/)
        .once('value', snap => {this.makeCommentIncrement =  snap.val().commentsNumber})
        this.makeCommentIncrement= this.makeCommentIncrement-1
        firebase.database().ref(`posts/${this.props.postKey}/commentsNumber`).set(this.makeCommentIncrement)
        firebase.database().ref(`posts/${this.props.postKey}/comments/${item.commentKey}`).remove()
        .catch(error => {
            alert(error.toString())
            return
        })
    }
    deletePost =() =>{
        firebase.database().ref(`posts/${this.props.postKey}`).remove()
        .catch(error => {
            alert(error.toString())
            return
        })
    }
    editPost = () =>{this.props.navigation.navigate('EditPost' , {postKey: this.props.postKey})}
    render() {
        //console.log(this.state.likers)
        const renderComment = (item) => (
            <View style={{flexDirection:'row',borderColor:'#555',borderRadius:5, borderWidth:0.5,paddingVertical:10, paddingHorizontal:10 , marginBottom:10}}>
                <TouchableOpacity>
                    <Avatar
                        rounded
                        size={40}
                        source={{ uri: this.props.userAvatar }}
                    />
                </TouchableOpacity>
                <View style={{flexDirection:'column', marginLeft: 10, flex:1}}>
                    <TouchableOpacity>
                        <Text style={{fontWeight: 'bold'}}>{item.user}</Text>
                    </TouchableOpacity>
                    <Text>{item.commentTxt}</Text>
                </View>
                <PopMenu 
                    item1 = "delete"
                    item2 = 'edit'
                />
                <TouchableOpacity onPress={()=>{this.setEditCommentModalVisible(item)}} style ={{marginRight: 5}}>
                    <Icon name='ellipsis-v' type='font-awesome' size={15} color='#555' />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.deleteComment(item)}}>
                    <Icon name='ellipsis-v' type='font-awesome' size={15} color='#555' />
                </TouchableOpacity>
            </View>
        )
        const renderLikers = (item) => (
            <View style={{flexDirection:'row',borderColor:'#555',borderRadius:5, borderWidth:0.5,paddingVertical:10, paddingHorizontal:10 , marginBottom:10}}>
                <TouchableOpacity>
                    <Avatar
                        rounded
                        size={40}
                        source={{ uri: this.props.userAvatar }}
                    />
                </TouchableOpacity>
                <View style={{flexDirection:'column', marginLeft: 10, flex:1}}>
                    <TouchableOpacity>
                        <Text style={{fontWeight: 'bold'}}>{item.user}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
        return (
            <View style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={this.editPost} style={{position: 'absolute', right:15, top:15}}>
                    <Icon name='ellipsis-v' type='font-awesome' size={20} color='#555' />
                </TouchableOpacity>
                <View style={styles.post}>
                    <View style={styles.userDetails}>
                        <Avatar
                            rounded
                            size={50}
                            source={{ uri: this.props.userAvatar }}
                        />
                        <Text style={styles.userName}>{this.props.userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() =>{this.props.navigation.navigate('EditPost' , {communityKey: this.props.communityKey ,postKey: this.props.postKey , postText : this.props.postText})}}>
                        <Text style={styles.postText}>{this.props.postText}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => {this.setLikersModalVisible(true);}}>
                        <Text>{this.props.likesNumber} likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 10}} onPress={() => {this.setCommentModalVisible(true);}}>
                        <Text>{this.props.CommentsNumber} comments</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.postReactions}>
                    <TouchableOpacity style={styles.reaction} onPress={() => this.like()}>
                        <Icon name='heart-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={() => {this.setCommentModalVisible(true);}}>
                        <Icon name='comment-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Comment</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                animationType="slide"
                visible={this.state.likersModalVisible}
                onShow={this.likersHandler}
                presentationStyle="formSheet "
                onRequestClose={() => {this.setLikersModalVisible(false);}}
                >
                    <View style={{backgroundColor: '#000000D9', flex:1}}>
                        <View style={styles.commentsContainer}>
                            <FlatList 
                                style={{marginTop: 10, marginHorizontal:10}}
                                data={this.state.likers}
                                keyExtractor={(item) => item.userKey}
                                renderItem={({ item }) => renderLikers(item)}
                            />
                        </View>
                    </View>
                </Modal>               
                <Modal
                animationType="slide"
                //transparent={true}
                visible={this.state.commentsModalVisible}
                onShow={this.commentHandler}
                presentationStyle="formSheet "
                onRequestClose={() => {this.setCommentModalVisible(false);}}
                >
                    <View style={{backgroundColor: '#000000D9', flex:1}}>
                        <View style={styles.commentsContainer}>
                            <FlatList 
                                style={{marginTop: 10, marginHorizontal:10}}
                                data={this.state.comments}
                                keyExtractor={(item) => item.commentKey}
                                renderItem={({ item }) => renderComment(item)}
                            />
                            <View style={{alignItems:'center', backgroundColor:'#fff' ,position:'absolute',flexDirection:'row', bottom: 10, left:10,right:10,}}>
                                <View style={styles.commentInputContainer}>
                                    <TextInput 
                                        style={styles.commentInput}
                                        placeholder="Type something ... "
                                        placeholderTextColor='#888'
                                        autoCapitalize="none"
                                        value={this.state.commentTxt}
                                        multiline={true}
                                        numberOfLines={1}
                                        onChangeText={commentTxt => this.setState({commentTxt})} 
                                    />
                                </View>
                                <TouchableOpacity onPress={this.makeComment}>
                                    <Icon name='arrow-up' type='font-awesome' size={22} color='#555' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                animationType="slide"
                //transparent={true}
                visible={this.state.editCommentModalVisible}
                //onShow={this.editcommentHandler}
                presentationStyle="formSheet "
                onRequestClose={() => {this.setEditCommentModalUnVisible();}}
                >
                    <View style={{backgroundColor: '#000000D9', flex:1}}>
                        <View style={styles.commentsContainer}>
                            <View style={styles.postContainer}>
                                <TextInput style={styles.post}
                                    placeholder="Type something ... "
                                    placeholderTextColor='#888'
                                    autoCapitalize="none"
                                    value={this.state.editComment}
                                    multiline={true}
                                    numberOfLines={3}
                                    onChangeText={editComment => this.setState({editComment})} />
                            </View>
                            <View style={styles.iconsContainer}>
                                <TouchableOpacity style={styles.icon} onPress={this.pickImage}>
                                    <Icon name='picture-o' type='font-awesome' size={25} color='#555'  />
                                </TouchableOpacity>
                                <View style={styles.iconSeparator}></View>
                                <TouchableOpacity style={styles.icon}>
                                    <Icon name='camera' type='font-awesome' size={25} color='#555'  />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.submitBtn} onPress={this.editComment}>
                                <Text style={styles.submitBtnTxt}>EDIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    post: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#CCC',
    },
    userDetails: {
        flexDirection: 'row',
        //alignItems: 'center'
    },
    userName: {
        position: 'relative',
        left: 8, top: 5,
        fontWeight: 'bold',
        fontSize: 15
    },
    postText: {
        padding: 15,
        textAlign: 'center',
        fontSize: 20,
    },
    postReactions: {
        padding: 10,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderWidth: 1,
        //borderTopWidth: 0,
        borderColor: '#CCC',
        alignItems: 'center',
    },
    reaction: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 21
    },
    reactionText: {
        color: '#555',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5
    },
    commentsContainer:{
        marginTop: 100,
        //marginHorizontal:5,
        backgroundColor:'#fff', 
        flex:1, 
        borderWidth: 2,
        borderColor: 'orange',
        borderTopLeftRadius: 20,
        borderTopRightRadius:20, 
        padding: 10
    },
    commentInputContainer:{
        borderWidth:0.5,
        borderColor: '#555',
        borderRadius:30,
        flexDirection:'row', 
        paddingHorizontal: 20,
        paddingVertical:5,
        alignItems: 'center',
        flex:1,
        marginRight: 5,
    },
    commentInput:{
        fontSize: 17,
        flex: 1,
    },
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
})
/*
                <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: '#fff'}}>
                    <View style={{ flex: 1 }}>
                        <Text>comments</Text>
                        <Button title="Hide modal" onPress={this.toggleModal} />
                    </View>
                </Modal>
*/