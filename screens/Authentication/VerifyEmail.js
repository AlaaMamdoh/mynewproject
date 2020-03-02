import React from 'react'
import { View, Text, StatusBar } from 'react-native'

export default class VerifyEmail extends React.Component {
    render() {
        return(
            <View style={{marginTop: StatusBar.currentHeight}}>
                <Text>Verify Email Screen</Text>
            </View>
        )
    }
}