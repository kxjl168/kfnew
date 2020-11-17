import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI, RegisterBehaviour } from "gg-editor";

import { Modal, Button, message } from 'antd';

import { query, saveOrUpdate } from '@/services/grapicService';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';


class Component extends React.Component {

    constructor(props) {
        super(props);

        this.init();
        //  this.bindEvent();
    }



    componentDidMount() {
        const { propsAPI } = this.props;

        console.log(propsAPI);


    }

    handleOk = () => {
        this.setState({
            visible: false
        })
 const { propsAPI,graphicModel } = this.props;
        const chart =propsAPI. save();
        chart.delete=graphicModel.deletedata ;

        this.saveData(chart);
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    init() {
        this.state = {
            visible: false,
            data: {}
        }
    }

    //保存操作
    saveData = async (gradata) => {

        let data = {...gradata};


          //字段校验成功
     
   
     for (let index = 0; index <  gradata.edges.length; index++) {
         const edge =  gradata.edges[index];
         if(!edge.attrOk)
         {
             message.error(edge.label+"上的属性未完全填写!");
             return ;
         }
         
     }

     for (let index = 0; index <  gradata.nodes.length; index++) {
        const edge =  gradata.nodes[index];
        if(!edge.attrOk)
        {
            message.error(edge.label+"上的属性未完全填写!");
            return ;
        }
        
    }
     


        const hide = message.loading('正在处理');
        try {
           let requestrst= await saveOrUpdate({data:JSON.stringify(data)});
            if (requestrst && requestrst.success) {
            hide();
            message.success('保存成功');
            return true;
            }
            message.error('保存失败');
            return false;
        } catch (error) {
            hide();
            message.error('保存失败请重试！');
            return false;
        }

    }


    render() {
        
        const { propsAPI,graphicModel } = this.props;
        const { save, update, getSelected } = propsAPI;


        const setState = (item) => {
            item.visible = true;
            this.setState(
                item
            );
        }

        const csaveData=(data)=>{
            this.saveData(data);
        }

        const config = {
            // 是否进入列队，默认为 true
            queue: true,

            // 命令是否可用
            enable(/* editor */) {
                return true;
            },

            // 正向命令逻辑
            execute(/* editor */) {
                // console.log(propsAPI.editor);
                let chart = save();
                console.log("chart", chart);

              
                chart.delete=graphicModel.deletedata ;

                setState({ data: JSON.stringify(chart) });

                const selectedNodes = getSelected();
              
              //  csaveData(chart);
            },

            // 反向命令逻辑
            back(/* editor */) {
                console.log("执行反向命令2");
            },

            // 快捷按键配置
            shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
        };

        const behaviorFun=(page)=>{
            console.log(page);
        }

        return (
            <Fragment>
                <RegisterBehaviour behaviour={behaviorFun} name="EntityMenu" dependences={['NodeMenu']} />
               
            </Fragment>

        );
    }
}

// export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
  }))(withPropsAPI(Component));
  