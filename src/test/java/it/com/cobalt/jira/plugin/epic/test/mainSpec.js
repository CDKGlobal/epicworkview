
describe('Jira Epic Plugin: main page', function() {
  var ptor;
//  var EpicPluginPage = require('EpicPluginPage.js');
  
  beforeEach(function() {
  
    
    ptor = protractor.getInstance();
    ptor.ignoreSynchronization = true;
    browser.ignoreSynchronization = true;
    ptor.get(ptor.baseUrl+'jira/plugins/servlet/epic');
    ptor.sleep(1000);
  });
  
  function login(){
  	element(by.id('login-form-username')).sendKeys('admin');
  	element(by.id('login-form-password')).sendKeys('admin\n');
  	//EpicPluginPage.username.sendKeys('admin');
  	//EpicPluginPage.password.sendKeys('admin\n');
  }  
  
  
  // after login, test the main page has the Epic Plugin link and can link to the plugin
  it('should navigate to the Epic Plugin page when clicking the link', function() {
  	login();
  	element(by.id('epic-plugin-link')).click();
  	//EpicPluginPage.pluginLink.click();
  	ptor.getCurrentUrl().
  		then(function(url){
  			expect(url).toMatch(/\/epic/);
  		})
  });
  
  // test the main page has the 'full' button
  // after clicking the full, the screen becomes full screen
  it('should become full screen after clicking the full button', function(){
  	var ele = by.id('Full button');
  	expect(ptor.isElementPresent(ele)).toBe(true);
  	element(ele).click();
  	var ele1 = by.id('epic-plug-link');
  	ptor.sleep(3000);
  	expect(ptor.isElementPresent(ele1)).toBe(false);
  	// test the filter disappear after pressing 'full' button
  	expect(element(by.id('Filter button')).isDisplayed()).toBeFalsy();
  	// test the day choice box disappear
  	expect(element(by.model('filterDays')).isDisplayed()).toBeFalsy();
  });
	
  // test all the projects last updated in 14 days are displayed	
  xit('should list all projects', function(){
  	var elems = element.all(by.repeater('project in timeOrderedProjects()'));
  	expect(elems.count()).toBe(2);
  	
  });
  
  
  // test the contributors image showed in the project
  xit('includes the contributor icon image per-element', function() {
  	var elems = element.all(by.repeater('project in timeOrderedProjects()'));
  	elems.first().then(function(elm) {
    	elm.element(by.tagName('img')).then(function(img) {
      		img.getAttribute('src').then(function(src) {
        	expect(src).toMatch(/useravatar/);
     		});
    	})
  	});
  });
  
  
  // change the last updated option to 1 day 
  // test no project are updated within 1 day
  xit('should has no project updated within 1 day', function() {
  	ptor.findElement(protractor.By.css('select option:nth-child(1)')).click();
    var elems = element.all(by.repeater('project in timeOrderedProjects()'));
  	expect(elems.count()).toBe(2);
  	
  });
  
  // click the filter button, the pop up dialog should appear
  xit('should has filter text input box exists when clicking the filter button', function() {
  	element(by.id('Filter button')).click();
    var ele = by.id('filter input');
    expect(ptor.isElementPresent(ele)).toBe(true);
  	
  });
  
  // test input text into the text filter, only one project option appear in the checkbox
  xit('should only appear 1 project when inputting text in the filter text box', function() {
  	element(by.id('Filter button')).click();  	
  	element(by.model('searchText.name')).sendKeys('pro');
	ptor.sleep(1000);
    
    // Verify that now there is only one item in the alphabeticalProjects   
  	var elems = element.all(by.repeater('project in alphabeticalProjects()'));
  	expect(elems.count()).toEqual(1);
  	element(by.id('Clear button')).click();
  
  	
  });
  
  // test the project disappear after uncheck the checkbox
  xit('should only appear 1 project when only check one checkbox', function() {
  	element(by.id('Filter button')).click();
  	element(by.xpath("//label[contains(.,'Project5')]//input[@id='mycheckbox']")).click();
  	
  	// Verify that now there is only one item left in timeOrderedProjects
  	var elems = element.all(by.repeater('project in timeOrderedProjects()'));
  	expect(elems.count()).toEqual(1);  	
  });
  
  
  // test the clear botton works
  xit('should uncheck all checkbox when clicking the clear button', function() {
  	element(by.id('Filter button')).click();
  	ptor.sleep(1000);
  	element(by.id('Clear button')).click();
  	expect(element(by.id('mycheckboxState')).isSelected()).toBeFalsy();
  	
  	
 });
  
  
  
  
});


