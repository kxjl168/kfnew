/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/kb/kg/': {
     // target: 'http://192.168.1.66:8500/',
      target: 'http://192.168.1.194:8081/',
      //target: 'http://256kb.cn/',
      changeOrigin: true,
    //  pathRewrite: { '^': '/kg' },
    },
    // '/cloud-client/': {
    //   // target: 'http://192.168.1.66:8500/',
    //    target: 'http://192.168.1.194:8500/',
    //    changeOrigin: true,
    //    pathRewrite: { '^': '' },
    //  },

  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
 
};
