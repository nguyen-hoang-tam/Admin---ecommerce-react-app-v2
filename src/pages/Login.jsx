import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { loginAPI, loginWithGoogleAPI, getUserProfile } from '../features/auth/authAPI';
import { authSuccess, setProfile } from '../features/auth/authSlice';
import bgImage from '../assets/images/bg-login.png';

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, profile } = useSelector((state) => state.auth);

  if (isAuthenticated && profile?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleAuthResponse = async (user, token) => {
    const userProfile = await getUserProfile(user.uid);

    if (!userProfile || userProfile.role !== 'ADMIN') {
      await signOut(auth);
      const msg = 'Tài khoản của bạn không có quyền truy cập hệ thống Quản trị (Admin).';
      setErrorMessage(msg);
      message.error('Từ chối truy cập: Yêu cầu quyền ADMIN!');
      return false;
    }

    dispatch(
      authSuccess({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || userProfile.displayName || '',
          photoURL: user.photoURL || '',
        },
        token,
      })
    );
    dispatch(setProfile(userProfile));

    message.success('Đăng nhập thành công!');
    navigate('/admin/dashboard', { replace: true });
    return true;
  };

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setErrorMessage('');

    try {
      const { user, token } = await loginAPI(email, password);
      await handleAuthResponse(user, token);
    } catch (error) {
      console.error('Login error:', error);
      let errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        errorMsg = 'Email hoặc mật khẩu không chính xác.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage('');

    try {
      const { user, token } = await loginWithGoogleAPI();
      await handleAuthResponse(user, token);
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        const errorMsg = error.message || 'Đăng nhập Google thất bại!';
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
          padding: '40px',
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
            Đăng Nhập
          </Title>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage('')}
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        <Form
          name="admin_login"
          initialValues={{ email: '', password: '' }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={true}
        >
          <Form.Item
            label={
              <span style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>
                Email / SĐT
              </span>
            }
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email hoặc SĐT!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />}
              placeholder="tamtest02@gmail.com"
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>
                Mật khẩu
              </span>
            }
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
            style={{ marginBottom: 6 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />}
              placeholder="••••••••"
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <Link
              style={{
                fontSize: 13,
                color: '#1677ff',
                cursor: 'pointer',
              }}
              onClick={() => message.info('Vui lòng liên hệ quản trị hệ thống để đặt lại mật khẩu.')}
            >
              Quên mật khẩu?
            </Link>
          </div>

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
              Đăng Nhập
            </Button>
          </Form.Item>

          <Divider
            style={{
              margin: '16px 0',
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
            onClick={handleGoogleLogin}
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
              marginBottom: 18,
            }}
          >
            Đăng nhập SSO với Google
          </Button>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#595959' }}>
            Chưa có tài khoản?{' '}
            <Link
              style={{
                color: '#1677ff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/register')}
            >
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
