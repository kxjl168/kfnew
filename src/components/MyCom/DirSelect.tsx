
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, Spin } from 'antd';

import { query } from '../../pages/DirList/service';
import { FormInstance } from 'antd/lib/form';
import { isnull } from '@/utils/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateForm from '@/pages/DirList/components/CreateForm';
import ProTable from '@ant-design/pro-table';
import { handleAdd } from '@/pages/DirList';
import uuid from '@/utils/uuid';
import { SelectProps as RcSelectProps } from 'rc-select';



export interface EditFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmit: (data: EditFormData) => void;
    title: string;
    values: Partial<TableListItem>;
    hiddenAddBtn?: boolean | true;
    hideAddMore?: boolean;

}

export interface SelectProps {
    otherdata?: string;
    selectVal?: any[];
    onChange?: (val) => void;
    labelInValue?: boolean | false;
    config?: RcSelectProps;
    mutiSelect?: boolean;

    /**
     * 新增语境model中是否隐藏连续增加
     */
    hideAddMore?: boolean;
    className?: string;

    /**
     * 隐藏右侧新增按钮
     */
    hiddenAddBtn?: boolean;

    /**
     * 外部领域联动查询  多个逗号分隔
     */
    subKgId?: string;

}
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const FormItem = Form.Item;


export interface Itemdata {
    text: string;
    value: string;
}

