import { Col, Row, Drawer, Button } from 'antd';
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, Children } from 'react';
import GGEditor, { Koni, RegisterCommand, withPropsAPI } from 'gg-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage, connect, withRouter, GraphicState } from 'umi';
import EditorMinimap from './components/EditorMinimap';
import { KoniContextMenu } from './components/EditorContextMenu';
import { KoniDetailPanel } from './components/EditorDetailPanel';
import { KoniItemPanel } from './components/EditorItemPanel';
import { KoniToolbar } from './components/EditorToolbar';
import SaveCmd, { AuditAction } from './cmd/SaveCmd';
import EditPro from './cmd/EditPro';
import ShowNodeRelationCmd from './cmd/ShowNodeRelationCmd';
import RefreshNodeCmd from './cmd/RefreshNodeCmd';
import CustomNodeFlow from './node/CustomNodeFlow';
import CustomNodeLRect from './node/CustomNodeLRect';
import { KoniPanel } from './components/KoniMain';
import './index.less';
import EditRelation from './cmd/EditRelation';
import EditCls from './cmd/EditCls';
import EditTag from './cmd/EditTag';
import TagBar from './components/TagBar';
import Fullscreen from './cmd/Fullscreen';
import CustomLine from './node/CustomLine';
import CustomLine2 from './node/CustomLine2';
import ShowNeo4j from './cmd/ShowNeo4j';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';

import KScroll from '@/components/MyCom/KScrollBar';
import { ConnectState } from '@/models/connect';
import { refreshAllColor } from './components/KoniMain/KoniPanel';


GGEditor.setTrackable(false);

//计算中间panel canvs 大小，缩放宽度
export const cancluePanelSize = (editorContent2, geditor, editorRef, graphicModel,showleft,showright) => {
  setTimeout(() => {

    try {

      let width = 500;
      let hleft = geditor.className.indexOf("hideleft")>-1;
      let hright = geditor.querySelector(".hideright");
      if (hleft ||!showleft)
        width -= 200;

      if (hright != null||!showright)
        width -= 280;


      // document.querySelector(".editorContent2").style.width =( document.querySelector(".geditor").offsetWidth - width-30)+"px";
      // document.querySelector(".graph-container").querySelector("canvas").width = document.querySelector(".geditor").offsetWidth - width;
      // document.querySelector(".graph-container").querySelector("canvas").style.width = (document.querySelector(".geditor").offsetWidth- width) + "px";

      // document.querySelector(".graph-container").querySelector("canvas").height = document.querySelector(".geditor").offsetHeight- 80;
      // document.querySelector(".graph-container").querySelector("canvas").style.height = (document.querySelector(".geditor").offsetHeight - 80) + "px";

      // setTimeout(() => {
      //   document.querySelector(".graph-container").querySelector("canvas")?.click();

      // }, 50);

      let widthval=30;


      editorContent2.style.width = (geditor.offsetWidth - width - widthval) + "px";
      editorContent2.querySelector(".graph-container").querySelector("canvas").width = geditor.offsetWidth - width;
      editorContent2.querySelector(".graph-container").querySelector("canvas").style.width = (geditor.offsetWidth - width) + "px";

      editorContent2.querySelector(".graph-container").querySelector("canvas").height = geditor.offsetHeight - 30;
      editorContent2.querySelector(".graph-container").querySelector("canvas").style.height = (geditor.offsetHeight - 30) + "px";

      //setTimeout(() => {
      //editorContent2.querySelector(".graph-container").querySelector("canvas")?.click();

      // editorRef.current.editor.getCurrentPage().getGraph().read(editorRef.current.editor.getCurrentPage().getGraph().save());  

      if (editorRef.current)
        refreshAllColor(editorRef.current.propsAPI, graphicModel);



      // }, 50);



    } catch (error) {
      console.log(error);
    }
  }, 20);
}

