import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { Modal, Button, message } from 'antd';

import { query, saveOrUpdate } from '@/services/grapicService';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';

import './cmd.less';


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
                action();
            },

            // 反向命令逻辑
            back(/* editor */) {
                // console.log("执行反向命令2");
            },

            // 快捷按键配置
            shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
        };

        const action = () => {

           window.open("http://192.168.1.194:7474/");



        }




        return (
            <Fragment>
                <RegisterCommand name="showneo4j" config={config} />

            </Fragment>

        );
    }
}

// export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withPropsAPI(Component));

