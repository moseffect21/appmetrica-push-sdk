import Foundation
import React
import AppMetricaPush
import UserNotifications


@objc(AppMetricaPushModule)
class AppMetricaPushModule: NSObject, RCTBridgeModule {
    
    // MARK: - RCTBridgeModule Protocol
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    static func moduleName() -> String! {
        return "AppMetricaPushModule"
    }
    
    // MARK: - Initialization (Deprecated - use AppMetricaPushInitializer)
    
    @objc
    func initialize(_ config: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let debugMode = config["debugMode"] as? Bool ?? false
        
        DispatchQueue.main.async {
            do {
                // Выполняем инициализацию
                self.performInitialization(config: config, debugMode: debugMode, resolver: resolver, rejecter: rejecter)
                
            } catch {
                rejecter("INIT_ERROR", error.localizedDescription, error)
            }
        }
    }
    
    private func performInitialization(config: NSDictionary, debugMode: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            // 1. Настройка App Group если указан
            if let appGroup = config["appGroup"] as? String {
                AppMetricaPush.setExtensionAppGroup(appGroup)
                if debugMode {
                    print("App Group set: \(appGroup)")
                }
            }
            
            // 2. Инициализация AppMetrica Push SDK
            AppMetricaPush.handleApplicationDidFinishLaunching(options: nil)
            
            // 3. Настройка push-уведомлений
            self.setupPushNotifications(debugMode: debugMode)
            
            // 4. Настройка автоматической обработки push-уведомлений
            self.setupNotificationDelegate()
            
            if debugMode {
                print("AppMetrica Push SDK initialized successfully from TypeScript")
            }
            
            resolver(true)
        } catch {
            rejecter("INIT_ERROR", error.localizedDescription, error)
        }
    }
    
    /**
     * Настройка push-уведомлений
     */
    private func setupPushNotifications(debugMode: Bool) {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.badge, .alert, .sound]) { (granted, error) in
            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
                
                if debugMode {
                    print("Push notification permissions granted")
                }
            } else {
                if debugMode {
                    print("Push notification permissions denied")
                }
            }
        }
    }
    
    /**
     * Настройка автоматической обработки push-уведомлений
     */
    private func setupNotificationDelegate() {
        let delegate = AppMetricaPush.userNotificationCenterDelegate
        UNUserNotificationCenter.current().delegate = delegate
    }
    
    
    // MARK: - Notification Analysis
    
    @objc
    func isNotificationFromAppMetrica(_ notification: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            // Преобразуем NSDictionary в [AnyHashable : Any] для AppMetrica
            let notificationDict = notification as? [AnyHashable : Any] ?? [:]
            let isRelatedToAppMetricaSDK = AppMetricaPush.isNotificationRelated(toSDK: notificationDict)
            resolver(isRelatedToAppMetricaSDK)
        }
    }
    
    // MARK: - SDK Information
    
    @objc
    func getSDKInfo(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let info: [String: Any] = [
                "version": "3.2.0",
                "platform": "ios",
                "sdkName": "AppMetrica Push SDK",
                "libraryVersion": "1.0.0"
            ]
            resolver(info)
        }
    }
    
    // MARK: - User Data Extraction
    
    @objc
    func getUserData(_ notification: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            // Преобразуем NSDictionary в [AnyHashable : Any] для AppMetrica
            let notificationDict = notification as? [AnyHashable : Any] ?? [:]
            // Получаем дополнительную информацию из push-уведомления согласно документации
            let userData = AppMetricaPush.userData(forNotification: notificationDict)
            resolver(userData)
        }
    }
    
    // MARK: - Device Token Registration
    
    @objc
    func registerDeviceToken(_ deviceToken: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                // Преобразуем строку в Data
                // Для обычных строк используем UTF-8 кодировку
                guard let tokenData = deviceToken.data(using: .utf8) else {
                    rejecter("INVALID_TOKEN", "Failed to convert device token string to Data", nil)
                    return
                }
                
                AppMetricaPush.setDeviceTokenFrom(tokenData)
                
                resolver(true)
            } catch {
                rejecter("REGISTRATION_ERROR", error.localizedDescription, error)
            }
        }
    }
    
    
}

