import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Row, Timeline, Steps, message, Spin, Tooltip, Alert, Divider } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from '../data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';

import { isnull } from '@/utils/utils';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import Col, { ColProps } from 'antd/es/grid/col';
import { IconFontNew } from '@/components/MyCom/KIcon';
import Icon, { UserOutlined, LoadingOutlined, SolutionOutlined, CloseOutlined, FormOutlined, ReadOutlined, PlusOutlined, ArrowDownOutlined, ArrowUpOutlined, ArrowLeftOutlined, ArrowRightOutlined, ContactsTwoTone, LeftCircleOutlined } from '@ant-design/icons';

import { TableListItem as EditData } from '@/pages/ModifyList/data';
import { FormInstance } from 'antd/es/form';
import { ProResponseType } from '@/utils/request';

import _ from 'lodash';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;

  /**当前编辑数据类型 */
  fname?: string;


  value: EditData;
  /**
   * 只读，已审核的只能看
   */
  readonly?: boolean;


  /**
   * col olds
   */
  tableCololds: ProColumns<any>[];
  /**
   * cols
   */
  tableCols: ProColumns<any>[];
  /**
   * labelCol
   */
  formlabelCol?: ColProps;

  /**
   * get普通数据
   */
  getSub: (v: any) => Promise<ProResponseType>;

  /**
 * get普通数据
 */
  getEditSub: (v: any) => Promise<ProResponseType>;

  /**
   * 审核
   */
  audit: (v: any) => Promise<ProResponseType>;


  /**
   * 加载原始数据
   */
  onloadReal?: (v: any) => void;

  /**
   * 加载当前修改数据
   */
  onloadCur?: (v: any) => void;

  /**
   * 应用改动，额外数据
   */
  onApplyLeft?: (v: any) => void;



  /**
   * 提交审核前，检查数据是否修改
   */
  checkChange?: (value: any, initVal: any) => Promise<boolean>;

  /**
 * 额外dom
 */
  oldAddtionDom?: JSX.Element;


  /**
   * 额外dom
   */
  curAddtionDom?: JSX.Element;

  /**
   * 提交数据前，对审核后的表单数据进行适应修改
   */
  beforeCommit?: (data: any) => Promise<any>;


}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}

const FormItem = Form.Item;


interface actionitem {
  userid: string;
  username: string;
  editdate: string;
  editaction: string;
  dataid: string;
}


