import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

//Config for firebase, give app access to firebase database
const firebaseConfig = {
    apiKey: "AIzaSyDLHSD3ONTgPwRtuP3V_jNjqGwWneGY5Yo",
    authDomain: "chatmeup-9b360.firebaseapp.com",
    projectId: "chatmeup-9b360",
    storageBucket: "chatmeup-9b360.appspot.com",
    messagingSenderId: "500947344839",
    appId: "1:500947344839:web:477a6853de59b0349e8de2",
    measurementId: "G-2K6S34STXX"
};

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
            }
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceMessages = firebase.firestore().collection("messages");
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

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.displayName,
                    name: name,
                }
            });

            this.referenceMessagesUsers = firebase
                .firestore()
                .collection("messages")
                .where("uid", "==", this.state.uid);

            this.unsubscribe = this.referenceMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document
        querySnapshot.forEach((doc) => {
            //get the queryDocumentSnapshot's data
            const data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text || "",
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                }
            });
        });
        this.setState({
            messages,
        });
    };

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages();
            })
    }

    addMessages() {
        const message = this.state.messages[0];
        //added new message to firebase
        this.referenceMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: message.user,
        });
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
                    user={this.state.user}
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