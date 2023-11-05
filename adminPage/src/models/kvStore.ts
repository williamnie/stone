
import { useCallback, useRef } from 'react';
import { useImmer } from 'use-immer';
import { getDetailByKeyService, saveKVService } from '@/services';
import { message } from 'antd'


interface IKVStore {
  key: string;
  valueChange: number;
  edit: boolean;
  type: string;
}

const useKVStore = () => {

  // 用于存储key和value
  const [kvStore, setKvStore] = useImmer<IKVStore>({
    key: '',
    valueChange: 1,
    edit: false,
    type: 'object'
  })

  const [newKey, setNewKey] = useImmer<string>('')

  const currentKeyRef = useRef<string>('')
  const currentValueRef = useRef<string>('')

  const selectKeyAndGetDetail = useCallback(async (key: string, edit?: boolean) => {
    currentKeyRef.current = key
    const { code, data, message: msg } = await getDetailByKeyService(key)
    if (code === 0) {
      // 暂时都格式化成string，否则editor会报错，提交的时候再格式化回去
      currentValueRef.current = JSON.stringify(data, null, 2)
      if (edit) {
        setKvStore((draft: IKVStore) => {
          draft.key = key
          draft.valueChange++
          draft.edit = edit
          draft.type = typeof data
        })
      } else {
        setKvStore((draft: IKVStore) => {
          draft.type = typeof data
          draft.valueChange++
        })
      }
    } else {
      message.error(msg)
      if (edit) {
        setKvStore((draft: IKVStore) => {
          draft.key = key
          draft.edit = edit
        })
      }
    }
  }, [])

  const createKey = useCallback((key: string) => {
    setKvStore((draft: IKVStore) => {
      draft.key = key
    })
  }, [])

  const createType = useCallback((type: string) => {
    setKvStore((draft: IKVStore) => {
      draft.type = type
    })
  }, [])

  const createValue = useCallback((value: string) => {
    currentValueRef.current = value
    setKvStore((draft: IKVStore) => {
      draft.valueChange++
    })
  }, [])

  const getCurrentValue = useCallback(() => {
    return currentValueRef.current
  }, [])

  const saveKeyValue = useCallback(async (key: string, type: string) => {
    let value
    switch (type) {
      case 'boolen':
        value = Boolean(currentValueRef.current)
        break;
      case 'number':
        value = Number(currentValueRef.current)
        break;
      case 'object':
        value = JSON.parse(currentValueRef.current)
        break;
      default:
        value = currentValueRef.current
        break;
    }

    const kv = { key, value }
    if (!key) {
      message.error('请点击编辑按钮进行编辑')
      return
    }
    const { code, message: msg } = await saveKVService(kv)
    if (code === 0) {
      message.success('保存成功')
      if (currentKeyRef.current !== key) {
        setNewKey(key)
      }
    } else {
      message.error(msg)
    }
  }, [])


  return {
    selectKey: kvStore.key,
    valueChange: kvStore.valueChange,
    getCurrentValue,
    selectKeyAndGetDetail,
    createKey,
    createType,
    createValue,
    saveKeyValue,
    key: kvStore.key,
    edit: kvStore.edit,
    type: kvStore.type,
    newKey
  }
}

export default useKVStore;
