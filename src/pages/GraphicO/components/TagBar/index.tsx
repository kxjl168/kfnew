import React from 'react';

import { withPropsAPI, PropsApi } from "gg-editor";
import { useEffect, useState } from "react";
import { ConnectState } from '@/models/connect';
import { connect, GraphicState } from 'umi';
import { isnull, GetRandomLightColor } from '@/utils/utils';
import _ from 'lodash';
import { SketchPicker, TwitterPicker, ChromePicker, CompactPicker } from 'react-color';
import { Modal, Button } from 'antd';
import './tagbar.less';
import uuid from '@/utils/uuid';
import { myPropsAPI } from '../KoniMain/KoniPanel';

export interface itemProp {
    name: string;
    num: number;
    color: string;
}


/**
 * 按节点上的标签排序，返回第一个标签的颜色
 * @param item 节点item
 * @param tgs  所有tags
 */
export const getNodeColor = (item, tgs) => {
    let color = "#F0CFA4";
    try {


        if (item.tags) {
            if (item.tags instanceof Array) {
                let rtags = _.sortBy(item.tags, (item) => {
                    return item.name;
                });


                for (let index = 0; index < rtags.length; index++) {
                    const tag = rtags[index];

                    let tg = _.find(tgs, (t) => {
                        return t.name === tag.label;
                    })
                    if (!isnull(tg))
                        rtags[index].color = tg.color;
                }
                for (let index = 0; index < rtags.length; index++) {
                    const tag = rtags[index];
                    if (!isnull(tag) && tag.color !== '#F0CFA4') {
                        color = tag.color;
                        break;
                    }
                }
            }


        }
    } catch (error) {

    }

    if (color === undefined)
        color = "#F0CFA4";

    return color;

}


export const getEdgeColor = (item, tgs) => {
    let color = "#F0CFA4";


    for (let index = 0; index < tgs.length; index++) {
        const tag = tgs[index];

        let tg = _.find(tgs, (t) => {
            return t.name === item.label;
        })
        if (!isnull(tg)) {
            color = tg.color;
            break;
        }
    }
    return color;

}


/**
 * 更新节点上的标签颜色
 * @param item 
 * @param tgs 
 */
export const UpdateNodeTagColor = (item, tgs) => {
    let color = "#FA8C16";
    let nitem = _.cloneDeep(item);
    if (item.tags) {
        if (item.tags instanceof Array) {
            let rtags = _.sortBy(item.tags, (item) => {
                return item.name;
            });


            for (let index = 0; index < rtags.length; index++) {
                const tag = rtags[index];

                let tg = _.find(tgs, (t) => {
                    return t.name === tag.label;
                })
                if (!isnull(tg))
                {
                    rtags[index].value = rtags[index].label + "-" + tg.color;
                    rtags[index].color = tg.color;
                }
            }


            nitem.tags = rtags;
        }
    }

    return nitem;

}

export const UpdateNodeTagColor2 = (item, tgs) => {
    let color = "#FA8C16";
    let nitem =item;// _.cloneDeep(item);
    if (item.tags) {
        if (item.tags instanceof Array) {
            let rtags = _.sortBy(item.tags, (item) => {
                return item.name;
            });


            for (let index = 0; index < rtags.length; index++) {
                const tag = rtags[index];

                let tg = _.find(tgs, (t) => {
                    return t.name === tag.label;
                })
                if (!isnull(tg))
                {
                    rtags[index].value = rtags[index].label + "-" + tg.color;
                    rtags[index].color = tg.color;
                }
            }


            nitem.tags = rtags;
        }
    }

    return nitem;

}
/**
 * 获取标签颜色
 * @param tgs  所有tgs
 * @param name 
 */
export const getTagColor = (tgs, name) => {
    let color = "#";

    for (let index = 0; index < 6; index++) {
        color += _.random(15).toString(16);
    }

    color=GetRandomLightColor();


    if (tgs) {
        let tgintags = _.find(tgs, (item) => {
            return item.name === name;
        })
        if (!isnull(tgintags))
            return tgintags.color;

        return color;
    }

    return color;

}

