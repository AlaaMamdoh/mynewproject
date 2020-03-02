import React from 'react'
import { View, Text, StatusBar } from 'react-native'

export default class SignIn extends React.Component {
    render() {
        return(
            <View style={{marginTop: StatusBar.currentHeight}}>
                <Text>Sign In Screen</Text>
            </View>
        )
    }
}