import { Tag, message } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max';
import copy from 'copy-to-clipboard';
import styles from './FuncListItem.less'

interface IProps {
  router: string;
  method: "post" | "get" | "delete" | "put";
  file: boolean;
}

const colorIndex = {
  get: 'blue',
  post: 'orange',
  delete: 'red',
  put: 'geekblue'
}


const FuncListItem = (props: IProps) => {

  const { router, method, file } = props;

  const { deleteFunc, isThisItem, selectFunc } = useModel('global', (model) => ({
    deleteFunc: model.deleteFunc,
    isThisItem: model.currentSelectFunc === `${router.replace('/', '')}+${method}`,
    selectFunc: model.selectFunc,
  }));

  return (
    <div
      className={`${styles.listItem} ${isThisItem ? styles.select : ''}`}
      onClick={() => {
        selectFunc(router, method)
      }}
    >
      <div className={styles.infoWrap}>
        <span className={`${file ? styles.green : styles.red}`}></span>
        <div className={styles.methodWrap}>
          <Tag color={colorIndex[method]} >
            {method}
          </Tag>
        </div>
        <span className={styles.routeWrap}>{router}</span>
      </div>
      <div className={styles.toolsWrap}>
        <div
          className={styles.deleteWrap}
          onClick={(e) => {
            e.stopPropagation()
            copy(`http://${window.location.hostname}:3000${router}`);
            message.success('复制成功')
          }}
        >
          <CopyOutlined style={{ color: '#69c0ff', fontSize: 16 }} />
        </div>
        <div
          className={styles.deleteWrap}
          onClick={(e) => {
            e.stopPropagation()
            deleteFunc({ router, method })
          }}
        >
          <DeleteOutlined style={{ color: '#c53330', fontSize: 16 }} />
        </div>
      </div>
    </div>
  )
};
export default FuncListItem;
