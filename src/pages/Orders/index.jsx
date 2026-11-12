import React, { useState } from 'react';
import { Table, Tag, Typography, Space, Button, Input, Select, Card } from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const initialOrders = [
  {
    key: '1',
    orderId: 'ORD-9021',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    itemsCount: 3,
    total: 1250000,
    status: 'COMPLETED',
    paymentMethod: 'COD',
    createdAt: '2026-11-12 18:30',
  },
  {
    key: '2',
    orderId: 'ORD-9020',
    customer: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    itemsCount: 1,
    total: 450000,
    status: 'PROCESSING',
    paymentMethod: 'Chuyển khoản QR',
    createdAt: '2026-11-12 17:15',
  },
  {
    key: '3',
    orderId: 'ORD-9019',
    customer: 'Lê Hoàng C',
    email: 'lehoangc@gmail.com',
    itemsCount: 5,
    total: 3120000,
    status: 'PENDING',
    paymentMethod: 'VNPAY',
    createdAt: '2026-11-12 16:00',
  },
  {
    key: '4',
    orderId: 'ORD-9018',
    customer: 'Phạm Minh D',
    email: 'phamminhd@gmail.com',
    itemsCount: 2,
    total: 890000,
    status: 'CANCELLED',
    paymentMethod: 'COD',
    createdAt: '2026-11-12 14:20',
  },
  {
    key: '5',
    orderId: 'ORD-9017',
    customer: 'Võ Thị Hồng E',
    email: 'vothihonge@gmail.com',
    itemsCount: 4,
    total: 2100000,
    status: 'COMPLETED',
    paymentMethod: 'Thẻ tín dụng',
    createdAt: '2026-11-11 20:10',
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleFilter = (search, status) => {
    let filtered = initialOrders;
    if (search.trim()) {
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'ALL') {
      filtered = filtered.filter((o) => o.status === status);
    }
    setOrders(filtered);
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    handleFilter(val, statusFilter);
  };

  const onStatusChange = (val) => {
    setStatusFilter(val);
    handleFilter(searchTerm, val);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer, record) => (
        <div>
          <div>{customer}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'Số món',
      dataIndex: 'itemsCount',
      key: 'itemsCount',
      align: 'center',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (val) => `${val.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let label = status;
        if (status === 'COMPLETED') {
          color = 'green';
          label = 'Thành công';
        } else if (status === 'PROCESSING') {
          color = 'blue';
          label = 'Đang xử lý';
        } else if (status === 'PENDING') {
          color = 'gold';
          label = 'Chờ xử lý';
        } else if (status === 'CANCELLED') {
          color = 'red';
          label = 'Đã hủy';
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => alert(`Xem chi tiết đơn hàng: ${record.orderId}`)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Quản lý Đơn hàng
          </Title>
          <Text type="secondary">Theo dõi và xử lý đơn hàng từ hệ thống thương mại điện tử</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
            setOrders(initialOrders);
          }}
        >
          Làm mới
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo mã đơn, tên hoặc email..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={onSearchChange}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={onStatusChange}
            style={{ width: 180 }}
          >
            <Option value="ALL">Tất cả trạng thái</Option>
            <Option value="PENDING">Chờ xử lý</Option>
            <Option value="PROCESSING">Đang xử lý</Option>
            <Option value="COMPLETED">Thành công</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Orders;

