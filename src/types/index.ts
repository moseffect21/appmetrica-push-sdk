/**
 * Конфигурация для инициализации AppMetrica Push SDK
 */
export interface PushConfig {
  /** Режим отладки */
  debugMode?: boolean
}

/**
 * Push токен устройства
 */
export interface PushToken {
  /** Токен устройства */
  token: string
  /** Платформа устройства */
  platform: 'ios' | 'android'
}

/**
 * Push сообщение
 */
export interface PushMessage {
  /** Заголовок уведомления */
  title?: string
  /** Текст уведомления */
  body?: string
  /** Дополнительные данные */
  data?: Record<string, any>
  /** Уникальный идентификатор сообщения */
  messageId?: string
  /** Silent push уведомление (без видимого уведомления) */
  silent?: boolean
  /** Content-Available для iOS */
  contentAvailable?: boolean
  /** Приоритет для Android */
  priority?: 'high' | 'normal' | 'low'
}

/**
 * Информация о SDK
 */
export interface SDKInfo {
  /** Версия AppMetrica Push SDK */
  version: string
  /** Платформа */
  platform: string
  /** Название SDK */
  sdkName?: string
  /** Версия нашей библиотеки */
  libraryVersion?: string
}

/**
 * Результат инициализации
 */
export interface InitializationResult {
  /** Успешность инициализации */
  success: boolean
  /** Сообщение об ошибке */
  error?: string
}

/**
 * Результат обработки push сообщения
 */
export interface PushHandleResult {
  /** Успешность обработки */
  success: boolean
  /** Идентификатор сообщения */
  messageId?: string
  /** Сообщение об ошибке */
  error?: string
}

/**
 * События push уведомлений
 */
export interface PushEvents {
  /** Получен новый push токен */
  onTokenReceived?: (token: PushToken) => void
  /** Получено новое push сообщение */
  onMessageReceived?: (message: PushMessage) => void
  /** Открыто push уведомление */
  onPushOpened?: (messageId: string, action?: string) => void
  /** Клик по push уведомлению */
  onPushClicked?: (messageId: string, action?: string) => void
}

/**
 * Опции для отправки push токена
 */
export interface SendTokenOptions {
  /** Принудительная отправка */
  force?: boolean
  /** Дополнительные параметры */
  metadata?: Record<string, any>
}

/**
 * Опции для обработки push сообщения
 */
export interface HandleMessageOptions {
  /** Автоматическое отслеживание открытия */
  autoTrackOpen?: boolean
  /** Автоматическое отслеживание клика */
  autoTrackClick?: boolean
  /** Дополнительные параметры */
  metadata?: Record<string, any>
}
