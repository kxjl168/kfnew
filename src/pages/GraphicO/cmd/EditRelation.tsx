import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI, PropsApi } from "gg-editor";

import { Form, message, Modal, Button, Input, Tabs, Divider, Radio } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

import { forIn } from 'lodash/forIn';

import RelationSelect from '@/components/MyCom/RelationSelect';
import { get as getAttr } from '@/pages/AttrList/service';

import CreateReationForm from '@/pages/RelationList/components/CreateForm';
import uuid from '@/utils/uuid';

import { add as lineAdd, listattrs } from '@/pages/RelationList/service';

import { add as saveRelatedLine, query as listRelatedLines } from '@/services/relatedService';

import { isnull } from '@/utils/utils';
import { useForm } from 'antd/es/form/util';
import { FormInstance } from 'antd/lib/form';
import AttrSelect from '@/components/MyCom/AttrSelect';
import { MinusOutlined } from '@ant-design/icons';
import { getLineColor } from '../components/TagBar';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import { CurrentUser } from '@/models/user';

import './cmd.less';
import { attrColumn } from '@/pages/ModifyList';


const { Item } = Form;
export interface RelationProps {
  propsAPI: any;
  curuser: CurrentUser;
}
export interface StateProps {
  visible: boolean,

  attrs: any[],
  val: any,

  createRelationModalVisible: boolean,

  lineModalvisible: boolean,
  lineAttrModalvisible: boolean,
  newRelationData: RelationData,//新增加的连线对象
  tabactiveKey: string | "1" | '2',
  actionType: string | 'add' | 'modify',//新增/编辑

  //已选新增属性
  attrSval: any;
  attrModalvisible: false;
  //新建的默认数据
  defaultCreateValue?: any;
  //最近使用的关系
  relatedLines?: any[];
  lastRelation?: { id: string, label: string }
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

      createRelationModalVisible: false,

      lineModalvisible: false,
      lineAttrModalvisible: false,
      newRelationData: {
        text: '',
        value: '',
        label: '',
        key: '',
      },//新增加的连线对象
      tabactiveKey: "1",
      actionType: "",
      inited: false,
      attrForm: React.createRef<FormInstance>(),

      //已选新增属性
      attrSval: {},
      attrModalvisible: false,

      defaultCreateValue: {},

      //more attr
      attrRefForm: React.createRef<MoreAttrRefActionType>(),
      InitAttrs: {},
      NoModifyAttrs: {},

      relatedLines: [],
      rdvalue: {},

