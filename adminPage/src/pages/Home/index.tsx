import Editor from './components/Editor';
import BaseInfo from './components/BaseInfo';
import FuncList from './components/FuncList'
import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.funcListWrap}>
        <div className={styles.depInfoWrap}>
          <BaseInfo />
        </div>
        <div className={styles.listWrap}>
          <FuncList />
        </div>

      </div>
      <div className={styles.editorWrap} >
        <Editor />
      </div>
      <div className={styles.resultWrap}>
        TODO
      </div>
    </div>
  );
};

export default HomePage;
