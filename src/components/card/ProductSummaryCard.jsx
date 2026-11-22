import React from 'react';
import { Card, Typography, Divider, Button, Popconfirm, Empty, Image, Tag, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductSummaryCard = ({
  product,
  onEdit,
  onDelete,
}) => {
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

  const tagStyle = {
    padding: '4px 12px',
    fontSize: 13,
    borderRadius: 12,
    border: 'none',
    color: '#fff',
    fontWeight: 500,
  };

  const isOutOfStock = product.stock === 0 || product.status === 'inactive';

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
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
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
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: '#1a1a1a',
            lineHeight: 1.4,
            marginBottom: 4,
          }}
        >
          {product.name}
        </div>
        <div style={{ color: '#8c8c8c', fontSize: 13 }}>
          {product.category ? `${product.category} • ` : ''}{product.brand || 'Chưa phân loại'}
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>Tồn kho</Text>
          <Text strong style={{ fontSize: 14 }}>{product.stock !== undefined ? product.stock : 0}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>Đã bán</Text>
          <Text style={{ fontSize: 14 }}>{product.sold || 0}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>Trạng thái</Text>
          {isOutOfStock ? (
            <Tag bordered={false} color="#ff4d4f" style={tagStyle}>
              Hết hàng
            </Tag>
          ) : (
            <Tag bordered={false} color="#52c41a" style={tagStyle}>
              Còn hàng
            </Tag>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 14 }}>Ngày tạo</Text>
          <Text style={{ fontSize: 14 }}>{formatDate(product.createdAt)}</Text>
        </div>
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
            backgroundColor: '#ffffff',
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
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            style={{ flex: 1, borderRadius: 8 }}
          >
            Xóa
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default ProductSummaryCard;
