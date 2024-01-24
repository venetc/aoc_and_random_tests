import { ref } from 'vue'

type DebuggerEntityType = 'error' | 'warning' | 'info' | 'success' | 'default'
interface DebuggerEntity {
  type: DebuggerEntityType
  message: string
  timestamp: string
}

const MAX_QUEUE_SIZE = 30

export function useDebugger() {
  const messagesQueue = ref<DebuggerEntity[]>([])

  const getTimestampString = () => {
    const date = new Date()
    const base = date.toLocaleTimeString('ru-RU', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const ms = date.getMilliseconds().toString().padStart(3, '0')
    return `<${base}:${ms}>`
  }

  const enqueueMessage = ({ type, message }: { type: DebuggerEntityType, message: string }) => {
    messagesQueue.value.push({ type, message, timestamp: getTimestampString() })

    if (messagesQueue.value.length > MAX_QUEUE_SIZE) messagesQueue.value.shift()
  }

  return {
    messagesQueue,
    enqueueMessage,
  }
}
