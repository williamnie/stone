import { Button } from 'antd'
import { useModel, history } from 'umi';
import styles from './styles.less';


const Logout = () => {

  const { setInitialState } = useModel('@@initialState');
  const logout = () => {
    window.localStorage.removeItem('user')
    setInitialState({})
    history.replace('/login')
  }

  return (
    <div className={styles.logout}>
      <Button type="text" onClick={logout}>退出登录</Button>
    </div>
  )
};
export default Logout;
