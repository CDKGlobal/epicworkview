// An example configuration file.
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  chromeOnly: true,
  chromeDriver: '../../../node_modules/protractor/selenium/chromedriver',

  //baseUrl: 'http://127.0.0.1:2990/jira/plugins/servlet/epic',
  //baseUrl: 'http://localhost:2990/jira/plugins/servlet/epic',
  baseUrl: 'http://sea-fanju2-m.ds.ad.adp.com:2990/jira/plugins/servlet/epic',
  
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'proxy': {
            'proxyType': 'direct'
        }
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['../java/it/com/cobalt/jira/plugin/epic/test/*Spec.js'],
  //specs: ['example_spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
  
  
};
