import React, { useCallback, useEffect, useRef, memo } from 'react';
import { useImmer } from 'use-immer';
import { useUpdateEffect, useVirtualList } from 'ahooks';
import { getAllKVService, deleteKVService } from '@/services';
import { message } from 'antd';
import { useModel } from '@umijs/max';
import ListItem from './ListItem';
import styles from './List.less';


interface IKVStore {
  kvList: string[]
}

const List = () => {

  const { newKey } = useModel(
    'kvStore',
    (model) => ({
      newKey: model.newKey,
    })
  );

  const [kvStore, setKVStore] = useImmer<IKVStore>({
    kvList: []
  });

  useEffect(() => {
    getAllKV()
  }, [])

  useUpdateEffect(() => {
    setKVStore(draft => {
      draft.kvList.push(newKey)
    })
  }, [newKey])

  const getAllKV = async () => {
    const { code, data: { list }, message: msg } = await getAllKVService()
    if (code === 0) {
      setKVStore(draft => {
        draft.kvList = list
      })
    } else {
      message.error(msg)
    }
  }


  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [list] = useVirtualList(kvStore.kvList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 40,
    overscan: 10,
  });

  const deleteKeyCallBack = useCallback(async (key: string) => {
    const { code } = await deleteKVService(key)
    if (code === 0) {
      setKVStore(draft => {
        draft.kvList = draft.kvList.filter(item => item !== key)
      })
    } else {
      message.error('删除失败')
    }

  }, [])

  return (
    <div className={styles.ListRootWrap}>
      <div ref={containerRef} className={styles.listWrap} >
        <div ref={wrapperRef}>
          {list.map((ele) => {
            return (
              <ListItem key={ele.data} data={ele.data}
                deleteKeyCallBack={deleteKeyCallBack} />
            )
          })}
        </div>
      </div>
    </div>
  )
};
export default memo(List);
