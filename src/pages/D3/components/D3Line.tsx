



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

import { getCustomerLine2Path } from '@/pages/G6/components/line';

import * as  d3 from "d3";


export interface D3Props {
    group?: any;
    dragCallBack?: () => any;
    nodes?: any[];
}

export interface D3Action {
    paint: (group: any, nodes: any[], dragCallBack: () => void) => void;
    tick: () => void;
    zoom: (transform: any) => void;
}

const D3Line: React.FC<D3Props> = (props, ref) => {


    //  const { group, dragCallBack, nodes } = props;

    const [svgnodes, setsvgNodes] = useState<any>();

    const [nodesTexts, setNodesTexts] = useState<any>();

    const fontsize = 14;


    const [group, setgroup] = useState<any>();
    const [nodegroups, setnodeGroups] = useState<any>();

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

    const paintNode = (group, lines, dragCallBack) => {

        let g = group.selectAll("g.line").data(lines);

       let old= group.selectAll(" .linepath" );


       //g.exit()方法有问题
       //手动清空 全删除
       group.selectAll(" .linepath" ).remove();
       group.selectAll(" .edgerect" ).remove();
       group.selectAll(" .arrow" ).remove();
       group.selectAll(" .edgelabel" ).remove();
   
      
    //    g.exit()
    //         .attr("opacity", 0)
    //         .remove();


     //  g.transition()
    //   .attr("stroke-opacity", 0)
    //    .attrTween("x1", function(d) { return function() { return d.source.x; }; })
    //    .attrTween("x2", function(d) { return function() { return d.target.x; }; })
    //    .attrTween("y1", function(d) { return function() { return d.source.y; }; })
    //    .attrTween("y2", function(d) { return function() { return d.target.y; }; })
    //  .remove();

    
    //    old.transition()
    // .attr("stroke-opacity", 0)
    // .attrTween("x1", function(d) { return function() { return d.source.x; }; })
    // .attrTween("x2", function(d) { return function() { return d.target.x; }; })
    // .attrTween("y1", function(d) { return function() { return d.source.y; }; })
    // .attrTween("y2", function(d) { return function() { return d.target.y; }; })
    // .remove();

    //g. enter().selectAll('.arrow').remove();
        
        

        g = g.enter().append('g').attr('class', 'line')
        .attr('id', d => "id"+d.id)
            .merge(g);


     


     


        const link = g

            .selectAll(".linepath")
            .data((links, i) => [links])
            // .join("line")
            // .attr('id', (d, i) => { return i && 'edgepath' + i; }) // 设置id，用于连线文字
            //  .attr('marker-end', 'url(#arrow)')
            // .attr("stroke-width", d => Math.sqrt(d.value));
            .enter() // 添加数据到选择集edgepath
            .append('path') // 生成折线
            .attr('class', 'linepath')
           // .attr('d', (d) => { return d && 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y; }) // 遍历所有数据，d表示当前遍历到的数据，返回绘制的贝塞尔曲线

            .attr('id', (d, i) => { return 'edgepath' + d.id; }) // 设置id，用于连线文字

           // .attr('marker-end', 'url(#arrow)') // 根据箭头标记的id号标记箭头
            //.exit().remove();
        // .attr("stroke", "#999")
        // .attr("stroke-opacity", 0.6)
        // .style('stroke', '#000') // 颜色

        // .style('stroke-width', 1); // 粗细


        //自定义中间箭头
        const arrow = g

            .selectAll(".arrow")
            .data(links => [links])
            .enter() // 添加数据到选择集edgepath
            .append('path') // 生成折线
            .attr('class', 'arrow')

            .attr('d', (d) => { return "M2,-4 L10,0 L2,4 L6,0 L2,-4" }) // 箭头path

            .attr('id', (d, i) => { return 'arrow' + d.id; }) // 设置id，用于连线文字
            .append("circle")
            .exit().remove();

        const edgesRect = g.selectAll('.edgerect')

            .data(links => [links])

            .enter()

            .append('rect') // 为每一条连线创建文字区域

            .attr('class', 'edgerect')
            .attr('width', 200)
            .attr('height', 30)
            .attr('rx', 5)
            .attr('ry', 5)
            .style('fill', '#aaa') // 颜色
            .attr('dx', 80)

            .attr('dy', 0)
            .exit().remove();;


        const edgesText = g.selectAll('.edgelabel')

            .data(links => [links])

            .enter()

            .append('text') // 为每一条连线创建文字区域

            .attr('class', 'edgelabel')
            // .style('stroke', 'black') // 颜色
            .text((d) => { return d && d.label; })
            .attr('dx', 0)
            .attr('dy', 0)
            .exit().remove();
            ;


           // g.exit().remove();


            setnodeGroups(g);
    }


    function getCenterPt(d, rate) {
        if (!rate)
            rate = 0.5
        const path = d3.select('#edgepath' + d.id)["_groups"][0][0];
      //  debugger;
        if (path) {
            // debugger;
            const pt = path.getPointAtLength(path.getTotalLength() * rate);
            return pt;
        }
        else{
            return {x:(d.source.x+d.target.x)/2,y:(d.source.y+d.target.y)/2}
        }

       // debugger;
       // return { x: 0, y: 0 }
    }


    const ticker = () => {

        if (nodegroups) {
            // const transform = { x: _.toNumber(nodegroupsRef.current.attr("tsx")), y: _.toNumber(nodegroupsRef.current.attr("tsy")), scale: _.toNumber(nodegroupsRef.current.attr("tsk")) || 1 };


            nodegroupsRef.current
            .attr('class',d=>{
               // debugger;
                if(d.hide)
                return 'line hide';

                return 'line';
            })

            nodegroups.selectAll(".linepath")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .attr('d', (d) => {

                    const model = _.cloneDeep(d);
                    model.startPoint = d.source;
                    model.endPoint = d.target;
                    const linePath = getCustomerLine2Path(model)
                    let path = "";
                    for (let index = 0; index < linePath.length; index++) {
                        const paction = linePath[index];

                        for (let k = 0; k < paction.length; k++) {
                            const data = paction[k];
                            path += data + " ";
                        }
                    }
                   // console.log(path);

                    //const path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;

                    return path;

                });




            nodegroupsRef.current.selectAll("rect.edgerect").attr('x', (d, i) => {

                const labelwidth = d.label.length * fontsize;//文字长度


                const pt = getCenterPt(d);
                //  debugger;
                return pt.x - labelwidth / 2;


            })
                .attr('y', (d, i) => {


                    // debugger;
                    const pt = getCenterPt(d);
                    //  debugger;
                    return pt.y - fontsize * 3 / 5;

                    //  return   (d.source.y + (d.target.y-d.source.y)/2)* transform.scale+ transform.y -fontsize*3/5 ;
                })
                .attr('width', d => {

                    const labelwidth = d.label.length * fontsize + 10;//文字长度
                    return labelwidth;
                })
                .attr('height', d => {
                    return fontsize + 5;
                })
                .attr("transform", (d, i) => {

                    let angle = 0;
                    let degree = 0;


                    angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))

                    degree = angle * 180 / Math.PI;

                    if (isNaN(degree)) {
                        degree = 0;
                    }


                    const pt = getCenterPt(d);

                    const rx = pt.x;
                    const ry = pt.y;

                    return 'rotate(' + degree + ' ' + rx + ' ' + ry + ')';
                })

                nodegroupsRef.current.selectAll(".arrow")
                .each(function (d) {

                    const pt = getCenterPt(d, 0.80);


                   d3.select(this).select("circle")
                   .attr('transform', 'translate(' + (pt.x) + ',' + pt.y + ')')
                
                   .attr('r',20)
                   .attr("fill",'red');
                });

            nodegroupsRef.current.selectAll(".arrow")
                .attr('transform', (d, i) => {
                    const pt = getCenterPt(d, 0.80);
                    const rx = pt.x;
                    let ry = pt.y;

                    const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
                    let degree = angle * 180 / Math.PI;

                    if(d.lineType==='Q')//曲线计算与终点的角度
                    {
                        const angleQ = Math.atan((d.target.y - pt.y) / (d.target.x - pt.x))
                         degree = angleQ * 180 / Math.PI;
                    }


                    if (isNaN(degree)) {
                        degree = 0;
                    }

                    if (degree < 90 && d.target.x <= d.source.x) //第二象限
                    {
                        degree += 180;
                    }
                    else if (degree > -90 && degree < 0 && d.target.y >= d.source.y) //第三象限
                    {
                        degree += 180;
                    }


                    return 'translate(' + (rx) + ',' + ry + ')  rotate(' + degree + ' 0 ' + 0 + ') ';

                })
              
                
                ;


            nodegroupsRef.current.selectAll(".edgelabel")
                .attr('x', (d, i) => {
                    const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))
                    const labelwidth = d.label.length * fontsize + 10;//文字长度
                    const pt = getCenterPt(d);
                    //  debugger;
                    return pt.x - labelwidth / 2 + 10;

                    // return   (d.source.x + (d.target.x-d.source.x)/2)* transform.scale+ transform.x -labelwidth/2+10 ;
                })
                .attr('y', (d, i) => {

                    const pt = getCenterPt(d);
                    return pt.y + fontsize / 2;

                    //return   (d.source.y + (d.target.y-d.source.y)/2)* transform.scale+ transform.y+fontsize/2  ;
                })
                // .attr('dx', d=>{
                //     const dis=Math.sqrt((d.source.x- d.target.x)*(d.source.x- d.target.x)+ (d.source.y-d.target.y)*(d.source.y-d.target.y));
                //   return   dis/2;
                // })
                .attr('transform', (d, i) => {

                    const angle = Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x))

                    let degree = angle * 180 / Math.PI;

                    if (isNaN(degree)) {
                        degree = 0;
                    }

                    const pt = getCenterPt(d);
                    //  debugger;


                    const rx = pt.x;
                    const ry = pt.y;

                    return '  rotate(' + degree + ' ' + rx + ' ' + ry + ')  ';

                    // return 'rotate('+ degree +' '+rx+' '+ry+')  scale(' + transform.scale + ')';


                });


        }
    }

    const zoomInner = (transform: any) => {
        // svgnodeRef.current.attr("transform", transform);

        // nodegroupsRef.current?.attr("tsx", transform.x);
        // nodegroupsRef.current?.attr("tsy", transform.y);
        // nodegroupsRef.current?.attr("tsk", transform.k);




        ticker();
    }




    useImperativeHandle(ref, ((): D3Action => {
        return {
            paint: (group, nodes, dragCallBack) => {
                paintNode(group, nodes, dragCallBack);

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

    </>);
}

export default forwardRef(D3Line);
