import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            bgColour: "black",

        }
    }
    render() {
        return (
            //Adds the background image with styling
            <ImageBackground style={styles.bgImg} source={require("../files/bg-img.png")}>
                {/*Main container that holds all the content*/}
                <View style={styles.mainContainer}>
                    {/*Title View that holds the title of the app*/}
                    <View style={styles.title}>
                        <Text style={styles.headline} >ChatMeUp</Text>
                    </View>
                    {/*Secondary Container that holds components for user interaction*/}
                    <View style={styles.container}>
                        {/*Text Input that allows user to type their name} */}
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput} onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                placeholder="Your Name" />
                        </View>
                        {/*Buttons (Touchable Opdacity), that will set the colour of the background and of the button on press */}
                        <View style={styles.colourContainer}>
                            <Text>Choose Background Colour:</Text>
                            <View style={styles.colourPicker}>
                                <TouchableOpacity
                                    style={[
                                        styles.colours,
                                        styles.black,
                                    ]}
                                    onPress={() => this.setState({ bgColour: "#090C08" })}
                                ></TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.colours,
                                        styles.gray,
                                    ]}
                                    onPress={() => this.setState({ bgColour: "#474056" })}
                                ></TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.colours,
                                        styles.lightGray,
                                    ]}
                                    onPress={() => this.setState({ bgColour: "#8A95A5" })}
                                ></TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.colours,
                                        styles.green,
                                    ]}
                                    onPress={() => this.setState({ bgColour: "#B9C6AE" })}
                                ></TouchableOpacity>
                            </View>
                        </View>
                        {/*On press it will set props to navigate to chat and set state for name and bgColour*/}
                        <TouchableOpacity
                            style={[
                                styles.startChattingContainer,
                                { backgroundColor: this.state.bgColour },
                            ]}
                            onPress={() =>
                                this.props.navigation.navigate("Chat", {
                                    name: this.state.name,
                                    bgColour: this.state.bgColour,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground >
        )
    }
}

const styles = StyleSheet.create({
    bgImg: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    mainContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        marginTop: 30,
        flex: 30,
    },
    headline: {
        fontWeight: '600',
        fontSize: 60,
        color: 'white',
    },
    container: {
        flex: 60,
        width: 300,
        backgroundColor: "white",
        marginBottom: 50,
    },
    textInputContainer: {
        top: 5,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',

    },
    textInput: {
        margin: 5,
        padding: 5,

    },
    colourContainer: {
        top: 50,
        margin: 5,
        flex: 1,
        alignItems: 'center',
    },
    colourPickerContainer: {
        position: "absolute",
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
    },
    chooseColour: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        marginLeft: 10,
    },
    colourPicker: {
        flexDirection: "row",
        marginTop: 15,
    },
    colours: {
        width: 50,
        height: 50,
        margin: 10,
        borderRadius: 50 / 2,
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    black: {
        backgroundColor: "#090C08",
    },
    gray: {
        backgroundColor: "#474056",
    },
    lightGray: {
        backgroundColor: "#8A95A5",
    },
    green: {
        backgroundColor: "#B9C6AE",
    },
    startChattingContainer: {
        flex: 1,
        position: "absolute",
        bottom: 25,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "88%",
        height: 60,
        shadowColor: "#000",
        opacity: 0.9,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});