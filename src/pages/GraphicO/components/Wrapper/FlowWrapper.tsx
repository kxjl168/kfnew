import React from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { ConnectState } from '@/models/connect';
import logo from '@/assets/graphic.svg';
import { Form, message, Modal, Button, Input } from 'antd';
import { GraphicState } from '@/models/graphic';
import { Link, connect, Dispatch } from 'umi';


interface GraphicProps {
  dispatch: Dispatch;
  graphicModel: GraphicState;
  reload?: boolean;
}


class FlowWrapper extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props ;
 
    console.log(propsAPI);
  }

  render(){
    const {dispatch,reload, propsAPI } = this.props ;
 
    console.log(this.props);
    
    const { save, update, getSelected } = propsAPI;

    const config = {
      // 是否进入列队，默认为 true
      queue: true,

      // 命令是否可用
      enable(/* editor */) {
        return true;
      },

      name(){
        return "刷新节点类型";
      },

      // 正向命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);
        
        dispatch({
          type:"graphic/reload",
          payload:{

          }
        })
        console.log("execute refresh...");


      },

      onDrop(item){

        const selectedNodes = getSelected();
        if (selectedNodes.length > 1) {
          message.info('请单选节点编辑');
          return;
        }
      
        console.log("onDrap:"+selectedNodes[0].model);

      },

      // 反向命令逻辑
      back(/* editor */) {
        console.log("执行反向命令2");
      },

      // 快捷按键配置
      //shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    return <></>;
  }
}
 

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,

}))(withPropsAPI(FlowWrapper));
