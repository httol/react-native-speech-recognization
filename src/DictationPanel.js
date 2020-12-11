import React, { useState } from 'react';
import { 
    View,
    Image, 
    TouchableNativeFeedback,
    TextInput,StyleSheet, Modal} from "react-native";
import TimerButton from "./TimerButton";
import {RNDictation,dicEvent} from '../lib';
import DictationButton from "./DictationButton";
// import DictationButton from "./DictationButton";

export const DictationPanel = ({style,onStartRecord,onEndRecord,onComplete})=>{
    const [message,setMessage] = useState();
    const [visible,setVisible] = useState(undefined);
    const [starting,setStarting] = useState(undefined);
    
    const startRecord = ()=>{
        RNDictation.startRecord();
        RNDictation.addEventListener(dicEvent.onSuccess,(text)=>{setMessage(text)});
        RNDictation.addEventListener(dicEvent.onEnd,onEnd);
    }

    const stopRecord=()=>{
        RNDictation.endRecord();
        RNDictation.removeEventListener(dicEvent.onSuccess);
        RNDictation.removeEventListener(dicEvent.onEnd);
    }

    const onDismiss=()=>{
        setVisible(undefined);
        if(starting){
            stopRecord();
        }
    }    

    const show=()=>{
        setVisible(true);
        setMessage('');
    }

    const onStart=()=>{
        setMessage('');
        setStarting(true);
        startRecord();
        onStartRecord && onStartRecord();
    }

    const onEnd=()=>{
        setStarting(false);
        stopRecord();
        onEndRecord && onEndRecord();
    }

    const clear=()=>{
        setMessage('')
    }

    const onConfirm=()=>{
        if(message){
            onComplete && onComplete(message);
        }
        setVisible(false);
    }

    const onRequestClose=()=>{
    }

    return (
        <View style={style} >
            <TouchableNativeFeedback onPress={show} title="Start">
                <Image style={{width:20,height:30}} source={require('../asserts/icons/micro.png')}/>
            </TouchableNativeFeedback>
            <Modal transparent={true} animationType='slide' visible={visible===true} {...{onRequestClose}}>
                <>
                    <TouchableNativeFeedback onPress={onDismiss}>
                        <View style={{position:'absolute',...StyleSheet.absoluteFillObject,backgroundColor:'black',opacity:.3}}></View>
                    </TouchableNativeFeedback>
                    <View style={{paddingHorizontal:20,paddingVertical:10,position:'absolute',height:'45%',borderTopLeftRadius:20,borderTopRightRadius:20,bottom:0,justifyContent:'flex-start',backgroundColor:'white',width:'100%',}}> 
                        <View style={{flex:1,}}>
                            <TextInput 
                                value={message}  
                                style={{textAlignVertical:'top',fontSize:16,height:'100%',includeFontPadding:false}}
                                placeholder={starting?"请说，我在聆听...":"点击麦克风，开始说话..."}
                                editable={false} 
                                numberOfLines={10}
                                multiline={true}/>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <DictationButton onPress={clear} text="清空"/> 
                            <TimerButton style={{alignSelf:'center'}} active={starting}  {...{onStart}} {...{onEnd}}/>
                            <DictationButton onPress={onConfirm} text="确定"/> 
                        </View>
                    </View>
                </>
            </Modal>
        </View>
    )
}