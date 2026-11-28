import React, { useState, useMemo } from 'react';
import { Input, Button, Tooltip, message } from 'antd';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import { syntaxHighlight } from '../../utils/syntaxHighlight';

const JsonViewer = ({ data, record }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const source = data || record;

  const jsonString = useMemo(() => {
    if (!source) return '';

    const { key, ...cleanData } = source;

    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return JSON.stringify(cleanData, null, 2);
    }

    const filteredResult = {};
    for (const [propName, propValue] of Object.entries(cleanData)) {
      const matchKey = propName.toLowerCase().includes(keyword);
      const matchValue = JSON.stringify(propValue).toLowerCase().includes(keyword);

      if (matchKey || matchValue) {
        filteredResult[propName] = propValue;
      }
    }

    return JSON.stringify(filteredResult, null, 2);
  }, [source, searchTerm]);

  const handleCopy = () => {
    if (!jsonString) return;
    navigator.clipboard.writeText(jsonString);
    message.success('Đã sao chép JSON vào clipboard!');
  };

  return (
    <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderRadius: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder="Tìm thuộc tính hoặc giá trị..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 260, borderRadius: 6 }}
          allowClear
        />
      </div>

      <div style={{ position: 'relative', backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: 8, padding: '16px 20px' }}>
        <Tooltip title="Sao chép JSON">
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined style={{ color: '#595959' }} />}
            onClick={handleCopy}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
          />
        </Tooltip>

        <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.6, maxHeight: 380, overflow: 'auto', fontFamily: 'monospace' }}>
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }} />
        </pre>
      </div>
    </div>
  );
};

export default JsonViewer;
