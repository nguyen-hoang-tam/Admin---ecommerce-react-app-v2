import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Input,
  Select,
  Image,
  message,
  Card,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { db } from '../lib/firebase';
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

import AddProductModal from '../components/modal/AddProductModal';

const { Title, Text } = Typography;
const { Option } = Select;

const syntaxHighlight = (jsonStr) => {
  if (!jsonStr) return '';
  const escaped = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let color = '#0969da';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#24292f';
        } else {
          color = '#8250df';
        }
      } else if (/true|false/.test(match)) {
        color = '#0550ae';
      } else if (/null/.test(match)) {
        color = '#6e7781';
      } else {
        color = '#cf222e';
      }
      return `<span style="color:${color}">${match}</span>`;
    }
  );
};

const ProductJsonViewer = ({ record }) => {
  const [searchProperty, setSearchProperty] = useState('');

  const displayData = useMemo(() => {
    const raw = { ...record };
    delete raw.key;
    if (!searchProperty.trim()) return raw;
    const term = searchProperty.toLowerCase();
    const result = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (k.toLowerCase().includes(term) || JSON.stringify(v).toLowerCase().includes(term)) {
        result[k] = v;
      }
    });
    return result;
  }, [record, searchProperty]);

  const jsonString = useMemo(() => {
    return JSON.stringify(displayData, null, 2);
  }, [displayData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    message.success('Đã sao chép JSON vào clipboard!');
  };

  return (
    <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderRadius: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder="Search properties..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchProperty}
          onChange={(e) => setSearchProperty(e.target.value)}
          style={{ width: 260, borderRadius: 6 }}
          allowClear
          size="middle"
        />
      </div>

      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          border: '1px solid #e1e4e8',
          borderRadius: 8,
          padding: '16px 20px',
        }}
      >
        <Tooltip title="Sao chép JSON">
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined style={{ color: '#595959' }} />}
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
            }}
          />
        </Tooltip>

        <pre
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.6,
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
            maxHeight: 380,
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
        </pre>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [addModalVisible, setAddModalVisible] = useState(false);

  const processProductsData = (snapshot) => {
    const productsData = [];
    snapshot.forEach((docItem) => {
      productsData.push({
        id: docItem.id,
        key: docItem.id,
        ...docItem.data(),
      });
    });

    productsData.sort((a, b) => {
      const timeA = a.createdAt?.seconds || (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0) || 0;
      const timeB = b.createdAt?.seconds || (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0) || 0;
      return timeB - timeA;
    });

    setProducts(productsData);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      processProductsData(querySnapshot);
    } catch (error) {
      console.error('Lỗi fetch data: ', error);
      message.error('Không thể tải danh sách sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        processProductsData(snapshot);
        setLoading(false);
      },
      (error) => {
        console.error('Lỗi onSnapshot: ', error);
        message.error('Không thể kết nối danh sách sản phẩm!');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (values) => {
    try {
      await addDoc(collection(db, 'products'), {
        name: values.name,
        brand: values.brand,
        price: Number(values.price) || 0,
        image: values.image || '',
        stock: values.stock !== undefined ? Number(values.stock) || 0 : 0,
        sold: 0,
        status: values.status || 'active',
        createdAt: serverTimestamp(),
      });
      message.success('Thêm sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi thêm sản phẩm: ', error);
      message.error('Không thể thêm sản phẩm!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      message.success('Đã xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi xóa sản phẩm: ', error);
      message.error('Không thể xóa sản phẩm!');
    }
  };

  const handleEditProduct = (product) => {
    message.info(`Chức năng chỉnh sửa đang hoàn thiện cho: ${product.name}`);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
      );
    });
  }, [products, categoryFilter, searchTerm]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  }, [products]);

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

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      align: 'center',
      render: (src) => (
        <Image
          src={src}
          alt="product"
          width={44}
          height={44}
          fallback="https://via.placeholder.com/44"
          preview={false}
          style={{ objectFit: 'cover', borderRadius: 8, backgroundColor: '#f5f5f5', border: '1px solid #f0f0f0' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text strong style={{ fontSize: 14 }}>{text}</Text>
            {record.isNew && (
              <Tag bordered={false} color="cyan" style={{ fontSize: 11, padding: '0 6px', borderRadius: 4 }}>
                Mới
              </Tag>
            )}
            {record.isBestSeller && (
              <Tag bordered={false} color="gold" style={{ fontSize: 11, padding: '0 6px', borderRadius: 4 }}>
                Bán chạy
              </Tag>
            )}
          </div>
          {record.description && (
            <div
              style={{
                fontSize: 12,
                color: '#8c8c8c',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 240,
                marginTop: 2,
              }}
              title={record.description}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => (
        <Tag bordered={false} color="blue" style={{ padding: '3px 10px', fontSize: 12, borderRadius: 10 }}>
          {cat || 'Khác'}
        </Tag>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 110,
      render: (brand) => (
        <Tag bordered={false} color="geekblue" style={{ padding: '3px 10px', fontSize: 12, borderRadius: 10, border: 'none' }}>
          {brand || 'Khác'}
        </Tag>
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      render: (val, record) => {
        const hasDiscount = record.originalPrice && Number(record.originalPrice) > Number(val);
        return (
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#001529' }}>
              {Number(val || 0).toLocaleString('vi-VN')} ₫
            </div>
            {hasDiscount && (
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                {Number(record.originalPrice).toLocaleString('vi-VN')} ₫
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 85,
      align: 'center',
      render: (stock) => {
        const qty = Number(stock !== undefined ? stock : 0);
        return (
          <Text strong style={{ color: qty === 0 ? '#ff4d4f' : '#1a1a1a' }}>
            {qty}
          </Text>
        );
      },
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      key: 'sold',
      width: 85,
      align: 'center',
      render: (sold) => <Text>{sold !== undefined ? sold : 0}</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 115,
      align: 'center',
      render: (_, record) => {
        const isOutOfStock = record.stock === 0 || record.status === 'inactive';
        const tagStyle = {
          padding: '4px 12px',
          fontSize: 13,
          borderRadius: 12,
          border: 'none',
          color: '#fff',
          fontWeight: 500,
        };
        if (isOutOfStock) {
          return (
            <Tag bordered={false} color="#ff4d4f" style={tagStyle}>
              Hết hàng
            </Tag>
          );
        }
        return (
          <Tag bordered={false} color="#52c41a" style={tagStyle}>
            Còn hàng
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      align: 'center',
      render: (val) => <Text style={{ fontSize: 13 }}>{formatDate(val)}</Text>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EditOutlined style={{ color: '#040404' }} />}
            style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9', borderRadius: 6 }}
            onClick={() => handleEditProduct(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ borderRadius: 6 }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
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
            Quản lý sản phẩm ({filteredProducts.length})
          </Title>
          <Space wrap size="middle">
            <Input
              placeholder="Tìm theo tên sản phẩm..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Select
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              style={{ width: 160 }}
            >
              <Option value="ALL">Tất cả danh mục</Option>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                fetchProducts();
              }}
            >
              Làm mới
            </Button>
            <Button
              onClick={() => setAddModalVisible(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Thêm sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            pageSizeOptions: ['8', '12', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng ${total} sản phẩm`,
          }}
          expandable={{
            expandedRowRender: (record) => <ProductJsonViewer record={record} />,
            rowExpandable: () => true,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <AddProductModal
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default ProductManagement;
