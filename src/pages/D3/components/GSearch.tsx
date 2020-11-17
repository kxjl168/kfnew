
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, Spin } from 'antd';


import { FormInstance } from 'antd/lib/form';
import { isnull } from '@/utils/utils';

import {SelectProps as RcSelectProps } from 'rc-select';




export interface GSearchProps  {
    otherdata?: string;
    selectVal?: any[];
    onChange?: (val) => void;
    labelInValue?:boolean|false;
    config?:RcSelectProps;
 
    mutiSelect?:boolean;

    placeholder?:string;
    className?:string;
    style?:string;

    query:(txt:string)=>Promise<any>;
}

const GSearch: React.FC<GSearchProps> = (props) => {

    const [form] = Form.useForm();


    const [data, setData] = useState<Itemdata[]>([]);
    const [value, setValue] = useState<string[]>([]);
    const [fetching, SetFetching] = useState<boolean>(false);
    const [searchtext,SetSearchText]=useState<string>("");

    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });


    const getoptions = () => {

        if (data) {
            return data.map(d => <Option key={d.value} >{d.text}</Option> )
        }
        else
            return <Option>无查询结果</Option>;

    }


    const { placeholder, style, query,onChange ,selectVal,labelInValue,className,config,mutiSelect } = props;
 

    useEffect(() => {
       
        reloadList();

    }, []);



    const fetch = (iputval, callback) => {
        SetFetching(true);
        let querydata={pageSize:20,fullNameFirst:'true'};
        


        if(iputval)
            querydata.name=iputval.trim();

        query(querydata).then((rst) => {
            
           // console.log(rst);
            callback(rst);
            SetFetching(false);
        });
    }
    const reloadList= ()=>{
        let txt = "";
       // if (selectVal)
         //   txt = selectVal.text;
        fetch(txt, data => {
            const val: Itemdata[] = [];
            if(data&&data.data)
            data.data.forEach((item, index) => {
                val.push({ text: item.name, value: item.id });
            })
            setData(val);
           
        });
    }

  
    



    const handleSearch = (value) => {
        if (value) {
            fetch(value, data => {
                const val = [];
                if(data&&data.data)
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

        if (onChange)
            onChange(value);

        
    }

    const handKeyInput=(key)=>{
        if(key.key==='Enter')
        {
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
            
            //console.log(searchtext);

            fetch(searchtext, data => {
                const val: Itemdata[] = [];
                let existVal;
                if (data && data.data)



                    data.data.forEach((item, index) => {
                        if(item.name===searchtext)
                        existVal=item;
                    })

                    if(!isnull(existVal))
                    {
                        //回车选中
                        refreshValue(existVal,existVal.id);
                       
                    }
                    else{
                        // //没有，则回车弹出新增属性

                        // SetdefaultCreateAttrVal({
                        //    name:searchtext 
                        // })
                        // SetAttrModelVisible(true);
                    }
                    SetSearchText("");
            });

        }
    }

    const refreshValue=(fdata,uid)=>{
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
    const handleFoucus=()=>{
       
        handleSearch(" ");
    
   }


    return (
        <div className="attrSelect">

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

export default GSearch;
