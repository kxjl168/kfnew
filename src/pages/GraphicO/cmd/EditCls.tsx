import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI, PropsApi } from "gg-editor";

import { Form, message, Modal, Button, Input, Tabs } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import { forIn } from 'lodash/forIn';

import ClsSelect from '@/components/MyCom/ClsSelect';

import CreateClassForm from '@/pages/KgClassList/components/CreateForm';
import uuid from '@/utils/uuid';

import { add as entityAdd, listattrs } from '@/pages/EntityList/service';
import { isnull } from '@/utils/utils';

import { FormInstance } from 'antd/lib/form';


const { Item } = Form;
export interface RelationProps {
  propsAPI: any;
}
export interface StateProps {
  visible: boolean,

  attrs: any[],
  val: any,

  createNodeModalVisible: boolean,


  nodeclsModalvisible: boolean,

  nodeModalvisible: boolean,
  nodeAttrModalvisible: boolean,
  newNodeData: RelationData,//新增加的概念对象
  tabactiveKey: string | "1" | '2',
  actionType: string | 'add' | 'modify',//新增/编辑
}

export interface RelationData {

  text: string;
  value: string;
  label: string;
  key: string;

}
const { TabPane } = Tabs;

class Component extends React.Component<RelationProps, StateProps> {

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
      newNodeData: {
        text: '',
        value: '',
        label: '',
        key: '',
      },//新增加的概念对象
      tabactiveKey: "1",
      actionType: "",
      inited: false,
      attrForm:React.createRef<FormInstance>()

    }
    this.myRef = React.createRef();
  
  }

 





  render() {

    const { propsAPI } = this.props;
    const { save, update, getSelected, find } = propsAPI;

 
    const showAttrModal = () => {
      this.setState({ nodeAttrModalvisible: true });
    }

 
    //显示 新增/编辑概念 model
    const showModal = (type) => {

      this.setState({ actionType: type });

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
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
        // propsAPI.executeCommand('undo');//撤销概念
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };
    const configClassEdit= {
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
        // propsAPI.executeCommand('undo');//撤销概念
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
        // propsAPI.executeCommand('undo');//撤销概念
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

    //概念类型确认
    const handleNodeOk = async () => {


      let fitem = getSelctItem();


      fitem.model.o2oid = uuid();
      fitem.model.nodeid = this.state.newNodeData.value;
      fitem.model.label = this.state.newNodeData.text;

      let attrlst = await listattrs({ id: this.state.newNodeData.value });
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
      }
      fitem.model.attrs = attr;

      //  console.log("timeout:" + JSON.stringify(fitem.model));
      update(fitem, fitem.model);

      this.setState({
        nodeModalvisible: false,

      })

      //填写属性
      propsAPI.executeCommand("editnodeattr");

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

      const fitem = find(selectEle.model.id);

      return fitem;

    }

    //概念属性填写完成
    const handleNodeAttrOk = async () => {

      const formvalues = await this.state.attrForm.current.validateFields();
    
      let fitem = getSelctItem();
     // debugger;
      //let attr = { ...fitem.model.attrs, ...fromvalues }
      fitem.model.attrs.map(attr=>{
        attr.value=formvalues[attr.label];
      })

      //字段校验成功
      fitem.model.attrOk=true;
    //  fitem.model.attrs = attr;

      //  console.log("timeout:" + JSON.stringify(fitem.model));
      update(fitem, fitem.model);

      this.setState({
        nodeAttrModalvisible: false,

      })
    }
    const handleNodeAttrCancel = () => {
      this.setState({
        nodeAttrModalvisible: false
      })

    
      this.state.attrForm.current.validateFields()
  .then(values => {
    /*
  values:
    {
      username: 'username',
      password: 'password',
    }
  */
  })
  .catch(errorInfo => {
    /*
    errorInfo:
      {
        values: {
          username: 'username',
          password: 'password',
        },
        errorFields: [
          { password: ['username'], errors: ['Please input your Password!'] },
        ],
        outOfDate: false,
      }
    */
   let fitem = getSelctItem();
     
   // 字段校验不成功
   fitem.model.attrOk=false;
 //  fitem.model.attrs = attr;

   //  console.log("timeout:" + JSON.stringify(fitem.model));
   update(fitem, fitem.model);

  });

    
 
  
    }

    const getAttrForm = () => {



      let fitem = getSelctItem();
      if (!fitem)
        return <></>


      return (<>

        {
          !isnull(fitem.model.attrs) &&(fitem.model.attrs instanceof Array) &&
          fitem.model.attrs.map(item => {


            return (<Item label={item.label} initialValue={item.value} name={item.label} rules={[{ required: item.rule && item.rule.enableEmpty !== "1" ? true : false, message: item.rule ? item.rule.errorTip : '' }]} >
              <Input value={item.value}  />
            </Item>)
          })
        }

      </>)

    }

    return (
      <Fragment   >


        <RegisterCommand name="editcls" config={configEdit} />
        <RegisterCommand name="addcls" config={configAdd} />
     
   
       
        <Modal
         maskClosable={false}
         keyboard={false}
          title="概念信息"
          visible={this.state.nodeModalvisible}
          onOk={handleNodeOk}
          onCancel={handleNodeCancel}
        >

          <Form name="basic" ref={this.formRef}>

            <Tabs ref={this.lineTabRef} activeKey={this.state.tabactiveKey} defaultActiveKey="1" onChange={(activeKey) => {
              console.log(111);
              if (activeKey === '2') this.setState({ createNodeModalVisible: true });
            }}  >
              <TabPane tab="选择概念" key="1">
                <ClsSelect className="width100" labelInValue={true} selectVal={[this.state.newNodeData]} placeholder="请选择概念" onChange={EntitySelectDone} />
              </TabPane>
              <TabPane tab="新建概念" key="2"   >
             
              </TabPane>

            </Tabs>

          </Form>
        </Modal>


        <Modal
          title="概念属性"
          visible={this.state.nodeAttrModalvisible}
          onOk={handleNodeAttrOk}
          onCancel={handleNodeAttrCancel}
        >

          <Form ref={this.state.attrForm} name="basic" labelCol={{span:5}} >

            {getAttrForm()}

          </Form>
        </Modal>




        <CreateClassForm title='新增概念' onCancel={() => {
          this.setState({ createNodeModalVisible: false })

        }}

          onSubmit={async (value) => {
            let uid = uuid();
            const success = await entityAdd({ ...value, id: uid });
            if (success) {

              this.setState({ tabactiveKey: "1", createNodeModalVisible: false, newNodeData: { "label": value.name, "text": value.name, "value": uid } })


            }
          }}
          title="新建概念"

          modalVisible={this.state.createNodeModalVisible} />

      </Fragment>

    );
  }
}

export default withPropsAPI(Component);