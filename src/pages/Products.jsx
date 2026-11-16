import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Space, Button, Input, Select, Image, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const { Title, Text } = Typography;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = [];
      const querySnapshot = await getDocs(collection(db, 'products'));

      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setProducts(productsData);
      console.log(JSON.stringify(productsData, null, 2));
    } catch (error) {
      console.error("Lỗi fetch data: ", error);
      message.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleFilter = (search, category) => {
    let filtered = products;
    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase())
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
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
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
          {record.category && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.category}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (val) => `${Number(val || 0).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 160,
      render: (brand) => {
        const tagStyle = { padding: '4px 12px', fontSize: 13, borderRadius: 12, border: 'none' };
        return (
          <Tag bordered={false} color="geekblue" style={tagStyle}>
            {brand || 'Khác'}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      align: 'center',
      render: () => (
        <Space size="small">
          <Button
            type="default"
            icon={<EditOutlined style={{ color: '#040404ff' }} />}
            style={{ backgroundColor: '#ffffff', borderColor: '#d9d9d9' }}
          >
            Sửa
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
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
            placeholder="Tìm theo tên sản phẩm..."
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
              fetchProducts();
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
        loading={loading}
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
};

export default Products;

