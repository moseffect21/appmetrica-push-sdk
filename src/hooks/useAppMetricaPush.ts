import { useEffect, useState, useCallback } from 'react'
import { getPushSDKInfo, isSDKInitialized } from '../utils'
import { SDKInfo } from '../types'

/**
 * Интерфейс возвращаемых значений хука
 */
export interface UseAppMetricaPushReturn {
  /** Информация о SDK */
  sdkInfo: SDKInfo | null
  /** Статус инициализации SDK */
  isInitialized: boolean
  /** Загрузка данных */
  isLoading: boolean
  /** Обновление информации о SDK */
  refreshSDKInfo: () => Promise<void>
}

/**
 * Хук для работы с AppMetrica Push уведомлениями
 *
 * @example
 * ```tsx
 * import { useAppMetricaPush } from '@moyka/appmetrica-push-sdk'
 *
 * const MyComponent = () => {
 *   const {
 *     sdkInfo,
 *     isInitialized
 *   } = useAppMetricaPush()
 *
 *   return (
 *     <View>
 *       <Text>SDK initialized: {isInitialized ? 'Yes' : 'No'}</Text>
 *     </View>
 *   )
 * }
 * ```
 */
export const useAppMetricaPush = (): UseAppMetricaPushReturn => {
  const [sdkInfo, setSdkInfo] = useState<SDKInfo | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadSDKInfo = useCallback(async () => {
    try {
      const info = await getPushSDKInfo()
      setSdkInfo(info)
    } catch (error) {
      console.error('Failed to load SDK info:', error)
    }
  }, [])

  const checkInitialization = useCallback(() => {
    const initialized = isSDKInitialized()
    setIsInitialized(initialized)
  }, [])

  const refreshSDKInfo = useCallback(async () => {
    await loadSDKInfo()
  }, [loadSDKInfo])

  // Инициализация при монтировании компонента
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)
      checkInitialization()
      await loadSDKInfo()
      setIsLoading(false)
    }

    initialize()
  }, [loadSDKInfo, checkInitialization])

  return {
    sdkInfo,
    isInitialized,
    isLoading,
    refreshSDKInfo,
  }
}
