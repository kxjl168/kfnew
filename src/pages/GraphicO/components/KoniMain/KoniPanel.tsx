import React, { Fragment, useDebugValue } from 'react';

import { Koni, RegisterCommand, withPropsAPI, EditorCommand } from "gg-editor";

import { ConnectState } from '@/models/connect';
import logo from '@/assets/graphic.svg';
import { Form, message, Modal, Button, Input, Tabs, Radio } from 'antd';

import { GraphicState } from '@/models/graphic';
import { Link, connect, Dispatch, withRouter } from 'umi';
import { fixControlledValue } from 'antd/lib/input/Input';

import RelationSelect from '@/components/MyCom/RelationSelect';

import CreateReationForm from '@/pages/RelationList/components/CreateForm';
import ProTable from '@ant-design/pro-table';


import { add as lineAdd } from '@/pages/RelationList/service';


import { query, saveOrUpdate } from '@/services/grapicService';

import { query as querySub } from '@/services/grapicEditService';

import uuid from '@/utils/uuid';
import merge from 'lodash/merge';

import './index.less';
import { isnull } from '@/utils/utils';
import { find, update, remove } from 'lodash';

import { getTagColor, getNodeColor, UpdateNodeTagColor, getLineColor } from '@/pages/GraphicO/components/TagBar';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { IconFontNew } from '@/components/MyCom/KIcon';

export interface QDATA {
  gtype: string,
  id: string,
  level: number,
  /**
   * 加载普通数据 ，或者 edit_数据
   */
  iseditData?: boolean,

  /**
   * 普通数据中是否显示本地修改
   */
  showEdit?: boolean,

    /**
   * 外部加载数据，对比时
   */
  graphicData?: any;
};

export interface myPropsAPI {
  executeCommand(command: EditorCommand): any;
  read(data: any): any;
  save(): any;
  add(type: any, model: any): any;
  find(id: any): any;
  update(item: any, model: any): any;
  remove(item: any): any;
  getSelected?(): any;

  editor: {
    id: string
  }
}

interface GraphicProps {
  dispatch: Dispatch;
  graphicModel: GraphicState;
  reload?: boolean;
  qdata?: QDATA;
  graphconfig?: any;
  autofit?: boolean;
  readonly?: boolean;

  reloadColorTime?: number;

  propsAPI:myPropsAPI;
}
const { TabPane } = Tabs;

interface postion {
  x: number;
  y: number;
}

//获取当前移动的节点为起点，的所有距离《dis的目标节点， 一起移动.
export function getRelateToNodeByDis(propsAPI, node, dis) {

  const nodeitems = propsAPI.editor.getCurrentPage().getNodes();
  const edgeitems = propsAPI.editor.getCurrentPage().getEdges();

  let relatTargeNodeIds = "";

  let rstTargeNodeIds = "";

  edgeitems.map(edge => {

    if (edge.source.model.nodeid === node.nodeid)
      relatTargeNodeIds += edge.target.model.nodeid + ",";
  })

  nodeitems.map(item => {
    let cnode = item.model;
    //非当前移动节点
    if (cnode.nodeid !== node.nodeid) {

      if (relatTargeNodeIds.indexOf(cnode.nodeid) > -1) {
        //为关联目标节点

        let ndis = Math.sqrt((node.x - cnode.x) * (node.x - cnode.x) + (node.y - cnode.y) * (node.y - cnode.y))
        if (ndis < dis)
          rstTargeNodeIds += cnode.nodeid + ",";

      }

    }

  })

  return rstTargeNodeIds;


}

//移动所有关联的节点
function moveAllRelatedTargetNode(propsAPI, start: postion, end: postion, rstTargeNodeIds) {
  const nodeitems = propsAPI.editor.getCurrentPage().getNodes();

  const xmove = end.x - start.x;
  const ymove = end.y - start.y;

  const newnodes = nodeitems.map(item => {
    let cnode = item.model;
    if (rstTargeNodeIds.indexOf(cnode.nodeid) > -1) {
      cnode.x += xmove;
      cnode.y += ymove;
    }
    return cnode;
  })


  const gdatas = getSaveData(propsAPI);
  gdatas.nodes = newnodes;

  propsAPI.read(gdatas);

}


