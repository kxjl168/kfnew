// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/s',
      component: '../layouts/SearchLayout',
      routes: [
       
        {
          name: 'search',
          path: '/s/search22',
          component: './KgQuery',
        },
        {
          name: 'search',
          path: '/s/search3',
          component: './KgQuery/D3',
        },
        {
          name: 'search',
          path: '/s/search',
          component: './KgQuery/KgSearch',
        },
        {
          name: 'blist',
          path: '/s/url',
          component: './BList',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/Welcome',
            },

         
            {
              path: '/mainhome',
              component: './Mainhome',
            
          },
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'smile',
              hideInMenu:true,
              component: './Packer',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin2'],



              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
               
                },
              ],
            },
            {
              name: 'list.table-list',
              icon: 'table',
              path: '/list',
              component: './ListTableList',
              authority: ['admin2'],
            },


            {
              "path": "/ontology",
              "name": "知识体系管理",
              "icon": "dashboard",
              authority: ['admin'],
              // authority: ['admin'],
              "routes": [
                {
                  name: '领域管理',
                  icon: 'table',
                  path: '/ontology/listSugGra',
                  component: './SubGraList',
                  authority: ['admin'],
                },
                {
                  name: '语境管理',
                  icon: 'table',
                  path: '/ontology/listDir',
                  component: './DirList',
                  authority: ['admin'],
                },
                {
                  name: '概念管理',
                  icon: 'table',
                  path: '/ontology/listKgClass',
                  component: './KgClassList',
                  authority: ['admin'],
                },
                {
                  name: '属性管理',
                  icon: 'table',
                  path: '/ontology/listAttr',
                  component: './AttrList',
                  authority: ['admin'],
                },
                {
                  name: '关系管理',
                  icon: 'table',
                  path: '/ontology/listRelation',
                  component: './RelationList',
                  authority: ['admin'],
                },
                {
                  hideInMenu:true,
                  name: '概念关系编辑',
                  icon: 'table',
                  path: '/ontology/graphic',
                  component: './GraphicO',
                },
              ]
            },


            {
              "path": "/kg",
              "name": "知识管理",
              authority: ['admin'],
              "icon": "dashboard",
              "routes": [
                {
                  name: '知识编辑',
                  icon: 'table',
                  path: '/kg/listSugGra',
                  component: './EntityList',
                },  
                {
                  hideInMenu:true,
                  name: '实体关系编辑',
                  icon: 'table',
                  path: '/kg/graphic',
                  component: './GraphicO',
                },
                {
                  hideInMenu:true,
                  name: '审核',
                  icon: 'table',
                  path: '/kg/auditGraphic',
                  component: './GraphicO/components/Audit',
                },
                {
                  name: '知识展示',
                  icon: 'table',
                  path: '/kg/search',
                 // redirect: '/s/search',
                 component: './KgQuery/redirectSearch',
                }, 
                
              ]
            },
          

            {
              "path": "/wkspace",
              "name": "工作台",
              authority: ['admin', 'user'],
              // hideInMenu:true,
              "icon": "dashboard",
              "routes": [
                {
                  name: '所有改动',
                  icon: 'table',
                  path: '/wkspace/listModify',
                  component: './ModifyList',
                  authority: ['user','admin'],
                },  
                {
                
                  name: '改动提交',
                  icon: 'table',
                  path: '/wkspace/listDone',
                  component: './ModifyList/doneIndex',
                  authority: ['user','admin'],
                },
                {
                
                  name: '待审核',
                  icon: 'table',
                  path: '/wkspace/listAudit',
                  component: './ModifyList/auditIndex',
                  authority: ['admin'],
                },
                {
                
                  name: '已审核',
                  icon: 'table',
                  path: '/wkspace/listAuditDone',
                  component: './ModifyList/auditDoneIndex',
                  authority: ['admin'],
                },
               
                
              ]
            },

            
           
           
            {
              name: '知识图谱',
              icon: 'table',
              path: '/kgdemo',
              component: './Packer',
            },
            {
              name: '另外一个',
              icon: 'table',
              authority: ['admin'],
              path: '/vue',
              component: './Packer/vue',
            },
          

            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
