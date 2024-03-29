import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

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
                avatar: "",
            },
            isConnected: false,
            image: null,
            location: null,
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceMessages = firebase.firestore().collection("messages");
    }

    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages),
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    //Called after Chat component Mounts. Setting state of message and props for name
    componentDidMount() {
        let { name } = this.props.route.params;

        //Grabs props: name from Start.js
        this.props.navigation.setOptions({ title: name });

        //Checks if user is online and sets state accordingly
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log("You are online!");

                //Firebase anonymously authentication; loading firebase database if user is online
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }

                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any",
                        },
                    });

                    this.referenceMessagesUsers = firebase
                        .firestore()
                        .collection("messages")
                        .where("uid", "==", this.state.uid);

                    this.unsubscribe = this.referenceMessages
                        .orderBy("createdAt", "desc")
                        .onSnapshot(this.onCollectionUpdate);
                });
            } else {
                //if user is offline, call getMessages to get localy stored messages
                console.log("You are offline!");
                this.setState({ isConnected: false });
                this.getMessages();
            }
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
                    avatar: data.user.avatar,
                },
                image: data.image || null,
                location: data.location || null,
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
                this.saveMessages();
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
            image: message.image || null,
            location: message.location || null,
        });
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
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

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3,
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    render() {

        return (

            <View style={styles.mainContainer}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderUsernameOnMessage={true}
                    showUserAvatar={true}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.user.name,
                        avatar: this.state.user.avatar,
                    }}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
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
console.disableYellowBox = true;