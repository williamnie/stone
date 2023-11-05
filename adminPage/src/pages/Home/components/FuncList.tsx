import React, { useEffect, useRef } from 'react';
import { useModel } from '@umijs/max';
import { useVirtualList } from 'ahooks';
import FuncListItem from './FuncListItem';
import styles from './FuncList.less';



const FuncList = () => {

  const { funcList, getFuncList } = useModel('global', (model) => ({
    funcList: model.funcList,
    getFuncList: model.getFuncList,
  }));

  useEffect(() => {
    getFuncList()
  }, [])

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [list] = useVirtualList(funcList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 40,
    overscan: 10,
  });
  return (
    <div className={styles.funcListRootWrap}>
      <div ref={containerRef} className={styles.listWrap} >
        <div ref={wrapperRef}>
          {list.map((ele) => {
            const { router, method, file } = ele?.data || {}
            return (
              <FuncListItem
                key={`${router}+${method}`}
                router={router} method={method} file={file}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
};
export default FuncList;
