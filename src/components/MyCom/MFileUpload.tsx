import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Upload, message, Row, Divider, Alert, Checkbox, Col, Popover, Popconfirm, Tooltip } from 'antd';
import _ from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';

import { isnull } from '@/utils/utils';

import { uploadImg } from '@/services/uploadService';
import { UploadOutlined } from '@ant-design/icons';

import './comstyle.less';

import { IconFontNew } from './KIcon';
import uuid from '@/utils/uuid';

export interface ItemProps {

    onChange: (data: fileItem[]) => void;
    title?: string;
    curfileType: 'file' | 'img';
    sval?: fileItem|fileItem[];
    className?: any;
    maxnums?:number;
}

export interface fileItem {
    relativeURL:string;
    FileUrl:string;
    oldname:string;
    uid:string;
}

const MFileUpload: React.FC<ItemProps> = (props) => {

    const [form] = Form.useForm();

    // if (values) {
    //   setFormVals({
    //     clsName: values.clsName,
    //     version: values.version,
    //     sort: values.sort,
    //     id: values.id,
    //   })
    // }

    const [fileType, SetFileType] = useState<string>("file");//'file' | 'img';
    const [file, SetFile] = useState<any>();
    const fileRef = useRef();

    const [curFileData, setCurFileData] = useState<fileItem[]>([]);

    const curFileDataRef=useRef();


    const [fileList, setFileList] = useState<any[]>([]);

    const [acceptFileType, SetacceptFileType] = useState<string>("*");
    const [modalVisible, setmodalVisible] = useState<boolean>(false);

    const [subgroup, setSubGroup] = useState<any>({});
    const [errormsg, seterrormsg] = useState<string>();

    const [maxPicnum,setmaxPicnum]=useState<number>(1);

    const maxPicnumRef = useRef();

    const { className, onCancel, title, onComplete, curfileType, onChange, sval,maxnums } = props;
    //console.log("2:" + JSON.stringify(values))

    useEffect(() => {
        curFileDataRef.current = curFileData;
    }, [curFileData]);

    useEffect(() => {
        if(maxnums)
         maxPicnumRef.current = maxnums;
         else
         maxPicnumRef.current = 1;
    }, [maxnums]);

    useEffect(() => {
        fileRef.current = file;
    }, [file]);

    useEffect(() => {

        if (sval instanceof Object)
            setCurFileData([sval]);
        if (sval instanceof Array)
            setCurFileData(sval);

        //已有图片或者文档数据,呈现


    }, [props.sval]);

    useEffect(() => {

        SetFileType(curfileType);
        if (curfileType === "file") {
            SetacceptFileType(".pdf,.xlsx,.xls,.doc,.docx,.ppt,.pptx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        }
        if (curfileType === "img")
            SetacceptFileType(".jpeg,.png,.gif,.jpg")

            console.log(curfileType);

    }, [props.curfileType]);

    useEffect(() => {

        if (modalVisible) {
            seterrormsg("");
        }

    }, [props.modalVisible]);





    const uploadFile = async () => {
        if (fileRef.current == null) {
            message.error("请上传文件");
            return;
        }

        let formdata = new FormData(); // FormData 对象
        formdata.append("file", fileRef.current); // 文件对象

        formdata.append("dataType",'file')//不加密


        const hide = message.loading('正在处理,请稍后...', 6000);

        let rst = {};


        rst = await uploadImg(formdata);
      //  debugger;
        if (rst && rst.success) {

            message.success("上传完成");

            let filedata = rst.data;
            filedata.uid = uuid();

            //多张
           // const ndata = curFileDataRef.current.concat(filedata);

           //保留一张
           const ndata = [filedata];

             // debugger;
            setCurFileData(ndata);
            //debugger;
            setFileList([]);
            if (onChange)
                onChange(ndata);
        }
        else {
            if (rst && rst.errorMsg) {
                seterrormsg(rst.errorMsg);
                 message.error("部分上传成功!"+ rst.errorMsg);
            }
            MediaElementAudioSourceNode
            message.error("上传异常!");
            // onComplete(false);
        }

        hide();
    }

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

      //  setFileList([]);



    };

    const renderContent = () => {



        return (
            <>
                <div className="uploadList borderbtn">


                    <Row>
                        <Upload
                            accept={acceptFileType}
                            fileList={fileList}
                            beforeUpload={(file) => {
                                SetFile(file);

                                setTimeout(() => {
                                    uploadFile();
                                }, 250);

                                return false;
                            }} onChange={handleChange}  >
                                {maxPicnumRef &&curFileDataRef.current&& curFileDataRef.current.length< maxPicnumRef.current &&(
                            <Button   >
                                <UploadOutlined /> 选择文件
                             </Button>
                             )}
                        </Upload>
                        {/* <Button onClick={async () => {

                            await uploadFile();


                        }} >上传</Button> */}


                    </Row>

                    <div className="picdv">


                        <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                            {curFileDataRef.current &&

                                curFileDataRef.current.map((fdata,index) => {

                                    if (fdata.relativeURL)
                                        return (

                                            <>
                                                <div style={{ position: "relative" }}>
                                                    <div className="ant-upload-list-item-info">
                                                        <span >


                                                            {curfileType === "file" &&
                                                                <div className="ant-upload-text-icon">
                                                                    <span role="img" aria-label="paper-clip" className="anticon anticon-paper-clip">
                                                                        <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="paper-clip" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                                            <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path></svg>
                                                                    </span>
                                                                </div>
                                                            }

                                                            {curfileType === "img" &&
                                                                <img className="picdata" alt="" title="点击新窗口预览" src={fdata.FileUrl} onClick={() => {
                                                                    window.open(fdata.FileUrl, "_blank");
                                                                }} />
                                                            }

                                                            <span style={{ cursor: "pointer" }} class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1" title={fdata.oldname} onClick={() => {
                                                                window.open(fdata.FileUrl, "_blank");
                                                            }}>{fdata.oldname}</span>
                                                            <span className="ant-upload-list-item-card-actions ">
                                                                {/* <a title="删除文件"><span role="img" aria-label="delete" title="删除文件" tabindex="-1" class="anticon anticon-delete">
                                                        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z">
                                                            </path>
                                                        </svg>
                                                  </span></a> */}
                                                            </span>
                                                        </span></div>

                                                    <div className="ant-upload-list-item-actions">
                                                        <Popconfirm title="确定要移除?" onConfirm={() => {
                                                            let ndata = _.cloneDeep(curFileDataRef.current);
                                                            _.remove(ndata, (item,i) => {
                                                                return i===index;
                                                            })



                                                            debugger;
                                                            setCurFileData(ndata);
                                                            if (onChange)
                                                                onChange(ndata);
                                                        }} >
                                                            <Tooltip title="删除">
                                                            <IconFontNew  type="icon-btn-delete" />
                                                            </Tooltip>
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            </>



                                        )


                                }


                                )


                            }

                        </div>
                    </div>


                </div>
            </>
        );
    }

    const renderFooter = () => {

        return (
            <>
                <Button onClick={() => {
                    setmodalVisible(false);
                }} >关闭</Button>

            </>
        );
    }

    return (
        <div>


            {renderContent()}
            {/* <Modal

                width="500px"
                //   maskClosable={false}
                //   keyboard={false}
                destroyOnClose
                title={'预览'}
                visible={modalVisible}
                onCancel={() => { setmodalVisible(false); }}

                // onSubmit={submit}
                footer={renderFooter()}
            >
                
            </Modal> */}

        </div>
    );
};

export default MFileUpload;
