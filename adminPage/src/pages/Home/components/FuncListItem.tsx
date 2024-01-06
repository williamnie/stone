import { useRef, } from 'react'
import { useModel } from '@umijs/max';
import { Tag, message } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import { useUnmount } from 'ahooks';
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

  const timer = useRef<NodeJS.Timeout | undefined>(undefined)
  const node = useRef<any>(null)

  useUnmount(() => {
    clearInterval(timer.current);
  });

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
        <span
          ref={node}
          className={styles.routeWrap}
          onMouseEnter={() => {
            clearInterval(timer.current);
            timer.current = setInterval(() => {
              node.current.scrollLeft += 1; // 每次滚动一个像素，可以根据需要调整速度
              if (node.current.scrollLeft >= node.current.scrollWidth - node.current.clientWidth) {
                clearInterval(timer.current);
              }
            }, 16); // 可以根据需要调整滚动速度
          }}
          onMouseLeave={() => {
            clearInterval(timer.current);
            node.current.scrollLeft = 0
          }}
        >{router}</span>
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
