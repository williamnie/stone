
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor'
export { monaco }
import { useModel } from '@umijs/max';

import styles from './Editor.less'


const Editor = () => {


  const { code, setCode } = useModel(
    'global',
    (model) => ({
      code: model.funcInfo.code,
      setCode: model.setCode,
    })
  );

  const onChange = (newValue: string | undefined) => {
    setCode(newValue || '')
  }

  return (
    <div className={styles.editorRootWrap}>
      <div className={styles.editor}>
        <MonacoEditor
          width={'100%'}
          height={'100%'}
          defaultLanguage="javascript"
          theme="light"
          value={code}
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
          onChange={onChange}
        />
      </div>
    </div>
  )
};
export default Editor;
