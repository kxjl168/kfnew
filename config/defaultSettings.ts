import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
  wsPre:string;
};


const { REACT_APP_ENV } = process.env;


const proSettings: DefaultSettings = {
  //navTheme: 'dark',
  // 拂晓蓝
  // primaryColor: '#1890ff',
  // layout: 'sidemenu',
  contentWidth: 'Fluid',

  navTheme: "dark",
  primaryColor: "#1890ff",
  layout: "sidemenu",


  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '喵的测试实验室',
  pwa: false,
  iconfontUrl: '',

 

};


{
 
}



export type { DefaultSettings };

export default proSettings;
