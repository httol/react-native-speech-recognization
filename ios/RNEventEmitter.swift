//
//  RNEventEmitter.swift
//  Dictation
//
//  Created by 丁建群 on 2020/12/8.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(RNEventEmitter)
open class RNEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    RNEventEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["onReady", "onPending", "onFailure"]
  }
}
