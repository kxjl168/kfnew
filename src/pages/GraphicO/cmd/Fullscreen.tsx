import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { Modal, Button, message } from 'antd';

import { query, saveOrUpdate } from '@/services/grapicService';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';

import './cmd.less';
import { cancluePanelSize } from '..';


class Component extends React.Component {

    constructor(props) {
        super(props);

        this.init();
        //  this.bindEvent();
    }



    componentDidMount() {
        const { propsAPI } = this.props;

        //  console.log(propsAPI);


    }

    init() {
        this.state = {
            fullscree: false,

        }
    }




    render() {



        const { propsAPI, graphicModel } = this.props;
        const { save, update, getSelected } = propsAPI;


        const setState = (item) => {
            item.visible = true;
            this.setState(
                item
            );
        }

        const csaveData = (data) => {
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
                fullscreen();
            },

            // 反向命令逻辑
            back(/* editor */) {
                // console.log("执行反向命令2");
            },

            // 快捷按键配置
            shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
        };

        const fullscreen = () => {

            let element = document.documentElement;
            if (!this.state.fullscreen) {
                const { propsAPI } = this.props;



                let page = propsAPI.editor.getCurrentPage();
                // debugger;

                document.querySelector("body").className = "fullscreen";
                this.setState({ fullscreen: true });
                this.props.dispatch(
                    {
                        type: 'graphic/fullScreen',
                        payload: {
                            data: true
                        }
                    }
                )

                cancluePanelSize();

                setTimeout(() => {

                
                    // try {
    
    
                    //     document.querySelector(".graph-container").querySelector("canvas").width = document.querySelector(".editor").width()-450;
                    //     document.querySelector(".graph-container").querySelector("canvas").style.width =( document.querySelector(".editor").width()-450) + "px";
                    // } catch (error) {

                    // }



                }, 650);

                // if (element.requestFullscreen) {
                //     element.requestFullscreen();
                // } else if (element.webkitRequestFullScreen) {
                //     element.webkitRequestFullScreen();
                // } else if (element.mozRequestFullScreen) {
                //     element.mozRequestFullScreen();
                // } else if (element.msRequestFullscreen) {
                //     // IE11
                //     element.msRequestFullscreen();
                // }
                // let a=1;
                // a++;

            }
            else {
                document.querySelector("body").className = "";
                this.setState({ fullscreen: false });
                this.props.dispatch(
                    {
                        type: 'graphic/fullScreen',
                        payload: {
                            data: false
                        }
                    }
                )
                try {

                    cancluePanelSize();

                    setTimeout(() => {

                        // try {
    
    
                        //     document.querySelector(".graph-container").querySelector("canvas").width = document.querySelector(".editor").width()-450;
                        //     document.querySelector(".graph-container").querySelector("canvas").style.width =( document.querySelector(".editor").width()-450) + "px";
                        // } catch (error) {
    
                        // }
    
    
                    }, 650);
    

                    // if (document.exitFullscreen) {
                    //     document.exitFullscreen();
                    // } else if (document.webkitCancelFullScreen) {
                    //     document.webkitCancelFullScreen();
                    // } else if (document.mozCancelFullScreen) {
                    //     document.mozCancelFullScreen();
                    // } else if (document.msExitFullscreen) {
                    //     document.msExitFullscreen();
                    // }

                } catch (error) {

                }

            }





        }




        return (
            <Fragment>
                <RegisterCommand name="fullscreen" config={config} />

            </Fragment>

        );
    }
}

// export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withPropsAPI(Component));

