
import React from 'react';
import { Reducer, Effect } from 'umi';
import GraphicItem, { GraphicItemProps } from '../pages/GraphicO/components/EditorItemPanel/GItem';
import concat from 'lodash/concat';
import { query } from '../pages/KgClassList/service';

import { query as queryEntity } from '../pages/EntityList/service';

import { TableListItem } from '@/pages/KgClassList/data';
import { deepClone, isnull } from '@/utils/utils';

import _ from 'lodash';

export interface GraphicState {
  num?: number;
  name?: string;
  nodeitems: GraphicItemProps[];
  queryname: string;//查询名称
  deletedata: [];//编辑器中删除的数据
  defaultColor:string,
  graphicType:  'cls' | 'entity';//当前编辑器类型，概念编辑/实体编辑
  data:any,//当前编辑中的节点线， save（）数据
  tags:[],//当前编辑的所有tag
  fullicon:string, //编辑器是否全屏  icon
  fulltext:string, //编辑器是否全屏按钮  文字
}

export interface GraphicModelType {
  namespace: 'graphic';
  state: {
    //左侧items
    nodeitems: GraphicItemProps[],
    queryname: string,
    deletedata: [],
    click:number,
    defaultColor:string,
    data:any,//当前编辑中的节点线， save（）数据
    tags:[],//当前编辑的所有tag
    lines:[];//当前编辑的所有线样式
    fullicon:string, //编辑器是否全屏  icon
  fulltext:string, //编辑器是否全屏按钮  文字
  };
  reducers: {
    setNodeItem: Reducer<GraphicState>;
    //左侧编辑器item
    setClsNodeData: Reducer<GraphicState>;
    //实体编辑左侧item
    setClsNodeEntityData: Reducer<GraphicState>;
    setQName: Reducer<GraphicState>;
    //编辑器删除的数据
    setDelData: Reducer<GraphicState>;
    //当前编辑器类型 cls/entity
    setGTypeVal: Reducer<GraphicState>;
    //编辑中的数据
    setData:Reducer<GraphicState>;

    setClick:Reducer<GraphicState>;

    SetAllTags:Reducer<GraphicState>;
    SetAllLines:Reducer<GraphicState>;

    setFullScreen:Reducer<GraphicState>;
  };
  effects: {
    init: Effect;
    reload: Effect;
    setqueryname: Effect;
    delete: Effect;
    deleteReset:Effect;
    setGType: Effect;
    /**
     * 根据editor id 更新编辑中的数据 *
     * */
    updatedata:Effect;
    /**
     * 清空存储的图形数据 
     * 
     * */
    cleandata:Effect;
    click:Effect;//点击传递
    setTags:Effect;
    setLines:Effect;

    fullScreen:Effect;
  }
}


// const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
//   const root = document.getElementById('root');
//   if (root) {
//     root.className = colorWeak ? 'colorWeak' : '';
//   }
// };

