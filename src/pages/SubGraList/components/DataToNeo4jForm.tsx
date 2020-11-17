import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Upload, message, Row, Divider, Alert, Checkbox, Col, Progress, Card, Spin } from 'antd';


import ClsSelect from '@/components/MyCom/ClsSelect';

import { isnull } from '@/utils/utils';

import { toNeo4j, getSubKgRelation, TestNeo4jDb } from '@/services/grapicService';
import '../style.less';

import FormItem from 'antd/lib/form/FormItem';
import { TableListItem } from '../data';
import { FormInstance } from 'antd/lib/form';
import { getToken } from '@/utils/token';
import Test from '@/pages/Test';
import { IconFontNew } from '@/components/MyCom/KIcon';
import { RightCircleFilled } from '@ant-design/icons';
import { models } from '@/.umi/plugin-model/Provider';

import defaultSettings from '';

export interface ItemProps {
    modalVisible: boolean;
    onCancel: () => void;
    onComplete: (data: any, source: string, target: string) => void;
    title: string;

    values?: any;
    subkgId: string;
    subkgName: string
}

const DataToNeo4jForm: React.FC<ItemProps> = (props) => {

    const rform = useRef<FormInstance>();

    // if (values) {
    //   setFormVals({
    //     clsName: values.clsName,
    //     version: values.version,
    //     sort: values.sort,
    //     id: values.id,
    //   })
    // }


    const { modalVisible, values, onCancel, title, onComplete, subkgId, subkgName } = props;

    const [socketpath, Setsocketpath] = useState<string>("");
    const [socket, Setsocket] = useState<any>({});
    const [percent, setpercent] = useState<number>(0);

    const [running, sterunning] = useState<boolean>(false);
    const [rnums, setrnums] = useState<number>(-1);
    const [btndisable, setbtndisable] = useState<boolean>(false);

    const [errormsg, seterrormsg] = useState<string>("");
    const [numinfo, setnuminfo] = useState<string>("");
    const [fetchingnum, setfetchingnum] = useState<boolean>(false);
    const [canclose, setcanclose] = useState<boolean>(false);
    const [alertCls, setalertCls] = useState<string>("show");

    //console.log("1:" + JSON.stringify(props))


    //console.log("2:" + JSON.stringify(values))

    const logref = useRef<string>();
    const errrodiv = useRef();

    useEffect(() => {

        logref.current = errormsg;
    }, [errormsg])


    const disconnect = () => {
        if (socket != null) {
            try {
                socket.close();
                Setsocket(null);
            } catch (error) {

            }

        }
        console.log("socket已经关闭");
    }
    const open = () => {
        console.log("socket已经连接");
    }
    const error = () => {
        console.log("socket error");
    }
    const getMessage = (omsg) => {
        //  console.log(msg);

        const { data: msg } = omsg;

        let data = {};
        if (msg instanceof Object) {
            data = msg;
        }
        else {
            data = JSON.parse(msg);
        }

        if (data.id === subkgId) {
            setpercent(Math.floor(100 * 100 * data.now / data.total) / 100);

            let lmsg = logref.current + "\n" + data.log;
            setnuminfo(data.now + "/" + data.total + "\n");
            seterrormsg(lmsg);
            setalertCls('show');
            sterunning(true);
            setbtndisable(true);

            try {
                document.querySelector(".neo4jForm .ant-alert-description").scrollTop=document.querySelector(".neo4jForm .ant-alert-description").scrollHeight;
                
            } catch (error) {

            }


            if (data.now === data.total) {
                sterunning(false);
                setbtndisable(false);
                setcanclose(true);
            }
        }
        else{
            sterunning(false);
            setbtndisable(false);
            setcanclose(true);
        }
    }

    //05,1117
    

    const wsconnect = () => {
        disconnect();

        const wsPre= REACT_APP_ENV==="dev"?"ws://192.168.1.194:8500/kb/kg":"ws://localhost:9080/kb/kg";

        // console.log(socketpath);
        let csocketpath = wsPre+ "websocket/" + getToken();

        // 实例化socket
        let ssocket = new WebSocket(csocketpath);
        // 监听socket连接
        ssocket.onopen = open;
        // 监听socket错误信息
        ssocket.onerror = error;
        // 监听socket消息
        ssocket.onmessage = getMessage;
        Setsocket(ssocket);
    }

    const refreshSubKgInfo = async (sbuid) => {

        setfetchingnum(true);
        const rst = await getSubKgRelation({ id: sbuid });
        setfetchingnum(false);
        if (rst && rst.success) {
            setrnums(rst.data);
        }

    }


    useEffect(() => {
        wsconnect();

        sterunning(false);
        setbtndisable(false);
        setcanclose(true);
        seterrormsg("");
        


        setTimeout(() => {
            if (!isnull(subkgId))
                refreshSubKgInfo(subkgId);
        }, 50);

    }, [subkgId])

    useEffect(() => {
        seterrormsg("");
        setalertCls("hide");
    }, [modalVisible])




    const renderContent = () => {


        let dom = <></>;








        return (
            <>
                <div className="neo4jForm">

                    <Card>
                        <div>领域名称:{subkgName}</div>
                        <div>关系总数:{fetchingnum && <Spin />}{!fetchingnum && rnums && <>{rnums}</>}</div>
                    </Card>

                    {errormsg && <div className={alertCls}> <Alert className="info" message="info" type="info" closable={false} showIcon message={<>同步日志 {numinfo} <span style={{ float: 'right' }}><IconFontNew type="icon-btn-close" onClick={() => {
                        setalertCls('hide');
                      
                    }} /></span></>} description={

                        <>
                            <div >
                                {errormsg}
                            </div>
                        </>

                    } /></div>
                    }


                    {!running &&
                        (
                            <>




                                {/* <Divider type="horizontal" orientation="left" >目标Neo4j信息</Divider> */}
                                <Form style={{ marginTop: '5px' }} ref={rform} initialValues={
                                    {
                                        dburl: 'bolt://192.168.1.194:7687',
                                        username: 'test',
                                        pass: 'admin',
                                    }
                                }>

                                    {/* <FormItem labelCol={{span:6}} label="同步领域:"  name="sub" rules={[
                                            {
                                                required: false,
                                                message: 'neo4jurl例: bolt://192.168.1.194:7687',
                                            },
                                        ]}>
                                            <Input disabled defaultValue={subkgName}  />
                                        </FormItem> */}

                                    <FormItem labelCol={{ span: 6 }} label="DBurl:" name="dburl" rules={[
                                        {
                                            required: true,
                                            message: 'neo4jurl例: bolt://192.168.1.194:7687',
                                        },
                                    ]}>
                                        <Input defaultValue="bolt://192.168.1.194:7687" />
                                    </FormItem>

                                    <FormItem labelCol={{ span: 6 }} label="Username:" name="username" rules={[
                                        {
                                            required: true,
                                            message: 'neo4j用户',
                                        },
                                    ]}>
                                        <Input defaultValue="test" />
                                    </FormItem>


                                    <FormItem labelCol={{ span: 6 }} label="Pass:" name="pass" rules={[
                                        {
                                            required: true,
                                            message: 'neo4j密码',
                                        },
                                    ]}>
                                        <Input defaultValue="admin" />
                                    </FormItem>




                                </Form>


                            </>
                        )
                    }

                    {running && (
                        <>
                            {/* <Divider type="horizontal" orientation="left">当前进度:</Divider> */}



                            <Progress
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={percent}
                            />
                        </>
                    )}




                </div>
            </>
        );
    }

    const renderFooter = () => {


        return (
            <>
                <Button type="primary" disabled={btndisable} onClick={async () => {

                    const fvals = await rform.current?.validateFields();

                    const dbrst = await TestNeo4jDb({ ...fvals });
                    if (dbrst && dbrst.success && (dbrst.data === true)) {

                        toNeo4j({ ...fvals, id: subkgId, wid: getToken() });

                        sterunning(true);
                        setbtndisable(true);
                        setalertCls('show');

                    }
                    else {
                        message.error("Neo4j连接失败!请检查数据配置");
                    }




                }}>开始同步</Button>
                <Button onClick={() => {
                    onCancel();
                }} >关闭</Button>

            </>
        );
    }

    return (
        <div>

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

export default DataToNeo4jForm;
