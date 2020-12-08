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
    let request = SFSpeechAudioBufferRecognitionRequest()
    var recognitionTask:SFSpeechRecognitionTask?
    
    var isRecording = false
    
    var hasListener = false
    
    var emitter: Dictation!
    
    override init() {
        super.init()
        self.emitter = self
    }
    
    open override func supportedEvents() -> [String] {
        ["onStart","onEnd","onSuccess","onFailure"]
    }
    
    override func startObserving() {
        hasListener = true
    }
    
    override func stopObserving() {
        hasListener = false
    }
    
    @objc
    func startRecord() -> Void {
        if self.isRecording {
            return
        }
        self.isRecording = true
        let node = self.audioEngine.inputNode
        
        let recordingFormat = node.outputFormat(forBus: 0)
        node.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat){buffer, _ in self.request.append(buffer)}
        
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
        
        recognitionTask = speechRecognizer?.recognitionTask(with: request,resultHandler: {result ,error in
            var isFinal = false
            if let result = result {
                let bestString = result.bestTranscription.formattedString
                if self.hasListener {
                    self.emitter.sendEvent(withName: "onSuccess", body: bestString)
                }
                isFinal = result.isFinal
            } else if let error = error {
                if self.hasListener {
                    self.emitter.sendEvent(withName: "onFailure", body: error)
                    self.endRecord()
                }
            }
            if error != nil || isFinal {
                self.endRecord()
            }
        })
    }
    
    @objc
    func endRecord() -> Void {
        if self.isRecording {
            audioEngine.inputNode.removeTap(onBus: 0)
            audioEngine.stop()
            recognitionTask?.cancel()
            self.isRecording = false
        }
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
