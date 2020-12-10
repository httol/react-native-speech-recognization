package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.huawei.hiai.asr.AsrRecognizer;
import com.reactlibrary.util.StoragePermission;
//import com.huawei.hiai.asr.AsrConstants; // 参数常量的定义类
//import com.huawei.hiai.asr.AsrError; // 错误码的定义类
//import com.huawei.hiai.asr.AsrListener; // 加载语音识别监听类
//import com.huawei.hiai.asr.AsrRecognizer; // 加载语音识别类

public class DictationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    public static final Integer RecordAudioRequestCode = 1;
    private static final String TAG = "MainActivity";
    private AsrRecognizer mAsrRecognizer;

    public DictationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Dictation";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        StoragePermission.getAllPermission(reactContext.getCurrentActivity());
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void startRecord(){
        StoragePermission.getAllPermission(reactContext.getCurrentActivity());
//        mAsrRecognizer = AsrRecognizer.createAsrRecognizer(this);
    }
}
