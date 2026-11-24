import React, { useMemo } from 'react';
import { Card, Typography, Divider, Button, Popconfirm, Empty, Image } from 'antd';
import { CarOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SummaryRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text type="secondary" style={{ fontSize: 14 }}>
      {label}
    </Text>
    {typeof value === 'string' || typeof value === 'number' ? (
      <Text style={{ fontSize: 14 }}>{value}</Text>
    ) : (
      value
    )}
  </div>
);

const OrderSummaryCard = ({ order, onUpdateStatus, onViewDetails }) => {
  const calculations = useMemo(() => {
    if (!order) {
      return {
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        total: 0,
        shippingMethod: 'Giao hàng tiêu chuẩn',
        isActionDisabled: true,
      };
    }

    const rawItems = Array.isArray(order.items) ? order.items : [];
    const items = rawItems.map((item, idx) => ({
      key: item.id || idx,
      image: item.image || '',
      name: item.name || 'Sản phẩm',
      brand: item.brand || item.variant || 'Khác',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    }));

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const calculatedSubtotal = items.length > 0
      ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : Number(order.total) || 0;

    const shippingFee = Number(order.shippingFee) || 0;
    const discount = Number(order.discount) || 0;
    const total = order.total !== undefined ? Number(order.total) : calculatedSubtotal + shippingFee - discount;
    const shippingMethod = order.shippingMethod || order.deliveryMethod || 'Giao hàng tiêu chuẩn';
    const isActionDisabled = order.status === 'success' || order.status === 'completed' || order.status === 'cancelled';

    return {
      items,
      totalQuantity,
      subtotal: calculatedSubtotal,
      shippingFee,
      discount,
      total,
      shippingMethod,
      isActionDisabled,
    };
  }, [order]);

  if (!order) {
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
        <Empty description="Chưa có đơn hàng nào được chọn" />
      </Card>
    );
  }

  const orderStatus = (order.status || 'pending').toLowerCase();
  const isProcessing = orderStatus === 'processing';
  const isSuccess = orderStatus === 'success' || orderStatus === 'completed';
  const isCancelled = orderStatus === 'cancelled';

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
          Thông tin đơn hàng
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {calculations.totalQuantity} sản phẩm
        </Text>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 4, marginBottom: 8 }}>
        {calculations.items.length > 0 ? (
          calculations.items.map((item, index) => (
            <div
              key={item.key || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: index === calculations.items.length - 1 ? 0 : 16,
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={48}
                height={48}
                preview={false}
                fallback="https://via.placeholder.com/48"
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #f0f0f0',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1a1a1a',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.name}
                >
                  {item.name}
                </div>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 2 }}>{item.brand}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#595959', fontSize: 13 }}>x{item.quantity}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginTop: 2 }}>
                  {item.price.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '12px 0', color: '#8c8c8c', fontSize: 13, textAlign: 'center' }}>
            Không có danh sách sản phẩm
          </div>
        )}
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SummaryRow label="Tạm tính" value={`${calculations.subtotal.toLocaleString('vi-VN')}đ`} />
        <SummaryRow
          label="Phí vận chuyển"
          value={
            calculations.shippingFee === 0 ? (
              <span style={{ color: '#52c41a', fontWeight: 600, fontSize: 14 }}>Miễn phí</span>
            ) : (
              `${calculations.shippingFee.toLocaleString('vi-VN')}đ`
            )
          }
        />
        <SummaryRow label="Giảm giá" value={`- ${calculations.discount.toLocaleString('vi-VN')}đ`} />
        <SummaryRow label="Phương thức giao hàng" value={calculations.shippingMethod} />
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>
          Tổng cộng
        </Title>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#001529' }}>
          {calculations.total.toLocaleString('vi-VN')}đ
        </span>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '12px 16px',
          backgroundColor: '#f0f5ff',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <CarOutlined style={{ fontSize: 24, color: '#1677ff' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>
            Thời gian giao hàng dự kiến
          </div>
          <div style={{ color: '#595959', fontSize: 12, marginTop: 2 }}>2 - 5 ngày làm việc</div>
        </div>
      </div>

      {!isSuccess && !isCancelled && (
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <Popconfirm
            title="Từ chối đơn hàng"
            description="Bạn có chắc chắn muốn từ chối đơn hàng này?"
            onConfirm={(e) => onUpdateStatus(order.id, 'cancelled', e)}
            okText="Từ chối"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="large" icon={<CloseOutlined />} style={{ flex: 1, borderRadius: 8 }}>
              Từ chối
            </Button>
          </Popconfirm>

          <Popconfirm
            title={isProcessing ? 'Xác nhận thành công' : 'Xác nhận đơn hàng'}
            description={
              isProcessing
                ? 'Xác nhận đơn hàng này đã hoàn tất thành công?'
                : 'Bạn có chắc chắn muốn xác nhận đơn hàng này?'
            }
            onConfirm={(e) => onUpdateStatus(order.id, isProcessing ? 'success' : 'processing', e)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: isProcessing ? '#52c41a' : '#1677ff',
                borderColor: isProcessing ? '#52c41a' : '#1677ff',
              }}
            >
              {isProcessing ? 'Xác nhận thành công' : 'Xác nhận đơn'}
            </Button>
          </Popconfirm>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={onViewDetails}
          style={{ fontSize: 13, color: '#1677ff', padding: 0 }}
        >
          Xem chi tiết đầy đủ đơn hàng
        </Button>
      </div>
    </Card>
  );
};

export default OrderSummaryCard;
