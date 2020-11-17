



import React, { useState, useRef, cloneElement, useEffect } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Row, Input, Col, Avatar, Spin } from "antd";
import QueueAnim from 'rc-queue-anim';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { MyEditObj } from '../ModifyList/data';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';

import { deepClone, isnull } from '@/utils/utils';
import _, { random } from 'lodash';
import EditMainPanel from '../GraphicO/index';
import '../index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/logo.svg';
import EntitySelect from '@/components/MyCom/EntitySelect';
import G6 from '@antv/g6';
import { getCustomerLine2Path } from './line';


//获取指定节点周边可用的nums 个环绕成圆形的坐标点
export const getAllPostionsByCircle = (graph, x, y, r, nums) => {
  const pts = [];

  for (let index = 0; index < nums; index++) {
    const angle = ((360 / nums) * index) * Math.PI / 180;

    const newx = x + Math.cos(angle) * r;
    const newy = y + Math.sin(angle) * r;

    pts.push({ x: newx, y: newy })
  }

  return pts;
}

const G6Behavior: React.FC<{}> = (props) => {


  //节点动画列表 集合
  const [alist, setAlist] = useState<any>({});

  const [dragstartx, SetDragstartx] = useState<>({});

  const[dargId,SetdragId]=useState<string>("");
  const[timeoutId,setTimeoutId]=useState<any>();

  const timeoutIdRef=useRef();
  const dragstartxRef = useRef();
  const dragIdRef=useRef();

  useEffect(()=>{
    timeoutIdRef.current=timeoutId;
  },[timeoutId])

  useEffect(()=>{
    dragIdRef.current=dargId;
  },[dargId]);

  useEffect(() => {
    dragstartxRef.current = dragstartx;
  }, [dragstartx]);



  const alistRef = useRef();

  useEffect(() => {
    alistRef.current = alist;
  }, [alist]);


  useEffect(() => {

    setInterval(() => {

      if (!alistRef.current)
        return;


      const keys = Object.keys(alistRef.current);
      keys.forEach(key => {

        let animatelist = alistRef.current[key];

        if (animatelist && animatelist.length > 0) {

          // debugger;
          const animateconfig = animatelist[0];

          const { stopnow, graph, node, xdis, ydis, duration, delay, callback } = animateconfig;

          allaimate(false, graph, node, xdis, ydis, duration, delay, getAnimateCallBack(0, animatelist));

          alistRef.current[key] = [];

          setAlist(alistRef.current)

        }
      });


    }, 200);

    //同一对象一个动画，在回调中增加后续动画，递归回调
    const getAnimateCallBack = (index, animatelist) => {
      if (index >= animatelist.length)
        return null;


      const animateconfig = animatelist[index];

      const { callback } = animateconfig;

      return () => {
        if (callback)
          callback();

         // debugger;
        const animateconfig2 = animatelist[index + 1];
        if (!animateconfig2)
        return null;
        const {  graph, node, xdis, ydis, duration, delay } = animateconfig2;
        allaimate(false, graph, node, xdis, ydis, duration, delay, getAnimateCallBack(index + 1, animatelist));
      }

    }

    const nodeaimate = (stopnow, graph, node, xdis, ydis, duration, delay, callback) => {
      const nodemodel = node.getModel();

      try {


        //if (node.getContainer() && node.getContainer().get("children")) {
        node.getContainer().get("children").forEach(element => {
          //  if (stopnow)
          //element.stopAnimate()

          element.animate(
            ratio => {

              return {
                x: xdis * ratio,
                y: ydis * ratio,
                //   fill:'red',
              }
            }

            // {
            //   x:xdis,
            //   y:ydis,
            //   fill:'red'
            // }


            , {
              repeat: false, easing: 'easeLinear', duration: duration, delay: delay, callback: () => {
                // nodemodel.x = nodemodel.x + xdis
                //  nodemodel.y = nodemodel.y + ydis
                //  graph.update(node, nodemodel);
                //  console.log( nodemodel.x+"/"+nodemodel.y)

                //节点更新了多次，位置不准
                if (callback)
                  callback();
              }
            }
          );
        });
        // }
      } catch (error) {

      }
    }

    const edgeaimate = (stopnow, graph, node, isInEdge, edge, xdis, ydis, duration, delay,callback) => {
      const edgemodel = edge.getModel();
      const nodemodel = node.getModel();

      const ept = edgemodel.endPoint;
      const spt = edgemodel.startPoint;
      // debugger;
      // debugger;
      // if (stopnow)
      edge.getContainer().get("children")[0].stopAnimate()

      edge.getContainer().get("children")[0].animate(
        (ratio: number) => {

          if (isInEdge) {
            edgemodel.endPoint = {
              x: ept.x + xdis * ratio,
              y: ept.y + ydis * ratio,
            }
          }
          else {
            edgemodel.startPoint = {
              x: spt.x + xdis * ratio,
              y: spt.y + ydis * ratio,
            }
          }

          const path = getCustomerLine2Path(edgemodel);


          return {
            // stroke: 'red',
            path: path
          }
        }

        , {
          repeat: false, easing: 'easeLinear', duration: duration, delay: delay, callback: () => {
            nodemodel.x = nodemodel.x + xdis
            nodemodel.y = nodemodel.y + ydis
            graph.update(node, nodemodel);

            if (callback)
            callback();
          }
        }
      );
    }

    const allaimate = (stopnow, graph, node, xdis, ydis, duration, delay, callback) => {

      const model = node.getModel();
    //  console.log("model:" + model.label + " xdis:" + xdis + " ydis:" + ydis + " duration:" + duration + " delay:" + delay);

      nodeaimate(stopnow, graph, node, xdis, ydis, duration, delay, null);


      // return;
      const Inedges = node.getInEdges();
      Inedges.forEach(edge => {
        edgeaimate(stopnow, graph, node, true, edge, xdis, ydis, duration, delay,callback)
      });

      const Outedges = node.getOutEdges();
      Outedges.forEach(edge => {
        edgeaimate(stopnow, graph, node, false, edge, xdis, ydis, duration, delay,callback)
      });
      // for (let index = 0; index < 15; index++) {
      //   this.nodeaimate(graph,node,random(10),random(10),300,300*index);
      // }
    }





    //节点碰撞
    G6.registerBehavior('phayicalnode', {
      getDefaultCfg() {
        return {
          multiple: true
        };
      },
      getEvents() {
        return {
          'node:dragstart': 'onNodeDragStart',
          'node:drag': 'onNodeDrag',
          'node:dragend': 'onNodeDragEnd',
          'node:dblclick': 'onDbClick',
          'afterupdateitem': 'AfterUpdateItem',
        };
      },
      AfterUpdateItem(e) {
        const graph = this.graph;
        const cnode = e.item;
        //message.info("updated");
        if (cnode) {
          // debugger;
          //  this.disAdapter(graph,cnode,0);
        }

      },
      onDbClick(e) {
        const graph = this.graph;
        const cnode = e.item;

        graph.setItemState(cnode, 'selected', false);


        // allaimate(false, graph, cnode, random(20,60), random(-20, 30), 250, 1000, () => { message.info("donemove") });
        // allaimate(false, graph, cnode, random(20,60), random(-20, 30), 250, 1000, () => { message.info("donemove") });
        // allaimate(false, graph, cnode, random(20,60), random(-20, 30), 250, 1000, () => { message.info("donemove") });

        // this.addallaimate(true, graph, cnode, random(20,60), random(-20, 30), 250, 0, () => { message.info("donemove") });
        this.addallaimate(true, graph, cnode, random(20, 60), random(-20, 30), 250, 100, () => { });
        this.addallaimate(true, graph, cnode, random(20, 60), random(-20, 30), 250, 50, () => { });
        this.addallaimate(true, graph, cnode, random(20, 60), random(-20, 30), 250, 30, () => { });
        this.addallaimate(true, graph, cnode, random(20, 60), random(-20, 30), 250, 200, () => { });
        this.addallaimate(true, graph, cnode, random(20, 60), random(-20, 30), 250, 100, () => { });


        //  this.addallaimate(true, graph, cnode, random(20,40), random(-20, 30), 150, 0, () => { message.info("donemove") });

      },
      onNodeDragStart(e) {
        //     debugger;
        const graph = this.graph;
        const cnode = e.item;
        const cmode = cnode.getModel();
        cmode.dragStartx = cmode.x;
        cmode.dragStarty = cmode.y;


        let sx = { x: e.x, y: e.y }
        SetDragstartx(sx);

        SetdragId(cmode.id);
      //  debugger;

        // const item = e.item;

        // if (!item || item.destroyed || item.hasLocked()) {
        //   return;
        // } // 拖动时，设置拖动元素的 capture 为false，则不拾取拖动的元素
    
    
        // const group = item.getContainer();
        // group.set('capture', false); // 如果拖动的target 是linkPoints / anchorPoints 则不允许拖动
    
        // const target = e.target;
    
        // if (target) {
        //   const isAnchorPoint = target.get('isAnchorPoint');
    
        //   if (isAnchorPoint) {
        //     return;
        //   }
        // }

        
        //点击固定，不跟随移动
       // const model = item.getModel();
      

        // graph.layout();
        //cnode.update(cmode)
        //  cnode.attr('dargStarty',cmode.y);

         // graph.update(cnode, cmode);
      },
      //跟随移动
      walkby(usequeue, stopnow, e, graph, cnode) {

        const cmode = cnode.getModel();


        // debugger;
        //  let ydis = cmode.y -dragstartxRef.current.y;//  cmode.dragStarty;
      //  let xdis = cmode.x -dragstartxRef.current.x;// cmode.dragStartx;

        let ydis = cmode.y - cmode.dragStarty;
        let xdis = cmode.x - cmode.dragStartx;

        if (Math.abs(ydis) > 5 || Math.abs(xdis) > 5) {
        //  console.log(xdis + "/" + ydis);
        }

        // if (ydis < 0)
        //   ydis += random(-5, -2);
        // else
        //   ydis += random(4, 6);

        // if (xdis < 0)
        //   xdis += random(-5, -2);
        // else
        //   xdis += random(3, 5);

        let duration = 20;
        if (Math.abs(ydis) > 1 || Math.abs(xdis) > 1)
          duration = 10; //移动距离越大，移动跟随越快

        let nodes = this.getLevelOneNodes(cnode);

        nodes.forEach(snode => {

          const nodemodel = snode.getModel();

          if (this.shouldMove(snode)) {

            if (!usequeue) {
              ///直接动画
              // ydis = cmode.y - dragstartxRef.current.y;
              // xdis = cmode.x - dragstartxRef.current.x;
      
              //   if (Math.abs(ydis) > 1 || Math.abs(xdis) > 1)
              allaimate(true, graph, snode, xdis, ydis, duration, 0, () => {
                // // this.disAdapter(graph,cnode,200);
              });
            }


            else {
              //队列

           //   console.log("allaimate" + xdis + "/" + ydis);
              let ndis = Math.sqrt((nodemodel.x - cmode.x) * (nodemodel.x - cmode.x) + (nodemodel.y - cmode.y) * (nodemodel.y - cmode.y))

              const dis = random(400, 450);


              let destpt = null;


              this.addallaimate(stopnow, graph, snode, xdis, ydis, duration, 10, () => {
                // // this.disAdapter(graph,cnode,200);
              });
            }


          }


        });

        cmode.dragStarty = cmode.y;
        cmode.dragStartx = cmode.x;
       // let sx = { x: cmode.x, y: cmode.y }
      //  SetDragstartx(sx);

      },


      //获取离当前坐标点最近的一个未使用的坐标
      getPostionInCircle(graph, pts, curx, cury, cur) {
        let angle = 0 * Math.PI / 180;

        let mindis = null;
        let minindex = -1;
        for (let index = 0; index < pts.length; index++) {
          const pt = pts[index];
          const curindex = _.cloneDeep(index);
          if (pt.used)
            continue;


          // debugger;
          const ndis = Math.sqrt((pt.x - curx) * (pt.x - curx) + (pt.y - cury) * (pt.y - cury));
          if (!mindis) {
            mindis = ndis;
            minindex = curindex;
          }
          else {
            if (ndis < mindis) {
              mindis = ndis;
              minindex = curindex;
            }
          }
        }

        if (minindex !== -1) {
          pts[minindex].used = true;

      
          return pts[minindex];
        }
        return null;

      },
      getLevelOneNodes(cnode) {
        let nodes = [];
        const Outedges = cnode.getOutEdges();
        Outedges.forEach(edge => {

          const snode = edge.getTarget();
          const enode = _.find(nodes, (item) => {
            return item.getModel().id === snode.getModel().id
          })
          if (!enode)
            nodes.push(snode);
        })
        const Inedges = cnode.getInEdges();
        Inedges.forEach(edge => {

          const snode = edge.getSource();
          const enode = _.find(nodes, (item) => {
            return item.getModel().id === snode.getModel().id
          })
          if (!enode)
            nodes.push(snode);
        })
        return nodes;
      },
      getAllNodes(graph) {
        let nodes = [];
        graph.findAll('node', snode => {
          nodes.push(snode);
        })
        return nodes;
      },
      /**一层节点位置调整为圆形环绕 */
      disAdapterToCircle(graph, cnode, delay) {


        const cmode = cnode.getModel();



        let curNodeindex = 0;

        let nodes = this.getLevelOneNodes(cnode);

        const canmovenums = _.filter(nodes, snode => {
          return this.shouldMove(snode)
        });

        const allpts = getAllPostionsByCircle(graph, cmode.x, cmode.y, 270, canmovenums.length);
       // console.log(allpts);
        let duration = 150;
        let i = 0;

        const ptnodes = graph.findAll('node', item => {
          return item.getModel().stype === 'pt'
        });

        if (ptnodes)
          ptnodes.forEach(element => {
            graph.remove(element);
          });

        nodes.forEach(snode => {
          const smode = snode.getModel();
          if (smode.id !== cmode.id && this.shouldMove(snode)) {

            const pt = this.getPostionInCircle(graph, allpts, smode.x, smode.y, i);

            // graph.add('node', {
            //   // String，该节点存在则必须，节点的唯一标识
            //   x: pt.x,      // Number，可选，节点位置的 x 值
            //   y: pt.y       // Number，可选，节点位置的 y 值
            //   , type: 'custom-node-circle'
            //   , label: pt.x+'/'+pt.y,
            //   stype: 'pt',
            //   size:5,
            // });

            // graph.add('node', {
            //   // String，该节点存在则必须，节点的唯一标识
            //   x: smode.x,      // Number，可选，节点位置的 x 值
            //   y: smode.y       // Number，可选，节点位置的 y 值
            //   , type: 'custom-node-circle'
            //   , label: 'old',
            //   stype: 'pt',
            //   size:10,
            // });




            if (pt) {

              const destpt = {
                x: pt.x - smode.x,
                y: pt.y - smode.y
              }


              //计算目标位置 ，及需要移动的差值
              const xdis = destpt.x;
              const ydis = destpt.y;
              this.addallaimate(false, graph, snode, xdis, ydis, duration, delay, () => {
               
              });

            }

            i++;
          }
        });

        setTimeout(() => {
          this.runAwayAll(graph);
        }, duration+delay+10);



      },

      checkPt(){

      },

      //节点拖拽或者加载完成后，一层 节点距离自适应调整，调整的为一层节点数据
      disAdapter(graph, cnode, delay) {

        const cmode = cnode.getModel();

        let curNodeindex = 0;

        let nodes = this.getLevelOneNodes(cnode);

        let duration = 50;
        nodes.forEach(snode => {
          const smode = snode.getModel();
          if (smode.id !== cmode.id && this.shouldMove(snode)) {



            let ndis = Math.sqrt((smode.x - cmode.x) * (smode.x - cmode.x) + (smode.y - cmode.y) * (smode.y - cmode.y))

            const dis = random(400, 450);
            const mindis = 180;

            let destpt = null;

            if (ndis > dis) {
              // let destpt =this.getPostionInCircle(graph,cmode.x,cmode.y,180,edges.length,curNodeindex);

              destpt = {
                x: (ndis - dis) / ndis * (cmode.x - smode.x),
                y: (ndis - dis) / ndis * (cmode.y - smode.y)
              }

              duration = 20 + 30 * (ndis - dis) / dis;
            }
            else if (ndis < mindis) {

              // debugger;
              destpt = {
                x: (ndis - mindis) / ndis * (cmode.x - smode.x),
                y: (ndis - mindis) / ndis * (cmode.y - smode.y)
              }

              duration = 20 + 30 * (mindis - ndis) / mindis;
            }


            if (destpt) {
              //计算目标位置 ，及需要移动的差值
              const xdis = destpt.x;
              const ydis = destpt.y;
              this.addallaimate(false, graph, snode, xdis, ydis, duration, delay, () => {
                //allaimate(true, graph, snode, xdis, ydis, duration, delay, () => {
                //递归继续调整关联距离：


                //  this. disAdapter(graph, snode,delay) ;  
                // this.disCheck(graph);
              });

            }
            // else
            //  this.disCheck(graph);


            curNodeindex++;
          }


        });



      },
      //全部节点距离自适应调整，调整的为本身节点
      disCheck(graph) {




        let curNodeindex = 0;

        let nodes = this.getAllNodes(graph);

        const delay = 10;

        for (let index = 0; index < nodes.length; index++) {


          this.disAdapter(graph, nodes[index], delay);

        }



      },
      //检查目标节点是否已经固定
      shouldMove(targetnode) {
        const nodemodel = targetnode.getModel();
        if (nodemodel.moveType === "checked")
          return false

        return true;
      },
      //碰撞，
      runaway(usequeue, stopnow, graph, cnode, node, dis: number) {

        // debugger;
        const cmode = cnode.getModel();
        const nodemodel = node.getModel();

        //当前拖动的节点不动画
        if(nodemodel.id===  dragIdRef.current)
        {
        //  console.log("cur node not move");
        return;
      }

        const angle = Math.atan((cmode.y - nodemodel.y) / (cmode.x - nodemodel.x))

        const anglePI = (180 * (angle) / Math.PI); //-1,1    1:0 ,0:90,-1:180

        let xdirect = 1;
        let ydirect = 1;


        if (cmode.y >= nodemodel.y && cmode.x >= nodemodel.x) {
          xdirect = -1;//第4象限;
          ydirect = -1;
        }
        if (cmode.y >= nodemodel.y && cmode.x <= nodemodel.x) {
          xdirect = 1;//第3象限;
          ydirect = -1;
        }
        if (cmode.y <= nodemodel.y && cmode.x >= nodemodel.x) {
          xdirect = -1;//第1象限;
          ydirect = 1;
        }
        if (cmode.y <= nodemodel.y && cmode.x <= nodemodel.x) {
          xdirect = 1;//第2象限;
          ydirect = 1;
        }



        let ydis = ydirect * Math.abs(Math.sin(angle)) * dis;
        let xdis = xdirect * Math.abs(Math.cos(angle)) * dis;

        if(isNaN(ydis))
        ydis=random(30,40);
        
        if(isNaN(xdis))
        xdis=random(30,40);

        let ndis = Math.sqrt((nodemodel.x - cmode.x) * (nodemodel.x - cmode.x) + (nodemodel.y - cmode.y) * (nodemodel.y - cmode.y))
        //  console.log(nodemodel.label + ":" + ndis);
        if (ndis < 130) {
          //    console.log(nodemodel.label + " -----dis enter! ----------");

          //计算当前节点移动方向，目标节点按该行进方向运动

          //  debugger;

          const duration = 40 + 80 / ndis;
          try {

            if (usequeue)
              this.addallaimate(stopnow, graph, node, xdis, ydis, duration, 0);
            //allaimate(stopnow, graph, node, xdis, ydis, duration, 0);
            else {
              allaimate(stopnow, graph, node, xdis, ydis, duration, 0);

            }




          } catch (error) {
            console.log("node phayicalnode animate error:" + error)
          }
        }
      },

      //添加动画队列
      addallaimate(stopnow, graph, node, xdis, ydis, duration, delay, callback) {

        const model = node.getModel();

        let clist = alist;

        let array = [];
        if (!clist[model.id]) {
        }
        else
          array = clist[model.id];


        array.push({
          stopnow: stopnow, graph: graph, node: node, xdis: xdis, ydis: ydis, duration: duration, delay: delay, callback: callback
        });

        clist[model.id] = array;

        setAlist(clist);

      },


      runAwayAll(graph) {

        const nodes = this.getAllNodes(graph);

        nodes.forEach(cnode => {
          const cmode = cnode.getModel();


          //碰撞
          graph.findAll('node', node => {

            const nodemodel = node.getModel();
            //检查及其他节点与当前拖动节点距离，是否过小，过小，直接动画移动躲开
            const dis = 15;
            if (nodemodel.id !== cmode.id && this.shouldMove(node)) {
              this.runaway(false, false, graph, cnode, node, dis);
            }

          });

        });
      },

      onNodeDragEnd(e) {
        const graph = this.graph;
        const cnode = e.item;
        const cmode = cnode.getModel();

    
        //this.disAdapter(graph, cnode, 20);

     

       cmode.moveType = "checked";
        graph.update(cnode, cmode);



        setTimeout(() => {
          this.disAdapterToCircle(graph, cnode, 10)

        }, 230);


      },

      onNodeDrag(e) {

        // debugger;
        const graph = this.graph;
        const cnode = e.item;
        const cmode = cnode.getModel();

        let ydis = e.y -dragstartxRef.y;
        let xdis = e.x - dragstartxRef.x ;

       // cmode.x=e.x;
        //cmode.y=e.y;
        
     

        graph.updateItem(cnode, {x:e.x,y:e.y}, false);

       // this.addallaimate(false, graph, cnode, xdis, ydis, 10, 10, () => {
       
       // });

       
        //碰撞
        graph.findAll('node', node => {

          const nodemodel = node.getModel();
          //检查及其他节点与当前拖动节点距离，是否过小，过小，直接动画移动躲开
          const dis = 35;
          if (nodemodel.id !== cmode.id && this.shouldMove(node)) {
           //this.runaway(false, false, graph, cnode, node, dis);
          }

        });

         this.runAwayAll(graph);
        //跟随
        this.walkby(true, false, e, graph, cnode);


        clearTimeout(timeoutIdRef.current);
        const timeid=setTimeout(() => {
          this.disAdapterToCircle(graph, cnode, 10)
        }, 500);
        setTimeoutId(timeid);


      }

    });


    G6.registerBehavior('auto-refresh', {
      getDefaultCfg() {
        return {
          multiple: true
        };
      },
      getEvents() {
        return {
          'canvas:dragend': 'onCanvasDragend',

        };
      },
      onCanvasDragend(e) {
        const graph = this.graph;
        // console.log('rendered!')
      //  graph.paint();
       // graph.refresh();

      },

    });


    G6.registerBehavior('activate-node', {
      getDefaultCfg() {
        return {
          multiple: true
        };
      },
      getEvents() {
        return {
          'node:click': 'onNodeClick',
          'canvas:click': 'onCanvasClick',
          'edge:click': 'onNodeClick',
        };
      },
      onNodeClick(e) {
        const graph = this.graph;
        const item = e.item;
        if (item.hasState('selected')) {
          //graph.setItemState(item, 'selected', false);
          return;
        }
        // this 上即可取到配置，如果不允许多个active，先取消其他节点的active状态
        // if (!this.multiple) {
        this.removeNodesState(graph);

        graph.setItemState(item, 'clicked', true);
        setTimeout(() => {
          graph.setItemState(item, 'clicked', false);
        }, 30);
        
        // }
        // 置点击的节点状态为active
        graph.setItemState(item, 'selected', true);

        //点击固定，不跟随移动
        const model = item.getModel();
        model.moveType = "checked";
        graph.update(item, model);

      },
      onCanvasClick(e) {
        //  console.log('click');
        const graph = this.graph;
        // shouldUpdate可以由用户复写，返回 true 时取消所有节点的active状态
        // if (this.shouldUpdate(e)) {
        this.removeNodesState(graph);
        //}
      },

      removeNodesState(graph) {
        //const graph = this.graph;
        // graph.findAll('node').forEach(node => {
        //     graph.setItemState(node, 'selected', false);
        //   });

        graph.findAll('node', node => {
       //   graph.setItemState(node, 'clicked', false);
          graph.setItemState(node, 'selected', false);
        });
        graph.findAll('edge', node => {
          graph.setItemState(node, 'selected', false);
        });

      }
    });


    G6.registerBehavior('node-moveinout', {
      getDefaultCfg() {
        return {
          multiple: true
        };
      },
      getEvents() {
        return {
          'node:mouseenter': 'onMouseEnter',
          'node:mouseleave': 'onMouseLeave',

          'edge:mouseenter': 'onMouseEnter',
          'edge:mouseleave': 'onMouseLeave'

        };
      },
      onMouseEnter(e) {
        const graph = this.graph;
        const node = e.item;


        graph.setItemState(node, 'running', true);


      },
      onMouseLeave(e) {
        const graph = this.graph;
        const node = e.item;


        graph.setItemState(node, 'running', false);


      },

    });


  }, [])



  return (<>

  </>);
}

export default G6Behavior;
