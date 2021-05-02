import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../styles/NavBar.css';

function NavBar({ setView, viewSelect }) {
  const [collapsed, setCollapse] = useState(false);

  const { Sider } = Layout;
  const handleView = ({ key }) => {
    setView(key);
  };
  const onCollapse = (event) => setCollapse(event);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <a href='http://localhost:3000/home'>
        <div className='logo' />
      </a>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={viewSelect}
        onClick={handleView}
      >
        <Menu.Item icon={<UserOutlined />} key='1'>
          <Link to='/orders'>Order List</Link>
        </Menu.Item>
        <Menu.Item icon={<ShoppingCartOutlined />} key='2'>
          <Link to='/orderCreation'>Create an Order</Link>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />} key='3'>
          <Link to='/'>Logout</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
export default NavBar;
