import React from 'react';
import { StyleSheet,Text, TouchableWithoutFeedback, View } from 'react-native';

const DictationButton = ({
    onPress,
    text,
}) => (
    <View>
        <TouchableWithoutFeedback style={{flex:1,alignItems:'stretch'}} {...{onPress}}>
            <View style={{...styles.container,}}>
                <Text>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    </View>
);

const styles = StyleSheet.create({
    container:{
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default DictationButton;
