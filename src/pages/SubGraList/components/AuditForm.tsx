import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Row, Timeline, Steps, message, Spin, Tooltip, Alert } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from '../data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';
import { subCol } from '../index';

import { isnull } from '@/utils/utils';
import MoreAttr from '@/components/MyCom/MoreAttr';
import Col from 'antd/es/grid/col';
import { IconFontNew } from '@/components/MyCom/KIcon';
import Icon, { UserOutlined, LoadingOutlined, SolutionOutlined, CloseOutlined, FormOutlined, ReadOutlined, PlusOutlined, ArrowDownOutlined, ArrowUpOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { get as getSub, update, audit } from '../service';
import { get as getEditSub } from '../editservice';

import { TableListItem as EditData } from '../../ModifyList/data';
import AuditForm from '@/components/MyCom/AuditForm';
import { changeConfirmLocale } from 'antd/es/modal/locale';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;

  value: EditData;
  /**
   * 只读，已审核的只能看
   */
  readonly?: boolean;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;


interface actionitem {
  userid: string;
  username: string;
  editdate: string;
  editaction: string;
  dataid: string;
}


const SubAuditForm: React.FC<EditFormProps> = (props) => {


  const { modalVisible, onCancel, title, onSubmit, value, readonly } = props;

  const checkChange =async (value, initValue) => {

    let change = false;

    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const vnew = value[key];
      const vold = initValue[key];
      if (vnew !== vold) {

        change = true;
        break;
      }

    }


    return change;
  }

  return (
    <>
      <AuditForm formlabelCol={{ span: 5 }} fname="领域"
        readonly={readonly} title={title}
        tableCololds={subCol}
        tableCols={subCol}
        modalVisible={modalVisible}
        onCancel={onCancel}
        onSubmit={onSubmit}

        value={value} checkChange={checkChange} getSub={getSub} getEditSub={getEditSub} audit={audit} />
    </>
  );


};

export default SubAuditForm;
