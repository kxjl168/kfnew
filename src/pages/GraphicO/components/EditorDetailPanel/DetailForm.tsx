import React, { useState, useRef, createRef } from 'react';
import { Card, Input, Select, Form, Button, Divider, Row, Popover, Tooltip } from 'antd';
import { withPropsAPI } from 'gg-editor';

import './index.less';
import { isnull } from '@/utils/utils';
import { withRouter, connect, GraphicState, Link } from 'umi';
import { ConnectState } from '@/models/connect';
import { DoubleRightOutlined } from '@ant-design/icons';
import MoreAttr from '@/components/MyCom/MoreAttr';

import { get as getEntity } from '@/pages/EntityList/service';
import { get as getCls } from '@/pages/KgClassList/service';
import { IconFontNew } from '@/components/MyCom/KIcon';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

interface DetailFormProps {
  type: string;
  propsAPI?: any;
  graphicModel: GraphicState;
  readonly?:boolean;
}

class DetailForm extends React.Component<DetailFormProps> {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  constructor(prop) {
    super(prop);
    this.init();
  }

  init = () => {
    const { readonly } = this.props;

    this.state = {
      initAtts: [],
      showBtn: false,
      loading: false,
      readonly:readonly
      
    }


  }

  handleFieldChange = (values: any) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };


  getTags = (model) => {


    if ((model.tags instanceof Array) && model.tags.length > 0) {
      return model.tags.map(item => {
        return <><span className="ant-tag ant-tag-has-color" style={{ backgroundColor: item.value.split('-')[item.value.split('-').length-1] }}>{item.label}</span></>
      });
    }

    if (model.clsName)
      return <>{model.clsName}</>;


  }

  renderNodeDetail = () => {
    const { label, attrs, attrNames } = this.item.getModel();
    const model = this.item.getModel();

    // debugger;
    const { graphicModel } = this.props;
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;


    /**
     * 显示属性，
     * 处理普通属性，实体/概念属性
     * @param attr 
     */
    const getAttrDom = (attr) => {


      // const [attrs, setAttrs] = useState<any>()
      /// const [loadingAttr, setloadingAttr] = useState<boolean>(true);

      let loading = false;
      let attrs = [];


      const aref = createRef<MoreAttr>();
      const bref = createRef<Button>();

      let dom = <></>

      dom = <>{attr.value}</>;

      const attrrule = (attr.rule instanceof Object) ? attr.rule : JSON.parse(attr.rule);

      if (attr.value instanceof Object) // attr.rule
      {
        if (attrrule && attrrule.id === "1")//概念类型
        {

          const clsdoms = attr.value.map((item) => {
            return (<Popover
              onVisibleChange={() => {
                setTimeout(async () => {

                  this.setState({ loading: true });
                  let clsData = await getCls(item.key);
                  this.setState({ loading: false });
                  loading = false;
                  if (clsData && clsData.success && clsData.data) {


                    if (!isnull(clsData.data.properties)) {
                      this.setState({ initAtts: clsData.data.properties });
                    }

                  }

                }, 50);

              }}
              // trigger="click"
              title={`${item.label}[概念]`} content={
                <>
                  <MoreAttr labelCol={{ span: 6 }} onlyShow loading={this.state.loading} showAddDom={false} InitAttrs={this.state.initAtts} />
                </>

              }>
              <a > {item.label}</a>
            </Popover>);
          }
          );

          dom = <>{clsdoms}          </>
        }
        else if (attrrule && attrrule.id === "2")//实体类型
        {


          dom = <>
            <Popover
              onVisibleChange={() => {
                setTimeout(async () => {

                  this.setState({ loading: true });
                  let clsData = await getEntity(attr.value.key);
                  this.setState({ loading: false });
                  loading = false;
                  if (clsData && clsData.success && clsData.data) {


                    if (!isnull(clsData.data.properties)) {
                      this.setState({ initAtts: clsData.data.properties });
                    }

                  }

                }, 50);

              }}
              // trigger="click"
              title={`${attr.value.label}[实体]`} content={
                <>
                  <MoreAttr labelCol={{ span: 4 }} onlyShow loading={this.state.loading} showAddDom={false} InitAttrs={this.state.initAtts} />
                </>

              }>
              <a > {attr.value.label}</a>
            </Popover>
          </>
        }
      }

      return dom;
    }

    if (graphicModel.graphicType === "cls") {
      return (
        <Form initialValues={{ label }}>
          <Item label="概念名称:" name="label" {...inlineFormItemLayout}>
            {/* <Input onBlur={this.handleInputBlur('label')} /> */}

            <div>{label} {model.localmodify?<><span style={{color:'blue'}}>[本地已修改]</span></>:''}</div>
          </Item>

          {/* <Divider plain>属性</Divider> */}
          <div className="attrdv">

     

            {

              !isnull(attrNames) && (

                <Item label={'属性'} name="label"  >
                  <div>{attrNames}</div>

                </Item>




              )

            }
          </div>

        </Form>


      );
    }

    return (
      <Form className="attrpanel" labelCol={{ span: 8 }} >
        <div className="attrdv">
          <Item label="" name="label">
            {/* <Input onBlur={this.handleInputBlur('label')} /> */}

            <div>{label} {model.localmodify?<><span style={{color:'blue'}}>[本地已修改]</span></>:''} </div>
          </Item>
          <div> {this.getTags(model)}</div>
        </div>
        <Divider plain>属性</Divider>
        <div className="attrdv">
        <MoreAttr  onlyShow  showAddDom={false} InitAttrs={attrs} />

          {/* {

            !isnull(attrs) && (attrs instanceof Array) && (



              attrs.map((attr) => {


                return (<Item label={attr.label} name="label"  >
                  <div>{getAttrDom(attr)}</div>

                </Item>
                )
              }

              )
            )

          } */}
        </div>

        {!this.state.readonly && (
<>
        <Divider plain>操作</Divider>
        <Row className="actiondv">
          <Tooltip title="修改实体">
          <Button onClick={() => {
            executeCommand('editnode');
          }}><IconFontNew  style={{fontSize:25}} type="icon-entity" /></Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="修改属性">
          <Button onClick={() => {
            executeCommand('editnodeattr');
          }}><IconFontNew   style={{fontSize:25}}  type="icon-attr" /></Button>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="修改标签">
          <Button onClick={() => {
            executeCommand('edittag');
          }}><IconFontNew  style={{fontSize:25}}  type="icon-tag" /></Button>
          </Tooltip>
        </Row>
        </>
)}

        <Row>
         


        </Row>


      </Form>
    );

  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth', attrs,localmodify } = this.item.getModel();

    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    return (
      <Form className="attrpanel" labelCol={{ span: 5 }} initialValues={{ label, shape }}>
        <div className="attrdv">
          <Item label="" name="label">
            {/* <Input onBlur={this.handleInputBlur('label')} /> */}
    <div>{label} {localmodify?<><span style={{color:'blue'}}>[{localmodify}]</span></>:''}</div>

          </Item>
        </div>


        <Divider plain>属性</Divider>
        <div className="attrdv">
        <MoreAttr  onlyShow  showAddDom={false} InitAttrs={attrs} />
      </div>

        {/* <Divider plain>属性</Divider>
        <div className="attrdv">
          {

            !isnull(attrs) && (attrs instanceof Array) && (



              attrs.map((attr) => {


                return (<Item label={attr.label} name="label"  >
                  <div>{attr.value}</div>

                </Item>
                )
              }

              )
            )

          }
        </div> */}
   {!this.state.readonly && (
<>
        <Divider plain>操作</Divider>
        <Button onClick={() => {
          executeCommand('editrelation');
        }}>修改关系</Button>
        <Divider type="vertical" />
        <Button onClick={() => {
          executeCommand('editrelationattr');
        }}>修改属性</Button>

        {/* <Item label="Shape" name="shape" {...inlineFormItemLayout}>
          <Select onChange={(value) => this.handleFieldChange({ lineType: value })}>

          <Option value="C">曲线</Option>
          <Option value="Q">贝塞尔弧线</Option>
          <Option value="A">椭圆弧线</Option>
            <Option value="L">直线</Option>

        
          </Select>
        </Item> 

        <div>
        <svg width="200px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">
  
  <path d="M30 50 A 50 30 0 0 1 130 50"/>

  
  <circle cx="10" cy="10" r="2" fill="red"/>
  <circle cx="90" cy="90" r="2" fill="red"/>
  <circle cx="90" cy="10" r="2" fill="red"/>
  <circle cx="10" cy="90" r="2" fill="red"/>

</svg>

          </div> */}

        {/* <Option value="flow-smooth">Smooth</Option>
            <Option value="custom-line">自定义</Option>
            <Option value="CustomLine2">自定义2</Option>
            <Option value="flow-polyline">Polyline</Option>
            <Option value="flow-polyline-round">Polyline Round</Option> */}

</>
   )}


      </Form>
    );
  };

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }

    return (
      <>

        <Card type="inner" size="small" title={'详细'} bordered={false}>


          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}

        </Card>
      </>
    );
  }
}

//export default withPropsAPI(DetailForm as any);

export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(withRouter(withPropsAPI(DetailForm)));
