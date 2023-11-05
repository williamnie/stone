import { Input, Radio, Button, } from 'antd'
import { useModel } from '@umijs/max';
import styles from './BaseInfo.less';


const BaseInfo = () => {

  const { router, method, setRoute, setMethod, saveFunction } = useModel(
    'global',
    (model) => ({
      router: model.funcInfo.router,
      method: model.funcInfo.method,
      setRoute: model.setRoute,
      setMethod: model.setMethod,
      saveFunction: model.saveFunction,
    })
  );


  return (
    <div className={styles.baseInfo}>
      <div className={styles.routerInfo}>
        <span className={styles.label}>路由</span>
        <Input addonBefore='/' value={router} onChange={(e) => {
          setRoute(e.target.value)
        }} />
      </div>
      <div className={styles.methodInfo}>
        <span className={styles.label}>方法</span>
        <Radio.Group
          value={method}
          onChange={(e) => {
            setMethod(e.target.value)
          }}>
          <Radio value={'get'}>GET</Radio>
          <Radio value={'post'}>POST</Radio>
          <Radio value={'delete'}>DELETE</Radio>
          <Radio value={'put'}>PUT</Radio>
        </Radio.Group>
      </div>
      <div className={styles.btnWrap}>
        <Button className={styles.testBtn} style={{
          backgroundColor: '#1d93ab'
        }}>测试</Button>
        <Button type='primary' onClick={() => {
          saveFunction(`/${router}`, method)
        }}>保存</Button>
      </div>
    </div>
  )
};
export default BaseInfo;
