import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const InfoCard = ({ icon, title, children, style }) => (
  <div
    style={{
      background: '#f8fafc',
      padding: '14px 16px',
      borderRadius: 8,
      border: '1px solid #f0f0f0',
      height: '100%',
      ...style,
    }}
  >
    <div
      style={{
        fontWeight: 600,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#1a1a1a',
      }}
    >
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export const IconTextRow = ({ icon, text, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
    {icon}
    <Text style={{ fontSize: 13 }}>{text || '—'}</Text>
  </div>
);

export const PriceRow = ({ label, value, isTotal = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTotal ? 0 : 4,
      fontSize: 13,
      ...(isTotal
        ? {
            borderTop: '1px solid #e2e8f0',
            paddingTop: 8,
            marginTop: 4,
          }
        : {}),
    }}
  >
    <Text type={isTotal ? undefined : 'secondary'} strong={isTotal} style={isTotal ? { fontSize: 14 } : undefined}>
      {label}
    </Text>
    <Text strong={isTotal} style={isTotal ? { fontSize: 18, color: '#cf1322' } : undefined}>
      {value}
    </Text>
  </div>
);

export default InfoCard;
