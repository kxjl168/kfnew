
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Form, Modal, Button, Input, Select, message, Spin, Tree, Popover, Divider, Popconfirm } from 'antd';

import { query, add, getTree, get } from '../../pages/DirList/service';
import { FormInstance } from 'antd/lib/form';
import { PlusCircleOutlined, FileOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

import CreateForm from '@/pages/AttrList/components/CreateForm';
import { attrColumn } from '@/pages/AttrList/index';
import { IconFontNew } from '@/components/MyCom/KIcon';

import './comstyle.less';
import ProTable from '@ant-design/pro-table';
import { TableListItem } from '@/pages/AttrList/data';
import uuid from '@/utils/uuid';
import { isnull } from '@/utils/utils';
import { Item } from 'gg-editor';

import SubGraSelect from './SubGraSelect';
import _ from 'lodash';
import KScroll from './KScrollBar';


export interface TreeProps {

    showSubQuery:boolean;

    OnTreeNodeClick?: (clsId: string, subId: string, subName: string, clsItem: any) => void;

    OnSubKgIdChange?: (subId: string, subName: string) => void;
    /**
     * 是否显示操作按钮
     */
    showNodeAction: boolean;
    /**
     * 新建子语境
     */
    OnTreeNodeAddNewClsClick?: (clsItem: any) => void;

    /**
     * 修改语境
     */
    OnTreeNodeModifyClsClick?: (clsItem: any) => void;

    /**
     * 修改关系
     */
    OnTreeNodeModifyRelationClick?: (clsItem: any) => void;

    /**
     * 删除
     */
    OnTreeNodeDeleteClsClick?: (clsItem: any) => void;

    OnTreeMergeClick?: (clsItem: any) => void;
}

export interface Itemdata {
    text: string;
    value: string;
}

interface DataNode {
    title: any;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
    icon: any;
}

export interface DirTreeActionType {
    /**
     * 设置领域
     */
    setSubKgData:(id:string,name:string)=>void;
    reloadTree: (key?: string | '0') => void;
    /***
     * 刷新指定节点
     */
    refreshNode: (key: string) => void;
}


const DirTree: React.FC<TreeProps> = (props, ref) => {

    const [form] = Form.useForm();

    // const rootnode: DataNode[] = [{
    //     title: '-', key: '0'
    // }]
    const [treeData, setTreeData] = useState<DataNode[]>([]);

    const treeDataRef = useRef<DataNode[]>();

    const [fetching, SetFetching] = useState<boolean>(false);

    const [expandedKeysList, SetExpandedKeysList] = useState<string[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
    const [curSelectNd, SetCurSelectNd] = useState<any>({});
    const [curSelectKey, setcurSelectKey] = useState<string[]>([]);

    const [rightClickNodeTreeItem, setrightClickNodeTreeItem] = useState<any>({});
    const [showMenu, setshowMenu] = useState<boolean>(false);
    const [subId, setSubId] = useState<any>({});

    const subIdRef = useRef();
    const expandedKeysRef = useRef<string[]>();


    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });

    const onExpand = (expandedKeys, data2) => {
        // debugger;
        const { expanded, node } = data2
        //console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        if (expanded) {
            console.log("onExpand")
            onLoadData(node);
        }

        SetExpandedKeysList(expandedKeys);

        setAutoExpandParent(false);

    };

    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option>)
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { showSubQuery,OnTreeNodeClick, showNodeAction, OnTreeNodeAddNewClsClick, OnSubKgIdChange, OnTreeNodeDeleteClsClick, OnTreeNodeModifyClsClick, OnTreeNodeModifyRelationClick, OnTreeMergeClick } = props;

    //递归更新child
    const updateTreeData = (list: DataNode[], key: React.Key, newchildren: DataNode[]) => {
        return list.map(node => {
            if (node.key === key) {
                return {
                    ...node,
                    children: newchildren,
                    isLeaf: newchildren.length > 0 ? false : true,
                };
            }
            else if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, newchildren)
                }
            }

            return node;

        });
    };

    const HanderTreeNodeonRightClick = async e => {

        let cnode = curSelectNd;
        if (isnull(curSelectNd) || curSelectNd.id !== e.node.key) {
            setcurSelectKey([e.node.key])

            let clsData = await get(e.node.key);

            if (clsData && clsData.success && clsData.data) {
                SetCurSelectNd(clsData.data);
                cnode = clsData.data;
            }
        }



        const x = e.event.pageX;
        const y = e.event.pageY;

        setshowMenu(true);
        setrightClickNodeTreeItem({
            pageX: x,
            pageY: y,
            id: e.node.key,
            categoryName: e.node.title,
            clsData: cnode
        });


    };

    const hideRight = () => {
        setshowMenu(false);
    }
    const getNodeTreeRightClickMenu = () => {
        const { pageX, pageY, id, clsData } = rightClickNodeTreeItem;




        let menudisplay = showMenu ? 'block' : 'none';

        if (!clsData)
            menudisplay = "none";
        if (!showNodeAction)
            menudisplay = "none";

        if (!pageX)
            menudisplay = "none";

        const tmpStyle = {
            position: 'absolute',
            left: `${(pageX || 275) - 275}px`,
            top: `${(pageY || 110) - 110}px`,
            display: menudisplay,
            background: 'white',
            color: 'black',
            width: '150px',
            textAlign: 'left',
            padding: '5px',
            "zIndex": '20',

            border: '1px solid #D7D7D7'
        };
        const menu = (
            <div className="treemenu" style={tmpStyle} onMouseLeave={hideRight}>
                <>

                    {/* <a href="#" title="" onClick={
                        () => {
                           message.info("test");
                        }
                    }>
                        <IconFontNew type="icon-refresh" title="test" /> test
                    </a>
                    <Divider type="horizontal" /> */}
                    <a href="javascript:void(0)" title="" onClick={
                        () => {
                            //刷新当前节点数据
                            // debugger;
                            //  loadNodeData(clsData.id);
                            setTimeout(() => {
                                loadNodeData(clsData.id);
                            }, 50);
                        }
                    }>
                        <IconFontNew type="icon-refresh" title="刷新节点" /> 刷新节点
                    </a>
                    <Divider type="horizontal" />
                    <a href="javascript:void(0)" title="" onClick={
                        () => {
                            if (OnTreeNodeAddNewClsClick)
                                OnTreeNodeAddNewClsClick(clsData)
                        }
                    }>
                        <IconFontNew type="icon-btn-add" title="新增子语境" />新增子语境
                    </a>
                    <Divider type="horizontal" />

                    <a href="javascript:void(0)" title="" onClick={
                        () => {
                            if (OnTreeNodeModifyClsClick)
                                OnTreeNodeModifyClsClick(clsData)
                        }
                    }>
                        <IconFontNew type="icon-btn-edit" title="编辑语境" />编辑语境
                    </a>
                    {/* <Divider type="horizontal" />

                    <a href="#" title="" onClick={
                        () => {
                            if (OnTreeMergeClick)
                                OnTreeMergeClick(clsData)
                        }
                    }>
                        <IconFontNew type="icon-btn-edit" title="合并语境" />合并语境
                    </a> */}
                    {/* <Divider type="horizontal" />


                    <a href="#" title="" onClick={
                        () => {
                            if (OnTreeNodeModifyRelationClick)
                                OnTreeNodeModifyRelationClick(clsData)
                        }
                    }>
                        <IconFontNew type="icon-btn-relation" title="编辑关系" />编辑关系
                    </a> */}
                    <Divider type="horizontal" />

                    <Popconfirm
                        title='确定删除?'
                        onConfirm={
                            () => {
                                if (OnTreeNodeDeleteClsClick)
                                    OnTreeNodeDeleteClsClick(clsData)
                            }

                        }
                        onCancel={() => { }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="#" title="">
                            <IconFontNew type="icon-btn-delete" title="删除语境" />删除语境
                        </a>
                    </Popconfirm>


                </>
            </div>
        );
        return <>{menu}</>;
    };



    const getItemActionContent = (clsData) => {

        if (showNodeAction)
            return (
                <>
                    <div ><Popover trigger="click" placement="right" content={
                        <>



                            <a href="#" title="" onClick={
                                () => {
                                    //刷新当前节点数据
                                    // debugger;
                                    //  loadNodeData(clsData.id);
                                    setTimeout(() => {
                                        loadNodeData(clsData.id);
                                    }, 50);
                                }
                            }>
                                <IconFontNew type="icon-refresh" title="刷新节点" />
                            </a>
                            <Divider type="vertical" />
                            <a href="#" title="" onClick={
                                () => {
                                    if (OnTreeNodeAddNewClsClick)
                                        OnTreeNodeAddNewClsClick(clsData)
                                }
                            }>
                                <IconFontNew type="icon-btn-add" title="新增子语境" />
                            </a>
                            <Divider type="vertical" />

                            <a href="#" title="" onClick={
                                () => {
                                    if (OnTreeNodeModifyClsClick)
                                        OnTreeNodeModifyClsClick(clsData)
                                }
                            }>
                                <IconFontNew type="icon-btn-edit" title="编辑语境" />
                            </a>
                            <Divider type="vertical" />


                            <a href="#" title="" onClick={
                                () => {
                                    if (OnTreeNodeModifyRelationClick)
                                        OnTreeNodeModifyRelationClick(clsData)
                                }
                            }>
                                <IconFontNew type="icon-btn-relation" title="编辑关系" />
                            </a>
                            <Divider type="vertical" />

                            <Popconfirm
                                title='确定删除?'
                                onConfirm={
                                    () => {
                                        if (OnTreeNodeDeleteClsClick)
                                            OnTreeNodeDeleteClsClick(clsData)
                                    }

                                }
                                onCancel={() => { }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <a href="#" title="">
                                    <IconFontNew type="icon-btn-delete" title="删除语境" />
                                </a>
                            </Popconfirm>
                            <Divider type="vertical" />

                        </>
                    }> {clsData.dirName} </Popover></div>
                </>
            )


        return <><span > {clsData.dirName} </span></>
    }

    const loadNodeData = async (key: string) => {

        // console.log("loadNodeData key:" + key);
        //if (selectVal)
        // txt = selectVal.text;
        fetch(key, data => {

            let child: DataNode[] = [];




            //  debugger;
            if (data && data.data) {


                // title: <span ><Popover placement="right" content={getItemActionContent(item)}> {item.dirName} </Popover></span>,
                data.data.map(item => {
                    child.push({
                        title: item.dirName,// getItemActionContent(item),
                        //title: getItemActionContent(item),
                        key: item.id,
                        isLeaf: ((!isnull(item.nodenum) && parseInt(item.nodenum) > 0) ? false : true),
                        icon: (!isnull(item.nodenum) && parseInt(item.nodenum) > 0) ? "" : <FileOutlined />
                    });


                });

            }
            if (key === '0') {

                setTreeData(child);
                if (child && child.length > 0) {
                    SetExpandedKeysList([child[0].key]);

                }
                else {
                    //  SetExpandedKeysList([]);  
                }
                //加载第二级
                setTimeout(() => {
                    // debugger;
                    if (child && child.length > 0)
                        loadNodeData(child[0].key);
                }, 50);



            }
            else {
                let newdata = updateTreeData(treeDataRef.current, key, child);
                setTreeData(newdata);

                let neweKeys = expandedKeysRef.current.concat(key);
                neweKeys = _.uniq(neweKeys);
                // debugger;
                setTimeout(() => {
                    SetExpandedKeysList(neweKeys);
                }, 50);

            }


        })
    }



    useImperativeHandle(ref, () => {
        return {
            setSubKgData:(id,name)=>{
                subKgChanged({
                    label:name,
                    key:id,
                    value:id,
                    text:name,
                })
            },
            reloadTree: (key) => {
                console.log("out reload:" + key);
                // rootnode[0].children = [];
                // setTreeData(rootnode);
                // setAutoExpandParent(false);
                // SetExpandedKeysList([]);
                setTimeout(() => {
                    //   console.log("reloadTree")
                    loadNodeData("0");
                }, 200);

            }
            ,
            refreshNode: (key) => {
                setTimeout(() => {
                    // console.log("refreshNode")
                    loadNodeData(key);
                }, 200);
            }
        }
    }
    );

    useEffect(() => {
        expandedKeysRef.current = expandedKeysList;
    }, [expandedKeysList]);


    useEffect(() => {
        subIdRef.current = subId;
    }, [subId]);

    useEffect(() => {

        treeDataRef.current = treeData;
    }, [treeData]);

    useEffect(() => {
        //  console.log("loading")
        SetExpandedKeysList([]);
        loadNodeData("0");

    }, []);

    // useEffect(() => {
    //    // setshowMenu(true);
    //      setTimeout(() => {
    //          loadNodeData("0");    
    //      }, 20);

    // }, [subId]);



    const handerSelect = async (node) => {


        let clsData = null;

        //查询语境/领域信息
        if (!isnull(node)) {
            clsData = await get(node);

            if (clsData && clsData.success && clsData.data) {
                SetCurSelectNd(clsData.data);
            }
        }
        //console.log(node);
        // let skeys=[node];
        setcurSelectKey(node);

        //  debugger;
        if (OnTreeNodeClick)
            OnTreeNodeClick(node, subIdRef.current ? subIdRef.current.key : "", subIdRef.current ? subIdRef.current.label : "", clsData ? clsData.data : {});
    }


    const fetch = (iputval, callback) => {
        SetFetching(true);
        let querydata = { subKgId: subIdRef.current ? subIdRef.current.key : "" };
        if (iputval)
            querydata.id = iputval.trim();//parentId
        getTree(querydata).then((rst) => {
            //console.log(rst)
            callback(rst);
            SetFetching(false);
        });
    }

    // const handleSearch = (value) => {
    //     if (value) {
    //         fetch(value, data => {
    //             const val: Itemdata[] = [];
    //             if (data && data.data)
    //                 data.data.forEach((item, index) => {
    //                     val.push({ text: item.name, value: item.id });
    //                 })
    //             setData(val)
    //         });
    //     } else {
    //         setData([]);
    //     }
    // }


    const initTreeDate: DataNode[] = [
        {
            title: '-', key: '0', children: [{
                title: 'Expand to load', key: '11'
            }]
        },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true },
    ];

    const onLoadData = (node: DataNode) => {
        //  console.log("onLoadData");
        const { key, children } = node;
        //console.log("onLoadData");
        //  console.log(node);
        // debugger;
        if (children) {
            // console.log("has children ,no action")
            return new Promise(resolve => {

                resolve();
                return;
            });
        }


        return loadNodeData(key);
    }

    const subKgChanged=(v)=>{
      
            setSubId(v)
            if (OnSubKgIdChange)
                OnSubKgIdChange(v ? v.key : "", v ? v.label : "");

            //清空选中
            handerSelect([]);

            setTimeout(() => {
                SetExpandedKeysList([]);
                loadNodeData("0");



            }, 50);


    }

    return (
        <KScroll autohide>
        <div >
            {/*  */}
           
           {showSubQuery&& (
            <div className="treeQuery">
                <span className="title">领域:</span>
                <SubGraSelect className="width100" labelInValue={true} value={subId} onChange={subKgChanged

                } config={{ allowClear: true }} />

            </div>
            )}
            <Tree
                selectedKeys={curSelectKey}
                onRightClick={HanderTreeNodeonRightClick} showLine={true} onSelect={handerSelect}
                onExpand={onExpand}

                //  defaultExpandParent={true}
                //  autoExpandParent={autoExpandParent} 
                expandedKeys={expandedKeysList}
                loadData={onLoadData} treeData={treeData} />

            {getNodeTreeRightClickMenu()}

        </div>
        </KScroll>
    );
};

export default forwardRef(DirTree);
