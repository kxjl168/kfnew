import { Divider, Button } from 'antd';
import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';

import ToolbarButtonNew from './ToolbarButtonNew';

import styles from './index.less';

import save from '@/assets/save.svg';
import refresh from '@/assets/refresh.svg';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';



const FlowToolbar = (props) => {

  const{graphicModel,hidesave}=props

  return (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo"  text="撤销上一步动作"/>
      <ToolbarButton command="redo" text="恢复上一步动作"/>
      <Divider type="vertical" />
      {/* <ToolbarButton command="copy" />
      <ToolbarButton command="paste" />
      <ToolbarButton command="delete" /> */}
      {/* <Divider type="vertical" /> */}
      {/* <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" /> */}
      {/* <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" /> */}
      {/* <ToolbarButton command="resetZoom" icon="actual-size" text="Actual Size" />aeaeae3b */}
      <Divider type="vertical" />
      <ToolbarButton command="toBack" icon="to-back" text="移动选中对象到最下层" />
      <ToolbarButton command="toFront" icon="to-front" text="移动选中对象到最上层" />
      <Divider type="vertical" />
      <ToolbarButton command="multiSelect" icon="multi-select" text="多选" />
      {/* <ToolbarButton command="addGroup" icon="group" text="Add Group" />
      <ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" /> */}


      <Divider type="vertical" />


      <ToolbarButtonNew command="fullscreen" icon={graphicModel.fullicon} text={graphicModel.fulltext} />

{!hidesave&&(
  <>
      <ToolbarButtonNew command="save" icon="save" text="保存" />
      <ToolbarButtonNew command="saveWithNeo4j" icon="save-neo4j" text="保存并同步至Neo4j" />
      </>
      )}


      <Divider type="vertical" />

      <ToolbarButtonNew command="showneo4j" icon="show-neo4j" text="打开Neo4j" />


        

      {/* <ToolbarButtonNew command="reloadnode" icon="refresh" text="刷节点类型" /> */}

    </Toolbar>
  );
}

//export default FlowToolbar;

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(FlowToolbar);


