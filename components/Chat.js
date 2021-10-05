import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

    render() {
        //gets props from start for name and bgColour
        let { name } = this.props.route.params;
        let bgColour = this.props.route.params.bgColour;

        this.props.navigation.setOptions({ title: name });

        return (
            <View style={[styles.mainContainer, { backgroundColor: bgColour }]} >
                <Text>Hello Chat!</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
});