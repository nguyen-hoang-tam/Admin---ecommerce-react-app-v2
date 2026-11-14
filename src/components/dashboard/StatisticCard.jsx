import React from 'react';
import { Statistic } from 'antd';

const StatisticCard = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  valueStyle,
  background = '#ffffff',
  borderColor = '#f0f0f0',
  borderRadius = 18,
  boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)',
}) => {
  return (
    <div
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius,
        boxShadow,
        padding: '32px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Statistic
        title={title}
        value={value}
        precision={precision}
        suffix={suffix}
        prefix={prefix}
        valueStyle={valueStyle}
      />
    </div>
  );
};

export default StatisticCard;