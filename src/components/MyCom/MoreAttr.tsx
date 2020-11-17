import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Divider, Spin, Popover, Tooltip } from 'antd';

import { isnull } from '@/utils/utils';
import { MinusOutlined } from '@ant-design/icons';
import { get as getAttr } from '@/pages/AttrList/service';

import _, { multiply } from 'lodash';
import AttrSelect from '@/components/MyCom/AttrSelect';
import { FormInstance } from 'antd/lib/form';
import ClsSelect from './ClsSelect';
import EntitySelect from './EntitySelect';

import { get as getEntity } from '@/pages/EntityList/service';
import { get as getCls } from '@/pages/KgClassList/service';


import './comstyle.less';
import { ColProps } from 'antd/es/grid/col';
import MoreAttrInner from './MoreAttrInner';
import TextArea from 'antd/lib/input/TextArea';
import MFileUpload from './MFileUpload';
import { IconFontNew } from './KIcon';

export interface MoreAttrProps {
    /**
     * 属性初始值
     */
    InitAttrs?: any[];
    BtnText?: string;
    BtnTitle?: string;
    labelCol?: ColProps;
    /**
     * 不能删除的属性
     */
    DefaultNoModifyAttrs?: any[];
    loading?: boolean;
    showAddDom: boolean | true;
    //只是展示，显示文本
    onlyShow: boolean | false;
    showsplit?:boolean;
}

export interface MoreAttrRefActionType {
    /**
     *  验证输入，返回属性
     * */
    validateForm: () => Promise<any[] | boolean | undefined>;
    resetFields:()=>void;

}

const { Item } = Form;

