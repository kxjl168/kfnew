



import React, { useState, useRef, cloneElement, useEffect, useImperativeHandle, forwardRef } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Row, Input, Col, Avatar, Spin } from "antd";
import QueueAnim from 'rc-queue-anim';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { MyEditObj } from '../ModifyList/data';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';

import { isnull, GetRandomLightColor } from '@/utils/utils';
import _ from 'lodash';
import EditMainPanel from '../GraphicO/index';
import '../index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/logo.svg';
import EntitySelect from '@/components/MyCom/EntitySelect';

import circleimg from '../../../assets/circle.png';
import { getAllPostionsByCircle } from './behavior';
import { itemIntersectByLine } from '@antv/g6/lib/util/math';
import * as  d3 from "d3";

export interface D3NodeProps {
    group?: any;
    dragCallBack?: () => any;
    nodes?: any[];
}

export interface D3NodeAction {
    paint: (group: any, nodes: any[], dragCallBack: () => void, events: any) => void;
    refreshNode: (group: any, nodes: any[], dragCallBack: () => void, events: any) => void;

    tick: () => void;
    zoom: (transform: any) => void;
}

const D3Node: React.FC<D3NodeProps> = (props, ref) => {


    //  const { group, dragCallBack, nodes } = props;

    const [svgnodes, setsvgNodes] = useState<any>();

    const [nodesTexts, setNodesTexts] = useState<any>();


    const [group, setgroup] = useState<any>();
    const [nodegroups, setnodeGroups] = useState<any>();


    const [outR, setOutR] = useState<number>(40);//选中外圈
    const [outPanelR, setOutPanelR] = useState<number>(70);//动作arc</number>

    const svgnodeRef = useRef();
    const nodeTextsRef = useRef();
    const nodegroupsRef = useRef();
    const groupRef = useRef();


    useEffect(() => {
        groupRef.current = group;
    }, [group])
    useEffect(() => {
        nodegroupsRef.current = nodegroups;
    }, [nodegroups])

    useEffect(() => {
        svgnodeRef.current = svgnodes;
    }, [svgnodes])

    useEffect(() => {
        nodeTextsRef.current = svgnodes;
    }, [nodesTexts])

    useEffect(() => {


        //  paintNode();


        //.call(drag2(simulation));


    }, [])

    // const refreshNode = (group, nodes, dragCallBack, events) => {
    //     // Apply the general update pattern to the nodes.
    //     let node = group.selectAll("g.node").data(nodes, function (d) { return d.id; });

    //     node.exit().transition()
    //         .attr("r", 0)
    //         .remove();

    //     node = node.enter().append('g').attr('class', 'node')
    //         .attr('id', d => d.id)
    //         .call(dragCallBack);
    //      node = node.merge(node);

    //     // if (events) {
    //     //     const ekeys = Object.keys(events);
    //     //     if (ekeys) {
    //     //         ekeys.forEach(key => {
    //     //             node.on(key, (e, model) => {
    //     //                 events[key](e, model);
    //     //             })
    //     //         })
    //     //     }
    //     // }



    //     setnodeGroups(node);

    //     paintnodeElemnt(node);

    // }

    const refreshNode = (group, nodes, dragCallBack, events) => {

      //  const olddata=group.selectAll("g.node").data();

        let gpnode = group.selectAll("g.node").data(nodes);
     
        gpnode.exit().transition().duration(200)
            .attr("opacity", 0)
            .remove();

        //节点外部g
        gpnode = gpnode.enter().append('g')
            .attr('id', d => "id"+d.id)
            .attr('class',d=>{
               // debugger;
                if(d.hide)
                return 'node hide';

                return 'node';
            })
            .merge(gpnode)
            .call(dragCallBack)
            ;

        // gpnode.on('click',(e,d)=>{
        //     nodes.forEach(nd => {
        //         nd.selected=false;
        //     });

        //     d.selected=true;
        // })






        paintnodeElemnt(gpnode, events);

        setnodeGroups(gpnode);

        // setNodesTexts(cnodesTexts);

    }

    //节点内部数据
    const paintnodeElemnt = (gpnode, events) => {



        //操作边圈
        const cnodeActionPanel = gpnode
            .selectAll(".ringactionpanels")
            .data(d => { return actiondata(d) })
            .enter()
            .append('path')
            .attr("class", d => {
                //  console.log(d);
                if (d.data.selected)
                    return 'ringactionpanels selected';


                return 'ringactionpanels';
            })
            .attr("outerR", d => {

                if (d.data.selected)
                    return outPanelR;

                return 30;
            })
            .attr('d', d => {
                return arcGenerator(d.outerR)(d)
            }
            )
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)

            .attr("fill", d => {
                return d.data.color || 'red';
            })
            .attr('title',d=>d.label)
          
            .on("click", (e, model) => {
               // message.info(model.name);

               
             //   console.log(model)
                // if (model.id === "unlock") {
                //     model.data.fx=null;
                //     model.data.fy=null;
                //     model.data.selected=false;
                //     model.data.hover=false;

                  
                //     model.data.fixed=false;
                //  //d3.select("#id"+model.data.id+"").classed("fixed", false)

                // }

                const event=events["ringactionpanels"];
                if(event)
                {
                    event(e,model);
                    if(model.toggole)
                    {
                        //切换
                        model.value=-1*model.value;

                        setTimeout(() => {
                            ticker();    
                        }, 30);
                        
                    }
                }



                e.preventDefault();
            })
            .append("title")
            .classed("tooltip", true)
              .text(function(d) { return d.name })
            ;


        const apanels = gpnode

            .selectAll("circle.ringaction")
            .data(node => [node])
            .join("circle")
            .attr("class", d => {

                let cls = "ringaction";
                if (d.selected)
                    cls += ' selected ';

                if (d.hover)
                    cls += ' hover';


                return cls;
            })

            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", (r) => {
                return r.size || 30
            })
            .attr("fill", d => {
                return d.color || 'red';
            })
            .attr('cx', 0)
            .attr('cy', 0)








        const cnode = gpnode

            .selectAll("circle.ring")
            .data(node => [node])
            .join("circle")
            .attr("class", 'ring')

            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", (r) => {
                return r.size || 30
            })
            .attr("fill", d => {
                return d.color || 'red';
            })
            .attr('cx', 0)
            .attr('cy', 0);

          
        //点击节点触发
        if (events) {
            const ekeys = Object.keys(events);
         
            if (ekeys) {
                ekeys.forEach(key => {
                    cnode.on(key, (e, model) => {
                        events[key](e, model);
                    })
                })


            }
        }

