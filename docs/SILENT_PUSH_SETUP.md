# Настройка Silent Push в AppMetrica Push SDK

## Обзор

AppMetrica Push SDK имеет встроенную поддержку silent push уведомлений для актуализации push токенов и фоновой обработки данных.

**Примечание:** Общая интеграция библиотеки описана в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

## Настройка

### 1. Android

#### SilentPushReceiver

Создайте `SilentPushReceiver` в основном проекте:

**Файл:** `android/app/src/main/java/com/moykareactnative/SilentPushReceiver.kt`

```kotlin
package com.moykareactnative

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import io.appmetrica.analytics.push.AppMetricaPush

class SilentPushReceiver : BroadcastReceiver() {
    companion object {
        private const val TAG = "SilentPushReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        // Extract push message payload from your push message.
        val payload = intent.getStringExtra(AppMetricaPush.EXTRA_PAYLOAD)

        if (payload != null) {
            Log.d(TAG, "Silent push received: $payload")
            // AppMetrica Push SDK автоматически обрабатывает silent push
        }
    }
}
```

#### AndroidManifest.xml

Добавьте в `android/app/src/main/AndroidManifest.xml`:

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
</application>
```

**Важно:** Замените `com.moykareactnative` на ваш `applicationId` из `build.gradle`.

#### Firebase Cloud Messaging Integration

**Примечание:** Зависимости и настройка AndroidManifest.xml описаны в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

`FirebaseMessagingMainService` уже включен в библиотеку `@moyka/appmetrica-push-sdk` и автоматически обрабатывает AppMetrica уведомления.

### 2. Настройка в веб-интерфейсе AppMetrica

1. Перейдите в настройки приложения в веб-интерфейсе AppMetrica
2. Выберите опцию **"Актуализировать токены с помощью Silent Push-уведомлений"**
3. Во вкладке **"Push-уведомления"** включите silent push

## Использование

### Инициализация с поддержкой silent push

```typescript
import { initializeAppMetricaPush } from '@moyka/appmetrica-push-sdk'

// Инициализация с поддержкой silent push
const success = await initializeAppMetricaPush({
  debugMode: __DEV__,
})
```

**Примечание:** Silent push настраивается автоматически при инициализации SDK. Дополнительные параметры не требуются.

### Проверка уведомлений от AppMetrica

Если у вас есть собственный сервис обработки push уведомлений, используйте эту функцию для проверки:

```typescript
import { isNotificationFromAppMetrica } from '@moyka/appmetrica-push-sdk'

// В вашем FirebaseMessagingService или HmsMessageService
const isFromAppMetrica = await isNotificationFromAppMetrica(notification)

if (isFromAppMetrica) {
  // Не обрабатывайте это уведомление, AppMetrica SDK сделает это автоматически
  return
}

// Обработайте ваше собственное уведомление
```

**Примечание:** `FirebaseMessagingMainService` уже включен в библиотеку и автоматически обрабатывает AppMetrica уведомления.

## Особенности

### Автоматическая обработка

- AppMetrica Push SDK автоматически обрабатывает silent push уведомления
- SDK автоматически обновляет push токены при необходимости
- Никаких дополнительных обработчиков не требуется

### Актуализация токенов

- Silent push используется для актуализации push токенов
- Предотвращает отправку push на устройства с устаревшими токенами
- Настраивается в веб-интерфейсе AppMetrica

### Фоновая обработка

- Silent push может содержать данные для фоновой обработки
- Не отображает видимые уведомления пользователю
- Работает даже когда приложение в фоне

## Отладка

Включите debug режим для просмотра логов:

```typescript
const success = await initializeAppMetricaPush({
  debugMode: true, // Включить отладочные логи
})
```

Логи будут показывать:

- Получение silent push уведомлений
- Обработку payload
- Обновление токенов
- Работу FirebaseMessagingMainService

## Дополнительные руководства

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - общая интеграция библиотеки
- [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md) - руководство для аналитиков
