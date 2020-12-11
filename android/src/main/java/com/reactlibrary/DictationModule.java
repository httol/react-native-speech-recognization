package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.huawei.hiai.asr.AsrConstants;
import com.huawei.hiai.asr.AsrError;
import com.huawei.hiai.asr.AsrListener;
import com.huawei.hiai.asr.AsrRecognizer;
import com.reactlibrary.util.StoragePermission;
import com.reactlibrary.util.Util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static com.facebook.react.modules.core.DeviceEventManagerModule.*;

public class DictationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private DictationAsrListener mMyAsrListener = new DictationAsrListener();
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

    /**
     * 调用asr的startListening接口
     */
    @ReactMethod
    private void startRecord() {
        Activity currentActivity = reactContext.getCurrentActivity();
        StoragePermission.getAllPermission(currentActivity);
        if(mAsrRecognizer == null){
            mAsrRecognizer = AsrRecognizer.createAsrRecognizer(currentActivity);
        }

        if (Util.isSupportAsr(currentActivity)) {
            /*配置语音的输入来源:
            ASR_SRC_TYPE_FILE——语音输入来自文件；
            ASR_SRC_TYPE_RECORD——语音输入来自mic录入；
            ASR_SRC_TYPE_PCM——语音输入来自PCM数据流；
            */
            initEngine(AsrConstants.ASR_SRC_TYPE_RECORD);
        } else {
            Log.e(TAG, "not support asr!");
        }


        Intent intent = new Intent();//初始化引擎
        /*设置VAD（Voice Activity Detection）时间
        ASR_VAD_END_WAIT_MS后置VAD时间，检查到说话停止时间达到vad时间，识别停止
        ASR_VAD_FRONT_WAIT_MS前置VAD时间，检查识别开始后没有说话达到vad时间，识别停止
        */
        intent.putExtra(AsrConstants.ASR_VAD_END_WAIT_MS, 4000);
        intent.putExtra(AsrConstants.ASR_VAD_FRONT_WAIT_MS, 6000);
        intent.putExtra(AsrConstants.ASR_TIMEOUT_THRESHOLD_MS, 20000);

        if (mAsrRecognizer != null) {
            mAsrRecognizer.startListening(intent);
            reactContext.getJSModule(RCTDeviceEventEmitter.class).emit("onStart", null);
        }
    }

    @ReactMethod
    private void endRecord() {
        Log.d(TAG, "endRecord() ");
        if (mAsrRecognizer != null) {
            mAsrRecognizer.stopListening();
            reactContext.getJSModule(RCTDeviceEventEmitter.class).emit("onEnd", null);
        }
    }

    @ReactMethod
    private void isSupport(Promise promise){
        try {
            Activity currentActivity = reactContext.getCurrentActivity();
            boolean result = Util.isSupportAsr(currentActivity);
            promise.resolve(true);
        }catch (Exception e){
            promise.reject(e.getMessage());
        }

    }

//    @Override
//    public Map<String, Object> getConstants() {
//        final Map<String, Object> constants = new HashMap<>();
//        constants.put("DEFAULT_EVENT_NAME", "New Event");
//        return constants;
//    }

    /**
     * 初始化引擎
     *
     * @param srcType 数据源类型
     */
    private void initEngine(int srcType) {
        Log.d(TAG, "initEngine() srcType" + srcType);
        Intent initIntent = new Intent();
        initIntent.putExtra(AsrConstants.ASR_AUDIO_SRC_TYPE, srcType);
        initIntent.putExtra(AsrConstants.ASR_VAD_END_WAIT_MS, 2000); // 设置前置vad时间
        initIntent.putExtra(AsrConstants.ASR_VAD_FRONT_WAIT_MS, 4000); // 设置后置vad时间
        if (mAsrRecognizer != null) {
            mAsrRecognizer.init(initIntent, mMyAsrListener);
        }
    }

    private class DictationAsrListener implements AsrListener {
        private  String TAG = "DictationAsrListener";
        @Override
        public void onInit(Bundle params) {
            Log.d(TAG, "onInit()");
            int result = params.getInt(AsrConstants.ASR_ERROR_CODE, -1);
            if (result != 0) {
                // 初始化失败
                return;
            }
        }

        @Override
        public void onBeginningOfSpeech() {
            Log.d(TAG, "onBeginningOfSpeech() called");
        }

        @Override
        public void onRmsChanged(float rmsdB) {
            Log.d(TAG, "onRmsChanged() called with: rmsdB = [" + rmsdB + "]");
        }

        @Override
        public void onBufferReceived(byte[] buffer) {
            Log.d(TAG, "onBufferReceived() called with: buffer = [" + buffer + "]");
        }

        @Override
        public void onEndOfSpeech() {
            Log.d(TAG, "onEndOfSpeech: ");
        }

        @Override
        public void onError(int error) {
            Log.d(TAG, "onError() called with: error = [" + error + "]");
            if (error == AsrError.SUCCESS) {
                return;
            }
            if (error == AsrError.ERROR_CLIENT_INSUFFICIENT_PERMISSIONS) {
                Toast.makeText(reactContext.getApplicationContext(), "请在设置中打开麦克风权限!", Toast.LENGTH_LONG).show();
            }
        }

        @Override
        public void onRecordStart() {
            Log.d(TAG, "onRecordStart");
        }

        @Override
        public void onRecordEnd() {
            Log.d(TAG, "onRecordEnd");
        }

        @Override
        public void onResults(Bundle results) {
            Log.d(TAG, "onResults() called with: results = [" + results + "]");
            endRecord();
            getOnResult(results, AsrConstants.RESULTS_RECOGNITION);
        }

        @Override
        public void onPartialResults(Bundle partialResults) {
            Log.d(TAG, "onPartialResults() called with: partialResults = [" + partialResults + "]");
            getOnResult(partialResults, AsrConstants.RESULTS_PARTIAL);
        }

        @Override
        public void onEnd() {
            Log.d(TAG, "onEnd()");
        }

        @Override
        public void onEvent(int eventType, Bundle params) {
            Log.d(TAG, "onEvent() called with: eventType = [" + eventType + "], params = [" + params + "]");
        }

        @Override
        public void onLexiconUpdated(String s, int i) {

        }
    }

    private String getOnResult(Bundle partialResults, String key) {
        String json = partialResults.getString(key);
        final StringBuilder sb = new StringBuilder();
        try {
            JSONObject result = new JSONObject(json);
            JSONArray items = result.getJSONArray("result");
            for (int i = 0; i < items.length(); i++) {
                String word = items.getJSONObject(i).getString("word");
                double confidences = items.getJSONObject(i).getDouble("confidence");
                sb.append(word);
            }
            Log.d(TAG, "getOnResult: " + sb.toString());
            reactContext.getJSModule(RCTDeviceEventEmitter.class)
                    .emit("onSuccess", sb.toString());
        } catch (JSONException exp) {
            Log.e(TAG, "JSONException: " + exp.toString());
        }
        return sb.toString();
    }

}