//获取ggeditor上的数据，替换save
export function getSaveData(propsAPI) {
  let gdatas = propsAPI.save();

  const nodeitems = propsAPI.editor.getCurrentPage().getNodes();
  const edgeitems = propsAPI.editor.getCurrentPage().getEdges();

  //save的数据存在未刷新现象
  if (nodeitems) {
    let realnodes = [];
    nodeitems.map(item => {
      realnodes.push(item.model);
    })
    gdatas.nodes = realnodes;
  }
  if (edgeitems) {
    let realedges = [];
    edgeitems.map(item => {
      realedges.push(item.model);
    })
    gdatas.edges = realedges;
  }

  return gdatas;
}

//根据已经加载的数据，重新刷新颜色
export function refreshAllColor(propsAPI, graphicModel) {
  const gdatas = getSaveData(propsAPI);
  // console.log(gdatas);
  const nodeitems = gdatas.nodes;
  // console.log(new Date());
  let newnodes = nodeitems.map(model => {
    let newmodel = UpdateNodeTagColor(model, graphicModel.tags[propsAPI.editor.id]);
    const color = getNodeColor(model, graphicModel.tags[propsAPI.editor.id]);
    newmodel.color = color;

    return newmodel;
    // propsAPI.update(fitem, fitem.model);

    //  console.log(new Date());

  })
  gdatas.nodes = newnodes;



  // console.log(new Date());
  const edgeitems = gdatas.edges;
  let newedges = edgeitems.map(model => {

    const color = getLineColor(graphicModel.lines, model.label);

    model.stroke = color;
    //  propsAPI.update(fitem, fitem.model);
    return model;

  })
  gdatas.edges = newedges;

  propsAPI.read(gdatas);
}

class KoniPanel extends React.Component<GraphicProps> {




  constructor(props) {
    super(props);

    this.init();
    //  this.bindEvent();
  }

  componentDidMount() {
    const { propsAPI, location, graphicModel, qdata, graphconfig } = this.props;
    // const { propsAPI, graphicModel } = this.props;

    //his.props.location.query.data
    //propsAPI.read();
    const data = { "nodes": [{ "type": "node", "size": "60*60", "shape": "custom-node-circle", "stroke": "#ff0000", "color": "#FA8C16", "stroke_left": "#0000ff", "nodeid": "", "nodetype": "", "label": "绩效事实", "labelOffsetY": 20, "icon": "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg", "x": 102, "y": 412.5, "index": 2, "id": "bc11b384-6ace-4b35-a16d-1191e9dc2253", "clsName": "绩效事实", "sort": 1, "dirId": "2a6af381-cee9-490f-94db-ecc1bc3810be", "enabled": "1", "deleted": "0", "version": "1.0.0", "createdTime": null, "updatedTime": null }, { "type": "node", "size": "60*60", "shape": "custom-node-circle", "stroke": "#ff0000", "color": "#FA8C16", "stroke_left": "#0000ff", "nodeid": "", "nodetype": "", "label": "专家学者", "labelOffsetY": 20, "icon": "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg", "x": 335, "y": 494, "index": 4, "id": "621591b3-9e92-43d3-8707-a48db7f82072", "clsName": "专家学者", "sort": 1, "dirId": "2a6af381-cee9-490f-94db-ecc1bc3810be", "enabled": "1", "deleted": "0", "version": "1.0.0", "createdTime": null, "updatedTime": null }, { "type": "node", "size": "60*60", "shape": "custom-node-rect", "stroke": "#ff0000", "color": "#FA8C16", "stroke_left": "#0000ff", "nodeid": "", "nodetype": "", "label": "中国城市", "labelOffsetY": 20, "icon": "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg", "x": 503, "y": 229, "index": 7, "id": "30f18e09" }, { "type": "node", "size": "60*60", "shape": "custom-node-rect", "stroke": "#ff0000", "color": "#FA8C16", "stroke_left": "#0000ff", "nodeid": "", "nodetype": "", "label": "绩效事实", "labelOffsetY": 20, "icon": "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg", "x": 203, "y": 206, "index": 8, "id": "4c414b9b" }], "edges": [{ "source": "4c414b9b", "sourceAnchor": 3, "target": "30f18e09", "id": "51c90445", "label": "测试", "index": 0 }, { "source": "30f18e09", "sourceAnchor": 0, "target": "4c414b9b", "targetAnchor": 0, "id": "1056fbf8", "lineid": "c5eb326a-68b7-409a-a16d-85470fff903a", "label": "或包含", "index": 1 }, { "source": "bc11b384-6ace-4b35-a16d-1191e9dc2253", "target": "4c414b9b", "id": "9ab5e82a", "lineid": "8f9e0a8a-5d5e-4a74-9586-fc76fdec37a0", "label": "表现为", "index": 3 }, { "source": "621591b3-9e92-43d3-8707-a48db7f82072", "sourceAnchor": 2, "target": "bc11b384-6ace-4b35-a16d-1191e9dc2253", "targetAnchor": 1, "id": "6235aa80", "lineid": "ffc58d90-17d8-484e-95c5-9950e7ea12ef", "label": "且包含", "index": 5 }, { "source": "621591b3-9e92-43d3-8707-a48db7f82072", "sourceAnchor": 3, "target": "30f18e09", "targetAnchor": 1, "id": "2ced6d15", "lineid": "0d2ef003-4624-4d46-9aae-f320627e43aa", "label": "特殊关系2", "index": 6 }] }


    let gtype = location.query.graphicType;
    let id = location.query.id;
    let level = location.query.level;
    let iseditData = false;
    if (qdata) {
      gtype = qdata.gtype;
      id = qdata.id;
      level = qdata.level;
      iseditData = qdata.iseditData;
    }



    if (isnull(gtype))
      gtype = 'cls';


    this.props.dispatch({
      type: 'graphic/setGType',
      payload: {
        graphicType: gtype
      }
    })

    // propsAPI.read(data);
    // debugger;

    if (!isnull(id))
      this.loadData(id, level || 2, iseditData);


  }




