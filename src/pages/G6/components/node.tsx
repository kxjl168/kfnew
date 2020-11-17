



import React, { useState, useRef, cloneElement, useEffect } from 'react';


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
import G6, { Util } from '@antv/g6';
import circleimg from '../../../assets/circle.png';
import { getAllPostionsByCircle } from './behavior';
import { itemIntersectByLine } from '@antv/g6/lib/util/math';

const G6Node: React.FC<{}> = (props) => {


    useEffect(() => {



        G6.registerNode('custom-node-circle', {
            getDefaultCfg() {
                return {
                    defaultR: 30,
                    defaultTextColor: '#222',
                    selectColor: GetRandomLightColor('#0f0', 80)
                }
            },
            showainmate(back1, back2, back3, r) {

                // // 第一个背景圆逐渐放大，并消失
                // back1.animate({
                //     r: r + 20,
                //     opacity: 0.1,

                // }, {
                //     repeat: true, // 循环,
                //     duration: 1000, easing: 'easeCubic', callback: null, delay: 0
                // }) // 2



                // // 第二个背景圆逐渐放大，并消失
                // back2.animate({
                //     r: r + 20,
                //     opacity: 0.1,

                // }, {
                //     repeat: true, // 循环,
                //     duration: 1000, easing: 'easeCubic', callback: null, delay: 500
                // }) // 2 秒延迟


                back3.attr('opacity', 1);
                // 第三个背景圆逐渐放大，并消失
                // 第三个背景圆逐渐放大，并消失
                back3.animate({

                    onFrame(ratio) {
                        // 旋转通过矩阵来实现
                        // 当前矩阵
                        const matrix = Util.mat3.create();
                        // 目标矩阵
                        const toMatrix = Util.transform(matrix, [
                            ['r', ratio * Math.PI * 2]
                        ]);
                        // 返回这一帧需要的参数集，本例中只有目标矩阵
                        return {
                            matrix: toMatrix
                        };
                    }
                }, {
                    repeat: true, // 循环,
                    duration: 1500, easing: 'easeLinear', callback: null, delay: 300
                }) // 2 秒延迟
            },
            // 设置状态
            setState(name, value, item) {
                //debugger;
                const group = item.getContainer();
                const shape = group.get('children')[3]; // 顺序根据 draw 时确定

                const cfg = item?.getModel();
                const back1 = group.get('children')[0];
                const back2 = group.get('children')[1];
                const back3 = group.get('children')[2];
                let r = (cfg.size || this.getDefaultCfg().defaultR);

                const textshapes = group.findAll(function (item) {
                    return item.attr('stype') === "text";       // 获取所有id小于10的元素
                })

                let textcolor = (cfg.textColor || this.getDefaultCfg().defaultTextColor);


                if (name === 'clicked') {
                    if(value)
                    {
                        back1.animate({
                            r: r + 20,
                            opacity: 0.1,

                        }, {
                            repeat: false, // 循环,
                            duration: 100, easing: 'easeCubic', callback: () => {

                                back1.attr("r", r + 20);

                                back1.animate({
                                    r: r + 10,
                                    opacity: 0.1,

                                }, {
                                    repeat: false, // 循环,
                                    duration: 200, easing: 'easeCubic', callback: () => {
                                        back1.attr("r", r);

                                        
                                     

                                    }, delay: 0
                                }) // 2

                            },
                            delay: 0,

                        });
                    }
                  
                }

                if (name === 'selected') {
                    if (value) {
                        //debugger;
                        if(!shape.attr('orifill'))
                        shape.attr('orifill', shape.attr('fill'));


                        shape.attr('fill', this.getDefaultCfg().selectColor);
                        // debugger;
                        textshapes.forEach(tshape => {
                            tshape.attr('fill', 'white');
                        })



                       if (item.hasState('selected')) {
                           this.showainmate(back1, back2, back3, 3);
                       }
                       else {
                            // 第一个背景圆逐渐放大，并消失
                            back1.animate({
                                r: r + 20,
                                opacity: 0.1,

                            }, {
                                repeat: false, // 循环,
                                duration: 100, easing: 'easeCubic', callback: () => {

                                    back1.attr("r", r + 20);

                                    back1.animate({
                                        r: r + 10,
                                        opacity: 0.1,

                                    }, {
                                        repeat: false, // 循环,
                                        duration: 200, easing: 'easeCubic', callback: () => {
                                            back1.attr("r", r);

                                            this.showainmate(back1, back2, back3, 3);


                                        }, delay: 0
                                    }) // 2

                                },
                                delay: 0,

                            });
                        }



                    } else {
                        textshapes.forEach(tshape => {
                            tshape.attr('fill', textcolor);
                        })
                       
                        shape.attr('fill', shape.attr('orifill'));
                        back1.stopAnimate();
                        back2.stopAnimate();
                        back3.stopAnimate();
                        back1.attr('r', r);
                        back2.attr('r', r);
                        back3.attr('opacity', 0);

                    }
                }

                if (name === 'running') {
                    if (value) {
                        shape.animate({
                            r: r + 2,

                        }, { repeat: false, duration: 100 }
                        );
                    } else {
                        shape.animate({
                            r: r,
                        }, { repeat: false, duration: 100 }
                        );

                        //shape.stopAnimate();
                        //shape.attr('r', 30);
                    }
                }
            },
            afterDraw(cfg, group) {
                let r = (cfg.size || this.getDefaultCfg().defaultR);

                //   if (isNaN(r)) {
                //     r = cfg.size[0] / 2;
                //   };
                // 第一个背景圆
                const back1 = group.addShape('circle', {
                    zIndex: -3,
                    attrs: {
                        x: 0,
                        y: 0,
                        r,
                        fill: cfg.color || '#aaa',
                        opacity: 0.6
                    }
                });
                // 第二个背景圆
                const back2 = group.addShape('circle', {
                    zIndex: -2,
                    attrs: {
                        x: 0,
                        y: 0,
                        r,
                        fill: 'blue', // 为了显示清晰，随意设置了颜色
                        opacity: 0.6
                    }
                });
                const imgwidth = 70;
                // 第三个背景圆
                const back3 = group.addShape('image', {
                    zIndex: -1,
                    attrs: {
                        x: -imgwidth / 2,
                        y: -imgwidth / 2,
                        width: imgwidth,
                        height: imgwidth,
                        img: circleimg,
                        opacity: 0,
                    }

                });
                group.sort(); // 排序，根据 zIndex 排序


                //帮助跳转
                // back1.animate({
                //     r: r + 20,
                //     opacity: 0.1,

                // }, {
                //     repeat: true, // 循环,
                //     duration: 1000, easing: 'easeCubic', callback: null, delay: 0
                // }) // 2

            },
            draw(cfg, group) {
                let r = (cfg.size || this.getDefaultCfg().defaultR);
                let textcolor = (cfg.textColor || this.getDefaultCfg().defaultTextColor);

                // debugger;
                // 如果 cfg 中定义了 style 需要同这里的属性进行融合
                // const keyShape = group.addShape('path', {
                //     attrs: {
                //         path: this.getPath(cfg), // 根据配置获取路径
                //         stroke: cfg.color || '#777' // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
                //         ,fill:'#990'
                //     }
                // });

                const keyShape = group.addShape('circle', {
                    attrs: {
                        fill: cfg.color || GetRandomLightColor(),
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: '#111',
                        shadowBlur: 0,
                        opacity: 0.8,
                        stroke: cfg.moveType === "checked" ? "red" : (cfg.stroke || '#777'),
                        x: 0,
                        y: 0,
                        r: r,

                    }
                })

                const d = keyShape.getBBox();
                const l = [0, 0, 1, 1];

                //   group.addShape('rect', {
                //     attrs: {
                //       
                //       x: d.minX - l[3],
                //       y: d.minY - l[0],
                //       textAlign: 'start',
                //       textBaseline: 'center',
                //       fill: '#fff',
                //       fontSize: 11,
                //       fontWeight: 'bold',
                //       width: d.maxX - d.minX + l[1] + l[3],
                //       height: d.maxY - d.minY + l[0] + l[2]
                //     },
                //   });


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

                // 绘制标签
                //  this.drawLabel(item);
                const x = -(model.width || 40) / 2;
                const y = -(model.height || 40) / 2;

                // debugger;
                if (model.label) {
                    try {


                        let labels = [];
                        let sizeinRow = 6;//一行6个字 ，最多显示3行
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

                        for (let index2 = 0; index2 < labels.length; index2++) {
                            const txt = labels[index2];
                            group.addShape('text', {
                                attrs: {
                                    draggable:false,
                                    text: txt,
                                    x: 0,
                                    y: (labels.length === 1 ? 0 : 15 * (index2 - 1)),
                                    textAlign: 'center',
                                    textBaseline: 'bottom',
                                    fill: textcolor,
                                    fontSize: 11,
                                    fontWeight: 'bold',
                                    shadowColor: '#fff',
                                    stype: 'text',//文字
                                },
                                zIndex:0
                            });
                        }
                    } catch (error) {

                    }
                }



                return keyShape;
            },

            /**
      * 获取控制点
      * @param  {Object} cfg 节点、边的配置项
      * @return {Array|null} 控制点的数组,如果为 null，则没有控制点
      */
            getAnchorPoints(cfg) {


                const pts = getAllPostionsByCircle(null, 0.5, 0.5, 0.5, 30);
                const ary = [];

                _.each(pts, pt => {
                    ary.push([pt.x, pt.y]);
                })
                return ary;

                // return  [            //上方顺时针
                //     [0.5, 0], // 上边中点
                //     [0.85, 0.15], // 上边右中点
                //     [1, 0.5], // 中线右边
                //     [0.85, 0.85], // 下边右中点
                //     [0.5, 1], // 底边中点
                //     [0.15, 0.85], // 下边左中点
                //     [0, 0.5], // 上边中点
                //     [0.15, 0.15], // 上边左中点
                // ]
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



        G6.registerNode('diamond2', {
            draw(cfg, group) {
                // debugger;
                // 如果 cfg 中定义了 style 需要同这里的属性进行融合
                const shape = group.addShape('path', {
                    attrs: {
                        path: this.getPath(cfg), // 根据配置获取路径
                        stroke: cfg.color || 'red' // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
                        , fill: '#889'
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

export default G6Node;
