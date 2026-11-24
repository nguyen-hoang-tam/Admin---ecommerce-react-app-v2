import React, { useState, useMemo } from 'react';
import { Input, Button, Tooltip, message } from 'antd';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import { syntaxHighlight } from '../../utils/syntaxHighlight';

const JsonViewer = ({ data, record }) => {
  const [searchProperty, setSearchProperty] = useState('');
  const sourceData = data || record;

  const displayData = useMemo(() => {
    if (!sourceData) return {};
    const raw = { ...sourceData };
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
  }, [sourceData, searchProperty]);

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

export default JsonViewer;
