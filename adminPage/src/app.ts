// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{ name: string }> {
//   return { name: '' };
// }


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

    rightRender: () => { },
    footerRender: () => { }
  };
};

export const request = {
  baseURL: process.env.NODE_ENV === 'development' ? '' : `${window.location.protocol}//${window.location.host}`,
  headers: {
    'Content-Type': 'application/json',
  },
}
