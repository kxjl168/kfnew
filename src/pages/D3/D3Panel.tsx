


import React, { useState, useRef, cloneElement, useEffect, useContext } from 'react';


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
import NodeDetail from './components/NodeDetail';
import { UrlContext } from '../KgQuery/KgSearch';
import D3Setting from './components/D3Setting';

export interface G6PanelProps {
    qdata?: any;
}


const D3Panel: React.FC<G6PanelProps> = (props) => {
    const dvref = useRef();

    const [loaded, setloaded] = useState<boolean>(false);
    const [graph, setGraph] = useState<any>();

    const [curmod, setcurmod] = useState<any>();

    //kquery中定义得context 跳转
    const[url,toKeyword]=useContext(UrlContext);

    
    const[clickAutoExpand,setclickAutoExpand]=useState<boolean>(true);
    const[clickAutoLock,setclickAutoLock]=useState<boolean>(true);
    const[clickAutoAttrPanel,setclickAutoAttrPanel]=useState<boolean>(true);


    
    const curmodRef=useRef();
    useEffect(()=>{
       // console.log("changed:"+clickAutoLock)
       curmodRef.current=curmod;
    },[curmod])

    const clickAutoAttrPanelRef=useRef();
    useEffect(()=>{
       // console.log("changed:"+clickAutoLock)
        clickAutoAttrPanelRef.current=clickAutoAttrPanel;
    },[clickAutoAttrPanel])


    const clickAutoExpandRef=useRef();
    useEffect(()=>{
      //  console.log("changed:"+clickAutoLock)
        clickAutoExpandRef.current=clickAutoExpand;
    },[clickAutoExpand])



    const clickAutoLockRef=useRef();
    useEffect(()=>{
      //  console.log("changed:"+clickAutoLock)
        clickAutoLockRef.current=clickAutoLock;
    },[clickAutoLock])




    const [simulation, setsimulation] = useState<any>();

    const simulationRef = useRef();

    useEffect(() => {
        simulationRef.current = simulation;
    }, [simulation]);


    //数据，nodes,lines
    const [graphdata, setgraphdata] = useState<any>();

    const graphdataRef = useRef();
    useEffect(() => {
        graphdataRef.current = graphdata;
    }, [graphdata])


    const d3noderef = useRef<D3NodeAction>();

    const d3lineref = useRef<D3Action>();


    const [basecontainer, setbasecontainer] = useState<any>();

    const basecontainerRef = useRef();


    const [svgcontainer, setsvgcontainer] = useState<any>();

    const svgcontainerRef = useRef();
    useEffect(() => {
        svgcontainerRef.current = svgcontainer;
    }, [svgcontainer])

    useEffect(() => {
        basecontainerRef.current = basecontainer;
    }, [basecontainer])

    const clickStop = true;

    const { qdata } = props;


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

    const dataori = {
        // 点集
        nodes: [{
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100,      // Number，可选，节点位置的 x 值
            y: 200.1231231231       // Number，可选，节点位置的 y 值
            , type: 'custom-node-circle'
        }, {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300.21342341123,      // Number，可选，节点位置的 x 值
            y: 500.123123123123       // Number，可选，节点位置的 y 值
            , type: 'custom-node-circle'
            , label: "sdsfd12132"

        },
        {
            id: 'node3', // String，该节点存在则必须，节点的唯一标识
            x: 42.1213,      // Number，可选，节点位置的 x 值
            y: 200.123123123123       // Number，可选，节点位置的 y 值
            , type: 'custom-node-circle'
        },
        {
            id: 'node4', // String，该节点存在则必须，节点的唯一标识
            x: 400.123123123123,      // Number，可选，节点位置的 x 值
            y: 300.2111223123       // Number，可选，节点位置的 y 值
            , type: 'custom-node-circle'
        }],
        // 边集
        edges: [{
            source: 'node1', // String，必须，起始点 id
            target: 'node2'  // String，必须，目标点 id
            , type: '',
            label: "关系111",
            labelCfg: {
                autoRotate: 'true'
            }
        },
        {
            source: 'node2', // String，必须，起始点 id
            target: 'node3'  // String，必须，目标点 id
            , type: '',
            label: "关系11122123",
            labelCfg: {
                autoRotate: 'true'
            }
        }
            ,
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node4'  // String，必须，目标点 id
            , type: '',
            label: "44444",
            labelCfg: {
                autoRotate: 'true'
            }



        }]
    };


    const loadAllTagColor = (gdata) => {
        if (!isnull(gdata) && !isnull(gdata.nodes) && (gdata.nodes instanceof Array)) {
            let tgs: any = [];
            gdata.nodes.map(item => {

                if (item.tags) {
                    if (item.tags instanceof Array)
                        item.tags.map(tag => {

                            const tgintags = _.find(tgs, (itemt) => {

                                return itemt.name === tag.label;
                            })
                            if (isnull(tgintags)) {

                                const tcolor = getTagColor(tgs, tag.label);

                                const ntags = _.concat(tgs, {
                                    name: tag.label,
                                    num: 1,
                                    color: tcolor,
                                })
                                tgs = ntags;
                            }
                            else {
                                tgintags.num++;
                                const ntags = _.merge(tgs, tgintags);
                                tgs = ntags;
                            }

                        })
                }

            })

            return tgs;
        }
        return [];
    }

    const refreshNodeColor = (gdata, tgs) => {
        const cdata = _.cloneDeep(gdata);
        const nodeitems = cdata.nodes;
        // console.log(new Date());
        let newnodes = nodeitems.map(model => {
            let newmodel = UpdateNodeTagColor(model, tgs);
            const color = getNodeColor(model, tgs);
            newmodel.color = color;

            return newmodel;
            // propsAPI.update(fitem, fitem.model);

            //  console.log(new Date());

        })
        return newnodes;


    }
    const refreshNodeColor2 = (gdata, tgs) => {

        const nodeitems = gdata.nodes;
        // console.log(new Date());
        _.each(nodeitems, model => {
            model = UpdateNodeTagColor2(model, tgs);
            const color = getNodeColor(model, tgs);
            model.color = color;

        });


    }

    const clamp = (x, lo, hi) => {
        return x < lo ? lo : x > hi ? hi : x;
    }

    //1 3 9 27 51 153 
    const drag2 = (csimulation) => {

        function dragstarted(event, d) {

          
            

            if (!event.active) csimulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;

            if(clickAutoLockRef.current)
            {
             d.fixed=true;
            }


            //basecontainerRef.current.select("#id" + d.id).classed("fixed", true)

        }

        function dragged(event, d) {

            // d3.select("#"+d.id)
            //  .attr("x", event.x)
            // .attr("y", event.y)

            // d.fx = clamp(event.x, 0, width);
            // d.fy = clamp(event.y, 0, height);

            d.fx = event.x;
            d.fy = event.y;



            // const gnode=basecontainerRef.current.selectAll("g.node").filter((a,b,c)=>{
            //    return a.id===d.id;
            // });
            // //console.log(gnode);
            // if(gnode)
            // gnode.attr('transform', 'translate(' + (event.x) + ',' + ( + event.y) + ')'); 


        }

        function dragended(event, d) {
            if (!event.active) csimulation.alphaTarget(0);

         

            console.log("clickAutoLock:"+clickAutoLockRef.current)
            if(!d.locked && !clickAutoLockRef.current) {
                //还原锁定，自由移动
                
                d.fx = null;
                d.fy = null;

                d.fixed=false;
                if (gnode)
                {
                   // d.fixed=false;
                  
                }
                    
            }

            const gnode = basecontainerRef.current.selectAll("g.node").filter((a, b, c) => {
                return a.id === "id" + d.id;
            });
            //console.log(gnode);


        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }




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

            if(item.nodeid===id)
            {
            item.fixed=true;
            item.selected=true;
        }


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





        const fontsize = 14;

        // debugger;
        const nodes = graphdataRef.current.nodes;
        const links = graphdataRef.current.edges;

        // debugger;
        const simulation = d3.forceSimulation(nodes)


            .force('link', d3.forceLink(links).id(d => d.id).distance(200))

            .force('collision', d3.forceCollide(5).strength(0.8))

            // .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))

            .force('charge', d3.forceManyBody().strength(-3000).distanceMax(800))


            .force("x", d3.forceX(widthRef.current / 2))
            // .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))

            .force("y", d3.forceY(heightRef.current / 2));


        setTimeout(() => {
            //先让加载的节点飘到中间
            //1.5s后，取消剧中定位，
            //  simulation.force('center', null);
            simulation.force('x', null);
            simulation.force('y', null);
        }, 1000);



        setsimulation(simulation);

        //   setTimeout(() => {
        //  simulation.force('center',null);
        //   }, 1000);



        const svg = d3.select('#theChart').append('svg') // 在id为‘theChart'的标签内创建svg

            .style('width', widthRef.current)
            // .attr("viewBox","0 -264 200 728")

            .style('height', heightRef.current * 0.98)

        setbasecontainer(svg);




        // const svg=basesvg.append("g").attr("class",'mcontainer');


        const rect = svg
            .append('rect')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            // Make the rect cover the whole surface
            .attr('x', '-2500')
            .attr('y', '-2500')
            .attr('width', '5000')
            .attr('height', '5000')
            .attr('transform', 'scale(1)')
            .on('click', (e, d) => {
                graphdataRef.current.nodes.forEach(nd => {
                    nd.selected = false;
                });

                setcurmod({});
            })



        const g = svg.append("g").attr('class', "pall").attr("transform", 'translate(0 ,0)');

        // const defs = g.append("defs");
        // const arrowMarker = defs.append("marker")
        //     .attr("id", "arrow")
        //     .attr("markerUnits", "strokeWidth")
        //     .attr("markerWidth", 12)
        //     .attr("markerHeight", 12)
        //     .attr("viewBox", "0 0 12 12")
        //     .attr("refX", 6)
        //     .attr("refY", 0)
        //     .attr("orient", "auto");



        // arrowMarker.append("path")
        //    .attr('d', (d) => {return "M2,-4 L10,0 L2,4 L6,0 L2,-4" }) // 箭头path
        //     .attr("style", "fill: red;");


        const lineg = g.append("g").attr('class', 'layer lines').attr("transform", 'translate(0 ,0)');

        const nodeg = g.append("g").attr('class', 'layer nodes ').attr("transform", 'translate(0 ,0)');

        // lineg
        // .append('rect')
        // .style('fill', 'none')
        // .style('pointer-events', 'all')
        // // Make the rect cover the whole surface
        // .attr('x', '-2500')
        // .attr('y', '-2500')
        // .attr('width', '5000')
        // .attr('height', '5000')
        // .attr('transform', 'scale(1)')
        // nodeg
        // .append('rect')
        // .style('fill', 'none')
        // .style('pointer-events', 'all')
        // // Make the rect cover the whole surface
        // .attr('x', '-2500')
        // .attr('y', '-2500')
        // .attr('width', '5000')
        // .attr('height', '5000')
        // .attr('transform', 'scale(1)')


        d3lineref.current?.paint(lineg, links, drag2(simulation));

        d3noderef.current?.paint(nodeg, nodes, drag2(simulation), NodeEvent);





        // const svg = d3.create("svg")
        //    .attr("viewBox", [-width / 2, -height / 2, width, height]);


        // .attr("stroke", "#999")
        // .attr("stroke-opacity", 0.6)
        // .style('stroke', '#000') // 颜色

        // .style('stroke-width', 1); // 粗细





        // const nodesTexts = g

        //     .selectAll('text')

        //     .data(nodes)

        //     .enter()

        //     .append('text')

        //     .attr('dy', '30') // 偏移量
        //     .attr("tsx", 0)
        //     .attr("tsy", 0)
        //     .attr("tsk", 1)
        //     .attr('class', 'node-text') // 节点名称放在圆圈中间位置
        //     .attr('text-anchor', 'middle') // 节点名称放在圆圈中间位置

        //     .style('pointer-events', 'none') // 禁止鼠标事件

        //     .text((d) => { // 文字内容

        //         return d && d.label; // 遍历nodes每一项，获取对应的name

        //     });










        simulation.on("tick", () => {


            repaint();
        });



        // invalidation.then(() => simulation.stop());

        function repaint() {

            if (d3noderef.current)
                d3noderef.current.tick();

            if (d3lineref.current)
                d3lineref.current.tick();
            // node
            //     .attr("cx", d => d.x)
            //     .attr("cy", d => d.y);


            // 更新节点文字坐标

            // const transform = { x: _.toNumber(link.attr("tsx")), y: _.toNumber(link.attr("tsy")), scale: _.toNumber(link.attr("tsk")) || 1 };


            // nodesTexts.attr('dy', (d) => {
            //     return _.toNumber(node.attr('r')) * transform.scale + 10
            // }) // 偏移量
            // .attr('transform', (d) => {
            //     return 'translate(' + (d.x * transform.scale + transform.x) + ',' + (d.y * transform.scale + transform.y) + ') scale(' + transform.scale + ') ';

            // });




        }


        svg.call(zoom);



    }

    let zoom = d3.zoom()
        .extent([[0, 0], [widthRef.current, heightRef.current]])
        .scaleExtent([0.3, 3])
        .on("zoom", zoomed)

    function zoomed({ transform }) {
        // link.attr("transform", transform);

        // link.attr("tsx", transform.x);
        // link.attr("tsy", transform.y);
        // link.attr("tsk", transform.k);
        // if(d3noderef.current)
        // d3noderef.current.zoom(transform);
        //nodeg.attr("",)

        const g = basecontainerRef.current.select("g.pall");

        g.attr('transform', transform);


        // node.attr("transform", transform);

        // link.attr("tsx", transform.x);
        // link.attr("tsy", transform.y);
        // link.attr("tsk", transform.k);

        //  repaint();
    }


    //加载指定节点周边数据
    const loadMoreData = async (model, nodelevel,callback) => {



        const ndid = model.nodeid;

        let hide = message.loading("加载中...", 200);

        let data = await query({ id: ndid, level: nodelevel, showEdit: false });

        hide();
        let gdata = {};

        try {


            let gradata = JSON.parse(JSON.stringify(data));
            gdata = JSON.parse(gradata.data);
        } catch (error) {
            message.error("数据加载失败!");
        }
        if (isnull(gdata))
            return;
        // console.log(JSON.stringify(gdata));
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

        gdata.edges.map(item => {


            item = merge(item, {

                shape: 'CustomLine2',

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



        // debugger;

        let exsitData = _.cloneDeep(graphdataRef.current);

        exsitData.nodes = _.unionBy(_.concat(exsitData.nodes, gdata.nodes), (nd) => {
            return nd.nodeid;
        });

        let changedNode = {};//id有变化的节点，后续需要同步更新连线



        if (!exsitData.edges) {
            exsitData.edges = gdata.edges;
        }

        exsitData.edges = _.unionBy(_.concat(exsitData.edges, gdata.edges), (edge) => {
            return edge.id;
        });


        //setgraphdata(exsitData);
        const tgs = loadAllTagColor(graphdata);//已有颜色

        //    _.each(exsitData.nodes,model=>{
        //     const color = getNodeColor(model, tgs);
        //     model.color = color;
        //    })

        //不能复制修改节点，只能更新
        refreshNodeColor2(exsitData, tgs);

        _.each(exsitData.nodes,item=>{
     
            if( item.nodeid===model.nodeid)
            item.detail=true;
        })

        updateGraphicData(exsitData);

        setTimeout(() => {
            if(callback)
            callback();
        }, 50);

    }

    //刷新节点，连线数据
    const updateGraphicData = (exsitData: any) => {


        setgraphdata(exsitData);

        const lineg = basecontainerRef.current.selectAll('g.layer.lines');

        const nodeg = basecontainerRef.current.selectAll('g.layer.nodes');



        d3lineref.current?.paint(lineg, exsitData.edges, drag2(simulation));

        d3noderef.current?.paint(nodeg, exsitData.nodes, drag2(simulationRef.current), NodeEvent);

        // setTimeout(() => {
        //debugger;
        simulationRef.current.nodes(exsitData.nodes);
        simulationRef.current.force("link").links(exsitData.edges);
        simulationRef.current.alpha(1).restart();


        // _.each(exsitData.nodes,node=>{
        //     basecontainerRef.current.select("#id" + node.nodeid).data()[0].hide=false;
        // })
        // _.each(exsitData.edges,line=>{
        //     basecontainerRef.current.select("#id" + line.id).data()[0].hide=false;
        // })
      

    }


    const onnodeclick = (event, model) => {

         
         graphdataRef.current.nodes.forEach(nd => {

            nd.selected = false;

                //隐藏其他所有节点上不相关的


         });



         model.selected = true;





         if(clickAutoExpandRef.current)
        loadMoreData(model, 1,()=>{
            graphdataRef.current.nodes.forEach(nd => {
                //
                               if(nd.nodeid!==model.nodeid)
                                   hidenodeOutData(nd);
                            });
        });

      
    }

    const onnodehover = (event, model) => {
        graphdataRef.current.nodes.forEach(nd => {
            nd.hover = false;
        });

        // debugger;
        //console.log(model);
        model.hover = true;

        if (d3noderef.current)
            d3noderef.current.tick();

        if (d3lineref.current)
            d3lineref.current.tick();
    }


    const onnodehoverOut = (event, model) => {


        // debugger;
        //console.log(model);
        model.hover = false;


        if (d3noderef.current)
            d3noderef.current.tick();

        if (d3lineref.current)
            d3lineref.current.tick();

    }


    //简称当前节点是否只连接了目标节点 ,并且部位固定节点
    const checkOnlyLinkToNode = (curnodeid, targetnodeid) => {


        const edgeitems = graphdataRef.current.edges;

        let relatTargeNodeIds = "";

        let rstTargeNodeIds = "";

        const lines = [];

        let allnodeids = "";


        edgeitems.map(edge => {

            if (edge.source.nodeid === curnodeid && edge.target.nodeid !== curnodeid && edge.target.nodeid !== targetnodeid) {
                allnodeids += edge.target.nodeid + ",";
            }

            if (edge.target.nodeid === curnodeid && edge.source.nodeid!== curnodeid && edge.source.nodeid !== targetnodeid) {
                allnodeids += edge.source.nodeid + ",";
            }
        });


        if (allnodeids !== '')
            return false;

        
            

        return true;

    }

    //获取当前移动的节点为起点，未关联其他节点的一层内节点及连线，
    const getRelateNodeDatas= (node) => {

        const nodeitems = graphdataRef.current.nodes;
        const edgeitems = graphdataRef.current.edges;

        let relatTargeNodeIds = "";

        let rstTargeNodeIds = "";

        const lines = [];
        const nodes=[];

        edgeitems.map(edge => {

            if (edge.source.nodeid=== node.nodeid) {
                if (checkOnlyLinkToNode(edge.target.nodeid,node.nodeid )&&!edge.target.fixed) {
                    relatTargeNodeIds += edge.target.nodeid + ",";
                    lines.push(edge);
                }
            }

            if (edge.target.nodeid === node.nodeid) {
                if (checkOnlyLinkToNode( edge.source.nodeid,node.nodeid)&&!edge.source.fixed) {
                relatTargeNodeIds += edge.source.nodeid + ",";
                lines.push(edge);
                }
            }

        })

        _.each(nodeitems,node=>{
            //非固定的节点
            if(relatTargeNodeIds.indexOf(node.nodeid)>-1&&!node.fixed)
                  nodes.push(node)
        })


        return {nodes:nodes,edges:lines};


    }



    const NodeEvent = {
        "click": (event, model) => {
          
          //  debugger;

            setTimeout(() => {
                if(clickAutoAttrPanelRef.current)
                setcurmod(model);         
            }, 30);

            onnodeclick(event, model);
  
       // debugger;
       
   
        },
        'mouseover': (event, model) => {
            onnodehover(event, model);
        }
        ,
        'mouseout': (e, model) => {
            onnodehoverOut(e, model);
        },
        //节点展开面板动作
        'ringactionpanels': (event, model) => {

            if (model.id === "unlock") {

                if(model.value>0)
                {
                    // graphdataRef.current.nodes.forEach(nd => {
                    //     nd.selected = false;
                      
                    // });
                    model.data.locked=true;
                    model.data.selected = true;
                    model.data.fixed=true;
                    model.data.fx = model.data.x;
                    model.data.fy = model.data.y;
                 
            }
            else{
                model.data.locked=false;
                model.data.fx=null;
                model.data.fy=null;
                model.data.selected=false;
                model.data.hover=false;

              
                model.data.fixed=false;
            }
             //d3.select("#id"+model.data.id+"").classed("fixed", false)

            }

            if(model.id==="search")
            {
                //跳转详情检索
                toKeyword('normal',model.data.label);

            }

            //详情
            if(model.id==="detail")
            {
               //debugger; 
                if(!isnull(curmodRef.current))
                //关闭
               // debugger;
               setcurmod({});
               else
               {
                setTimeout(() => {
                    setcurmod(model.data);         
                }, 30);
               
            }
            }

            //隐藏周边单连线节点
            if (model.id === "hideoutnodes") {

                if(model.value<0)
                {
                    //显示详情
                    //onnodeclick(event, model.data);
                    loadMoreData(model.data, 1);
                }
                else  if(model.value>0)
{
    hidenodeOutData(model.data)

            }


            }
        }

    };

    //隐藏周边不相关节点
    const hidenodeOutData=(model)=>{
        let exsitData = graphdataRef.current;
                const curnode = model;


                const levelOneNodes= getRelateNodeDatas(curnode);

               // debugger;
                _.map(exsitData.nodes,node=>{

                    const exits= _.find(levelOneNodes.nodes,lnode=>{
                        return lnode.nodeid===node.nodeid
                    })
                    if(exits)
                    {
                        //node.hide=true;
                       // basecontainerRef.current.select("#id" + node.nodeid).data()[0].hide=true;

                        //关联线也隐藏
                        _.each(exsitData.edges,line=>{

                           if(line.source.nodeid===node.nodeid||line.target.nodeid===node.nodeid)
                           {
                           //、 line.hide=true;
                           // basecontainerRef.current.select("#id" + line.id).data()[0].hide=true;
                           }
                                
        
                        })
                    }

                })

               // debugger;
                _.remove(exsitData.nodes,node=>{
                    const exits= _.find(levelOneNodes.nodes,lnode=>{
                        return lnode.nodeid===node.nodeid
                    })
                    if(exits)
                    {
                        return true;
                    }
                    return false;
                })
                _.remove(exsitData.edges,line=>{
                    const exits= _.find(levelOneNodes.edges,lnode=>{
                        return lnode.id===line.id
                    })
                    if(exits)
                    {
                        return true;
                    }
                    return false;
                })

                _.each(exsitData.nodes,item=>{

                    if( item.nodeid===curnode.nodeid)
                    item.detail=false;
                })
             

        //debugger;
                updateGraphicData(exsitData);
    }







    const getContent = () => {


        setTimeout(() => {
            loadData(graph);
        }, 200);




    }

    useEffect(() => {


        var el = dvref.current;// document.querySelector('.editorContent2');
        riseze(el, (val, oldVal) => {
            // console.log(`size changed！new: ${JSON.stringify(val)}, old: ${JSON.stringify(oldVal)}`);

            // const { graphicModel } = props;

            //debugger;
            setHeight(val.height);
            setWidth(val.width);

            //  cacluePanelSize(dvref.current, val);
        });
        // debugger;
        const fm = d3.select('iframe')["_groups"][0][0];
        setHeight(fm.offsetHeight);
        setWidth(fm.offsetWidth);

        zoom = d3.zoom()
            .extent([[0, 0], [widthRef.current, heightRef.current]])
            .scaleExtent([0.3, 3])
            .on("zoom", zoomed)

        getContent();

    }, [])





    const cacluePanelSize = (editorContent2, val) => {
        // debugger;
        const width = 20;
        editorContent2.querySelector("canvas").width = val.width - width;
        editorContent2.querySelector("canvas").style.width = (val.width - width) + "px";

        editorContent2.querySelector("canvas").height = val.height - 10;
        editorContent2.querySelector("canvas").style.height = (val.height - 10) + "px";


    }

    const load = () => {
        //  message.info("2")


    }

    //当前视图查询定位
    const searchInCur = async (q: any) => {
        const stxt = q.name;
        let lastrst = [];
        if (graphdataRef.current) {
            const nodes = graphdataRef.current.nodes;
            // debugger;
            const rst = _.filter(nodes, node => {
                return node.label.indexOf(stxt) > -1;
            })

            lastrst = _.map(rst, item => {
                return {
                    name: item.label,
                    id: item.id
                }
            })
        }

        //debugger;
        //  console.log(lastrst);
        return { data: lastrst };


    }

    const tocenter = (cid) => {

        const x = basecontainerRef.current.select("#id" + cid).data()[0].x;
        const y = basecontainerRef.current.select("#id" + cid).data()[0].y;




        basecontainerRef.current.transition().duration(2500).call(
            zoom.transform,
            d3.zoomIdentity.translate(widthRef.current / 2, heightRef.current / 2).scale(1.1).translate(-x, -y)
            //d3.zoomIdentity.scale(1).translate(-x+WIDTH/2,-y+HEIGHT/2)
        );




    }

    const GSearchSelectDone = (val) => {

        //  console.log(val);
        tocenter(val.key);

    }


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

        {/* <div style={{ float: 'left', position: "absolute" }}>
            <div>label:{curmod ? curmod.label : '-'}</div>
            <div>mdoelx:{curmod ? curmod.x : '-'}</div>
            <div>mdoelxy:{curmod ? curmod.y : '-'}</div>
            <div>x:{devent ? devent.x : '-'}</div>
            <div>y:{devent ? devent.y : '-'}</div>
        </div> */}
        <div>



            {/* <svg>
<g>
               
             <defs>  
<marker id="arrow2"   
        markerUnits="strokeWidth"   
        markerWidth="12"   
        markerHeight="12"   
        viewBox="0 0 12 12"   
        refX="6"   
        refY="6"   
        orient="auto">  
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style={{fill: 'green'}} />  
</marker>  
</defs>   


<line x1="0" y1="0" x2="200" y2="50"  stroke="red" strokeWidth="2" markerEnd={`url(#arrow2)`}/>  
<path d="M 20,70 T80,100 T160,80 T200,90" fill="white" stroke="red" stroke-width="2" marker-start="url(#arrow2)" marker-mid="url(#arrow2)" marker-end="url(#arrow2)"/>  

</g>

</svg> */}
            {/* <svg  width="300" height="400">
    <defs>
        <g id="ShapeGroup">
            <rect x="50" y="50" width="100" height="100" fill="#69C" stroke="red" stroke-width="2"/>
            <circle cx="100" cy="100" r="40" stroke="#00f" fill="none" stroke-width="5"/>
        </g>
    </defs>
    <use transform="translate(-10,0) scale(0.5)"/>
</svg> */}

        </div>
        {/* <div style={{position:"fixed",bottom:'10px',width:'100%'}}>
    <div style={{position:'relative',width:'300px',margin:'0 auto'}}>
    <Card className="searchCard"
                >
                    <span className="searchIcon" title="数据查询" onClick={() => {
                    
                    }}>
                     
                        <IconFontNew type="icon-search"/>
                    </span>
                    <GSearch query={searchInCur} className="width100" labelInValue  placeholder="搜索当前数据" onChange={GSearchSelectDone} />
                    <span className="searchIcon" title="搜索" onClick={() => {

                    }}>
                    
                    </span>
                </Card>
        </div>
        </div> */}



        <div id="theChart"
            style={{ width: '100%', height: '100vh' }} ref={dvref}  >
            <D3Line ref={d3lineref} />
            <D3Node ref={d3noderef} />



        </div>

        <GSearchCop queryHandler={searchInCur} onChange={GSearchSelectDone} />

        <NodeDetail model={curmod} />

        <D3Setting clickAutoAttrPanel={clickAutoAttrPanel} setclickAutoAttrPanel={setclickAutoAttrPanel} 
         clickAutoExpand={clickAutoExpand} setclickAutoExpand={setclickAutoExpand}
          clickAutoLock={clickAutoLock} setclickAutoLock={setclickAutoLock}   />

    </>);
}


export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withRouter(D3Panel));

