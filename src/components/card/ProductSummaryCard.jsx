import React from 'react';
import { Card, Typography, Divider, Button, Popconfirm, Empty, Image, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RowItem = ({ label, value, strong }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text type="secondary" style={{ fontSize: 14 }}>
      {label}
    </Text>
    {typeof value === 'string' || typeof value === 'number' ? (
      <Text strong={strong} style={{ fontSize: 14 }}>
        {value}
      </Text>
    ) : (
      value
    )}
  </div>
);

const ProductSummaryCard = ({ product, onEdit, onDelete }) => {
  if (!product) {
    return (
      <Card
        style={{
          borderRadius: 16,
          position: 'sticky',
          top: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f0f0f0',
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Empty description="Chưa có sản phẩm nào được chọn" />
      </Card>
    );
  }

  const isOutOfStock = product.stock === 0 || product.status === 'inactive';
  const tagStyle = {
    padding: '4px 12px',
    fontSize: 13,
    borderRadius: 12,
    border: 'none',
    color: '#fff',
    fontWeight: 500,
  };

  const formatDate = (val) => {
    if (!val) return '—';
    const date = typeof val.toDate === 'function'
      ? val.toDate()
      : val.seconds
        ? new Date(val.seconds * 1000)
        : new Date(val);
    if (isNaN(date.getTime())) return String(val);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        position: 'sticky',
        top: 24,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid #f0f0f0',
      }}
      styles={{ body: { padding: 24 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
          Thông tin sản phẩm
        </Title>
        <Tag bordered={false} color="geekblue" style={{ padding: '3px 10px', fontSize: 12, borderRadius: 10, border: 'none' }}>
          {product.brand || 'Khác'}
        </Tag>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Image
          src={product.image}
          alt={product.name}
          height={180}
          width="100%"
          fallback="https://via.placeholder.com/180"
          preview={false}
          style={{
            objectFit: 'cover',
            borderRadius: 12,
            backgroundColor: '#f5f5f5',
            border: '1px solid #f0f0f0',
          }}
        />
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 4 }}>
          {product.name}
        </div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>
          {product.category ? `${product.category} • ` : ''}
          {product.brand || 'Chưa phân loại'}
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RowItem label="Tồn kho" value={product.stock !== undefined ? product.stock : 0} strong />
        <RowItem label="Đã bán" value={product.sold || 0} />
        <RowItem
          label="Trạng thái"
          value={
            <Tag bordered={false} color={isOutOfStock ? '#ff4d4f' : '#52c41a'} style={tagStyle}>
              {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
            </Tag>
          }
        />
        <RowItem label="Ngày tạo" value={formatDate(product.createdAt)} />
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>
          Giá bán
        </Title>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#001529' }}>
          {Number(product.price || 0).toLocaleString('vi-VN')} ₫
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button
          type="default"
          size="large"
          icon={<EditOutlined style={{ color: '#040404' }} />}
          onClick={() => onEdit && onEdit(product)}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderColor: '#d9d9d9',
            borderRadius: 8,
          }}
        >
          Sửa
        </Button>

        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => onDelete && onDelete(product.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="primary" danger size="large" icon={<DeleteOutlined />} style={{ flex: 1, borderRadius: 8 }}>
            Xóa
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default ProductSummaryCard;
