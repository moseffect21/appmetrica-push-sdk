# @moseffect21/appmetrica-push-sdk

React Native библиотека для интеграции с Yandex AppMetrica Push SDK.

## 📚 Документация

- [Интеграционный гайд](./docs/INTEGRATION_GUIDE.md) - подробное руководство по интеграции
- [Настройка APNS токена для iOS](./docs/IOS_APNS_SETUP.md) - обязательная настройка для iOS
- [Руководство для аналитиков](./docs/ANALYTICS_GUIDE.md) - настройка push кампаний

## 🚀 Установка

```bash
# Через npm
npm install @moseffect21/appmetrica-push-sdk@git+https://github.com/moseffect21/appmetrica-push-sdk.git

# Через yarn
yarn add @moseffect21/appmetrica-push-sdk@git+https://github.com/moseffect21/appmetrica-push-sdk.git
```

## ⚡ Быстрый старт

### 1. Настройка нативного кода

#### Android

**1. Настройка AndroidManifest.xml:**

Добавьте в `android/app/src/main/AndroidManifest.xml`:

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
</application>
```

**2. Инициализация:**

Инициализация происходит автоматически через React Native модуль.

### 2. Использование в React Native

```typescript
import { Platform } from "react-native";
import { getAPNSToken, getMessaging } from "@react-native-firebase/messaging";
import { AppMetricaPush } from "@moseffect21/appmetrica-push-sdk";

// Получение APNS токена для iOS
let apnsToken = "";
if (Platform.OS === "ios") {
  const messaging = getMessaging();
  apnsToken = (await getAPNSToken(messaging)) ?? "";
}

// Инициализация с APNS токеном для iOS
await AppMetricaPush.initialize({
  debugMode: __DEV__,
  apnsToken: Platform.OS === "ios" ? apnsToken : undefined,
});

// Проверка уведомления
const isFromAppMetrica = await AppMetricaPush.isNotificationFromAppMetrica(
  notification
);

// Получение информации о SDK
const sdkInfo = await AppMetricaPush.getSDKInfo();

// Извлечение пользовательских данных
const userData = await AppMetricaPush.getUserData(notification);
```

## 📱 API

### Основные методы

- `initialize(config)` - инициализация SDK
- `isNotificationFromAppMetrica(notification)` - проверка источника уведомления
- `getSDKInfo()` - получение информации о SDK
- `getUserData(notification)` - извлечение пользовательских данных

### Утилиты

- `initializeAppMetricaPush(config)` - инициализация с проверками
- `isSDKInitialized()` - проверка инициализации
- `getCurrentConfig()` - текущая конфигурация

### React Hook

- `useAppMetricaPush()` - хук для работы с SDK

## 🔧 Зависимости

### React Native

```bash
npm install @react-native-firebase/messaging
```

### Android (android/app/build.gradle)

```gradle
dependencies {
    // Firebase Cloud Messaging
    implementation platform('com.google.firebase:firebase-bom:33.2.0')
    implementation 'com.google.firebase:firebase-messaging'

    // AppMetrica Push SDK
    implementation("io.appmetrica.analytics:push:4.2.1")
    implementation("io.appmetrica.analytics:push-provider-firebase:4.2.1")
}
```

### iOS

```bash
cd ios && pod install
```

## ✨ Особенности

- ✅ **Автоматическая инициализация** - нативная инициализация для iOS, JS для Android
- ✅ **Silent Push поддержка** - автоматическая обработка silent push уведомлений
- ✅ **TypeScript поддержка** - полная типизация
- ✅ **Кросс-платформенность** - единый API для iOS и Android
- ✅ **Простая интеграция** - минимум настройки
- ✅ **Готовые компоненты** - SilentPushReceiver и FirebaseMessagingMainService

## 📋 Требования

- React Native >= 0.60.0
- Android API 21+
- iOS 11.0+

## 🐛 Troubleshooting

### Частые проблемы

1. **"AppMetricaPushModule is not available"**

   - Проверьте установку библиотеки
   - Выполните `cd ios && pod install` (iOS)
   - Пересоберите проект

2. **Push-уведомления не приходят**
   - Проверьте настройки Firebase/APNs
   - Убедитесь в правильной инициализации

## 🚀 Публикация

Для публикации пакета используйте готовые скрипты:

```bash
# Patch версия (1.0.0 -> 1.0.1)
npm run publish:patch

# Minor версия (1.0.0 -> 1.1.0)
npm run publish:minor

# Major версия (1.0.0 -> 2.0.0)
npm run publish:major
```

Подробное руководство: [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md)

## 📄 Лицензия

MIT

## 🔗 Ссылки

- [AppMetrica Push SDK](https://appmetrica.yandex.ru/docs/mobile-sdk-dg/push-sdk/about.html)
- [GitHub](https://github.com/moseffect21/appmetrica-push-sdk)
