import React from 'react'
import { View, StatusBar, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon, Text, Button, Avatar } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer'
//import { secondColor } from '../../shared/constants'
//import firebase from '../../services/firebaseConfig'
import DatePicker from 'react-native-datepicker'
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
export default class SignUp extends React.Component {
    state = {
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        rePassword: '',
        date:''
    }
    componentDidMount(){
        var date = new Date().getDate()
        var month = new Date().getMonth()+1
        var year = new Date().getFullYear()
        this.setState({date: year + '-' + month + '-' + date})
    }
    handleSignUP = (avatar, fullName, email, phone, username, password, rePassword , bd) => {
        // Form Validation
        if (avatar.length == 0 || fullName.length == 0 || email.length == 0 || phone.length == 0 || username.length == 0 || password.length == 0) {
            Alert.alert("Please complete the entire fields")
            return
        }
        if (password !== rePassword) {
            Alert.alert("Password & repassword don't match, please match both fields and try again")
            return
        }
        if (password.length < 6) {
            Alert.alert("Please enter at least 6 characters for password")
            return;
        }

        // Database Insertion & Sending E-mail Verification
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(res => {
                firebase.database().ref('authenticatedUsers').child(res.user.uid).set({ fullName, email, username, phone, avatar ,bd})
                res.user.updateProfile({ displayName: fullName, photoURL: avatar})
                res.user.sendEmailVerification()
            })
            .then(this.props.navigation.navigate('VerifyEmail'))
            .catch(error => Alert.alert(error.toString()))
    }
    render() {
        var profileIcon = 'https://www.searchpng.com/wp-content/uploads/2019/02/Deafult-Profile-Pitcher.png'
        return (
            <View style={{ marginTop: StatusBar.currentHeight, padding: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text h3 style={styles.heading}>Create Account</Text>
                    <Avatar
                        rounded
                        showEditButton
                        onEditPress={() => Alert.alert("Choose Your Avatar")}
                        size={'large'}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={{ uri: this.state.avatar ? this.state.avatar : profileIcon }}
                    />
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Full Name"
                        value={this.state.fullName}
                        onChangeText={fullName => this.setState({ fullName })}
                    />
                    <TextInput
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="E-Mail"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="Phone"
                        value={this.state.phone}
                        onChangeText={phone => this.setState({ phone })}
                    />
                    <TextInput
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={username => this.setState({ username })}
                    />
                    <View style={{flexDirection:'row' , alignItems:'center'}}>
                        <Text>Birthday : </Text>
                        <DatePicker
                            style={{width: 200}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="1900-01-01"
                            maxDate= {this.state.date}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
                    </View>
                    
                    <TextInput
                        secureTextEntry
                        autoCapitalize='none'
                        placeholder="Password"
                        style={styles.TextInput}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    <TextInput
                        secureTextEntry
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="Re-Password"
                        value={this.state.rePassword}
                        onChangeText={rePassword => this.setState({ rePassword })}
                    />
                    <Button
                        buttonStyle={styles.button}
                        title="SIGN UP"
                        onPress={() => this.handleSignUP(this.state.avatar, this.state.fullName, this.state.email, this.state.phone, this.state.username, this.state.password, this.state.rePassword)} />
                    <Text style={styles.already}>Already have an account ?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SignIn")}>
                        <Text style={styles.SignIn}>SignIn</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardSpacer />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading: {
        color: '#555',// secondColor,
        marginBottom: 20
    },
    TextInput: {
        width: 285, height: 39,
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: '#9b9b9b',
        marginBottom: 12
    },
    button: {
        marginTop: 12,
        marginBottom: 15,
        color: '#555',//secondColor,
        width: 285, height: 39,
        backgroundColor: '#555',//secondColor
    },
    already: {
        fontSize: 17
    },
    SignIn: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#555',//secondColor,
    },
})