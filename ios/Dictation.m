#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Dictation,NSObject)
   RCT_EXTERN_METHOD(startRecord)
   RCT_EXTERN_METHOD(endRecord)
   RCT_EXTERN_METHOD(isSupport:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject)
   RCT_EXTERN_METHOD(setLanguage:(NSString)local)
@end

