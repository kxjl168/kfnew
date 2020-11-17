import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Upload, message, Row, Divider, Alert, Checkbox, Col } from 'antd';


import ClsSelect from '@/components/MyCom/ClsSelect';

import { isnull } from '@/utils/utils';

import { mergeCls,get } from '../service';
import '../style.less';

import FormItem from 'antd/lib/form/FormItem';
import { TableListItem } from '../data';

export interface ItemProps {
    modalVisible: boolean;
    onCancel: () => void;
    onComplete: (data: any,source:string,target:string) => void;
    title: string;
    
    values?:any;
}

const MergeForm: React.FC<ItemProps> = (props) => {

    const [form] = Form.useForm();

    // if (values) {
    //   setFormVals({
    //     clsName: values.clsName,
    //     version: values.version,
    //     sort: values.sort,
    //     id: values.id,
    //   })
    // }


    const { modalVisible,values, onCancel, title, onComplete } = props;

    const [source,SetSource]=useState<any>({});
    const [target,SetTarget]=useState<any>();
    const [cover, setcover] = useState<boolean>(false);


    //console.log("1:" + JSON.stringify(props))


    //console.log("2:" + JSON.stringify(values))


    useEffect(() => {

        if (values.source) {
            SetSource(values.source);
        }

    }, [props.values]);



    const renderContent = () => {

     
        let dom = <></>;
     







        return (
            <>
                <div className="mergeForm">

                  
                    <Row>
                        <Form>

                        <FormItem label="原始概念:" rules={[
                                {
                                    required: true,
                                    message: '选择原始概念',
                                },
                            ]}>
                                <ClsSelect config={{disabled:true}} className="width100" labelInValue={true} selectVal={source} placeholder="请选择源概念" onChange={(v, selectItem) => {

                                  SetSource(v);

                                }} />
                            </FormItem>
                            <FormItem label="目标概念:" rules={[
                                {
                                    required: true,
                                    message: '选择目标概念',
                                },
                            ]}>
                                <ClsSelect onlyreal className="width100" labelInValue={true} selectVal={target} placeholder="请选择目标概念" onChange={(v, selectItem) => {

                                    SetTarget(v);

                                }} />
                            </FormItem>
                            <FormItem label="覆盖属性:" rules={[
                                {
                                    required: false,
                                    message: '必填',
                                },
                            ]}>
                                <Checkbox defaultChecked={false} checked={cover} onChange={(e) => {
                                    setcover(e.target.checked);
                                }} />
                            </FormItem>
                        </Form>




                    </Row>
                 
                </div>
            </>
        );
    }

    const renderFooter = () => {

        let btn = <Button type="primary" onClick={async () => {


            if (isnull(source)) {
                message.error("请选择源概念");
                return;
            }
            
            if (isnull(target)) {
                message.error("请选择目标概念");
                return;
            }
            
            
            
            const hide = message.loading('正在处理,请稍后...', 600);
            
            let rst = {};
            
            

            const sourceRst= await get(source.key);
            const targetRst= await get(target.key);

            rst = await mergeCls({
                sourceId:source.key,
                targetId:target.key,
                coverTarget:cover
            });
            
            
            if (rst && rst.success) {
            
                message.success("操作完成");
            
                if (onComplete)
                    onComplete(true,sourceRst.data.parentId,targetRst.data.parentId);
            }
            else {
            
                onComplete(false,sourceRst.data.parentId,targetRst.data.parentId);
            }
            
            hide();
            
            }} >合并</Button>

        return (
            <>
               {btn}
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

export default MergeForm;
