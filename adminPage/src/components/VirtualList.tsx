import React, { ReactNode, useRef } from 'react';
import { useVirtualList } from 'ahooks';
import styles from './VirtualList.less';

interface IProps {
  dataList: any[];
  itemHeight?: number;
  overscan?: number;
  itemNode: (data: any) => ReactNode;
}


const VirtualList = (props: IProps) => {

  const { dataList, itemHeight = 40, overscan = 10, itemNode } = props

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [list] = useVirtualList(dataList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight,
    overscan,
  });
  return (
    <div className={styles.VirtualListRootWrap}>
      <div ref={containerRef} className={styles.listWrap} >
        <div ref={wrapperRef}>
          {list.map((ele) => {
            return (
              <div key={ele.index} className={styles.listItem}>
                {itemNode(ele?.data)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
};
export default VirtualList;
