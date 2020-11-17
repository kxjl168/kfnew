


import React, { useState, useRef, cloneElement, useEffect } from 'react';


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
import logo from '../../assets/logo.svg';
import EntitySelect from '@/components/MyCom/EntitySelect';
import G6Panel from '../G6';


const KgQuery: React.FC<{}> = (props) => {


    const [qdataquery, setqdataquery] = useState<QDATA>({ id: '',gtype:'entity',level:1,iseditData:false });
    const [selectVal, SetselectVal] = useState<any>();
    const [fetching, Setfetching] = useState<boolean>(false);

    const EntitySelectDone = (val) => {

        Setfetching(true);

        const qdata = {
            gtype: "entity",
            id: val.key,
            level: 2,
            iseditData: false,
        }

        setqdataquery(qdata);
        setTimeout(() => {
            Setfetching(false);    
        }, 50);
        
    }
    const search = () => {

    }


    return (<>
    <span className="searchDv">
        <Row className="stitle"  >
            <span className="ss" >
            <Col span={5}>
                <Card className="searchCard"
                >
                    <span className="searchIcon" title="返回首页" onClick={() => {
                        props.history.push("/");
                    }}>
                        <Avatar size="small"
                            alt="首页" src={logo}
                        />
                    </span>
                    <EntitySelect className="width100" labelInValue selectVal={selectVal} placeholder="搜索条目关系" onChange={EntitySelectDone} />
                    <span className="searchIcon" title="搜索" onClick={() => {

                    }}>
                        <IconFontNew className="searchIconR" type="icon-search" onClick={search} />
                    </span>
                </Card>
            </Col>
            </span>
        </Row>
        <Row>
            <Col span={24}>
                <>
                {fetching&&(<Spin />)}
              {!fetching&&( <>
               {/* <EditMainPanel hideTagBar showRightDiv={false} reloadColorTime={4000} qdata={qdataquery} hidemini autofit readonly showLeftDiv={false}  showBar={false} ggstyle={{ width: '100%', height: '300px' }} /> */}
              <G6Panel  qdata={qdataquery}/>
              </>
              )}

                  

                    </>
            </Col>

        </Row>
        </span>
    </>);
}

export default KgQuery;