      lastRelation: {},
      radiovalue:'',
      lastIndexNum:1,//序号数。
      IndexData:{},//序号修改为对象，每个关系一个序号。
    }
    this.myRef = React.createRef();
    this.rgref = React.createRef();
  }







  render() {

    const { propsAPI } = this.props;
    const { save, update, getSelected, find } = propsAPI;


    const showAttrModal = () => {

      let fitem = getSelctItem();

      // if (!isnull(fitem.model.attrs) && (fitem.model.attrs instanceof Array)) {
      //   this.setState({ attrs: fitem.model.attrs });
      // }
      // else {
      //   this.setState({ attrs: [] });
      // }

      let noModifyAttr = [];

      if (fitem && fitem.model && !isnull(fitem.model.attrs) && (fitem.model.attrs instanceof Array)) {
        //this.setState({ attrs: fitem.model.attrs });
        this.setState({ attrs: fitem.model.attrs, InitAttrs: fitem.model.attrs, NoModifyAttrs: noModifyAttr });
      }
      else {
        //this.setState({ attrs: [] });
        this.setState({ attrs: [], InitAttrs: [], NoModifyAttrs: noModifyAttr });
      }




      this.setState({ lineAttrModalvisible: true });
    }


    const showModal = async (type: 'add' | 'modify') => {

      const { curuser } = this.props;
      const linesrst = await listRelatedLines({ userId: curuser.userid, dataType: 1 });
      if (linesrst && linesrst.success) {
        this.setState({ relatedLines: linesrst.data });
      }


      this.setState({ actionType: type });


      if (type === "modify") {
        const fitem = getSelected()[getSelected().length - 1];
        if (fitem) {
          const model = fitem.model;
          this.setState(
            {
              lineModalvisible: true,
              newRelationData:
              {
                label: model.label,
                text: model.label,
                value: model.lineid,
                key: model.lineid
              }

            }


          );

          // if (type === "add") {
          let noModifyAttr = [];

          if (model && !isnull(model.attrs) && (model.attrs instanceof Array)) {
            //this.setState({ attrs: fitem.model.attrs });
            this.setState({ attrs: model.attrs, InitAttrs: model.attrs, NoModifyAttrs: model.attrs });
          }
          else {
            //this.setState({ attrs: [] });
            this.setState({ attrs: [], InitAttrs: [], NoModifyAttrs: [] });
          }

        }
      }

      if (type === "add") {
        this.setState(
          {
            lineModalvisible: true,
            attrs: [], InitAttrs: [], 
            NoModifyAttrs: [],
            newRelationData:{}
          });
        setTimeout(() => {

          if (this.state.lastRelation && this.state.lastRelation.id)
            relationSelectDone({
              key: this.state.lastRelation.id,
              value: this.state.lastRelation.id,
              name: this.state.lastRelation.label,
              label: this.state.lastRelation.label,
            }, null)
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
        showModal("add");
      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
        // propsAPI.executeCommand('undo');//撤销连线
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
        // propsAPI.executeCommand('undo');//撤销连线
      },

      // 快捷按键配置
      shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };




    const relationSelectDone = async (item, SelectItem) => {
      // const item=items[0];
      // debugger;
      //console.log("relationSelectDone：" + JSON.stringify(item))
      this.setState({
        newRelationData: { ...item, text: item.label }
      })

  

      let attrlst = await listattrs({ id: item.value });
      let attr = [];
      //  debugger;
      if (!isnull(attrlst) && !isnull(attrlst.data) && attrlst.data.length > 0) {
        attrlst.data.map((aitem) => {

          let val='';
          if(aitem.name==="序号")
          {
            //val=_.toNumber( this.state. lastIndexNum)+1;

          // debugger;
            val=_.toNumber( this.state.IndexData[item.value]||0)+1;
          }
           


          attr.push({
            id: aitem.id,
            label: aitem.name,
            rule: aitem.dataTypeRule ? JSON.parse(aitem.dataTypeRule) : {},
            value: val
          })
        })

      }

      this.setState({ attrs: attr, InitAttrs: attr, NoModifyAttrs: attr });

      // console.log(this.state.newRelationData.value);
    }

    //连线类型确认
    const handleLineOk = async () => {

      const { graphicModel } = this.props;


      let fitem = getSelctItem();

      if(isnull(this.state.newRelationData))
      {
        message.info("请选择关系");
        return;
      }


      fitem.model.o2oid = uuid();
      fitem.model.lineid = this.state.newRelationData.value;
      fitem.model.label = this.state.newRelationData.text;

      fitem.model.shape = 'CustomLine2';
      const color = getLineColor(graphicModel.lines, fitem.model.label);
      //  console.log(color);
      fitem.model.stroke = color;


      // let attrlst = await listattrs({ id: this.state.newRelationData.value });
      // let attr = [];
      // //  debugger;
      // if (!isnull(attrlst) && !isnull(attrlst.data) && attrlst.data.length > 0) {
      //   attrlst.data.map((item) => {
      //     attr.push({
      //       id: item.id,
      //       label: item.name,
      //       rule: item.dataTypeRule ? JSON.parse(item.dataTypeRule) : {},
      //       value: ''
      //     })
      //   })

      //   fitem.model.attrs = attr;


      const attrs = await this.state.attrRefForm.current?.validateForm();
      //const value = await form.current?.validateFields();

     // debugger;
      this.setState({ attrs: attrs });

      if(attrs&&attrs.length)
      attrs.forEach(attr => {
        if(attr.label==='序号') //序号自动增加
         {
        //   this.setState({lastIndexNum:attr.value});

          //debugger;
           let iData=_.cloneDeep(this.state.IndexData);
           iData[ this.state.newRelationData.value]=attr.value;
           this.setState({IndexData:iData});
        

         }



      });


      fitem.model.attrs = attrs;//this.state.attrs;





      fitem.model.attrOk = true;
      //  console.log("timeout:" + JSON.stringify(fitem.model));
      update(fitem, fitem.model);

      this.setState({
        lineModalvisible: false,

      })

      const { curuser } = this.props;
            //保存最近使用连线
            saveRelatedLine({ userId: curuser.userid, dataType: 1, dataId: this.state.newRelationData.value });
            this.setState({
              lastRelation: {
                id: this.state.newRelationData.value,
                label: this.state.newRelationData.text
              }
            })
      

      //填写属性
      //  propsAPI.executeCommand("editrelationattr");
      // }
      // else {
      //   fitem.model.attrOk = true;
      //   update(fitem, fitem.model);

      //   this.setState({
      //     lineModalvisible: false,

      //   })
      // }
    }

    const handleLineCancel = () => {
      // console.log("cancel"+this.state.actionType);
      this.setState({
        lineModalvisible: false
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

    //线属性填写完成
    const handleLineAttrOk = async () => {

      try {



        let fitem = getSelctItem();

        // fitem.model.attrs = this.state.attrs;



        // update(fitem, fitem.model);

        // if (fitem.model.attrs.length > 0) //有属性，校验
        // {
        //   const formvalues = await this.state.attrForm.current.validateFields();
        // }



        const attrs = await this.state.attrRefForm.current?.validateForm();
        //const value = await form.current?.validateFields();

        this.setState({ attrs: attrs });

        fitem.model.attrs = attrs;//this.state.attrs;



        //字段校验成功
        fitem.model.attrOk = true;


        setTimeout(() => {
          this.setState({
            lineAttrModalvisible: false,
          })
        }, 30);

      } catch (error) {
        console.log(error);
      }
    }

    const handleLineAttrCancel = () => {
      this.setState({
        lineAttrModalvisible: false
      })


      // this.state.attrForm.current.validateFields()
      //   .then(values => {
      //     /*
      //   values:
      //     {
      //       username: 'username',
      //       password: 'password',
      //     }
      //   */
      //   })
      //   .catch(errorInfo => {
      //     /*
      //     errorInfo:
      //       {
      //         values: {
      //           username: 'username',
      //           password: 'password',
      //         },
      //         errorFields: [
      //           { password: ['username'], errors: ['Please input your Password!'] },
      //         ],
      //         outOfDate: false,
      //       }
      //     */
      //     let fitem = getSelctItem();

      //     // 字段校验不成功
      //     fitem.model.attrOk = false;
      //     //  fitem.model.attrs = attr;

      //     //  console.log("timeout:" + JSON.stringify(fitem.model));
      //     update(fitem, fitem.model);

      //   });




    }

    // const getAttrForm = () => {



    //   let fitem = getSelctItem();
    //   if (!fitem)
    //     return <></>


    //   return (<>

    //     {
    //       !isnull(fitem.model.attrs) && (fitem.model.attrs instanceof Array) &&
    //       fitem.model.attrs.map(item => {


    //         return (<Item label={item.label} initialValue={item.value} name={item.label} rules={[{ required: item.rule && item.rule.enableEmpty !== "1" ? true : false, message: item.rule ? item.rule.errorTip : '' }]} >
    //           <Input value={item.value} />
    //         </Item>)
    //       })
    //     }

    //   </>)

    // }

    const getAttrNew = () => {
      return <MoreAttr onlyShow={false} showAddDom={true} showsplit={false} ref={this.state.attrRefForm} labelCol={{ span: 5 }} DefaultNoModifyAttrs={this.state.NoModifyAttrs} InitAttrs={this.state.InitAttrs} BtnTitle="添加额外属性" />;

    }

    const getAttrForm = () => {



      let fitem = getSelctItem();
      if (!fitem)
        return <></>


      let dom = <></>;

      dom = this.state.attrs.map(item => {


        return (<div className={'attr-' + item.id + " inlinerow"}><Item label={item.label} initialValue={item.value} name={item.label} rules={[{ required: item.rule && item.rule.enableEmpty !== "1" ? true : false, message: item.rule ? item.rule.errorTip : '' }]} >
          <Input defaultValue={item.value} value={item.value} onChange={(v) => {

            let nattr = _.cloneDeep(this.state.attrs);
            let curitem = _.find(nattr, (data) => {
              return data.id === item.id
            })
            curitem.value = v.currentTarget.value;
            //  console.log(v)

            this.setState({ attrs: nattr });
            let fname = item.label;
            let val = {};
            val[fname] = v.currentTarget.value;
            this.state.attrForm.current.setFieldsValue(val);


          }} /><Button title="删除属性" onClick={
            () => {
              let attrstp = _.cloneDeep(this.state.attrs)

              _.remove(attrstp, aitem => {
                return aitem.id === item.id
              })


              this.setState({ attrs: attrstp });
              // try {

              //   let itemdom = document.querySelector(".attr-" + item.id);
              //   if (itemdom)
              //     itemdom.parentNode.removeChild(itemdom);
              // } catch (error) {

              // }

            }
          }><MinusOutlined /></Button>
        </Item></div>)
      });
      let adddom = (
        <>
          <div><Button title="添加属性" onClick={
            () => {
              this.setState({ attrModalvisible: true });
            }
          }>添加属性</Button></div>
        </>);


      return (<>

        {
          dom
        }
        {
          adddom
        }

      </>)

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

      //查询属性，获取dataRule
      let attrReal = await getAttr(this.state.attrSval.key);
      // console.log(this.state.attrSval);
      this.setState({ attrs: this.state.attrs.concat({ ...attrReal.data, label: attrReal.data.name, rule: attrReal.data.dataTypeRule }) });
      // console.log(this.state.attrs)
      this.setState({ attrModalvisible: false });

    }

    const handleAttrCancel = () => {

      this.setState({ attrModalvisible: false });

    }


    const addNewRelation=async (value) => {
      let uid = uuid();
      const success = await lineAdd({ ...value, id: uid });
      if (success) {

        this.setState({ tabactiveKey: "1", createRelationModalVisible: false, newRelationData: { "label": value.name, "text": value.name, "value": uid } })

        changeRealtion(uid,value.name);

      }
    }

    const radiorelationChanged = (e) => {

      // console.log(e);
      // this.state.rdvalue
      // this.setState({
      //   rdvalue: e.target.value,
      // });

      const id = e.target.value.split("/")[0];
      const label = e.target.value.split("/")[1];

      this.setState({radiovalue:id+'/'+label});
      

      changeRealtion(id,label);
    }

    const changeRealtion=(id,label)=>{
   
      setTimeout(() => {

        relationSelectDone({
          key: id,
          value: id,
          name: label,
          label: label
        }, null)
      }, 50);
    }



    return (
      <Fragment   >
        <RegisterCommand name="editrelation" config={configEdit} />
        <RegisterCommand name="addrelation" config={configAdd} />
        <RegisterCommand name="editrelationattr" config={configAttr} />
        <Modal
          title="连线信息"
          visible={this.state.lineModalvisible}
          onOk={handleLineOk}
          onCancel={handleLineCancel}
        >

          <Form name="basic" ref={this.formRef}>

            {this.state.relatedLines && this.state.relatedLines.length > 0 && (
              <>
                <Divider type="horizontal" className="attrsplit" orientation="left">经常使用的关系:</Divider>
                <div>
                  <Radio.Group value={this.state.radiovalue} defaultValue={this.state.relatedLines[0].dataId+'/'+this.state.relatedLines[0].dataName} buttonStyle="solid" onChange={radiorelationChanged}>

                    {this.state.relatedLines?.map(line => {
                      return <Radio.Button value={line.dataId + "/" + line.dataName}>{line.dataName}</Radio.Button>
                    })}

                  </Radio.Group>

                </div>
              </>)}

            <Divider type="horizontal" className="attrsplit" orientation="left">选择或者新建关系:</Divider>

            <Tabs ref={this.lineTabRef} activeKey={this.state.tabactiveKey} defaultActiveKey="1" onChange={(activeKey) => {
              console.log(111);
              if (activeKey === '2') this.setState({ createRelationModalVisible: true });
            }}  >
              <TabPane tab="选择关系" key="1">
                <RelationSelect className="width100" onCreateNew={(data) => {
                  this.setState({ createRelationModalVisible: true, defaultCreateValue: data });

                }} labelInValue={true} selectVal={[this.state.newRelationData]} placeholder="请选择关系" onChange={relationSelectDone} />
              </TabPane>
              <TabPane tab="新建关系" key="2"   >
                节点列表...
              </TabPane>

            </Tabs>

          </Form>

          {this.state.attrs && this.state.attrs.length > 0 &&
            (<>
              <Divider type="horizontal" className="attrsplit" orientation="left" >连线属性</Divider>
              <span className="lineattr">
                {getAttrNew()}
              </span>
            </>
            )
          }
        </Modal>


        <Modal
          title="连线属性"
          visible={this.state.lineAttrModalvisible}
          onOk={handleLineAttrOk}
          onCancel={handleLineAttrCancel}
        >

          {/* <Form ref={this.state.attrForm} name="basic" labelCol={{ span: 5 }} > */}

          {/* {getAttrForm()} */}

          {getAttrNew()}


          {/* </Form> */}
        </Modal>




        <CreateReationForm

          title='新增关系' onCancel={() => {
            this.setState({ createRelationModalVisible: false })

          }}
          hideAddMore={true}
          values={this.state.defaultCreateValue}
          onSubmit={addNewRelation}
          title="新建关系"

          modalVisible={this.state.createRelationModalVisible} />



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

              //console.log(v);
              this.setState({ attrSval: { ...v, value: '' } });


            }} />
          </Form>
        </Modal>

      </Fragment>

    );
  }
}

//export default withPropsAPI(Component);

export default connect(({ user, graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  curuser: user.currentUser,

}))(withPropsAPI(Component));