/**
 * 获取标签颜色
 * @param tgs  所有tgs
 * @param name 
 */
export const getLineColor = (tgs, name) => {
    let color = "#999";

    // for (let index = 0; index < 6; index++) {
    //     color += _.random(15).toString(16);
    // }


    if (tgs) {
        let tgintags = _.find(tgs, (item) => {
            return item.name === name;
        })
        if (!isnull(tgintags))
            return tgintags.color;

        return color;
    }

    return color;

}

interface propsType {
    graphicModel: GraphicState,
    propsAPI:myPropsAPI,
    outtags?:any[],
    ontagInited?:(tags:any[])=>void;
}

const TagBar: React.FC<propsType> = (props) => {


  
    const [tags, setTags] = useState<[]>([]);
    const [lines, setLines] = useState<[]>([]);

    const [showcolorpicker, Setshowcolorpicker] = useState<boolean>(false);
    const [curColor, setcurColor] = useState<string>();
    const [curTag, setcurTagr] = useState<any>();
    const [curLine, setcurLine] = useState<any>();

    const [tagInited,setTagInited]=useState<boolean>(false);


    const [curAction, setcurAction] = useState<any>();

    const { graphicModel,propsAPI ,outtags,ontagInited} = props;

    const [lastGdata,SetLastGdata]=useState<any>();

    useEffect(()=>{
        if(!isnull(outtags)&&outtags!==[])
        {
           // console.log(outtags)
            setTags(outtags);

             setTimeout(() => {
                  resetGdataColor(outtags);
                 }, 1000);
        }
    },[outtags])

    useEffect(()=>{

        
        // setTimeout(() => {

        //     try{
          
        //     setTags(graphicModel.tags);
        //   }catch{};
        //   }, 4000);
    

    },[]);

    useEffect(() => {

      
   //      console.log(propsAPI.editor.id+"graphicModel.data changed!")
        // return;
        const gdata = graphicModel.data[propsAPI.editor.id];
       
        if(gdata===lastGdata)
        return ;
       

        SetLastGdata(gdata);
   
        console.log(propsAPI.editor.id+"graphicModel.data changed!")
        //  console.log(gdata)
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

                                const tcolor = getTagColor(tags, tag.label);

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

            setTags(tgs);

            if(ontagInited&&!tagInited)
            {
                setTimeout(() => {
                    setTagInited(true);
                    ontagInited(tgs);    
                }, 200);
                
            }
                


            props.dispatch({
                type: 'graphic/setTags',
                payload: {
                    data: tgs,
                    id:propsAPI.editor.id
                }
            })





            let lns: any = [];
            gdata.edges.map(item => {

                const tgintags = _.find(lns, (itemt) => {
                    return itemt.name === item.label;
                })
                if (isnull(tgintags)) {

                    let tcolor = getLineColor(lines, item.label);
                    // let tcolor = "#999";//线默认

                    const ntags = _.concat(lns, {
                        name: item.label,
                        num: 1,
                        color: tcolor,
                    })
                    lns = ntags;
                }
                else {
                    tgintags.num++;
                    const ntags = _.merge(lns, tgintags);
                    lns = ntags;
                }



            })
            setLines(lns);

            props.dispatch({
                type: 'graphic/setLines',
                payload: {
                    data: lns
                }
            })



            // if (!_.isEqual(tgs, tags)) {

            //     //    console.log('tag changed');
            //      setTimeout(() => {
            //       resetGdataColor(tgs);
            //      }, 400);

            // }

        }


    }, [graphicModel.data[propsAPI.editor.id] ]);


    useEffect(() => {
        // console.log('click')
        handleClose();
    }, [graphicModel.click])


    //根据标签条颜色，重设节点及节点标签颜色
    const resetGdataColor = (tgs) => {
      //  const { propsAPI } = props;
        console.log("resetGdataColor")
        let gdata = _.cloneDeep(graphicModel.data[propsAPI.editor.id]);

        if(!gdata||!gdata.nodes)
        return;

        let nodes = gdata.nodes.map(item => {


            let color = getNodeColor(item, tgs);
            item = UpdateNodeTagColor(item, tgs);

            item.color = color;
            return item;
        });
        gdata.nodes = nodes;

        try {
            propsAPI.read(gdata);
        } catch (error) {
            
        }

        
    }

    //跟新连线颜色
    const resetGdataLineColor = (tgs) => {
        const { propsAPI } = props;

        let gdata = _.cloneDeep(graphicModel.data[propsAPI.editor.id]);

        let edges = gdata.edges.map(item => {


            let color = getEdgeColor(item, tgs);
            //item = UpdateNodeTagColor(item, tgs);

            item.stroke = color;//线颜色
            return item;
        });
        gdata.edges = edges;

        try {
            propsAPI.read(gdata);
        } catch (error) {
            
        }
    }



    const cover = {
        position: 'relative',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        zIndex: '10000',
    }
    const popover = {
        position: 'absolute',
        zIndex: '10000',
    }

    const handleClose = () => {
        Setshowcolorpicker(false);
    }
    const handleChangeComplete = (color) => {

        if (curAction === 'tag') {
            let ctg = _.find(tags, (tg) => {
                return tg.name === curTag.name;
            })
            // console.log(color);
            ctg.color = color.hex;

            let ntags = _.merge(tags, ctg);
            setTags(ntags);

            setcurColor(color.hex);

            resetGdataColor(ntags);
        }
        else {
            let cline = _.find(lines, (line) => {
                let rst = (line.name === curLine.name)
                return rst;
            })
            // console.log(color);
            cline.color = color.hex;

            let nlines = _.merge(lines, cline);
            setLines(nlines);
            setcurColor(color.hex);

            resetGdataLineColor(nlines);
        }
        //  tag.color = color;


    }

    const handleOnChange = (data) => {
        console.log(data);

    }

    const getTagDoms = () => {


        let dom = <></>;
        let rtags = _.sortBy(tags, (item) => {
            return item.name;
        });
        dom = rtags.map((tag: itemProp) => {
            return (
                <>

                    <div key={uuid()} className="tabbr tagcircle ant-tag ant-tag-has-color" style={{ backgroundColor: tag.color }} onClick={() => {
                        Setshowcolorpicker(true);
                        setcurColor(tag.color);
                        setcurTagr(tag);
                        setcurAction('tag');
                    }}>({tag.num}){tag.name}</div>


                </>
            )
        })

        return (
            <>
                {dom}


            </>
        )
    }



    const getLineDoms = () => {
        let dom = <></>;

        dom = lines.map((tag: itemProp, index) => {
            return (
                <>
                    <div key={uuid()} className="tabbr ant-tag ant-tag-has-color" style={{ backgroundColor: tag.color }} onClick={() => {
                        Setshowcolorpicker(true);
                        setcurColor(tag.color);
                        setcurLine(tag);
                        setcurAction('line');
                    }}>({tag.num}){tag.name}</div>
                </>
            )
        })

        return (
            dom
        )
    }



    const clsDom = <></>;

    const entityDom = <>
        <div>{getTagDoms()}</div>
        {tags.length > 0 &&
            <div className='splitline'></div>
        }

        <div>{getLineDoms()}</div>
        {lines.length > 0 &&
            <div className='splitline'></div>
        }



        {showcolorpicker &&
            <div style={popover} >
                {/* <div style={cover} >
                <TwitterPicker color={curColor} onChangeComplete={handleChangeComplete

                } />
            </div> */}
                <div style={cover}  >
                    <ChromePicker color={curColor} onChangeComplete={handleChangeComplete
                    } />

                </div>
                {/* <div style={cover} >
                <SketchPicker color={curColor}  onChangeComplete={handleChangeComplete

                } />
            </div> */}

            </div>
        }
    </>;


    return (
        <>
        {graphicModel.graphicType==="entity"&& entityDom}
        {graphicModel.graphicType==="cls"&& clsDom}


        </>
    )

}

//export default comp;
//export default withPropsAPI(comp);

export default connect(({ graphic }: ConnectState) => ({
    graphicModel: graphic,
}))(withPropsAPI(TagBar));
