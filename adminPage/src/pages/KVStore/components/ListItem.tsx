import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max';
import styles from './ListItem.less';

interface IProps {
  data: string;
  deleteKeyCallBack: (key: string) => void
}

const ListItem = (props: IProps) => {
  const { data, deleteKeyCallBack } = props

  const { isSelectKey, selectKeyAndGetDetail } = useModel('kvStore', (model) => ({
    isSelectKey: model.selectKey === data,
    selectKeyAndGetDetail: model.selectKeyAndGetDetail,
  }));

  return (
    <div className={`${styles.listItem} ${isSelectKey ? styles.select : ''}`} onClick={() => {
      selectKeyAndGetDetail(data)
    }}>
      <div className={styles.infoWrap}>
        <span className={styles.routeWrap}>{data}</span>
      </div>
      <div className={styles.toolsWrap}>
        <div
          className={styles.iconWrap}
          onClick={(e) => {
            e.stopPropagation()
            selectKeyAndGetDetail(data, true)
          }}
        >
          <EditOutlined style={{ color: '#619ac3', fontSize: 16 }} />
        </div>
        <div
          className={styles.iconWrap}
          onClick={(e) => {
            e.stopPropagation()
            deleteKeyCallBack(data)
          }}
        >
          <DeleteOutlined style={{ color: '#c53330', fontSize: 16 }} />
        </div>
      </div>
    </div>
  )
};
export default ListItem;
