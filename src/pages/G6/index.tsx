


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
import G6 from '@antv/g6';

import Dianode from "./components/node";
import Line from "./components/line";

import Behavior from "./components/behavior";
import { query, saveOrUpdate } from '@/services/grapicService';

import { connect, withRouter } from 'umi';
import { ConnectState } from '@/models/connect';
import DataLogTable from '@/components/MyCom/DataLogTable';
import { getTagColor, UpdateNodeTagColor, getNodeColor } from '../GraphicO/components/TagBar';

export interface G6PanelProps {
    qdata?: any;
}

const G6Panel: React.FC<G6PanelProps> = (props) => {
    const dvref = useRef();

    const [loaded, setloaded] = useState<boolean>(false);
    const [graph, setGraph] = useState<any>();

    const [curmod, setcurmod] = useState<any>();
    const [devent, setdevent] = useState<any>();

    const { qdata } = props;

    const graphRef = useRef();

    useEffect(() => {
        graphRef.current = graph;
    }, [graph]);

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


        //console.log(gdata)
        //  tgraph.data(dataori);
        tgraph.data(gdata);
        // tgraph.changeData(gdata);  // 读取 Step 2 中的数据源到图上
        tgraph.render();
        tgraph.changeData();
        tgraph.refresh();    // 渲染图

        setTimeout(() => {
            tgraph.findAll('node', node => {
                tgraph.setItemState(node, 'selected', false);
              
            });
           // message.info(tgraph.getZoom());
            tgraph.fitCenter();
     
            
        }, 50);



        //  tgraph.paint();

        // tgraph.setAutoPaint(true);
        // }, 50);
        // } catch{ };

        //}


    }



    const getContent = () => {

        // if(!loaded)
        // {

        //}

       // width:dvref.current.offsetWidth,height:dvref.current.offsetHeight

        //  setTimeout(() => {
        const graph = new G6.Graph({
            container: dvref.current,  // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
            width: dvref.current.offsetWidth,              // Number，必须，图的宽度
            height: dvref.current.offsetHeight             // Number，必须，图的高度,
            ,
            animate: true,
           // fitView:true,
            modes: {
                // 定义的 behavior 指定到这里，就可以支持Behavior中定义的交互  'drag-node'
                default: ['activate-node', 'node-moveinout', 'drag-canvas', 'auto-refresh', 'phayicalnode',],
                readonly: ['activate-node', 'node-moveinout']
            }
        });

        graph.on("node:drag", (e) => {

            // debugger;
           // const graph = this.graph;
            const cnode = e.item;
            const cmode = cnode.getModel();

            setcurmod(cmode);
            setdevent(e);

        });




        // graph.data(dataori);  // 读取 Step 2 中的数据源到图上
        //   graph.render();    // 渲染图
        // }, 50);

        setGraph(graph);


        //if( graphRef.current)
        loadData(graph);

    

    }

    useEffect(() => {
     

        var el = dvref.current;// document.querySelector('.editorContent2');
        riseze(el, (val, oldVal) => {
          // console.log(`size changed！new: ${JSON.stringify(val)}, old: ${JSON.stringify(oldVal)}`);
    
          const { graphicModel } = props;
    
          cacluePanelSize(dvref.current, val);
        });

        getContent();

      //  message.info("1")

     
    }, [])

    // useEffect(()=>{
    //     if( graphRef.current)
    //     loadData( graphRef.current);
    // },[qdata])


    const onWheelHander=(e)=>{
        
        let zoom= graph.getZoom();
        e.preventDefault();
        if (e.nativeEvent.deltaY <= 0) {
            /* scrolling up */
          //  if(ele.scrollTop <= 0) {

           if(zoom>=1)
                zoom+=1;
                else  if(zoom<1)
                    zoom+=0.1;

                graph.zoom(zoom);

        
             // console.log(scrolling up)
           // }
          } 
          else
          {


            if(zoom>=2)
            zoom-=1;
            
            else if(zoom>0.1)
                zoom-=0.1;


            graph.zoom(zoom);

            /* scrolling down */
            //if(ele.scrollTop + ele.clientHeight >= ele.scrollHeight) {
              e.preventDefault();
             // console.log(scrolling down)
          //  }
          }
    }

    const cacluePanelSize=(editorContent2,val)=>{
       // debugger;
        const width=20;
        editorContent2.querySelector("canvas").width = val.width - width;
        editorContent2.querySelector("canvas").style.width = (val.width - width) + "px";

        editorContent2.querySelector("canvas").height = val.height -10;
        editorContent2.querySelector("canvas").style.height = (val.height - 10) + "px";
  
     
    }

    const load=()=>{
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

        <div style={{float:'left',position: "absolute"}}>
            <div>label:{curmod ? curmod.label : '-'}</div>
            <div>mdoelx:{curmod ? curmod.x : '-'}</div>
            <div>mdoelxy:{curmod ? curmod.y : '-'}</div>
            <div>x:{devent ? devent.x : '-'}</div>
            <div>y:{devent ? devent.y : '-'}</div>
        </div>
        <div   style={{width:'100%',height:'100vh'}} ref={dvref}  >
            <Dianode />
            <Line />
            <Behavior />


        </div>
    </>);
}


export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withRouter(G6Panel));

