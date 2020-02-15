import React from 'react'
import { View, Button, Text, StatusBar, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Avatar } from 'react-native-elements'
import Header from '../../shared/Header'
import firebase from '../../services/firebaseConfig'
import { secondColor } from '../../shared/constants'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

export default class CommunitiesList extends React.Component {
    state = {
        search: '',
        communities: []
    }

    componentDidMount() {
        firebase.database().ref('communities').on('value', snap => {
            var communities = []
            snap.forEach(child => {
                communities.push({
                    name: child.val().name,
                    description: child.val().discription,
                    image: child.val().communityImage,
                    cover: child.val().communityBackgroundImg,
                    key: child.key
                })
            })
            this.setState({ communities })
        })
    }

    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header
                    title="Communities"
                    icon='newspaper-o' type='font-awesome'
                    icon2='plus' type2='font-awesome' onPress2={() => this.props.navigation.navigate('CreateCommunity')}
                    center
                />
                <FlatList
                    style={{ padding: 6 }}
                    data={this.state.communities}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('CommunityRooms')}>
                            <View style={styles.item}>
                                <Avatar rounded size={62} source={{ uri: item.image }} />
                                <View>
                                    <Text style={styles.communityName}>{item.name}</Text>
                                    <Text style={styles.communityDesc}>{item.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        borderColor: secondColor,
        borderWidth: 1,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15
    },
    communityDesc: {
        fontSize: 17,
        marginLeft: 15,
        marginTop: 3,
        color: '#333'
    }
})