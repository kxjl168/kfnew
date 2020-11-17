import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Upload, message, Row, Divider, Alert, Checkbox, Col } from 'antd';

import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';

import { isnull } from '@/utils/utils';

import { importClsRelationDataByExcel, importEntityRelationDataByExcel } from '@/services/uploadService';
import { UploadOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import SubGraSelect from './SubGraSelect';

import './comstyle.less';

export interface ItemProps {
    modalVisible: boolean;
    onCancel: () => void;
    onComplete: (data: any) => void;
    title: string;
    curfileType: string | '1' | '2';

}

const DataImport: React.FC<ItemProps> = (props) => {

    const [form] = Form.useForm();

    // if (values) {
    //   setFormVals({
    //     clsName: values.clsName,
    //     version: values.version,
    //     sort: values.sort,
    //     id: values.id,
    //   })
    // }

    const [fileType, SetFileType] = useState<string>("1");//1.cls relation 2,entity
    const [file, SetFile] = useState<any>();

    const [fileList, setFileList] = useState<any[]>([]);

    const [templateFileUrl, SettemplateFileUrl] = useState<string>("#");

    const [subgroup, setSubGroup] = useState<any>({});
    const [errormsg, seterrormsg] = useState<string>();
    const { modalVisible, onCancel, title, onComplete, curfileType } = props;

    const [neo4jImport, setNeo4jImport] = useState<boolean>(false);
    //console.log("1:" + JSON.stringify(props))


    //console.log("2:" + JSON.stringify(values))


    useEffect(() => {

        SetFileType(curfileType);

    }, [props.curfileType]);

    useEffect(() => {

        if (modalVisible) {
            seterrormsg("");
        }

    }, [props.modalVisible]);



    const handleChange = info => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);


        // 2. Read from response and show file link
        // fileList = fileList.map(file => {
        //   if (file.response) {
        //     // Component will show file.url as link
        //     file.url = file.response.url;
        //   }
        //   return file;
        // });

        setFileList(fileList);
    };

    const renderContent = () => {

        let templatedom = <></>

        let dom = <></>;
        let btn = <Button onClick={async () => {


            if (file == null) {
                message.error("请上传文件");
                return;
            }

            if (isnull(subgroup)) {
                message.error("请选择子图");
                return;
            }




            let formdata = new FormData(); // FormData 对象
            formdata.append("excelFile", file); // 文件对象


            formdata.append("fromNeo4j", neo4jImport);
            //子图id
            formdata.append("subGroupId", subgroup.key);

            const hide = message.loading('正在处理,请稍后...', 6000);

            let rst = {};

            if (fileType === "1")
                rst = await importClsRelationDataByExcel(formdata);
            else
                rst = await importEntityRelationDataByExcel(formdata);

            if (rst && rst.success) {

                message.success("上传完成");

                if (onComplete)
                    onComplete(true);
            }
            else {
                if (rst && rst.errorMsg) {
                    seterrormsg(rst.errorMsg);
                    message.error("部分上传成功!");
                }

                onComplete(false);
            }

            hide();

        }} >上传</Button>

        if (fileType === "1") {
            templatedom = (
                <Row>
                    <FormItem label="导入模板:">
                        <a href={"/cls.xlsx"} target="_blank">模板文件</a>
                    </FormItem>
                    <div className="split"></div>
                </Row>
            )
        }
        else {
            templatedom = (
                <Row>
                    <Col span="12" >
                        <FormItem label="Neo4j导入:" rules={[
                            {
                                required: true,
                                message: '必填',
                            },
                        ]}>
                            <Checkbox defaultChecked={false} checked={neo4jImport} onChange={(e) => {
                                setNeo4jImport(e.target.checked);
                            }} />
                        </FormItem>
                    </Col>
                    <Col span="12">

                        {!neo4jImport &&
                            <FormItem label="导入模板:">
                                <a href={"/entity.xlsx"} target="_blank">模板文件</a>
                            </FormItem>
                        }
                        {neo4jImport &&
                            <FormItem label="Neo4j导入模板:">
                                <a href={"/neo4j.xlsx"} target="_blank">模板文件</a>
                            </FormItem>
                        }
                    </Col>
                    <div className="split"></div>
                </Row>);
        }


        dom = <>
            <Upload
                fileList={fileList}
                beforeUpload={(file) => {
                    SetFile(file);
                    return false;
                }} onChange={handleChange}  >
                <Button>
                    <UploadOutlined /> 选择文件
          </Button>
            </Upload>
        </>


        return (
            <>
                <div className="uploadMd">
                    {templatedom}
                    {errormsg && <Alert className="alert" message="Warning" type="warning" closable={true} showIcon message="导入完成,过程中发生异常" description={errormsg} />}

                    <Row>
                        <Form>
                            <FormItem label="所属子图:" rules={[
                                {
                                    required: true,
                                    message: '选择子图',
                                },
                            ]}>
                                <SubGraSelect className="width100" labelInValue={true} selectVal={{}} placeholder="请选择子图" onChange={(v, selectItem) => {

                                    setSubGroup(v);


                                }} />
                            </FormItem>
                        </Form>




                    </Row>
                    <Row>
                        {dom}
                        {btn}

                    </Row>
                </div>
            </>
        );
    }

    const renderFooter = () => {

        return (
            <>
                <Button onClick={() => {
                    onCancel();
                }} >关闭</Button>

            </>
        );
    }

    return (
        <div>
            <div></div>
            <Modal
              maskClosable={false}
              keyboard={false}
                destroyOnClose
                title={title}
                visible={modalVisible}
                onCancel={() => onCancel()}

                // onSubmit={submit}
                footer={renderFooter()}
            >
                {renderContent()}


            </Modal>
        </div>
    );
};

export default DataImport;
