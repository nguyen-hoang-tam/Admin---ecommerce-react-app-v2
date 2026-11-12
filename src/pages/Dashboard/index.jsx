import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  InboxOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { profile, user } = useSelector((state) => state.auth);

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
        <Title level={3} style={{ marginBottom: 4 }}>
          Tổng quan Dashboard
        </Title>
        <Text type="secondary">
          Chào mừng trở lại, {profile?.displayName || user?.displayName || user?.email || 'Admin'}!
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Statistic
              title="Tổng doanh thu"
              value={128500000}
              precision={0}
              suffix="₫"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#3f8600' }}>
              <ArrowUpOutlined /> +12.5% so với tháng trước
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#e6f4ff', border: '1px solid #91caff' }}>
            <Statistic
              title="Tổng đơn hàng"
              value={1420}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#0958d9' }}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#0958d9' }}>
              <ArrowUpOutlined /> +8.2% tuần này
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
            <Statistic
              title="Sản phẩm tồn kho"
              value={356}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#d46b08' }}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#8c8c8c' }}>
              12 sản phẩm sắp hết hàng
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#f9f0ff', border: '1px solid #d3adf7' }}>
            <Statistic
              title="Khách hàng"
              value={892}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#531dab' }}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: '#531dab' }}>
              <ArrowUpOutlined /> +24 khách mới hôm nay
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
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

