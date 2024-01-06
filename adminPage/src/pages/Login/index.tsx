import React from 'react';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
//@ts-ignore
import { LoginForm, ProFormText, } from '@ant-design/pro-components';
import { useModel, history } from 'umi';
import { loginService } from '@/services'
import { message } from 'antd';

interface ILogin {
  email: string;
  password: string;
}

const Login = () => {

  const { setInitialState } = useModel('@@initialState');

  const login = async (_data: ILogin) => {
    const { code, data, message: msg } = await loginService(_data)
    if (code === 0) {
      setInitialState(data)
      window.localStorage.setItem('user', JSON.stringify(data))
      message.success('登录成功，即将自动跳转')
      setTimeout(() => {
        history.replace('/home')
      }, 1000)
    } else {
      message.error(msg)
    }
  }

  return (
    <div>
      <LoginForm
        title="Stone"
        subTitle="一个简单的Serverless服务"
        onFinish={login}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'邮箱地址'}
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginForm>
    </div>
  )
};
export default Login;
