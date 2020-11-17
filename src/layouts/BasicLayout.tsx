/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
  PageHeaderWrapper,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history, Link, useIntl, connect, Dispatch } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button, Progress } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/favicon.png';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import KScroll from '@/components/MyCom/KScrollBar';
import QueueAnim from 'rc-queue-anim';

import NProgress from 'react-nprogress' // progress bar
import 'react-nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration


const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = ( // <DefaultFooter
  //   copyright=""
  //   links={[
  //     {
  //       key: 'Ant Design Pro',
  //       title: 'Ant Design Pro',
  //       href: 'https://pro.ant.design',
  //       blankTarget: true,
  //     },
  //     {
  //       key: 'github',
  //       title: <GithubOutlined />,
  //       href: 'https://github.com/ant-design/ant-design-pro',
  //       blankTarget: true,
  //     },
  //     {
  //       key: 'Ant Design',
  //       title: 'Ant Design',
  //       href: 'https://ant.design',
  //       blankTarget: true,
  //     },
  //   ]}
  // />
  <div />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const [show, setShow] = useState<boolean>(true);

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { } = useIntl();

  const getcontent=(children,key)=>{
    //children.key=key;
    return   <PageHeaderWrapper title={' '} key={key}>{children}</PageHeaderWrapper>;
  }

  return (
    <KScroll autohide>

      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link className="menuheader" to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}


        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path} >{defaultDom}</Link>;




        }}

        onPageChange={() => {
          // setShow(false);
          // setTimeout(() => {
          //   setShow(true);
          // }, 30);

          try {
            setShow(false);
            NProgress.start()

             setTimeout(() => {

              NProgress.done()

            //  setdata(!data);

               setShow(true);
             }, 710);
          } catch (error) {
           // message.error("脚本错误", error);
          } finally {
           
          }
        }}

        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
              <span>{route.breadcrumbName}</span>
            );

        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => {

          return <RightContent />

        }
        }
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
       
  

          <QueueAnim  duration={700}  animConfig={[
            { opacity: [1, 0], translateX: [0, -30] },
            { opacity: [1, 0], translateX: [0, 30] }
          ]}
          >
            {/* <div key={props.location?.pathname}
             style={{ width: "100%"}}>  */}
    {show ? getcontent(children,props.location?.pathname): null}
            {/* {children} */}
            {/* </div>  */}
          </QueueAnim>

        </Authorized>
      </ProLayout>
    </KScroll>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