const AuditForm: React.FC<EditFormProps> = (props) => {

  const form = useRef<FormInstance>();

  const tableref = useRef<FormInstance>();
  const attrRefForm = useRef<MoreAttrRefActionType>();


  const [usernum, SetUsernum] = useState<number>(1);
  //多人操作数据
  const [actionlist, SetActionList] = useState<actionitem[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReal, setLoadingReal] = useState<boolean>(false);


  const [oldTitle, setoldTitle] = useState<string>('');
  const [inited, SetInited] = useState<boolean>(false);

  const [showhelp, setshowhelp] = useState<boolean>(false);


  const [values, setValues] = useState<any>({});
  const [valuesOld, setValuesOld] = useState<any>({});

  const valuesOldRef = useRef<any>({});

  //保存正式数据初始值，比较是否有修改，进行提示
  const [initValuesOld, setinitValuesOld] = useState<any>({});

  const [infomodalVisible, setinfomodalVisible] = useState<boolean>(false);

  const [modisfys, setModifys] = useState<boolean>(false);

  const [submiting, setsubmiting] = useState<boolean>(false);

  const txtRef = useRef<TextArea>();

  const { modalVisible, onCancel, title, beforeCommit, fname, checkChange, onSubmit, onApplyLeft, curAddtionDom, oldAddtionDom, value, readonly, getSub, getEditSub, audit, formlabelCol, tableCols, tableCololds, onloadReal, onloadCur } = props;


  useEffect(() => {
    SetInited(false);
    setModifys(false);
  }, [modalVisible]);

  useEffect(() => {

    valuesOldRef.current = valuesOld;
  }, [valuesOld])



  /**
   * 加载审核快照数据
   */
  const loadAuditedData = async (id, editaction) => {

    setLoadingReal(true);

    if (value.auditState === "5") //删除未通过
    {
      reloadRealdata();
    }
    else {


      // if(!editaction||editaction!=="1")
      //{ //非删除
      const mval = await getEditSub(id);
      if (mval && mval.success && mval.data) {
        setValuesOld(mval.data);
        if (onloadReal)
          onloadReal(mval.data);


      }
      // }
      else {
        setValuesOld({});
      }
    }


    setLoadingReal(false);

  }


  /**
   * 加载真实数据
   * @param id 
   * @param editaction 
   */
  const loadCurData = async (id, editaction) => {

    setLoadingReal(true);




    if (!editaction || editaction !== "1") { //非删除
      const mval = await getSub(id);
      if (mval && mval.success) {
        setValuesOld(mval.data);

        setTimeout(async () => {


          if (!isnull(mval.data)) {

            const nval = await tableref.current?.validateFields();
            setinitValuesOld(nval);
          }

        }, 1000);


        if (onloadReal)
          onloadReal(mval.data);
      }
    }
    else {
      setValuesOld({});
    }


    setLoadingReal(false);

  }

  useEffect(() => {
    if (value) {

      const names = value.editUserName.split(',');
      SetUsernum(names.length);

      const actions = [];
      if (names.length > 1) {

        try {

          const times = value.editUserDate.split(',');
          const dataids = value.editDataId.split(',');
          const userids = value.editUser.split(',');
          const actionids = value.editAction.split(',');



          for (let index = 0; index < names.length; index++) {
            const name = names[index];
            const uid = userids[index];
            const time = times[index];
            const did = dataids[index];
            const action = actionids[index];


            actions.push({
              userid: uid,
              username: name,
              editdate: time,
              editaction: action,
              dataid: did
            })
          }
        } catch (error) {

        }
      }
      else {

        actions.push({
          userid: value.editUser,
          username: value.editUserName,
          editdate: value.editUserDate,
          editaction: value.editAction,
          dataid: value.editDataId
        })
      }

      SetActionList(actions);

      if (!readonly)
        loadCurData(value.editOriDataId, value.editAction);
      else
        loadAuditedData(value.auditRstId, value.editAction);


    }
  }, [props.value]);




  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在提交');
    try {
      const rst = await audit(fields);
      if (rst && rst.success) {
        hide();

        message.success('提交成功');
        return true;
      }

      return false;
    } catch (error) {
      hide();
      message.error('提交失败请重试！');
      return false;
    }
  };




  const submit = async (astate) => {
    let data = await tableref.current?.validateFields();


    //处理相关表单数据

    if (beforeCommit)
      data = await beforeCommit(data);

    if (!data)
      return;


    const editValue = _.cloneDeep(value);

    editValue.auditState = astate;
    if (usernum > 1 && astate === '3')
      editValue.auditState = '4'; //合并通过


    const ainfo = txtRef.current?.state.value;
    editValue.auditInfo = ainfo;


    setsubmiting(true);
    const rst = await handleUpdate({ id: valuesOldRef.current.id, ...data, editDataStr: JSON.stringify(editValue) });
    setsubmiting(false);

    setinfomodalVisible(false);

    onSubmit(rst);
  }



  const renderFooter = () => {

    if (readonly) {
      return <Button onClick={() => { onCancel() }}>关闭</Button>;
    }

    return (
      <>

        {showhelp && <Alert className="help" style={{ display: 'inline-block' }} message={<span>点击右侧审核按钮提交审核合并后的数据<ArrowRightOutlined style={{ color: '#1890ff' }} /></span>} type="info" showIcon={false} />}


        <Button type="dashed" disabled={submiting} onClick={async () => {

          let modify = true;
          if (isnull(valuesOld)) {
            //如果为新增数据，并且右侧没有数据，则先应用左侧改动数据
            applyLeft(async () => {

              await tableref.current?.validateFields();
              //  setinfomodalVisible(true)
            });

          }
          else {





            const nval = await tableref.current?.validateFields();

            if (checkChange)
              modify = await checkChange(nval, initValuesOld)


          }


          if (!modify && value.editAction !== '3') {

            Modal.confirm({
              icon: <IconFontNew type="icon-warning" />,
              content: "数据未改动,确认不修改正式数据直接审核? ",
              onOk: () => {
                submit("3")
              }

            })
          }
          else {
            Modal.confirm({
              icon: <IconFontNew type="icon-xiangqing" />,
              content: "确认审核通过?",
              onOk: () => {
                submit("3")
              }

            })
          }


        }}>
          <IconFontNew type="icon-btn-pass" />   通过
        </Button>

        <Button disabled={submiting} onClick={() => {


          Modal.confirm({
            content: "确认审核不通过?",
            onOk: () => {
              submit("5")
            }

          })



        }}>
          <IconFontNew type="icon-btn-modify-close" />
          不通过
        </Button>
        <Button onClick={() => { onCancel() }}>取消</Button>





        {/* <Button type="primary" onClick={async () => {

          if (isnull(valuesOld)) {
            //如果为新增数据，并且右侧没有数据，则先应用左侧改动数据
            applyLeft(async () => {

              await tableref.current?.validateFields();
              setinfomodalVisible(true)
            });

          }
          else {


            await tableref.current?.validateFields();
            setinfomodalVisible(true)
          }



        }}>
          审核
        </Button>

        <Button onClick={() => { onCancel() }}>取消</Button> */}



      </>
    );
  }

  const renderInfoFooter = () => {
    return (
      <>
        {/* <div style={{float:'left'}}>
<Button    onClick={() => submit(true)}>
         上一改动
        </Button>
       < Button type="dashed"  style={{float:'left'}} onClick={() => submit(true)}>
         下一改动
        </Button>
        </div> */}


        <Button type="dashed" onClick={() => submit("3")}>
          <IconFontNew type="icon-btn-pass" />   通过
        </Button>

        <Button onClick={() => submit("5")}>
          <IconFontNew type="icon-btn-modify-close" />
          不通过
        </Button>
        <Button onClick={() => { onCancel() }}>取消</Button>


      </>
    );
  }

  //左侧数据复制右侧
  const applyLeft = (callback) => {

    if (!isnull(values)) {
      setLoadingReal(true);
      setTimeout(() => {
        const tpdata = values;
        if (valuesOld.id)
          tpdata.id = valuesOld.id;
        setValuesOld(tpdata);


        if (onApplyLeft)
          onApplyLeft(tpdata);


        setLoadingReal(false);
        message.info("已应用数据");

        if (callback)
          callback();
      }, 50);


    }
    else
      message.warn("左侧无数据");

  }

  const reloadRealdata = () => {

    loadCurData(value.editOriDataId, value.editAction);

  }

  const changeData = async (action: actionitem) => {

    setLoading(true);
    if (!action.editaction || action.editaction !== "3") { //非删除
      const mval = await getEditSub(action.dataid);
      if (mval && mval.success) {
        setValues(mval.data);
        if (onloadCur)
          onloadCur(mval.data);
      }
    }
    else {
      setValues({});
    }
    let actiontxt = "修改";
    let icon = <FormOutlined />;
    if (action.editaction === "3") {
      actiontxt = "删除";
      icon = <CloseOutlined color="red" />
    }
    if (action.editaction === "1") {
      actiontxt = "新增";
      icon = <PlusOutlined color="green" />
    }
    try {

      document.querySelectorAll(".step").forEach(dom => {
        dom.className = "ant-steps-item ant-steps-item-finish step  ant-steps-item-custom ant-steps-item-active s" + dom.id;
      })

      document.querySelectorAll(".s" + action.dataid)[0].className = "ant-steps-item ant-steps-item-finish step  ant-steps-item-custom ant-steps-item-active  active s" + action.dataid;

    } catch (error) {

    }
    setoldTitle(`${action.editdate} ${action.username} ${actiontxt} 的数据`);

    setLoading(false);
  }
  const getactionDom = () => {
    // console.log(actionlist.length);
    const dom = actionlist.map(action => {
      let actiontxt = "修改";
      let icon = <FormOutlined />;
      if (action.editaction === "3") {
        actiontxt = "删除";
        icon = <CloseOutlined color="red" />
      }
      if (action.editaction === "1") {
        actiontxt = "新增";
        icon = <PlusOutlined color="green" />
      }

      const desc = `${action.editdate} ${action.username} ${actiontxt}了数据`;
      //  console.log(desc);
      return <Steps.Step className={`step s${action.dataid}`} id={action.dataid} title={actiontxt} status="finish" onClick={
        () => {
          changeData(action)
        }
      } description={<Tooltip title="点击查看改动"><div>{desc}</div></Tooltip>} icon={icon} />


    })

    if (!inited && actionlist && actionlist.length > 0) {
      SetInited(true);
      setTimeout(() => {
        changeData(actionlist[0]);
      }, 50);
    }



    return <Steps className="actionstep" >{dom}
      {!readonly
        && <Steps.Step className="nohand" title="审核" status="wait" description="审核数据" icon={<ReadOutlined />} />
      }
      {readonly
        && <Steps.Step className="nohand" title={value.auditState === "5" ? '审核未通过' : '审核通过'} status="finish" description={"备注:" + (value.auditInfo ? value.auditInfo : '')} icon={value.auditState === "5" ? <IconFontNew type="icon-btn-modify-close" /> : <IconFontNew type="icon-btn-pass" />} />
      }
    </Steps>;
  }

  const getRealData = () => {
    return (
      <>
        {loadingReal && <div style={{ textAlign: "center", paddingTop: '50px' }} ><Spin /></div>}

        {!loadingReal && isnull(valuesOld) && (
          <>
            <Row>
              <span className="compTitle">正式数据 <Tooltip title="重新加载正式数据"><IconFontNew onClick={reloadRealdata} type="icon-refresh" /></Tooltip></span>
              <Tooltip title="无数据" ><IconFontNew style={{ textAlign: "center", fontSize: 30, margin: '0 auto', paddingTop: '100px', width: '100%' }} type="icon-nopass1" /></Tooltip>
            </Row>

          </>
        )}

        {!loadingReal && !isnull(valuesOld) && (
          <>

            {!readonly &&
              <Row>
                <span className="compTitle">
                  正式数据 <Tooltip title="重新加载正式数据"><IconFontNew onClick={reloadRealdata} type="icon-refresh" /></Tooltip></span>
                {showhelp && <Alert className="help" message="点击左侧图标重新加载正式数据" type="info" icon={<ArrowLeftOutlined />} showIcon />}

              </Row>
            }


            {readonly &&
              <Row>
                <span className="compTitle">
                  审核数据快照  {(value && value.editAction === "3"&&value.auditState !== "5") ? "[删除前数据]" : ''}</span>
              </Row>
            }



            <Row>

              <ProTable<TableListItem, TableListItem>
                className='editTable'
                onSubmit={submit}
                onReset={() => onCancel()}

                type="form"

                form={{ initialValues: { ...valuesOld }, labelCol: formlabelCol || { span: 4 } }}

                formRef={tableref}
                columns={tableCololds}
                rowSelection={{}}

                onLoad={() => {
                  // document.querySelectorAll(".editTable .ant-btn")[3].innerHTML = '取消';

                }}


              />
              {oldAddtionDom}
            </Row>
          </>
        )}
      </>
    )
  }

  const getModifyData = () => {
    return (
      <>
        {loading && <div style={{ textAlign: "center", paddingTop: '50px' }} ><Spin /></div>}

        {!loading && isnull(values) && (
          <>
            <Row>
              {/* <span className="compTitle">2020-05-01 09:11:21 张三修改的数据</span> */}
              <span className="compTitle">本地删除</span>

              <Tooltip title="无数据" ><IconFontNew style={{ textAlign: "center", fontSize: 30, margin: '0 auto', paddingTop: '100px', width: '100%' }} type="icon-nopass1" /></Tooltip>
            </Row>
          </>
        )}

        {!loading && !isnull(values) && (
          <>
            <Row>
              {/* <span className="compTitle">2020-05-01 09:11:21 张三修改的数据</span> */}
              <span className="compTitle">{oldTitle}</span>
            </Row>
            <Row>
              <div className="disCover" />

              <ProTable<TableListItem, TableListItem>

                className='editTable'
                onSubmit={submit}
                onReset={() => onCancel()}

                type="form"

                form={{ onChange: () => { setModifys(true) }, initialValues: { ...values }, labelCol: formlabelCol || { span: 4 } }}

                columns={tableCols}
                rowSelection={{}}

                onLoad={() => {
                  // document.querySelectorAll(".editTable .ant-btn")[3].innerHTML = '取消';

                }}
              />
              {curAddtionDom}
            </Row>
          </>
        )}
      </>

    )
  }

  const getTitle = () => {
    return (readonly ? '查看' : '审核') + '改动[' + fname + ']';
  }


  return (
    <div>

      <Modal
         getContainer={document.body}
        className="ownProFoot compareMd"
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        title={<><span>{getTitle()}</span> {!readonly && <Tooltip title="帮助?" placement="right"><IconFontNew type="icon-help" onClick={
          () => {
            setshowhelp(!showhelp);
          }
        } /></Tooltip>} </>}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderFooter()}
      >

        <>
          {showhelp && <div className="helpCover" onClick={() => { setshowhelp(false) }} />}



          {/*      <Steps >
     <Steps.Step  title="修改" description="2020-05-01 09:11:21 张三修改了数据" icon={<FormOutlined  />} />
    <Steps.Step  title="修改"  description="2020-05-01 13:11:21 李四修改了数据" icon={<FormOutlined />} />
    <Steps.Step  title="删除"  description="2020-05-02 15:11:21 xx修改了数据" icon={<CloseOutlined color="red" />} />
    <Steps.Step  title="修改"  description="2020-05-02 16:11:21 李四修改了数据" icon={<FormOutlined />} />
    <Steps.Step  title="修改"  description="2020-05-03 17:11:21 xx修改了数据" icon={<FormOutlined />} /> 
     </Steps>
    */}

          {showhelp && <Alert className="help" message="点击下方查看修改详情" type="info" icon={<ArrowDownOutlined />} showIcon />}

          {
            getactionDom()
          }

          <Row>

            <Col span="10">
              {getModifyData()}

            </Col>
            <Col span="2">
              <div className="middiv">
                {!readonly && (
                  <>
                    <Tooltip title="应用左侧数据改动">
                      <IconFontNew style={{ fontSize: 25 }} onClick={() => { applyLeft() }} type="icon-change1" />
                    </Tooltip>
                    {showhelp && <Alert className=" help centerhelp" message="点击上方图标应用个人改动到正式数据" type="info" icon={<ArrowUpOutlined />} showIcon />}
                  </>
                )}

              </div>
            </Col>
            <Col span="12">

              {getRealData()}
            </Col>

          </Row>

          <Divider type="horizontal" />
          <Row >
            <Col span="24">
              <Form>
                <FormItem label="审核意见" name="info" initialValue={value ? value.auditInfo : ''}>
                  <TextArea ref={txtRef} readOnly={readonly} />
                </FormItem>
              </Form>
            </Col>
          </Row>




          {/* <MoreAttr  showAddDom={true} ref={attrRefForm} labelCol={ { span: 4 }} InitAttrs={values.properties} BtnTitle="添加语境额外属性"  />
        */}
        </>

      </Modal>


      {/* <Modal
        className="ownProFoot"
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        title={'审核意见'}
        visible={infomodalVisible}
        onCancel={() => { setinfomodalVisible(false) }}
        footer={renderInfoFooter()}
      >
       
      </Modal> */}

    </div>
  );
};

export default AuditForm;
