(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d20f7a4"],{b495:function(t,e,n){!function(e,o){t.exports=o(n("6c43"))}(window,(function(t){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(e,n){e.exports=t},function(t,e,n){t.exports=n(2)},function(t,e,n){"use strict";n.r(e);var o,r=n(0),i=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),u=function(t,e,n,o){return new(n||(n=Promise))((function(r,i){function u(t){try{a(o.next(t))}catch(t){i(t)}}function s(t){try{a(o.throw(t))}catch(t){i(t)}}function a(t){t.done?r(t.value):new n((function(e){e(t.value)})).then(u,s)}a((o=o.apply(t,e||[])).next())}))},s=function(t,e){var n,o,r,i,u={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,o=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(r=(r=u.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){u.label=i[1];break}if(6===i[0]&&u.label<r[1]){u.label=r[1],r=i;break}if(r&&u.label<r[2]){u.label=r[2],u.ops.push(i);break}r[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},a=function(t){function e(e){var n=t.call(this,e)||this;return n.name="PianoComponent",n.input=void 0,n.output=new r.Volume({context:n.context}),n._enabled=!1,n.volume=n.output.volume,n._loaded=!1,n.volume.value=e.volume,n._enabled=e.enabled,n.samples=e.samples,n}return i(e,t),Object.defineProperty(e.prototype,"loaded",{get:function(){return this._loaded},enumerable:!0,configurable:!0}),e.prototype.load=function(){return u(this,void 0,void 0,(function(){return s(this,(function(t){switch(t.label){case 0:return this._enabled?[4,this._internalLoad()]:[3,2];case 1:return t.sent(),this._loaded=!0,[3,3];case 2:return[2,Promise.resolve()];case 3:return[2]}}))}))},e}(r.ToneAudioNode);function c(t){return Object(r.Frequency)(t,"midi").toNote()}function l(t,e){return Math.random()*(e-t)+t}var p={1:[8],2:[6,12],3:[1,7,15],4:[1,5,10,15],5:[1,4,8,12,16],6:[1,3,7,10,13,16],7:[1,3,6,9,11,13,16],8:[1,3,5,7,9,11,13,16],9:[1,3,5,7,9,11,13,15,16],10:[1,2,3,5,7,9,11,13,15,16],11:[1,2,3,5,7,9,11,13,14,15,16],12:[1,2,3,4,5,7,9,11,13,14,15,16],13:[1,2,3,4,5,7,9,11,12,13,14,15,16],14:[1,2,3,4,5,6,7,9,11,12,13,14,15,16],15:[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16],16:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},f=[21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108],h=[21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87],d=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),_=function(t){function e(e){var n=t.call(this,e)||this;n._urls={};for(var o,r,i=0,u=(o=e.minNote,r=e.maxNote,h.filter((function(t){return o<=t&&t<=r})));i<u.length;i++){var s=u[i];n._urls[s]="harmS"+c(s).replace("#","s")+".[mp3|ogg]"}return n}return d(e,t),e.prototype.triggerAttack=function(t,e,n){this._enabled&&function(t){return h[0]<=t&&t<=h[h.length-1]}(t)&&this._sampler.triggerAttack(Object(r.Midi)(t).toNote(),e,n*l(.5,1))},e.prototype._internalLoad=function(){var t=this;return new Promise((function(e){t._sampler=new r.Sampler({baseUrl:t.samples,onload:e,urls:t._urls}).connect(t.output)}))},e}(a),y=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),b=function(t){function e(e){var n=t.call(this,e)||this;n._urls={};for(var o=e.minNote;o<=e.maxNote;o++)n._urls[o]="rel"+(o-20)+".[mp3|ogg]";return n}return y(e,t),e.prototype._internalLoad=function(){var t=this;return new Promise((function(e){t._buffers=new r.ToneAudioBuffers(t._urls,e,t.samples)}))},e.prototype.start=function(t,e,n){this._enabled&&this._buffers.has(t)&&new r.ToneBufferSource({buffer:this._buffers.get(t),context:this.context}).connect(this.output).start(e,0,void 0,.015*n*l(.5,1))},e}(a),v=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),m=function(t){function e(e){var n=t.call(this,e)||this;return n._downTime=1/0,n._currentSound=null,n._downTime=1/0,n}return v(e,t),e.prototype._internalLoad=function(){var t=this;return new Promise((function(e){t._buffers=new r.ToneAudioBuffers({down1:"pedalD1.mp3",down2:"pedalD2.mp3",up1:"pedalU1.mp3",up2:"pedalU2.mp3"},e,t.samples)}))},e.prototype._squash=function(t){this._currentSound&&"stopped"!==this._currentSound.state&&this._currentSound.stop(t),this._currentSound=null},e.prototype._playSample=function(t,e){this._enabled&&(this._currentSound=new r.ToneBufferSource({buffer:this._buffers.get(""+e+(Math.random()>.5?1:2)),context:this.context,curve:"exponential",fadeIn:.05,fadeOut:.1}).connect(this.output),this._currentSound.start(t,l(0,.01),void 0,.1*l(.5,1)))},e.prototype.down=function(t){this._squash(t),this._downTime=t,this._playSample(t,"down")},e.prototype.up=function(t){this._squash(t),this._downTime=1/0,this._playSample(t,"up")},e.prototype.isDown=function(t){return t>this._downTime},e}(a),w=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),g=function(t){function e(e){var n=t.call(this,e)||this;return n.name="PianoString",n._urls={},e.notes.forEach((function(t){return n._urls[t]=(o=t,r=e.velocity,c(o).replace("#","s")+"v"+r+".[mp3|ogg]");var o,r})),n.samples=e.samples,n}return w(e,t),e.prototype.load=function(){var t=this;return new Promise((function(e){t._sampler=t.output=new r.Sampler({attack:0,baseUrl:t.samples,curve:"exponential",onload:e,release:.4,urls:t._urls,volume:3})}))},e.prototype.triggerAttack=function(t,e,n){this._sampler.triggerAttack(t,e,n)},e.prototype.triggerRelease=function(t,e){this._sampler.triggerRelease(t,e)},e}(r.ToneAudioNode),O=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),x=function(t,e,n,o){return new(n||(n=Promise))((function(r,i){function u(t){try{a(o.next(t))}catch(t){i(t)}}function s(t){try{a(o.throw(t))}catch(t){i(t)}}function a(t){t.done?r(t.value):new n((function(e){e(t.value)})).then(u,s)}a((o=o.apply(t,e||[])).next())}))},j=function(t,e){var n,o,r,i,u={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,o=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(r=(r=u.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){u.label=i[1];break}if(6===i[0]&&u.label<r[1]){u.label=r[1],r=i;break}if(r&&u.label<r[2]){u.label=r[2],u.ops.push(i);break}r[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},N=function(t){function e(e){var n,o,r=t.call(this,e)||this,i=(n=e.minNote,o=e.maxNote,f.filter((function(t){return n<=t&&t<=o}))),u=p[e.velocities].slice();return r._strings=u.map((function(t){return new g(Object.assign(e,{notes:i,velocity:t}))})),r._activeNotes=new Map,r}return O(e,t),e.prototype.scale=function(t,e,n,o,r){return(t-e)/(n-e)*(r-o)+o},e.prototype.triggerAttack=function(t,e,n){var o=this.scale(n,0,1,-.5,this._strings.length-.51),i=Math.max(Math.round(o),0),u=1+o-i;1===this._strings.length&&(u=n);var s=this._strings[i];this._activeNotes.has(t)&&this.triggerRelease(t,e),this._activeNotes.set(t,s),s.triggerAttack(Object(r.Midi)(t).toNote(),e,u)},e.prototype.triggerRelease=function(t,e){this._activeNotes.has(t)&&(this._activeNotes.get(t).triggerRelease(Object(r.Midi)(t).toNote(),e),this._activeNotes.delete(t))},e.prototype._internalLoad=function(){return x(this,void 0,void 0,(function(){var t=this;return j(this,(function(e){switch(e.label){case 0:return[4,Promise.all(this._strings.map((function(e){return x(t,void 0,void 0,(function(){return j(this,(function(t){switch(t.label){case 0:return[4,e.load()];case 1:return t.sent(),e.connect(this.output),[2]}}))}))})))];case 1:return e.sent(),[2]}}))}))},e}(a);n.d(e,"Piano",(function(){return M}));var P=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),k=function(t,e,n,o){return new(n||(n=Promise))((function(r,i){function u(t){try{a(o.next(t))}catch(t){i(t)}}function s(t){try{a(o.throw(t))}catch(t){i(t)}}function a(t){t.done?r(t.value):new n((function(e){e(t.value)})).then(u,s)}a((o=o.apply(t,e||[])).next())}))},S=function(t,e){var n,o,r,i,u={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,o=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(r=(r=u.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){u.label=i[1];break}if(6===i[0]&&u.label<r[1]){u.label=r[1],r=i;break}if(r&&u.label<r[2]){u.label=r[2],u.ops.push(i);break}r[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(t,u)}catch(t){i=[6,t],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},M=function(t){function e(){var n=t.call(this,Object(r.optionsFromArguments)(e.getDefaults(),arguments))||this;n.name="Piano",n.input=void 0,n.output=new r.Gain({context:n.context}),n._heldNotes=new Map,n._loaded=!1;var o=Object(r.optionsFromArguments)(e.getDefaults(),arguments);return n._heldNotes=new Map,n._sustainedNotes=new Map,n._strings=new N(Object.assign({},o,{enabled:!0,volume:o.volume.strings})).connect(n.output),n.strings=n._strings.volume,n._pedal=new m(Object.assign({},o,{enabled:o.pedal,volume:o.volume.pedal})).connect(n.output),n.pedal=n._pedal.volume,n._keybed=new b(Object.assign({},o,{enabled:o.release,volume:o.volume.keybed})).connect(n.output),n.keybed=n._keybed.volume,n._harmonics=new _(Object.assign({},o,{enabled:o.release,volume:o.volume.harmonics})).connect(n.output),n.harmonics=n._harmonics.volume,n}return P(e,t),e.getDefaults=function(){return Object.assign(r.ToneAudioNode.getDefaults(),{maxNote:108,minNote:21,pedal:!0,release:!1,samples:"./audio/",velocities:1,volume:{harmonics:0,keybed:0,pedal:0,strings:0}})},e.prototype.load=function(){return k(this,void 0,void 0,(function(){return S(this,(function(t){switch(t.label){case 0:return[4,Promise.all([this._strings.load(),this._pedal.load(),this._keybed.load(),this._harmonics.load()])];case 1:return t.sent(),this._loaded=!0,[2]}}))}))},Object.defineProperty(e.prototype,"loaded",{get:function(){return this._loaded},enumerable:!0,configurable:!0}),e.prototype.pedalDown=function(t){return this.loaded&&(t=this.toSeconds(t),this._pedal.isDown(t)||this._pedal.down(t)),this},e.prototype.pedalUp=function(t){var e=this;if(this.loaded){var n=this.toSeconds(t);this._pedal.isDown(n)&&(this._pedal.up(n),this._sustainedNotes.forEach((function(t,o){e._heldNotes.has(o)||e._strings.triggerRelease(o,n)})),this._sustainedNotes.clear())}return this},e.prototype.keyDown=function(t,e,n){return void 0===e&&(e=this.immediate()),void 0===n&&(n=.8),this.loaded&&(e=this.toSeconds(e),Object(r.isString)(t)&&(t=Math.round(Object(r.Midi)(t).toMidi())),this._heldNotes.has(t)||(this._heldNotes.set(t,{time:e,velocity:n}),this._strings.triggerAttack(t,e,n))),this},e.prototype.keyUp=function(t,e,n){if(void 0===e&&(e=this.immediate()),void 0===n&&(n=.8),this.loaded&&(e=this.toSeconds(e),Object(r.isString)(t)&&(t=Math.round(Object(r.Midi)(t).toMidi())),this._heldNotes.has(t))){var o=this._heldNotes.get(t);this._heldNotes.delete(t);var i=3/Math.pow(Math.max(e-o.time,.1),.7)*o.velocity*n;i=Math.max(i,.4),i=Math.min(i,4),this._pedal.isDown(e)?this._sustainedNotes.has(t)||this._sustainedNotes.set(t,e):(this._strings.triggerRelease(t,e),this._harmonics.triggerAttack(t,e,i)),this._keybed.start(t,e,n)}return this},e.prototype.stopAll=function(){var t=this;return this.pedalUp(),this._heldNotes.forEach((function(e,n){t.keyUp(n)})),this},e}(r.ToneAudioNode)}]).Piano}))}}]);
//# sourceMappingURL=chunk-2d20f7a4-legacy.252f9061.js.map