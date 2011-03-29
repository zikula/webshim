jQuery.webshims.register("form-native-fix",function(c,e,f,l,o){if(!(!Modernizr.formvalidation||f.noHTMLExtFixes||Modernizr.bugfreeformvalidation)){var n=c.browser.webkit&&parseFloat(c.browser.version,10)<534.19,m=[],h,i,j;if(f.addEventListener){var g={timer:o,prevented:false};f.addEventListener("submit",function(a){if(!g.prevented&&a.target.checkValidity&&c.attr(a.target,"novalidate")==null){j=true;c(a.target).checkValidity();j=false}},true);l=function(a){if(c.attr(a.target,"formnovalidate")!=null){g.timer&&
clearTimeout(g.timer);g.prevented=true;g.timer=setTimeout(function(){g.prevented=false},20)}};f.addEventListener("click",l,true);f.addEventListener("touchstart",l,true);f.addEventListener("touchend",l,true)}c(document).bind("firstinvalidsystem",function(a,b){if(i=b.form){h=false;m=[];var d=c(i).unbind("submit.preventInvalidSubmit").bind("submit.preventInvalidSubmit",function(k){if(c.attr(i,"novalidate")==null){k.stopImmediatePropagation();return false}}).data("events").submit;d&&d.length>1&&d.unshift(d.pop());
if(j)h=b}}).bind("invalid",function(a){m.indexOf(a.target)==-1?m.push(a.target):a.stopImmediatePropagation()}).bind("lastinvalid",function(a,b){var d=b.invalidlist[0];d&&n&&document.activeElement&&d!==document.activeElement&&h&&!h.isInvalidUIPrevented()&&e.validityAlert.showFor(d);h=false;m=[];i&&c(i).unbind("submit.preventInvalidSubmit")});(function(){if(n){["input","textarea","select"].forEach(function(a){var b=e.defineNodeNameProperty(a,"checkValidity",{value:function(){if(!this.willValidate)return true;
var d=(c.attr(this,"validity")||{valid:true}).valid;!d&&b._supvalue&&b._supvalue.call(this)&&c(this).trigger("invalid");return d}})});e.defineNodeNameProperty("form","checkValidity",{value:function(){var a=true;c(this.elements||[]).each(function(){if(c(this).checkValidity()===false)a=false});return a}})}})();(function(){if(c.browser.opera){var a=function(b){b.preventDefault()};["form","input","textarea","select"].forEach(function(b){var d=e.defineNodeNameProperty(b,"checkValidity",{value:function(){j||
c(this).bind("invalid",a);var k=d._supvalue.apply(this,arguments);j||c(this).unbind("invalid",a);return k}})})}})();Modernizr.requiredSelect||e.ready("form-extend",function(){e.addValidityRule("valueMissing",function(a,b,d,k){if(d.nodeName=="select"&&!b&&a.attr("required")){if(!d.type)d.type=a[0].type;if(b=!b){if(!(b=a[0].selectedIndex<0)){a=a[0];if(a.type=="select-one"&&a.size<2){a=c("> option:first-child",a);b=!a.attr("disabled")&&a.attr("selected")}else b=false}b=b}if(b)return true}return k.valueMissing});
e.defineNodeNamesBooleanProperty(["select"],"required",{set:function(a){this.setAttribute("aria-required",a?"true":"false");c.attr(this,"validity")},initAttr:true})})}});
