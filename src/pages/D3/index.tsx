


import React, { useState, useRef, cloneElement, useEffect } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Row, Input, Col, Avatar, Spin } from "antd";
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

import Dianode from "./components/D3Node";
import Line from "./components/line";

import Behavior from "./components/behavior";
import { query, saveOrUpdate } from '@/services/grapicService';

import { connect, withRouter } from 'umi';
import { ConnectState } from '@/models/connect';
import DataLogTable from '@/components/MyCom/DataLogTable';
import { getTagColor, UpdateNodeTagColor, getNodeColor } from '../GraphicO/components/TagBar';

import * as  d3 from "d3";
import { getCustomerLine2Path } from '../G6/components/line';

import Group from '@antv/g-canvas/lib/group';

export interface G6PanelProps {
    qdata?: any;
}


const G6Panel: React.FC<G6PanelProps> = (props) => {
    const dvref = useRef();

    const [loaded, setloaded] = useState<boolean>(false);
    const [graph, setGraph] = useState<any>();

    const [curmod, setcurmod] = useState<any>();

    const [simulation, setsimulation] = useState<any>();


    const [devent, setdevent] = useState<any>();

    const { qdata } = props;

    const simulationRef = useRef();

    useEffect(() => {
        simulationRef.current = simulation;
    }, [simulation]);

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
        const nodeitems = gdata.nodes;
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

    const drag2 = (csimulation) => {

        function dragstarted(event, d) {
            if (!event.active) csimulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) csimulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
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


        load2(gdata);
  

    }

    const load2 = (gdata) => {


        const HEIGHT = 880;


        const WIDTH = 1900;

        const fontsize=14;

        const nodes = gdata.nodes;
        const links = gdata.edges;

        const simulation = d3.forceSimulation(nodes)


            .force('link', d3.forceLink(gdata.edges).id(d => d.id).distance(150))

            .force('collision', d3.forceCollide(5).strength(0.8))

            // .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))

            .force('charge', d3.forceManyBody().strength(-3000).distanceMax(800))

            // .force("link", d3.forceLink(links).id(d => d.id).)
            // .force("charge", d3.forceManyBody())
            //.force("x", d3.forceX(WIDTH / 2))
            .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))

            .force("y", d3.forceY(HEIGHT / 2));



        //   setTimeout(() => {
        //  simulation.force('center',null);
        //   }, 1000);



        const svg = d3.select('#theChart').append('svg') // 在id为‘theChart'的标签内创建svg

            .style('width', WIDTH)

            .style('height', HEIGHT * 0.9)


        const g = svg.append("g");


        const lineg = svg.append("g").attr('class','layer lines');

    const nodeg = svg.append("g").attr('class','layer nodes ');


        const defs = g.append("defs");  
        const arrowMarker = defs.append("marker")  
        .attr("id","arrow")  
        .attr("markerUnits","strokeWidth")  
        .attr("markerWidth",12)  
        .attr("markerHeight",12)  
        .attr("viewBox","0 0 12 12")   
        .attr("refX",6)  
        .attr("refY",6)  
        .attr("orient","auto");  

        const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";  
          
