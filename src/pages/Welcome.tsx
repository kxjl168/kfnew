import { Card, Row, Col, Alert } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <>
  <PageHeaderWrapper content="">
    <Card>
      <Alert
        message="你好!这里是喵的测试实验室~"
        type="success"
        showIcon={false}
        banner
        style={{
          margin: -12,
          marginBottom: 48,
        }}
        

      />
      -__-~
    
    </Card>
  </PageHeaderWrapper>
  </>
);
