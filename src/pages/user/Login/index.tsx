import Footer from '@/components/Footer';
import {login} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, useModel} from 'umi';
import styles from './index.less';
import {Link} from 'umi';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const res = await login({
        ...values,
      });
      // TODO
      if (res.code === 0) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      } else {
        throw new Error(res.description);
      }
    } catch (error: any) {
      console.log('登录' + error);
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(error.message ?? defaultLoginFailureMessage);
      return;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg"/>}
          title="Fish Center"
          subTitle={'鱼塘用户中心'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账户密码登录'}/>
          </Tabs>

          {/*{code === 40000 && <LoginMessage content={'错误的账号和密码'}/>}*/}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号长度不小于4',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码长度不小于8',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <Link to="/user/register">新用户注册</Link>
          </div>
          <div
            style={{
              marginBottom: 40,
            }}
          >
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
