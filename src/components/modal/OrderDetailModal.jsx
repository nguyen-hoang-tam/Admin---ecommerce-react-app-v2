import React from 'react';
import { Modal, Button, Typography, Tag, Row, Col, Table, Tooltip, Image, message } from 'antd';
import {
  FileTextOutlined,
  CopyOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { InfoCard, IconTextRow, PriceRow } from '../card/InfoCard';
import OrderStatusTag from '../common/OrderStatusTag';

const { Text } = Typography;

const formatVND = (num) => `${Number(num || 0).toLocaleString('vi-VN')} ₫`;

const formatDate = (val) => {
  if (!val) return '—';
  if (typeof val === 'string' && val.includes('/')) return val;
  const d = val?.toDate?.() || (val?.seconds ? new Date(val.seconds * 1000) : new Date(val));
  if (isNaN(d.getTime())) return String(val);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const OrderDetailModal = ({ open, onClose, order }) => {
  const orderId = order?.id || '—';
  const orderDate = formatDate(order?.createdAt);
  const status = (order?.status || 'pending').toLowerCase();
  const paymentMethod = order?.paymentMethod || 'Chưa xác định';
  const addr = order?.shippingAddress || {};

  const customerEmail =
    addr.email ||
    order?.customerEmail ||
    order?.email ||
    order?.userEmail ||
    (addr.name?.includes('@') ? addr.name : '') ||
    '—';
  const customerPhone = addr.phone || order?.customerPhone || order?.phone || '—';
  const shippingName = addr.name || order?.customerName || '—';
  const shippingAddress = addr.address || order?.address || '—';

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
          fallback="https://via.placeholder.com/48"
          preview={false}
          style={{ objectFit: 'cover', borderRadius: 6, backgroundColor: '#f5f5f5' }}
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
      width: 90,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      width: 120,
      render: formatVND,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right',
      width: 130,
      render: (_, record) => <Text strong>{formatVND(record.price * record.quantity)}</Text>,
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
            <Text type="secondary" style={{ fontSize: 12 }}>Mã đơn hàng</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text strong style={{ fontSize: 15 }}>{orderId}</Text>
              {orderId !== '—' && (
                <Tooltip title="Sao chép">
                  <Button type="text" size="small" icon={<CopyOutlined style={{ color: '#1677ff' }} />} onClick={handleCopy} />
                </Tooltip>
              )}
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Ngày đặt</Text>
            <div style={{ fontSize: 14 }}>{orderDate}</div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Thanh toán</Text>
            <div>
              <Tag bordered={false} color="geekblue" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12, border: 'none' }}>
                {paymentMethod}
              </Tag>
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Trạng thái</Text>
            <div><OrderStatusTag status={status} /></div>
          </div>
        </div>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12}>
            <InfoCard icon={<UserOutlined />} title="Thông tin khách hàng">
              <IconTextRow icon={<MailOutlined style={{ color: '#8c8c8c' }} />} text={customerEmail} style={{ marginBottom: 6 }} />
              <IconTextRow icon={<PhoneOutlined style={{ color: '#8c8c8c' }} />} text={customerPhone} />
            </InfoCard>
          </Col>

          <Col xs={24} sm={12}>
            <InfoCard icon={<EnvironmentOutlined />} title="Địa chỉ giao hàng">
              <IconTextRow icon={<UserOutlined style={{ color: '#8c8c8c' }} />} text={shippingName} style={{ marginBottom: 6 }} />
              <IconTextRow icon={<HomeOutlined style={{ color: '#8c8c8c' }} />} text={shippingAddress} />
            </InfoCard>
          </Col>
        </Row>

        <Table columns={columns} dataSource={items} pagination={false} size="small" style={{ marginBottom: 20 }} />

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <InfoCard icon={<FileTextOutlined />} title="Ghi chú đơn hàng">
              <Text type="secondary" style={{ fontSize: 13 }}>
                {order?.note || 'Không có ghi chú từ khách hàng.'}
              </Text>
            </InfoCard>
          </Col>

          <Col xs={24} sm={12}>
            <InfoCard icon={<DollarOutlined />} title="Tổng thanh toán">
              <PriceRow label="Tạm tính" value={formatVND(subtotal)} />
              <PriceRow label="Phí vận chuyển" value={formatVND(shippingFee)} />
              <PriceRow label="Giảm giá" value={discount > 0 ? `-${formatVND(discount)}` : formatVND(0)} />
              <PriceRow label="Tổng tiền" value={formatVND(total)} isTotal />
            </InfoCard>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
