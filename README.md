# @moyka/appmetrica-push-sdk

React Native библиотека для интеграции с Yandex AppMetrica Push SDK.

## Документация

- [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) - подробное руководство по интеграции
- [docs/ANALYTICS_GUIDE.md](./docs/ANALYTICS_GUIDE.md) - руководство для аналитиков по настройке push кампаний
- [docs/SILENT_PUSH_SETUP.md](./docs/SILENT_PUSH_SETUP.md) - настройка silent push уведомлений

## Установка

```bash
yarn add file:./AppmetricaPushSdk
```

## Быстрый старт

### 1. Инициализация

```typescript
import { initializeAppMetricaPush } from '@moyka/appmetrica-push-sdk'

// Инициализация SDK
await initializeAppMetricaPush({
  debugMode: __DEV__,
})
```

### 2. Использование в компонентах

```typescript
import { useAppMetricaPush } from '@moyka/appmetrica-push-sdk'

const { isInitialized, sdkInfo } = useAppMetricaPush()
```

## API

### Функции

- `initializeAppMetricaPush(config)` - инициализация SDK
- `isNotificationFromAppMetrica(notification)` - проверка источника уведомления
- `getPushSDKInfo()` - получение информации о SDK
- `isSDKInitialized()` - проверка инициализации

### React Hook

- `useAppMetricaPush()` - хук для работы с SDK

### Типы

- `PushConfig` - конфигурация инициализации
- `SDKInfo` - информация о SDK
- `InitializationResult` - результат инициализации

## Особенности

- ✅ **Автоматическая настройка звука** уведомлений для Android 8.0+
- ✅ **Готовый FirebaseMessagingMainService** для интеграции с FCM
- ✅ **Автоматическое отслеживание** push событий
- ✅ **Поддержка Kotlin** для Android
- ✅ **TypeScript** поддержка

## Требования

- React Native >= 0.60.0
- Android API 21+
- iOS 11.0+

## Зависимости

Библиотека требует следующие зависимости в основном проекте:

### Android (android/app/build.gradle)

```gradle
dependencies {
    // Firebase Cloud Messaging
    implementation platform('com.google.firebase:firebase-bom:33.2.0')
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'com.google.firebase:firebase-messaging-ktx'

    // AppMetrica Push SDK
    implementation("io.appmetrica.analytics:push:4.2.1")
    implementation("androidx.legacy:legacy-support-v4:1.0.0")

    // AppMetrica Push SDK Firebase integration
    implementation("io.appmetrica.analytics:push-provider-firebase:4.2.1")
}
```

### iOS (ios/Podfile)

```ruby
pod 'AppMetricaPush', '~> 3.2.0'
pod 'AppMetricaPushLazy', '~> 3.2.0'
```

## Настройка AndroidManifest.xml

```xml
<application>
    <!-- Silent Push Receiver -->
    <receiver android:name="com.moykareactnative.SilentPushReceiver"
              android:exported="false">
        <intent-filter>
            <action android:name="com.moykareactnative.action.ymp.SILENT_PUSH_RECEIVE"/>
        </intent-filter>
    </receiver>

    <!-- Firebase Messaging Service -->
    <service android:name="com.appmetricapush.FirebaseMessagingMainService"
             android:enabled="true"
             android:exported="false">
        <intent-filter android:priority="100">
            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
        </intent-filter>
    </service>

    <!-- Отключаем стандартный AppMetrica Messaging Service -->
    <service android:name="io.appmetrica.analytics.push.provider.firebase.AppMetricaMessagingService"
             tools:node="remove"/>

    <!-- Иконка уведомлений -->
    <meta-data android:name="io.appmetrica.analytics.push.default_notification_icon"
               android:resource="@drawable/ic_stat_notification"/>
</application>
```

## Версии

- **AppMetrica Push SDK**: 4.2.1
- **Firebase BOM**: 33.2.0
- **Kotlin**: 2.1.20

## Лицензия

MIT
