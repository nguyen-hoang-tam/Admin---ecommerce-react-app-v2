import React, { useState } from 'react';
import { Table, Tag, Typography, Space, Button, Input, Select } from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import OrderDetailModal from '../components/orders/OrderDetailModal';

const { Title, Text } = Typography;
const { Option } = Select;

const mockOrders = [
  {
    id: '0r9ZFHvKe15gQumtOEKS',
    key: '0r9ZFHvKe15gQumtOEKS',
    createdAt: '2026-11-01T15:22:08+07:00',
    discount: 50000,
    items: [
      {
        brand: 'Gucci',
        id: '4PnH3fR7vamtzVGT2kjl',
        image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/082/372/products/img-6532-1.jpg?v=1739365920343',
        name: 'Kính mát Gucci',
        price: 3500000,
        quantity: 2,
      },
    ],
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: {
      address: 'Chưa có địa chỉ',
      name: 'tamtest02@gmail.com',
      phone: '0901234567',
    },
    shippingFee: 0,
    status: 'pending',
    total: 6950000,
    voucherCode: 'GIAM50K',
  },
  {
    id: '1P9ia4Zk8bPYLLPawLms',
    key: '1P9ia4Zk8bPYLLPawLms',
    createdAt: '2026-11-02T10:15:30+07:00',
    discount: 0,
    items: [
      {
        brand: 'Nike',
        id: 'NikeAirMax90',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
        name: 'Giày Thể Thao Nike Air Max',
        price: 2450000,
        quantity: 1,
      },
    ],
    paymentMethod: 'VNPAY',
    shippingAddress: {
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      name: 'Lê Hoàng Nam',
      phone: '0987654321',
    },
    shippingFee: 30000,
    status: 'success',
    total: 2480000,
    voucherCode: '',
  },
  {
    id: '2kezCoMuFUoKv62ANtC3',
    key: '2kezCoMuFUoKv62ANtC3',
    createdAt: '2026-11-03T14:40:12+07:00',
    discount: 100000,
    items: [
      {
        brand: 'Zara',
        id: 'ZaraJacket01',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80',
        name: 'Áo Khoác Da Biker',
        price: 1850000,
        quantity: 1,
      },
    ],
    paymentMethod: 'Chuyển khoản QR',
    shippingAddress: {
      address: '45 Lê Duẩn, Ba Đình, Hà Nội',
      name: 'Trần Thu Trang',
      phone: '0912345678',
    },
    shippingFee: 0,
    status: 'processing',
    total: 1750000,
    voucherCode: 'SALE100K',
  },
  {
    id: '3sPhZQ8RJjueyL6ZjfQ',
    key: '3sPhZQ8RJjueyL6ZjfQ',
    createdAt: '2026-11-04T09:20:00+07:00',
    discount: 0,
    items: [
      {
        brand: 'Adidas',
        id: 'AdidasCap01',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&q=80',
        name: 'Nón Lưỡi Trai Classic',
        price: 350000,
        quantity: 1,
      },
    ],
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: {
      address: '78 Hai Bà Trưng, Đà Nẵng',
      name: 'Nguyễn Văn Hùng',
      phone: '0934567890',
    },
    shippingFee: 25000,
    status: 'cancelled',
    total: 375000,
    voucherCode: '',
  },
  {
    id: '3zqm94RtJaRcRNxp8Eq8',
    key: '3zqm94RtJaRcRNxp8Eq8',
    createdAt: '2026-11-05T16:45:00+07:00',
    discount: 200000,
    items: [
      {
        brand: 'Sony',
        id: 'SonyWH1000XM5',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80',
        name: 'Tai Nghe Bluetooth Chống Ồn Sony',
        price: 8690000,
        quantity: 1,
      },
    ],
    paymentMethod: 'Thẻ tín dụng',
    shippingAddress: {
      address: '88 Cầu Giấy, Cầu Giấy, Hà Nội',
      name: 'Phạm Minh Đức',
      phone: '0978123456',
    },
    shippingFee: 0,
    status: 'pending',
    total: 8490000,
    voucherCode: 'TECH200',
  },
];

const formatDate = (val) => {
  if (!val) return '—';
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
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${d}/${m}/${y} ${h}:${min}`;
};

const renderStatusTag = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') {
    return <Tag color="orange">Chờ xử lý</Tag>;
  }
  if (s === 'success' || s === 'completed') {
    return <Tag color="green">Thành công</Tag>;
  }
  if (s === 'processing') {
    return <Tag color="blue">Đang xử lý</Tag>;
  }
  if (s === 'cancelled') {
    return <Tag color="red">Đã hủy</Tag>;
  }
  return <Tag color="default">{status}</Tag>;
};

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setOrders(mockOrders);
  };

  const filteredOrders = orders.filter((order) => {
    const s = String(order.status || '').toLowerCase();
    const search = searchTerm.trim().toLowerCase();

    const matchesStatus =
      statusFilter === 'ALL' ||
      s === statusFilter.toLowerCase();

    if (!matchesStatus) return false;

    if (!search) return true;

    const id = String(order.id || '').toLowerCase();
    const name = String(order.shippingAddress?.name || '').toLowerCase();
    const phone = String(order.shippingAddress?.phone || '').toLowerCase();
    const email = String(order.shippingAddress?.email || '').toLowerCase();

    return (
      id.includes(search) ||
      name.includes(search) ||
      phone.includes(search) ||
      email.includes(search)
    );
  });

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Text strong copyable={{ text: id }}>
          {id}
        </Text>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => <Text>{formatDate(val)}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => {
        const addr = record.shippingAddress || {};
        const name = addr.name || addr.email || 'Khách vãng lai';
        const phone = addr.phone;
        return (
          <div>
            <Text strong>{name}</Text>
            {phone && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {phone}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (val) => {
        const num = Number(val) || 0;
        return (
          <Text strong style={{ color: '#cf1322' }}>
            {num.toLocaleString('vi-VN')} ₫
          </Text>
        );
      },
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag color="geekblue">{method || 'Chưa xác định'}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setModalOpen(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>
          Quản lý Đơn hàng
        </Title>
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo mã đơn, tên hoặc SĐT..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 170 }}
          >
            <Option value="ALL">Tất cả trạng thái</Option>
            <Option value="pending">Chờ xử lý (pending)</Option>
            <Option value="processing">Đang xử lý (processing)</Option>
            <Option value="success">Thành công (success)</Option>
            <Option value="cancelled">Đã hủy (cancelled)</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={false}
      />

      <OrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