  loadData = async (ndid, level, iseditData) => {



    const { propsAPI, autofit, readonly, qdata, reloadColorTime } = this.props;
    let data = "";
    let gdata = {};


    if (qdata&&qdata.graphicData) {
      gdata = qdata.graphicData
    }
    else {
     // debugger;
      const hide = message.loading('数据加载中...', 600);
      if (!iseditData)
        data = await query({ id: ndid, level: level, showEdit: (qdata ? qdata.showEdit : true) });
      else
        data = await querySub({ id: ndid, level: level });


        try {
          let gradata = JSON.parse(JSON.stringify(data));
          gdata = JSON.parse(gradata.data);
        } catch (error) {
          message.error("数据加载失败!");
        }
    

      hide();
    }



    if (isnull(gdata))
      return;


    // debugger;
    gdata.nodes.map(item => {
      item = merge(item, {

        type: "node",
        size: "55*55",
        shape: 'custom-node-circle',

        stroke: '#F0CFA4',
        color: "#F0CFA4",
        stroke_left: '#0000ff',

        // x: 100,
        // y: 100,
        labelOffsetY: 20,
        icon: "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg"
      });


    })

    gdata.edges.map(item => {

      item = merge(item, {

    
        shape: 'CustomLine2',

      });

      if (item.attrs) {
        item.attrs = JSON.parse(item.attrs);
        if (item.attrs instanceof Array)
          item.attrs.map(attr => {

            // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
          })


      }
      item.attrOk = true;

    })

    gdata.nodes.map(item => {
      if (item.attrs) {
        item.attrs = JSON.parse(item.attrs);
        if (item.attrs instanceof Array)
          item.attrs.map(attr => {

            // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
          })
      }
      if (item.tags) {
        item.tags = JSON.parse(item.tags);
        if (item.tags instanceof Array)
          item.tags.map(attr => {

            // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
          })
      }
      item.attrOk = true;

    })

    //console.log(JSON.stringify(gdata));

    //填充删除的数据
    if (gdata.delete) {

      this.props.dispatch({
        type: 'graphic/delete',
        payload: {
          id: gdata.delete
        }
      })
    }

    // console.log( this.props);
    try {
      if (!isnull(gdata.nodes)) {
        try {
          // debugger;
          propsAPI.read(gdata);

         
        } catch{ };
    
      }


      //如果只有一个实体节点 ，处理属性，tag
      if (gdata.nodes.length === 1) {


        let fitem = propsAPI.find(gdata.nodes[0].id);
        //debugger;
        // fitem.isSelected = true;
        // propsAPI.update(fitem, fitem.model)

        this.setItemSelect(fitem);

        // console.log(fitem)
        // propsAPI.update(fitem, fitem.model)
        setTimeout(() => {
          try {
            //等待 ——selected缓存数据刷新
            propsAPI.executeCommand("addnode");
          }
          catch (e) { }
        }, 1000);

      }


          //延时等待 tagbar完成后，反向更新节点标签颜色
          setTimeout(() => {

            try {
              
      
              const { graphicModel } = this.props;
      
              refreshAllColor(propsAPI, graphicModel);
            } catch{ };
          },  1000);



      setTimeout(() => {
        if (autofit) {
          try {
            //等待 ——selected缓存数据刷新
            propsAPI.executeCommand("autoZoom");
            propsAPI.executeCommand("resetZoom");
          }
          catch (e) { }

        }

        if (readonly) {
          try {
            //只读模式，删除编辑相关模式
            // , "hoverAnchorActived"    //自动添加的
            // , "hoverNodeAddOutter"   //自动添加的
            // , "orbit"    //自动添加的
            propsAPI.editor.getCurrentPage().getGraph().removeBehaviour("hoverAnchorActived");
            propsAPI.editor.getCurrentPage().getGraph().removeBehaviour("hoverNodeAddOutter");
            propsAPI.editor.getCurrentPage().getGraph().removeBehaviour("orbit");
          } catch (e) { }
        }
        else {
          try {
            //外部小圆点
            propsAPI.editor.getCurrentPage().getGraph().removeBehaviour("orbit");
          } catch (e) { }
        }
      }, 300);
    } catch (error) {

    }




  }

