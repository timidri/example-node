// NOTE: this file is injested by phantomjs, NOT Node.js!
// runs with casperjs
// phantom system module: http://phantomjs.org/api/system/
const envVars = require('system').env;
const url = envVars.REMOTE_HOST;
const hostname = url.split('/')[2];
const currentUNID = null;
const config = require('../config');
phantom.clearCookies();
phantom.addCookie({
 'name': 'SWID',
 'value': 'test',
 'domain': url.split('/')[2]
});
casper.options.waitTimeout = 20000;

casper.test.begin("UNID on "+url, 4, function(test) {
 var links = [];
 var site = url;
 var assertUNID = function() {
   console.log('.unid_allowed found');
   var classList = casper.evaluate(function() {
       return document.getElementById('unidFrame').className;
   });
   console.log(classList);
   currentUNID = casper.evaluate(function() {
       return document.getElementById('unidFrame').dataset.unid;
   });
   console.log('unid:',currentUNID)
   if(!currentUNID){
     console.error(site)
     throw site
   }
   test.assert(!!currentUNID, "UNID Exists");
   test.assert(classList.indexOf('unid_send')!==-1, "Sending Data");
   this.waitForSelector('.unid_sent');
 };

 casper.start(url, function() {
    this.viewport(1024, 768);
    // Wait for the unid page to be loaded
    this.waitForSelector('script[src*="cdn.unid.go.com/js/unid.min.js"]');
 });

 casper.then(function() {
   console.log('unid.min.js found');
   var inBody = casper.evaluate(function() {
       return !!document.querySelectorAll('body > script[src*="//cdn.unid.go.com/js/unid.min.js"]')
   });
   if(inBody){
     console.log('script loaded in body :)');
   }else{
     console.warn('script NOT loaded in body :(');
   }
   // Wait for the unid page to be loaded
   this.waitForSelector('#unidFrame');
 });

 casper.then(function() {
  console.log('#unidFrame found');
  this.waitForSelector('.unid_allowed');
 });

 casper.then(assertUNID);
 casper.then(function() {
   // aggregate results for the 'casperjs' search
   links = this.evaluate(function(){
     var a = document.querySelectorAll('a');
     return Array.prototype.map.call(a, function(e) {
       return e.getAttribute('href');
     });
   });
   links = links.filter(function(n){
     n = n.toLowerCase();
     var good = n.indexOf(url)===0;
     config.exclusions.forEach(function(exclude){
       if(n.indexOf(exclude)===0){
         good = false;
       }
     });
     return good;
   });
   if(links.length){
     var link = links[Math.floor(Math.random()*links.length)];
     console.log('loading', link);
     phantom.clearCookies();
     site = link;
     casper.thenOpen(link,function(){
       this.viewport(1024, 768);
       this.waitForSelector('.unid_allowed');
     });
     casper.then(assertUNID);
   }else{
     test.assert(true, 'no links to load');
     test.assert(true, 'no secondary sent state to check');
   }
 });

 casper.run(function() {
   test.done();
 })
});