const DirSelect: React.FC<SelectProps> = (props) => {



    const [form] = Form.useForm();

    const [searchtext, SetSearchText] = useState<string>("");
    const [data, setData] = useState<Itemdata[]>([]);
    const [value, setValue] = useState<string>([]);
    const [fetching, SetFetching] = useState<boolean>(false);
    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });

    const [attrModelVisible, SetAttrModelVisible] = useState<boolean>(false);
    const [defaultCreateAttrVal, SetdefaultCreateAttrVal] = useState<any>();

    const [querySubKgIds, setquerySubKgIds] = useState<any>();

    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option>)
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, subKgId, style, onChange, selectVal, labelInValue, config, className, hiddenAddBtn, mutiSelect, hideAddMore } = props;


    useEffect(() => {

        setTimeout(() => {
            // debugger;
            if (!isnull(subKgId)) {
                if (subKgId instanceof Array) {
                    setquerySubKgIds(subKgId.toString());
                }
                else {
                    setquerySubKgIds(subKgId);
                }
            }
            else
                setquerySubKgIds("");
        }, 50);


    }, [subKgId])


    useEffect(() => {
        let txt = "";
        if (selectVal)
            txt = selectVal.label;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if (data && data.data)
                data.data.forEach((item, index) => {
                    val.push({ text: item.dirName, value: item.id });
                })
            setData(val);
            setTimeout(() => {
                // setValue(selectVal);
            }, 50);
        });

    

    }, []);

    useEffect(() => {

        let newItems: Itemdata[] = [];
        let values: string[] = [];
        //     reloadList();
        if (selectVal && (selectVal.length > 0) && (!isnull(selectVal[0].text))
        ) {
            selectVal.map((item) => {
                newItems.push(item);
                values.push(item.value);
            })

            newItems.concat(data);
            setData(newItems);

            if (labelInValue)
                setValue(selectVal)
            else
                setValue(values);
        }
        else {
            setValue(selectVal);
        }


    }, [selectVal]);



    const submit = async () => {
        const fieldsValue = await form.validateFields();

        //setFormVals({ ...formVals, ...fieldsValue });

        onSubmit({ id: values.id, ...fieldsValue });
    }

    const fetch = (iputval, callback) => {
        SetFetching(true);
        let querydata = { dirId: querySubKgIds };
        if (iputval)
            querydata.dirName = iputval.trim();



        query(querydata).then((rst) => {
            //console.log(rst)
            callback(rst);
            SetFetching(false);
        });
    }

    const handleSearch = (value) => {
        if (value) {
            fetch(value, data => {
                const val: Itemdata[] = [];
                if (data && data.data)
                    data.data.forEach((item, index) => {
                        val.push({ text: item.dirName, value: item.id });
                    })
                setData(val)
            });
        } else {
            setData([]);
        }

        SetSearchText(value);
    }

    const handleChange = (value) => {

        setValue(value);

        // const selectItem = data.filter((item) => {
        //     if (item.value === value)
        //         return true;
        // })
        // console.log(selectItem);
        // setSelectVal(selectItem);
        if (onChange)
            onChange(value);


    }

    const handleFoucus = () => {

        handleSearch(" ");

    }

    const handKeyInput = (key) => {
        if (key.key === 'Enter') {
            //console.log(searchtext);
            if (searchtext.trim() === "")
                return;


            let sdata = document.querySelector(".ant-select-item-option-active")?.querySelector(".ant-select-item-option-content");

            if (sdata) {
                //有按键下选。 
                // if(sdata.innerHTML.indexOf(searchtext))
                SetSearchText("");//
                //console.log(sdata.innerHTML);
                //SetSearchText(sdata.innerHTML);
                return;
            }


            SetSearchText(searchtext.trim());

            fetch(searchtext.trim(), data => {
                const val: Itemdata[] = [];
                let existVal;

                if (data && data.data)


                    //debugger;
                    data.data.forEach((item, index) => {
                        if (item.dirName === searchtext)
                            existVal = item;
                    })

                if (!isnull(existVal)) {
                    //回车选中
                    refreshValue(existVal, existVal.id);

                }
                else {
                    //没有，则回车弹出新增属性

                    SetdefaultCreateAttrVal({
                        dirName: searchtext
                    })
                    SetAttrModelVisible(true);
                }
                SetSearchText("");
            });

        }
    }

    const refreshValue = (fdata, uid) => {
        //更新数据源options
        let newdata = data.concat({ text: fdata.dirName, value: uid });
        setData(newdata);

        let newvalue = {};

        if (!mutiSelect) {
            //单选替换
            if (labelInValue)
                newvalue = { label: fdata.dirName, key: uid, text: fdata.dirName, value: uid };

            else
                newvalue = uid;
        }


        else if (value instanceof Array) { //多选
            if (labelInValue) {
                newvalue = value.concat({ label: fdata.dirName, key: uid, text: fdata.dirName, value: uid });
                newvalue = _.uniq(newvalue, (item) => {
                    return item.value;
                });
            }
            else {
                newvalue = value.concat(uid);
                newvalue = _.uniq(newvalue, (item) => {
                    return item;
                });
            }
        }


        setValue(newvalue);

        if (onChange)
            onChange(newvalue);
    }

    return (
        <div className="attrSelect">

            <Select
                {...config}
                className={className}
                onInputKeyDown={handKeyInput}
                labelInValue={labelInValue}
                defaultValue={selectVal}
                allowClear={true}
                showSearch



                searchValue={searchtext}
                onFocus={handleFoucus}
                value={value}
                placeholder={placeholder || '请输入关键字查询'}
                style={style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={fetching ? <Spin size="small" /> : null}
            >
                {getoptions()}
            </Select>

            <Button title="新增语境" hidden={hiddenAddBtn} onClick={() => {
                SetAttrModelVisible(true);
            }}>
                <PlusCircleOutlined />
            </Button>

            <CreateForm
                values={defaultCreateAttrVal}
                hideAddMore={hideAddMore}
                onSubmit={async (fdata) => {

                    //  const clsIdVal = fdata.clsId;
                    // debugger;
                    //console.log(JSON.stringify(clsIdVal));
                    let uid = uuid();
                    const rst = await handleAdd({ ...fdata, id: uid });
                    if (rst) {


                        if (fdata.shouldclose) {
                            SetAttrModelVisible(false);

                        }
                        else
                            message.info("可以修改数据继续添加!");

                        //更新数据源options
                        let newdata = data.concat({ text: fdata.dirName, value: uid });
                        setData(newdata);

                        // debugger;
                        let newvalue = {};

                        if (!mutiSelect) {
                            //单选替换
                            if (labelInValue)
                                newvalue = { label: fdata.dirName, key: uid, text: fdata.dirName, value: uid };

                            else
                                newvalue = uid;
                        }

                        else
                            if (value instanceof Array) { //多选
                                if (labelInValue) {
                                    newvalue = value.concat({ label: fdata.dirName, key: uid, text: fdata.dirName, value: uid });
                                    setValue(newvalue);
                                }
                                else {
                                    newvalue = value.concat(uid);

                                }
                            }


                        setValue(newvalue);

                        if (onChange)
                            onChange(newvalue);

                    }
                }}
                title="新建语境" onCancel={() => SetAttrModelVisible(false)} modalVisible={attrModelVisible} />


        </div>
    );
};

DirSelect.defaultProps = {
    hiddenAddBtn: true,
    mutiSelect: false
}

export default DirSelect;
