# Интеграция AppMetrica Push SDK в основной проект

## Шаги интеграции

### 1. Установка библиотеки в основной проект

```bash
# В корне основного проекта
cd /Users/moseffect21/Documents/work/AlfaProjects/MoykaReactNative

# Установка локальной библиотеки
yarn add file:./AppmetricaPushSdk
```

### 2. Обновление зависимостей в основном проекте

#### Android (android/app/build.gradle)

**Добавьте следующие зависимости в основной проект:**

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

**Важно:** Библиотека `@moyka/appmetrica-push-sdk` использует `compileOnly` для Firebase зависимостей, поэтому они должны быть добавлены в основной проект.

#### iOS (ios/Podfile)

Убедитесь, что у вас есть зависимости:

```ruby
pod 'AppMetricaPush', '~> 3.2.0'
pod 'AppMetricaPushLazy', '~> 3.2.0'
```

Затем выполните:

```bash
cd ios && pod install
```

### 3. Настройка AndroidManifest.xml

#### Добавьте сервисы и ресиверы:

```xml
<application>
    <!-- Silent Push Receiver для AppMetrica Push SDK -->
    <receiver android:name="com.moykareactnative.SilentPushReceiver"
              android:exported="false">
        <intent-filter>
            <!-- Получение silent push уведомлений от AppMetrica -->
            <action android:name="com.moykareactnative.action.ymp.SILENT_PUSH_RECEIVE"/>
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
             tools:node="remove"/>

    <!-- Иконка уведомлений по умолчанию для AppMetrica Push SDK -->
    <meta-data android:name="io.appmetrica.analytics.push.default_notification_icon"
               android:resource="@drawable/ic_stat_notification"/>
</application>
```

**Примечание:** Подробная настройка silent push описана в [SILENT_PUSH_SETUP.md](./SILENT_PUSH_SETUP.md).

### 4. Интеграция в код

#### Обновление существующего файла yandexMetrikaPush.native.ts

```typescript
import { initializeAppMetricaPush, isNotificationFromAppMetrica } from '@moyka/appmetrica-push-sdk'
import { User } from '@domain/entity/user/User'

/**
 * Инициализация AppMetrica Push SDK
 */
export const initializeAppMetricaPushSDK = async (): Promise<boolean> => {
  try {
    const success = await initializeAppMetricaPush({
      debugMode: __DEV__,
    })

    if (success) {
      console.log('AppMetrica Push SDK initialized successfully')
    }

    return success
  } catch (error) {
    console.error('Failed to initialize AppMetrica Push SDK:', error)
    return false
  }
}

/**
 * Проверка, что push уведомление от AppMetrica
 * Используется в собственных сервисах обработки push уведомлений
 */
export const checkIfNotificationFromAppMetrica = async (notification: any): Promise<boolean> => {
  try {
    const isFromAppMetrica = await isNotificationFromAppMetrica(notification)

    if (isFromAppMetrica) {
      console.log('Notification is from AppMetrica, skipping custom processing')
    }

    return isFromAppMetrica
  } catch (error) {
    console.error('Failed to check if notification is from AppMetrica:', error)
    return false
  }
}
```

### 5. Использование в компонентах

#### React Hook useAppMetricaPush

```typescript
import { useAppMetricaPush } from '@moyka/appmetrica-push-sdk'
import React from 'react'
import { View, Text } from 'react-native'

export const MyComponent: React.FC = () => {
  const { sdkInfo, isInitialized, isLoading } = useAppMetricaPush()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>SDK Initialized: {isInitialized ? 'Yes' : 'No'}</Text>
      {sdkInfo && (
        <Text>Version: {sdkInfo.version}</Text>
      )}
    </View>
  )
}
```

### 6. Особенности библиотеки

#### Автоматическая настройка звука уведомлений

Библиотека автоматически настраивает каналы уведомлений для Android 8.0+:

- ✅ **Высокий приоритет** - `IMPORTANCE_HIGH`
- ✅ **Звук включен** - дефолтный рингтон уведомлений
- ✅ **Вибрация включена** - для лучшего UX
- ✅ **Светодиод включен** - для визуального уведомления

#### FirebaseMessagingMainService

Библиотека включает готовый `FirebaseMessagingMainService`:

- ✅ **Автоматическая обработка** - AppMetrica Push SDK сам показывает уведомления
- ✅ **Правильная интеграция** - с Firebase Cloud Messaging
- ✅ **Аналитика** - автоматическое отслеживание событий

### 7. API библиотеки

#### Основные функции:

```typescript
// Инициализация
await initializeAppMetricaPush({ debugMode: __DEV__ })

// Проверка источника уведомления
const isFromAppMetrica = await isNotificationFromAppMetrica(notification)

// Получение информации о SDK
const sdkInfo = await getPushSDKInfo()

// Проверка инициализации
const isInitialized = isSDKInitialized()
```

#### React Hook:

```typescript
const { sdkInfo, isInitialized, isLoading, refreshSDKInfo } = useAppMetricaPush()
```

### 8. Отладка

#### Логи в Android Studio:

```
AppMetricaPush: AppMetrica Push initialized successfully
AppMetricaPush: AppMetrica default notification channel configured with sound
AppMetricaFirebaseService: Firebase message received: [messageId]
AppMetricaFirebaseService: Processing AppMetrica push notification
```

#### Проверка работы:

1. **Инициализация** - проверьте логи при запуске приложения
2. **Каналы уведомлений** - в настройках Android должны появиться каналы
3. **Тестовые уведомления** - используйте веб-интерфейс AppMetrica

### 9. Troubleshooting

#### Уведомления без звука:

1. ✅ Проверьте, что библиотека инициализирована
2. ✅ Убедитесь, что добавлены Firebase зависимости
3. ✅ Проверьте настройки каналов в Android
4. ✅ Убедитесь, что приложение не в режиме "Не беспокоить"

#### Ошибки компиляции:

1. ✅ Убедитесь, что добавлены все зависимости в основной проект
2. ✅ Проверьте, что библиотека переустановлена после изменений
3. ✅ Очистите кэш: `cd android && ./gradlew clean`

### 10. Версии

- **AppMetrica Push SDK**: 4.2.1
- **Firebase BOM**: 33.2.0
- **Kotlin**: 2.1.20
- **React Native**: >=0.60.0

## Дополнительные руководства

- [SILENT_PUSH_SETUP.md](./SILENT_PUSH_SETUP.md) - настройка silent push уведомлений
- [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md) - руководство для аналитиков

---

**Библиотека готова к использованию!** 🎉
