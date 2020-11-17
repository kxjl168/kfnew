import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input } from 'antd';
import React, { useState, useRef, cloneElement } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone } from '@/utils/utils';


import EditForm, { EditFormData } from './components/EditForm';

import TestDom from './components/TestDom';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data.d';
import { get, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';
import Model from '@/models/login';
import Modal from 'antd/lib/modal/Modal';

import styles from './style.less';
import GGEditorCore from './gg';


 class Editor extends GGEditorCore {
  constructor(options) {
    super(options);


  }
}


const Test: React.FC<{}> = () => {

  let config = {};

  let d = new Editor(config);

  console.log(d);


  return (
    <PageHeaderWrapper>
      <div>test</div>
    </PageHeaderWrapper>
  );
};

export default Test;