// 更多属性，自定义添加
const MoreAttr: React.FC<MoreAttrProps> = (props, ref) => {


    const { InitAttrs, DefaultNoModifyAttrs, BtnText, BtnTitle, labelCol, loading, showAddDom, onlyShow ,showsplit} = props;

    const [attrModalvisible, setattrModalvisible] = useState<boolean>(false);

    //当前所有的属性
    const [attrs, setAttrs] = useState<any[] | undefined>([]);


    //不能修改的属性，实体编辑，类上的属性等
    const [noModifyattrs, setNoModifyAttrs] = useState<any[] | undefined>([]);


    const [innerFieldLoading, SetinnerFieldLoading] = useState<boolean>(false);
    const [innerFieldAttrs, SetinnerFieldAttrs] = useState<any>([]);


    
    //新增的选择属性
    const [attrSval, setattrSval] = useState<any>();


    const attrForm = useRef<FormInstance>();


    useEffect(() => {

        if (InitAttrs) {

           // debugger;
            if(attrForm.current)
            attrForm.current?.resetFields();

            if (InitAttrs instanceof Object)
            {
                setAttrs(InitAttrs);
                moveNameTop(InitAttrs);
            }
                
            else {
                const defaultAttrs = JSON.parse(InitAttrs);
                setAttrs(defaultAttrs);
                moveNameTop(defaultAttrs);

            }
        }

     


    }, [props.InitAttrs]);


    useEffect(() => {

        if (DefaultNoModifyAttrs) {
            if (DefaultNoModifyAttrs instanceof Object)
                setNoModifyAttrs(DefaultNoModifyAttrs);
            else {
                const defaultAttrs = JSON.parse(DefaultNoModifyAttrs);
                setNoModifyAttrs(defaultAttrs);
            }
        }


    }, [DefaultNoModifyAttrs]);



    useImperativeHandle(ref, ((): MoreAttrRefActionType => {


        return {
            validateForm: async () => {

                await attrForm.current?.validateFields();
                return attrs;
            },
            resetFields:()=>{
              
                let nattr = _.cloneDeep(attrs);
                nattr?.map(attr=>{
                    attr.value="";
                })
                
                setAttrs(nattr);

                attrForm.current?.resetFields();

//
            }
        }



    }));



    /**
     * 检查属性是否在不可删除列表中
     * @param attrid 
     */
    const canDelAttr = (attrid) => {
        let cuAttr = _.find(noModifyattrs, (attr) => {
            return attr.id === attrid;
        });

        if (!isnull(cuAttr))
            return false;//不可修改

        return true;
    }

    const createNormalFile = (item): JSX.Element => {
        let fieldDom = <>
            <Input defaultValue={item.value} value={item.value} onChange={(v) => {

                let nattr = _.cloneDeep(attrs);
                let curitem = _.find(nattr, (data) => {
                    return data.id === item.id
                })
                curitem.value = v.currentTarget.value;
                //  console.log(v)

                setAttrs(nattr);

                let fname = item.label;
                let val = {};
                val[fname] = v.currentTarget.value;
                if (attrForm.current)
                    attrForm.current.setFieldsValue(val);


            }} />
        </>;
        if (onlyShow)
        {
            fieldDom = <><div className="showfield">{item.value}</div></>

            if(item.label.indexOf("URL")>-1)
             fieldDom = <><div className="showfield"><a href={item.value} target="_blank">{item.value}</a></div></>

        }

        return fieldDom;
    }

    //clsSelect字段
    const createClsSelectFieldDom = (item): JSX.Element => {
        let fieldDom = <></>
        let sval = [];

        if (item.value) {

            try {
                if (item.value instanceof Object) { sval = item.value }
                else
                    sval = JSON.parse(item.value);
            } catch (error) {

            }


        }
        fieldDom = <>
            <ClsSelect labelInValue={true} config={{ mode: "multiple" }} mutiSelect={true} hiddenAddBtn={true} hideAddMore={true} selectVal={sval} placeholder="请选择概念" onChange={(v) => {

                let nattr = _.cloneDeep(attrs);
                let curitem = _.find(nattr, (data) => {
                    return data.id === item.id
                })
                curitem.value = v;
                //  console.log(v)

                setAttrs(nattr);

                let fname = item.label;
                let val = {};
                val[fname] = v;
                if (attrForm.current)
                    attrForm.current.setFieldsValue(val);


            }} />
        </>;

        if (onlyShow) {


            const clsdoms = sval.map((item) => {
                return (<Popover
                    onVisibleChange={() => {
                        setTimeout(async () => {

                            SetinnerFieldLoading(true);
                            const clsData = await getCls(item.key);
                            SetinnerFieldLoading(false);

                            if (clsData && clsData.success && clsData.data) {


                                if (!isnull(clsData.data.properties)) {
                                    SetinnerFieldAttrs(clsData.data.properties);
                                }

                            }

                        }, 50);

                    }}
                    trigger="click"
                    title={`${item.label}[概念]`} content={
                        <>
                            <MoreAttrInner onlyShow loading={innerFieldLoading} showAddDom={false} InitAttrs={innerFieldAttrs} />
                        </>

                    }>
                    <a > {item.label}</a>
                </Popover>);
            }
            );

            fieldDom = <>
                <>{clsdoms}          </>
            </>


        }

        return fieldDom;
    }


    const createEntityFieldDom = (item): JSX.Element => {
        let fieldDom = <></>
        let sval = {};
        let qclsId = item.clsId;

        if (item.value) {

            try {
                if (item.value instanceof Object) { sval = item.value }
                else
                    sval = JSON.parse(item.value);
            } catch (error) {

            }
            if (sval) {
                sval.text = sval.label;
                sval.value = sval.key;
            }

        }
        fieldDom = <>
            <EntitySelect className="width100" labelInValue={true} clsId={qclsId} mutiSelect={false} hiddenAddBtn={true} hideAddMore={true} selectVal={sval} placeholder="请选择实体" onChange={(v) => {

                let nattr = _.cloneDeep(attrs);
                let curitem = _.find(nattr, (data) => {
                    return data.id === item.id
                })
                curitem.value = v;
                //  console.log(v)

                setAttrs(nattr);

                let fname = item.label;
                let val = {};
                val[fname] = v;
                if (attrForm.current)
                    attrForm.current.setFieldsValue(val);


            }} />
        </>;

        if (onlyShow)
            fieldDom = <>
                <Popover
                    onVisibleChange={() => {
                        setTimeout(async () => {

                            SetinnerFieldLoading(true);
                            let clsData = await getEntity(sval.key);
                            SetinnerFieldLoading(false);

                            if (clsData && clsData.success && clsData.data) {


                                if (!isnull(clsData.data.properties)) {
                                    SetinnerFieldAttrs(clsData.data.properties);
                                }

                            }

                        }, 50);

                    }}
                    trigger="click"
                    title={`${sval.label}[实体]`} content={
                        <>
                            <MoreAttrInner   onlyShow loading={innerFieldLoading} showAddDom={false} InitAttrs={innerFieldAttrs} />
                        </>

                    }>
                    <a > {sval.label}</a>
                </Popover>
            </>


        return fieldDom;
    }


    const createFileFieldDom = (item): JSX.Element => {
        let fieldDom = <></>
        let sval = [];
        let qclsId = item.clsId;

        if (item.value) {

            try {
                if (item.value instanceof Object) { sval = item.value }
                else
                    sval = JSON.parse(item.value);
            } catch (error) {

            }

        }
        fieldDom = <>
            <MFileUpload curfileType={item.rule.id === "4" ? 'file' : "img"} sval={sval} className="width100" onChange={(v) => {

                let nattr = _.cloneDeep(attrs);
                let curitem = _.find(nattr, (data) => {
                    return data.id === item.id
                })
                curitem.value = v;
                //  console.log(v)

                setAttrs(nattr);

                let fname = item.label;
                let val = {};
                val[fname] = v;
                if (attrForm.current)
                    attrForm.current.setFieldsValue(val);


            }} />
        </>;

        if (onlyShow) {

            fieldDom = sval.map(fdata => {
                let imgdom = <></>
                if (item.rule.id === "5")//图片
                   return(
                        <div className="picdv">
                            <img className="picdata-small" alt="" title={`${fdata.oldname}-点击新窗口预览`} src={fdata.FileUrl} onClick={() => {
                                window.open(fdata.FileUrl, "_blank");
                            }} />
                        </div>
                        )

                return <>
                    
                    <a href={fdata.FileUrl} target="_blank" > {fdata.oldname}</a>
                </>
            })


        }


        return fieldDom;
    }

    //调整顺序
    const moveAttr=(attr,upordown:'up'|'down')=>{
        let ndata = _.cloneDeep(attrs);
        const index=_.findIndex(ndata, (item) => {
            return item.id === attr.id;
        })
        if(upordown==="up")
        {

            if(index>0)
            {
                const pre=ndata[index-1];
                ndata[index-1]=ndata[index];
                ndata[index]=pre;
                
            }
            

        }
        if(upordown==="down")
        {

            if(index<ndata.length-1)
            {
                const next=ndata[index+1];
                ndata[index+1]=ndata[index];
                ndata[index]=next;
                
            }
            
        }
        setAttrs(ndata);
    }

     //调整名称编码置顶顺序
     const moveNameTop=(cattrs)=>{
        let ndata = _.cloneDeep(cattrs);
        const attrname=_.remove(ndata, (item) => {
            return item.label === '名称';
        })
        const attrcode=_.remove(ndata, (item) => {
            return item.label === '编码';
        })

       ndata= _.concat(attrname,attrcode,ndata);
       
        setAttrs(ndata);
    }


    const getAttrForm = () => {


        const loadingdom = <><div className="spinContainer"><Spin /></div></>;

        let dom = <></>;

        let splitdom=   <Divider type="horizontal" className="attrsplit" orientation="left"  >概念属性</Divider>;


    //、   debugger;
        dom = attrs?.map(item => {

            if (!onlyShow)
                if (item.label === "名称" || item.label === "编码")
                    return <></>;// 名称，编码不显示

            if(item.label === "编码")
            return <></>


            let need = false;
            if (item.rule) {

                if (item.rule instanceof Object) {
                }
                else {
                    try {
                        item.rule = JSON.parse(item.rule);
                    } catch (error) {

                    }

                }

                if (item.rule.enableEmpty !== "1")
                    need = true;



            }
            else{
                item.rule={}
            }

            let rule = [{ required: need, message: item.rule ? item.rule.errorTip : '' }]

            if (onlyShow)
                rule = [];

            let fieldDom = createNormalFile(item);

            if (item.rule.id === "1")//cls select
            {

                fieldDom = createClsSelectFieldDom(item);

            }


            if (item.rule.id === "2")//entity select
            {

                fieldDom = createEntityFieldDom(item);
            }


            if (item.rule.id === "3" || item.label === '定义' || item.label === '内容')//大文本 
            {
                fieldDom = <>
                    <TextArea rows="4" defaultValue={item.value} value={item.value} onChange={(v) => {

                        let nattr = _.cloneDeep(attrs);
                        let curitem = _.find(nattr, (data) => {
                            return data.id === item.id
                        })
                        curitem.value = v.currentTarget.value;
                        //  console.log(v)

                        setAttrs(nattr);

                        let fname = item.label;
                        let val = {};
                        val[fname] = v.currentTarget.value;
                        if (attrForm.current)
                            attrForm.current.setFieldsValue(val);


                    }} />
                </>;
                if (onlyShow)
                    fieldDom = <><div className="showfield">{item.value}</div></>
            }

            //文档/图片
            if (item.rule.id === "4" || item.rule.id === "5")//entity select
            {

                fieldDom = createFileFieldDom(item);
            }



            let inlineclss=" inlinerow ";
            if(onlyShow)
            inlineclss="";

            let itemlabel=<><div className="itemlabel">{item.label}</div><div className="attractionleft"><Tooltip title="下移属性"><Button onClick={()=>{moveAttr(item,'down')}}><IconFontNew type="icon-down" title="下移属性"/></Button></Tooltip><Tooltip title="上移属性"><Button onClick={()=>{moveAttr(item,'up')}}><IconFontNew type="icon-up" title="上移属性"/></Button></Tooltip></div></>
            if(onlyShow)
            itemlabel=item.label;

            return (<div key={item.id} className={'attr-' + item.id + inlineclss}><Item label={itemlabel} initialValue={item.value} name={item.label} rules={rule} >
                {fieldDom}
                {!onlyShow && canDelAttr(item.id) &&
                    (
                        <div className="">
                            <Button title="删除属性" onClick={
                                () => {
                                    let attrstp = _.cloneDeep(attrs)

                                    _.remove(attrstp, aitem => {
                                        return aitem.id === item.id
                                    })


                                    setAttrs(attrstp);

                                }
                            }><MinusOutlined /></Button>
                        </div>
                    )}
            </Item></div>)
        });


        const adddom = (
            <>
                <div>
                    <Button title={BtnTitle ? BtnTitle : `添加属性`} onClick={
                        () => {
                            setattrModalvisible(true);
                        }
                    }>{BtnText ? BtnText : `添加属性`}</Button>
                </div>
            </>);

        //  debugger;
if(!showsplit || dom.length===2||onlyShow)
splitdom=<></>;


        return (<>
            <div className={onlyShow ? 'onlyShow' : ''}>
                {
                    loading && loadingdom
                }
                {
                 splitdom  
                }
                {!loading
                    && dom
                }
                {showAddDom &&
                    adddom
                }
            </div>
        </>)

    }

    // 新增属性完成
    const handleAttrOk = async () => {

        // 检查属性是否已有
        if (isnull(attrSval)) {
            message.error("请选择属性!");
            return;
        }
        //  console.log("-----")
        //  console.log(this.state.attrSval);
        //  console.log( this.state.attrs);
        //  console.log("-----")
        let exsit = false
        attrs.map(a => {
            if (a.id === attrSval.id) {
                exsit = true;
            }
        })

        if (exsit) {
            message.error("选择的属性已经存在!")
            return;
        }

        //  console.log(this.state.attrSval);

        //查询属性，获取dataRule
        let attrReal = await getAttr(attrSval.key);

        setAttrs(attrs.concat({ ...attrReal.data, label: attrReal.data.name, rule: attrReal.data.dataTypeRule }));

        setattrModalvisible(false);

    }

    const handleAttrCancel = () => {

        setattrModalvisible(false);
    }


    return (
        <>

            {/* <Divider type="horizontal" >补充属性</Divider> */}

            <div class="ant-pro-table" id="ant-design-pro-table"><div class="ant-pro-table-search ant-pro-table-form">
                <Form ref={attrForm} name="basic" labelCol={labelCol} >

                    {getAttrForm()}

                </Form>

                <Modal
                    maskClosable={false}
                    keyboard={false}
                    title="添加属性"
                    visible={attrModalvisible}
                    onOk={handleAttrOk}
                    onCancel={handleAttrCancel}
                >

                    <Form name="basic" labelCol={{ span: 5 }} >

                        <AttrSelect mutiSelect={false} className="width100" labelInValue={true} ishiddenAddBtn={false} selectVal={attrSval} placeholder="请选择属性" onChange={(v, selectItem) => {

                            // console.log(v);
                            setattrSval({ ...v, value: '', id: v.key });


                        }} />


                    </Form>
                </Modal>
            </div>
            </div>
        </>
    );

}

MoreAttr.defaultProps = {
    onlyShow: false
}


export default forwardRef(MoreAttr);