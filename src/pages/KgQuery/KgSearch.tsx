


import React, { useState, useRef, cloneElement, useEffect, useContext } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Row, Input, Col, Avatar, Spin } from "antd";
import QueueAnim from 'rc-queue-anim';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { MyEditObj } from '../ModifyList/data';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';

import { isnull } from '@/utils/utils';
import _ from 'lodash';
import EditMainPanel from '../GraphicO/index';
import './index.less';
import { IconFontNew } from '@/components/MyCom/KIcon';
import logo from '../../assets/favicon.png';
import EntitySelect from '@/components/MyCom/EntitySelect';
import D3Panel from '../D3/D3Panel';

import NPanel from '../NQuery/index';
import SearchQuery from '@/components/MyCom/SearchQuery';
import { keyword } from 'chalk';
import { withRouter } from 'umi';
import TweenOne from 'rc-tween-one';
import { search } from '@/services/searchService';
import { ExclamationCircleOutlined } from '@ant-design/icons';



export const UrlContext = React.createContext([{}, (p, key) => { }]);

const KgSearch: React.FC<{}> = (props) => {


    const [qdataquery, setqdataquery] = useState<QDATA>({ id: '', gtype: 'entity', level: 1, iseditData: false });

    const [ndataquery, setndataquery] = useState<any>({ keyword: '' });
    const [searchtxt, setsearchtxt] = useState<string>("");

    const [searchurlkey, setsearchurlkey] = useState<string>("");

    const [selectVal, SetselectVal] = useState<any>();
    const [fetching, Setfetching] = useState<boolean>(false);

    const [paused, setpaused] = useState<boolean>(true);

    const [searchType, SetSearchType] = useState<"kg" | "normal">('normal');

    const [incenter, setincenter] = useState<boolean>(true);



    const toUrl = (type, v) => {

        try {


            if (!isnull(type) && (type === 'kg' || type === "normal"))
                SetSearchType(type);
        } catch (error) {
            console.log(error);
        }

        props.history.push("/s/search?keyword=" + v);



    }

    useEffect(() => {
        props.history.listen(route => {
            //console.log(route); // 这个route里面有当前路由的各个参数信息
            const v = route.query.keyword;


            doSearch(v);
            setsearchtxt(v)
            setsearchurlkey(v)

            if(v)
            {
                setincenter(false);
            }
        });
    }, [])


    const EntitySelectDone = (val) => {

        Setfetching(true);

        const qdata = {
            gtype: "entity",
            id: val.key,
            level: 1,
            iseditData: false,
            keyword: val.label,
        }

        setqdataquery(qdata);
        setTimeout(() => {
            Setfetching(false);
        }, 50);

    }


    //查询分析
    const SearchChanged = (value) => {

    }

    //查询分析
    const doSearch = (value) => {


        //掉接口，确定查询语义，类型

        Setfetching(true);

        //  props.history.push("/s/search?keyword="+value);

        //  console.log(value);
        /// debugger;
        //查询
        setndataquery({ keyword: value, level: 1 })

        setTimeout(() => {
            Setfetching(false);
        }, 20);
    }

    const changeToSearch = (v) => {


        setndataquery({ keyword: v, level: 1 })



        setsearchtxt(v);

        SetSearchType("normal");
    }

    const changeToKg = async (v) => {


        //query entity id
    //清空普通查询，避免回来的2次查询
       setndataquery({ keyword: "", level: 1 })



        const erst = await search({ keyword: v });


        let id = "";
        let label = "";
        if (erst && erst.data) {
            if (erst.data.entity) {
                id = erst.data.entity.id;
                label = erst.data.entity.name;
            }

        }

        if (!isnull(id)) {
            //查询谱图数据设置
            setqdataquery({
                gtype: "entity",
                id: id,
                level: 1,
                iseditData: false,
            })

            //输入框设置
            SetselectVal({ value: id, name: label, label: label, key: id })

        }

        SetSearchType("kg");

    }


    useEffect(() => {

        const { location } = props;

        let keyword = location.query.keyword;

        let type = location.query.type;

        if (keyword) {
            setsearchurlkey(keyword);

            if(type&&type==='kg')
            changeToKg(keyword);
            else
            changeToSearch(keyword);
            // doSearch(keyword);
        }

    }, [])



    const onFocus = () => {
        // setpaused(false);

        setincenter(false);
    }




    return (<>
    
        <UrlContext.Provider value={[searchurlkey, toUrl]}    >
      
            <span className={`searchDv ${searchType} ${incenter ? 'center' : ''} `} >
        



                <div className="stitle"  >
                <Alert className="ttp" type="warning" message="图谱数据源于本站爬虫,仅供娱乐,不保证数据的准确性" closable showIcon icon={<ExclamationCircleOutlined />} />
                    {/* 
                    <TweenOne
                        animation={{
                            height: '76px',
                            repeat: 0,
                            duration: 650,
                        }}

                        style={{ height: '100vh', width: '100%' }}

                        paused={paused}
                    >
                    <div> */}
                    <span className="stxt">知识检索</span>
                    <Row>
                 
                <Col span={2}><img className="slogo"  onClick={() => {

                        //props.history.push("/");

                   toUrl('normal','');
                        setincenter(true);


                    }} alt="" src={logo} /></Col>
                 <Col span={14} className="sinput">
                        <Card className="searchCard"
                        >

                            {searchType === "kg" && (
                                <EntitySelect className="width100" onFocus={onFocus} labelInValue selectVal={selectVal} placeholder="搜索条目关系" onChange={EntitySelectDone} />
                            )}

                            {searchType === "normal" && (
                                <SearchQuery inputvalue={searchtxt} onFocus={onFocus} className="width100" selectVal={selectVal} placeholder="问题 /关键词 /表达式" onSearch={(value) => {
                                    props.history.push("/s/search?keyword=" + value);

                                }} onChange={SearchChanged} />
                            )}

                            <span className="searchIcon2" title="搜索" onClick={() => {

                            }}>
                                <IconFontNew className="searchIconR" type="icon-search" onClick={search} />
                            </span>
                        </Card>
                        <div className="typedv">
                            <span className={`types ${searchType === "normal" ? "selected" : ""}`} onClick={() => {
                                if(searchType!=="normal")
                                changeToSearch(qdataquery.keyword)
                            }}>文字</span>

                            <span className={`types ${searchType === "kg" ? "selected" : ""}`} onClick={() => {
                                // SetSearchType("kg");
                                if(searchType!=='kg')
                                changeToKg(searchtxt)
                            }}>图谱</span>

                            <span className={`types ${searchType === "link" ? "selected" : ""}`} onClick={() => {
                                // SetSearchType("kg");
                                props.history.push("/s/url");
                            }}>链接</span>

                        </div>
                    </Col>
                    <div className="toRoot"><a href="javascript:void(0);" onClick={()=>{
                        props.history.push("/");
                    }} >返回首页</a></div>
                    </Row>
                    {/* </div>
                </TweenOne> */}
                </div>




                <div className="scontent">
               
<Row>
                    <>
              
                        {fetching && (<Spin />)}
                        {!fetching && searchType === "kg" && (<>
                            {/* <EditMainPanel hideTagBar showRightDiv={false} reloadColorTime={4000} qdata={qdataquery} hidemini autofit readonly showLeftDiv={false}  showBar={false} ggstyle={{ width: '100%', height: '300px' }} /> */}
                            <Col span={24}>
                                <D3Panel qdata={qdataquery} />
                            </Col>
                        </>
                        )}

                        {!fetching && searchType === "normal" && (<>
                            {/* <EditMainPanel hideTagBar showRightDiv={false} reloadColorTime={4000} qdata={qdataquery} hidemini autofit readonly showLeftDiv={false}  showBar={false} ggstyle={{ width: '100%', height: '300px' }} /> */}
                            <Col span={24}>
                                <NPanel qdata={ndataquery} />
                            </Col>

                        </>
                        )}




                    </>
                    </Row>

                </div>
            </span>
        </UrlContext.Provider>

    </>);
}

export default withRouter(KgSearch);