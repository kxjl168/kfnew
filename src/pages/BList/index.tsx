


import { Alert, Button, Card, Col, Drawer, message, Popconfirm, Rate, Row, Spin, Tooltip } from 'antd';
import React, { useState, useRef, cloneElement, useEffect } from 'react';

import { GetRandomLightColor, isnull } from '@/utils/utils';
import _ from 'lodash';

import './index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/favicon.png';
import EntitySelect from '@/components/MyCom/EntitySelect';

import { asyncEntityRelation, deleteurl, hideurl, passallurl, searchtip, searchtxt as searchUrl, showurl, startSpider, stopSpider, updateurl } from '@/services/urlService';
import uuid from '@/utils/uuid';
import { isAdmin } from '@/utils/authority';
import { UrlItemData, UrlTypeData, UrlItemData as TableListItem } from './data';
import CreateForm from './com/CreateForm';
import EditForm from './com/EditForm';
import MFileUpload, { fileItem } from '@/components/MyCom/MFileUpload';
import { ProColumns } from '@ant-design/pro-table';
import SearchQuery from '@/components/MyCom/SearchQuery';
import { getTagColor } from '../GraphicO/components/TagBar';
import TagSelect from '@/components/MyCom/TagSelect';
import { urlencoded } from 'express';
import { ExclamationCircleOutlined } from '@ant-design/icons';





export const procols = (): ProColumns<UrlItemData>[] => {

    // const [querySubId, setQuerySubId] = useState<any>();

    // const getFullName = (dirname, name) => {

    //   if (dirname && name)
    //     return dirname + ":" + name;
    //   else if (dirname)
    //     return dirname;
    //   else if (name)
    //     return name;
    //   // return record.dirName+":"+record.name;
    // }

    return (
        [
            {
                title: 'ID',
                dataIndex: 'id',
                hideInForm: true,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '链接名称',
                dataIndex: 'url_name',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '链接类型',
                dataIndex: 'url_type',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: 'val1',
                dataIndex: 'val1',
                hideInForm: true,
                hideInSearch: true,
                hideInTable: false,
            },


            {
                title: '链接URL',
                dataIndex: 'url_val',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '图标',
                dataIndex: 'icon',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
                renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {

                    const icon = form.getFieldValue('icon');

                    const sval: fileItem = { uid: uuid(), relativeURL: icon, FileUrl: `${getpreurl()}/${icon}`, oldname: '' }

                    // console.log(sval);
                    return <>
                        <MFileUpload curfileType='img' maxnums={2} sval={sval} className="width100" onChange={(v) => {
                            if (onChange) {
                                if (v && v.length > 0) {
                                    form.setFieldsValue({ 'icon': v[0].relativeURL })
                                    onChange(v[0].relativeURL);
                                }
                                else {
                                    form.setFieldsValue({ 'icon': "" })
                                    onChange("");
                                }
                            }

                        }} />
                    </>;
                },


            },
            {
                title: '描述',
                dataIndex: 'desc_info',
                valueType: "textarea",
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
            },
            {
                title: '标签',
                dataIndex: 'tags',

                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
                renderFormItem: (xx, { type, defaultRender, onChange, ...rest }, form) => {
                    const tagstrs = form.getFieldValue('tags');

                    let sval = [];

                    try {
                        if (!isnull(tagstrs)) {
                            const tags = tagstrs.split(',');

                            _.each(tags, item => {
                                if (item)
                                    sval.push({ text: item, value: item + "-" + GetRandomLightColor(), key: item, label: item })
                            })

                        }
                    } catch (error) {

                    }


                    return (
                        <>
                            <TagSelect config={{ mode: 'tags' }} className="width100" labelInValue selectVal={sval} placeholder="请选择或输入新标签" onChange={(v) => {


                                let uniqTags = _.uniqBy(v, (tag) => {
                                    return tag.label
                                })


                                let tag = "";
                                _.each(uniqTags, item => {
                                    tag += item.label + ",";
                                })
                                form.setFieldsValue({ 'tags': tag });

                                if (onChange)
                                    onChange(tag);

                            }} />
                        </>
                    )

                }
            },
            {
                title: '级别',
                dataIndex: 'level',
                hideInForm: false,
                hideInSearch: true,
                hideInTable: false,
                renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {

                    const level = form.getFieldValue('level');


                    return <>
                        <Rate value={level ? level : 0} allowClear onChange={(v) => {
                            if (onChange) {
                                // if (v) {
                                form.setFieldsValue({ 'level': v })
                                onChange(v);
                                // }

                            }

                        }} />
                    </>;
                },
            },
        ])


}


