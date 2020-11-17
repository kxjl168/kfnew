
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, Spin } from 'antd';

import { query } from '../../pages/RelationList/service';
import { FormInstance } from 'antd/lib/form';
import { isnull } from '@/utils/utils';

export interface EditFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmit: (data: EditFormData) => void;
    title: string;
    values: Partial<TableListItem>;

}

export interface SelectProps {
    otherdata?: string;
    selectVal?: any[];
    onChange?: (val) => void;
    labelInValue?: boolean | false;
    config?: any;
    hideAddMore?: boolean;
    mutiSelect?: boolean;
    /**
     * 新建操作
     */
    onCreateNew?: (data: any) => void;
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

const Comp: React.FC<SelectProps> = (props) => {

    const [form] = Form.useForm();


    const [data, setData] = useState<Itemdata[]>([]);
    const [value, setValue] = useState<string[]>([]);
    const [fetching, SetFetching] = useState<boolean>(false);
    const [searchtext, SetSearchText] = useState<string>("");
    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });


    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option>)
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, style, onChange, selectVal, labelInValue, className, config, hideAddMore, mutiSelect, onCreateNew } = props;


    useEffect(() => {

        reloadList();

    }, []);

    // useEffect(() => {

    //     reloadList();

    // }, [selectVal]);

    const reloadList = () => {
        let txt = "";
        // if (selectVal)
        //   txt = selectVal.text;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if (data && data.data)
                data.data.forEach((item, index) => {
                    val.push({ text: item.name, value: item.id });
                })
            setData(val);
            setTimeout(() => {
                //  setValue(selectVal.value);
            }, 50);
        });
    }

    useEffect(() => {

        let newItems: Itemdata[] = [];
        let values: string[] = [];
        //     reloadList();
        if (!isnull(selectVal) && selectVal.length > 0) {
            selectVal.map((item) => {
                newItems.push(item);
                values.push(item.value);
            })

            newItems.concat(data);
            setData(newItems);

            //  debugger;
            if (labelInValue)
                setValue(selectVal)
            else
                setValue(values);
            // console.log(values);
        }
        else {
            // setValue(selectVal);
        }


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

    const handleSearch = (value) => {
        if (value) {
            fetch(value, data => {
                const val: Itemdata[] = [];
                if (data && data.data)
                    data.data.forEach((item, index) => {
                        val.push({ text: item.name, value: item.id });
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

        const selectItem = data.filter((item) => {
            for (let index = 0; index < value.length; index++) {
                if (item.value === value[index])
                    return true;
            }

        })
        // console.log(selectItem);
        // setSelectVal(selectItem);
        if (onChange)
            onChange(value, selectItem);


    }

    const handKeyInput = (key) => {
        if (key.key === 'Enter') {
            //console.log(searchtext);

            if(searchtext.trim()==="")
            return;

            let sdata= document.querySelector(".ant-select-item-option-active")?.querySelector(".ant-select-item-option-content");
           
            if(sdata)
            {
                //有按键下选。 
               // if(sdata.innerHTML.indexOf(searchtext))
                    SetSearchText("");//
               //console.log(sdata.innerHTML);
               //SetSearchText(sdata.innerHTML);
               return;
            }

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
                    // //没有，则回车弹出新增属性

                    if (onCreateNew) {
                        onCreateNew({
                            name: searchtext
                        })
                    }

                    // SetdefaultCreateAttrVal({
                    //    name:searchtext 
                    // })
                    // SetAttrModelVisible(true);
                }
                SetSearchText("");
            });

        }
    }

    const refreshValue = (fdata, uid) => {
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
                
                newvalue=_.uniq(newvalue,(item)=>{
                    return item.value;
                });
            }
            else {
                newvalue = value.concat(uid);
                newvalue=_.uniq(newvalue,(item)=>{
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
        <div>

            <Select

                {...config}


                className={className}
                labelInValue={labelInValue}
                defaultValue={selectVal}

                showSearch

                value={value}
                placeholder={placeholder}
                style={style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}

                searchValue={searchtext}
                onInputKeyDown={handKeyInput}
                onFocus={handleFoucus}


                notFoundContent={fetching ? <Spin size="small" /> : null}
            >
                {getoptions()}
            </Select>
        </div>
    );
};

export default Comp;
