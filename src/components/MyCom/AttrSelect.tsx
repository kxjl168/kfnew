
import React, { useState, useEffect, forwardRef } from 'react';
import { Form, Modal, Button, Input, Select, message, Spin, Tag } from 'antd';

import { query, add } from '../../pages/AttrList/service';
import { FormInstance } from 'antd/lib/form';
import { PlusCircleOutlined } from '@ant-design/icons';

import CreateForm from '@/pages/AttrList/components/CreateForm';
import { attrColumn } from '@/pages/AttrList/index';

import './comstyle.less';
import ProTable from '@ant-design/pro-table';
import { TableListItem } from '@/pages/AttrList/data';
import uuid from '@/utils/uuid';
import { isnull } from '@/utils/utils';
import { Item } from 'gg-editor';

export interface EditFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmit: (data: EditFormData) => void;
    title: string;
    values: Partial<TableListItem>;

}

const { Option } = Select;

export interface SelectProps {
    otherdata?: string;
    selectVal?: any[];
    onChange?: (val) => void;
    labelInValue?: boolean | false;
    ishiddenAddBtn?: boolean | false;
    hideAddMore?: boolean;

    /**
     * 不可修改选项
     */
    disableAttrList?; any;
}
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const FormItem = Form.Item;


export interface Itemdata {
    text: string;
    value: string;
    disabled?: boolean | false;
}

