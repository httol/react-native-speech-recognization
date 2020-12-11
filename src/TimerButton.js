import React from 'react';
import { View,StyleSheet, TouchableNativeFeedback, Image } from 'react-native';

const TimerButton = ({
    onStart,
    onEnd,
    timeout,
    style,
    active
}) => {
    const _onStart=()=>{
        onStart&&onStart();
    }

    const _onEnd=()=>{
        onEnd && onEnd();
    }
    
    return (
        <View style={{...style,borderRadius:25}} >
            {active ?(<TouchableNativeFeedback  style={{flex:1,alignItems:'stretch',borderRadius:25}} onPress={_onEnd}>
                    <View style={{...styles.container,backgroundColor:'#5bd3c7',}}>
                        <Image style={{width:20,height:30,tintColor:'#fff'}} source={require('../asserts/icons/micro.png')}/>
                    </View>
                 </TouchableNativeFeedback>):
                 (<TouchableNativeFeedback onLongPress={_onStart} style={{flex:1,alignItems:'stretch'}}>
                    <View style={{...styles.container,backgroundColor:'#999',}}>
                        <Image style={{width:20,height:30,tintColor:'#ccc'}} source={require('../asserts/icons/micro.png')}/>
                    </View>
                 </TouchableNativeFeedback>)}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default TimerButton;
