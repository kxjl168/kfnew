



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
import _ from 'lodash';
import EditMainPanel from '../GraphicO/index';
import '../index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/logo.svg';
import EntitySelect from '@/components/MyCom/EntitySelect';
import G6, { Util } from '@antv/g6';
import { getBslPoints } from "@/utils/bslPoint";
import { getAllPostionsByCircle } from './behavior';


/**
 * 自定义线条，path路径算法
 * @param item  line model对象
 */
export const getCustomerLine2Path=(item)=>{
     // debugger;
     if(!item)
     return [];
               // var points = item.getPoints();
               var start =item.startPoint;
               var end = _.cloneDeep(item.endPoint);
       
               var model =item;// item.getModel();
       
               //自己到自己的关系，修改节点
       
               if(model.source===model.target)
               {
                   try {
                       
                    if(item.attr)
                 {
                   item.attr("lineType","Q");
                   item.attr("heightRate","32");
                   item.attr("sourceAnchor","0");// 8个节点
                   item.attr("targetAnchor","2");// 8个节点
                }
                else{
                    model.lineType="Q";
                    model["heightRate"]=62;
                    model["sourceAnchor"]="0";// 8个节点
                    model["targetAnchor"]="2";// 8个节点

                    //自己与自己连线，end点偏移
                    end.x=end.x+20;
                    end.y=end.y+20;

                }
                } catch (error) {
               
                
                }
                // item.model=model;
               
               }
       
       
       
               if (model.lineType && model.lineType === "C") //曲线
               {
                 var hgap = Math.abs(end.x - start.x);
                 if (end.x > start.x) {
                   return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
                 }
                 return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
               }
       
               if (model.lineType && model.lineType === "Q") //2次曲线
               {
       
                 //if(model.source!==model.target)
                // this.resetAnchor(item,start,end);
       
               
       //debugger;
       
                 var xgap = Math.abs(end.x - start.x);
                 var ygap = Math.abs(end.y - start.y);
       
                 const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
                 const angle =  (Math.acos((start.x - end.x) / xlength)); //-1,1
       
                 let rate=model.heightRate||1;
                 let updown=model.updown||1; //上1，下-1
       
                  let yheight=updown*rate*xlength/8;
       //           let yheight=30;//xlength/8;
       
                  const pts=getBslPoints(start,end,yheight);
               
                  const svgpath=[['M', start.x, start.y], ['C',pts[0].x,pts[0].y, pts[1].x,pts[1].y, end.x, end.y]];
                //  console.log(svgpath);
                  return svgpath;
       
               //    //return [['M', start.x, start.y], ['C', start.x + xgap / 3, start.y + updown*yheight, start.x + xgap * 2 / 3, start.y + updown*yheight, end.x, end.y]];
       
       
       
               //   if (end.x > start.x) {
               //     if(Math.abs(angle)<0.5)//竖直方向
               //     return [['M', start.x, start.y], ['C', start.x + xgap *4/ 5, start.y + yheight, start.x + xgap * 3 / 5, start.y + yheight, end.x, end.y]];
       
                
               //   }
               //  // console.log("M" + start.x + " " + start.y + " C " + start.x - xgap / 3 + " " + start.y - 30 + " " + start.x - xgap * 2 / 3 + " " + start.y - 30 + " " + end.x + " " + end.y);
       
       
               //   if(Math.abs(angle)<0.5)
               //   return [['M', start.x, start.y], ['C', start.x - xgap *4/5, start.y - yheight, start.x - xgap * 3 / 5, start.y - yheight, end.x, end.y]];
       
               //   return [['M', start.x, start.y], ['C', start.x - xgap / 3, start.y - yheight, start.x - xgap * 2 / 3, start.y - yheight, end.x, end.y]];
               }
               if (model.lineType && model.lineType === "A") //椭圆弧 //TODO
               {
                 // <path d="M30 50 A 50 30 0 0 1 130 50"/>    起点， xr,yr, 角度, 0小于180/1大于180， 0逆时针，1顺时针，终点
       
                 var xgap = Math.abs(end.x - start.x);
                 var ygap = Math.abs(end.y - start.y);
       
                 const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
                 const angle =  (Math.acos((start.x - end.x) / xlength)/Math.PI)*180*-1; //度
               //  console.log(angle);
                 let yr = xlength / 4;//椭圆程度，y半径
                // console.log("M" + start.x + " " + start.y + " A " + xlength / 2 + " " +  yr + " " + angle + " 0 " + (start.x >= end.x ? 0 : 1) + " " + end.x + " " + end.y);
                 return [['M', start.x, start.y], ['A', xlength / 2, yr, angle, 0, start.x >= end.x ? 0 : 1, end.x, end.y]];
               }
       
       
       
       
       
               //SVG path 直线
               return [['M', start.x, start.y], ['L', end.x, end.y]];
       
}


