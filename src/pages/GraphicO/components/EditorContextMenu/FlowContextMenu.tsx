import { CanvasMenu, ContextMenu, EdgeMenu, GroupMenu, MultiMenu, NodeMenu } from 'gg-editor';

import React from 'react';
import MenuItem from './MenuItem';
import styles from './index.less';
import EntityMenu from '../../cmd/EntityMenu';
import EntityItem from './EntityItem';
import { Divider } from 'antd';
import ClsItem from './ClsItem';

const FlowContextMenu = () => (
  <ContextMenu className={styles.contextMenu}  >
    <NodeMenu>
      {/* <MenuItem command="copy" /> */}
      <MenuItem command="delete"   text="删除"/>

    
      <EntityItem command="editnode" text="修改实体" icon="entity-gray"/>
      <EntityItem command="editnodeattr" text="修改属性"   icon="attr-gray"/>
    <EntityItem command="edittag" text="修改标签"  icon="tag-gray" />
       

      <ClsItem command="editcls" text="修改概念" icon="entity-gray"/>


      <MenuItem command="showNodeRelation" text="显示一层节点关系"  icon="btn-relation-gray" />
      <MenuItem command="showNodeRelation2" text="显示二层节点关系"   icon="btn-more-node-gray" />

    </NodeMenu>






    <EdgeMenu>
      <MenuItem command="delete"  text="删除" />
      <MenuItem command="editrelation" text="修改关系" />
      <MenuItem command="editrelationattr" text="修改属性" />

    </EdgeMenu>
    <GroupMenu>
      {/* <MenuItem command="copy" /> */}
      <MenuItem command="delete" text="删除" />
      <MenuItem command="unGroup" icon="ungroup" text="取消分组" />
    </GroupMenu>
    <MultiMenu>
      {/* <MenuItem command="copy" />
      <MenuItem command="paste" /> */}
      <MenuItem command="addGroup"  icon="group" text="添加至选择组"  />
      <MenuItem command="delete" text="删除" />
    </MultiMenu>
    <CanvasMenu>
      <MenuItem command="undo" text="撤销上一步"  />
      <MenuItem command="redo"  text="恢复上一步" />
      {/* <MenuItem command="pasteHere" icon="paste" text="Paste Here" /> */}
    </CanvasMenu>
  </ContextMenu>
);

export default FlowContextMenu;
