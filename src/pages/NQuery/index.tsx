


import React, { useState, useRef, cloneElement, useEffect } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Row, Input, Col, Avatar, Spin, TimePicker } from "antd";
import QueueAnim from 'rc-queue-anim';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { MyEditObj } from '../ModifyList/data';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';

import { isnull } from '@/utils/utils';
import _, { merge } from 'lodash';
import EditMainPanel from '../GraphicO/index';
import './index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/logo.svg';
import EntitySelect from '@/components/MyCom/EntitySelect';
import G6, { Util } from '@antv/g6';

import D3Node, { D3NodeAction } from "./components/D3Node";
import Line from "./components/line";

import Behavior from "./components/behavior";
import { query, saveOrUpdate } from '@/services/grapicService';

import { connect, withRouter } from 'umi';
import { ConnectState } from '@/models/connect';
import DataLogTable from '@/components/MyCom/DataLogTable';
import { getTagColor, UpdateNodeTagColor, getNodeColor, UpdateNodeTagColor2 } from '../GraphicO/components/TagBar';

import * as  d3 from "d3";
import { getCustomerLine2Path } from '../G6/components/line';

import Group from '@antv/g-canvas/lib/group';
import D3Line, { D3Action } from './components/D3Line';
import GSearch from './components/GSearch';
import GSearchCop from './components/GsearchCop';
import NList from './com/NList';
import RList from './com/RList';

export interface NQueryProps {
    qdata?: {
        gtype?:string,
        id?:string,
        level?:string,
        keyword:string

    },
    toUrl:(key)=>void;
  
}


const NQuery: React.FC<NQueryProps> = (props) => {
    const dvref = useRef();


    //数据，nodes,lines
    const [graphdata, setgraphdata] = useState<any>();

    const graphdataRef = useRef();
    useEffect(() => {
        graphdataRef.current = graphdata;
    }, [graphdata])



    const { qdata,toUrl } = props;


    const [HEIGHT, setHeight] = useState<number>(880);


    const [WIDTH, setWidth] = useState<number>(1900);
    const widthRef = useRef();
    const heightRef = useRef();
    useEffect(() => {
        widthRef.current = WIDTH;
    }, [WIDTH])
    useEffect(() => {
        heightRef.current = HEIGHT;
    }, [HEIGHT])




    const loadData = async (tgraph) => {

        if (!qdata) {
            return;
        }

        const gtype = qdata.gtype;
        const id = qdata.id;
        const level = qdata.level;

        if (isnull(id))
            return;

        if (isnull(gtype))
            gtype = 'cls';


        props.dispatch({
            type: 'graphic/setGType',
            payload: {
                graphicType: gtype
            }
        })


        let data = "";
        let gdata = {};

        //debugger;
        const hide = message.loading('数据加载中...', 600);

        data = await query({ id: id, level: level, showEdit: false });

        try {
            let gradata = JSON.parse(JSON.stringify(data));
            gdata = JSON.parse(gradata.data);
        } catch (error) {
            message.error("数据加载失败!");
        }


        hide();


        if (isnull(gdata))
            return;


        // debugger;
        gdata.nodes.map(item => {
            item = merge(item, {

                // type: "node",
                // size: "55*55",
                type: 'custom-node-circle',

                stroke: '#F0CFA4',
                color: "#F0CFA4",
                stroke_left: '#0000ff',

                // x: 100,
                // y: 100,
                labelOffsetY: 20,
                //  icon: "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg"
            });


        })


        gdata.edges.map(item => {


            //debugger;
            item = merge(item, {


                type: 'CustomLine2',
                //  lineType:'Q'

            });


            if (item.attrs) {
                item.attrs = JSON.parse(item.attrs);
                if (item.attrs instanceof Array)
                    item.attrs.map(attr => {

                        // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
                    })


            }
            item.attrOk = true;

        })

        gdata.nodes.map(item => {
            if (item.attrs) {
                item.attrs = JSON.parse(item.attrs);
                if (item.attrs instanceof Array)
                    item.attrs.map(attr => {

                        // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
                    })
            }
            if (item.tags) {
                item.tags = JSON.parse(item.tags);
                if (item.tags instanceof Array)
                    item.tags.map(attr => {

                        // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
                    })
            }
            item.attrOk = true;

        })


        const tgs = loadAllTagColor(gdata);
        gdata.nodes = refreshNodeColor(gdata, tgs);


        setgraphdata(gdata);
        setTimeout(() => {
            load2();
        }, 100);



    }

    const load2 = () => {







    }


    useEffect(() => {


        var el = dvref.current;// document.querySelector('.editorContent2');
        riseze(el, (val, oldVal) => {

            setHeight(val.height);
            setWidth(val.width);

            //  cacluePanelSize(dvref.current, val);
        });
        // debugger;
        // const fm = d3.select('iframe')["_groups"][0][0];
        // setHeight(fm.offsetHeight);
        // setWidth(fm.offsetWidth);


    }, [])



    const riseze = (el, cb: (val: { width: number, height: number }, oldval: { width: number, height: number }) => void) => {
        // 创建iframe标签，设置样式并插入到被监听元素中
        var iframe = document.createElement('iframe');
        iframe.setAttribute('class', 'size-watch');
        el.appendChild(iframe);

        // 记录元素当前宽高
        var oldWidth = el.offsetWidth;
        var oldHeight = el.offsetHeight;

        // iframe 大小变化时的回调函数
        function sizeChange() {
            // 记录元素变化后的宽高
            var width = el.offsetWidth;
            var height = el.offsetHeight;
            // 不一致时触发回调函数 cb，并更新元素当前宽高
            if (width !== oldWidth || height !== oldHeight) {
                cb({ width: width, height: height }, { width: oldWidth, height: oldHeight });
                oldWidth = width;
                oldHeight = height;
            }
        }

        // 设置定时器用于节流
        var timer = 0;
        // 将 sizeChange 函数挂载到 iframe 的resize回调中
        iframe.contentWindow.onresize = function () {
            clearTimeout(timer);
            timer = setTimeout(sizeChange, 20);
        };
    }

    return (<>


        <div ref={dvref}>
        <Row style={{paddingTop:'10px'}}>
            <Col span={2}></Col>
            <Col span={14}>
                <NList qdata={qdata} />

            </Col>
            <Col span={1}>
            </Col>
            <Col span={6}>
                <RList  qdata={qdata} />
            </Col>
            </Row>

        </div>

    </>);
}


export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withRouter(NQuery));

