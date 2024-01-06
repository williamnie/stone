import Logout from "./pages/Login/logout";

export const layout = () => {
  return {
    logo: () => { },
    menu: {
      locale: false,
    },
    contentStyle: { height: '100vh', padding: 16 },
    token: {
      bgLayout: '#e7f8ff',
      sider: {
        colorMenuBackground: '#e7f8ff',
        colorTextMenuSelected: '#1d93ab',
      }
    },
    // 自定义 403 页面
    // unAccessible: () => { console.log('8888'); },
    // // 自定义 404 页面
    // noFound: <div>noFound</div>,
    rightRender: () => { return <Logout /> },
    // footerRender: () => {
    // }
  };
};

const getUser = () => {
  const user = window.localStorage.getItem('user')
  return user ? JSON.parse(user) : {}
}

export const request = {
  baseURL: process.env.NODE_ENV === 'development' ? '' : `${window.location.protocol}//${window.location.host}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getUser()?.token}`
  },
}

export async function getInitialState() {
  console.log('getUser', getUser());
  const initialData = getUser() || {};
  return initialData;
}
