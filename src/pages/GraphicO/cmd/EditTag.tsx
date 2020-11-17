import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI, PropsApi } from "gg-editor";

import { Form, message, Modal, Button, Input, Tabs } from 'antd';


import TagSelect from '@/components/MyCom/TagSelect';


import uuid from '@/utils/uuid';

import { add as entityAdd, listattrs } from '@/pages/EntityList/service';
import { isnull } from '@/utils/utils';

import { FormInstance } from 'antd/lib/form';
import { random, uniqBy } from 'lodash';
import { UpdateNodeTagColor, getNodeColor } from '../components/TagBar';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';


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
  newNodeData: RelationData[],//新增加的实体对象
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
      newNodeData: [],//新增加的实体对象
      tabactiveKey: "1",
      actionType: "",
      inited: false,
      attrForm: React.createRef<FormInstance>()

    }
    this.myRef = React.createRef();

  }







  render() {

    const { propsAPI } = this.props;
    const { save, update, getSelected, find } = propsAPI;


    const showAttrModal = () => {
      this.setState({ nodeAttrModalvisible: true });
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


    //显示 新增/编辑实体 model
    const showModal = (type) => {

      this.setState({ actionType: type });

      const selectedNodes = getSelected()[getSelected().length - 1];
      if (selectedNodes) {
       // debugger;
        const model = selectedNodes.model;
        if (model.tags && model.tags.length > 0)
          this.setState(
            {

              newNodeData: model.tags

            }
          );
        else {
          this.setState(
            {
              newNodeData: []

            }
          );
        }
        setTimeout(() => {
          this.setState(
            {
              nodeModalvisible: true,
            }
          );
        }, 50);
      

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






    const EntitySelectDone = (item, SelectItem) => {
      // const item=items[0];
      // debugger;
      //console.log(item)

      let uniqTags = uniqBy(item, (tag) => {
        return tag.label
      })


      uniqTags.map(tag => {
        try {
          
       
        if (tag.value.indexOf('-') < 0) {
          let color = "#";

          for (let index = 0; index < 6; index++) {
            color += random(15).toString(16);
          }
          tag.value += "-" + color;
        }
        tag.text = tag.label;
      } catch (error) {
         // continue;
      }
      })




      this.setState({
        newNodeData: uniqTags
      })

      // console.log(this.state.newNodeData.value);
    }

    //tag确认完成
    const handleNodeOk = async () => {


      let fitem = getSelctItem();



      fitem.model.tags = this.state.newNodeData;

      const {graphicModel,propsAPI}=this.props;
      fitem.model=UpdateNodeTagColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
      const color= getNodeColor(fitem.model,graphicModel.tags[propsAPI.editor.id]);
      fitem.model.color=color;  


      update(fitem, fitem.model);
      this.setState({
        nodeModalvisible: false,

      })
    }

    const getNodeAttrAndShow = async (entityid: string) => {


      let fitem = getSelctItem();



      let attrlst = await listattrs({ id: entityid });
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

        this.setState({
          nodeModalvisible: false,

        })

        //填写属性
        propsAPI.executeCommand("editnodeattr");
      }
      else {
        fitem.model.attrOk = true;
        update(fitem, fitem.model);


      }
    }

    const handleNodeCancel = () => {
      // console.log("cancel"+this.state.actionType);
      this.setState({
        nodeModalvisible: false
      })


    }



    return (
      <Fragment   >


        <RegisterCommand name="edittag" config={configEdit} />
        {/* <RegisterCommand name="addnode" config={configAdd} />
        <RegisterCommand name="editnodeattr" config={configAttr} />

 */}




        <Modal
         maskClosable={false}
         keyboard={false}
          title="标签信息"
          visible={this.state.nodeModalvisible}
          onOk={handleNodeOk}
          onCancel={handleNodeCancel}
        >

          <Form name="basic" >

            <TagSelect config={{ mode: 'tags' }} className="width100" labelInValue={true} selectVal={this.state.newNodeData} placeholder="请选择或输入新标签" onChange={EntitySelectDone} />

          </Form>
        </Modal>




      </Fragment>

    );
  }
}

//export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  
}))( withPropsAPI(Component));