const GraphicModel: GraphicModelType = {
  namespace: 'graphic',
  state: {
    nodeitems: [
      {
        // shape: 'custom-node-circle',
        // kclass: 'custom-node1',
        // label: '默认节点1',
        // id: 1,
      }
    ],
    defaultColor:'#F0CFA4',
    click:1,
    queryname: '',
    tags:[],
    lines:[],
    deletedata: [],
    graphicType: 'cls',
    fullicon:'maxmize', //编辑器是否全屏  icon
  fulltext:'全屏', //编辑器是否全屏按钮  文字
  },
  effects: {
    *init({ payload }, { call, put }) {
      const { num } = payload;
      // debugger;
      //       const nodeitems = yield select(state => state.graphic.nodeitems);
      //       console.log("00"+JSON.stringify(nodeitems));


      // console.log(p);
      // let num = 4;
      let all: GraphicItemProps[] = [];
      for (let index = 0; index < num; index++) {
        let g = {
          shape: 'custom-node-circle',
          kclass: 'custom-node1',
          id: index,
          label: `'新增节点'${index}`
        };
        all = concat(all, g);
      }
      yield put({
        type: 'setNodeItem',
        payload: {
          status: false,
          nodeitems: all,
        },
      });

    },
    *reload({ payload }, { call, put, select }) {
      // console.log("reload in ..."+JSON.stringify(payload));

      let qdata = {};
      if (payload)
        qdata = deepClone(payload);

      //  console.log(JSON.stringify(qdata));

      const graphicType = yield select(state => state.graphic.graphicType)
      if (graphicType === "cls") {
        const name = yield select(state => state.graphic.queryname)
        if (isnull(qdata.clsName) && name !== '') {
          qdata.clsName = name;
          // console.log('use state value:'+name);
        }
        qdata.pageSize=20;
        const clalst = yield call(query, qdata);



        yield put({
          type: 'setClsNodeData',
          payload: {
            data: clalst,
          }
        });
      }
      else{
        const name = yield select(state => state.graphic.queryname)
        if (isnull(qdata.name) && name !== '') {
          qdata.name = name;
          // console.log('use state value:'+name);
        }
        qdata.fullNameFirst="true";
        qdata.pageSize=20
        const clalst = yield call(queryEntity, qdata);

        yield put({
          type: 'setClsNodeEntityData',
          payload: {
            data: clalst,
          }
        });

      }
    },
    *setqueryname({ payload }, { call, put }) {
      // debugger;
      //console.log("reload in ...");
      const { name } = payload;
      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setQName',
        payload: {
          queryname: name,
        }
      });
    }
    ,
    *setGType({ payload }, { call, put }) {
      // debugger;
      //console.log("reload in ...");
      const { graphicType } = payload;
      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setGTypeVal',
        payload: {
          graphicType: graphicType,
        }
      });
    }
    ,
    *updatedata({ payload }, { call, put,select }) {
      // debugger;
      //console.log("updatedata in ...");


      const olddata = yield select(state => state.graphic.data)
      


      const { data,id } = payload;

      let odata=_.cloneDeep(olddata);
      odata[id]=data;


      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setData',
        payload: {
          data: odata,
        }
      });
    }
    ,
    *cleandata({ payload }, { call, put,select }) {
      // debugger;
  
      yield put({
        type: 'setData',
        payload: {
          data: [],
        }
      });
      yield put({
        type: 'setAllTags',
        payload: {
          data: [],
        }
      });
    }
    ,
    *setTags({ payload }, { select,call, put }) {
      // debugger;
      const olddata = yield select(state => state.graphic.tags)
    
      const { data,id } = payload;

      const odata=_.cloneDeep(olddata);
      odata[id]=data;

      yield put({
        type: 'setAllTags',
        payload: {
          data: odata,
        }
      });
    }
    ,
    *setLines({ payload }, { call, put }) {
      // debugger;
      //console.log("updatedata in ...");
      const { data } = payload;
      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setAllLines',
        payload: {
          data: data,
        }
      });
    }
    ,
    *click({ payload }, { call, put,select }) {
      // debugger;
      //console.log("updatedata in ...");
      const { data } = payload;
      const click = yield select(state => state.graphic.click)
     // console.log('gclick1');
      yield put({
        type: 'setClick',
        payload: {
          data: click+1,
        }
      });
    }
    ,
    *fullScreen({ payload }, { call, put,select }) {
      // debugger;
      //console.log("updatedata in ...");
      const { data } = payload;
      //const click = yield select(state => state.graphic.click)
     // console.log('gclick1');
      yield put({
        type: 'setFullScreen',
        payload: {
          data: data,
        }
      });
    }
    ,

    *delete({ payload }, { call, put, select }) {
      // debugger;
      //console.log("reload in ...");
      const { id } = payload;
      const deletedata = yield select(state => state.graphic.deletedata)

      if (id instanceof Array)
        id.map(item => {
          deletedata.push(item);
        })
      else
        deletedata.push(id);
      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setDelData',
        payload: {
          data: deletedata,
        }
      });
    }

    ,*deleteReset({ payload }, { call, put, select }) {
      // debugger;
    
      //console.log("setqueryname in ..."+JSON.stringify( name));
      yield put({
        type: 'setDelData',
        payload: {
          data: [],
        }
      });
    }



  },
  reducers: {
    setFullScreen(state, { payload }) {
      const  data  = payload.data;
     // console.log("setData in ...");
    //  console.log('gclick');
    
      return {
        ...state,
        fullicon: data?"minimize":'maxmize',
        fulltext: data?"退出全屏":'全屏'
      };
    },
    setClick(state, { payload }) {
      const  data  = payload.data;
     // console.log("setData in ...");
    //  console.log('gclick');
      return {
        ...state,
        click: data
      };
    },
    setAllTags(state, { payload }) {
      const  data  = payload.data;
     // console.log("setAllTags ...");
     // console.log(data);
      return {
        ...state,
        tags: data
      };
    },
    setAllLines(state, { payload }) {
      const  data  = payload.data;
     // console.log("setAllTags ...");
     // console.log(data);
      return {
        ...state,
        lines: data
      };
    },
    setData(state, { payload }) {
      const  data  = payload.data;
     // console.log("setData in ...");
     // console.log(data);
      return {
        ...state,
        data: data
      };
    },
    setClsNodeData(state, { payload }) {
      const { data } = payload.data;
      const all: GraphicItemProps[] = [];
      data.forEach((clsdata, index) => {
        const item: GraphicItemProps = {
          shape: 'custom-node-circle',
          kclass: 'custom-node1',
          // id: clsdata.id,
          label: clsdata.clsName,
          uid:clsdata.id,
          nodetype :'2',
          model: clsdata,
        }
        all.push(item);

      });


      return {
        ...state,
        nodeitems: all
      };
    },
    setClsNodeEntityData(state, { payload }) {
      const { data } = payload.data;
      const all: GraphicItemProps[] = [{
        shape: 'custom-node-circle',
        kclass: 'custom-node-new',
        // id: clsdata.id,
        uid:'uid',
        label: "新实体",
        nodetype :'3',
        model: {},
      }];
      data.forEach((clsdata, index) => {
        const item: GraphicItemProps = {
          shape: 'custom-node-circle',
          kclass: 'custom-node1',
          // id: clsdata.id,
          uid:clsdata.id,
          label: clsdata.name,
          nodetype :'1',
          model: clsdata,
        }
        all.push(item);

      });


      return {
        ...state,
        nodeitems: all
      };
    }
    
    ,
    setNodeItem(state, { payload }) {
      const { name, num } = payload;

      let all = payload.nodeitems;
      // console.log(all);

      // console.log(' loadnode node done...')


      return {
        ...state,
        nodeitems: all
      };
    },
    setGTypeVal(state, { payload }) {
      const { graphicType } = payload;
      return {
        ...state,
        graphicType: graphicType
      };
    },
    setDelData(state, { payload }) {
      console.log("setDelData : " + payload.data);
      const { data: id } = payload;
      return {
        ...state,
        deletedata: id,

      };
    },
    setQName(state, { payload }) {
      //console.log("setQName in ..."+payload.queryname);
      const { queryname: name } = payload;
      return {
        ...state,
        queryname: name,
        name: '11231'
      };
    },
  }
};

export default GraphicModel;
