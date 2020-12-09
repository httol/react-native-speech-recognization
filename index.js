import React, { useEffect, useState } from 'react';
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
  removeEventListener() {
      if(subscription){
        this.endRecord();
        subscription.remove();
      }
  }
};

export const DictationPanel = ()=>{
    const [message,setMessage] = useState();
    const [visible,setVisible] = useState(false);
    const [starting,setStarting] = useState(false);

    const show=()=>{
        setVisible(true);
    }

    useEffect(()=>{
        setMessage();
        setStarting(false);
    },[])

    useEffect(()=>{
        RNDictation.startRecord();
        RNDictation.addEventListener(dictationEvent.onStart,()=>{
            setStarting(true)
        });
        RNDictation.addEventListener(dictationEvent.onEnd,()=>{
            setStarting(false)
        });
        RNDictation.addEventListener(dictationEvent.onSuccess,(text)=>{
            setMessage(text)
        });
        return ()=>{
            RNDictation.removeEventListener();
        }
    },[])

    return <View style={{position:'absolute',top:30}} >
        <TouchableNativeFeedback onPress={show} title="Start">
           <Image style={{width:20,height:30}} source={require('./asserts/icons/micro.png')}/>
        </TouchableNativeFeedback>
        <Modal transparent={true} animationType='slide' visible={visible}>
             <>
                <TouchableWithoutFeedback onPress={()=>{
                        setVisible(false)
                }}>
                    <View style={{position:'absolute',...StyleSheet.absoluteFillObject,backgroundColor:'black',opacity:.3}}></View>
                </TouchableWithoutFeedback>
                <View style={{padding:20,position:'absolute',height:'45%',borderTopLeftRadius:20,borderTopRightRadius:20,bottom:0,justifyContent:'flex-start',backgroundColor:'white',width:'100%',}}> 
                    <TextInput 
                        value={message}  
                        style={{fontSize:16}}
                        placeholder={'Please say...'}
                        editable={false} 
                        multiline={true}/>
                    {/* <Text>{starting?'start':'end'}</Text> */}
                </View>
              </>
        </Modal>
    </View>
}
