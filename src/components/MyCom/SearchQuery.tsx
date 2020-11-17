
import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Select, Spin, AutoComplete } from 'antd';

import { searchtip } from '@/services/searchService';
import { FormInstance } from 'antd/lib/form';
import { isnull } from '@/utils/utils';

import { SelectProps as RcSelectProps } from 'rc-select';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { values } from 'lodash';
import _ from 'lodash';


export interface SearchQueryProps {
    otherdata?: string;
    selectVal?: any[];
    onChange?: (val) => void;
    onSearch?: (val) => void;

    onFocus?: () => void;

    config?: AutoCompleteProps;
    /**
     * 限定可选实体概念类型
     */
    clsId?: string;
    mutiSelect?: boolean;
    inputvalue?: string;

    placeholder?: string;
    className?: string;

    //(qdata:{keyword:string}
    /**
     * 下拉查询function
     */
    fetchHander?: (qdata: { keyword?: string }) => Promise<any>;

    /**
     * 下拉查询结果处理
     */
    rstDealHander?: (rstlst: any[]) => { text: string, value: string }[];
}

//图谱展示通用查询输入框
const SearchQuery: React.FC<SearchQueryProps> = (props) => {

    const [form] = Form.useForm();


    const [data, setData] = useState<Itemdata[]>([]);


    const dataRef=useRef();

    const [value, setValue] = useState<string>("");
    const [fetching, SetFetching] = useState<boolean>(false);
    const [searchtext, SetSearchText] = useState<string>("");
    //限定实体概念类型
    const [qclsId, SetQclsId] = useState<string>("");

    const [result, setResult] = useState<string[]>([]);
    //const [selectVal, setSelectVal] = useState<Itemdata>({ text: '', value: '' });
    const { placeholder, onFocus, onChange, selectVal, onSearch, className, inputvalue, config, clsId, mutiSelect, fetchHander, rstDealHander } = props;


    useEffect(()=>{
        dataRef.current=data;
    },[data]);


    const getoptions = () => {

        if (data) {
            if(dataRef.current)
            return  dataRef.current.map(d => <AutoComplete.Option key={d.key?d.key:d.value} value={d.text}>{d.text}</AutoComplete.Option>)

            return <></>
        }


        return <AutoComplete.Option value="" key="">无查询结果</AutoComplete.Option>;

    }




    useEffect(() => {
        setValue(inputvalue);
        // console.log(inputvalue)
    }, [inputvalue])

    useEffect(() => {

        //  reloadList();

    }, []);

    useEffect(() => {

        SetQclsId(clsId);

    }, [clsId])

    // useEffect(() => {

    //     reloadList();

    // }, [selectVal]);





    const submit = async () => {
        const fieldsValue = await form.validateFields();

        //setFormVals({ ...formVals, ...fieldsValue });

        onSubmit({ id: values.id, ...fieldsValue });
    }

    const fetch = (iputval, callback) => {
        SetFetching(true);
        let querydata = { pageSize: 20, fullNameFirst: 'true' };



        if (iputval)
            querydata.keyword = iputval.trim();

        if (fetchHander) {
            fetchHander(querydata).then((rst) => {
                //console.log(rst)
                callback(rst);
                SetFetching(false);
            });
        }
        else {
            searchtip(querydata).then((rst) => {
                //console.log(rst)
                callback(rst);
                SetFetching(false);

            });
        }
    }

    const handersearch = (value) => {
        //setData([])

        fetch(value, data => {
            let val: { text: string, value: string }[] = [];
            if (data && data.data) {

                if (rstDealHander) {

                    const r1=rstDealHander(data.data);
                    console.log(r1);
                    val= _.concat(val,r1);

                 }
                else {
                    data.data.forEach((item, index) => {
                        val.push({ text: item, value: item });
                    })
                }


            }
           // debugger;
           //console.log(val);
            setData(val)
        });
    }

    const onSelect = (v) => {
        // debugger;
        // setValue(v.name);
        // console.log("11111")
        if (onSearch)
            onSearch(v);
    }

    const onEnter = (open) => {
        if (!open && onSearch) {

            // console.log("2222")
            onSearch(value);
        }

    }



    const handleChange = (value) => {
        // debugger;
        setValue(value);


      

        if (onChange)
            onChange(value, null);

        //    console.log('onchage');


    }

    const handKeyInput = (key) => {
        if (key.key === 'Enter') {
            if (onSearch)
                onSearch(value);
        }
    }


    return (
        <div className="attrSelect">

            <AutoComplete

                onInputKeyDown={handKeyInput}


                value={value} defaultValue={value}

                // options={options}
                className={className}

                onSelect={onSelect}
                onChange={handleChange}


                onFocus={onFocus}

                  onSearch={handersearch}


                //</div> onChange={handleSearch}
                placeholder={placeholder || '问题 / 关键词 / 表达式 '}
            >

                {getoptions()}



            </AutoComplete>

            {/* <Select  



          
  labelInValue={labelInValue}
          
                showSearch
           
                placeholder={placeholder}
             
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
             

                searchValue={searchtext}
                onInputKeyDown={handKeyInput}
                onFocus={handleFoucus}

                notFoundContent={fetching ? <Spin size="small" /> : null}
            >
            
            </Select> */}
        </div>
    );
};

export default SearchQuery;