arrowMarker.append("path")  
.attr("d",arrow_path)  
.attr("style","fill: red;");  


        // const svg = d3.create("svg")
        //    .attr("viewBox", [-width / 2, -height / 2, width, height]);

        const link = g
           
        .selectAll("line")
        .data(links)
        // .join("line")
        // .attr('id', (d, i) => { return i && 'edgepath' + i; }) // 设置id，用于连线文字
        //  .attr('marker-end', 'url(#arrow)')
        // .attr("stroke-width", d => Math.sqrt(d.value));
        .enter() // 添加数据到选择集edgepath
        .append('path') // 生成折线
        .attr('class','line')
        .attr('d', (d) => { return d && 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y; }) // 遍历所有数据，d表示当前遍历到的数据，返回绘制的贝塞尔曲线

        .attr('id', (d, i) => { return  'edgepath' + i; }) // 设置id，用于连线文字

        .attr('marker-end', 'url(#arrow)') // 根据箭头标记的id号标记箭头
        // .attr("stroke", "#999")
        // .attr("stroke-opacity", 0.6)
        // .style('stroke', '#000') // 颜色

        // .style('stroke-width', 1); // 粗细


        //自定义中间箭头
        const arrow = g
           
        .selectAll(".arrow")
        .data(links)
        .enter() // 添加数据到选择集edgepath
        .append('path') // 生成折线
        .attr('class','arrow')
      
        .attr('d', (d) => {return "M2,-3 L10,1 L2,5 L6,1 L2,-3" }) // 箭头path

        .attr('id', (d, i) => { return  'arrow' + i; }) // 设置id，用于连线文字

        // .attr("stroke", "#999")
        // .attr("stroke-opacity", 0.6)
        // .style('stroke', '#000') // 颜色

        // .style('stroke-width', 1); // 粗细





        const nodesTexts = g

            .selectAll('text')

            .data(nodes)

            .enter()

            .append('text')

            .attr('dy', '30') // 偏移量
            .attr("tsx", 0)
            .attr("tsy", 0)
            .attr("tsk", 1)
            .attr('class', 'node-text') // 节点名称放在圆圈中间位置
            .attr('text-anchor', 'middle') // 节点名称放在圆圈中间位置

            .style('pointer-events', 'none') // 禁止鼠标事件

            .text((d) => { // 文字内容

                return d && d.label; // 遍历nodes每一项，获取对应的name

            });


            const edgesRect = g.selectAll('.edgerect')

            .data(gdata.edges)

            .enter()

            .append('rect') // 为每一条连线创建文字区域

            .attr('class', 'edgerect')
            .attr('width',200)
            .attr('height',30)
            .attr('rx',5)
            .attr('ry',5)
            .style('fill', '#aaa') // 颜色
            .attr('dx', 80)

            .attr('dy', 0);


        const edgesText = g.selectAll('.edgelabel')

            .data(gdata.edges)

            .enter()

            .append('text') // 为每一条连线创建文字区域
           
            .attr('class', 'edgelabel')
           // .style('stroke', 'black') // 颜色
            .text((d) => { return d && d.label; })
            .attr('dx', 0)
            .attr('dy', 0);

        // edgesText.append('textPath')// 设置文字内容

        //     .attr('xlink:href', (d, i) => { return i && '#edgepath' + i; }) // 文字布置在对应id的连线上

        //     .style('pointer-events', 'none')
        //     .style('fill', 'black') // 颜色
        //     .text((d) => { return d && d.label; });




        const node = g
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", (r) => {
                return r.size || 30
            })
            .attr("fill", d => {
                return d.color || 'red';
            })
            .call(drag2(simulation));


           




        svg.call(d3.zoom()
            .extent([[0, 0], [WIDTH, HEIGHT]])
            .scaleExtent([0.3, 3])
            .on("zoom", zoomed));

        function zoomed({ transform }) {
            link.attr("transform", transform);
            node.attr("transform", transform);

            nodesTexts.attr("tsx", transform.x);
            nodesTexts.attr("tsy", transform.y);
            nodesTexts.attr("tsk", transform.k);
            //   nodesTexts.attr('transform', (d) => {

            //                    return 'translate(' + (d.x+transform.x) + ',' + (d.y+transform.y) + ')  ';

            //                 });
            repaint();
        }




        node.append("title")
            .text(d => d.id);

        simulation.on("tick", () => {
           
            repaint();


        });



        // invalidation.then(() => simulation.stop());

        function repaint(){
            link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr('d', (d) => {

                const model=_.cloneDeep(d);
                model.startPoint=d.source;
                model.endPoint=d.target;
                const linePath=getCustomerLine2Path(model)
                let path="";
                for (let index = 0; index < linePath.length; index++) {
                    const paction = linePath[index];

                    for (let k = 0; k < paction.length; k++) {
                        const data = paction[k];
                        path+= data+" ";
                    }
                    
                }

                //const path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    
                return path;
    
            });
    
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    
       
        // 更新节点文字坐标
    
        const transform = { x: _.toNumber(nodesTexts.attr("tsx")), y: _.toNumber(nodesTexts.attr("tsy")), scale: _.toNumber(nodesTexts.attr("tsk")) || 1 };
    
    
        nodesTexts.attr('dy', (d) => {
            return _.toNumber(node.attr('r')) * transform.scale + 10
        }) // 偏移量
        .attr('transform', (d) => {
            return 'translate(' + (d.x * transform.scale + transform.x) + ',' + (d.y * transform.scale + transform.y) + ') scale(' + transform.scale + ') ';
    
        });
    

        function getCenterPt(i,rate){
            if(!rate)
             rate=0.5
            const path=d3.select('#edgepath' + i)["_groups"][0][0];
            if(path)
            {
            // debugger;
              const pt=path.getPointAtLength(path.getTotalLength()*rate);
              return pt;
            }
            return {x:0,y:0}
        }

        
        edgesRect.attr('x',(d,i)=>{
            const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
            const labelwidth=d.label.length*fontsize* transform.scale;//文字长度
        
            
              const pt=getCenterPt(i);
            //  debugger;
             return pt.x* transform.scale+ transform.x-labelwidth/2;

            
            return   (d.source.x + (d.target.x-d.source.x)/2)* transform.scale+ transform.x -labelwidth/2 ;
        })
        .attr('y',(d,i)=>{
            
            
            // debugger;
               const pt=getCenterPt(i);
            //  debugger;
             return pt.y* transform.scale+ transform.y-fontsize*3/5;

          //  return   (d.source.y + (d.target.y-d.source.y)/2)* transform.scale+ transform.y -fontsize*3/5 ;
        })
        .attr('width',d=>{
            const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
            const labelwidth=d.label.length*fontsize* transform.scale+10;//文字长度
            return labelwidth;
        })
        .attr('height',d=>{
            return fontsize+5;
        })
        .attr("transform",(d,i)=>{

            let angle =0;
            let degree=0;

         
                 angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))

                 degree=angle*180/Math.PI;
           
                 if(isNaN(degree))
                 {
                    degree=0;
                 }
            

            const pt=getCenterPt(i);
            //  debugger;
             
          
            const rx= pt.x* transform.scale+ transform.x;
            const ry=pt.y* transform.scale+ transform.y;

            return 'rotate('+ degree +' '+rx+' '+ry+')';
        })
    

        arrow
        .attr('transform', (d,i) => {
            const pt=getCenterPt(i,0.75);
            const rx= pt.x* transform.scale+ transform.x;
            let ry=pt.y* transform.scale+ transform.y;
            
            const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
            let degree=angle*180/Math.PI;

            if(isNaN(degree))
            {
               degree=0;
            }

            if(degree<90 && d.target.x<=d.source.x) //第二象限
            {
                degree+=180;
            }
            else if(degree>-90 &&degree<0  && d.target.y>=d.source.y) //第三象限
            {
                degree+=180;
            }


            return 'translate(' + rx + ',' + ry + ') scale(' + transform.scale + ') rotate('+degree +' 0 '+ 0+') ';
    
        });


    
        edgesText
        .attr('x',(d,i)=>{
            const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
            const labelwidth=d.label.length*fontsize* transform.scale+10;//文字长度
            const pt=getCenterPt(i);
           //  debugger;
            return pt.x* transform.scale+ transform.x-labelwidth/2+10;
            
           // return   (d.source.x + (d.target.x-d.source.x)/2)* transform.scale+ transform.x -labelwidth/2+10 ;
        })
        .attr('y',(d,i)=>{
            
            const pt=getCenterPt(i);
           return pt.y* transform.scale+ transform.y+fontsize/2;

            //return   (d.source.y + (d.target.y-d.source.y)/2)* transform.scale+ transform.y+fontsize/2  ;
        })
        // .attr('dx', d=>{
        //     const dis=Math.sqrt((d.source.x- d.target.x)*(d.source.x- d.target.x)+ (d.source.y-d.target.y)*(d.source.y-d.target.y));
        //   return   dis/2;
        // })
        .attr('transform', (d, i) => {

            const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))

            let degree=angle*180/Math.PI;
           
            if(isNaN(degree))
            {
               degree=0;
            }
            
            const pt=getCenterPt(i);
            //  debugger;
             
          
            const rx= pt.x* transform.scale+ transform.x;
            const ry=pt.y* transform.scale+ transform.y;

            return '  rotate('+ degree +' '+rx+' '+ry+')  ';
    
           // return 'rotate('+ degree +' '+rx+' '+ry+')  scale(' + transform.scale + ')';

           
        });
    
        }


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

            const { graphicModel } = props;

            //  cacluePanelSize(dvref.current, val);
        });

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

    const riseze = (el, cb) => {
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

        <div style={{ float: 'left', position: "absolute" }}>
            <div>label:{curmod ? curmod.label : '-'}</div>
            <div>mdoelx:{curmod ? curmod.x : '-'}</div>
            <div>mdoelxy:{curmod ? curmod.y : '-'}</div>
            <div>x:{devent ? devent.x : '-'}</div>
            <div>y:{devent ? devent.y : '-'}</div>
        </div>
            <div>

                <svg>
                    <g></g>
                </svg>
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
        
                <div id="theChart"
            style={{ width: '100%', height: '100vh' }} ref={dvref}  >





        </div>
    </>);
}


export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withRouter(G6Panel));

