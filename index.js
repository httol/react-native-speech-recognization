import { DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from "react-native";
const { Dictation } = NativeModules;

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
      case "onFailure":
        subscription = DictationEmitter.addListener("onFailure", (e) =>
          callback(e)
        );
        break;
      case "onSuccess":
        subscription = DictationEmitter.addListener("onSuccess", (e) =>
          callback(e)
        );
        break;
      default:
        break;
    }
  },
  removeEventListener() {
    if (subscription) {
      subscription.remove();
    }
  },
};
