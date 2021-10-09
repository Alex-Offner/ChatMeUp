import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    //Called after Chat component Mounts. Setting state of message and props for name
    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: name + ' has entered the chat!',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    //Append puts the written message in the message object
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props) {

        //Get props for backgroundColour from Start.js
        let bgColour = this.props.route.params.bgColour;

        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: bgColour,
                    },
                    left: {
                        backgroundColor: '#363b3b'
                    }
                }}
                textStyle={{
                    right: { color: "white" },
                    left: { color: "#ddd" },
                }}
            />
        )
    }

    render() {

        return (

            <View style={styles.mainContainer}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {/* On android devices, add KeyboardAvoiding view  */}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});