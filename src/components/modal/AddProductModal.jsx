import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Select, Row, Col, Upload, Divider, message } from 'antd';
import {
  CheckOutlined, PlusOutlined, PictureOutlined, BarcodeOutlined,
  AppstoreOutlined, InboxOutlined, ShoppingCartOutlined, DeleteOutlined,
} from '@ant-design/icons';

const defaultCategories = ['Kính mát', 'Kính cận', 'Gọng kính'];
const defaultBrands = [
  'Ray-Ban', 'Gucci', 'Gentle Monster', 'Oakley', 'Dior', 'Versace',
  'Burberry', 'Prada', 'Titanium', 'Adidas', 'Salinaka', 'Seko',
];

const SectionTitle = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    <div style={{ width: 3, height: 16, backgroundColor: '#fa541c', borderRadius: 2 }} />
    <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{title}</span>
  </div>
);

const inputStyle = { height: 40, borderRadius: 8 };

const AddProductModal = ({ open, onClose, onSubmit, categories = [], initialData = null }) => {
  const editing = Boolean(initialData);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = Array.from(new Set([...defaultCategories, ...categories].filter(Boolean)))
    .map((c) => ({ label: c, value: c }));

  const brandOptions = defaultBrands.map((b) => ({ label: b, value: b }));

  const handleBeforeUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chỉ tải lên file hình ảnh!');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImageUrl(base64);
      form.setFieldValue('image', base64);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveImage = (e) => {
    e?.stopPropagation?.();
    setImageUrl('');
    form.setFieldValue('image', '');
  };

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      const payload = editing
        ? { ...values, description: values.description || '' }
        : { ...values, isNew: true, isBestSeller: false, description: values.description || '' };
      await onSubmit(payload);
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    form.resetFields();
    setImageUrl('');
    onClose();
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue(initialData);
        setImageUrl(initialData.image || '');
      } else {
        form.resetFields();
        setImageUrl('');
      }
    }
  }, [open, initialData, form]);

  return (
    <Modal
      title={<span style={{ fontSize: 18, fontWeight: 700 }}>{editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</span>}
      open={open}
      onCancel={handleClose}
      width={740}
      centered
      destroyOnClose
      okText={editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
      cancelText="Hủy bỏ"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      okButtonProps={{ icon: <CheckOutlined />, style: { height: 40, padding: '0 24px', borderRadius: 8, backgroundColor: '#1677ff' } }}
      cancelButtonProps={{ style: { height: 40, padding: '0 24px', borderRadius: 8 } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          stock: 10, sold: 0, status: 'active',
          category: 'Kính mát', brand: 'Ray-Ban',
          price: 3500000, originalPrice: 4200000,
        }}
        style={{ marginTop: 16 }}
      >
        <Row gutter={20} align="top" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Upload showUploadList={false} beforeUpload={handleBeforeUpload} accept="image/*" style={{ width: '100%', display: 'block' }}>
              <div style={{
                width: '100%', height: 188, border: '1px dashed #d9d9d9', borderRadius: 10,
                backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: 8
              }}>
                {imageUrl ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                    <Button type="primary" danger shape="circle" size="small" icon={<DeleteOutlined />} onClick={handleRemoveImage} style={{ position: 'absolute', top: 4, right: 4 }} />
                  </div>
                ) : (
                  <>
                    <div style={{ position: 'relative', marginBottom: 8 }}>
                      <PictureOutlined style={{ fontSize: 44, color: '#bfbfbf' }} />
                      <PlusOutlined style={{ position: 'absolute', right: -4, bottom: -2, padding: 3, borderRadius: '50%', backgroundColor: '#1677ff', color: '#fff', fontSize: 10 }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#262626' }}>Tải ảnh lên</span>
                    <span style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>JPG, PNG • Tối đa 5MB</span>
                  </>
                )}
              </div>
            </Upload>
          </Col>

          <Col xs={24} sm={16}>
            <SectionTitle title="Thông tin cơ bản" />
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
              <Input placeholder="VD: Kính mát Ray-Ban Aviator" style={inputStyle} />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                  <Select placeholder="Chọn danh mục" style={{ height: 40 }} options={categoryOptions} suffixIcon={<AppstoreOutlined style={{ color: '#8c8c8c' }} />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}>
                  <Select placeholder="Chọn thương hiệu" style={{ height: 40 }} showSearch allowClear options={brandOptions} prefix={<BarcodeOutlined style={{ color: '#8c8c8c', marginRight: 4 }} />} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item name="image" label="Hoặc dán URL hình ảnh">
          <Input
            placeholder="https://images.unsplash.com/..."
            style={inputStyle}
            allowClear
            onChange={(e) => {
              const url = e.target.value.trim();
              setImageUrl(url);
              form.setFieldValue('image', url);
            }}
          />
        </Form.Item>

        <Divider style={{ margin: '16px 0 20px' }} />

        <SectionTitle title="Giá & kho hàng" />
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}>
              <InputNumber
                style={{ width: '100%', ...inputStyle }}
                addonAfter="₫"
                placeholder="3,500,000"
                min={0}
                formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(v) => v?.replace(/,/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="originalPrice" label="Giá gốc / Niêm yết (VNĐ)">
              <InputNumber
                style={{ width: '100%', ...inputStyle }}
                addonAfter="₫"
                placeholder="4,200,000"
                min={0}
                formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(v) => v?.replace(/,/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="stock" label="Số lượng tồn kho" rules={[{ required: true, message: 'Vui lòng nhập tồn kho!' }]}>
              <InputNumber prefix={<InboxOutlined style={{ color: '#8c8c8c', marginRight: 6 }} />} style={{ width: '100%', ...inputStyle }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="sold" label="Đã bán">
              <InputNumber prefix={<ShoppingCartOutlined style={{ color: '#8c8c8c', marginRight: 6 }} />} style={{ width: '100%', ...inputStyle }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="status" label="Trạng thái">
              <Select
                style={{ height: 40 }}
                options={[
                  { value: 'active', label: <span style={{ color: '#52c41a', fontWeight: 500 }}>● Còn hàng</span> },
                  { value: 'inactive', label: <span style={{ color: '#ff4d4f', fontWeight: 500 }}>● Hết hàng</span> },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
