import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Divider, Spin, Popover } from 'antd';

import { isnull } from '@/utils/utils';
import { MinusOutlined } from '@ant-design/icons';
import { get as getAttr } from '@/pages/AttrList/service';

import _, { multiply } from 'lodash';
import AttrSelect from '@/components/MyCom/AttrSelect';
import { FormInstance } from 'antd/lib/form';
import ClsSelect from './ClsSelect';
import EntitySelect from './EntitySelect';

import { get as getEntity } from '@/pages/EntityList/service';
import { get as getCls } from '@/pages/KgClassList/service';


import './comstyle.less';
import { ColProps } from 'antd/es/grid/col';
import MoreAttr from './MoreAttr';

export interface MoreAttrProps {
    /**
     * 属性初始值
     */
    InitAttrs?: any[];
    BtnText?: string;
    BtnTitle?: string;
    labelCol?: ColProps;
    /**
     * 不能删除的属性
     */
    DefaultNoModifyAttrs?: any[];
    loading?: boolean;
    showAddDom: boolean | true;
    //只是展示，显示文本
    onlyShow: boolean | false;
}

export interface MoreAttrRefActionType {
    /**
     *  验证输入，返回属性
     * */
    validateForm: () => Promise<any[] | boolean | undefined>;

}

const { Item } = Form;

// 更多属性，自定义添加，多层嵌套纯显示
const MoreAttrInner:  React.FC<MoreAttrProps> = (props) => {


  return <MoreAttr {...props}  />

}

MoreAttrInner.defaultProps = {
    onlyShow: false
}


export default MoreAttrInner;