
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select } from 'antd';

import { query } from '@/services/proTypeService';

export interface EditFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmit: (data: EditFormData) => void;
    title: string;
    values: Partial<TableListItem>;
}

export interface SelectProps  {
    otherdata?: string;
    selectVal?: string;
    onChange?: (val) => void;
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
    const [value, setValue] = useState<string>('');

    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });


    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option> )
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, style, onChange ,selectVal } = props;
 

    useEffect(() => {
        let txt = "";
        if (selectVal)
            txt = selectVal.text;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if(data&&data.data)
            data.data.forEach((item, index) => {
                val.push({ text: item.name, value: item.id });
            })
            setData(val);
            setTimeout(() => {
                  setValue(selectVal);
             }, 50);
        });

       // console.log("select:+" +selectVal);
        //setValue(selectVal);

        // setTimeout(() => {
           //  setValue(selectVal);
       // }, 50);

    }, []);

   

    const submit = async () => {
        const fieldsValue = await form.validateFields();

        //setFormVals({ ...formVals, ...fieldsValue });

        onSubmit({ id: values.id, ...fieldsValue });
    }

    const fetch = (iputval, callback) => {
        let querydata=null;
       
            querydata={name:iputval?iputval.trim():'',pageSize:20};
        query(querydata).then((rst) => {
            //console.log(rst)
            callback(rst);
        });
    }

    const handleSearch = (value) => {
        if (value) {
            fetch(value, data => {
                const val: Itemdata[] = [];
                if(data&&data.data)
                data.data.forEach((item, index) => {
                    val.push({ text: item.name, value: item.id });
                })
                setData(val)
            });
        } else {
            setData([]);
        }
    }

    const handleChange = (value) => {

        setValue(value);

        const selectItem = data.filter((item) => {
            if (item.value === value)
                return true;
        })
        // console.log(selectItem);
       // setSelectVal(selectItem);
        if (onChange)
            onChange(value,selectItem);

    }

    return (
        <div>

            <Select

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
                notFoundContent={''}
            >
                {getoptions()}
            </Select>
        </div>
    );
};

export default Comp;
