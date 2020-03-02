import React from 'react'
import { View, Text, StatusBar, StyleSheet } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'

export default class Post extends React.Component {
    render() {
        return (
            <View style={{ marginBottom: 10 }}>
                <View style={styles.post}>
                    <View style={styles.userDetails}>
                        <Avatar
                            rounded
                            size={50}
                            source={{ uri: this.props.userAvatar }}
                        />
                        <Text style={styles.userName}>{this.props.userName}</Text>
                    </View>
                    <Text style={styles.postText}>{this.props.postText}</Text>
                </View>
                <View style={styles.postReactions}>
                    <View style={styles.reaction}>
                        <Icon name='heart-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Like</Text>
                    </View>
                    <View style={styles.reaction}>
                        <Icon name='comment-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Comment</Text>
                    </View>
                </View>
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
        borderTopWidth: 0,
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
    }
})