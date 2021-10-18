import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import "firebase/firestore";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
// import MapView from "react-native-maps";
// import firebase from "firebase";


export default class CustomActions extends Component {

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickImage();
                    case 1:
                        console.log('user wants to take a photo');
                        return;
                    case 2:
                        console.log('user wants to get their location');
                        return this.getLocation();
                    default:
                }
            },
        );
    };

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        try {
            if (status === "granted") {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "Images",
                }).catch((error) => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    uploadImageFetch = async (uri) => {
        const blob = await new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                res(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                rej(new TypeError("Network request filed!"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imgNameBefore = uri.split("/");
        const imgName = imgNameBefore[imgNameBefore.length - 1];

        // Create a reference to the firebase storage
        const ref = firebase.storage().ref().child(`images/${imgName}`);
        const snapshot = await ref.put(blob);

        //close connection
        blob.close();

        return await snapshot.ref.getDownloadURL();
    };

    getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
                const result = await Location.getCurrentPositionAsync({}).catch(
                    (error) => console.log(error)
                );
                const longitude = JSON.stringify(result.coords.longitude);
                const latitude = JSON.stringify(result.coords.latitude);
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: longitude,
                            latitude: latitude,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    render() {
        return (
            <View>
                <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Click here for other options"
                    accessibilityHint="Here you can send your location or images."
                    style={styles.container}
                    onPress={this.onActionPress}
                >
                    <View style={[styles.wrapper, this.props.wrapperStyle]}>
                        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};