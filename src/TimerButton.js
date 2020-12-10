import React, { useEffect, useRef } from 'react';
import { Text, View,StyleSheet, TouchableNativeFeedback, Image } from 'react-native';


const useInterval = (callback, delay) => {
  const savedCallbackRef = useRef();

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => savedCallbackRef.current(...args);

    if (delay !== null) {
      const intervalId = setInterval(handler, delay);
      return () => {
          clearInterval(intervalId)
      };
    }
  }, [delay]);
};


const initialState = {count:60}

const reducer = (state,action)=>{
    switch(action.type){
        case "decrement":
            return { count: state.count - 1 }; 
        case "reset":
            return { count: 0};
        default:
            throw new Error();
    }
}

const TimerButton = ({
    onStart,
    onClose,
    timeout,
    style
}) => {
    const [count, setCount] = React.useState(timeout);
    const [active, setActive] = React.useState(undefined);
    
    useInterval(()=>{
        if(active === false){
            return;
        } else if(active === true){
            setCount(currentCount=>currentCount-1);
        }
    },1000)

    const toggle=()=>{
        setActive(!active)
    }

    useEffect(()=>{
        if(active === true){
            onStart&&onStart();
        }else if(active === false){
            setCount(timeout)
            onClose&&onClose();
        }
    },[active]);

    useEffect(()=>{
        if(count === 0){
            setCount(timeout)
            setActive(false);
        }
    },[count]);

    return (
        <View {...{style}} >
            <TouchableNativeFeedback style={{flex:1,alignItems:'stretch'}} onPress={toggle}>
                {active && count>0?(<View style={styles.container}>
                    <Image style={{width:20,height:30,tintColor:'blue'}} source={require('../asserts/icons/micro.png')}/>
                 </View>):
                 (<View style={styles.container}>
                    <Image style={{width:20,height:30,tintColor:'red'}} source={require('../asserts/icons/micro.png')}/>
                 </View>)}
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:50,
        height:50,
        backgroundColor:'yellow',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default TimerButton;
