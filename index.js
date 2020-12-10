import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter,
     NativeEventEmitter, 
    NativeModules, 
    Platform,
    View,
    Text, 
    Button,
Image, 
TouchableWithoutFeedback,
TouchableNativeFeedback,
TextInput,StyleSheet, Modal, Keyboard} from "react-native";
import TimerButton from "./src/TimerButton";
const { Dictation } = NativeModules;

export const dictationEvent={
    onStart:"onStart",
    onEnd:"onEnd",
    onSuccess:"onSuccess",
    onFailure:"onFailure",
}

let subscription;
export const RNDictation = {
  startRecord() {
    Dictation.startRecord();
  },
  endRecord() {
    Dictation.endRecord();
  },
  addEventListener(event, callback) {
    const DictationEmitter = Platform.OS === "ios" ? new NativeEventEmitter(Dictation) : DeviceEventEmitter;
    switch (event) {
      case dictationEvent.onStart:
          subscription = DictationEmitter.addListener(dictationEvent.onStart,(e)=>
            callback(e)
          )
        break;
        case dictationEvent.onEnd:
          subscription = DictationEmitter.addListener(dictationEvent.onEnd,(e)=>
            callback(e)
          )
        break;
      case dictationEvent.onSuccess:
            subscription = DictationEmitter.addListener(dictationEvent.onSuccess, (e) =>
                callback(e)
            );
         break;
      case dictationEvent.onFailure:
            subscription = DictationEmitter.addListener(dictationEvent.onFailure, (e) =>
               callback(e)
            );
            break;
      default:
        break;
    }
  },
  removeEventListener(event) {
      switch(event){
        case dictationEvent.onSuccess:
            subscription?.remove();
            break;
        case dictationEvent.onStart:
            subscription?.remove();
            break;
        case dictationEvent.onEnd:
            subscription?.remove();
            break;
        case dictationEvent.onFailure:
            subscription?.remove();
            break;
        default:
            break;
      }
  }
};

export const DictationPanel = ()=>{
    
    const [message,setMessage] = useState();
    const [visible,setVisible] = useState(undefined);
    const [starting,setStarting] = useState(undefined);
    
    useEffect(()=>{
        if(starting === true){
            startRecord();
        } else if(starting === false) {
            stopRecord();
        }
    },[starting]);

    useEffect(()=>{
        if(visible === false){
           if(starting){
               console.log("stop")
               stopRecord();
           }
        }
    },[visible])

    const startRecord = ()=>{
        RNDictation.addEventListener(dictationEvent.onSuccess,(text)=>{
                setMessage(text)
            });
        RNDictation.startRecord();
    }

    const stopRecord=()=>{
        RNDictation.endRecord();
        RNDictation.removeEventListener(dictationEvent.onSuccess);
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
        console.log('onStart')
        setMessage('');
        setStarting(true);
    }

    const onClose=()=>{
        console.log('onClose')
        setStarting(false);
    }

    const onRequestClose=()=>{
    }

    return <View style={{position:'absolute',top:30}} >
        <TouchableNativeFeedback onPress={show} title="Start">
           <Image style={{width:20,height:30}} source={require('./asserts/icons/micro.png')}/>
        </TouchableNativeFeedback>
        <Modal transparent={true} animationType='slide' visible={visible===true} {...{onRequestClose}}>
             <>
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <View style={{position:'absolute',...StyleSheet.absoluteFillObject,backgroundColor:'black',opacity:.3}}></View>
                </TouchableWithoutFeedback>
                <View style={{padding:20,position:'absolute',height:'45%',borderTopLeftRadius:20,borderTopRightRadius:20,bottom:0,justifyContent:'flex-start',backgroundColor:'white',width:'100%',}}> 
                    <View style={{flex:1}}>
                        <TextInput 
                            value={message}  
                            style={{fontSize:16,height:'100%'}}
                            placeholder={starting?"请说，我在聆听...":"点击麦克风，开始说话..."}
                            editable={false} 
                            numberOfLines={10}
                            multiline={true}/>
                    </View>
                    <TimerButton style={{alignSelf:'center'}} timeout={20} active={starting} {...{onStart}} {...{onClose}}/>
                </View>
              </>
        </Modal>
    </View>
}
