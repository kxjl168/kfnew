import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI, PropsApi } from "gg-editor";

import { Form, message, Modal, Button, Input, Tabs } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import _, { random } from 'lodash';


import './cmd.less';

import EntitySelect from '@/components/MyCom/EntitySelect';

import CreateEntityForm from '@/pages/EntityList/components/CreateForm';
import uuid from '@/utils/uuid';

import { add as entityAdd, listattrs, get as getEntity } from '@/pages/EntityList/service';

import{get as getCls } from '@/pages/KgClassList/service';

import { get as getAttr } from '@/pages/AttrList/service';

import { isnull } from '@/utils/utils';

import { FormInstance } from 'antd/lib/form';
import { MinusOutlined } from '@ant-design/icons';
import AttrSelect from '@/components/MyCom/AttrSelect';

import { ConnectState } from '@/models/connect';
import { connect } from 'umi';

import {getTagColor,getNodeColor,UpdateNodeTagColor} from '@/pages/GraphicO/components/TagBar';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';


const { Item } = Form;
export interface RelationProps {
  propsAPI: any;
}
export interface ItemState {
  visible: boolean;

  attrs: any[];
  val: any;

  createNodeModalVisible: boolean;


  nodeclsModalvisible: boolean;

  nodeModalvisible: boolean;
  nodeAttrModalvisible: boolean;
  /*新增加的实体对象*/
  newNodeData: RelationData;
  tabactiveKey: string | "1" | '2';
  actionType: string | 'add' | 'modify';//新增/编辑

  //已选新增属性
  attrSval: any;
  //新增属性model
  attrModalvisible: boolean;

//more attr
  attrRefForm?:React.RefObject<MoreAttrRefActionType>;
  InitAttrs?:any;
  NoModifyAttrs?:any;

}

export interface RelationData {

  text: string;
  value: string;
  label: string;
  key: string;

}
const { TabPane } = Tabs;

class Component extends React.Component<ItemState, StateProps> {

