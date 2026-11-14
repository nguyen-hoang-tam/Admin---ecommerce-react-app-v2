import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Alert, Divider, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { registerAPI, loginWithGoogleAPI } from '@/features/auth/authAPI';
import bgImage from '@/assets/images/bg-login.png';

const { Title, Link } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { isAuthenticated, profile } = useSelector((state) => state.auth);

  if (isAuthenticated && profile?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onFinish = async (values) => {
    const { fullname, email, password } = values;
    setLoading(true);
    setErrorMessage('');

    try {
      await registerAPI(email, password, fullname);
      message.success('Đăng ký tài khoản thành công!');
      notification.info({
        message: 'Đăng ký thành công',
        description:
          'Tài khoản đã được khởi tạo. Vui lòng liên hệ Quản trị viên để được cấp quyền ADMIN trước khi truy cập trang Quản trị.',
        duration: 6,
      });

      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại!';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Mật khẩu quá yếu. Vui lòng nhập từ 6 ký tự trở lên.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Địa chỉ email không hợp lệ.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setErrorMessage('');

    try {
      await loginWithGoogleAPI();
      message.success('Đăng nhập Google thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Google register error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        const errorMsg = error.message || 'Đăng ký qua Google thất bại!';
        setErrorMessage(errorMsg);
        message.error(errorMsg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: 400,
          maxWidth: '100%',
          background: '#FFFFFFEB',
          padding: '36px 40px',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title
            level={3}
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            Đăng Ký
          </Title>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage('')}
            style={{ marginBottom: 18, borderRadius: 8 }}
          />
        )}

        <Form
          name="admin_register"
          initialValues={{ fullname: '', email: '', password: '', confirmPassword: '' }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập Họ và tên!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="admin@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập Mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Ít nhất 6 ký tự"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận Mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 14 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 42,
                borderRadius: 8,
                backgroundColor: '#1677ff',
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
              }}
            >
              Đăng Ký
            </Button>
          </Form.Item>

          <Divider
            style={{
              margin: '14px 0',
              fontSize: 13,
              color: '#8c8c8c',
              borderColor: '#f0f0f0',
            }}
          >
            Hoặc
          </Divider>

          <Button
            block
            icon={<GoogleOutlined style={{ fontSize: 16 }} />}
            onClick={handleGoogleRegister}
            loading={googleLoading}
            style={{
              height: 42,
              borderRadius: 8,
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              fontSize: 14,
              fontWeight: 500,
              color: '#262626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            Đăng ký bằng Google
          </Button>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#595959' }}>
            Đã có tài khoản?{' '}
            <Link
              style={{
                color: '#1677ff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/login')}
            >
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;