  //属性面板相关颜色
   refreshModelColor=()=>{
    setTimeout(() => {

      try {
        

        const { graphicModel,propsAPI } = this.props;

        refreshAllColor(propsAPI, graphicModel);
      } catch{ };
    },  1000);
  }

  onChange = e => {
    // console.log('radio checked', e.target.value);
    this.setState({
      nodeinfo: {
        type: e.target.value
      }
    });
  };



  setItemSelect = (fitem) => {
    const { propsAPI } = this.props;
    //调用g6 api setSelected
    const setSelected = propsAPI.editor.getCurrentPage()["setSelected"];
    setSelected.apply(propsAPI.editor.getCurrentPage(), [fitem, 1]);
  }

  //清空选择
  cleanGraSelect = () => {
    const { propsAPI } = this.props;
    // const s = getSelected();
    // if (s) {
    //   s.forEach((item) => {
    //     item.isSelected = false;
    //     update(item, item.model);
    //   })
    // }

    //调用g6 api setSelected
    const clearSelected = propsAPI.editor.getCurrentPage()["clearSelected"];
    clearSelected.apply(propsAPI.editor.getCurrentPage(), []);

  }

  
  init() {
    this.state = {
      visible: false,
      className: this.props.className,
      createRelationModalVisible: false,

      lineModalvisible: false,
      newRelationData: {
        text: '',
        value: '',
        label: '',
      },//新增加的连线对象
      tabactiveKey: "1",

      nodeinfo: {
        type: "1",
        name: ''
      },

      startPt: {},
      endPt: {},
      relateNodes: "",

      keys:'',

    }
    this.myRef = React.createRef();
    this.formRef = React.createRef();

    this.lineTabRef = React.createRef();

    this.props.dispatch({
      type: 'graphic/deleteReset',
      payload: {

      }
    })
  }



