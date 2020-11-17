import React, { Fragment, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

import { RegisterCommand, withPropsAPI } from "gg-editor";

import { Modal, Button, message } from 'antd';

import { query, saveOrUpdate, audit } from '@/services/grapicService';
import { ConnectState } from '@/models/connect';
import { connect, withRouter } from 'umi';


export interface cmdProps {
    eid?: string;

    auditInfo?: string;
    auditState?: string;

    onOk?:(data:any)=>void;
}

export interface AuditAction{
    audit:(state:string,info:string)=>void;
}

const SaveCmd: React.FC<cmdProps> = (props, ref) => {


    const [mvisible,setMvisible]=useState<boolean>(false);

    const [data,setData]=useState<any>();

    const[neo4j,setNeo4j]=useState<boolean>(false);

    const {onOk}=props;


    useEffect(() => {
      
    }, [])


    

    // useImperativeHandle(ref, (():AuditAction => {


    //     return {
    //         audit:  (state,info) => {

    //             dohandleAudit(state,info);
    //         },
          
    //     }



    // }));



    const handleOk = () => {



        setMvisible(false);

        const { propsAPI, graphicModel } = props;
        const chart = propsAPI.save();
        chart.delete = graphicModel.deletedata;
       // console.log(chart)

        const nodeitems = propsAPI.editor.getCurrentPage().getNodes();
        const edgeitems = propsAPI.editor.getCurrentPage().getEdges();

        // debugger;
        //save的数据存在未刷新现象
        if (nodeitems) {
            let realnodes = [];
            nodeitems.map(item => {
                realnodes.push(item.model);
            })
            chart.nodes = realnodes;
        }
        if (edgeitems) {
            let realedges = [];
            edgeitems.map(item => {
                realedges.push(item.model);
            })
            chart.edges = realedges;
        }


        saveData(chart);
    }


    const dohandleAudit = (state,info) => {
        const { propsAPI, graphicModel } = props;
        const chart = propsAPI.save();
        chart.delete = graphicModel.deletedata;
      //  console.log(chart)

        const nodeitems = propsAPI.editor.getCurrentPage().getNodes();
        const edgeitems = propsAPI.editor.getCurrentPage().getEdges();

        // debugger;
        //save的数据存在未刷新现象
        if (nodeitems) {
            let realnodes = [];
            nodeitems.map(item => {
                realnodes.push(item.model);
            })
            chart.nodes = realnodes;
        }
        if (edgeitems) {
            let realedges = [];
            edgeitems.map(item => {
                realedges.push(item.model);
            })
            chart.edges = realedges;
        }

        chart.auditState=state;
        chart.auditInfo=info;

        saveData(chart, true);


    }


    const handleCancel = () => {
        // this.setState({
        //     visible: false
        // })

        setMvisible(false);
    }






    //保存操作
    const saveData = async (gradata, auditstate) => {

        let data = { ...gradata };


        const { location, eid } = props;


        const id = (location&&location.query.id) || eid;



        //字段校验成功

        if (!gradata.edges && !gradata.nodes) {
            message.info("请编辑节点和关系后再保存!")
            return;
        }


        if (gradata.edges) {
            for (let index = 0; index < gradata.edges.length; index++) {
                const edge = gradata.edges[index];
                if (!edge.attrOk) {
                    message.error(edge.label + "上的属性未完全填写!");
                    return;
                }

            }
        }



        if (gradata.nodes)
            for (let index = 0; index < gradata.nodes.length; index++) {
                const edge = gradata.nodes[index];
                if (!edge.attrOk) {
                    message.error(edge.label + "上的属性未完全填写!");
                    return;
                }

            }

        data.neo4j =neo4j;

        data.oriId = id;

        


        const hide = message.loading('正在处理', 40);
        try {
            let requestrst = null;
            if (!auditstate)
                requestrst = await saveOrUpdate({ data: JSON.stringify(data) });
            else
                requestrst = await audit({ data: JSON.stringify(data) });

            if (requestrst && requestrst.success) {
                hide();
                message.success('操作成功');


                if(onOk)
                    onOk(true);

                return true;
            }
            message.error('操作失败');
            return false;
        } catch (error) {
            hide();
            message.error('操作失败请重试！');
            return false;
        }

    }


    const getModelText = () => {
        if (!neo4j)
            return <p>保存数据?</p>;
        else {
            return <p>保存数据并同步至Neo4j?</p>;
        }
    }


   
    const { propsAPI, graphicModel } = props;
    const { save, update, getSelected } = propsAPI;


    const setState = (item) => {
      setMvisible(true);
    }

    const csaveData = (data) => {
        saveData(data);
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
            // console.log("chart", chart);


            chart.delete = graphicModel.deletedata;

            setData(JSON.stringify(chart));
            setNeo4j(false);
            setMvisible(true);
            //setState({ data: JSON.stringify(chart), neo4j: false });

            const selectedNodes = getSelected();

            //  csaveData(chart);
        },

        // 反向命令逻辑
        back(/* editor */) {
            // console.log("执行反向命令2");
        },

        // 快捷按键配置
        shortcutCodes: [["Ctrl"], ["S"]]
    };

    const configAudit = {
        // 是否进入列队，默认为 true
        queue: true,

        // 命令是否可用
        enable(/* editor */) {
            return true;
        },

        // 正向命令逻辑
        execute(aa /* editor */) {
            // console.log(propsAPI.editor);
            
            //debugger;

            const auditData=aa.get("auditData");

            //console.log(auditData);
            dohandleAudit(auditData[0],auditData[1]);

            //  csaveData(chart);
        },

        // 反向命令逻辑
        back(/* editor */) {
            // console.log("执行反向命令2");
        },

        // 快捷按键配置
        shortcutCodes: [["ArrowLeft"], ["ArrowRight"]]
    };

    const configNeo4j = {
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
            // console.log("chart", chart);


            chart.delete = graphicModel.deletedata;

            setData(JSON.stringify(chart));
            setNeo4j(true);

           // setState({ data: JSON.stringify(chart), neo4j: true });

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


    return (
        <Fragment>
            <RegisterCommand name="save" config={config} />

            <RegisterCommand name="audit" config={configAudit} />
            <RegisterCommand name="saveWithNeo4j" config={configNeo4j} />

       

            {/* <div>1</div> */}
            <Modal
                title="图数据"
                visible={false}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{data}</p>

            </Modal>
            <Modal
                title="确认保存数据"
                visible={mvisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {getModelText()}

            </Modal>
        </Fragment>

    );

}

// export default withPropsAPI(Component);

export default connect(({ graphic, loading }: ConnectState) => ({
    graphicModel: graphic,
    initFun: loading.effects['graphic/init'],
}))(withRouter(withPropsAPI(SaveCmd)));

