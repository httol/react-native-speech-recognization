import { DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from "react-native";
const { Dictation } = NativeModules;

export const dictationEvent={
    onSuccess:"onSuccess",
    onFailure:"onFailure"
}

let subscription;
export default RNDictation = {
  startRecord() {
    Dictation.startRecord();
  },
  endRecord() {
    Dictation.endRecord();
  },
  addEventListener(event, callback) {
    const DictationEmitter = Platform.OS === "ios" ? new NativeEventEmitter(Dictation) : DeviceEventEmitter;
    switch (event) {
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
        subscription.remove();
      }
  }
};
