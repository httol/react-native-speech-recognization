package com.reactlibrary.util;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

public class Util {
    public static boolean isSupportAsr(Activity activity) {
        PackageManager packageManager = activity.getPackageManager();
        try {
            PackageInfo packageInfo = packageManager.getPackageInfo("com.huawei.hiai", 0);
            Log.d("Util", "Engine versionName: " + packageInfo.versionName + " ,versionCode: " + packageInfo.versionCode);
            if (packageInfo.versionCode <= 801000300) {
                return false;
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.d("Util", "not support asr");
            return false;
        }
        return true;
    }
}