//<svg t="1601016929292" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3458" width="32" height="32"><path d="M912.221091 1018.996364 111.778909 1018.996364 111.778909 471.226182l132.328727 0 0-201.658182c0-145.873455 120.180364-264.564364 267.915636-264.564364 147.712 0 267.892364 118.690909 267.892364 264.564364l0 63.627636-44.288 0 0-63.627636c0-121.460364-100.305455-220.276364-223.581091-220.276364-123.298909 0-223.627636 98.816-223.627636 220.276364l0 201.658182 623.825455 0L912.244364 1018.996364zM156.066909 974.708364l711.866182 0L867.933091 515.490909 156.066909 515.490909 156.066909 974.708364z" p-id="3459"></path></svg>
        //<svg t="1601016783645" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3276" width="16" height="16"><path d="M746.666667 426.666667H384v-170.666667a128 128 0 0 1 256 0v21.333333a21.333333 21.333333 0 0 0 42.666667 0v-21.333333a170.666667 170.666667 0 0 0-341.333334 0v170.666667h-64a106.773333 106.773333 0 0 0-106.666666 106.666666v298.666667a106.773333 106.773333 0 0 0 106.666666 106.666667h469.333334a106.773333 106.773333 0 0 0 106.666666-106.666667V533.333333a106.773333 106.773333 0 0 0-106.666666-106.666666z m64 405.333333a64.064 64.064 0 0 1-64 64H277.333333a64.064 64.064 0 0 1-64-64V533.333333a64.064 64.064 0 0 1 64-64h469.333334a64.064 64.064 0 0 1 64 64z" fill="#646464" p-id="3277"></path><path d="M512 597.333333a21.333333 21.333333 0 0 0-21.333333 21.333334v128a21.333333 21.333333 0 0 0 42.666666 0v-128a21.333333 21.333333 0 0 0-21.333333-21.333334z" fill="#646464" p-id="3278"></path></svg>


        gpnode
            .selectAll('.ringactionpanelstxt')
            .data(d => { return actiondata(d) })
            .enter()
            //.append('text')
           // .append('path')
           // //.attr("d","M2,-4 L10,0 L2,4 L6,0 L2,-4")
           // .attr('d','M746.666667 426.666667H384v-170.666667a128 128 0 0 1 256 0v21.333333a21.333333 21.333333 0 0 0 42.666667 0v-21.333333a170.666667 170.666667 0 0 0-341.333334 0v170.666667h-64a106.773333 106.773333 0 0 0-106.666666 106.666666v298.666667a106.773333 106.773333 0 0 0 106.666666 106.666667h469.333334a106.773333 106.773333 0 0 0 106.666666-106.666667V533.333333a106.773333 106.773333 0 0 0-106.666666-106.666666z m64 405.333333a64.064 64.064 0 0 1-64 64H277.333333a64.064 64.064 0 0 1-64-64V533.333333a64.064 64.064 0 0 1 64-64h469.333334a64.064 64.064 0 0 1 64 64z')


            
            .append("use").attr("xlink:href",d=>"#"+(d.id+d.value)) //id,value 图片
          
            .style('pointer-events', 'none') // 禁止鼠标事件
             .attr("class", d => {
                 //  console.log(d);
                 if (d.data.selected)
                     return 'ringactionpanelstxt selected';

               return 'ringactionpanelstxt';
             })




        cnode.append("title")
            .text(d => d.label);


        // setsvgNodes(cnode);

        const cnodesTexts = gpnode

            .selectAll('.node-text')
            .data(node => [node])
            //.data(nodes)

            .enter()

            .append('text')

            .attr('dy', '50') // 偏移量
            .attr("tsx", 0)
            .attr("tsy", 0)
            .attr("tsk", 1)
            .attr('class', 'node-text') // 节点名称放在圆圈中间位置
            .attr('text-anchor', 'middle') // 节点名称放在圆圈中间位置

            .style('pointer-events', 'none') // 禁止鼠标事件

            .text((d) => { // 文字内容

                return d && d.label; // 遍历nodes每一项，获取对应的name

            });


         //   gpnode.exit().remove();
    }

    const arcGenerator = (outerR) => {
        return d3.arc()
            .innerRadius(outR)
            .outerRadius(outerR || outPanelR)

        // .cornerRadius(4);
    }

    const actiondata = (d) => {
        const actiondatas = [
            {
                data: d,
                id: 'search',
                name: '检索',
                startAngle: 2 * 2 * Math.PI / 3,
                endAngle: 2 * Math.PI,
                index: 4,
                value: ""
            },
           
            {
                data: d,
                id: 'hideoutnodes',
                name: '加载/隐藏关联节点',
                startAngle: 2 * Math.PI / 3,
                endAngle: 2 * 2 * Math.PI / 3,
                index: 2,
                value: d.detail?1:-1,
                toggole:true,//开关支持
            }, {
                data: d,
                id: 'detail',
                name: '关闭/显示详情',
                startAngle: 2 * 2 * Math.PI / 3,
                endAngle: 2 * Math.PI,
                value: 1,
                toggole:true,//开关支持
            },
            {
                data: d,
                id: 'unlock',
                name: '解锁/锁定节点',
                startAngle: 0,
                endAngle: 2 * Math.PI / 3,
                index: 1,
                value: d.fixed?-1:1,
                toggole:true,//开关支持
            },
        ]


        for (let index = 0; index < actiondatas.length; index++) {
            const item = actiondatas[index];
            item.startAngle= (index) * 2 * Math.PI / actiondatas.length;
            item.endAngle= (index+1) * 2 * Math.PI / actiondatas.length;
        }

        return actiondatas;
    }


    const ticker = () => {

        if (nodegroupsRef.current) {
            // const transform = { x: _.toNumber(nodegroupsRef.current.attr("tsx")), y: _.toNumber(nodegroupsRef.current.attr("tsy")), scale: _.toNumber(nodegroupsRef.current.attr("tsk")) || 1 };



            nodegroupsRef.current.attr('transform', d => {
                return 'translate(' + d.x + ',' + d.y + ') ';
            })

            .attr('class',d=>{
               // debugger;
                let  cls= ' node ';
                if(d.hide)
                cls+=' hide ';

                  if(d.fixed)
                  cls+= ' fixed ';

                return cls;
            })
           
          

            nodegroupsRef.current.selectAll(".node-text")
                .attr('dy', d => {
                    if (d.selected)
                        return 30 + outPanelR;

                    return 50;
                }) // 偏移量
               . text(d=>d.label);



            nodegroupsRef.current.selectAll(".ringactionpanelstxt")

                .each(function (d) {

                    let outR = 30;
                    let cls = "ringactionpanelstxt";
                    if (d.data.selected) {
                        cls = "ringactionpanelstxt selected";
                        outR = outPanelR;
                    }

                    var centroid = arcGenerator(outR).centroid(d);
                    d3.select(this)
                       // .attr('x', centroid[0])
                       // .attr('y', centroid[1])
                        .attr('transform', d => {
                            return 'translate(' + (centroid[0]-10)+ ',' +  (centroid[1]-10) + ') ';
                        })
                       // .attr('dx', '-10')
                      // .attr("d","M2,-4 L10,0 L2,4 L6,0 L2,-4")
                        .attr('class', cls)
                        //.text(d.name);


                    d3.select(this).attr("xlink:href",d=>"#"+(d.id+d.value)) //id,value 图片

                    


                  


                });

            nodegroupsRef.current.selectAll(".ringactionpanels")
                .transition()
                .duration(300)
                //.delay(10)
                .ease(d3.easeElasticOut.amplitude(1).period(0.2))     //过渡样式
                // .attr("outerR", d => {

                //     if (d.data.selected)
                //         return 80;

                //     return 30;
                // })
                .attr('d', d => {

                    let outR = 30;
                    if (d.data.selected)
                        outR = outPanelR;
                    return arcGenerator(outR)(d)
                }
                )
                .attr("class", d => {

                    if (d.data.selected)
                        return 'ringactionpanels selected';

                    return 'ringactionpanels';
                });




            nodegroupsRef.current.selectAll("circle.ringaction")
                .transition()
                .duration(300)
                //.delay(10)
                .ease(d3.easeElasticOut.amplitude(1).period(0.2))     //过渡样式
                .attr("r", d => {

                    if (d.selected)
                        return outR;

                    if (d.hover)
                        return outR;

                    return 30;
                })
                .attr("class", d => {

                    let cls = "ringaction";
                    if (d.selected)
                        cls += ' selected ';

                    if (d.hover)
                        cls += ' hover';


                    return cls;
                });

        }


    }

    const zoomInner = (transform: any) => {


        ticker();
    }




    useImperativeHandle(ref, ((): D3NodeAction => {
        return {
            paint: (group, nodes, dragCallBack, events) => {
                refreshNode(group, nodes, dragCallBack, events);

            },

            tick: () => {

                ticker();
            },

            zoom: (transform: any) => {
                zoomInner(transform)
            }
        }

    }));




    return (<>
    <g>
       <defs style={{display:'none'}}>
        
        <svg  id="unlock-1" t="1601018051238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7422" width="18" height="18"><path d="M1005.553333 186A234.666667 234.666667 0 0 0 554.666667 277.333333v106.666667H53.333333a53.393333 53.393333 0 0 0-53.333333 53.333333v490.666667a53.393333 53.393333 0 0 0 53.333333 53.333333h618.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V437.333333a53.393333 53.393333 0 0 0-53.333333-53.333333H597.333333V277.333333c0-105.866667 86.133333-192 192-192s192 86.133333 192 192v128a21.333333 21.333333 0 0 0 42.666667 0V277.333333a233.22 233.22 0 0 0-18.446667-91.333333zM682.666667 437.333333v490.666667a10.666667 10.666667 0 0 1-10.666667 10.666667H53.333333a10.666667 10.666667 0 0 1-10.666666-10.666667V437.333333a10.666667 10.666667 0 0 1 10.666666-10.666666h618.666667a10.666667 10.666667 0 0 1 10.666667 10.666666zM362.666667 554.666667a64 64 0 0 0-21.333334 124.34V789.333333a21.333333 21.333333 0 0 0 42.666667 0v-110.326666A64 64 0 0 0 362.666667 554.666667z m0 85.333333a21.333333 21.333333 0 1 1 21.333333-21.333333 21.333333 21.333333 0 0 1-21.333333 21.333333z"  p-id="7423"></path></svg>
        
        <svg id="unlock1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14604" width="16" height="16"><path d="M852.0704 365.6704C864.256 365.6704 870.4 371.8144 870.4 384l0 566.8864c0 21.2992-6.8608 38.912-20.5824 52.5312C836.096 1017.1392 818.5856 1024 797.2864 1024L175.5136 1024c-21.2992 0-38.8096-6.8608-52.5312-20.5824C109.2608 989.696 102.4 972.1856 102.4 950.8864L102.4 384c0-12.1856 6.144-18.3296 18.3296-18.3296l91.4432 0L212.1728 274.3296c0-76.1856 26.624-140.9024 79.9744-194.2528C345.4976 26.624 410.2144 0 486.4 0c76.1856 0 140.9024 26.624 194.2528 79.9744 53.3504 53.3504 79.9744 118.0672 79.9744 194.2528l0 91.4432L852.0704 365.6704zM833.8432 402.3296 138.9568 402.3296l0 548.5568c0 24.3712 12.1856 36.5568 36.5568 36.5568l621.6704 0c24.3712 0 36.5568-12.1856 36.5568-36.5568L833.7408 402.3296zM248.7296 365.6704l475.4432 0L724.1728 274.3296c0-65.536-23.2448-121.5488-69.7344-168.0384C607.9488 59.8016 551.936 36.5568 486.4 36.5568S364.8512 59.8016 318.3616 106.2912C271.9744 152.7808 248.7296 208.7936 248.7296 274.3296L248.7296 365.6704zM541.2864 640c0 24.3712-12.1856 41.8816-36.5568 52.5312l0 130.2528c0 12.1856-6.144 18.3296-18.3296 18.3296s-18.3296-6.144-18.3296-18.3296L468.0704 692.5312C443.6992 681.8816 431.5136 664.3712 431.5136 640c0-15.2576 5.3248-28.16 15.9744-38.8096C458.24 590.4384 471.1424 585.1136 486.4 585.1136c15.2576 0 28.16 5.3248 38.8096 15.9744C535.9616 611.84 541.2864 624.7424 541.2864 640zM504.7296 640c0-12.1856-6.144-18.3296-18.3296-18.3296S468.0704 627.8144 468.0704 640s6.144 18.3296 18.3296 18.3296S504.7296 652.1856 504.7296 640z" p-id="14605"></path></svg>
    
<svg id="search" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4470" width="18" height="18"><path d="M967.9234 816.206954l-147.416093-192.48379c52.29229-49.884092 85.146985-119.721821 85.146985-197.472199 0-150.684361-122.990089-273.330422-274.018478-273.330422-151.200403 0-274.018478 122.646061-274.018478 273.330422s122.990089 273.330422 274.018478 273.330422c48.679993 0 94.263733-12.901058 133.998992-35.090879l147.932135 193.171846c6.70855 8.77272 16.857383 13.417101 27.350244 13.417101 7.224593 0 14.621199-2.236183 20.641693-7.052579C976.524105 852.501932 979.448345 831.172182 967.9234 816.206954L967.9234 816.206954zM421.090543 426.250966c0-115.765496 94.435747-209.857215 210.545271-209.857215s210.545271 94.091718 210.545271 209.857215-94.435747 209.857215-210.545271 209.857215S421.090543 542.016462 421.090543 426.250966L421.090543 426.250966zM288.467663 288.811692 83.254829 288.811692c-18.921552 0-34.230808-15.309256-34.230808-34.058794s15.309256-34.058794 34.230808-34.058794l205.212834 0c18.921552 0 34.230808 15.309256 34.230808 34.058794C322.698471 273.502436 307.389216 288.811692 288.467663 288.811692L288.467663 288.811692zM280.210986 626.131362 83.254829 626.131362c-18.921552 0-34.230808-15.309256-34.230808-34.058794s15.309256-34.058794 34.230808-34.058794l196.956157 0c18.921552 0 34.230808 15.309256 34.230808 34.058794C314.441794 610.822107 299.132538 626.131362 280.210986 626.131362L280.210986 626.131362zM239.78767 457.041492l-156.532841 0c-18.921552 0-34.230808-15.309256-34.230808-34.230808 0-18.921552 15.309256-34.230808 34.230808-34.230808l156.532841 0c18.921552 0 34.230808 15.309256 34.230808 34.230808C273.846464 441.732236 258.537208 457.041492 239.78767 457.041492L239.78767 457.041492zM460.137746 801.241727 83.254829 801.241727c-18.921552 0-34.230808-15.309256-34.230808-34.230808s15.309256-34.230808 34.230808-34.230808l376.882916 0c18.921552 0 34.230808 15.309256 34.230808 34.230808C494.368554 785.932471 479.059298 801.241727 460.137746 801.241727L460.137746 801.241727z" p-id="4471"></path></svg>

<svg id="detail1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4660" width="18" height="18"><path d="M845.8752 116.43904 178.1248 116.43904c-34.22208 0-62.06464 27.82208-62.06464 62.04416L116.06016 845.5168c0 34.2016 27.84256 62.04416 62.06464 62.04416l667.76064 0c34.22208 0 62.06464-27.84256 62.06464-62.04416L907.95008 178.4832C907.93984 144.26112 880.09728 116.43904 845.8752 116.43904zM803.81952 187.06432c14.68416 0 26.58304 11.90912 26.58304 26.60352 0 14.68416-11.89888 26.59328-26.58304 26.59328-14.70464 0-26.60352-11.90912-26.60352-26.59328C777.216 198.97344 789.12512 187.06432 803.81952 187.06432zM708.51584 187.06432c14.70464 0 26.60352 11.90912 26.60352 26.60352 0 14.68416-11.89888 26.59328-26.60352 26.59328-14.68416 0-26.58304-11.90912-26.58304-26.59328C681.94304 198.97344 693.84192 187.06432 708.51584 187.06432zM837.0176 836.64896 186.9824 836.64896 186.9824 306.26816l650.0352 0L837.0176 836.64896zM353.00352 670.8224l103.34208-103.35232L353.00352 464.11776c-15.37024-15.37024-15.37024-40.2944 0-55.6544s40.27392-15.36 55.64416 0L512 511.81568 615.36256 408.4736c15.37024-15.36 40.27392-15.36 55.64416 0s15.37024 40.28416 0 55.6544L567.66464 567.47008 670.99648 670.8224c15.37024 15.37024 15.37024 40.2944 0 55.6544-7.68 7.68-17.75616 11.53024-27.82208 11.53024-10.07616 0-20.14208-3.85024-27.82208-11.53024L512 623.12448 408.63744 726.46656c-7.68 7.68-17.73568 11.53024-27.82208 11.53024-10.05568 0-20.14208-3.85024-27.82208-11.53024C337.63328 711.10656 337.63328 686.19264 353.00352 670.8224z" p-id="4661"></path></svg>
<svg id="detail-1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2495" width="16" height="16"><path d="M288 640C270.08 640 256 654.08 256 672 256 689.92 270.08 704 288 704 305.92 704 320 689.92 320 672 320 654.08 305.92 640 288 640zM288 256C270.08 256 256 270.08 256 288 256 305.92 270.08 320 288 320 305.92 320 320 305.92 320 288 320 270.08 305.92 256 288 256zM288 448C270.08 448 256 462.08 256 480 256 497.92 270.08 512 288 512 305.92 512 320 497.92 320 480 320 462.08 305.92 448 288 448zM768 64 192 64C121.6 64 64 121.6 64 192l0 576c0 70.4 57.6 128 128 128l576 0c70.4 0 128-57.6 128-128L896 192C896 121.6 838.4 64 768 64zM832 768c0 35.2-28.8 64-64 64L192 832c-35.2 0-64-28.8-64-64L128 192c0-35.2 28.8-64 64-64l576 0c35.2 0 64 28.8 64 64L832 768zM672 256l-256 0C398.08 256 384 270.08 384 288 384 305.92 398.08 320 416 320l256 0C689.92 320 704 305.92 704 288 704 270.08 689.92 256 672 256zM672 448l-256 0C398.08 448 384 462.08 384 480 384 497.92 398.08 512 416 512l256 0C689.92 512 704 497.92 704 480 704 462.08 689.92 448 672 448zM672 640l-256 0C398.08 640 384 654.08 384 672 384 689.92 398.08 704 416 704l256 0c17.92 0 32-14.08 32-32C704 654.08 689.92 640 672 640z" fill="#515151" p-id="2496"></path></svg>


        <svg   t="1601018051238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7422" width="18" height="18"><path d="M1005.553333 186A234.666667 234.666667 0 0 0 554.666667 277.333333v106.666667H53.333333a53.393333 53.393333 0 0 0-53.333333 53.333333v490.666667a53.393333 53.393333 0 0 0 53.333333 53.333333h618.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V437.333333a53.393333 53.393333 0 0 0-53.333333-53.333333H597.333333V277.333333c0-105.866667 86.133333-192 192-192s192 86.133333 192 192v128a21.333333 21.333333 0 0 0 42.666667 0V277.333333a233.22 233.22 0 0 0-18.446667-91.333333zM682.666667 437.333333v490.666667a10.666667 10.666667 0 0 1-10.666667 10.666667H53.333333a10.666667 10.666667 0 0 1-10.666666-10.666667V437.333333a10.666667 10.666667 0 0 1 10.666666-10.666666h618.666667a10.666667 10.666667 0 0 1 10.666667 10.666666zM362.666667 554.666667a64 64 0 0 0-21.333334 124.34V789.333333a21.333333 21.333333 0 0 0 42.666667 0v-110.326666A64 64 0 0 0 362.666667 554.666667z m0 85.333333a21.333333 21.333333 0 1 1 21.333333-21.333333 21.333333 21.333333 0 0 1-21.333333 21.333333z"  p-id="7423"></path></svg>

        <svg id="hideoutnodes1" t="1601280628061" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2688" width="18" height="18"><path d="M768 160a96 96 0 1 1-42.464 182.112l-103.872 103.84c11.648 19.264 18.336 41.888 18.336 66.048 0 15.648-2.816 30.656-7.936 44.48l81.504 68.416a96 96 0 1 1-37.696 51.936l-80.64-67.616c-22.368 19.2-51.456 30.784-83.232 30.784-24.16 0-46.72-6.72-66.016-18.304l-48.32 48.288A128 128 0 1 1 352 625.12L401.12 576A127.424 127.424 0 0 1 384 512c0-24.288 6.752-46.976 18.496-66.304l-49.248-47.552a128 128 0 1 1 45.152-45.344l49.92 48.128A127.424 127.424 0 0 1 512 384c23.328 0 45.184 6.24 64 17.12l104.832-104.832A96 96 0 0 1 768 160zM288 672a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m480 0a32 32 0 1 0 0 64 32 32 0 0 0 0-64z m-256-224a64 64 0 1 0 0 128 64 64 0 0 0 0-128zM288 224a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m480 0a32 32 0 1 0 0 64 32 32 0 0 0 0-64z" fill="#dbdbdb" p-id="2689">
        <svg id="hideoutnodes-1" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2681" width="16" height="16"><path d="M830 700c-22.619 0-43.903 5.811-62.448 16.012l-58.457-62.667c24.005-31.092 38.309-70.037 38.309-112.266 0-65.562-34.463-123.218-86.218-155.83l26.373-62.924a130.362 130.362 0 0 0 20.826 1.676c71.683 0 130-58.318 130-130s-58.317-130-130-130-130 58.318-130 130c0 43.235 21.221 81.602 53.788 105.249l-26.296 62.739a183.912 183.912 0 0 0-42.533-4.97c-101.491 0-184.06 82.569-184.06 184.06 0 9.897 0.795 19.612 2.307 29.09l-76.932 25.701c-22.92-37.088-63.949-61.855-110.659-61.855-71.682 0-130 58.317-130 130s58.318 130 130 130 130-58.317 130-130c0-3.768-0.171-7.496-0.486-11.184l77.134-25.769c30.927 58.283 92.248 98.076 162.698 98.076 37.652 0 72.694-11.373 101.888-30.851l57.785 61.947C708.512 777.206 700 802.626 700 830c0 71.683 58.317 130 130 130s130-58.317 130-130-58.317-130-130-130zM708.386 124c38.598 0 70 31.402 70 70s-31.402 70-70 70-70-31.402-70-70 31.402-70 70-70zM194 734.015c-38.598 0-70-31.402-70-70s31.402-70 70-70 70 31.402 70 70-31.402 70-70 70z m245.286-192.937c0-68.407 55.653-124.06 124.06-124.06 68.406 0 124.059 55.653 124.059 124.06 0 68.406-55.652 124.06-124.059 124.06s-124.06-55.654-124.06-124.06zM830 900c-38.598 0-70-31.402-70-70s31.402-70 70-70 70 31.402 70 70-31.402 70-70 70z" fill="#e6e6e6" p-id="2682"></path></svg>
            </path>
            <path d="M20 20L64.666667 40 L2510.666667 2671.333333 L40 60 T10 20" fill="white"></path>
            </svg>
        
        </defs>
        </g>
    </>);
}

export default forwardRef(D3Node);
