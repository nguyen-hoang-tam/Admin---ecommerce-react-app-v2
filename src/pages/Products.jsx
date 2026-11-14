import React, { useState } from 'react';
import { Table, Tag, Typography, Space, Button, Input, Select, Image } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const initialProducts = [
  {
    key: '1',
    code: 'PRD-001',
    name: 'Áo Thun Nam Basic Cotton',
    category: 'Thời trang nam',
    price: 199000,
    stock: 120,
    status: 'IN_STOCK',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&q=80',
  },
  {
    key: '2',
    code: 'PRD-002',
    name: 'Quần Jean Slim Fit Co Giãn',
    category: 'Thời trang nam',
    price: 450000,
    stock: 45,
    status: 'IN_STOCK',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=100&q=80',
  },
  {
    key: '3',
    code: 'PRD-003',
    name: 'Váy Nữ Dáng Xòe Vintage',
    category: 'Thời trang nữ',
    price: 380000,
    stock: 8,
    status: 'LOW_STOCK',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&q=80',
  },
  {
    key: '4',
    code: 'PRD-004',
    name: 'Áo Khoác Bomber Unisex',
    category: 'Áo khoác',
    price: 620000,
    stock: 0,
    status: 'OUT_OF_STOCK',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80',
  },
  {
    key: '5',
    code: 'PRD-005',
    name: 'Giày Sneaker Thể Thao Trắng',
    category: 'Giày dép',
    price: 890000,
    stock: 62,
    status: 'IN_STOCK',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&q=80',
  },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const handleFilter = (search, category) => {
    let filtered = initialProducts;
    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'ALL') {
      filtered = filtered.filter((p) => p.category === category);
    }
    setProducts(filtered);
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    handleFilter(val, categoryFilter);
  };

  const onCategoryChange = (val) => {
    setCategoryFilter(val);
    handleFilter(searchTerm, val);
  };

  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src) => (
        <Image
          src={src}
          alt="product"
          width={48}
          height={48}
          style={{ objectFit: 'cover', borderRadius: 6 }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.category}
          </Text>
        </div>
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (val) => `${val.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'IN_STOCK') {
          return <Tag color="green">Còn hàng</Tag>;
        }
        if (status === 'LOW_STOCK') {
          return <Tag color="orange">Sắp hết</Tag>;
        }
        return <Tag color="red">Hết hàng</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>
          Products
        </Title>
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo tên hoặc mã SP..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={onSearchChange}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={categoryFilter}
            onChange={onCategoryChange}
            style={{ width: 170 }}
          >
            <Option value="ALL">Tất cả danh mục</Option>
            <Option value="Thời trang nam">Thời trang nam</Option>
            <Option value="Thời trang nữ">Thời trang nữ</Option>
            <Option value="Áo khoác">Áo khoác</Option>
            <Option value="Giày dép">Giày dép</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('ALL');
              setProducts(initialProducts);
            }}
          >
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm sản phẩm
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Products;