const G6Line: React.FC<{}> = (props) => {


    useEffect(() => {



        G6.registerEdge('CustomLine2', {
            getDefaultCfg() {
                return {
                    defaultStroke: '#aaa',
                }
            },
            
            // 设置状态
            setState(name, value, item) {
                //debugger;
                const group = item.getContainer();
                const shape = group.get('children')[0]; // 顺序根据 draw 时确定

                const cfg = item?.getModel();
                let stroke = cfg.stroke || this.getDefaultCfg().defaultStroke;
                
              //  let r = (cfg.size || this.getDefaultCfg().defaultR);
              

                if (name === 'running') {
                    if (value) {
                    shape.attr('stroke', 'red');
                    }
                    else
                    {
                        shape.attr('stroke', stroke);
                        if(item?.hasState("selected"))
                        {
                            this.checkRunning(shape,true,stroke);
                        }
                    }
                }

                if (name === 'selected') {
                    this.checkRunning(shape,value,stroke);
                }



            },
            checkRunning(shape,value,stroke){
                if (value) {
                    shape.attr('oristroke', shape.attr('stroke'));


                    shape.attr('stroke', 'blue');
                   

                    // 第一个背景圆逐渐放大，并消失
                    shape.animate({
                        stroke: 'blue',
                        opacity: 0.5,

                    }, {
                        repeat: false, // 循环,
                        duration: 500, easing: 'easeCubic', callback: null, delay: 0
                    }) // 2
                    

                } else {

                    shape.animate({
                        stroke: stroke,
                        opacity: 1,

                    }, {
                        repeat: false, // 循环,
                        duration: 500, easing: 'easeCubic', callback: null, delay: 0
                    }) // 2
                    
                 
                }
            },
            draw(cfg, group) {
                // debugger;
                // 如果 cfg 中定义了 style 需要同这里的属性进行融合
                // const keyShape = group.addShape('path', {
                //     attrs: {
                //         path: this.getPath(cfg), // 根据配置获取路径
                //         stroke: cfg.color || '#777' // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
                //         ,fill:'#990'
                //     }
                // });
                let stroke = cfg.stroke || this.getDefaultCfg().defaultStroke;
                
                const linePath=this.getPath(cfg)
                const keyShape =group.addShape('path', {
                    attrs: {
                      //fill:cfg.fill|| 'red',
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowColor: '#111',
                      shadowBlur: 0,
                      opacity: 0.8,
                      lineAppendWidth:2,
                      stroke:stroke,
                      path: linePath,
                      endArrow:true,

                    }
                  })

                 const d = keyShape.getBBox();
                 const l=[10,5];

                const model = cfg;//item.getModel();

                // group.addShape("image", {
                //   attrs: {
                //     x: -15,
                //     y: -25,
                //     width: 30,
                //     height: 30,
                //     img: model.icon
                //   }
                // });
               
                
                const start =cfg.startPoint;
                const end = cfg.endPoint;
        
             
                const angle = Math.atan((end.y - start.y) / (end.x - start.x))




               // debugger;
                if (model.label) {
                    try {


                        let labels = [];
                        let sizeinRow = 10;//一行6个字 ，最多显示3行
                        let index = 0;
                        for (index = 0; index < 3; index++) {
                            if (model.label.length > (index + 1) * sizeinRow)
                                labels.push(model.label.substr(index * sizeinRow, sizeinRow));
                            else {
                                if (index == 0)
                                    labels.push(model.label);

                                break;

                            }

                        }

                        if (model.label.length > 18)
                            labels[2] = labels[2] + '...';

                     
                            let labelPositon={x:d.minX+ (d.maxX - d.minX)/2,y:d.minY+ (d.maxY-d.minY)/2+ (labels.length === 1 ? 0 : 15 * (0 - 1))}
                            try {
                                labelPositon= Util.getLabelPosition(keyShape,0.5,0,0,false);    
                            } catch (error) {
                                //debugger;
                               // console.log(error);
                            }
                            

                        for (let index2 = 0; index2 < labels.length; index2++) {
                            const txt = labels[index2];
                         
                         
                        
                            
//   group.addShape('circle', {
//                                 attrs: {
                                
//                                     x: labelPositon.x ,
//                                     y: labelPositon.y,
//                                     fill: 'green',
//                                     shadowOffsetX: 0,
//                                     shadowOffsetY: 0,
//                                     shadowColor: '#111',
//                                     shadowBlur: 0,
//                                     opacity: 0.8,
//                                     stroke:'red',
                                 
//                                     r:5,
//                                 }
//                             });
                         
                            const lineshape=group.addShape('text', {
                                attrs: {
                                    text: txt,
                                    x:labelPositon.x,//  d.minX+ (d.maxX - d.minX)/2,
                                    y:labelPositon.y,// d.minY+ (d.maxY-d.minY)/2+ (labels.length === 1 ? 0 : 15 * (index2 - 1)),
                                    textAlign: 'center',
                                    textBaseline: 'center',
                                    fill: 'black',
                                    fontSize: 11,
                                    fontWeight: 'bold',
                                    shadowColor: '#fff',
                                  
                                },
                            });

                            const dd = lineshape.getBBox();

                        

                            const rectshape= group.addShape('rect', {
                                attrs: {
                                    radius:5,
                                    x: dd.minX-l[0] ,
                                    y: dd.minY-l[1],
                                 // textAlign: 'center',
                                //  textBaseline: 'center',
                                  fill: stroke,
                                  fontSize: 11,
                                  fontWeight: 'bold',
                                  width: dd.maxX - dd.minX + l[0] + l[0],
                                  height: dd.maxY - dd.minY + l[1] + l[1]
                                },
                                
                              });

                              rectshape.rotateAtPoint(dd.minX+(dd.maxX-dd.minX)/2,dd.minY+(dd.maxY-dd.minY)/2, angle);
                          
                             // rectshape.rotateAtStart(angle);
            
                              
                            lineshape.toFront();
                           
                            lineshape.rotateAtStart(angle);
                        }
                    } catch (error) {

                    }
                }



                return keyShape;
            },
            // 返回菱形的路径
            getPath(item) {

                return getCustomerLine2Path(item);
              },
        });



        G6.registerNode('diamond2', {
            draw(cfg, group) {
                // debugger;
                // 如果 cfg 中定义了 style 需要同这里的属性进行融合
                const shape = group.addShape('path', {
                    attrs: {
                        path: this.getPath(cfg), // 根据配置获取路径
                        stroke: cfg.color || 'red' // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
                        ,fill:'#889'
                    }
                });
                if (cfg.label) { // 如果有文本
                    // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
                    // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
                    // style.text = cfg.label;
                    group.addShape('text', {
                        // attrs: style
                        attrs: {
                            x: 0, // 居中
                            y: 0,
                            textAlign: 'center',
                            textBaseline: 'middle',
                            text: cfg.label,
                            fill: '#666'
                        }
                    });
                }
                return shape;
            },
            // 返回菱形的路径
            getPath(cfg) {
                const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
                const width = size[0];
                const height = size[1];
                //  / 1 \
                // 4     2
                //  \ 3 /
                const path = [
                    ['M', 0, 0 - height / 2], // 上部顶点
                    ['L', width / 2, 0], // 右侧顶点
                    ['L', 0, height / 2], // 下部顶点
                    ['L', - width / 2, 0], // 左侧顶点
                    ['Z'] // 封闭
                ];
                return path;
            },
        });
    }, [])



    return (<>

    </>);
}

export default G6Line;
