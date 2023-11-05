import React from 'react';
import { Input, Button, Radio } from 'antd'
import { useModel } from '@umijs/max'
import styles from './EditKey.less';


const EditKey = () => {
  const { createKey, createType, saveKeyValue, key, type } = useModel('kvStore', (model) => ({
    createKey: model.createKey,
    createType: model.createType,
    saveKeyValue: model.saveKeyValue,
    key: model.key,
    type: model.type,
  }));

  return (
    <div className={styles.depInfoWrap}>
      <div className={styles.baseInfo}>
        <span className={styles.laebl}>Key</span>
        <Input value={key} onChange={(e) => { createKey(e.target.value) }} />
      </div>
      <div className={styles.baseInfo}>
        <span className={styles.laebl}>Type</span>
        <Radio.Group
          value={type}
          onChange={(e) => {
            createType(e.target.value)
          }}>
          <Radio value={'object'}>Object</Radio>
          <Radio value={'string'}>String</Radio>
          <Radio value={'number'}>Number</Radio>
          <Radio value={'boolean'}>Boolean</Radio>
        </Radio.Group>
      </div>
      <div className={styles.tools}>
        <Button onClick={() => { saveKeyValue(key, type) }}>保存</Button>
      </div>
    </div>
  )
};
export default EditKey;
