import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native'
import {
  useAppMetricaPush,
  AppMetricaPush,
  initializeAppMetricaPush,
  setupPushToken,
  handleIncomingPush,
  reportPushClick,
  PushMessage,
} from '../src'

/**
 * Базовый пример использования AppMetrica Push SDK
 */
export const BasicExample: React.FC = () => {
  const {
    isPushAvailable,
    sdkInfo,
    isInitialized,
    isLoading,
    handlePush,
    reportClick,
    refreshAvailability,
  } = useAppMetricaPush()

  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog('Component mounted')
    refreshAvailability()
  }, [refreshAvailability])

  const handleInitialize = async () => {
    try {
      addLog('Initializing AppMetrica Push SDK...')
      const success = await initializeAppMetricaPush({
        apiKey: 'YOUR_API_KEY_HERE',
        autoTracking: true,
        debugMode: true,
      })

      if (success) {
        addLog('SDK initialized successfully')
        await setupPushToken()
        addLog('Push token setup completed')
      } else {
        addLog('Failed to initialize SDK')
      }
    } catch (error) {
      addLog(`Error: ${error}`)
    }
  }

  const handleTestPush = async () => {
    const testMessage: PushMessage = {
      title: 'Тестовое уведомление',
      body: 'Это тестовое push уведомление от AppMetrica',
      messageId: `test_${Date.now()}`,
      data: {
        type: 'test',
        timestamp: Date.now(),
      },
    }

    try {
      addLog('Handling test push message...')
      const success = await handlePush(testMessage, {
        autoTrackOpen: true,
        autoTrackClick: true,
      })

      if (success) {
        addLog('Push message handled successfully')
      } else {
        addLog('Failed to handle push message')
      }
    } catch (error) {
      addLog(`Error handling push: ${error}`)
    }
  }

  const handleTestClick = async () => {
    const messageId = `test_${Date.now()}`
    try {
      addLog('Reporting push click...')
      const success = await reportClick(messageId, 'test_action')

      if (success) {
        addLog('Push click reported successfully')
      } else {
        addLog('Failed to report push click')
      }
    } catch (error) {
      addLog(`Error reporting click: ${error}`)
    }
  }

  const handleRefresh = async () => {
    addLog('Refreshing availability...')
    await refreshAvailability()
    addLog('Availability refreshed')
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AppMetrica Push SDK Example</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusValue, { color: isPushAvailable ? '#4CAF50' : '#F44336' }]}>
          {isPushAvailable ? 'Available' : 'Not Available'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Initialized:</Text>
        <Text style={[styles.statusValue, { color: isInitialized ? '#4CAF50' : '#F44336' }]}>
          {isInitialized ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Loading:</Text>
        <Text style={[styles.statusValue, { color: isLoading ? '#FF9800' : '#4CAF50' }]}>
          {isLoading ? 'Yes' : 'No'}
        </Text>
      </View>

      {sdkInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>SDK Info:</Text>
          <Text style={styles.infoText}>Version: {sdkInfo.version}</Text>
          <Text style={styles.infoText}>Platform: {sdkInfo.platform}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleInitialize}>
          <Text style={styles.buttonText}>Initialize SDK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleTestPush}>
          <Text style={styles.buttonText}>Test Push</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={handleTestClick}>
          <Text style={styles.buttonText}>Test Click</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.quaternaryButton]} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearLogs}>
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Logs:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#666',
    minWidth: 100,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  tertiaryButton: {
    backgroundColor: '#FF9800',
  },
  quaternaryButton: {
    backgroundColor: '#9C27B0',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  logText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
})
