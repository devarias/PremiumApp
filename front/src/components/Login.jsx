import React, { useState } from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';

function Login() {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  let history = useHistory();

  async function handleClick() {
    const info = await axios.get('http://localhost:8000/login', (res) => {
      return res;
    });
    if (info.data.username !== user) {
      alert('Wrong Username');
    } else if (info.data.password !== pwd) {
      alert('Wrong Password');
    } else {
      history.push('/home');
    }
  }

  return (
    <div className='login'>
      <Form
        name='basic'
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item>
          <div className='app-name'>Premium App</div>
          Username
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          Password
          <Input.Password
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
            onChange={(e) => setPwd(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className='lgn-btn'
            disabled={user && pwd ? false : true}
            onClick={handleClick}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Login;
