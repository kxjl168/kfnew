import React, { Fragment } from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { Modal, Button, message } from 'antd';

import { query, saveOrUpdate } from '@/services/grapicService';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { concat, unionBy, merge } from 'lodash';
import { isnull } from '@/utils/utils';
import { UpdateNodeTagColor, getNodeColor, getLineColor } from '../components/TagBar';
import { getSaveData, refreshAllColor } from '../components/KoniMain/KoniPanel';

//展示指定节点的周边连线关系
class Component extends React.Component {

    constructor(props) {
        super(props);

        this.init();
        //  this.bindEvent();
    }



    componentDidMount() {
        const { propsAPI } = this.props;

        // console.log(propsAPI);


    }

    handleOk = () => {
        this.setState({
            visible: false
        })
        const { propsAPI, graphicModel } = this.props;
        const chart = propsAPI.save();
        chart.delete = graphicModel.deletedata;

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

        let data = { ...gradata };





        const hide = message.loading('正在处理');
        try {
            await saveOrUpdate({ data: JSON.stringify(data) });
            hide();
            message.success('保存成功');
            return true;
        } catch (error) {
            hide();
            message.error('保存失败请重试！');
            return false;
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

        //加载指定节点周边数据
        const loadMoreData = async (nodelevel) => {

            const selectedNodes = getSelected();
            if (selectedNodes.length > 1) {
                message.info('请单选节点');
                return;
            }
            // selectedNodes.map(node => {
            //     update(node, { x: node.model.x + 2, y: node.model.y });
            // });
            console.log(selectedNodes[0].model);

            const ndid = selectedNodes[0].model.nodeid;

            let hide = message.loading("加载中...", 200);

            let data = await query({ id: ndid, level: nodelevel,showEdit:true });

            hide();
            let gdata = {};

            try {


                let gradata = JSON.parse(JSON.stringify(data));
                gdata = JSON.parse(gradata.data);
            } catch (error) {
                message.error("数据加载失败!");
            }
            if (isnull(gdata))
                return;
            // console.log(JSON.stringify(gdata));
            // debugger;
            gdata.nodes.map(item => {
                item = merge(item, {

                    type: "node",
                    size: "55*55",
                    shape: 'custom-node-circle',

                    stroke: '#ff0000',
                    color: "#FA8C16",
                    stroke_left: '#0000ff',

                    // x: 100,
                    // y: 100,
                    labelOffsetY: 20,
                    icon: "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg"
                });

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

            gdata.edges.map(item => {


                item = merge(item, {

                    shape: 'CustomLine2',

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





            let exsitData = save();

            if (!exsitData.nodes) {
                exsitData.nodes = gdata.nodes;
            }

            exsitData.nodes = unionBy(concat(exsitData.nodes, gdata.nodes), (nd) => {
                return nd.nodeid;
            });

            let changedNode = {};//id有变化的节点，后续需要同步更新连线

            exsitData.nodes = exsitData.nodes.map(node => {
                //处理刚拖入的数据id为nodeid
                if (node.id !== node.nodeid) {
                    changedNode[node.id] = node.nodeid;
                    node.id = node.nodeid;
                }
                return node;
            })

            if (!exsitData.edges) {
                exsitData.edges = gdata.edges;
            }

            exsitData.edges = unionBy(concat(exsitData.edges, gdata.edges), (edge) => {
                return edge.id;
            });

            const changedKeys:string[]= Object.keys(changedNode);
            //处理节点数据变化的连线 
            exsitData.edges = exsitData.edges.map(edge => {


             for (let index = 0; index < changedKeys.length; index++) {
                 const oldid = changedKeys[index];
                 
             
                    if (edge.source === oldid) {
                        edge.source=changedNode[oldid];
                    }
                    if (edge.target === oldid) {
                        edge.target=changedNode[oldid];
                    }
                }
                return edge;
            })



            // console.log("total:" + JSON.stringify(exsitData));

            const { propsAPI } = this.props;


            if (!isnull(exsitData)) {

                propsAPI.read(exsitData);

                //延时等待 tagbar完成后，反向更新节点标签颜色
                setTimeout(() => {


                    const { graphicModel } = this.props;

                    refreshAllColor(propsAPI, graphicModel);



                }, 300);

            }


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


                loadMoreData(1);
                //  csaveData(chart);
            },

            // 反向命令逻辑
            back(/* editor */) {
                console.log("执行反向命令2");
            },

            // 快捷按键配置
            shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
        };
        const config2 = {
            // 是否进入列队，默认为 true
            queue: true,

            // 命令是否可用
            enable(/* editor */) {
                return true;
            },

            // 正向命令逻辑
            execute(/* editor */) {
                // console.log(propsAPI.editor);


                loadMoreData(2);
                //  csaveData(chart);
            },

            // 反向命令逻辑
            back(/* editor */) {
                console.log("执行反向命令2");
            },

            // 快捷按键配置
            shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
        };

        return (
            <Fragment>
                <RegisterCommand name="showNodeRelation" config={config} />
                <RegisterCommand name="showNodeRelation2" config={config2} />
            </Fragment>

        );
    }
}

// export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withPropsAPI(Component));
