import React from 'react';
import {
  Modal,
  Button,
  Typography,
  Tag,
  Row,
  Col,
  Table,
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
  CheckOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const OrderDetailModal = ({ open, onClose, order }) => {
  const orderId = order?.id || '—';

  const formatDate = (val) => {
    if (!val) return '—';
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
  const paymentMethod = order?.paymentMethod || 'Chưa xác định';

  const customerEmail =
    order?.shippingAddress?.email ||
    order?.customerEmail ||
    order?.email ||
    order?.userEmail ||
    (order?.shippingAddress?.name?.includes('@') ? order?.shippingAddress?.name : '') ||
    '—';
  const customerPhone = order?.shippingAddress?.phone || order?.customerPhone || order?.phone || '—';
  const shippingName = order?.shippingAddress?.name || order?.customerName || '—';
  const shippingAddress = order?.shippingAddress?.address || '—';

  const items = Array.isArray(order?.items)
    ? order.items.map((item, idx) => ({
      key: item.id || idx,
      image: item.image || '',
      name: item.name || 'Sản phẩm',
      variant: item.variant || item.brand || '—',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    }))
    : [];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = Number(order?.shippingFee) || 0;
  const discount = Number(order?.discount) || 0;
  const total = order?.total !== undefined ? Number(order.total) : subtotal + shippingFee - discount;

  const renderStatusTag = () => {
    if (status === 'pending') {
      return (
        <Tag
          color="orange"
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
          color="green"
          icon={<CheckCircleOutlined />}
          style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
        >
          Thành công
        </Tag>
      );
    }
    if (status === 'processing') {
      return (
        <Tag
          color="blue"
          icon={<SyncOutlined spin />}
          style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}
        >
          Đang xử lý
        </Tag>
      );
    }
    return (
      <Tag
        color="red"
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
    if (orderId && orderId !== '—') {
      navigator.clipboard.writeText(orderId);
      message.success('Đã sao chép mã đơn hàng');
    }
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
              {orderId !== '—' && (
                <Tooltip title="Sao chép">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined style={{ color: '#1677ff' }} />}
                    onClick={handleCopy}
                  />
                </Tooltip>
              )}
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ngày đặt
            </Text>
            <div style={{ fontSize: 14 }}>{orderDate}</div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thanh toán
            </Text>
            <div>
              <Tag color="geekblue" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}>
                {paymentMethod}
              </Tag>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Trạng thái
            </Text>
            <div>{renderStatusTag()}</div>
          </div>
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
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