export interface EditPanelProp {
  showBar?: boolean;
  showLeftDiv?: boolean;
  showRightDiv?: boolean;
  showSave?: boolean;
  propsAPI?: any;
  qdata?: any;
  ggstyle?: React.CSSProperties;
  /**加载数据后自动缩放全屏数据显示 */
  autofit?: boolean;
  graphicModel?: GraphicState;
  /**是否只读，不可编辑*/
  readonly?: boolean;

  /**
   * 不显示缩略图
   */
  hidemini?:boolean;

  /**
   * 不显示tag条
   */
  hideTagBar?:boolean;

  onSaveOrAudit?:(data:any)=>void;

  outtags?:any[],
  ontagInited?:(tags:any[])=>void;

  /**等待延时 根据tagbar颜色重新渲染节点 */
  reloadColorTime?:number;

  /**是否隐藏toolbar上的保存按钮，审核时隐藏 */
  hidesave?:boolean;
}


const MainPage: React.FC<EditPanelProp,any> = (props,ref) => {

  const { propsAPI, showBar, showLeftDiv,showRightDiv, hideTagBar,showSave,hidesave, qdata, ggstyle, autofit, readonly,hidemini,onSaveOrAudit,outtags, ontagInited,reloadColorTime} = props;

  const [dvisible, setDvisible] = useState<boolean>(true);

  const koniRef = useRef();

  const SaveCmdRef=useRef<AuditAction>();

  const editorContent2Ref = useRef();
  const editorRef = useRef();
  const geditorRef = useRef();

   const [showright, SetShowRight] = useState<boolean>(true);
   const [showleft, SetShowLeft] = useState<boolean>(true);


//    useImperativeHandle(ref, (():AuditAction => {


//     return {
//         audit:  (state,info) => {

//             if(SaveCmdRef.current)
//             SaveCmdRef.current.audit(state,info);
//         },
      
//     }



// }));

  useEffect(() => {
    var el = editorContent2Ref.current;// document.querySelector('.editorContent2');
    riseze(el, (val, oldVal) => {
      // console.log(`size changed！new: ${JSON.stringify(val)}, old: ${JSON.stringify(oldVal)}`);

      const { graphicModel } = props;

      cancluePanelSize(editorContent2Ref.current, geditorRef.current, editorRef, graphicModel,showLeftDiv,showRightDiv);
    });

  }, []);

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

  const getGraphicConfig = () => {

    let config =  {
      mode: 'default',
      modes:
      {

        default: [

          "panBlank",
          "hoverGroupActived"
          , "keydownCmdWheelZoom"
          , "clickEdgeSelected"
          , "clickNodeSelected"
          , "clickCanvasSelected"
          , "clickGroupSelected"
           , "hoverNodeActived"
          , "hoverEdgeActived"
           , "hoverButton"
          , "clickCollapsedButton"
          , "clickExpandedButton"
          // , "wheelChangeViewport" //滚动
          , "keydownShiftMultiSelected"
          , "dragNodeAddToGroup"
          , "dragOutFromGroup"
          , "panItem"
           , "hoverEdgeControlPoint"
           , "dragEdgeControlPoint"
          // , "hoverAnchorActived"    //自动添加的
           //, "hoverNodeAddOutter"   //自动添加的
          // , "orbit"    //自动添加的
        ]

      }
    };

    if (readonly)
      config = {
        mode: 'default',
        modes:
        {

          default: [

            "panBlank",
            "hoverGroupActived"
            , "keydownCmdWheelZoom"
            , "clickEdgeSelected"
            , "clickNodeSelected"
            , "clickCanvasSelected"
            , "clickGroupSelected"
            // , "hoverNodeActived"
            , "hoverEdgeActived"
            // , "hoverButton"
            , "clickCollapsedButton"
            , "clickExpandedButton"
            // , "wheelChangeViewport"
            , "keydownShiftMultiSelected"
            , "dragNodeAddToGroup"
            , "dragOutFromGroup"
            , "panItem"
            // , "hoverEdgeControlPoint"
            // , "dragEdgeControlPoint"
            // , "hoverAnchorActived"    //自动添加的
            // , "hoverNodeAddOutter"   //自动添加的
            // , "orbit"    //自动添加的
          ]

        }
      };

    return config;
  }



  const itempanelref = useRef(null);
  useEffect(() => {
    // itempanelref.current.
  });
  return (
    // <PageHeaderWrapper title={' '} content={' '}>
    <div className="geditor" ref={geditorRef}>
      <GGEditor ref={editorRef} className="editor" style={ggstyle || { width: '100%', height: 'calc(100vh - 25px)' }} >

      {props.children}

        {showBar && (
          <Row className="editorHd">
            <Col span={24}>
              <KoniToolbar hidesave={hidesave} />
            </Col>
          </Row>
        )}
        <Row className="editorBd">
          {showLeftDiv && (
            <div className="editorSidebar">
              <div className="autoBtn left" title="隐藏边栏" ><Button onClick={() => {

                if (showleft) {
                  geditorRef.current.className = " geditor   hideleft";
                  SetShowLeft(false);
                }

                else {
                  geditorRef.current.className = " geditor   ";
                  SetShowLeft(true);
                }

                if (editorRef.current) {
                  // setTimeout(() => {

                  // }, 1250);

                }


              }}>{showleft && <DoubleLeftOutlined />} {!showleft && <DoubleRightOutlined />}</Button></div>
              <KScroll autohide>
                <KoniItemPanel />
              </KScroll>
            </div>
          )}
          <div className="editorContent2" ref={editorContent2Ref}>
            {!hideTagBar&&(
            <div className="tagbardv">
              <TagBar  ontagInited={ontagInited} outtags={outtags} />
            </div>
            )}

            {/* <div className="contentPanel"> */}
            {/* graph={{ edgeDefaultShape: 'flow-smooth' }}  */}
            <KoniPanel ref={koniRef} reloadColorTime={reloadColorTime}
              autofit
              readonly={readonly}
              qdata={qdata}
              className="koni"
              graphconfig={getGraphicConfig()

                // height:100,
                // width:100,

                // defaultEdge: {
                //   shape: 'CustomLine2',
                //   style: {
                //     stroke: '#eaff8f',
                //     lineWidth: 1, // ... 其他属性
                //   }, // 其他配置
                //   // labelStyle: {
                //   //   fontSize: 22,
                //   //   fill: 'red'
                //   // }
                // },

              }
            />
            {/* </div> */}
          </div>
          {/* <Drawer
          width={350}
          maskClosable	={false}
          
mask={false}
          placement="right"
          closable={true}
                  onClose={()=>{setDvisible(false)}}
          visible={dvisible}
        > */}
            {showRightDiv && (
              <>
          <div className="rightSidebar editorRightSidebar">
            <div className="autoBtn" title="隐藏边栏" ><Button onClick={() => {

              if (showright) {
                geditorRef.current.querySelector(".editor").className = " editor   hideright";
                SetShowRight(false);
              }

              else {
                geditorRef.current.querySelector(".editor").className = " editor   ";
                SetShowRight(true);
              }

            }}>{showright && <DoubleRightOutlined />} {!showright && <DoubleLeftOutlined />}</Button></div>
            <KScroll autohide>
              <KoniDetailPanel readonly={readonly} />

{!hidemini&&(              <EditorMinimap />)}
            </KScroll>
          </div>
          </>
            )}
         
        </Row>
        {!readonly&&
        <KoniContextMenu />
        }


        <ShowNeo4j />
        <CustomLine2 />
        <CustomLine />
        <Fullscreen />
        <EditCls />
        <EditTag />
        <CustomNodeFlow />
        <CustomNodeLRect />
        <ShowNodeRelationCmd />
        <SaveCmd eid={qdata?qdata.id:''} ref={SaveCmdRef} onOk={onSaveOrAudit} />
        <RefreshNodeCmd />
        <EditPro />
        <EditRelation />
      </GGEditor>
    </div>
    // </PageHeaderWrapper>
  );
};

MainPage.defaultProps = {
  showLeftDiv: true,
  showRightDiv: true,
  showBar:true,
}


export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(withRouter(withPropsAPI(MainPage)));



