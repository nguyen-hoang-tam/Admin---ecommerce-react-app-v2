import React from 'react';
import {
  Modal,
  Button,
  Typography,
  Tag,
  Row,
  Col,
  Table,
  Steps,
  Tooltip,
  Image,
  message,
} from 'antd';
import {
  FileTextOutlined,
  CopyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const defaultMockItems = [
  {
    key: '1',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80&q=80',
    name: 'Áo thun basic',
    variant: 'Trắng / L',
    quantity: 2,
    price: 250000,
  },
  {
    key: '2',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
    name: 'Giày thể thao nam',
    variant: 'Trắng / 42',
    quantity: 1,
    price: 2450000,
  },
];

const OrderDetailModal = ({ open, onClose, order }) => {
  const orderId = order?.id || '0r9ZFHvKe15gQumtOEKS';

  const formatDate = (val) => {
    if (!val) return '01/11/2026 15:22';
    if (typeof val === 'string' && val.includes('/')) return val;
    let date;
    if (typeof val.toDate === 'function') {
      date = val.toDate();
    } else if (val.seconds) {
      date = new Date(val.seconds * 1000);
    } else {
      date = new Date(val);
    }
    if (isNaN(date.getTime())) return String(val);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const orderDate = formatDate(order?.createdAt);
  const status = (order?.status || 'pending').toLowerCase();

  const customerEmail = order?.shippingAddress?.email || order?.shippingAddress?.name || 'tamtest02@gmail.com';
  const customerPhone = order?.shippingAddress?.phone || '0901234567';
  const shippingName = order?.shippingAddress?.name || 'Nguyễn Văn A';
  const shippingAddress = order?.shippingAddress?.address || '123 Nguyễn Văn Cừ, Long Biên, Hà Nội';

  const items = (order?.items && order.items.length > 0)
    ? order.items.map((item, idx) => ({
        key: item.id || idx,
        image: item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80&q=80',
        name: item.name || 'Sản phẩm',
        variant: item.variant || item.brand || 'Mặc định',
        quantity: item.quantity || 1,
        price: item.price || 0,
      }))
    : defaultMockItems;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 2950000;
  const shippingFee = order?.shippingFee ?? 50000;
  const discount = order?.discount || 0;
  const total = order?.total || 6950000;

  const getStepInfo = () => {
    if (status === 'cancelled') {
      return { current: 1, stepStatus: 'error' };
    }
    if (status === 'success' || status === 'completed') {
      return { current: 3, stepStatus: 'finish' };
    }
    if (status === 'processing') {
      return { current: 2, stepStatus: 'process' };
    }
    return { current: 1, stepStatus: 'process' };
  };

  const { current: currentStep, stepStatus } = getStepInfo();

  const renderStatusTag = () => {
    if (status === 'pending') {
      return (
        <Tag
          color="processing"
          icon={<ClockCircleOutlined />}
          style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
        >
          Chờ xử lý
        </Tag>
      );
    }
    if (status === 'success' || status === 'completed') {
      return (
        <Tag
          color="success"
          icon={<CheckCircleOutlined />}
          style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
        >
          Hoàn thành
        </Tag>
      );
    }
    if (status === 'processing') {
      return (
        <Tag
          color="warning"
          icon={<SyncOutlined spin />}
          style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
        >
          Đang giao
        </Tag>
      );
    }
    return (
      <Tag
        color="error"
        icon={<CloseCircleOutlined />}
        style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
      >
        Đã hủy
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (src) => (
        <Image
          src={src}
          width={48}
          height={48}
          style={{ objectFit: 'cover', borderRadius: 6 }}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Phiên bản',
      dataIndex: 'variant',
      key: 'variant',
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `${Number(price).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right',
      render: (_, record) => (
        <Text strong>
          {Number(record.price * record.quantity).toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    message.success('Đã sao chép mã đơn hàng');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
          <FileTextOutlined style={{ color: '#1677ff' }} />
          <span>Chi tiết đơn hàng</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={760}
      footer={[
        <Button key="close" onClick={onClose} style={{ minWidth: 80 }}>
          Đóng
        </Button>,
      ]}
    >
      <div style={{ padding: '8px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: '1px solid #f0f0f0',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Mã đơn hàng
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text strong style={{ fontSize: 15 }}>
                {orderId}
              </Text>
              <Tooltip title="Sao chép">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined style={{ color: '#1677ff' }} />}
                  onClick={handleCopy}
                />
              </Tooltip>
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ngày đặt
            </Text>
            <div style={{ fontSize: 14 }}>{orderDate}</div>
          </div>

          <div>{renderStatusTag()}</div>
        </div>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#1a1a1a',
                }}
              >
                <UserOutlined /> Thông tin khách hàng
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MailOutlined style={{ color: '#8c8c8c' }} />
                <Text style={{ fontSize: 13 }}>{customerEmail}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhoneOutlined style={{ color: '#8c8c8c' }} />
                <Text style={{ fontSize: 13 }}>{customerPhone}</Text>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#1a1a1a',
                }}
              >
                <EnvironmentOutlined /> Địa chỉ giao hàng
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <UserOutlined style={{ color: '#8c8c8c' }} />
                <Text style={{ fontSize: 13 }}>{shippingName}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HomeOutlined style={{ color: '#8c8c8c' }} />
                <Text style={{ fontSize: 13 }}>{shippingAddress}</Text>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ margin: '24px 0 28px 0', padding: '0 12px' }}>
          <Steps
            current={currentStep}
            status={stepStatus}
            size="small"
            items={[
              { title: 'Đặt hàng' },
              {
                title: 'Xác nhận',
                description:
                  status === 'pending' ? (
                    <Text style={{ color: '#1677ff', fontSize: 12 }}>Chờ xử lý</Text>
                  ) : undefined,
              },
              { title: 'Đang giao' },
              { title: 'Hoàn thành' },
            ]}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShoppingOutlined /> Sản phẩm trong đơn hàng
          </div>
          <Tag style={{ borderRadius: 10, background: '#f5f5f5', color: '#595959', border: 'none' }}>
            {items.length} sản phẩm
          </Tag>
        </div>

        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          size="small"
          style={{ marginBottom: 20 }}
        />

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <FileTextOutlined /> Ghi chú đơn hàng
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {order?.note || 'Không có ghi chú từ khách hàng.'}
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <DollarOutlined /> Tổng thanh toán
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <Text type="secondary">Tạm tính</Text>
                <Text>{subtotal.toLocaleString('vi-VN')} ₫</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <Text type="secondary">Phí vận chuyển</Text>
                <Text>{shippingFee.toLocaleString('vi-VN')} ₫</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <Text type="secondary">Giảm giá</Text>
                <Text>{discount.toLocaleString('vi-VN')} ₫</Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: 8,
                }}
              >
                <Text strong style={{ fontSize: 14 }}>
                  Tổng tiền
                </Text>
                <Text strong style={{ fontSize: 18, color: '#cf1322' }}>
                  {total.toLocaleString('vi-VN')} ₫
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
