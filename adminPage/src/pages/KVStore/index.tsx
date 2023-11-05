import List from './components/List';
import EditKey from './components/EditKey';
import Editor from './components/Editor';
import styles from './index.less';

const KVStore = () => {


  return (
    <div className={styles.kvRootWrap}>
      <div className={styles.kvWrap}>
        <EditKey />
        <div className={styles.listWrap}>
          <List />
        </div>
      </div>
      <div className={styles.detailWrap}>
        <Editor />
      </div>
    </div>
  )
};
export default KVStore;
