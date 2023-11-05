
import React from 'react'
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor'
export { monaco }
import { useModel } from '@umijs/max';
// import * as monaco from 'monaco-editor'

import styles from './Editor.less'

const Editor = () => {


  const { valueChange, getCurrentValue, createValue } = useModel(
    'kvStore',
    (model) => ({
      valueChange: model.valueChange,
      getCurrentValue: model.getCurrentValue,
      createValue: model.createValue,
    })
  );

  const onValueChange = (newValue: string | undefined) => {
    createValue(newValue || '')
  }

  const value = getCurrentValue()

  return (
    <div className={styles.editorRootWrap}>
      <div className={styles.editor}>
        <MonacoEditor
          width={'100%'}
          height={'100%'}
          defaultLanguage="json"
          theme="light"
          value={value}
          options={{
            automaticLayout: true,
            wordWrap: 'wordWrapColumn',
            wrappingStrategy: 'simple',
            wordWrapBreakBeforeCharacters: ',',
            wordWrapBreakAfterCharacters: ',',
            disableLayerHinting: true,
            selectOnLineNumbers: true,
            minimap: { enabled: false },
            "formatOnPaste": true,
            "formatOnType": true
          }}
          onChange={onValueChange}
        // editorDidMount={editorDidMountHandle}
        />
      </div>
    </div>
  )
};
export default React.memo(Editor);
