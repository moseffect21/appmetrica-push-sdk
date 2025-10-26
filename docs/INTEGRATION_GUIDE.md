# AppMetrica Push SDK - Интеграция

## 🚀 Быстрая установка

### 1. Установка библиотеки

```bash
# Через npm
npm install @moseffect21/appmetrica-push-sdk@git+https://github.com/moseffect21/appmetrica-push-sdk.git

# Через yarn
yarn add @moseffect21/appmetrica-push-sdk@git+https://github.com/moseffect21/appmetrica-push-sdk.git
```

### 2. Настройка зависимостей

#### Android

**Зависимости AppMetrica Push SDK устанавливаются автоматически через библиотеку.**

Убедитесь, что в основном проекте есть Firebase зависимости:

```gradle
dependencies {
    // Firebase Cloud Messaging (требуется для основного проекта)
    implementation platform('com.google.firebase:firebase-bom:33.2.0')
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'com.google.firebase:firebase-messaging-ktx'
}
```

#### iOS

Зависимости `AppMetricaPush` и `AppMetricaPushLazy` устанавливаются автоматически через Podspec библиотеки.

```bash
cd ios && pod install
```

## 📱 Настройка нативного кода

### iOS (AppDelegate.swift)

```swift
// AppDelegate.swift - минимальная настройка
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    // AppMetrica Push SDK инициализируется через TypeScript
    // после инициализации основной AppMetrica

    return true
}
```

### Android

**Инициализация происходит автоматически через React Native модуль при вызове `AppMetricaPush.initialize()` в JavaScript коде.**

## 💻 Использование в React Native

```typescript
import { Platform } from "react-native";
import {
  AppMetricaPush,
  registerDeviceToken,
} from "@moseffect21/appmetrica-push-sdk";

// Инициализация с автоматической регистрацией APNs токена для iOS
await AppMetricaPush.initialize({
  debugMode: __DEV__,
  apnsToken: Platform.OS === "ios" ? await getAPNsToken() : undefined, // Только для iOS
  appGroup: undefined, // Только для iOS
});

// Дополнительная регистрация device token (если нужна)
const deviceToken = await getDeviceToken(); // Ваш метод получения токена
await registerDeviceToken(deviceToken);

// Проверка уведомления
const isFromAppMetrica = await AppMetricaPush.isNotificationFromAppMetrica(
  notification
);

// Получение информации о SDK
const sdkInfo = await AppMetricaPush.getSDKInfo();

// Извлечение пользовательских данных
const userData = await AppMetricaPush.getUserData(notification);
```

### Различия между платформами

- **iOS**: Инициализация происходит через React Native модуль при вызове `AppMetricaPush.initialize()`
- **Android**: Инициализация происходит через React Native модуль при вызове `AppMetricaPush.initialize()`
- **Обе платформы**: Device token передается через TypeScript метод `registerDeviceToken()`

### Параметры конфигурации

- **`debugMode`**: Включает отладочные сообщения (по умолчанию `false`)
- **`apnsToken`**: APNs device token для автоматической регистрации на iOS (опционально)
- **`appGroup`**: App Group для расширений iOS (опционально)

## 🔧 Дополнительные настройки

### Настройка AndroidManifest.xml (Android)

Библиотека включает компоненты для обработки push уведомлений. Добавьте следующие регистрации в `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- Silent Push Receiver для AppMetrica Push SDK -->
    <receiver android:name="com.appmetricapush.SilentPushReceiver"
              android:exported="false">
        <intent-filter>
            <action android:name="com.appmetricapush.action.ymp.SILENT_PUSH_RECEIVE"/>
        </intent-filter>
    </receiver>

    <!-- Firebase Messaging Service для интеграции с AppMetrica Push SDK -->
    <service android:name="com.appmetricapush.FirebaseMessagingMainService"
             android:enabled="true"
             android:exported="false">
        <intent-filter android:priority="100">
            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
        </intent-filter>
    </service>

    <!-- Отключаем стандартный AppMetrica Messaging Service -->
    <service android:name="io.appmetrica.analytics.push.provider.firebase.AppMetricaMessagingService"
             android:enabled="false"
             tools:node="remove"/>

    <!-- Иконка уведомлений по умолчанию для AppMetrica Push SDK -->
    <meta-data android:name="io.appmetrica.analytics.push.default_notification_icon"
               android:resource="@drawable/ic_stat_notification"/>
</application>
```

### Silent Push уведомления

Библиотека автоматически обрабатывает silent push уведомления от AppMetrica:

- ✅ **SilentPushReceiver** - автоматически получает и обрабатывает silent push
- ✅ **Логирование** - все silent push события логируются
- ✅ **Интеграция с AppMetrica** - полная совместимость с AppMetrica Push SDK

### Настройка Firebase (Android)

1. Добавьте `google-services.json` в `android/app/`
2. Включите Firebase в `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### Настройка APNs (iOS)

1. Включите Push Notifications в Xcode
2. Настройте сертификаты в Apple Developer Console

## 📚 API Reference

### Основные методы

- `initialize(config)` - Инициализация SDK
- `isNotificationFromAppMetrica(notification)` - Проверка уведомления
- `getSDKInfo()` - Информация о SDK
- `getUserData(notification)` - Пользовательские данные

### Утилиты

- `initializeAppMetricaPush(config)` - Инициализация с проверками
- `isSDKInitialized()` - Проверка инициализации
- `getCurrentConfig()` - Текущая конфигурация

## 🐛 Troubleshooting

### Частые проблемы

1. **"AppMetricaPushModule is not available"**

   - Проверьте, что библиотека правильно установлена
   - Выполните `cd ios && pod install` (iOS)
   - Пересоберите проект

2. **Push-уведомления не приходят**

   - Проверьте настройки Firebase/APNs
   - Убедитесь, что device token регистрируется
   - Проверьте логи в консоли

3. **Ошибки компиляции**
   - Очистите кэш: `npx react-native start --reset-cache`
   - Пересоберите проект полностью

## 📞 Поддержка

- GitHub: [moseffect21/appmetrica-push-sdk](https://github.com/moseffect21/appmetrica-push-sdk)
- Документация: [AppMetrica Push SDK](https://appmetrica.yandex.ru/docs/mobile-sdk-dg/push-sdk/about.html)
