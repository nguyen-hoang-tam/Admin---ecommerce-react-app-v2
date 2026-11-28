import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Row,
  Col,
  Card,
} from 'antd';
import dayjs from 'dayjs';
import {
  SearchOutlined,
  ReloadOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import OrderDetailModal from '../components/modal/OrderDetailModal';
import OrderSummaryCard from '../components/card/OrderSummaryCard';
import OrderStatusTag from '../components/common/OrderStatusTag';

import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = [];
      const querySnapshot = await getDocs(collection(db, 'orders'));

      querySnapshot.forEach((docItem) => {
        ordersData.push({
          id: docItem.id,
          key: docItem.id,
          ...docItem.data(),
        });
      });

      setOrders(ordersData);
      if (ordersData.length > 0) {
        setSelectedOrder((prev) => {
          if (!prev) return ordersData[0];
          const matched = ordersData.find((o) => o.id === prev.id);
          return matched || ordersData[0];
        });
      }
    } catch (error) {
      console.error('Lỗi fetch data: ', error);
      message.error('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDateRange(null);
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus, e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
      });
      message.success(
        newStatus === 'cancelled'
          ? 'Đã từ chối đơn hàng'
          : newStatus === 'success'
            ? 'Đã xác nhận thành công đơn hàng'
            : 'Đã xác nhận đơn hàng'
      );
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Lỗi cập trạng thái:', error);
      message.error('Không thể cập nhật trạng thái đơn hàng!');
    }
  };

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const s = String(order.status || '').toLowerCase();
      const search = searchTerm.trim().toLowerCase();

      const matchesStatus = statusFilter === 'ALL' || s === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (dateRange && dateRange[0] && dateRange[1]) {
        let orderDate = null;
        const val = order.createdAt;
        if (val) {
          if (typeof val.toDate === 'function') {
            orderDate = val.toDate();
          } else if (val.seconds) {
            orderDate = new Date(val.seconds * 1000);
          } else {
            orderDate = new Date(val);
          }
        }
        if (!orderDate || isNaN(orderDate.getTime())) {
          return false;
        }
        const start = dateRange[0].startOf('day').valueOf();
        const end = dateRange[1].endOf('day').valueOf();
        const orderTime = orderDate.getTime();
        if (orderTime < start || orderTime > end) {
          return false;
        }
      }

      if (!search) return true;

      const id = String(order.id || '').toLowerCase();
      const name = String(order.shippingAddress?.name || '').toLowerCase();
      const phone = String(order.shippingAddress?.phone || '').toLowerCase();
      const email = String(order.shippingAddress?.email || '').toLowerCase();

      return id.includes(search) || name.includes(search) || phone.includes(search) || email.includes(search);
    });
  }, [orders, statusFilter, searchTerm, dateRange]);

  useEffect(() => {
    if (filteredOrders.length > 0) {
      if (!selectedOrder || !filteredOrders.some((o) => o.id === selectedOrder.id)) {
        setSelectedOrder(filteredOrders[0]);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [filteredOrders]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
            width: '100%',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Text
            strong
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
            title={id}
          >
            {id}
          </Text>
          <Tooltip title="Sao chép mã">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined style={{ color: '#1677ff' }} />}
              onClick={(e) => {
                e.stopPropagation();
                if (id) {
                  navigator.clipboard.writeText(id);
                  message.success('Đã sao chép mã đơn hàng');
                }
              }}
              style={{ flexShrink: 0, padding: '0 4px' }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => {
        const getTime = (val) => {
          if (!val) return 0;
          if (typeof val.toDate === 'function') return val.toDate().getTime();
          if (val.seconds) return val.seconds * 1000;
          const d = new Date(val);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };
        return getTime(a.createdAt) - getTime(b.createdAt);
      },
      render: (val) => <Text>{formatDate(val)}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 160,
      render: (_, record) => {
        const addr = record.shippingAddress || {};
        const customer = addr.email || addr.name || record.email || record.userEmail || 'Khách vãng lai';
        return (
          <Text style={{ wordBreak: 'break-word' }}>
            {customer}
          </Text>
        );
      },
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 200,
      render: (method) => <Text>{method || 'Chưa xác định'}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <OrderStatusTag status={status} />,
    },
  ];

  return (
    <div>
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} xl={17} style={{ flex: '7 7 0%', minWidth: 0 }}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid #f0f0f0',
            }}
            styles={{ body: { padding: 24 } }}
          >
            <div
              style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <Title level={4} style={{ margin: 0, fontSize: 18 }}>
                Quản lý Đơn hàng
              </Title>
              <Space wrap size="middle">
                <Input
                  placeholder="Tìm mã đơn, tên, SĐT..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 220 }}
                  allowClear
                />
                <Select
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  style={{ width: 170 }}
                >
                  <Option value="ALL">Tất cả trạng thái</Option>
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="processing">Chờ xử lý</Option>
                  <Option value="success">Thành công</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates)}
                  format="DD/MM/YYYY"
                  placeholder={['Từ ngày', 'Đến ngày']}
                  style={{ width: 240 }}
                  allowClear
                  presets={[
                    { label: 'Hôm nay', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
                    { label: '7 ngày qua', value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')] },
                    { label: '30 ngày qua', value: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')] },
                    { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
                  ]}
                />
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  Làm mới
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredOrders}
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 770 }}
              rowClassName={(record) => (record.id === selectedOrder?.id ? 'active-order-row' : '')}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedOrder(record);
                },
                style: { cursor: 'pointer' },
              })}
            />
          </Card>
        </Col>

        <Col xs={24} xl={7} style={{ flex: '3 3 0%', minWidth: 340 }}>
          <OrderSummaryCard
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={() => setModalOpen(true)}
          />
        </Col>
      </Row>

      <OrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        confirm={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManagement;
