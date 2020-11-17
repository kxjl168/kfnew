
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, Spin, Tag } from 'antd';

import { query,saveList } from '@/services/tagService';

import { isnull } from '@/utils/utils';
import { random } from 'lodash';

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
    const [value, setValue] = useState<string>();
    const [fetching, SetFetching] = useState<boolean>(false);
    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });


    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option>)
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, style, onChange, selectVal, labelInValue, className, config } = props;


    useEffect(() => {
        let txt = "";
        if (selectVal)
            txt = selectVal.label;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if (data && data.data)
                data.data.forEach((item, index) => {
                    val.push({ text: item.name, value: item.id });
                })
            setData(val);
            setTimeout(() => {
                //   setValue(selectVal);
            }, 50);
        });

        // console.log("select:+" +selectVal);
        //setValue(selectVal);

        // setTimeout(() => {
        //  setValue(selectVal);
        // }, 50);

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
    }

    const saveNewTag = (value) => {
        saveList(JSON.stringify(value))
    }

    const handleChange = (value) => {
     //   console.log("tagchanged!");
     //   console.log(value);
        setValue(value);

        const selectItem = data.filter((item) => {
            if (item.value === value)
                return true;
        })

        saveNewTag(value);


        if (onChange)
            onChange(value, selectItem);


    }

    function tagRender(props) {
        const { label,value,closable,onClose} = props;
      
        if(isnull(label))
        return <></>
        
        let color="#fff";
        try {
            const vals= value.split('-');
            color = vals[vals.length-1];
            
        } catch (error) {
            
        }
      
    
        return (
          <Tag color={color} closable={closable} onClose={onClose}  style={{ marginRight: 3 }}>
            {label}
          </Tag>
        );
      }
      

    return (
        <div>

            <Select className={className}
            tagRender={tagRender}
                {...config}
                labelInValue={labelInValue}
                defaultValue={selectVal}
                allowClear={true}
                showSearch

                value={value}
                placeholder={placeholder}
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
        </div>
    );
};

export default Comp;
