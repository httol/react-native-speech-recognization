//
//  Dictation.swift
//  Dictation
//
//  Created by 丁建群 on 2020/12/7.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import Speech

@objc(Dictation)
@available(iOS 10.0, *)
class Dictation: RCTEventEmitter {
    let audioEngine = AVAudioEngine()
    let speechRecognizer: SFSpeechRecognizer? = SFSpeechRecognizer(locale:Locale.init(identifier: "zh-cn"))
    let requestAudio = SFSpeechAudioBufferRecognitionRequest()
    var recognitionTask:SFSpeechRecognitionTask?
    
    var isRecording = false
    
    var hasListener = false
    
    var emitter: Dictation!
    
    override init() {
        super.init()
        self.emitter = self
    }
    
    open override func supportedEvents() -> [String] {
        ["onStart","onSuccess","onFailure"]
    }
    
    override func startObserving() {
        hasListener = true
    }
    
    override func stopObserving() {
        hasListener = false
    }
    
    @objc
    func isSupport(_ resolve:RCTPromiseResolveBlock ,rejecter reject:RCTPromiseRejectBlock) -> Void{
        let myRecognizer = SFSpeechRecognizer()
        if myRecognizer == nil || !myRecognizer!.isAvailable {
            let errorMsg = "Device Unsupport, make sure your iPhone version >= 10.0"
            let err: NSError = NSError(domain: errorMsg, code: 0, userInfo: nil)
            reject("Unsupport!!!", errorMsg, err)
        } else {
            resolve(true)
        }
    }
    
    @objc
    func startRecord() -> Void {
        if self.isRecording {
            return
        }
        
        if self.hasListener {
            self.emitter.sendEvent(withName: "onStart", body: nil)
        }
        
        self.isRecording = true
        let node = self.audioEngine.inputNode
        
        let recordingFormat = node.outputFormat(forBus: 0)
        node.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat){buffer, _ in self.requestAudio.append(buffer)}
        
        self.audioEngine.prepare()
        do{
            try self.audioEngine.start()
        }
        catch
        {
           
        }
        
        let myRecognizer = SFSpeechRecognizer()
        if myRecognizer == nil {
            return
        }
        if !myRecognizer!.isAvailable {
            return
        }
        
        recognitionTask = speechRecognizer?.recognitionTask(with: requestAudio,resultHandler: {result ,error in
            if let result = result {
                let bestString = result.bestTranscription.formattedString
                if self.hasListener {
                    self.emitter.sendEvent(withName: "onSuccess", body: bestString)
                }
            } else if let error = error {
                if self.hasListener {
                    self.emitter.sendEvent(withName: "onFailure", body: error)
                    self.endRecord()
                }
            }
        })
    }
    
    @objc
    func endRecord() -> Void {
        if self.isRecording {
            recognitionTask?.finish()
            recognitionTask = nil
            
            requestAudio.endAudio()
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)

            self.isRecording = false
        }
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
