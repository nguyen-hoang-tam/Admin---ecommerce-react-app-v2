import React from 'react';
import { Row, Col, Typography, Table, Tag } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import StatisticCard from '../components/dashboard/StatisticCard';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { profile, user } = useSelector((state) => state.auth);

  const statsList = [
    {
      key: 'revenue',
      title: 'Tổng doanh thu',
      value: 128500000,
      precision: 0,
      suffix: '₫',
      prefix: <DollarOutlined style={{ color: '#3f8600' }} />,
      valueStyle: { color: '#1a1a1a', fontWeight: 600 },
    },
    {
      key: 'orders',
      title: 'Tổng đơn hàng',
      value: 1420,
      prefix: <ShoppingCartOutlined style={{ color: '#1677ff' }} />,
      valueStyle: { color: '#1a1a1a', fontWeight: 600 },
    },
    {
      key: 'products',
      title: 'Sản phẩm tồn kho',
      value: 356,
      prefix: <InboxOutlined style={{ color: '#fa8c16' }} />,
      valueStyle: { color: '#1a1a1a', fontWeight: 600 },
    },
    {
      key: 'customers',
      title: 'Khách hàng',
      value: 892,
      prefix: <UserOutlined style={{ color: '#722ed1' }} />,
      valueStyle: { color: '#1a1a1a', fontWeight: 600 },
    },
  ];

  const recentOrdersData = [
    {
      key: '1',
      orderId: 'ORD-9021',
      customer: 'Nguyễn Văn A',
      total: '1.250.000 ₫',
      status: 'COMPLETED',
      date: '2026-11-12 18:30',
    },
    {
      key: '2',
      orderId: 'ORD-9020',
      customer: 'Trần Thị B',
      total: '450.000 ₫',
      status: 'PROCESSING',
      date: '2026-11-12 17:15',
    },
    {
      key: '3',
      orderId: 'ORD-9019',
      customer: 'Lê Hoàng C',
      total: '3.120.000 ₫',
      status: 'PENDING',
      date: '2026-11-12 16:00',
    },
    {
      key: '4',
      orderId: 'ORD-9018',
      customer: 'Phạm Minh D',
      total: '890.000 ₫',
      status: 'CANCELLED',
      date: '2026-11-12 14:20',
    },
  ];

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
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
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>
          Dashboard
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {statsList.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.key}>
            <StatisticCard
              title={stat.title}
              value={stat.value}
              precision={stat.precision}
              suffix={stat.suffix}
              prefix={stat.prefix}
              valueStyle={stat.valueStyle}
            />
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 16, fontSize: 18 }}>
          Đơn hàng gần đây
        </Title>
        <Table
          columns={columns}
          dataSource={recentOrdersData}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
