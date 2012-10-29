(function(a,c,f){var k=c.audio&&c.video,x=!1,q=f.cfg.mediaelement,g=f.bugs,u="jwplayer"==q.player?"mediaelement-swf":"mediaelement-jaris",w=function(){f.ready(u,function(){if(!f.mediaelement.createSWF)f.mediaelement.loadSwf=!0,f.reTest([u],k)})},r;if(k){var t=document.createElement("video");c.videoBuffered="buffered"in t;x="loop"in t;f.capturingEvents("play,playing,waiting,paused,ended,durationchange,loadedmetadata,canplay,volumechange".split(","));c.videoBuffered||(f.addPolyfill("mediaelement-native-fix",
{f:"mediaelement",test:c.videoBuffered,d:["dom-support"]}),f.reTest("mediaelement-native-fix"))}if(k&&!q.preferFlash){var p=function(c){var j=c.target.parentNode;!q.preferFlash&&(a(c.target).is("audio, video")||j&&a("source:last",j)[0]==c.target)&&f.ready("DOM mediaelement",function(){r&&w();f.ready("WINDOWLOAD "+u,function(){setTimeout(function(){r&&!q.preferFlash&&f.mediaelement.createSWF&&!a(c.target).closest("audio, video").is(".nonnative-api-active")?(q.preferFlash=!0,document.removeEventListener("error",
p,!0),a("audio, video").mediaLoad(),f.info("switching mediaelements option to 'preferFlash', due to an error with native player: "+c.target.src)):r||document.removeEventListener("error",p,!0)},20)})})};document.addEventListener("error",p,!0);a("audio, video").each(function(){this.error&&p({target:this})})}g.track=!1;c.track&&function(){if(!g.track)g.track="number"!=typeof a("<track />")[0].readyState;if(!g.track)try{new TextTrackCue(2,3,"")}catch(c){g.track=!0}var j=f.cfg.track,k=function(c){a(c.target).filter("track").each(w)},
w=function(){if(g.track||!j.override&&3==a.prop(this,"readyState"))j.override=!0,f.reTest("track"),document.removeEventListener("error",k,!0),this&&a.nodeName(this,"track")?f.error("track support was overwritten. Please check your vtt including your vtt mime-type"):f.info("track support was overwritten. due to bad browser support")},t=function(){document.addEventListener("error",k,!0);g.track?w():a("track").each(w)};j.override||(f.isReady("track")?t():a(t))}();f.register("mediaelement-core",function(a,
j,f,t,p){r=swfobject.hasFlashPlayerVersion("9.0.115");var m=j.mediaelement,b=function(b,i){var b=a(b),d={src:b.attr("src")||"",elem:b,srcProp:b.prop("src")};if(!d.src)return d;var c=b.attr("type");if(c)d.type=c,d.container=a.trim(c.split(";")[0]);else if(i||(i=b[0].nodeName.toLowerCase(),"source"==i&&(i=(b.closest("video, audio")[0]||{nodeName:"video"}).nodeName.toLowerCase())),c=m.getTypeForSrc(d.src,i))d.type=c,d.container=c;if(c=b.attr("media"))d.media=c;return d},d=!r&&"postMessage"in f&&k,e=
function(){var b;return function(){!b&&d&&(b=!0,j.loader.loadScript("https://www.youtube.com/player_api"),a(function(){j.polyfill("mediaelement-yt")}))}}(),l=function(){r?w():e()};j.addPolyfill("mediaelement-yt",{test:!d,d:["dom-support"]});m.mimeTypes={audio:{"audio/ogg":["ogg","oga","ogm"],'audio/ogg;codecs="opus"':"opus","audio/mpeg":["mp2","mp3","mpga","mpega"],"audio/mp4":"mp4,mpg4,m4r,m4a,m4p,m4b,aac".split(","),"audio/wav":["wav"],"audio/3gpp":["3gp","3gpp"],"audio/webm":["webm"],"audio/fla":["flv",
"f4a","fla"],"application/x-mpegURL":["m3u8","m3u"]},video:{"video/ogg":["ogg","ogv","ogm"],"video/mpeg":["mpg","mpeg","mpe"],"video/mp4":["mp4","mpg4","m4v"],"video/quicktime":["mov","qt"],"video/x-msvideo":["avi"],"video/x-ms-asf":["asf","asx"],"video/flv":["flv","f4v"],"video/3gpp":["3gp","3gpp"],"video/webm":["webm"],"application/x-mpegURL":["m3u8","m3u"],"video/MP2T":["ts"]}};m.mimeTypes.source=a.extend({},m.mimeTypes.audio,m.mimeTypes.video);m.getTypeForSrc=function(b,i){if(-1!=b.indexOf("youtube.com/watch?")||
-1!=b.indexOf("youtube.com/v/"))return"video/youtube";var b=b.split("?")[0].split("."),b=b[b.length-1],d;a.each(m.mimeTypes[i],function(a,i){if(-1!==i.indexOf(b))return d=a,!1});return d};m.srces=function(n,i){n=a(n);if(i)n.removeAttr("src").removeAttr("type").find("source").remove(),a.isArray(i)||(i=[i]),i.forEach(function(a){var b=t.createElement("source");"string"==typeof a&&(a={src:a});b.setAttribute("src",a.src);a.type&&b.setAttribute("type",a.type);a.media&&b.setAttribute("media",a.media);n.append(b)});
else{var i=[],d=n[0].nodeName.toLowerCase(),c=b(n,d);c.src?i.push(c):a("source",n).each(function(){c=b(this,d);c.src&&i.push(c)});return i}};a.fn.loadMediaSrc=function(b,i){return this.each(function(){i!==p&&(a(this).removeAttr("poster"),i&&a.attr(this,"poster",i));m.srces(this,b);a(this).mediaLoad()})};m.swfMimeTypes="video/3gpp,video/x-msvideo,video/quicktime,video/x-m4v,video/mp4,video/m4p,video/x-flv,video/flv,audio/mpeg,audio/aac,audio/mp4,audio/x-m4a,audio/m4a,audio/mp3,audio/x-fla,audio/fla,youtube/flv,jwplayer/jwplayer,video/youtube".split(",");
m.canThirdPlaySrces=function(b,i){var c="";if(r||d)b=a(b),i=i||m.srces(b),a.each(i,function(a,b){if(b.container&&b.src&&(r&&-1!=m.swfMimeTypes.indexOf(b.container)||d&&"video/youtube"==b.container))return c=b,!1});return c};var h={};m.canNativePlaySrces=function(b,i){var d="";if(k){var b=a(b),c=(b[0].nodeName||"").toLowerCase();if(!h[c])return d;i=i||m.srces(b);a.each(i,function(a,i){if(i.type&&h[c].prop._supvalue.call(b[0],i.type))return d=i,!1})}return d};m.setError=function(b,i){i||(i="can't play sources");
a(b).pause().data("mediaerror",i);j.warn("mediaelementError: "+i);setTimeout(function(){a(b).data("mediaerror")&&a(b).trigger("mediaerror")},1)};var o=function(){var a;return function(b,c,h){j.ready(r?u:"mediaelement-yt",function(){m.createSWF?m.createSWF(b,c,h):a||(a=!0,l(),o(b,c,h))});!a&&d&&!m.createSWF&&e()}}(),B=function(a,b,d,c,e){d||!1!==d&&b&&"third"==b.isActive?(d=m.canThirdPlaySrces(a,c))?o(a,d,b):e?m.setError(a,!1):B(a,b,!1,c,!0):(d=m.canNativePlaySrces(a,c))?b&&"third"==b.isActive&&m.setActive(a,
"html5",b):e?(m.setError(a,!1),b&&"third"==b.isActive&&m.setActive(a,"html5",b)):B(a,b,!0,c,!0)},A=/^(?:embed|object|datalist)$/i,y=function(b,d){var c=j.data(b,"mediaelementBase")||j.data(b,"mediaelementBase",{}),e=m.srces(b),o=b.parentNode;clearTimeout(c.loadTimer);a.data(b,"mediaerror",!1);if(e.length&&o&&!(1!=o.nodeType||A.test(o.nodeName||"")))d=d||j.data(b,"mediaelement"),B(b,d,q.preferFlash||p,e)};a(t).on("ended",function(b){var d=j.data(b.target,"mediaelement");(!x||d&&"html5"!=d.isActive||
a.prop(b.target,"loop"))&&setTimeout(function(){!a.prop(b.target,"paused")&&a.prop(b.target,"loop")&&a(b.target).prop("currentTime",0).play()},1)});x||j.defineNodeNamesBooleanProperty(["audio","video"],"loop");["audio","video"].forEach(function(b){var d=j.defineNodeNameProperty(b,"load",{prop:{value:function(){var a=j.data(this,"mediaelement");y(this,a);k&&(!a||"html5"==a.isActive)&&d.prop._supvalue&&d.prop._supvalue.apply(this,arguments)}}});h[b]=j.defineNodeNameProperty(b,"canPlayType",{prop:{value:function(d){var c=
"";k&&h[b].prop._supvalue&&(c=h[b].prop._supvalue.call(this,d),"no"==c&&(c=""));!c&&r&&(d=a.trim((d||"").split(";")[0]),-1!=m.swfMimeTypes.indexOf(d)&&(c="maybe"));return c}}})});j.onNodeNamesPropertyModify(["audio","video"],["src","poster"],{set:function(){var a=this,b=j.data(a,"mediaelementBase")||j.data(a,"mediaelementBase",{});clearTimeout(b.loadTimer);b.loadTimer=setTimeout(function(){y(a);a=null},9)}});f=function(){j.addReady(function(b,d){a("video, audio",b).add(d.filter("video, audio")).each(function(){a.browser.msie&&
8<j.browserVersion&&a.prop(this,"paused")&&!a.prop(this,"readyState")&&a(this).is('audio[preload="none"][controls]:not([autoplay])')?a(this).prop("preload","metadata").mediaLoad():y(this);if(k){var b,d,c=this,i=function(){var b=a.prop(c,"buffered");if(b){for(var d="",i=0,e=b.length;i<e;i++)d+=b.end(i);return d}},e=function(){var b=i();b!=d&&(d=b,a(c).triggerHandler("progress"))};a(this).on({"play loadstart progress":function(a){"progress"==a.type&&(d=i());clearTimeout(b);b=setTimeout(e,999)},"emptied stalled mediaerror abort suspend":function(a){"emptied"==
a.type&&(d=!1);clearTimeout(b)}})}})})};c.track&&!g.track&&j.defineProperty(TextTrack.prototype,"shimActiveCues",{get:function(){return this._shimActiveCues||this.activeCues}});k?(j.isReady("mediaelement-core",!0),f(),j.ready("WINDOWLOAD mediaelement",l)):j.ready(u,f);a(function(){j.loader.loadList(["track-ui"])})})})(jQuery,Modernizr,jQuery.webshims);
jQuery.webshims.register("form-message",function(a,c,f,k,x,q){var g=c.validityMessages,f=q.overrideMessages||q.customMessages?["customValidationMessage"]:[];g.en=a.extend(!0,{typeMismatch:{email:"Please enter an email address.",url:"Please enter a URL.",number:"Please enter a number.",date:"Please enter a date.",time:"Please enter a time.",range:"Invalid input.","datetime-local":"Please enter a datetime."},rangeUnderflow:{defaultMessage:"Value must be greater than or equal to {%min}."},rangeOverflow:{defaultMessage:"Value must be less than or equal to {%max}."},
stepMismatch:"Invalid input.",tooLong:"Please enter at most {%maxlength} character(s). You entered {%valueLen}.",patternMismatch:"Invalid input. {%title}",valueMissing:{defaultMessage:"Please fill out this field.",checkbox:"Please check this box if you want to proceed."}},g.en||g["en-US"]||{});["select","radio"].forEach(function(a){g.en.valueMissing[a]="Please select an option."});["date","time","datetime-local"].forEach(function(a){g.en.rangeUnderflow[a]="Value must be at or after {%min}."});["date",
"time","datetime-local"].forEach(function(a){g.en.rangeOverflow[a]="Value must be at or before {%max}."});g["en-US"]=g["en-US"]||g.en;g[""]=g[""]||g["en-US"];g.de=a.extend(!0,{typeMismatch:{email:"{%value} ist keine zul\u00e4ssige E-Mail-Adresse",url:"{%value} ist keine zul\u00e4ssige Webadresse",number:"{%value} ist keine Nummer!",date:"{%value} ist kein Datum",time:"{%value} ist keine Uhrzeit",range:"{%value} ist keine Nummer!","datetime-local":"{%value} ist kein Datum-Uhrzeit Format."},rangeUnderflow:{defaultMessage:"{%value} ist zu niedrig. {%min} ist der unterste Wert, den Sie benutzen k\u00f6nnen."},
rangeOverflow:{defaultMessage:"{%value} ist zu hoch. {%max} ist der oberste Wert, den Sie benutzen k\u00f6nnen."},stepMismatch:"Der Wert {%value} ist in diesem Feld nicht zul\u00e4ssig. Hier sind nur bestimmte Werte zul\u00e4ssig. {%title}",tooLong:"Der eingegebene Text ist zu lang! Sie haben {%valueLen} Zeichen eingegeben, dabei sind {%maxlength} das Maximum.",patternMismatch:"{%value} hat f\u00fcr dieses Eingabefeld ein falsches Format! {%title}",valueMissing:{defaultMessage:"Bitte geben Sie einen Wert ein",
checkbox:"Bitte aktivieren Sie das K\u00e4stchen"}},g.de||{});["select","radio"].forEach(function(a){g.de.valueMissing[a]="Bitte w\u00e4hlen Sie eine Option aus"});["date","time","datetime-local"].forEach(function(a){g.de.rangeUnderflow[a]="{%value} ist zu fr\u00fch. {%min} ist die fr\u00fcheste Zeit, die Sie benutzen k\u00f6nnen."});["date","time","datetime-local"].forEach(function(a){g.de.rangeOverflow[a]="{%value} ist zu sp\u00e4t. {%max} ist die sp\u00e4teste Zeit, die Sie benutzen k\u00f6nnen."});
var u=g[""];c.createValidationMessage=function(g,k){var f=u[k];f&&"string"!==typeof f&&(f=f[a.prop(g,"type")]||f[(g.nodeName||"").toLowerCase()]||f.defaultMessage);f&&"value,min,max,title,maxlength,label".split(",").forEach(function(p){if(-1!==f.indexOf("{%"+p)){var v=("label"==p?a.trim(a('label[for="'+g.id+'"]',g.form).text()).replace(/\*$|:$/,""):a.attr(g,p))||"";"patternMismatch"==k&&"title"==p&&!v&&c.error("no title for patternMismatch provided. Always add a title attribute.");f=f.replace("{%"+
p+"}",v);"value"==p&&(f=f.replace("{%valueLen}",v.length))}});return f||""};(c.bugs.validationMessage||!Modernizr.formvalidation||c.bugs.bustedValidity)&&f.push("validationMessage");c.activeLang({langObj:g,module:"form-core",callback:function(a){u=a}});f.forEach(function(f){c.defineNodeNamesProperty(["fieldset","output","button"],f,{prop:{value:"",writeable:!1}});["input","select","textarea"].forEach(function(g){var k=c.defineNodeNameProperty(g,f,{prop:{get:function(){var f=this,g="";if(!a.prop(f,
"willValidate"))return g;var j=a.prop(f,"validity")||{valid:1};if(j.valid||(g=c.getContentValidationMessage(f,j)))return g;if(j.customError&&f.nodeName&&(g=Modernizr.formvalidation&&!c.bugs.bustedValidity&&k.prop._supget?k.prop._supget.call(f):c.data(f,"customvalidationMessage")))return g;a.each(j,function(a,k){if("valid"!=a&&k&&(g=c.createValidationMessage(f,a)))return!1});return g||""},writeable:!1}})})})});
(!Modernizr.formvalidation||jQuery.webshims.bugs.bustedValidity)&&jQuery.webshims.register("form-extend",function(a,c,f,k){c.inputTypes=c.inputTypes||{};var x=c.cfg.forms,q,g=c.inputTypes,u={radio:1,checkbox:1};c.addInputType=function(a,d){g[a]=d};var w={customError:!1,typeMismatch:!1,rangeUnderflow:!1,rangeOverflow:!1,stepMismatch:!1,tooLong:!1,patternMismatch:!1,valueMissing:!1,valid:!0},r={valueMissing:function(b,d,e){if(!b.prop("required"))return!1;var l=!1;if(!("type"in e))e.type=(b[0].getAttribute("type")||
b[0].type||"").toLowerCase();if("select"==e.nodeName){if(d=!d)if(!(d=0>b[0].selectedIndex))b=b[0],d="select-one"==b.type&&2>b.size?!!a("> option:first-child",b).prop("selected"):!1;b=d}else b=u[e.type]?"checkbox"==e.type?!b.is(":checked"):!c.modules["form-core"].getGroupElements(b).filter(":checked")[0]:!d;return b},tooLong:function(){return!1},typeMismatch:function(a,d,c){if(""===d||"select"==c.nodeName)return!1;var l=!1;if(!("type"in c))c.type=(a[0].getAttribute("type")||a[0].type||"").toLowerCase();
if(g[c.type]&&g[c.type].mismatch)l=g[c.type].mismatch(d,a);else if("validity"in a[0])l=a[0].validity.typeMismatch;return l},patternMismatch:function(a,d,e){if(""===d||"select"==e.nodeName)return!1;a=a.attr("pattern");if(!a)return!1;try{a=RegExp("^(?:"+a+")$")}catch(l){c.error('invalid pattern value: "'+a+'" | '+l),a=!1}return!a?!1:!a.test(d)}};c.addValidityRule=function(a,d){r[a]=d};a.event.special.invalid={add:function(){a.event.special.invalid.setup.call(this.form||this)},setup:function(){var b=
this.form||this;if(!a.data(b,"invalidEventShim")&&(a(b).data("invalidEventShim",!0).on("submit",a.event.special.invalid.handler),c.moveToFirstEvent(b,"submit"),c.bugs.bustedValidity&&a.nodeName(b,"form"))){var d=b.getAttribute("novalidate");b.setAttribute("novalidate","novalidate");c.data(b,"bustedNoValidate",null==d?null:d)}},teardown:a.noop,handler:function(b){if(!("submit"!=b.type||b.testedValidity||!b.originalEvent||!a.nodeName(b.target,"form")||a.prop(b.target,"noValidate"))){q=!0;b.testedValidity=
!0;if(!a(b.target).checkValidity())return b.stopImmediatePropagation(),q=!1;q=!1}}};var t=function(b){if(!a.support.submitBubbles&&b&&"object"==typeof b&&!b._submit_attached)a.event.add(b,"submit._submit",function(a){a._submit_bubble=!0}),b._submit_attached=!0};if(!a.support.submitBubbles&&a.event.special.submit)a.event.special.submit.setup=function(){if(a.nodeName(this,"form"))return!1;a.event.add(this,"click._submit keypress._submit",function(b){b=b.target;b=a.nodeName(b,"input")||a.nodeName(b,
"button")?a.prop(b,"form"):void 0;t(b)})};a.event.special.submit=a.event.special.submit||{setup:function(){return!1}};var p=a.event.special.submit.setup;a.extend(a.event.special.submit,{setup:function(){if(a.nodeName(this,"form"))a(this).on("invalid",a.noop);else a("form",this).on("invalid",a.noop);return p.apply(this,arguments)}});a(f).on("invalid",a.noop);c.addInputType("email",{mismatch:function(){var a=x.emailReg||/^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;return function(d){return!a.test(d)}}()});
c.addInputType("url",{mismatch:function(){var a=x.urlReg||/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
return function(d){return!a.test(d)}}()});c.defineNodeNameProperty("input","type",{prop:{get:function(){var a=(this.getAttribute("type")||"").toLowerCase();return c.inputTypes[a]?a:this.type}}});c.defineNodeNamesProperties(["button","fieldset","output"],{checkValidity:{value:function(){return!0}},willValidate:{value:!1},setCustomValidity:{value:a.noop},validity:{writeable:!1,get:function(){return a.extend({},w)}}},"prop");var v=function(b){var d,e=a.prop(b,"validity");if(e)a.data(b,"cachedValidity",
e);else return!0;if(!e.valid){d=a.Event("invalid");var l=a(b).trigger(d);if(q&&!v.unhandledInvalids&&!d.isDefaultPrevented())c.validityAlert.showFor(l),v.unhandledInvalids=!0}a.removeData(b,"cachedValidity");return e.valid},j=/^(?:select|textarea|input)/i;c.defineNodeNameProperty("form","checkValidity",{prop:{value:function(){var b=!0,d=a(a.prop(this,"elements")).filter(function(){if(!j.test(this.nodeName))return!1;var a=c.data(this,"shadowData");return!a||!a.nativeElement||a.nativeElement===this});
v.unhandledInvalids=!1;for(var e=0,l=d.length;e<l;e++)v(d[e])||(b=!1);return b}}});c.defineNodeNamesProperties(["input","textarea","select"],{checkValidity:{value:function(){v.unhandledInvalids=!1;return v(a(this).getNativeElement()[0])}},setCustomValidity:{value:function(b){a.removeData(this,"cachedValidity");c.data(this,"customvalidationMessage",""+b)}},willValidate:{writeable:!1,get:function(){var b={button:1,reset:1,hidden:1,image:1};return function(){var d=a(this).getNativeElement()[0];return!(d.disabled||
d.readOnly||b[d.type])}}()},validity:{writeable:!1,get:function(){var b=a(this).getNativeElement(),d=b[0],e=a.data(d,"cachedValidity");if(e)return e;e=a.extend({},w);if(!a.prop(d,"willValidate")||"submit"==d.type)return e;var l=b.val(),h={nodeName:d.nodeName.toLowerCase()};e.customError=!!c.data(d,"customvalidationMessage");if(e.customError)e.valid=!1;a.each(r,function(a,d){if(d(b,l,h))e[a]=!0,e.valid=!1});a(this).getShadowFocusElement().attr("aria-invalid",e.valid?"false":"true");d=b=null;return e}}},
"prop");c.defineNodeNamesBooleanProperty(["input","textarea","select"],"required",{set:function(b){a(this).getShadowFocusElement().attr("aria-required",!!b+"")},initAttr:!a.browser.msie||7<c.browserVersion});c.reflectProperties(["input"],["pattern"]);if(!("maxLength"in k.createElement("textarea"))){var z=function(){var b,d=0,c=a([]),l=1E9,h=function(){var a=c.prop("value"),b=a.length;b>d&&b>l&&(b=Math.max(d,l),c.prop("value",a.substr(0,b)));d=b},o=function(){clearTimeout(b);c.unbind(".maxlengthconstraint")};
return function(f,A){o();if(-1<A)l=A,d=a.prop(f,"value").length,c=a(f),c.on({"keydown.maxlengthconstraint keypress.maxlengthconstraint paste.maxlengthconstraint cut.maxlengthconstraint":function(){setTimeout(h,0)},"keyup.maxlengthconstraint":h,"blur.maxlengthconstraint":o}),b=setInterval(h,200)}}();z.update=function(b,d){a(b).is(":focus")&&(d||(d=a.prop(b,"maxlength")),z(b,d))};a(k).on("focusin",function(b){var d;"TEXTAREA"==b.target.nodeName&&-1<(d=a.prop(b.target,"maxlength"))&&z(b.target,d)});
c.defineNodeNameProperty("textarea","maxlength",{attr:{set:function(a){this.setAttribute("maxlength",""+a);z.update(this)},get:function(){var a=this.getAttribute("maxlength");return null==a?void 0:a}},prop:{set:function(a){if("number"==typeof a||a&&a==1*a){if(0>a)throw"INDEX_SIZE_ERR";a=parseInt(a,10);this.setAttribute("maxlength",a);z.update(this,a)}else this.setAttribute("maxlength","0"),z.update(this,0)},get:function(){var a=this.getAttribute("maxlength");return("number"==typeof a||a&&a==1*a)&&
0<=a?parseInt(a,10):-1}}});c.defineNodeNameProperty("textarea","maxLength",{prop:{set:function(b){a.prop(this,"maxlength",b)},get:function(){return a.prop(this,"maxlength")}}})}var C={submit:1,button:1,image:1},s={};[{name:"enctype",limitedTo:{"application/x-www-form-urlencoded":1,"multipart/form-data":1,"text/plain":1},defaultProp:"application/x-www-form-urlencoded",proptype:"enum"},{name:"method",limitedTo:{get:1,post:1},defaultProp:"get",proptype:"enum"},{name:"action",proptype:"url"},{name:"target"},
{name:"novalidate",propName:"noValidate",proptype:"boolean"}].forEach(function(b){var d="form"+(b.propName||b.name).replace(/^[a-z]/,function(a){return a.toUpperCase()}),c="form"+b.name,l=b.name,h="click.webshimssubmittermutate"+l,o=function(){if("form"in this&&C[this.type]){var o=a.prop(this,"form");if(o){var h=a.attr(this,c);if(null!=h&&(!b.limitedTo||h.toLowerCase()===a.prop(this,d))){var n=a.attr(o,l);a.attr(o,l,h);setTimeout(function(){if(null!=n)a.attr(o,l,n);else try{a(o).removeAttr(l)}catch(b){o.removeAttribute(l)}},
9)}}}};switch(b.proptype){case "url":var f=k.createElement("form");s[d]={prop:{set:function(b){a.attr(this,c,b)},get:function(){var b=a.attr(this,c);if(null==b)return"";f.setAttribute("action",b);return f.action}}};break;case "boolean":s[d]={prop:{set:function(b){b?a.attr(this,"formnovalidate","formnovalidate"):a(this).removeAttr("formnovalidate")},get:function(){return null!=a.attr(this,"formnovalidate")}}};break;case "enum":s[d]={prop:{set:function(b){a.attr(this,c,b)},get:function(){var d=a.attr(this,
c);return!d||(d=d.toLowerCase())&&!b.limitedTo[d]?b.defaultProp:d}}};break;default:s[d]={prop:{set:function(b){a.attr(this,c,b)},get:function(){var b=a.attr(this,c);return null!=b?b:""}}}}s[c]||(s[c]={});s[c].attr={set:function(b){s[c].attr._supset.call(this,b);a(this).unbind(h).on(h,o)},get:function(){return s[c].attr._supget.call(this)}};s[c].initAttr=!0;s[c].removeAttr={value:function(){a(this).unbind(h);s[c].removeAttr._supvalue.call(this)}}});c.defineNodeNamesProperties(["input","button"],s);
!a.support.getSetAttribute&&null==a("<form novalidate></form>").attr("novalidate")?c.defineNodeNameProperty("form","novalidate",{attr:{set:function(a){this.setAttribute("novalidate",""+a)},get:function(){var a=this.getAttribute("novalidate");return null==a?void 0:a}}}):c.bugs.bustedValidity&&(c.defineNodeNameProperty("form","novalidate",{attr:{set:function(a){c.data(this,"bustedNoValidate",""+a)},get:function(){var a=c.data(this,"bustedNoValidate");return null==a?void 0:a}},removeAttr:{value:function(){c.data(this,
"bustedNoValidate",null)}}}),a.each(["rangeUnderflow","rangeOverflow","stepMismatch"],function(a,c){r[c]=function(a){return(a[0].validity||{})[c]||!1}}));c.defineNodeNameProperty("form","noValidate",{prop:{set:function(b){b?a.attr(this,"novalidate","novalidate"):a(this).removeAttr("novalidate")},get:function(){return null!=a.attr(this,"novalidate")}}});a.browser.webkit&&Modernizr.inputtypes.date&&function(){var b={updateInput:1,input:1},d={date:1,time:1,"datetime-local":1},e={focusout:1,blur:1},l=
{updateInput:1,change:1},h=function(a){var c,d=!0,h=a.prop("value"),n=h,i=function(c){if(a){var i=a.prop("value");i!==h&&(h=i,(!c||!b[c.type])&&a.trigger("input"));c&&l[c.type]&&(n=i);!d&&i!==n&&a.trigger("change")}},f,g=function(b){clearInterval(c);setTimeout(function(){b&&e[b.type]&&(d=!1);a&&(a.unbind("focusout blur",g).unbind("input change updateInput",i),i());a=null},1)};clearInterval(c);c=setInterval(i,160);clearTimeout(f);f=setTimeout(i,9);a.off({"focusout blur":g,"input change updateInput":i}).on({"focusout blur":g,
"input updateInput change":i})};if(a.event.customEvent)a.event.customEvent.updateInput=!0;(function(){var b=function(b){var c=1,d,h;if("date"==b.type&&(q||!a(b).is(":focus")))if((h=b.value)&&10>h.length&&(h=h.split("-"))&&3==h.length){for(;3>c;c++)if(1==h[c].length)h[c]="0"+h[c];else if(2!=h[c].length){d=!0;break}if(!d)return h=h.join("-"),a.prop(b,"value",h),h}},d,h,e,n;d=c.defineNodeNameProperty("input","checkValidity",{prop:{value:function(){b(this);return d.prop._supvalue.apply(this,arguments)}}});
h=c.defineNodeNameProperty("form","checkValidity",{prop:{value:function(){a("input",this).each(function(){b(this)});return h.prop._supvalue.apply(this,arguments)}}});e=c.defineNodeNameProperty("input","value",{prop:{set:function(){return e.prop._supset.apply(this,arguments)},get:function(){return b(this)||e.prop._supget.apply(this,arguments)}}});n=c.defineNodeNameProperty("input","validity",{prop:{writeable:!1,get:function(){b(this);return n.prop._supget.apply(this,arguments)}}});a(k).on("change",
function(a){isChangeSubmit=!0;b(a.target);isChangeSubmit=!1})})();a(k).on("focusin",function(b){b.target&&d[b.target.type]&&!b.target.readOnly&&!b.target.disabled&&h(a(b.target))})}();c.addReady(function(b,c){var e;a("form",b).add(c.filter("form")).bind("invalid",a.noop);try{if(b==k&&!("form"in(k.activeElement||{})))(e=a("input[autofocus], select[autofocus], textarea[autofocus]",b).eq(0).getShadowFocusElement()[0])&&e.offsetHeight&&e.offsetWidth&&e.focus()}catch(l){}});(!Modernizr.formattribute||
!Modernizr.fieldsetdisabled)&&function(){(function(b,c){a.prop=function(d,e,l){var n;if(d&&1==d.nodeType&&l===c&&a.nodeName(d,"form")&&d.id){n=k.getElementsByName(e);if(!n||!n.length)n=k.getElementById(e);if(n&&(n=a(n).filter(function(){return a.prop(this,"form")==d}).get(),n.length))return 1==n.length?n[0]:n}return b.apply(this,arguments)}})(a.prop,void 0);var b=function(b){var c=a.data(b,"webshimsAddedElements");c&&(c.remove(),a.removeData(b,"webshimsAddedElements"))},d=/\r?\n/g,e=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
l=/^(?:select|textarea)/i;Modernizr.formattribute||(c.defineNodeNamesProperty(["input","textarea","select","button","fieldset"],"form",{prop:{get:function(){var b=c.contentAttr(this,"form");b&&(b=k.getElementById(b))&&!a.nodeName(b,"form")&&(b=null);return b||this.form},writeable:!1}}),c.defineNodeNamesProperty(["form"],"elements",{prop:{get:function(){var b=this.id,c=a.makeArray(this.elements);b&&(c=a(c).add('input[form="'+b+'"], select[form="'+b+'"], textarea[form="'+b+'"], button[form="'+b+'"], fieldset[form="'+
b+'"]').not(".webshims-visual-hide > *").get());return c},writeable:!1}}),a(function(){var c=function(a){a.stopPropagation()};a(k).on("submit",function(c){if(!c.isDefaultPrevented()){var d=c.target;if(c=d.id)b(d),c=a('input[form="'+c+'"], select[form="'+c+'"], textarea[form="'+c+'"]').filter(function(){return!this.disabled&&this.name&&this.form!=d}).clone(),c.length&&(a.data(d,"webshimsAddedElements",a('<div class="webshims-visual-hide" />').append(c).appendTo(d)),setTimeout(function(){b(d)},9)),
c=null}});a(k).on("click",function(b){if(!b.isDefaultPrevented()&&a(b.target).is('input[type="submit"][form], button[form], input[type="button"][form], input[type="image"][form], input[type="reset"][form]')){var d=a.prop(b.target,"form"),e=b.target.form,l;d&&d!=e&&(l=a(b.target).clone().removeAttr("form").addClass("webshims-visual-hide").on("click",c).appendTo(d),e&&b.preventDefault(),t(d),l.trigger("click"),setTimeout(function(){l.remove();l=null},9))}})}));Modernizr.fieldsetdisabled||c.defineNodeNamesProperty(["fieldset"],
"elements",{prop:{get:function(){return a("input, select, textarea, button, fieldset",this).get()||[]},writeable:!1}});a.fn.serializeArray=function(){return this.map(function(){var b=a.prop(this,"elements");return b?a.makeArray(b):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||l.test(this.nodeName)||e.test(this.type))}).map(function(b,c){var e=a(this).val();return null==e?null:a.isArray(e)?a.map(e,function(a){return{name:c.name,value:a.replace(d,"\r\n")}}):{name:c.name,
value:e.replace(d,"\r\n")}}).get()}}();try{k.querySelector(":checked")}catch(m){(function(){var b={radio:1,checkbox:1},d=function(){var b=this.options||[],c,d,e;for(c=0,d=b.length;c<d;c++)e=a(b[c]),e[a.prop(b[c],"selected")?"addClass":"removeClass"]("prop-checked")},e=function(){var b=a.prop(this,"checked")?"addClass":"removeClass";if(-1==(this.className||"").indexOf("prop-checked")==("addClass"==b))if(a(this)[b]("prop-checked"),b=this.parentNode)b.className=b.className};c.onNodeNamesPropertyModify("select",
"value",d);c.onNodeNamesPropertyModify("select","selectedIndex",d);c.onNodeNamesPropertyModify("option","selected",function(){a(this).closest("select").each(d)});c.onNodeNamesPropertyModify("input","checked",function(d,h){var f=this.type;"radio"==f&&h?c.modules["form-core"].getGroupElements(this).each(e):b[f]&&a(this).each(e)});a(k).on("change",function(f){if(b[f.target.type])if("radio"==f.target.type)c.modules["form-core"].getGroupElements(f.target).each(e);else a(f.target)[a.prop(f.target,"checked")?
"addClass":"removeClass"]("prop-checked");else"select"==f.target.nodeName.toLowerCase()&&a(f.target).each(d)});c.addReady(function(c,d){a("option, input",c).add(d.filter("option, input")).each(function(){var c;b[this.type]?c="checked":"option"==this.nodeName.toLowerCase()&&(c="selected");if(c)a(this)[a.prop(this,c)?"addClass":"removeClass"]("prop-checked")})})})()}(function(){Modernizr.textareaPlaceholder=!!("placeholder"in a("<textarea />")[0]);var b=a.browser.webkit&&Modernizr.textareaPlaceholder&&
535>c.browserVersion;if(!Modernizr.input.placeholder||!Modernizr.textareaPlaceholder||b){var d="over"==c.cfg.forms.placeholderType,e=c.cfg.forms.responsivePlaceholder,g=["textarea"];Modernizr.input.placeholder||g.push("input");var h=function(a){try{if(a.setSelectionRange)return a.setSelectionRange(0,0),!0;if(a.createTextRange){var b=a.createTextRange();b.collapse(!0);b.moveEnd("character",0);b.moveStart("character",0);b.select();return!0}}catch(c){}},k=function(b,c,e,f){!1===e&&(e=a.prop(b,"value"));
if(!d&&"password"!=b.type){if(!e&&f&&h(b)){var g=setTimeout(function(){h(b)},9);a(b).off(".placeholderremove").on({"keydown.placeholderremove keypress.placeholderremove paste.placeholderremove input.placeholderremove":function(d){if(!d||!(17==d.keyCode||16==d.keyCode))b.value=a.prop(b,"value"),c.box.removeClass("placeholder-visible"),clearTimeout(g),a(b).unbind(".placeholderremove")},"mousedown.placeholderremove drag.placeholderremove select.placeholderremove":function(){h(b);clearTimeout(g);g=setTimeout(function(){h(b)},
9)},"blur.placeholderremove":function(){clearTimeout(g);a(b).unbind(".placeholderremove")}});return}b.value=e}else if(!e&&f){a(b).off(".placeholderremove").on({"keydown.placeholderremove keypress.placeholderremove paste.placeholderremove input.placeholderremove":function(d){if(!d||!(17==d.keyCode||16==d.keyCode))c.box.removeClass("placeholder-visible"),a(b).unbind(".placeholderremove")},"blur.placeholderremove":function(){a(b).unbind(".placeholderremove")}});return}c.box.removeClass("placeholder-visible")},
j=function(b,c,e,f,h){if(!f&&(f=a.data(b,"placeHolder"),!f))return;a(b).unbind(".placeholderremove");if("focus"==h||!h&&a(b).is(":focus"))("password"==b.type||d||a(b).hasClass("placeholder-visible"))&&k(b,f,"",!0);else if(!1===c&&(c=a.prop(b,"value")),c)k(b,f,c);else if(!1===e&&(e=a.attr(b,"placeholder")||""),e&&!c){c=f;!1===e&&(e=a.prop(b,"placeholder"));if(!d&&"password"!=b.type)b.value=e;c.box.addClass("placeholder-visible")}else k(b,f,c)},m=function(b){var b=a(b),c=b.prop("id"),d=!(!b.prop("title")&&
!b.attr("aria-labelledby"));!d&&c&&(d=!!a('label[for="'+c+'"]',b[0].form)[0]);d||(c||(c=a.webshims.getID(b)),d=!!a("label #"+c)[0]);return a(d?'<span class="placeholder-text"></span>':'<label for="'+c+'" class="placeholder-text"></label>')},y=function(){var b={text:1,search:1,url:1,email:1,password:1,tel:1,number:1};return{create:function(b){var c=a.data(b,"placeHolder"),h;if(c)return c;c=a.data(b,"placeHolder",{});a(b).on("focus.placeholder blur.placeholder",function(a){j(this,!1,!1,c,a.type);c.box["focus"==
a.type?"addClass":"removeClass"]("placeholder-focused")});if(h=a.prop(b,"form"))a(h).on("reset.placeholder",function(a){setTimeout(function(){j(b,!1,!1,c,a.type)},0)});if("password"==b.type||d)c.text=m(b),c.box=e||a(b).is(".responsive-width")||-1!=(b.currentStyle||{width:""}).width.indexOf("%")?c.text:a(b).wrap('<span class="placeholder-box placeholder-box-'+(b.nodeName||"").toLowerCase()+" placeholder-box-"+a.css(b,"float")+'" />').parent(),c.text.insertAfter(b).on("mousedown.placeholder",function(){j(this,
!1,!1,c,"focus");try{setTimeout(function(){b.focus()},0)}catch(a){}return!1}),a.each(["lineHeight","fontSize","fontFamily","fontWeight"],function(d,e){var f=a.css(b,e);c.text.css(e)!=f&&c.text.css(e,f)}),a.each(["Left","Top"],function(d,e){var f=(parseInt(a.css(b,"padding"+e),10)||0)+Math.max(parseInt(a.css(b,"margin"+e),10)||0,0)+(parseInt(a.css(b,"border"+e+"Width"),10)||0);c.text.css("padding"+e,f)}),a(b).on("updateshadowdom",function(){var d,e;((e=b.offsetWidth)||(d=b.offsetHeight))&&c.text.css({width:e,
height:d}).css(a(b).position())}).triggerHandler("updateshadowdom");else{var g=function(d){a(b).hasClass("placeholder-visible")&&(k(b,c,""),d&&"submit"==d.type&&setTimeout(function(){d.isDefaultPrevented()&&j(b,!1,!1,c)},9))};a(f).on("beforeunload",g);c.box=a(b);h&&a(h).submit(g)}return c},update:function(d,e){var f=(a.attr(d,"type")||a.prop(d,"type")||"").toLowerCase();!b[f]&&!a.nodeName(d,"textarea")?(c.error('placeholder not allowed on input[type="'+f+'"]'),"date"==f&&c.error('but you can use data-placeholder for input[type="date"]')):
(f=y.create(d),f.text&&f.text.text(e),j(d,!1,e,f))}}}();a.webshims.publicMethods={pHolder:y};g.forEach(function(a){c.defineNodeNameProperty(a,"placeholder",{attr:{set:function(a){b?(c.data(this,"textareaPlaceholder",a),this.placeholder=""):c.contentAttr(this,"placeholder",a);y.update(this,a)},get:function(){return(b?c.data(this,"textareaPlaceholder"):"")||c.contentAttr(this,"placeholder")}},reflect:!0,initAttr:!0})});g.forEach(function(d){var e={},f;["attr","prop"].forEach(function(d){e[d]={set:function(e){var h;
b&&(h=c.data(this,"textareaPlaceholder"));h||(h=c.contentAttr(this,"placeholder"));a.removeData(this,"cachedValidity");var g=f[d]._supset.call(this,e);h&&"value"in this&&j(this,e,h);return g},get:function(){return a(this).hasClass("placeholder-visible")?"":f[d]._supget.call(this)}}});f=c.defineNodeNameProperty(d,"value",e)})}})();(function(){if(!("value"in k.createElement("output"))){c.defineNodeNameProperty("output","value",{prop:{set:function(c){var e=a.data(this,"outputShim");e||(e=b(this));e(c)},
get:function(){return c.contentAttr(this,"value")||a(this).text()||""}}});c.onNodeNamesPropertyModify("input","value",function(b,c,f){"removeAttr"!=f&&(c=a.data(this,"outputShim"))&&c(b)});var b=function(b){if(!b.getAttribute("aria-live")){var b=a(b),e=(b.text()||"").trim(),f=b.attr("id"),h=b.attr("for"),g=a('<input class="output-shim" type="text" disabled name="'+(b.attr("name")||"")+'" value="'+e+'" style="display: none !important;" />').insertAfter(b),j=g[0].form||k,m=function(a){g[0].value=a;
a=g[0].value;b.text(a);c.contentAttr(b[0],"value",a)};b[0].defaultValue=e;c.contentAttr(b[0],"value",e);b.attr({"aria-live":"polite"});f&&(g.attr("id",f),b.attr("aria-labelledby",c.getID(a('label[for="'+f+'"]',j))));h&&(f=c.getID(b),h.split(" ").forEach(function(a){(a=k.getElementById(a))&&a.setAttribute("aria-controls",f)}));b.data("outputShim",m);g.data("outputShim",m);return m}};c.addReady(function(c,e){a("output",c).add(e.filter("output")).each(function(){b(this)})});(function(){var b={updateInput:1,
input:1},e={radio:1,checkbox:1,submit:1,button:1,image:1,reset:1,file:1,color:1},f=function(a){var e,f=a.prop("value"),g=function(e){if(a){var g=a.prop("value");g!==f&&(f=g,(!e||!b[e.type])&&c.triggerInlineForm&&c.triggerInlineForm(a[0],"input"))}},j,k=function(){clearTimeout(j);j=setTimeout(g,9)},i=function(){a.unbind("focusout",i).unbind("keyup keypress keydown paste cut",k).unbind("input change updateInput",g);clearInterval(e);setTimeout(function(){g();a=null},1)};clearInterval(e);e=setInterval(g,
99);k();a.on({"keyup keypress keydown paste cut":k,focusout:i,"input updateInput change":g})};if(a.event.customEvent)a.event.customEvent.updateInput=!0;a(k).on("focusin",function(b){b.target&&b.target.type&&!b.target.readOnly&&!b.target.disabled&&"input"==(b.target.nodeName||"").toLowerCase()&&!e[b.target.type]&&f(a(b.target))})})()}})()});
