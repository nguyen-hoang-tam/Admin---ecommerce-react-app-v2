import React from 'react';
import { Tag } from 'antd';

const STATUS_MAP = {
  pending: { color: '#fa8c16', label: 'Chờ xác nhận' },
  processing: { color: '#1677ff', label: 'Chờ xử lý' },
  success: { color: '#52c41a', label: 'Thành công' },
  completed: { color: '#52c41a', label: 'Thành công' },
  cancelled: { color: '#ff4d4f', label: 'Đã hủy' },
};

const tagStyle = {
  padding: '4px 12px',
  fontSize: 13,
  borderRadius: 12,
  border: 'none',
  color: '#fff',
  fontWeight: 500,
};

const OrderStatusTag = ({ status, style }) => {
  const item = STATUS_MAP[String(status || '').toLowerCase()] || {
    color: '#8c8c8c',
    label: status || '—',
  };

  return (
    <Tag bordered={false} color={item.color} style={{ ...tagStyle, ...style }}>
      {item.label}
    </Tag>
  );
};

export default OrderStatusTag;