export interface NodeTagItem {

    name: string,
    num: number,
    color: string,
}


const getpreurl = () => {
    const urlPre = REACT_APP_ENV === "dev" ? "http://127.0.0.1:8081/kb/file" : "http://256kb.cn/file";
    return urlPre;
}
const BList: React.FC<{}> = (props) => {


    const [selectVal, setselectVal] = useState<>();

    const [urllist, seturllist] = useState<UrlTypeData[]>();
    //  const [urllist,seturllist]=useState<UrlItemData>();


    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

    const [editFormValues, seteditFormValues] = useState<TableListItem>();

    const [createDefaultValues, SetCreateDefaultValues] = useState<TableListItem>({ val1: "1" });
    const [fetching, setfetching] = useState<boolean>(false);

    const contentRef = useRef();

    const [inputsearchtxt, setinputsearchtxt] = useState<string>("");

    const [curTxt, setcurTxt] = useState<string>("");

    const [Drawervisible, setDrawervisible] = useState<boolean>(false);

    const EntitySelectDone = () => {

    }

    const tagcolorsref = useRef<NodeTagItem[]>();
    //当前所有tag颜色
    const [tagcolors, settagcolors] = useState<NodeTagItem[]>([]);


    useEffect(() => {
        tagcolorsref.current = tagcolors;
    }, [tagcolors])


    /**
     * 获取，或者随机更新
     * @param name 
     */
    const getUrlTagColor = (name, update) => {
        let color = "#999";


        if (tagcolorsref.current) {
            let tgintags = _.find(tagcolorsref.current, (item) => {
                return item.name === name;
            })
            if (!isnull(tgintags))
                return tgintags.color;
            else {
                color = GetRandomLightColor();

                // setTimeout(() => {
                //     const alltags = _.cloneDeep(tagcolors);
                //     alltags.push({ name: name, color: color });
                //     settagcolors(alltags);
                // }, 200);

            }


            return color;
        }

        return color;

    }

    const refreshAllTagColors = (list) => {
        let color = "#999";

        //debugger;
        _.each(list, itemcls => {

            const items = JSON.parse(itemcls.val);

            _.each(items, model => {

                if (!isnull(model.tags)) {


                    const tags = model.tags.split(',');
                    if (tags && tags.length > 0) {
                        tags.map(item => {


                            let tgintags = _.find(tagcolorsref.current, (itemtag) => {
                                return itemtag.name === item;
                            })
                            if (isnull(tgintags))
                              {
                                color = GetRandomLightColor();

                               
                                    const alltags = _.cloneDeep(tagcolorsref.current);
                                    alltags.push({ name: item, color: color });
                                    settagcolors(alltags);


                            }


                        })
                    }

                }



            })
        })
        
     
      

    }


    const [classshow, setclassshow] = useState<string>("");


    const onFocus = () => {

    }

    useEffect(() => {

        // const hide = message.loading('数据加载中...', 600);
        loadUrl();

        window.onscroll = () => {
            if (window.onscroll) {

                const top = window.pageYOffset ||
                    document.documentElement.scrollTop || document.body.scrollTop || 0;

                if (top > 0) {
                    setclassshow(" ");
                }
                else
                    setclassshow(" hide ");

            }
        };

    }, [])

    const loadUrl = async (name?: string) => {
        setfetching(true);


        const erst = await searchUrl({ url_name: name ? name : curTxt, });

        try {
            if (erst && erst.data) {

                // debugger;
                const judata = JSON.parse(JSON.stringify(erst.data));

                const typedata = JSON.parse(judata.datalist);

                //刷新标签颜色
                refreshAllTagColors(typedata);

                //debugger;
                seturllist(typedata);
            }
        } catch (error) {
            message.error("数据加载失败!");
        }


        setfetching(false);
    }



    const getTopTypes = () => {
        let dom = <></>

        if (urllist)
            dom = urllist.map(item => {

                const items = JSON.parse(item.val);

                return <>

                    <div className="typelabel" onClick={() => {

                        const element = document.getElementById("p" + item.id);

                        setTimeout(() => {
                            window.scrollTo({
                                behavior: "smooth",
                                top: element ? element.offsetTop-180 : 0
                            });
                        }, 100);


                    }}>{item.name} ({items.length}) </div>

                </>
            });



        return <>    <span className="topdv">  <Alert type="warning" message="BLOG分类数据大部分来源于本站爬虫,仅代表个人观点,仅供参考。" closable showIcon icon={<ExclamationCircleOutlined />} /> <div className="toppanel" >{dom}</div></span></>;
    }

    const clickMore = (pid) => {

        const newurllist = _.cloneDeep(urllist);
        _.each(newurllist, item => {

            if (item.id === pid) {
                item.toggle = !item.toggle;
            }
        }
        );

        seturllist(newurllist);



        //   // debugger;
        //   if (document.querySelector("#" + pid).className.indexOf("open") > 0) {
        //     document.querySelector("#" + pid).className = "urlpanel";
        //     //e.target.parentNode.parentElement.className = "urlpanel";
        //     //  pref.current.className="urlpanel";
        // }
        // else {
        //     document.querySelector("#" + pid).className = "urlpanel open";
        //    // e.target.parentNode.parentElement.className = "urlpanel open";
        // }
    }

    const getLinkDv = () => {

        //debugger;
        let dom = <></>
        // const pref=useRef();

        const topdom = getTopTypes();

        if (urllist)
            dom = urllist.map(item => {

                const items = JSON.parse(item.val);
                return <>

                    <span id={"p" + item.id} className="position"></span>
                    <div className={`urlpanel ${item.toggle ? 'open' : ''}`} id={item.id} >
                    {/* {item.name === 'BLOG' && (
                   
                    )} */}
                        <div className="typelabel">{item.name}  {items.length > 10 && (<Tooltip placement="top" title={`${item.toggle ? "收起分类" : "展开分类"}`} > <IconFontNew type={`${item.toggle ? "icon-minimize" : "icon-maxmize"}`} onClick={() => {
                            const pid = item.id;// e.target.parentNode.parentElement.id;
                            clickMore(pid);
                        }} /></Tooltip>)}

                        &nbsp;<Tooltip placement="top" title={`返回顶部`} > <IconFontNew className="toTopIcon" type={`icon-top`} onClick={() => {
                                scrollToTop();
                            }} /></Tooltip>

                            {isAdmin() && (

                                <>

                                    &nbsp;<span className="actionbar">
                                        <IconFontNew type="icon-btn-add" onClick={() => {


                                            SetCreateDefaultValues({ val1: '1', url_type: item.name });

                                            handleModalVisible(true);

                                        }} title="新增同类链接" />&nbsp;

                                    {item.name === 'BLOG' && (


                                            <>
                                                <IconFontNew type="icon-refresh" onClick={() => {

                                                    handleAsyncEntityRelation({});

                                                }} title="同步全部" />
                                        &nbsp;


                                        <IconFontNew type="icon-bx-show" onClick={() => {

                                                    //  debugger;
                                                    handlepassallurl({});

                                                }} title="通过所有BLOG" />
                                          &nbsp;

                                        <IconFontNew type="icon-stop" onClick={() => {

                                                    //  debugger;
                                                    handleStopSpider({});

                                                }} title="停止爬取" />


                                            </>

                                        )}




                                    </span>
                                </>



                            )}</div>
                        <div className="typeContext">{getitemdv(item.val)}</div>


                        {items.length > 10 && (
                            <>
                                <div className="showmore" onClick={(e) => {

                                    const pid = item.id;// e.target.parentNode.parentElement.id;
                                    clickMore(pid);

                                }} >



                                    <span className="bottombtn"><IconFontNew className="more" type="icon-gengduo" /><IconFontNew className="close" type="icon-toggle" />查看更多...</span>


                                </div>
                            </>
                        )}

                    </div>



                </>

            })



        return <> {topdom}<div className="topgap"></div>{dom}</>;
    }

    const scrollToTop = () => {
        window.scrollTo({
            behavior: "smooth",
            top: 0

        });
    }

    const getScrollTopDom = () => {




        return <><span className={`totop ${classshow}`} onClick={() => {

            // const c=contentRef.current;
            scrollToTop();

        }}>返回顶部 </span></>;
    }



    const getimgurl = (item) => {
        if (item.icon)
            return `${getpreurl()}/${item.icon}`
        else
            return logo
    }

    const getkgurl = (item) => {
        if (item.url_name)
            return `/s/search?keyword=${encodeURIComponent(item.url_name)}&type=kg`
        else
            return "javascript:void(0)";
    }


    const getsearchurl = (item) => {
        if (item.url_name)
            return `/s/search?keyword=${encodeURIComponent(item.url_name)}&type=normal`
        else
            return "javascript:void(0)";
    }


    const getLevelTip = (level) => {

        switch (level) {
            case '1':
            case 1:
                return "不错的站点";

            case '2':
            case 2:
                return "很Cool的站点";

            case '3':
            case 3:
                return "非常有意思的站点";
            case '4':
            case 4:
                return "非常赞的站点,值得一看";
            case '5':
            case 5:
                return "超级无敌Cool的站点,墙裂推荐看看";
            default:
                return "";
        }
    }
    const getColor = (level) => {
        switch (level) {
            case '1':
            case 1:
                return "#2f91e0";

            case '2':
            case 2:
                return "#3bc771";

            case '3':
            case 3:
                return "#dd8520";
            case '4':
            case 4:
                return "#df362a";
            case '5':
            case 5:
                return "#9738c4";
            default:
                return "";
        }
    }

    const getTags = (model) => {


        if (isnull(model.tags))
            return <></>

        const tags = model.tags.split(',');
        if (tags && tags.length > 0) {
            return tags.map(item => {

                //const tagcolor = getUrlTagColor(item);
                if (isnull(item))
                    return <></>

                const tagcolor = getUrlTagColor(item);

                return <><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: tagcolor }}>{item}</span></>
            });
        }

        return <></>
    }

    /**
     * 具体每个分类的dom
     */
    const getitemdv = (itemstr) => {

        //  debugger;
        const itemlist = JSON.parse(itemstr);

        const urldoms = itemlist.map(item => {


            //更新删除的
            if (!item.id)
                return <></>;


            return (

                <>
                    <Tooltip title={`${item.level ? getLevelTip(item.level) : ''}`} color={`${getColor(item.level)}`} >
                        <div className={`hd l${item.level} ${item.isshow !== '1' ? 'noshow' : ''}`} title={`${item.isshow !== '1' ? '未展示' : ''}`}>

                            <div className="dvurl">
                                <div className="info">
                                    {/* <div className="urlicon"><img src={`${item.val2}${item.icon}`} alt="图标" className="urlicon" /></div> */}
                                    <div className="urlicon"><img src={getimgurl(item)} alt="图标" className="urlicon" /></div>
                                    <div className="urltitle">
                                        <div className="title" ><a href={item.url_val} target="_blank">{item.url_name}</a> </div>
                                        <div className="action">
                                            {/* <a className="ulink" href={item.url_val} target="_blank">访问 */}

                                            <>
                                                {getTags(item)}
                                                {/* <a className="ulink" href={getsearchurl(item)}><IconFontNew type="icon-detail" /> 详情</a> <a className="ulink" href={getkgurl(item)} target="_blank"><IconFontNew type="icon-kgrelation" />关系</a> */}
                                            </>



                                        </div>

                                    </div>

                                </div>
                                <div className="desc">

                                    {item.desc_info}
                                </div>
                            </div>



                            <div className="dvedit">
                                <span className="actionbar">

                                    {!isAdmin() && (
                                        <>
                                            {item.url_type === "BLOG" && (
                                                <>
                                                    <span className='anticon w30 green' title="访问" onClick={() => {

                                                        window.open(item.url_val, "_blank");

                                                    }} >
                                                        <i className="iconfont icon-wiappfangwenliang" />
                                                    </span>
                                                    <span className='anticon w30 green' title="详情" onClick={() => {

                                                        window.open(getsearchurl(item), "_blank");

                                                    }}>
                                                        <i className="iconfont icon-detail" />
                                                    </span>
                                                    <span className='anticon w30 green' title="关系" onClick={() => {


                                                        window.open(getkgurl(item), "_blank");
                                                    }}>
                                                        <i className="iconfont icon-kgrelation" />
                                                    </span>


                                                </>
                                            )}
                                            {item.url_type !== "BLOG" && (
                                                <>
                                                    <span className='anticon w100' title="访问" onClick={() => {

                                                        window.open(item.url_val, "_blank");

                                                    }}>
                                                        <i className="iconfont icon-wiappfangwenliang" />
                                                    </span>



                                                </>
                                            )}
                                        </>
                                    )
                                    }


                                    {isAdmin() && (<>

                                        <span className='anticon green' title="访问" onClick={() => {

                                            window.open(item.url_val, "_blank");

                                        }}>
                                            <i className="iconfont icon-wiappfangwenliang" />
                                        </span>

                                        {item.url_type === "BLOG" && (
                                            <>
                                                <span className='anticon  green' title="详情" onClick={() => {

                                                    window.open(getsearchurl(item), "_blank");

                                                }} >
                                                    <i className="iconfont icon-detail" />
                                                </span>
                                                <span className='anticon  green' title="关系" onClick={() => {


                                                    window.open(getkgurl(item), "_blank");
                                                }}>
                                                    <i className="iconfont icon-kgrelation" />
                                                </span>




                                                <span className='anticon yellow' title="同步图谱数据" onClick={() => {

                                                    handleAsyncEntityRelation(item);

                                                }}>
                                                    <i className="iconfont icon-refresh" />
                                                </span>

                                                <span className='anticon green' title="开始爬取" onClick={() => {

                                                    handleStartSpider(item);

                                                }}>
                                                    <i className="iconfont icon-spider" />
                                                </span>
                                            </>
                                        )}




                                        {item.isshow === '1' && (
                                            // <IconFontNew type="icon-khide" onClick={() => {

                                            //     handleHide(item)

                                            // }} title="隐藏" />
                                            <span className='anticon' title="隐藏" onClick={() => {

                                                handleHide(item)

                                            }}>
                                                <i className="iconfont icon-khide" />
                                            </span>
                                        )}
                                        {item.isshow !== '1' && (

                                            <span className='anticon green' title="显示" onClick={() => {

                                                handleShow(item)

                                            }}>
                                                <i className="iconfont icon-kshow" />
                                            </span>

                                        )}

                                        <span className='anticon blue' title="编辑" onClick={() => {

                                            seteditFormValues(item);
                                            //  debugger;
                                            handleUpdateModalVisible(true);

                                        }} >
                                            <i className="iconfont icon-btn-edit" />
                                        </span>

                                        <Popconfirm
                                            title='确定删除?'
                                            onConfirm={
                                                (e) => {
                                                    handleRemove(item)
                                                    e.stopPropagation();
                                                }

                                            }
                                            onCancel={(e) => { e.stopPropagation(); }}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <span className='anticon' title="删除">
                                                <i className="iconfont icon-btn-delete-copy" onClick={() => {



                                                }} />
                                            </span>



                                        </Popconfirm>
                                    </>)}
                                </span>
                            </div>



                        </div>
                    </Tooltip>
                </>)
        });

        return urldoms;
    }


    const search = () => {

    }


    /**
       * 通过所有blog
       * @param fields
       */
    const handlepassallurl = async () => {
        //  const hide = message.loading('正在同步');
        try {
            let rst = await passallurl({});
            message.success('完成');


            const newurllist = _.cloneDeep(urllist);
            _.each(newurllist, item => {

                //  debugger;
                const itemlist = JSON.parse(item.val);

                _.each(itemlist, itemurl => {
                    //isshow is null and url_type="BLOG"
                    if (!itemurl.isshow && item.name === "BLOG") {
                        itemurl.isshow = "1";
                    }
                });

            }
            );

            seturllist(newurllist);


            // loadUrl();
        } catch (error) {
            // hide();
            message.error('操作失败请重试！');
            return false;
        }
    };

    /**
        * 同步图谱
        * @param fields
        */
    const handleStartSpider = async (fields: UrlItemData) => {
        //  const hide = message.loading('正在同步');
        try {
            let rst = startSpider({ ...fields });
            message.success('已开始后台爬取,起始url:' + fields.url_val);
        } catch (error) {
            // hide();
            message.error('操作失败请重试！');
            return false;
        }
    };

    const handleStopSpider = async (fields: UrlItemData) => {
        //  const hide = message.loading('正在同步');
        try {
            let rst = stopSpider({ ...fields });
            message.success('已停止爬虫,开始刷新...');

            loadUrl();
        } catch (error) {
            // hide();
            message.error('操作失败请重试！');
            return false;
        }
    };




    /**
        * 同步图谱
        * @param fields
        */
    const handleAsyncEntityRelation = async (fields: UrlItemData) => {
        const hide = message.loading('正在同步');
        try {
            let rst = await asyncEntityRelation({ ...fields });
            if (rst && rst.success) {
                hide();
                message.success('处理成功');
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('操作失败请重试！');
            return false;
        }
    };


    /**
     * 添加g、更新节点
     * @param fields
     */
    const handleUpdate = async (fields: UrlItemData) => {
        const hide = message.loading('正在处理');
        try {
            let rst = await updateurl({ ...fields });
            if (rst && rst.success) {
                hide();
                message.success('处理成功');

                updateSingle(fields, 'modify')
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('操作失败请重试！');
            return false;
        }
    };

    /**
     * 更新节点
     * @param fields
     */
    const handleShow = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await showurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');
                updateSingle(fields, 'show')
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };





    /**
     * 更新节点
     * @param fields
     */
    const handleHide = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await hideurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');

                updateSingle(fields, 'hide')
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };


    /**
     * 更新节点
     * @param fields
     */
    const handleRemove = async (fields: UrlItemData) => {
        const hide = message.loading('正在配置');
        try {
            let rst = await deleteurl(fields);
            if (rst && rst.success) {
                hide();

                message.success('配置成功');
                updateSingle(fields, 'del')
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            hide();
            message.error('配置失败请重试！');
            return false;
        }
    };





    //前台跟新单条数据
    const updateSingle = (itemcur, type: "modify" | 'del' | 'show' | 'hide') => {
        const newurllist = _.cloneDeep(urllist);
        _.each(newurllist, item => {

            //  debugger;
            let itemlist = JSON.parse(item.val);

            itemlist = _.map(itemlist, itemurl => {


                //isshow is null and url_type="BLOG"
                if (itemurl.id === itemcur.id) {
                    if (type === 'modify')
                        itemurl = itemcur;
                    if (type === 'del')
                        itemurl = {};
                    if (type === 'show')
                        itemurl.isshow = '1';
                    if (type === 'hide')
                        itemurl.isshow = '2';
                }

                return itemurl;
            });

            //  debugger;
            item.val = JSON.stringify(itemlist);

        }
        );

        seturllist(newurllist);
    }

    const onDrawerClose = () => {
        setDrawervisible(false);
    }




    return (<>

        <span className={`searchDv  `} >

            <CreateForm values={createDefaultValues} onSubmit={async (value, callback) => {



                // if(!isnull(value.attrs))
                // value.attrs=value.attrs.toString();


                const success = await handleUpdate(value);
                if (success) {

                    if (value.shouldclose) {
                        handleModalVisible(false);

                    }
                    else
                        message.info("可以修改数据继续添加!");

                    loadUrl();

                }
            }} title="新建链接" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />



            <EditForm modalVisible={updateModalVisible} onCancel={
                () => {
                    handleUpdateModalVisible(false);
                }} title="编辑链接" values={editFormValues} onSubmit={async (value) => {

                    let postdata = _.cloneDeep(value) as UrlItemData;

                    // debugger;
                    const success = await handleUpdate(postdata);
                    if (success) {
                        handleUpdateModalVisible(false);


                    }
                }}


            />



            <div className="stitle"  >

                <span className="stxt">知识检索</span>
                <Row>
                    <Col span={2}><img className="slogo" onClick={() => {

                        //props.history.push("/");

                        props.history.push("/");


                    }} alt="" src={logo} /></Col>
                    <Col span={8}>
                        <Card>
                            <span className="flex">
                                {/* <EntitySelect className="width100" onFocus={onFocus} labelInValue selectVal={selectVal} placeholder="搜索链接" onChange={EntitySelectDone} /> */}

                                <SearchQuery onChange={(v) => { setcurTxt(v) }} inputvalue={inputsearchtxt} onFocus={onFocus} className="width100" selectVal={selectVal} placeholder="链接URL / 站点 / 描述" onSearch={(value) => {
                                    loadUrl(value);
                                    //props.history.push("/s/search?keyword=" + value);

                                }} fetchHander={async (qdata) => {

                                    return searchtip({ url_name: qdata.keyword });

                                }}

                                    rstDealHander={(items) => {

                                        // debugger;
                                        const rst = [];
                                        items.forEach(item => {
                                            rst.push({ text: item.url_name, value: item.url_name, key: item.id })
                                        })

                                        return rst;

                                    }}
                                />

                                <IconFontNew className="searchIconR" type="icon-search" onClick={search} />
                            </span>
                        </Card>

                    </Col>
                    <div className="toRoot"><a href="javascript:void(0);" onClick={() => {
                        props.history.push("/");
                    }} >首页</a></div>
                </Row>
                {/* </div>
</TweenOne> */}
            </div>
        </span>



        <div className="scontent" ref={contentRef}>
            <Row>
          

                {fetching ? <><Spin style={{ margin: '0 auto', paddingTop: '100px' }} /></> : getLinkDv()}


            </Row>
        </div>

        {getScrollTopDom()}



        <Drawer
            title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={onDrawerClose}
            visible={Drawervisible}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>



    </>);
}

export default BList;