  render() {
    const { dispatch, reload, propsAPI, graphconfig } = this.props;

    // console.log(this.props);

    const { save, update, getSelected, find, editor } = propsAPI;

    const config = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      name() {
        return "刷新节点类型";
      },

      // 正向命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);

        dispatch({
          type: "graphic/reload",
          payload: {

          }
        })
        console.log("execute refresh...");


      },


      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
      },



      // 快捷按键配置
      //shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    const onDrapEvent = (dropItem) => {
      const selectedNodes = getSelected();
      if (selectedNodes.length > 1) {
        // message.info('请单选节点编辑');
        return;
      }

      // debugger;
      //console.log("onDrap:" + dropItem);

      //console.log("onDrap:" + selectedNodes[0].model);

    }

    const handerOnDragStart = (e) => {

      if (e._type === "dragstart" && e.currentItem && e.currentItem.isNode) {

        let relateNodes = getRelateToNodeByDis(propsAPI, e.currentItem.model, 400);
        this.setState({ relateNodes: relateNodes, startPt: { x: e.x, y: e.y } });
      }


    }


    const handerOnDragEnd = (e) => {

      if (e._type === "dragend" && e.currentItem && e.currentItem.isNode) {

        moveAllRelatedTargetNode(propsAPI, this.state.startPt, { x: e.x, y: e.y }, this.state.relateNodes);
      }

    }





    const onAfterItemUnselectedEvent = (unselectItem) => {

    }

    const onAfterItemSelectedEvent = (SelectItem) => {
      // console.log(SelectItem);
      if (SelectItem.item.isEdge) {
        try {
          SelectItem.toFront();
        } catch (error) {

        }
        ;

      }
    }

    const handleClick = () => {
      this.props.dispatch({
        type: 'graphic/click',
        payload: {
          data: 1
        }
      })

      refreshLines();

    }


    /**
     * 计算是否有 一对节点间的多条连线
     */
    const CheckOverlapRelation = (actionType: 'add' | 'update' | 'remove', currentLine: any, modifyModel: any): any[] => {

      const allEdges = propsAPI.editor.getCurrentPage().getEdges();
      if (!allEdges)
        return;

      const jarrayEdges = _.filter(allEdges, (edge) => {

        if (actionType === 'add' || actionType === 'remove') {
          if (edge.model.target === currentLine.model.target && edge.model.source === currentLine.model.source)
            return true;
          return false;
        }
        if (actionType === 'update') {
          if ((edge.model.target === currentLine.model.target && edge.model.source === currentLine.model.source) //源关系
            || (modifyModel.source && edge.model.source === modifyModel.source && edge.model.target === currentLine.model.target)//修改目标
            || (modifyModel.target && edge.model.source === currentLine.model.source && edge.model.target === modifyModel.target)//修改source
          ) return true;
          return false;
        }
      });

      let newLines = [];
      // s-target,lines
      // 重叠的关系
      const overlaps = {};

      for (let i = 0; i < jarrayEdges.length; i++) {

        const jrelation = jarrayEdges[i];

        const starget = jrelation.model.source + "-" + jrelation.model.target;
        const starget2 = jrelation.model.target + "-" + jrelation.model.source;

        let rels = [];
        let exsitKey = starget;

        rels = overlaps[starget];
        if (rels) {
          exsitKey = starget;
        }
        else {
          rels = overlaps[starget2];
          if (rels) {
            exsitKey = starget2;
          }
        }

        if (!rels)
          rels = [];


        rels.push(jrelation);

        overlaps[exsitKey] = rels;
      }
      const keys: string[] = Object.keys(overlaps);
      for (let j = 0; j < keys.length; j++) {

        const key = keys[j];

        // 同一对节点间的所有连线
        const rels = overlaps[key];

        // 多条连线
        if (rels instanceof Array && rels.length > 1) {
          for (let index = 0; index < rels.length; index++) {
            const line = rels[index];

            line.model.lineType = "Q";
            line.model.heightRate = index + 1;
            if (index === 0)
              line.model.updown = 0;
            else
              line.model.updown = index % 2 == 0 ? 1 : -1;


            update(line, line.model);

          }
        }
        else {
          const line = rels[0];

          line.model.lineType = "";


          update(line, line.model);
        }
      }

    }
    /**
     * 刷新新的选择，同时更新多条重复连线的为不重叠弧形
     * @param SelectItem 
     */
    const refreshLines = (SelectItem) => {
      const { propsAPI } = this.props;

      try {

        // setTimeout(() => {
        propsAPI.editor.getCurrentPage().getEdges().map(edge => {
          //  debugger;
          if (SelectItem) {
            if (edge.model.id !== SelectItem.item.model.id)
              edge.update();
          }
          else {
            edge.update();
          }
        })


        //  }, 10);

      } catch (error) {

      }

    }

    //初始化拖入节点，选择节点类型，实例
    const selectNodeType = (model) => {

    }

    //新增连线，选择连线类型
    const selectEdgeType = (model) => {

    }


    const handleOk = () => {
      this.setState({
        visible: false
      })

      const selectedNodes = getSelected();
      if (selectedNodes.length > 1) {
        // message.info('请单选节点编辑');
        // console.log("no selected")
        return;
      }

      const fitem = find(selectedNodes[0].model.id);
      // setTimeout(() => {
      // console.log("hanldok:fitem" + JSON.stringify(fitem.model));
      // console.log("hanldok:" + this.state.nodeinfo.type)
      if (this.state.nodeinfo.type === 1)
        fitem.model.shape = 'custom-node-circle';
      else if (this.state.nodeinfo.type === 2)
        fitem.model.shape = 'custom-node-rect';
      else
        fitem.model.shape = 'CustomNodeLRect';


      //  console.log("timeout:" + JSON.stringify(fitem.model));
      update(fitem, fitem.model);



    }

    const handleCancel = () => {
      this.setState({
        visible: false
      })
    }



    const onBeforeChangeEvent = (data) => {
      // console.log(data);
      // if (action === "add" && item.type === 'node') {
      if (data.action === "add") {
        //  debugger;
        //let fitem = find({nodeid:data.model.id});
        //if(fitem)
        // propsAPI.executeCommand("undo");
      }
      //  }

   

    }

    const onAfterChangeEvent = (params) => {

      const { action, item, model, affectedItemIds } = params;

      const { graphicModel } = this.props;
     // debugger;
      // console.log("onAfterChangeEvent:action " + action);
      //  console.log("onAfterChangeEvent:itemtype " + item.type);
      // console.log("onAfterChangeEvent:" + JSON.stringify(item.model));

     // if(action==="changeData")
      notifyTagRefresh();
   

      if (action === 'update' && item.type === 'node') {
        // let fitem = find(item.model.id);
        // if (fitem.model.shape != 'CustomNodeLRect') {
        //debugger;
        // fitem.model.shape = 'CustomNodeLRect';
        // update(fitem, fitem.model);
        // }

       
      }
      if (action === "add" && item.type === 'node') {

         

        //console.log( this.myRef.current);

        this.setState({
          visible: false,
        })

        setTimeout(() => {
          const selectedNodes = getSelected();
          if (selectedNodes.length > 1) {
            // message.info('请单选节点编辑');
            console.log("no selected")
            return;
          }

          let snode = selectedNodes[0];
          if (snode === undefined || isnull(snode.model)) {
            remove(snode);
            propsAPI.executeCommand('undo');
            return;
          }


          const fitem = find(snode.model.id);


          if (fitem.model.nodetype === '1')
            propsAPI.executeCommand("addnode");
          else if (fitem.model.nodetype === '3') //新实体
            propsAPI.executeCommand("addnewnode");
          else
            propsAPI.executeCommand("addcls");

           // this.refreshModelColor();


        
          // const fitemnodeid = find(selectedNodes[0].model.nodeid);

          // if (!fitemnodeid) {
          //   fitem.model.id = fitem.model.nodeid;
          //   update(fitem, fitem.model);
          // }
          // else {
          //   message.info("节点已存在");
          //   propsAPI.executeCommand("undo");
          // }
        }, 200);

    

      }

      if (action === "add" && item.type === 'edge') {

        //console.log( this.myRef.current);

        this.cleanGraSelect();

        setTimeout(() => {
          let fitem = find(item.model.id);
          if (fitem === undefined)
            return;

          fitem.isSelected = true;
          update(fitem, fitem.model);


          CheckOverlapRelation(action, fitem, null);

          // this.setState({
          //   lineModalvisible: true
          // })

          propsAPI.executeCommand("addrelation");
        }, 300);

      }
      if (action === 'update' && item.type === 'edge') {

        if (params.updateModel && params.originModel) {
          if (params.updateModel.target && params.updateModel.target !== params.originModel.target)
            CheckOverlapRelation(action, { model: params.originModel }, params.updateModel);
          if (params.updateModel.source && params.updateModel.source !== params.originModel.source)
            CheckOverlapRelation(action, { model: params.originModel }, params.updateModel);
        }
        //console.log(params)
        // CheckOverlapRelation(item);
      }
      if (action === "remove") {
        if (item.type === 'edge') {
          CheckOverlapRelation(action, item, null);
          //  console.log("del:" + JSON.stringify(item.model));
          this.props.dispatch({
            type: 'graphic/delete',
            payload: {
              id: item.model.o2oid
            }
          })
        }
        else if (item.type === 'node') {

        



          this.props.dispatch({
            type: 'graphic/delete',
            payload: {
              id: affectedItemIds
            }
          })

  
    


        }
      }


    

    //  console.log(item);
     //  console.log("changed!");
      // console.log(params);


    
    }

    const notifyTagRefresh=()=>
    {
            
      let gdatas = getSaveData(propsAPI);

      // debugger;
      this.props.dispatch({
        type: 'graphic/updatedata',
        payload: {
          data: gdatas,
          id: propsAPI.editor.id,
        }
      })
    }


    const relationSelectDone = (item, SelectItem) => {
      // const item=items[0];
      // debugger;
      //console.log("relationSelectDone：" + JSON.stringify(item))
      this.setState({
        newRelationData: { ...item, text: item.label }
      })

      // console.log(this.state.newRelationData.value);
    }

    const handleLineOk = () => {


      let selectEle = null;
      const selectedNodes = getSelected();
      if (selectedNodes.length > 1) {
        // message.info('请单选节点编辑');
        selectEle = selectedNodes[selectedNodes.length - 1];
        //return;
      }
      else
        selectEle = selectedNodes[0];

      const fitem = find(selectEle.model.id);
      // setTimeout(() => {
      // console.log("hanldok:line" + JSON.stringify(fitem.model));


      fitem.model.o2oid = uuid();
      fitem.model.lineid = this.state.newRelationData.value;
      fitem.model.label = this.state.newRelationData.text;
      //  console.log("timeout:" + JSON.stringify(fitem.model));
      update(fitem, fitem.model);

      this.setState({
        lineModalvisible: false
      })

    }

    const handleLineCancel = () => {
      this.setState({
        lineModalvisible: false
      })

      this.props.propsAPI.executeCommand('undo');//撤销连线
    }

    const HandlerAfterViewportChange = (params) => {
      // console.log("HandlerAfterViewportChange changed!");
      // console.log(params);


    }
    const handerSizeChange = () => {
      //debugger;
      // propsAPI.editor.getCurrentPage().update()
    }

    const onContextMenuEvent = (e) => {
      // console.log(e);

      //    const { propsAPI } = this.props;

      // const d=propsAPI.save();
      // console.log(d);


      // //调用g6 api setSelected
      // const save = propsAPI.editor.getCurrentPage()["save"];
      // const d2= save.apply(propsAPI.editor.getCurrentPage());
      // console.log(d2);

      try {


        if (e && e.item && e.item.model) {
          if (e.item.model.nodetype === '1') {
            document.querySelectorAll(".EntityMenu").forEach(item => {
              item.style = "display:block";
            })

            document.querySelectorAll(".ClsMenu").forEach(item => {
              item.style = "display:none";
            })

          }
          else if (e.item.model.nodetype === '2') {
            document.querySelectorAll(".EntityMenu").forEach(item => {
              item.style = "display:none";
            })
            document.querySelectorAll(".ClsMenu").forEach(item => {
              item.style = "display:block";
            })
          }
          else {
            document.querySelectorAll(".EntityMenu").forEach(item => {
              item.style = "display:none";
            })
            document.querySelectorAll(".ClsMenu").forEach(item => {
              item.style = "display:none";
            })
          }
        }
      } catch (error) {

      }
    }

    const keyDown=(e)=>{
     // debugger;

      let keys=this.state.keys;

      if(keys==="")
      keys+=e.domEvent.key;
      else
      keys+=" "+e.domEvent.key;


      if(keys==="Control s")
      {
        propsAPI.executeCommand("save");
      }

      this.setState({keys:keys});
    }

    const keyUp=(e)=>{
      this.setState({keys:''});
    }

    return (
      <Fragment>
        <Koni onKeyDown={keyDown} onKeyUp={keyUp} ref={this.myRef} onAfterChangeSize={handerSizeChange} onDragStart={handerOnDragStart} onDragEnd={handerOnDragEnd} onAfterViewportChange={HandlerAfterViewportChange} onClick={handleClick} onContextMenu={onContextMenuEvent} onBeforeChange={onBeforeChangeEvent} onAfterChange={onAfterChangeEvent} onAfterItemUnselected={onAfterItemUnselectedEvent} onAfterItemSelected={onAfterItemSelectedEvent} onDrop={onDrapEvent} className={this.state.className} graph={graphconfig} />
        <div className="zoomPanel">
          <Button onClick={() => {
            propsAPI.executeCommand("zoomIn");
          }}><ZoomInOutlined title="放大" /></Button>
          <Button onClick={() => {
            propsAPI.executeCommand("zoomOut");
          }}><ZoomOutOutlined title="缩小" /></Button>
          <Button onClick={() => {
            propsAPI.executeCommand("autoZoom");
            //propsAPI.editor.getCurrentPage().getGraph().changeMode("readOnly");
            //propsAPI.editor.getCurrentPage().getGraph().removeBehaviour("default");
          }}><IconFontNew style={{ marginLeft: '4px' }} type="icon-zoom-auto" title="适应屏幕" /> </Button>
          <Button onClick={() => {
            propsAPI.executeCommand("resetZoom");
            //   propsAPI.editor.getCurrentPage().getGraph().changeMode("default");

          }}><IconFontNew style={{ marginLeft: '4px' }} type="icon-zoom-reset" title="还原缩放" /> </Button>

        </div>
        <Modal
          title="节点信息确认"
          visible={this.state.visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >

          <Form name="basic" ref={this.formRef}>

            <Tabs defaultActiveKey="1">
              <TabPane tab="确认节点类型" key="1">
                <Radio.Group onChange={this.onChange} value={this.state.nodeinfo.type}>
                  <Radio value={1}>概念</Radio>
                  <Radio value={2}>实体</Radio>
                  <Radio value={3}>其他?</Radio>
                </Radio.Group>
              </TabPane>
              <TabPane tab="选择已有节点" key="2">
                节点列表...
              </TabPane>

            </Tabs>

          </Form>


        </Modal>


        <Modal
          title="连线信息确认"
          visible={this.state.lineModalvisible}
          onOk={handleLineOk}
          onCancel={handleLineCancel}
        >

          <Form name="basic" ref={this.formRef}>

            <Tabs ref={this.lineTabRef} activeKey={this.state.tabactiveKey} defaultActiveKey="1" onChange={(activeKey) => {
              console.log(111);
              if (activeKey === '2') this.setState({ createRelationModalVisible: true });
            }}  >
              <TabPane tab="选择关系" key="1">
                <RelationSelect className="width100" labelInValue={true} selectVal={[this.state.newRelationData]} placeholder="请选择关系" onChange={relationSelectDone} />
              </TabPane>
              <TabPane tab="新建关系" key="2"   >
                节点列表...
              </TabPane>

            </Tabs>

          </Form>
        </Modal>

        <CreateReationForm title='新增关系' onCancel={() => {
          this.setState({ createRelationModalVisible: false })

        }}

          onSubmit={async (value) => {
            let uid = uuid();
            const success = await lineAdd({ ...value, id: uid });
            if (success) {

              this.setState({ tabactiveKey: "1", createRelationModalVisible: false, newRelationData: { "label": value.name, "text": value.name, "value": uid } })


            }
          }}
          title="新建关系"

          modalVisible={this.state.createRelationModalVisible} />



      </Fragment>);

  }
}

// export default withPropsAPI(KoniPanel);

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(withRouter(withPropsAPI(KoniPanel)));


