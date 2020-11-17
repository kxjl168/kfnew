import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Row, Col, message, Spin, Tooltip, Alert } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data.d';



import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm, FormInstance } from 'antd/lib/form/util';

import { TableListItem as EditData } from '@/pages/ModifyList/data';


import { IconFontNew } from '@/components/MyCom/KIcon';
import { isnull } from '@/utils/utils';
import { ColProps } from 'antd/lib/col';
import { ProResponseType } from '@/utils/request';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: boolean) => void;
  title: string;


  value: EditData;
  /** 显示详情，不可提交 */
  showinfo?: boolean;


  /**当前编辑数据类型 */
  fname?: string;

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
   * 更新edit_data的方法
   */
  updateEditDataFun: (v: any) => Promise<ProResponseType>;

  onloadReal?: (v: any) => Promise<any>;

  onloadCur?: (v: any) => Promise<any>;

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


const EditCompareForm: React.FC<EditFormProps> = (props) => {



  const { modalVisible, onCancel, title, onSubmit, fname, value, beforeCommit, oldAddtionDom, curAddtionDom, formlabelCol, tableCololds, getSub, getEditSub, tableCols, showinfo, updateEditDataFun, onloadReal, onloadCur } = props;

  const [loading, setLoading] = useState<boolean>(false);


  const [values, setValues] = useState<any>({});
  const [valuesOld, setValuesOld] = useState<any>({});

  const tableref = useRef<FormInstance>();



  const loadData = async (v: EditData) => {


    if (v.editOriDataId) {

      //查看,真实数据，优先显示审核接口快照
      if (!isnull(v.auditRstId)) {
        const mval = await getEditSub(v.auditRstId);
        if (mval && mval.success && mval.data) {

          let ndata = mval.data;
          if (onloadReal)
             onloadReal(ndata);

          setValuesOld(ndata);



        }
      }
      else {
        const mvalold = await getSub(v.editOriDataId);
        if (mvalold && mvalold.success && mvalold.data) {


          let ndata = mvalold.data;
          if (onloadReal)
             onloadReal(ndata);
          setValuesOld(ndata);


        }
        else
          setValuesOld({});

      }



    }
    else {
      setValuesOld({});
    }


    if ((!v.editAction || v.editAction !== "3") && v.editDataId) { //非删除
      const mval = await getEditSub(v.editDataId);
      if (mval && mval.success && mval.data) {

        let ndata = mval.data;
        if (onloadCur)
           onloadCur(ndata);
        setValues(ndata);

      }
    }
    else {
      setValues({});
    }

    setLoading(false);

  }

  useEffect(() => {

    setLoading(true);

    if (value)
      loadData(value);


  }, [value]);





  /**
   * 更新节点
   * @param fields
   */
  const handleUpdate = async (fields: any) => {
    const hide = message.loading('正在配置');
    try {
      const rst = await updateEditDataFun(fields);
      if (rst && rst.success) {
        hide();

        message.success('配置成功');
        return true;
      }

      return false;
    } catch (error) {
      hide();
      message.error('配置失败请重试！');
      return false;
    }
  };


  const submit = async () => {

    if (value.editAction !== '3') {
      let data = await tableref.current?.validateFields();


      if (beforeCommit)
        data = await beforeCommit(data);

      if (!data)
        return;



      const rst = await handleUpdate({ id: values.id, ...data });
      onSubmit(rst);
    }
    else {
      onCancel();
    }
  }


  const renderFooter = () => {

    if (!showinfo)
      return (
        <>
          <Button type="primary" onClick={() => submit()}>
            保存
        </Button>
          <Button onClick={() => onCancel()}>取消</Button>

        </>
      );

    return (
      <>

        <Button onClick={() => onCancel()}>确定</Button>

      </>
    );

  }

  const getRealData = () => {

    return (<>

      <Row>

        {!showinfo && <span className="compTitle">正式数据</span>}
        {showinfo &&value&& value.modelType&& value.modelType==="log"&&<span className="compTitle">改动后数据</span>}
        {showinfo &&value&& !value.modelType&&<span className="compTitle">审核结果数据快照 {(value && value.editAction === "3"&&value.auditState !== "5") ? "[删除前数据]" : ''}</span>}
      </Row>
      <Row>
        <div className="disCover" />

        {!isnull(valuesOld) && (
          <>
            <ProTable<TableListItem, TableListItem>
              className='editTable'
              // onSubmit={submit}

              onReset={() => onCancel()}

              type="form"

              form={{ initialValues: { ...valuesOld }, labelCol: formlabelCol || { span: 4 } }}

              columns={tableCololds}
              rowSelection={{}}

              onLoad={() => {
                // document.querySelectorAll(".editTable .ant-btn")[1].innerHTML='取消';  

              }}
            />
            {oldAddtionDom}
          </>
        )}
        {isnull(valuesOld) && (
          <>
            <Tooltip title="无数据" ><IconFontNew style={{ textAlign: "center", fontSize: 30, margin: '0 auto', paddingTop: '100px', width: '100%' }} type="icon-nopass1" /></Tooltip>
          </>
        )}
      </Row>

    </>

    );
  }


  const getModifyData = () => {

    return (<>

      <Row>
      {value&&!value.modelType && (<span className="compTitle">我的改动[ {value && (value.editAction === "1" ? "新增" : (value.editAction === "2" ? "修改" : '删除'))}]</span> )}
        {value&&value.modelType&&value.modelType==="log"&& <span className="compTitle">改动前数据 [{value && (value.editAction === "1" ? "新增" : ((value.editAction === "2"||value.editAction.indexOf(',')>-1) ? "修改" : '删除'))}]</span>}
      </Row>
      <Row>

        {isnull(values) && (
          <>
            <Tooltip title="无数据" ><IconFontNew style={{ textAlign: "center", fontSize: 30, margin: '0 auto', paddingTop: '100px', width: '100%' }} type="icon-nopass1" /></Tooltip>
          </>
        )}

        {!isnull(values) && (
          <>
            <ProTable<TableListItem, TableListItem>
              className='editTable'
              // onSubmit={submit}

              onReset={() => onCancel()}

              type="form"

              form={{ initialValues: { ...values }, labelCol: formlabelCol || { span: 4 } }}

              formRef={tableref}
              columns={tableCols}
              rowSelection={{}}

              onLoad={() => {
                //    document.querySelectorAll(".editTable .ant-btn")[1].innerHTML = '取消';

              }}
            />
            {curAddtionDom}
          </>
        )}
      </Row>
    </>
    );
  }

  const getCenterData = () => {
    return (
      <>
        <div className="middiv">
          {!showinfo &&
            <Tooltip title="改动">
              <IconFontNew style={{ fontSize: 30 }} type="icon-change2" />
            </Tooltip>
          }
          {showinfo && (value.auditState === '2') &&
            <>
              <Tooltip title="改动审核中">
                <div className="micon">
                  <Row>
                    <IconFontNew style={{ fontSize: 30 }} type="icon-time" />
                  </Row>
                  <Row><IconFontNew style={{ fontSize: 30 }} type="icon-change2" />
                  </Row>
                </div>
              </Tooltip>

            </>
          }
          {showinfo && (value.auditState === '3' || value.auditState === '4') &&
            <>
              <Tooltip title="改动通过">
                <div className="micon">

                  <Row>
                    <IconFontNew style={{ fontSize: 30 }} type="icon-btn-pass" />
                  </Row>
                  <Row><IconFontNew style={{ fontSize: 30 }} type="icon-change2" />
                  </Row>
                </div>
              </Tooltip>

            </>
          }
          {showinfo && (value.auditState === '5') &&
            <>
              <Tooltip title="改动未通过">
                <div className="micon">

                  <Row>
                    <IconFontNew style={{ fontSize: 30 }} type="icon-btn-modify-close" />
                  </Row>
                  <Row><IconFontNew style={{ fontSize: 30 }} type="icon-change2" />
                  </Row>
                </div>
              </Tooltip>

            </>
          }



        </div>
      </>
    )
  }
  const getTitle = () => {
    return (showinfo ? '查看' : '编辑') + '改动[' + fname + ']';
  }

  return (
    <div>

      <Modal
      getContainer={document.body}
        className="ownProFoot compareMd"
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        title={getTitle()}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderFooter()}
      >


        {loading && <div style={{ textAlign: "center", paddingTop: '50px' }} ><Spin /></div>}

        {!loading && (
          <Row>


            {!showinfo && (
              <>
                <Col span="10">
                  {getRealData()}
                </Col>
                <Col span="2">
                  {getCenterData()}
                </Col>
                <Col span="12">
                  {getModifyData()}
                </Col></>
            )}


            {showinfo && (
              <>
                <Col span="10">
                  {getModifyData()}
                </Col>
                <Col span="2">
                  {getCenterData()}
                </Col>
                <Col span="12">
                  {getRealData()}
                </Col>
              </>

            )}


          </Row>



        )}

        {showinfo && value.auditInfo &&
          <Row>
            <Alert message={`[${value.auditUserName}]的审核意见:${value.auditInfo}`} />
          </Row>
        }




      </Modal>
    </div>
  );
};

export default EditCompareForm;