const Comp: React.FC<SelectProps> = (props) => {

    const [form] = Form.useForm();


    const [attrModelVisible, SetAttrModelVisible] = useState<boolean>(false);

    const [data, setData] = useState<Itemdata[]>([]);
    const [searchtext, SetSearchText] = useState<string>("");
    const [value, setValue] = useState<any[]>([]);
    const [fetching, SetFetching] = useState<boolean>(false);

    const [disableList, SetDisableList] = useState<any>();
    const [hiddenAddBtn, SetHiddenAddBtn] = useState<boolean>(false);
    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });

    const [defaultCreateAttrVal, SetdefaultCreateAttrVal] = useState<any>();


    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} value={d.value} disabled={d.disabled || false}  >{d.text}</Option>)
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, style, onChange, config, selectVal, labelInValue, disableAttrList, className, ishiddenAddBtn, mutiSelect, hideAddMore } = props;


    useEffect(() => {

        setTimeout(() => {
            // debugger;
            if (disableAttrList instanceof Array) {
                SetDisableList(disableAttrList);
            }
            else {
                if (!isnull(disableAttrList)) {
                    let lst = disableAttrList.split(",");
                    SetDisableList(lst);
                }
            }
        }, 20);


    }, [props.disableAttrList]);

    // useEffect(() => {
    //     let txt = "";
    //     if (selectVal)
    //         txt = selectVal.label;
    //     fetch(txt, data => {
    //         const val: Itemdata[] = [];
    //         if(data&&data.data)
    //         data.data.forEach((item, index) => {
    //             val.push({ text: item.name, value: item.id });
    //         })
    //         setData(val);
    //         setTimeout(() => {
    //               setValue(selectVal);
    //          }, 50);
    //     });

    //    // console.log("select:+" +selectVal);
    //     //setValue(selectVal);

    //     // setTimeout(() => {
    //        //  setValue(selectVal);
    //    // }, 50);

    // }, []);
    const reloadList = () => {
        let txt = "";
        console.log("reloadlist");
        //if (selectVal)
        // txt = selectVal.text;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if (data && data.data)
                data.data.forEach((item, index) => {

                    let disable = _.find(disableList, (ditem) => {
                        return ditem === item.id
                    })


                    val.push({ text: item.name, value: item.id, disabled: disable ? true : false });
                })
            setData(val);
            setTimeout(() => {
                // if(selectVal)
                // setValue(selectVal.value);
            }, 50);
        });
    }
    useEffect(() => {

        reloadList();

        SetHiddenAddBtn(ishiddenAddBtn);

    }, []);

    useEffect(() => {
      //  console.log("useEffect:selectVal");
        setTimeout(() => {
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
                // setValue(selectVal);
            }
        }, 10);
      


    }, [selectVal]);






    const submit = async () => {
        const fieldsValue = await form.validateFields();

        //setFormVals({ ...formVals, ...fieldsValue });

        onSubmit({ id: values.id, ...fieldsValue });
    }

    const fetch = (iputval, callback) => {
        SetFetching(true);
        let querydata = null;
        if (iputval)
            querydata = { name: iputval.trim() };
        query(querydata).then((rst) => {
            //console.log(rst)
            callback(rst);
            SetFetching(false);
        });
    }

    //上级概念属性不可删除
    function tagRender(props) {
        const { label, value, closable, onClose } = props;

        let disable = _.find(disableList, (ditem) => {
            return ditem === value
        })

        return (
            <Tag className="attrTag" closable={disable ? false : true} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    }


    const handleSearch = (value) => {
        
        if (value) {
            console.log("handleSearch :"+value);
            fetch(value, data => {
                const val: Itemdata[] = [];
                if (data && data.data)
                    data.data.forEach((item, index) => {


                        let disable = _.find(disableList, (ditem) => {
                            return ditem === item.id
                        })

                        val.push({ text: item.name, value: item.id, disabled: disable ? true : false });

                    })
                setData(val)
            });

           
        } else {
            console.log("handleSearch null");
            setData([]);
        }

        SetSearchText(value);
        
    }
    const handleAdd = async (fields: TableListItem) => {
        const hide = message.loading('正在添加');
        try {
            let rst = await add({ ...fields });
            if (rst && rst.success) {
                hide();

                // console.log(rst);

                message.success('添加成功');
                return rst;
            }
            else
                return false
        } catch (error) {
            hide();
            message.error('添加失败请重试！');
            return false;
        }
    };


    const handleChange = (value) => {


        setValue(value);

        const selectItem = data.filter((item) => {
            if (item.value === value)
                return true;
        })
        //  console.log(selectItem);
        // setSelectVal(selectItem);
        if (onChange)
            onChange(value, selectItem);


    }

    const handKeyInput = (key) => {
        if (key.key === 'Enter') {

            let sdata = document.querySelector(".ant-select-item-option-active")?.querySelector(".ant-select-item-option-content");

            if (sdata) {
                //有按键下选。 
                // if(sdata.innerHTML.indexOf(searchtext))
                SetSearchText("");//
                //console.log(sdata.innerHTML);
                //SetSearchText(sdata.innerHTML);
                return;
            }

            //console.log(searchtext);

            if (searchtext.trim() === "")
                return;

            fetch(searchtext, data => {
                const val: Itemdata[] = [];
                let existVal;
                if (data && data.data)



                    data.data.forEach((item, index) => {
                        if (item.name === searchtext)
                            existVal = item;
                    })

                if (!isnull(existVal)) {
                    //回车选中
                    refreshValue(existVal, existVal.id);

                }
                else {
                    //没有，则回车弹出新增属性

                    SetdefaultCreateAttrVal({
                        name: searchtext
                    })
                    SetAttrModelVisible(true);
                }
                SetSearchText("");
            });

        }

        if (key.key === "ArrowDown" || key.key === "ArrowUp") {
            let sdata = document.querySelector(".ditem ")?.querySelector(".ant-select-item-option-active")?.querySelector(".ant-select-item-option-content");
            // console.log(sdata);
            if (sdata) {
                //console.log(sdata.innerHTML);

                //   console.log(data[0].innerText);
                //    SetSearchText(data[0].innerText)
            }

        }
    }

    const refreshValue = (fdata, uid) => {
        console.log("refreshValue");
        //更新数据源options
        let newdata = data.concat({ text: fdata.name, value: uid });
        setData(newdata);

        let newvalue = {};

        if (!mutiSelect) {
            //单选替换
            if (labelInValue)
                newvalue = { label: fdata.name, key: uid, text: fdata.name, value: uid };

            else
                newvalue = uid;
        }


        else if (value instanceof Array) { //多选
            if (labelInValue) {
                newvalue = value.concat({ label: fdata.name, key: uid, text: fdata.name, value: uid });
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
    const handleFoucus = () => {

        handleSearch(" ");

    }


    return (
        <div className="attrSelect">

            <Select

                tagRender={tagRender}
                labelInValue={labelInValue}
                defaultValue={selectVal}
                {...config}
                showSearch
                onFocus={handleFoucus}
                searchValue={searchtext}
                className={className}
                value={value}
                placeholder={'请输入或者选择属性'}


                style={style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onInputKeyDown={handKeyInput}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={fetching ? <Spin size="small" /> : null}



            >
                {getoptions()}
            </Select>
            <Button title="新增属性" hidden={hiddenAddBtn} onClick={() => {
                SetAttrModelVisible(true);
            }}>
                <PlusCircleOutlined />
            </Button>

            <CreateForm title="新建属性"
                hideAddMore={hideAddMore}
                values={defaultCreateAttrVal}
                onSubmit={async (fdata) => {

                    //   const clsIdVal = fdata.clsId;
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


                        refreshValue(fdata, uid);


                    }
                }}

                onCancel={() => SetAttrModelVisible(false)} modalVisible={attrModelVisible} />

        </div>
    );
};

Comp.defaultProps = {
    mutiSelect: true,
}

export default forwardRef(Comp);
