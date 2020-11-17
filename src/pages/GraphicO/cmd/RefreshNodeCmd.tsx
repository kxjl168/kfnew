import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { ConnectState } from '@/models/connect';
import logo from '@/assets/graphic.svg';

import { GraphicState } from '@/models/graphic';
import { Link, connect, Dispatch } from 'umi';


interface GraphicProps {
  dispatch: Dispatch;
  graphicModel: GraphicState;
  reload?: boolean;
}


class Component extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props ;
 
    console.log(propsAPI);
  }

  constructor(props){
    super(props);
    this.init();
  }

  init(){
  //  const {graphicModel} = this.props ;
   // this.gm=graphicModel;
  }
  
 
  render(){
    const {graphicModel,dispatch } = this.props ;
  //  console.log(this.graphicModel);
    
   // const { save, update, getSelected } = propsAPI;

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
        // console.log("execute:"+this.props.graphicModel .queryname);
      //  debugger;
        dispatch({
          type:"graphic/reload",
          payload:{
          //  clsName: this.props.graphicModel .queryname
          }
        })
 
      },

      // 反向命令逻辑
      back(/* editor */) {
        //console.log("执行反向命令2");
      },

      // 快捷按键配置
      //shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    return (
      <Fragment>
    <RegisterCommand name="reloadnode" config={config} />
    {/* <div>{graphicModel.queryname}</div> */}
    </Fragment>
    );
  }
}
 

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  
}))(Component);
