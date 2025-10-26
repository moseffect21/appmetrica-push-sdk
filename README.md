# @moseffect21/appmetrica-push-sdk

React Native библиотека для интеграции с Yandex AppMetrica Push SDK.

## Установка

```bash
npm install @moseffect21/appmetrica-push-sdk
# или
yarn add @moseffect21/appmetrica-push-sdk
```

## Зависимости

```bash
npm install @react-native-firebase/messaging
npm install @appmetrica/react-native-analytics
```

## Настройка

### Android

Добавьте в `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <receiver android:name="com.appmetricapush.SilentPushReceiver"
              android:exported="false">
        <intent-filter>
            <action android:name="com.appmetricapush.action.ymp.SILENT_PUSH_RECEIVE"/>
        </intent-filter>
    </receiver>

    <service android:name="com.appmetricapush.FirebaseMessagingMainService"
             android:enabled="true"
             android:exported="false">
        <intent-filter android:priority="100">
            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
        </intent-filter>
    </service>

    <service android:name="io.appmetrica.analytics.push.provider.firebase.AppMetricaMessagingService"
             android:enabled="false"
             tools:node="remove"/>
</application>
```

### iOS

```bash
cd ios && pod install
```

## Использование

```typescript
import { Platform } from "react-native";
import { getAPNSToken, getMessaging } from "@react-native-firebase/messaging";
import { AppMetrica } from "@appmetrica/react-native-analytics";
import { AppMetricaPush } from "@moseffect21/appmetrica-push-sdk";

// 1. Сначала активируем основную AppMetrica
AppMetrica.activate({
  apiKey: "YOUR_APPMETRICA_API_KEY",
});

// 2. Получение APNS токена для iOS
let apnsToken = "";
if (Platform.OS === "ios") {
  const messaging = getMessaging();
  apnsToken = (await getAPNSToken(messaging)) ?? "";
}

// 3. Инициализация Push SDK (ТОЛЬКО после AppMetrica.activate)
await AppMetricaPush.initialize({
  debugMode: __DEV__,
  apnsToken: Platform.OS === "ios" ? apnsToken : undefined,
});

// Проверка уведомления
const isFromAppMetrica = await AppMetricaPush.isNotificationFromAppMetrica(
  notification
);

// Получение пользовательских данных
const userData = await AppMetricaPush.getUserData(notification);
```

## API

- `initialize(config)` - инициализация SDK
- `isNotificationFromAppMetrica(notification)` - проверка источника уведомления
- `getUserData(notification)` - извлечение пользовательских данных
- `getSDKInfo()` - информация о SDK

## Требования

- React Native >= 0.60.0
- Android API 21+
- iOS 11.0+

## Лицензия

MIT
