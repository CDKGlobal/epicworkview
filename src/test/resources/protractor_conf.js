// An example configuration file.
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  chromeOnly: true,
  chromeDriver: '../../../node_modules/protractor/selenium/chromedriver',

  baseUrl: 'http://localhost:2990/',
  
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
