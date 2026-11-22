import React, { useState } from 'react';
import {
    Modal, Button, Typography, Form, Input, InputNumber,
    Row, Col, Flex, Divider, Upload, Image, message,
} from 'antd';
import { BarcodeOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AddProductModal = ({ open, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

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

    const handleRemove = () => {
        setFileList([]);
        form.setFieldValue('image', '');
    };

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleFinish = (values) => {
        onSubmit(values);
        form.resetFields();
        setFileList([]);
        onClose();
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onClose();
    };

    const modalTitle = <Text strong style={{ fontSize: 16 }}>Thêm sản phẩm mới</Text>;

    const modalFooter = [
        <Button key="cancel" onClick={handleCancel}>
            Hủy bỏ
        </Button>,
        <Button key="submit" type="primary" icon={<CheckOutlined />} onClick={() => form.submit()}>
            Thêm sản phẩm
        </Button>,
    ];

    return (
        <Modal
            title={modalTitle}
            footer={modalFooter}
            open={open}
            onCancel={handleCancel}
            width={480}
            destroyOnClose
        >
            <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
                <Flex vertical gap={16}>

                    <section>
                        <Divider style={{ margin: '12px 0' }} />

                        <Flex vertical align="center" gap={12}>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={handleBeforeUpload}
                                onRemove={handleRemove}
                                onPreview={handlePreview}
                                maxCount={1}
                                accept="image/*"
                                style={{ width: 450, height: 100 }}
                            >
                                {fileList.length >= 1 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Flex>

                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </section>

                    <section>
                        <Text strong>Thông tin cơ bản</Text>
                        <Divider style={{ margin: '12px 0' }} />

                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                        >
                            <Input size="large" placeholder="VD: Kính mát Gucci" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="brand"
                                    label="Thương hiệu"
                                    rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}
                                >
                                    <Input size="large" prefix={<BarcodeOutlined />} placeholder="VD: Gucci, Adidas..." />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="price"
                                    label="Giá bán (VNĐ)"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                                >
                                    <InputNumber
                                        size="large"
                                        style={{ width: '100%' }}
                                        addonAfter="₫"
                                        placeholder="3,500,000"
                                        min={0}
                                        formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                        parser={(value) => value?.replace(/,/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </section>

                </Flex>
            </Form>
        </Modal>
    );
};

export default AddProductModal;