import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Space, Button, Input, Select, message, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import OrderDetailModal from '../components/orders/OrderDetailModal';

import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = [];
      const querySnapshot = await getDocs(collection(db, 'orders'));

      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          key: doc.id,
          ...doc.data(),
        });
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Lỗi fetch data: ", error);
      message.error("Không thể tải danh sách đơn hàng!");
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
          : 'Đã xác nhận đơn hàng'
      );
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
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

  const renderStatusTag = (status) => {
    const s = String(status || '').toLowerCase();
    const tagStyle = { padding: '4px 12px', fontSize: 13, borderRadius: 12 };
    if (s === 'pending') return <Tag color="orange" style={tagStyle}>Chờ xử lý</Tag>;
    if (s === 'success' || s === 'completed') return <Tag color="green" style={tagStyle}>Thành công</Tag>;
    if (s === 'processing') return <Tag color="blue" style={tagStyle}>Đang xử lý</Tag>;
    if (s === 'cancelled') return <Tag color="red" style={tagStyle}>Đã hủy</Tag>;
    return <Tag color="default" style={tagStyle}>{status}</Tag>;
  };

  const filteredOrders = orders.filter((order) => {
    const s = String(order.status || '').toLowerCase();
    const search = searchTerm.trim().toLowerCase();

    const matchesStatus = statusFilter === 'ALL' || s === statusFilter.toLowerCase();
    if (!matchesStatus) return false;
    if (!search) return true;

    const id = String(order.id || '').toLowerCase();
    const name = String(order.shippingAddress?.name || '').toLowerCase();
    const phone = String(order.shippingAddress?.phone || '').toLowerCase();
    const email = String(order.shippingAddress?.email || '').toLowerCase();

    return id.includes(search) || name.includes(search) || phone.includes(search) || email.includes(search);
  });

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 180,
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
      render: (val) => <Text>{formatDate(val)}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 180,
      render: (_, record) => {
        const addr = record.shippingAddress || {};
        const customer = addr.email || addr.name || record.email || record.userEmail || 'Khách vãng lai';
        return (
          <Text strong style={{ wordBreak: 'break-word' }}>
            {customer}
          </Text>
        );
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 140,
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
      width: 170,
      render: (method) => (
        <Tag color="geekblue" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 12 }}>
          {method || 'Chưa xác định'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => renderStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 240,
      align: 'center',
      render: (_, record) => {
        const isFinished = record.status === 'success' || record.status === 'completed';
        const isCancelled = record.status === 'cancelled';
        const isActionDisabled = isFinished || isCancelled;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Space size="small">
              <Popconfirm
                title="Xác nhận đơn hàng"
                description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                onConfirm={(e) =>
                  handleUpdateStatus(
                    record.id,
                    record.status === 'pending' ? 'processing' : 'success',
                    e
                  )
                }
                okText="Đồng ý"
                cancelText="Hủy"
                disabled={isActionDisabled}
              >
                <Button
                  size="middle"
                  type="primary"
                  icon={<CheckOutlined />}
                  disabled={isActionDisabled}
                  style={{
                    backgroundColor: isActionDisabled ? undefined : '#3bb000ff',
                    borderColor: isActionDisabled ? undefined : '#3bb000ff',
                  }}
                >
                  Xác nhận
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Từ chối đơn hàng"
                description="Bạn có chắc chắn muốn từ chối đơn hàng này?"
                onConfirm={(e) => handleUpdateStatus(record.id, 'cancelled', e)}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                disabled={isActionDisabled}
              >
                <Button
                  size="middle"
                  danger
                  icon={<CloseOutlined />}
                  disabled={isActionDisabled}
                >
                  Từ chối
                </Button>
              </Popconfirm>
            </Space>
          </div>
        );
      },
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
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1180 }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedOrder(record);
            setModalOpen(true);
          },
          style: { cursor: 'pointer' },
        })}
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