  constructor(props) {
    super(props);

    this.init();
    //  this.bindEvent();
  }



  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }



  componentDidMount() {
    const { propsAPI } = this.props;

    //console.log(propsAPI);

    setTimeout(() => {
      this.setState({ inited: true });
    }, 1500);

  }


  init() {
    this.state = {
      visible: false,

      attrs: [],
      val: {},

      createNodeModalVisible: false,

      nodeModalvisible: false,
      nodeAttrModalvisible: false,
      /*新增加的实体对象*/
      newNodeData: {
        text: '',
        value: '',
        label: '',
        key: '',
      },//新增加的实体对象
      tabactiveKey: "1",
      actionType: "",
      inited: false,
      attrForm: React.createRef<FormInstance>(),

      attrSval: {},//已选新增属性

      attrModalvisible: false,
      attrRefForm : React.createRef<MoreAttrRefActionType>(),
      InitAttrs:{},
      NoModifyAttrs:{},
    }
  //  this.myRef = React.createRef();

  }







  render() {

    const { propsAPI } = this.props;
    const { save, update, getSelected, find } = propsAPI;


    const showAttrModal = async() => {

      let fitem = getSelctItem();


      let hide = message.loading("加载中...");

      let noModifyAttr = [];
      //获取上级概念的所有属性

      let erst = await getEntity(fitem.model.nodeid);

      if (erst && erst.data) {

        fitem.model.clsId=erst.data.clsId;
      }

      let clsData = await getCls(fitem.model.clsId);
  
      hide();
      if (clsData && clsData.success && clsData.data) {
  
        if (!isnull(clsData.data.attrs)) {
          const attrids = clsData.data.attrs.split(",");
          for (let index = 0; index < attrids.length; index++) {
            noModifyAttr.push({
              id: attrids[index]
            })
          }
        }
      }
     // data.clsProperties = noModifyAttr;




      if (fitem&&fitem.model&&!isnull(fitem.model.attrs) && (fitem.model.attrs instanceof Array)) {
        //this.setState({ attrs: fitem.model.attrs });
        this.setState({ attrs: fitem.model.attrs,InitAttrs:  fitem.model.attrs,NoModifyAttrs:noModifyAttr });
      }
      else {
        //this.setState({ attrs: [] });
        this.setState({attrs: [], InitAttrs:  [],NoModifyAttrs:noModifyAttr});
      }


  


      this.setState({ nodeAttrModalvisible: true });
    }



    const configEdit = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      // 正向命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);
        // const chart = save();
        // console.log("chart", chart);
        showModal("modify");
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };






    const EntitySelectDone = (item, SelectItem) => {
      // const item=items[0];
      // debugger;
      //console.log("EntitySelectDone：" + JSON.stringify(item))
      this.setState({
        newNodeData: { ...item, text: item.label }
      })

      // console.log(this.state.newNodeData.value);
    }


    //显示 新增/编辑实体 model
    const showModal = (type) => {

      this.setState({ actionType: type });

      if(type==="add")
      {
        //切换tab到新增
        this.setState(
          {
            nodeModalvisible: true,
            newNodeData :{
              label:"",
              text:"",
              value:"",
              key:"",
            }
          })

        return;
      }

      const selectedNodes = getSelected()[getSelected().length - 1];
      if (selectedNodes) {
        const model = selectedNodes.model;
        this.setState(
          {
            nodeModalvisible: true,
            newNodeData:
            {
              label: model.label,
              text: model.label,
              value: model.nodeid,
              key: model.nodeid
            }

          }
        );
      
    }
    }

  

    //检查实体nodeid是否唯一，判断是否拖入或者改变了某个实体，导致其他实体重复
    const checkExsitEntityNum = (nodeid) => {
      let onlyone = true;

      //全部数据
      let graphidata = save();
      let num = 0;
      graphidata.nodes.map(node => {
        if (node.nodeid === nodeid)
          num++;
      })

      if (num > 1)
        onlyone = false

      return num;

    }

 

    //显示实体节点属性
    const getNodeAttrAndShow = async (entityid: string) => {
      const{ propsAPI,graphicModel}=this.props;

      let fitem = getSelctItem();

      let num=checkExsitEntityNum(fitem.model.nodeid);
      if (num >1) {
        message.info(`实体${fitem.model.label}已经存在!`)
        //拖入已有实体
        propsAPI.remove(fitem);
        return;
      }

    
       //设置id:
      //fitem.model.id=fitem.model.nodeid;
      
    //  debugger;

      //获取已有实体信息
      let erst = await getEntity(fitem.model.nodeid);

      if (erst && erst.data) {

        if(erst.data.myEdit)
        fitem.model.localmodify="true";

        //没有标签，设置默认clsName标签
        if (isnull(erst.data.tags)) {
          // let color = "#";

          // for (let index = 0; index < 6; index++) {
          //   color += random(15).toString(16);
          // }

         


          if (fitem.model.tags == null) {

          
            fitem.model.tags = [{ label: erst.data.clsName, value: '1-' + color, key: erst.data.clsName, text: erst.data.clsName }];
            

            fitem.model=UpdateNodeTagColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
            const color= getNodeColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
            fitem.model.color=color;


            update(fitem, fitem.model);
          }
        }
        else {
          
          fitem.model.tags = JSON.parse(erst.data.tags);

          fitem.model=UpdateNodeTagColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
          const color= getNodeColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
          fitem.model.color=color;

          update(fitem, fitem.model);
        }

       

        //没有属性信息，弹出属性填写
        if (isnull(erst.data.properties)||erst.data.properties==="[]") {
          let attrlst = await listattrs({ id: entityid });
          //debugger;
          let attr = [];
          //  debugger;
          if (!isnull(attrlst) && !isnull(attrlst.data) && attrlst.data.length > 0) {
            attrlst.data.map((item) => {
              attr.push({
                id: item.id,
                label: item.name,
                rule: item.dataTypeRule ? JSON.parse(item.dataTypeRule) : {},
                value: ''
              })
            })

            fitem.model.attrs = attr;

            
            //  console.log("timeout:" + JSON.stringify(fitem.model));
            update(fitem, fitem.model);

          
            setTimeout(() => {
               //填写属性
            propsAPI.executeCommand("editnodeattr");
            }, 50);

           
          }
          else {
            fitem.model.attrOk = true;
            update(fitem, fitem.model);


          }
        }
        else {
          fitem.model.attrs = JSON.parse(erst.data.properties);
          fitem.model.attrOk = true;
          update(fitem, fitem.model);


          // const d=save();
          // console.log(d);

        }

      }

    }

      //实体类型确认
      const handleNodeOk = async () => {


        let fitem = getSelctItem();
  
  
        let num = checkExsitEntityNum(this.state.newNodeData.value);
        //检查修改的目的实体类型是否存在
        if (num === 0) {
  
          fitem.model.o2oid = uuid();
          fitem.model.nodeid = this.state.newNodeData.value;
          fitem.model.label = this.state.newNodeData.text;
          fitem.model.nodetype = '1';
  
          update(fitem, fitem.model);
          setTimeout(() => {
            this.setState({
              nodeModalvisible: false,
  
            })
            getNodeAttrAndShow(this.state.newNodeData.value);
          }, 10);
        }
        else{
          message.error(`实体${this.state.newNodeData.text}已经存在!`)
          return;
        }
  
      }

    const handleNodeCancel = () => {
      // console.log("cancel"+this.state.actionType);
      this.setState({
        nodeModalvisible: false
      })

      //debugger;
      if (this.state.actionType === "add") {

        let selectEle = null;
        const selectedNodes = getSelected();
        if (selectedNodes) {
          selectEle = selectedNodes[selectedNodes.length - 1];
          propsAPI.remove(selectEle);
        }

      }
    }

    //获取当前焦点对象
    const getSelctItem = () => {
      let selectEle = null;
      if (!this.state.inited)
        return null;

      const selectedNodes = getSelected();
      if (selectedNodes.length > 1) {
        // message.info('请单选节点编辑');
        selectEle = selectedNodes[selectedNodes.length - 1];
        //return;
      }
      else
        selectEle = selectedNodes[0];

      if (!selectEle)
        return null;

      //  return selectEle;

      // const fitem = find(selectEle.model.id);
      // if(fitem)
      // return fitem;
      // else 
      return selectEle;

    }

    //新增属性完成
    const handleAttrOk = async () => {

      //检查属性是否已有
      if (isnull(this.state.attrSval)) {
        message.error("请选择属性!");
        return;
      }
      //  console.log("-----")
      //  console.log(this.state.attrSval);
      //  console.log( this.state.attrs);
      //  console.log("-----")
      let exsit = false
      this.state.attrs.map(a => {
        if (a.id === this.state.attrSval.id) {
          exsit = true;
        }
      })

      if (exsit) {
        message.error("选择的属性已经存在!")
        return;
      }

    //  console.log(this.state.attrSval);

      //查询属性，获取dataRule
      let attrReal = await getAttr(this.state.attrSval.key);
      
      this.setState({ attrs: this.state.attrs.concat({ ...attrReal.data, label: attrReal.data.name, rule: attrReal.data.dataTypeRule }) });
      
      this.setState({ attrModalvisible: false });

    }

    const handleAttrCancel = () => {

      this.setState({ attrModalvisible: false });

    }

    //实体属性填写完成
    const handleNodeAttrOk = async () => {

      try {



        let fitem = getSelctItem();
        // debugger;
        // let attr = _.merge(this.state.attrs, formvalues );

        // if (fitem.model.attrs)
        //   fitem.model.attrs.map(attr => {
        //     attr.value = formvalues[attr.label];
        //   })
        // if (fitem.model.attrs.length > 0) //有属性，校验
        // {
        //   const formvalues = await this.state.attrForm.current.validateFields();
        // }


        const attrs = await this.state.attrRefForm.current?.validateForm();
        //const value = await form.current?.validateFields();

        this.setState({attrs:attrs});

        fitem.model.attrs = attrs;//this.state.attrs;

        update(fitem, fitem.model);

     
        //字段校验成功
        fitem.model.attrOk = true;


        setTimeout(() => {
          this.setState({
            nodeAttrModalvisible: false,
          })
        }, 30);

      } catch (error) {
        console.log(error);
      }
    }
    const handleNodeAttrCancel = () => {
      this.setState({
        nodeAttrModalvisible: false
      })


      // this.state.attrForm.current.validateFields()
      //   .then(values => {

      //   })
      //   .catch(errorInfo => {
        
      //     let fitem = getSelctItem();

      //     // 字段校验不成功

      //     update(fitem, fitem.model);

      //   });




    }

   

    const configAdd = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      // 正向命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);
        // const chart = save();
        // console.log("chart", chart);
        // showModal("add");
        // handleNodeOk();

       // debugger;
        //拖入确定的实体类型
        let fitem = getSelctItem();
       // console.log(fitem);
        if(fitem)
        getNodeAttrAndShow(fitem.model.nodeid)
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
        // propsAPI.executeCommand('undo');//撤销实体
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };
    const configNewAdd = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      // 正向命令逻辑
      execute(/* editor */) {

        //拖入新的节点或者新建实体类型

        showModal("add");
        // showAttrModal();
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
        // propsAPI.executeCommand('undo');//撤销实体
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    const configAttr = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      // 正向命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);
        // const chart = save();
        // console.log("chart", chart);
        //showModal("add");
        showAttrModal();
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
        // propsAPI.executeCommand('undo');//撤销实体
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    return (
      <Fragment   >


        {/* 编辑实体类型 */}
        <RegisterCommand name="editnode" config={configEdit} />

        {/* 拖入已有实体，不弹model，显示属性 */}
        <RegisterCommand name="addnode" config={configAdd} />

        {/* 拖入新的新建实体 ,显示新建model显示属性 */}
        <RegisterCommand name="addnewnode" config={configNewAdd} />

        {/* 编辑实体属性 */}
        <RegisterCommand name="editnodeattr" config={configAttr} />






        <Modal
         maskClosable={false}
         keyboard={false}
          title="实体信息"
          visible={this.state.nodeModalvisible}
          onOk={handleNodeOk}
          onCancel={handleNodeCancel}
        >

          <Form name="basic" ref={this.formRef}>

            <Tabs ref={this.lineTabRef} activeKey={this.state.tabactiveKey} defaultActiveKey="1" onChange={(activeKey) => {
              console.log(111);
              if (activeKey === '2') this.setState({ createNodeModalVisible: true });
            }}  >
              <TabPane tab="选择实体" key="1">
                <EntitySelect className="width100" labelInValue={true} selectVal={[this.state.newNodeData]} placeholder="请选择实体" onChange={EntitySelectDone} />
              </TabPane>
              <TabPane tab="新建实体" key="2"   >

              </TabPane>

            </Tabs>

          </Form>
        </Modal>


        <Modal
         maskClosable={false}
         keyboard={false}
          title="实体属性"
          visible={this.state.nodeAttrModalvisible}
          onOk={handleNodeAttrOk}
          onCancel={handleNodeAttrCancel}
        >

          {/* <Form ref={this.state.attrForm} name="basic" labelCol={{ span: 5 }} >

            {getAttrForm()}

          </Form> */}
        <MoreAttr showAddDom={true} showsplit={false} ref={this.state.attrRefForm} labelCol={ { span: 5 }}   DefaultNoModifyAttrs={this.state.NoModifyAttrs} InitAttrs={this.state.InitAttrs} BtnTitle="添加实体额外属性"  />

        </Modal>




        <CreateEntityForm title='新增实体' onCancel={() => {
          this.setState({ createNodeModalVisible: false })

        }}

          onSubmit={async (value) => {
            let uid = uuid();
            const rst = await entityAdd({ ...value, id: uid });
            if (rst&&rst.success) {
              this.setState({ tabactiveKey: "1", createNodeModalVisible: false, newNodeData: { "label": value.name, "text": value.name, "value": uid } })

            }
          }}
          title="新建实体"

          modalVisible={this.state.createNodeModalVisible} />


        <Modal
         maskClosable={false}
         keyboard={false}
          title="添加属性"
          visible={this.state.attrModalvisible}
          onOk={handleAttrOk}
          onCancel={handleAttrCancel}
        >

          <Form name="basic" labelCol={{ span: 5 }} >

            <AttrSelect mutiSelect={false} className="width100" labelInValue={true} ishiddenAddBtn={false} selectVal={this.state.attrSval} placeholder="请选择属性" onChange={(v, selectItem) => {

              console.log(v);
              this.setState({ attrSval: { ...v, value: '',id:v.key } });


            }} />


          </Form>
        </Modal>


      </Fragment >

    );
  }
}

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  
}))( withPropsAPI(Component));
