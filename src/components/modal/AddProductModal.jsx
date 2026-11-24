import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Upload,
  Divider,
  Space,
  message,
} from 'antd';
import {
  CheckOutlined,
  PlusOutlined,
  PictureOutlined,
  BarcodeOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  DownOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const defaultCategories = ['Kính mát', 'Kính cận', 'Gọng kính'];
const defaultBrands = [
  'Ray-Ban', 'Gucci', 'Gentle Monster', 'Oakley', 'Dior', 'Versace',
  'Burberry', 'Prada', 'Titanium', 'Adidas', 'Salinaka', 'Seko',
];

const btnStyle = { height: 40, padding: '0 24px', borderRadius: 8, fontWeight: 500 };
const inputStyle = { height: 40, borderRadius: 8 };

const SectionTitle = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <div style={{ width: 3, height: 16, backgroundColor: '#fa541c', borderRadius: 2 }} />
    <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{title}</span>
  </div>
);

const FormLabel = ({ title, required }) => (
  <span style={{ fontWeight: 500, fontSize: 13 }}>
    {title} {required && <span style={{ color: '#ff4d4f' }}>*</span>}
  </span>
);

const formatNumber = (v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
const parseNumber = (v) => v?.replace(/,/g, '');

const AddProductModal = ({ open, onClose, onSubmit, categories = [] }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const combinedCategories = Array.from(new Set([...defaultCategories, ...categories].filter(Boolean)));

  const handleBeforeUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chỉ tải lên file hình ảnh!');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      form.setFieldValue('image', base64);
      setFileList([{ uid: file.uid || '-1', name: file.name, status: 'done', url: base64 }]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveImage = (e) => {
    e?.stopPropagation?.();
    setFileList([]);
    form.setFieldValue('image', '');
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value.trim();
    setFileList(val ? [{ uid: '-1', name: 'image.jpg', status: 'done', url: val }] : []);
  };

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      await onSubmit({
        ...values,
        isNew: true,
        isBestSeller: false,
        description: values.description || '',
      });
      form.resetFields();
      setFileList([]);
      onClose();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const currentImageUrl = fileList[0]?.url;

  return (
    <Modal
      title={<span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Thêm sản phẩm mới</span>}
      open={open}
      onCancel={handleCancel}
      width={740}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={submitting} style={btnStyle}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<CheckOutlined />}
          loading={submitting}
          onClick={() => form.submit()}
          style={{ ...btnStyle, backgroundColor: '#1677ff' }}
        >
          Thêm sản phẩm
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{
          stock: 10,
          sold: 0,
          status: 'active',
          category: 'Kính mát',
          brand: 'Ray-Ban',
          price: 3500000,
          originalPrice: 4200000,
        }}
        style={{ marginTop: 16 }}
      >
        <Row gutter={20} align="top" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Upload showUploadList={false} beforeUpload={handleBeforeUpload} accept="image/*" style={{ width: '100%', display: 'block' }}>
              <div
                style={{
                  width: '100%',
                  height: 188,
                  border: '1px dashed #d9d9d9',
                  borderRadius: 10,
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: 8,
                }}
              >
                {currentImageUrl ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={currentImageUrl}
                      alt="uploaded"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
                    />
                    <Button
                      type="primary"
                      danger
                      shape="circle"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveImage}
                      style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                      <PictureOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                      <div
                        style={{
                          position: 'absolute',
                          right: -4,
                          bottom: -2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: '#1677ff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                        }}
                      >
                        <PlusOutlined />
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#262626' }}>Tải ảnh lên</div>
                    <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 3 }}>JPG, PNG • Tối đa 5MB</div>
                  </>
                )}
              </div>
            </Upload>
          </Col>

          <Col xs={24} sm={16}>
            <SectionTitle title="Thông tin cơ bản" />
            <Form.Item
              name="name"
              label={<FormLabel title="Tên sản phẩm" required />}
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="VD: Kính mát Ray-Ban Aviator" style={inputStyle} />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label={<FormLabel title="Danh mục" />}
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    style={{ height: 40 }}
                    suffixIcon={
                      <Space size={4}>
                        <AppstoreOutlined style={{ color: '#8c8c8c' }} />
                        <DownOutlined style={{ color: '#bfbfbf', fontSize: 10 }} />
                      </Space>
                    }
                  >
                    {combinedCategories.map((cat) => (
                      <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="brand"
                  label={<FormLabel title="Thương hiệu (Brand)" />}
                  rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập thương hiệu!' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="VD: Ray-Ban, Gucci, Dior..."
                    style={{ height: 40 }}
                    showSearch
                    allowClear
                    prefix={<BarcodeOutlined style={{ color: '#595959', marginRight: 4 }} />}
                    suffixIcon={<DownOutlined style={{ color: '#bfbfbf', fontSize: 10 }} />}
                  >
                    {defaultBrands.map((b) => (
                      <Option key={b} value={b}>{b}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form.Item name="image" label={<FormLabel title="Hoặc dán URL hình ảnh" />} style={{ marginBottom: 16 }}>
          <Input
            placeholder="https://images.unsplash.com/..."
            onChange={handleImageUrlChange}
            allowClear
            style={inputStyle}
          />
        </Form.Item>

        <Divider style={{ margin: '16px 0 20px', borderColor: '#f0f0f0' }} />
        <SectionTitle title="Giá & kho hàng" />

        <Row gutter={16} style={{ marginBottom: 14 }}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="price"
              label={<FormLabel title="Giá bán (VNĐ)" required />}
              rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                style={{ width: '100%', ...inputStyle }}
                addonAfter="₫"
                placeholder="3,500,000"
                min={0}
                formatter={formatNumber}
                parser={parseNumber}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="originalPrice"
              label={<FormLabel title="Giá gốc / Niêm yết (VNĐ)" />}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                style={{ width: '100%', ...inputStyle }}
                addonAfter="₫"
                placeholder="4,200,000"
                min={0}
                formatter={formatNumber}
                parser={parseNumber}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="stock"
              label={<FormLabel title="Số lượng tồn kho" />}
              rules={[{ required: true, message: 'Vui lòng nhập tồn kho!' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                prefix={<InboxOutlined style={{ color: '#8c8c8c', marginRight: 6 }} />}
                style={{ width: '100%', ...inputStyle }}
                min={0}
                placeholder="10"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="sold" label={<FormLabel title="Đã bán" />} style={{ marginBottom: 0 }}>
              <InputNumber
                prefix={<ShoppingCartOutlined style={{ color: '#8c8c8c', marginRight: 6 }} />}
                style={{ width: '100%', ...inputStyle }}
                min={0}
                placeholder="0"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="status" label={<FormLabel title="Trạng thái" />} style={{ marginBottom: 0 }}>
              <Select style={{ height: 40 }} suffixIcon={<DownOutlined style={{ color: '#bfbfbf', fontSize: 10 }} />}>
                <Option value="active">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#52c41a', display: 'inline-block' }} />
                    <span>Còn hàng</span>
                  </span>
                </Option>
                <Option value="inactive">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff4d4f', display: 'inline-block' }} />
                    <span>Hết hàng</span>
                  </span>
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
