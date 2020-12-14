import { 
    DeviceEventEmitter,
    NativeEventEmitter, 
    NativeModules, 
    Platform} from "react-native";
const { Dictation } = NativeModules;

export const dicEvent={
    onStart:"onStart",
    onSuccess:"onSuccess",
    onFailure:"onFailure",
}

let subscription;
export const RNDictation = {
    isSupport(){
        // Promise
        return Dictation.isSupport();
    },
    setLanguage(local){
        Dictation.setLanguage(local);
    },
    startRecord() {
        Dictation.startRecord();
    },
    endRecord() {
        Dictation.endRecord();
    },
    addEventListener(event, callback) {
        const DictationEmitter = Platform.OS === "ios" ? new NativeEventEmitter(Dictation) : DeviceEventEmitter;
        switch (event) {
            case dicEvent.onStart:
                subscription = DictationEmitter.addListener(dicEvent.onStart,(e)=>
                callback(e)
                )
            break;
            case dicEvent.onSuccess:
                subscription = DictationEmitter.addListener(dicEvent.onSuccess, (e) =>
                    callback(e)
                );
                break;
            case dicEvent.onFailure:
                subscription = DictationEmitter.addListener(dicEvent.onFailure, (e) =>
                    callback(e)
                );
                break;
            default:
            break;
        }
    },
    removeEventListener(event) {
        switch(event){
        case dicEvent.onSuccess:
            subscription?.remove();
            break;
        case dicEvent.onStart:
            subscription?.remove();
            break;
        case dicEvent.onFailure:
            subscription?.remove();
            break;
        default:
            break;
        }
    }
};