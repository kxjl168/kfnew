import { CanvasPanel, DetailPanel, EdgePanel, GroupPanel, MultiPanel, NodePanel } from 'gg-editor';

import { Card, Button } from 'antd';
import React, { useState } from 'react';
import DetailForm from './DetailForm';
import styles from './index.less';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';

const FlowDetailPanel: React.FC<> = (props) => {


  const {readonly}=props;


  return (
    <DetailPanel className={styles.detailPanel} >
      
      <NodePanel>
        <DetailForm type="node" readonly={readonly} />
      </NodePanel>
      <EdgePanel>
        <DetailForm type="edge" readonly={readonly} />
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" />
      </GroupPanel>
      <MultiPanel>
        <Card type="inner" size="small" title="多选" bordered={false} />
      </MultiPanel>
      <CanvasPanel>
        <Card type="inner" size="small" title="选中元素" bordered={false} />
      </CanvasPanel>
    </DetailPanel>
  )
}

export default FlowDetailPanel;
