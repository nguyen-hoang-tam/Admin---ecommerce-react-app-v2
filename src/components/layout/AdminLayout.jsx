import React from 'react';
import { Layout, Menu, Typography, Space, Avatar, Dropdown, Breadcrumb, theme } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAPI } from '../../features/auth/authAPI';
import { authLogout } from '../../features/auth/authSlice';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, profile } = useSelector((state) => state.auth);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/admin/products',
      icon: <AppstoreOutlined />,
      label: 'Products',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(authLogout());
      navigate('/login', { replace: true });
    }
  };

  const userMenuItems = {
    items: [
      {
        key: 'user-info',
        label: (
          <div>
            <Text strong>{profile?.displayName || user?.displayName || 'Admin'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        ),
        disabled: true,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  const getPageTitle = () => {
    if (location.pathname.includes('products')) return 'Products';
    if (location.pathname.includes('orders')) return 'Orders';
    return 'Dashboard';
  };

  const breadcrumbItems = [
    { title: 'Home' },
    { title: 'Admin' },
    { title: getPageTitle() },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />

        <Dropdown menu={userMenuItems} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer', marginLeft: 16 }}>
            <Avatar
              style={{ backgroundColor: '#1677ff' }}
              icon={<UserOutlined />}
              src={user?.photoURL}
            />
            <Text style={{ color: '#fff' }} strong>
              {profile?.displayName || user?.email || 'Admin'}
            </Text>
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
        <div
          style={{
            padding: 24,
            minHeight: 'calc(100vh - 180px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
        Ecommerce Admin ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
