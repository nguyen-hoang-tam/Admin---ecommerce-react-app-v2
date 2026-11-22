import React from 'react';
import { Typography, Card, Empty } from 'antd';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>
          Dashboard
        </Title>
      </div>

      <Card
        style={{
          borderRadius: 8,
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty description="Tính năng đang được phát triển" />
      </Card>
    </div>
  );
};

export default Dashboard;
