import Foundation
import React
import YandexMobileMetricaPush

@objc(AppMetricaPushModule)
class AppMetricaPushModule: RCTEventEmitter {
    
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["PushTokenReceived", "PushMessageReceived", "PushOpened", "PushClicked"]
    }
    
    @objc
    func initialize(_ config: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let apiKey = config["apiKey"] as? String else {
            rejecter("INVALID_CONFIG", "API key is required", nil)
            return
        }
        
        let autoTracking = config["autoTracking"] as? Bool ?? true
        let debugMode = config["debugMode"] as? Bool ?? false
        
        DispatchQueue.main.async {
            // Инициализация YandexMobileMetricaPush
            YandexMobileMetricaPush.initialize(withApiKey: apiKey)
            
            if debugMode {
                print("AppMetrica Push initialized with API key: \(apiKey)")
            }
            
            resolver(true)
        }
    }
    
    @objc
    func getPushToken(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            if let token = YandexMobileMetricaPush.token() {
                let result: [String: Any] = [
                    "token": token,
                    "platform": "ios"
                ]
                resolver(result)
            } else {
                resolver(nil)
            }
        }
    }
    
    @objc
    func sendPushToken(_ token: String, options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            YandexMobileMetricaPush.setToken(token)
            resolver(true)
        }
    }
    
    @objc
    func handlePushMessage(_ message: NSDictionary, options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            if let messageId = message["messageId"] as? String {
                // Отправляем событие в AppMetrica
                YandexMobileMetricaPush.reportPushMessage(messageId)
            }
            resolver(true)
        }
    }
    
    @objc
    func reportPushOpen(_ messageId: String, action: String?, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            YandexMobileMetricaPush.reportPushOpen(messageId, action: action)
            resolver(true)
        }
    }
    
    @objc
    func reportPushClick(_ messageId: String, action: String?, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            YandexMobileMetricaPush.reportPushClick(messageId, action: action)
            resolver(true)
        }
    }
    
    @objc
    func isPushAvailable(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let available = YandexMobileMetricaPush.isPushAvailable()
            resolver(available)
        }
    }
    
    @objc
    func getSDKInfo(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let info: [String: Any] = [
                "version": "3.2.0",
                "platform": "ios"
            ]
            resolver(info)
        }
    }
}
