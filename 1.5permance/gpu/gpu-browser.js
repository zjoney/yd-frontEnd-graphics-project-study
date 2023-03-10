/**
 * gpu.js
 * http://gpu.rocks/
 *
 * GPU Accelerated JavaScript
 *
 * @version 2.0.0-rc.1
 * @date Sun Feb 10 2019 23:00:44 GMT-0500 (Eastern Standard Time)
 *
 * @license MIT
 * The MIT License
 *
 * Copyright (c) 2019 gpu.js Team
 */(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.acorn = {})));
  }(this, (function (exports) { 'use strict';
  
  
  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };
  
  
  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
  
  var keywords = {
    5: ecma5AndLessKeywords,
    6: ecma5AndLessKeywords + " const class extends export import super"
  };
  
  var keywordRelationalOperator = /^in(stanceof)?$/;
  
  
  
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u08a0-\u08b4\u08b6-\u08bd\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fef\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7b9\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08d3-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1cf7-\u1cf9\u1dc0-\u1df9\u1dfb-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
  
  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
  
  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
  
  
  var astralIdentifierStartCodes = [0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,477,28,11,0,9,21,190,52,76,44,33,24,27,35,30,0,12,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,85,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,159,52,19,3,54,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,86,26,230,43,117,63,32,0,257,0,11,39,8,0,22,0,12,39,3,3,20,0,35,56,264,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,328,18,270,921,103,110,18,195,2749,1070,4050,582,8634,568,8,30,114,29,19,47,17,3,32,20,6,18,689,63,129,68,12,0,67,12,65,1,31,6129,15,754,9486,286,82,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,4149,196,60,67,1213,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,3,5761,15,7472,3104,541];
  
  var astralIdentifierCodes = [509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,525,10,176,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,4,9,83,11,7,0,161,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,193,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,84,14,5,9,243,14,166,9,280,9,41,6,2,3,9,0,10,10,47,15,406,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,330,3,19306,9,135,4,60,6,26,9,1016,45,17,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,2214,6,110,6,6,9,792487,239];
  
  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) { return false }
      pos += set[i + 1];
      if (pos >= code) { return true }
    }
  }
  
  
  function isIdentifierStart(code, astral) {
    if (code < 65) { return code === 36 }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }
  
  
  function isIdentifierChar(code, astral) {
    if (code < 48) { return code === 36 }
    if (code < 58) { return true }
    if (code < 65) { return false }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }
  
  
  
  
  
  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};
  
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };
  
  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true};
  var startsExpr = {startsExpr: true};
  
  
  var keywords$1 = {};
  
  function kw(name, options) {
    if ( options === void 0 ) options = {};
  
    options.keyword = name;
    return keywords$1[name] = new TokenType(name, options)
  }
  
  var types = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    eof: new TokenType("eof"),
  
    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    invalidTemplate: new TokenType("invalidTemplate"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),
  
  
    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=/===/!==", 6),
    relational: binop("</>/<=/>=", 7),
    bitShift: binop("<</>>/>>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),
  
    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class", startsExpr),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import"),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };
  
  
  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");
  
  function isNewLine(code, ecma2019String) {
    return code === 10 || code === 13 || (!ecma2019String && (code === 0x2028 || code === 0x2029))
  }
  
  var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
  
  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
  
  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;
  
  
  function has(obj, propName) {
    return hasOwnProperty.call(obj, propName)
  }
  
  var isArray = Array.isArray || (function (obj) { return (
    toString.call(obj) === "[object Array]"
  ); });
  
  
  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };
  
  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };
  
  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
  };
  
  
  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreakG.lastIndex = cur;
      var match = lineBreakG.exec(input);
      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else {
        return new Position(line, offset - cur)
      }
    }
  }
  
  
  var defaultOptions = {
    ecmaVersion: 7,
    sourceType: "script",
    onInsertedSemicolon: null,
    onTrailingComma: null,
    allowReserved: null,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowAwaitOutsideFunction: false,
    allowHashBang: false,
    locations: false,
    onToken: null,
    onComment: null,
    ranges: false,
    program: null,
    sourceFile: null,
    directSourceFile: null,
    preserveParens: false,
    plugins: {}
  };
  
  
  function getOptions(opts) {
    var options = {};
  
    for (var opt in defaultOptions)
      { options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt]; }
  
    if (options.ecmaVersion >= 2015)
      { options.ecmaVersion -= 2009; }
  
    if (options.allowReserved == null)
      { options.allowReserved = options.ecmaVersion < 5; }
  
    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      { options.onComment = pushComment(options, options.onComment); }
  
    return options
  }
  
  function pushComment(options, array) {
    return function(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "Block" : "Line",
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        { comment.loc = new SourceLocation(this, startLoc, endLoc); }
      if (options.ranges)
        { comment.range = [start, end]; }
      array.push(comment);
    }
  }
  
  var plugins = {};
  
  function keywordRegexp(words) {
    return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
  }
  
  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = keywordRegexp(keywords[options.ecmaVersion >= 6 ? 6 : 5]);
    var reserved = "";
    if (!options.allowReserved) {
      for (var v = options.ecmaVersion;; v--)
        { if (reserved = reservedWords[v]) { break } }
      if (options.sourceType === "module") { reserved += " await"; }
    }
    this.reservedWords = keywordRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = keywordRegexp(reservedStrict);
    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);
  
    this.containsEsc = false;
  
    this.loadPlugins(options.plugins);
  
  
    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }
  
    this.type = types.eof;
    this.value = null;
    this.start = this.end = this.pos;
    this.startLoc = this.endLoc = this.curPosition();
  
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;
  
    this.context = this.initialContext();
    this.exprAllowed = true;
  
    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);
  
    this.potentialArrowAt = -1;
  
    this.inFunction = this.inGenerator = this.inAsync = false;
    this.yieldPos = this.awaitPos = 0;
    this.labels = [];
  
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
      { this.skipLineComment(2); }
  
    this.scopeStack = [];
    this.enterFunctionScope();
  
    this.regexpState = null;
  };
  
  Parser.prototype.isKeyword = function isKeyword (word) { return this.keywords.test(word) };
  Parser.prototype.isReservedWord = function isReservedWord (word) { return this.reservedWords.test(word) };
  
  Parser.prototype.extend = function extend (name, f) {
    this[name] = f(this[name]);
  };
  
  Parser.prototype.loadPlugins = function loadPlugins (pluginConfigs) {
      var this$1 = this;
  
    for (var name in pluginConfigs) {
      var plugin = plugins[name];
      if (!plugin) { throw new Error("Plugin '" + name + "' not found") }
      plugin(this$1, pluginConfigs[name]);
    }
  };
  
  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };
  
  var pp = Parser.prototype;
  
  
  var literal = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)"|;)/;
  pp.strictDirective = function(start) {
    var this$1 = this;
  
    for (;;) {
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this$1.input)[0].length;
      var match = literal.exec(this$1.input.slice(start));
      if (!match) { return false }
      if ((match[1] || match[2]) === "use strict") { return true }
      start += match[0].length;
    }
  };
  
  
  pp.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };
  
  
  pp.isContextual = function(name) {
    return this.type === types.name && this.value === name && !this.containsEsc
  };
  
  
  pp.eatContextual = function(name) {
    if (!this.isContextual(name)) { return false }
    this.next();
    return true
  };
  
  
  pp.expectContextual = function(name) {
    if (!this.eatContextual(name)) { this.unexpected(); }
  };
  
  
  pp.canInsertSemicolon = function() {
    return this.type === types.eof ||
      this.type === types.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };
  
  pp.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
      return true
    }
  };
  
  
  pp.semicolon = function() {
    if (!this.eat(types.semi) && !this.insertSemicolon()) { this.unexpected(); }
  };
  
  pp.afterTrailingComma = function(tokType, notNext) {
    if (this.type === tokType) {
      if (this.options.onTrailingComma)
        { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
      if (!notNext)
        { this.next(); }
      return true
    }
  };
  
  
  pp.expect = function(type) {
    this.eat(type) || this.unexpected();
  };
  
  
  pp.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };
  
  function DestructuringErrors() {
    this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
  }
  
  pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
    if (!refDestructuringErrors) { return }
    if (refDestructuringErrors.trailingComma > -1)
      { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
    var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
    if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
  };
  
  pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    if (!refDestructuringErrors) { return false }
    var shorthandAssign = refDestructuringErrors.shorthandAssign;
    var doubleProto = refDestructuringErrors.doubleProto;
    if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
    if (shorthandAssign >= 0)
      { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
    if (doubleProto >= 0)
      { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
  };
  
  pp.checkYieldAwaitInDefaultParams = function() {
    if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
      { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
    if (this.awaitPos)
      { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
  };
  
  pp.isSimpleAssignTarget = function(expr) {
    if (expr.type === "ParenthesizedExpression")
      { return this.isSimpleAssignTarget(expr.expression) }
    return expr.type === "Identifier" || expr.type === "MemberExpression"
  };
  
  var pp$1 = Parser.prototype;
  
  
  
  pp$1.parseTopLevel = function(node) {
    var this$1 = this;
  
    var exports = {};
    if (!node.body) { node.body = []; }
    while (this.type !== types.eof) {
      var stmt = this$1.parseStatement(true, true, exports);
      node.body.push(stmt);
    }
    this.adaptDirectivePrologue(node.body);
    this.next();
    if (this.options.ecmaVersion >= 6) {
      node.sourceType = this.options.sourceType;
    }
    return this.finishNode(node, "Program")
  };
  
  var loopLabel = {kind: "loop"};
  var switchLabel = {kind: "switch"};
  
  pp$1.isLet = function() {
    if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    if (nextCh === 91 || nextCh === 123) { return true } 
    if (isIdentifierStart(nextCh, true)) {
      var pos = next + 1;
      while (isIdentifierChar(this.input.charCodeAt(pos), true)) { ++pos; }
      var ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) { return true }
    }
    return false
  };
  
  pp$1.isAsyncFunction = function() {
    if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
      { return false }
  
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length;
    return !lineBreak.test(this.input.slice(this.pos, next)) &&
      this.input.slice(next, next + 8) === "function" &&
      (next + 8 === this.input.length || !isIdentifierChar(this.input.charAt(next + 8)))
  };
  
  
  pp$1.parseStatement = function(declaration, topLevel, exports) {
    var starttype = this.type, node = this.startNode(), kind;
  
    if (this.isLet()) {
      starttype = types._var;
      kind = "let";
    }
  
  
    switch (starttype) {
    case types._break: case types._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case types._debugger: return this.parseDebuggerStatement(node)
    case types._do: return this.parseDoStatement(node)
    case types._for: return this.parseForStatement(node)
    case types._function:
      if (!declaration && this.options.ecmaVersion >= 6) { this.unexpected(); }
      return this.parseFunctionStatement(node, false)
    case types._class:
      if (!declaration) { this.unexpected(); }
      return this.parseClass(node, true)
    case types._if: return this.parseIfStatement(node)
    case types._return: return this.parseReturnStatement(node)
    case types._switch: return this.parseSwitchStatement(node)
    case types._throw: return this.parseThrowStatement(node)
    case types._try: return this.parseTryStatement(node)
    case types._const: case types._var:
      kind = kind || this.value;
      if (!declaration && kind !== "var") { this.unexpected(); }
      return this.parseVarStatement(node, kind)
    case types._while: return this.parseWhileStatement(node)
    case types._with: return this.parseWithStatement(node)
    case types.braceL: return this.parseBlock()
    case types.semi: return this.parseEmptyStatement(node)
    case types._export:
    case types._import:
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
        if (!this.inModule)
          { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
      }
      return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports)
  
    default:
      if (this.isAsyncFunction()) {
        if (!declaration) { this.unexpected(); }
        this.next();
        return this.parseFunctionStatement(node, true)
      }
  
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon))
        { return this.parseLabeledStatement(node, maybeName, expr) }
      else { return this.parseExpressionStatement(node, expr) }
    }
  };
  
  pp$1.parseBreakContinueStatement = function(node, keyword) {
    var this$1 = this;
  
    var isBreak = keyword === "break";
    this.next();
    if (this.eat(types.semi) || this.insertSemicolon()) { node.label = null; }
    else if (this.type !== types.name) { this.unexpected(); }
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }
  
    var i = 0;
    for (; i < this.labels.length; ++i) {
      var lab = this$1.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
        if (node.label && isBreak) { break }
      }
    }
    if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };
  
  pp$1.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };
  
  pp$1.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    this.expect(types._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      { this.eat(types.semi); }
    else
      { this.semicolon(); }
    return this.finishNode(node, "DoWhileStatement")
  };
  
  
  pp$1.parseForStatement = function(node) {
    this.next();
    var awaitAt = (this.options.ecmaVersion >= 9 && (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction)) && this.eatContextual("await")) ? this.lastTokStart : -1;
    this.labels.push(loopLabel);
    this.enterLexicalScope();
    this.expect(types.parenL);
    if (this.type === types.semi) {
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, null)
    }
    var isLet = this.isLet();
    if (this.type === types._var || this.type === types._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1 &&
          !(kind !== "var" && init$1.declarations[0].init)) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types._in) {
            if (awaitAt > -1) { this.unexpected(awaitAt); }
          } else { node.await = awaitAt > -1; }
        }
        return this.parseForIn(node, init$1)
      }
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, init$1)
    }
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(true, refDestructuringErrors);
    if (this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      this.toAssignable(init, false, refDestructuringErrors);
      this.checkLVal(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init)
  };
  
  pp$1.parseFunctionStatement = function(node, isAsync) {
    this.next();
    return this.parseFunction(node, true, false, isAsync)
  };
  
  pp$1.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    node.consequent = this.parseStatement(!this.strict && this.type === types._function);
    node.alternate = this.eat(types._else) ? this.parseStatement(!this.strict && this.type === types._function) : null;
    return this.finishNode(node, "IfStatement")
  };
  
  pp$1.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      { this.raise(this.start, "'return' outside of function"); }
    this.next();
  
  
    if (this.eat(types.semi) || this.insertSemicolon()) { node.argument = null; }
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };
  
  pp$1.parseSwitchStatement = function(node) {
    var this$1 = this;
  
    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(types.braceL);
    this.labels.push(switchLabel);
    this.enterLexicalScope();
  
  
    var cur;
    for (var sawDefault = false; this.type !== types.braceR;) {
      if (this$1.type === types._case || this$1.type === types._default) {
        var isCase = this$1.type === types._case;
        if (cur) { this$1.finishNode(cur, "SwitchCase"); }
        node.cases.push(cur = this$1.startNode());
        cur.consequent = [];
        this$1.next();
        if (isCase) {
          cur.test = this$1.parseExpression();
        } else {
          if (sawDefault) { this$1.raiseRecoverable(this$1.lastTokStart, "Multiple default clauses"); }
          sawDefault = true;
          cur.test = null;
        }
        this$1.expect(types.colon);
      } else {
        if (!cur) { this$1.unexpected(); }
        cur.consequent.push(this$1.parseStatement(true));
      }
    }
    this.exitLexicalScope();
    if (cur) { this.finishNode(cur, "SwitchCase"); }
    this.next(); 
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };
  
  pp$1.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };
  
  
  var empty = [];
  
  pp$1.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === types._catch) {
      var clause = this.startNode();
      this.next();
      if (this.eat(types.parenL)) {
        clause.param = this.parseBindingAtom();
        this.enterLexicalScope();
        this.checkLVal(clause.param, "let");
        this.expect(types.parenR);
      } else {
        if (this.options.ecmaVersion < 10) { this.unexpected(); }
        clause.param = null;
        this.enterLexicalScope();
      }
      clause.body = this.parseBlock(false);
      this.exitLexicalScope();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      { this.raise(node.start, "Missing catch or finally clause"); }
    return this.finishNode(node, "TryStatement")
  };
  
  pp$1.parseVarStatement = function(node, kind) {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };
  
  pp$1.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };
  
  pp$1.parseWithStatement = function(node) {
    if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement(false);
    return this.finishNode(node, "WithStatement")
  };
  
  pp$1.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };
  
  pp$1.parseLabeledStatement = function(node, maybeName, expr) {
    var this$1 = this;
  
    for (var i$1 = 0, list = this$1.labels; i$1 < list.length; i$1 += 1)
      {
      var label = list[i$1];
  
      if (label.name === maybeName)
        { this$1.raise(expr.start, "Label '" + maybeName + "' is already declared");
    } }
    var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
    for (var i = this.labels.length - 1; i >= 0; i--) {
      var label$1 = this$1.labels[i];
      if (label$1.statementStart === node.start) {
        label$1.statementStart = this$1.start;
        label$1.kind = kind;
      } else { break }
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(true);
    if (node.body.type === "ClassDeclaration" ||
        node.body.type === "VariableDeclaration" && node.body.kind !== "var" ||
        node.body.type === "FunctionDeclaration" && (this.strict || node.body.generator || node.body.async))
      { this.raiseRecoverable(node.body.start, "Invalid labeled declaration"); }
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };
  
  pp$1.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };
  
  
  pp$1.parseBlock = function(createNewLexicalScope) {
    var this$1 = this;
    if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
  
    var node = this.startNode();
    node.body = [];
    this.expect(types.braceL);
    if (createNewLexicalScope) {
      this.enterLexicalScope();
    }
    while (!this.eat(types.braceR)) {
      var stmt = this$1.parseStatement(true);
      node.body.push(stmt);
    }
    if (createNewLexicalScope) {
      this.exitLexicalScope();
    }
    return this.finishNode(node, "BlockStatement")
  };
  
  
  pp$1.parseFor = function(node, init) {
    node.init = init;
    this.expect(types.semi);
    node.test = this.type === types.semi ? null : this.parseExpression();
    this.expect(types.semi);
    node.update = this.type === types.parenR ? null : this.parseExpression();
    this.expect(types.parenR);
    this.exitLexicalScope();
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };
  
  
  pp$1.parseForIn = function(node, init) {
    var type = this.type === types._in ? "ForInStatement" : "ForOfStatement";
    this.next();
    if (type === "ForInStatement") {
      if (init.type === "AssignmentPattern" ||
        (init.type === "VariableDeclaration" && init.declarations[0].init != null &&
         (this.strict || init.declarations[0].id.type !== "Identifier")))
        { this.raise(init.start, "Invalid assignment in for-in loop head"); }
    }
    node.left = init;
    node.right = type === "ForInStatement" ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(types.parenR);
    this.exitLexicalScope();
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, type)
  };
  
  
  pp$1.parseVar = function(node, isFor, kind) {
    var this$1 = this;
  
    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this$1.startNode();
      this$1.parseVarId(decl, kind);
      if (this$1.eat(types.eq)) {
        decl.init = this$1.parseMaybeAssign(isFor);
      } else if (kind === "const" && !(this$1.type === types._in || (this$1.options.ecmaVersion >= 6 && this$1.isContextual("of")))) {
        this$1.unexpected();
      } else if (decl.id.type !== "Identifier" && !(isFor && (this$1.type === types._in || this$1.isContextual("of")))) {
        this$1.raise(this$1.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this$1.finishNode(decl, "VariableDeclarator"));
      if (!this$1.eat(types.comma)) { break }
    }
    return node
  };
  
  pp$1.parseVarId = function(decl, kind) {
    decl.id = this.parseBindingAtom(kind);
    this.checkLVal(decl.id, kind, false);
  };
  
  
  pp$1.parseFunction = function(node, isStatement, allowExpressionBody, isAsync) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync)
      { node.generator = this.eat(types.star); }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    if (isStatement) {
      node.id = isStatement === "nullableID" && this.type !== types.name ? null : this.parseIdent();
      if (node.id) {
        this.checkLVal(node.id, this.inModule && !this.inFunction ? "let" : "var");
      }
    }
  
    var oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
    this.inGenerator = node.generator;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
    this.enterFunctionScope();
  
    if (!isStatement)
      { node.id = this.type === types.name ? this.parseIdent() : null; }
  
    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression")
  };
  
  pp$1.parseFunctionParams = function(node) {
    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
  };
  
  
  pp$1.parseClass = function(node, isStatement) {
    var this$1 = this;
  
    this.next();
  
    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      var member = this$1.parseClassMember(classBody);
      if (member && member.type === "MethodDefinition" && member.kind === "constructor") {
        if (hadConstructor) { this$1.raise(member.start, "Duplicate constructor in the same class"); }
        hadConstructor = true;
      }
    }
    node.body = this.finishNode(classBody, "ClassBody");
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };
  
  pp$1.parseClassMember = function(classBody) {
    var this$1 = this;
  
    if (this.eat(types.semi)) { return null }
  
    var method = this.startNode();
    var tryContextual = function (k, noLineBreak) {
      if ( noLineBreak === void 0 ) noLineBreak = false;
  
      var start = this$1.start, startLoc = this$1.startLoc;
      if (!this$1.eatContextual(k)) { return false }
      if (this$1.type !== types.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) { return true }
      if (method.key) { this$1.unexpected(); }
      method.computed = false;
      method.key = this$1.startNodeAt(start, startLoc);
      method.key.name = k;
      this$1.finishNode(method.key, "Identifier");
      return false
    };
  
    method.kind = "method";
    method.static = tryContextual("static");
    var isGenerator = this.eat(types.star);
    var isAsync = false;
    if (!isGenerator) {
      if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
        isAsync = true;
        isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      } else if (tryContextual("get")) {
        method.kind = "get";
      } else if (tryContextual("set")) {
        method.kind = "set";
      }
    }
    if (!method.key) { this.parsePropertyName(method); }
    var key = method.key;
    if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" ||
        key.type === "Literal" && key.value === "constructor")) {
      if (method.kind !== "method") { this.raise(key.start, "Constructor can't have get/set modifier"); }
      if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
      if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
      method.kind = "constructor";
    } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
      this.raise(key.start, "Classes may not have a static property named prototype");
    }
    this.parseClassMethod(classBody, method, isGenerator, isAsync);
    if (method.kind === "get" && method.value.params.length !== 0)
      { this.raiseRecoverable(method.value.start, "getter should have no params"); }
    if (method.kind === "set" && method.value.params.length !== 1)
      { this.raiseRecoverable(method.value.start, "setter should have exactly one param"); }
    if (method.kind === "set" && method.value.params[0].type === "RestElement")
      { this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params"); }
    return method
  };
  
  pp$1.parseClassMethod = function(classBody, method, isGenerator, isAsync) {
    method.value = this.parseMethod(isGenerator, isAsync);
    classBody.body.push(this.finishNode(method, "MethodDefinition"));
  };
  
  pp$1.parseClassId = function(node, isStatement) {
    node.id = this.type === types.name ? this.parseIdent() : isStatement === true ? this.unexpected() : null;
  };
  
  pp$1.parseClassSuper = function(node) {
    node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
  };
  
  
  pp$1.parseExport = function(node, exports) {
    var this$1 = this;
  
    this.next();
    if (this.eat(types.star)) {
      this.expectContextual("from");
      if (this.type !== types.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration")
    }
    if (this.eat(types._default)) { 
      this.checkExport(exports, "default", this.lastTokStart);
      var isAsync;
      if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        this.next();
        if (isAsync) { this.next(); }
        node.declaration = this.parseFunction(fNode, "nullableID", false, isAsync);
      } else if (this.type === types._class) {
        var cNode = this.startNode();
        node.declaration = this.parseClass(cNode, "nullableID");
      } else {
        node.declaration = this.parseMaybeAssign();
        this.semicolon();
      }
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseStatement(true);
      if (node.declaration.type === "VariableDeclaration")
        { this.checkVariableExport(exports, node.declaration.declarations); }
      else
        { this.checkExport(exports, node.declaration.id.name, node.declaration.id.start); }
      node.specifiers = [];
      node.source = null;
    } else { 
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers(exports);
      if (this.eatContextual("from")) {
        if (this.type !== types.string) { this.unexpected(); }
        node.source = this.parseExprAtom();
      } else {
        for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
          var spec = list[i];
  
          this$1.checkUnreserved(spec.local);
        }
  
        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };
  
  pp$1.checkExport = function(exports, name, pos) {
    if (!exports) { return }
    if (has(exports, name))
      { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
    exports[name] = true;
  };
  
  pp$1.checkPatternExport = function(exports, pat) {
    var this$1 = this;
  
    var type = pat.type;
    if (type === "Identifier")
      { this.checkExport(exports, pat.name, pat.start); }
    else if (type === "ObjectPattern")
      { for (var i = 0, list = pat.properties; i < list.length; i += 1)
        {
          var prop = list[i];
  
          this$1.checkPatternExport(exports, prop);
        } }
    else if (type === "ArrayPattern")
      { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
        var elt = list$1[i$1];
  
          if (elt) { this$1.checkPatternExport(exports, elt); }
      } }
    else if (type === "Property")
      { this.checkPatternExport(exports, pat.value); }
    else if (type === "AssignmentPattern")
      { this.checkPatternExport(exports, pat.left); }
    else if (type === "RestElement")
      { this.checkPatternExport(exports, pat.argument); }
    else if (type === "ParenthesizedExpression")
      { this.checkPatternExport(exports, pat.expression); }
  };
  
  pp$1.checkVariableExport = function(exports, decls) {
    var this$1 = this;
  
    if (!exports) { return }
    for (var i = 0, list = decls; i < list.length; i += 1)
      {
      var decl = list[i];
  
      this$1.checkPatternExport(exports, decl.id);
    }
  };
  
  pp$1.shouldParseExportStatement = function() {
    return this.type.keyword === "var" ||
      this.type.keyword === "const" ||
      this.type.keyword === "class" ||
      this.type.keyword === "function" ||
      this.isLet() ||
      this.isAsyncFunction()
  };
  
  
  pp$1.parseExportSpecifiers = function(exports) {
    var this$1 = this;
  
    var nodes = [], first = true;
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var node = this$1.startNode();
      node.local = this$1.parseIdent(true);
      node.exported = this$1.eatContextual("as") ? this$1.parseIdent(true) : node.local;
      this$1.checkExport(exports, node.exported.name, node.exported.start);
      nodes.push(this$1.finishNode(node, "ExportSpecifier"));
    }
    return nodes
  };
  
  
  pp$1.parseImport = function(node) {
    this.next();
    if (this.type === types.string) {
      node.specifiers = empty;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };
  
  
  pp$1.parseImportSpecifiers = function() {
    var this$1 = this;
  
    var nodes = [], first = true;
    if (this.type === types.name) {
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLVal(node.local, "let");
      nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
      if (!this.eat(types.comma)) { return nodes }
    }
    if (this.type === types.star) {
      var node$1 = this.startNode();
      this.next();
      this.expectContextual("as");
      node$1.local = this.parseIdent();
      this.checkLVal(node$1.local, "let");
      nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
      return nodes
    }
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var node$2 = this$1.startNode();
      node$2.imported = this$1.parseIdent(true);
      if (this$1.eatContextual("as")) {
        node$2.local = this$1.parseIdent();
      } else {
        this$1.checkUnreserved(node$2.imported);
        node$2.local = node$2.imported;
      }
      this$1.checkLVal(node$2.local, "let");
      nodes.push(this$1.finishNode(node$2, "ImportSpecifier"));
    }
    return nodes
  };
  
  pp$1.adaptDirectivePrologue = function(statements) {
    for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
      statements[i].directive = statements[i].expression.raw.slice(1, -1);
    }
  };
  pp$1.isDirectiveCandidate = function(statement) {
    return (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "Literal" &&
      typeof statement.expression.value === "string" &&
      (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
    )
  };
  
  var pp$2 = Parser.prototype;
  
  
  pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
    var this$1 = this;
  
    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await")
          { this.raise(node.start, "Can not use 'await' as identifier inside an async function"); }
        break
  
      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break
  
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];
  
        this$1.toAssignable(prop, isBinding);
          if (
            prop.type === "RestElement" &&
            (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
          ) {
            this$1.raise(prop.argument.start, "Unexpected token");
          }
        }
        break
  
      case "Property":
        if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
        this.toAssignable(node.value, isBinding);
        break
  
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        this.toAssignableList(node.elements, isBinding);
        break
  
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern")
          { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
        break
  
      case "AssignmentExpression":
        if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
  
      case "AssignmentPattern":
        break
  
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding);
        break
  
      case "MemberExpression":
        if (!isBinding) { break }
  
      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
    return node
  };
  
  
  pp$2.toAssignableList = function(exprList, isBinding) {
    var this$1 = this;
  
    var end = exprList.length;
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) { this$1.toAssignable(elt, isBinding); }
    }
    if (end) {
      var last = exprList[end - 1];
      if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        { this.unexpected(last.argument.start); }
    }
    return exprList
  };
  
  
  pp$2.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };
  
  pp$2.parseRestBinding = function() {
    var node = this.startNode();
    this.next();
  
    if (this.options.ecmaVersion === 6 && this.type !== types.name)
      { this.unexpected(); }
  
    node.argument = this.parseBindingAtom();
  
    return this.finishNode(node, "RestElement")
  };
  
  
  pp$2.parseBindingAtom = function() {
    if (this.options.ecmaVersion >= 6) {
      switch (this.type) {
      case types.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern")
  
      case types.braceL:
        return this.parseObj(true)
      }
    }
    return this.parseIdent()
  };
  
  pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
    var this$1 = this;
  
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) { first = false; }
      else { this$1.expect(types.comma); }
      if (allowEmpty && this$1.type === types.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this$1.afterTrailingComma(close)) {
        break
      } else if (this$1.type === types.ellipsis) {
        var rest = this$1.parseRestBinding();
        this$1.parseBindingListItem(rest);
        elts.push(rest);
        if (this$1.type === types.comma) { this$1.raise(this$1.start, "Comma is not permitted after the rest element"); }
        this$1.expect(close);
        break
      } else {
        var elem = this$1.parseMaybeDefault(this$1.start, this$1.startLoc);
        this$1.parseBindingListItem(elem);
        elts.push(elem);
      }
    }
    return elts
  };
  
  pp$2.parseBindingListItem = function(param) {
    return param
  };
  
  
  pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) { return left }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };
  
  
  pp$2.checkLVal = function(expr, bindingType, checkClashes) {
    var this$1 = this;
  
    switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        { this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
      if (checkClashes) {
        if (has(checkClashes, expr.name))
          { this.raiseRecoverable(expr.start, "Argument name clash"); }
        checkClashes[expr.name] = true;
      }
      if (bindingType && bindingType !== "none") {
        if (
          bindingType === "var" && !this.canDeclareVarName(expr.name) ||
          bindingType !== "var" && !this.canDeclareLexicalName(expr.name)
        ) {
          this.raiseRecoverable(expr.start, ("Identifier '" + (expr.name) + "' has already been declared"));
        }
        if (bindingType === "var") {
          this.declareVarName(expr.name);
        } else {
          this.declareLexicalName(expr.name);
        }
      }
      break
  
    case "MemberExpression":
      if (bindingType) { this.raiseRecoverable(expr.start, "Binding member expression"); }
      break
  
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1)
        {
      var prop = list[i];
  
      this$1.checkLVal(prop, bindingType, checkClashes);
    }
      break
  
    case "Property":
      this.checkLVal(expr.value, bindingType, checkClashes);
      break
  
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
  
      if (elem) { this$1.checkLVal(elem, bindingType, checkClashes); }
      }
      break
  
    case "AssignmentPattern":
      this.checkLVal(expr.left, bindingType, checkClashes);
      break
  
    case "RestElement":
      this.checkLVal(expr.argument, bindingType, checkClashes);
      break
  
    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, bindingType, checkClashes);
      break
  
    default:
      this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
    }
  };
  
  
  var pp$3 = Parser.prototype;
  
  
  pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
      { return }
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      { return }
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) {
          if (refDestructuringErrors && refDestructuringErrors.doubleProto < 0) { refDestructuringErrors.doubleProto = key.start; }
          else { this.raiseRecoverable(key.start, "Redefinition of __proto__ property"); }
        }
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var redefinition;
      if (kind === "init") {
        redefinition = this.strict && other.init || other.get || other.set;
      } else {
        redefinition = other.init || other[kind];
      }
      if (redefinition)
        { this.raiseRecoverable(key.start, "Redefinition of property"); }
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };
  
  
  
  
  pp$3.parseExpression = function(noIn, refDestructuringErrors) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
    if (this.type === types.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(types.comma)) { node.expressions.push(this$1.parseMaybeAssign(noIn, refDestructuringErrors)); }
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };
  
  
  pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
    if (this.inGenerator && this.isContextual("yield")) { return this.parseYield() }
  
    var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
    if (refDestructuringErrors) {
      oldParenAssign = refDestructuringErrors.parenthesizedAssign;
      oldTrailingComma = refDestructuringErrors.trailingComma;
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
    } else {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }
  
    var startPos = this.start, startLoc = this.startLoc;
    if (this.type === types.parenL || this.type === types.name)
      { this.potentialArrowAt = this.start; }
    var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
    if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
    if (this.type.isAssign) {
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      node.left = this.type === types.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
      if (!ownDestructuringErrors) { DestructuringErrors.call(refDestructuringErrors); }
      refDestructuringErrors.shorthandAssign = -1; 
      this.checkLVal(left);
      this.next();
      node.right = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
    }
    if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
    if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
    return left
  };
  
  
  pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(noIn, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    if (this.eat(types.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(types.colon);
      node.alternate = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };
  
  
  pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn)
  };
  
  
  pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
    var prec = this.type.binop;
    if (prec != null && (!noIn || this.type !== types._in)) {
      if (prec > minPrec) {
        var logical = this.type === types.logicalOR || this.type === types.logicalAND;
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn)
      }
    }
    return left
  };
  
  pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };
  
  
  pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.isContextual("await") && (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction))) {
      expr = this.parseAwait();
      sawUnary = true;
    } else if (this.type.prefix) {
      var node = this.startNode(), update = this.type === types.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) { this.checkLVal(node.argument); }
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
      else { sawUnary = true; }
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.operator = this$1.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this$1.checkLVal(expr);
        this$1.next();
        expr = this$1.finishNode(node$1, "UpdateExpression");
      }
    }
  
    if (!sawUnary && this.eat(types.starstar))
      { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false) }
    else
      { return expr }
  };
  
  
  pp$3.parseExprSubscripts = function(refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors);
    var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
    if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) { return expr }
    var result = this.parseSubscripts(expr, startPos, startLoc);
    if (refDestructuringErrors && result.type === "MemberExpression") {
      if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
      if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
    }
    return result
  };
  
  pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
    var this$1 = this;
  
    var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
        this.lastTokEnd === base.end && !this.canInsertSemicolon() && this.input.slice(base.start, base.end) === "async";
    for (var computed = (void 0);;) {
      if ((computed = this$1.eat(types.bracketL)) || this$1.eat(types.dot)) {
        var node = this$1.startNodeAt(startPos, startLoc);
        node.object = base;
        node.property = computed ? this$1.parseExpression() : this$1.parseIdent(true);
        node.computed = !!computed;
        if (computed) { this$1.expect(types.bracketR); }
        base = this$1.finishNode(node, "MemberExpression");
      } else if (!noCalls && this$1.eat(types.parenL)) {
        var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this$1.yieldPos, oldAwaitPos = this$1.awaitPos;
        this$1.yieldPos = 0;
        this$1.awaitPos = 0;
        var exprList = this$1.parseExprList(types.parenR, this$1.options.ecmaVersion >= 8, false, refDestructuringErrors);
        if (maybeAsyncArrow && !this$1.canInsertSemicolon() && this$1.eat(types.arrow)) {
          this$1.checkPatternErrors(refDestructuringErrors, false);
          this$1.checkYieldAwaitInDefaultParams();
          this$1.yieldPos = oldYieldPos;
          this$1.awaitPos = oldAwaitPos;
          return this$1.parseArrowExpression(this$1.startNodeAt(startPos, startLoc), exprList, true)
        }
        this$1.checkExpressionErrors(refDestructuringErrors, true);
        this$1.yieldPos = oldYieldPos || this$1.yieldPos;
        this$1.awaitPos = oldAwaitPos || this$1.awaitPos;
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.callee = base;
        node$1.arguments = exprList;
        base = this$1.finishNode(node$1, "CallExpression");
      } else if (this$1.type === types.backQuote) {
        var node$2 = this$1.startNodeAt(startPos, startLoc);
        node$2.tag = base;
        node$2.quasi = this$1.parseTemplate({isTagged: true});
        base = this$1.finishNode(node$2, "TaggedTemplateExpression");
      } else {
        return base
      }
    }
  };
  
  
  pp$3.parseExprAtom = function(refDestructuringErrors) {
    var node, canBeArrow = this.potentialArrowAt === this.start;
    switch (this.type) {
    case types._super:
      if (!this.inFunction)
        { this.raise(this.start, "'super' outside of function or class"); }
      node = this.startNode();
      this.next();
      if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL)
        { this.unexpected(); }
      return this.finishNode(node, "Super")
  
    case types._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression")
  
    case types.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(this.type !== types.name);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function))
        { return this.parseFunction(this.startNodeAt(startPos, startLoc), false, false, true) }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types.arrow))
          { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false) }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc) {
          id = this.parseIdent();
          if (this.canInsertSemicolon() || !this.eat(types.arrow))
            { this.unexpected(); }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true)
        }
      }
      return id
  
    case types.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node
  
    case types.num: case types.string:
      return this.parseLiteral(this.value)
  
    case types._null: case types._true: case types._false:
      node = this.startNode();
      node.value = this.type === types._null ? null : this.type === types._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")
  
    case types.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
          { refDestructuringErrors.parenthesizedAssign = start; }
        if (refDestructuringErrors.parenthesizedBind < 0)
          { refDestructuringErrors.parenthesizedBind = start; }
      }
      return expr
  
    case types.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")
  
    case types.braceL:
      return this.parseObj(false, refDestructuringErrors)
  
    case types._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, false)
  
    case types._class:
      return this.parseClass(this.startNode(), false)
  
    case types._new:
      return this.parseNew()
  
    case types.backQuote:
      return this.parseTemplate()
  
    default:
      this.unexpected();
    }
  };
  
  pp$3.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    this.next();
    return this.finishNode(node, "Literal")
  };
  
  pp$3.parseParenExpression = function() {
    this.expect(types.parenL);
    var val = this.parseExpression();
    this.expect(types.parenR);
    return val
  };
  
  pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
    if (this.options.ecmaVersion >= 6) {
      this.next();
  
      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true, lastIsComma = false;
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
      this.yieldPos = 0;
      this.awaitPos = 0;
      while (this.type !== types.parenR) {
        first ? first = false : this$1.expect(types.comma);
        if (allowTrailingComma && this$1.afterTrailingComma(types.parenR, true)) {
          lastIsComma = true;
          break
        } else if (this$1.type === types.ellipsis) {
          spreadStart = this$1.start;
          exprList.push(this$1.parseParenItem(this$1.parseRestBinding()));
          if (this$1.type === types.comma) { this$1.raise(this$1.start, "Comma is not permitted after the rest element"); }
          break
        } else {
          exprList.push(this$1.parseMaybeAssign(false, refDestructuringErrors, this$1.parseParenItem));
        }
      }
      var innerEndPos = this.start, innerEndLoc = this.startLoc;
      this.expect(types.parenR);
  
      if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        return this.parseParenArrowList(startPos, startLoc, exprList)
      }
  
      if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
      if (spreadStart) { this.unexpected(spreadStart); }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;
  
      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }
  
    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };
  
  pp$3.parseParenItem = function(item) {
    return item
  };
  
  pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList)
  };
  
  
  var empty$1 = [];
  
  pp$3.parseNew = function() {
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
      node.meta = meta;
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target" || containsEsc)
        { this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target"); }
      if (!this.inFunction)
        { this.raiseRecoverable(node.start, "new.target can only be used in functions"); }
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc;
    node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
    if (this.eat(types.parenL)) { node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false); }
    else { node.arguments = empty$1; }
    return this.finishNode(node, "NewExpression")
  };
  
  
  pp$3.parseTemplateElement = function(ref) {
    var isTagged = ref.isTagged;
  
    var elem = this.startNode();
    if (this.type === types.invalidTemplate) {
      if (!isTagged) {
        this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
      }
      elem.value = {
        raw: this.value,
        cooked: null
      };
    } else {
      elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
        cooked: this.value
      };
    }
    this.next();
    elem.tail = this.type === types.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };
  
  pp$3.parseTemplate = function(ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;
  
    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement({isTagged: isTagged});
    node.quasis = [curElt];
    while (!curElt.tail) {
      if (this$1.type === types.eof) { this$1.raise(this$1.pos, "Unterminated template literal"); }
      this$1.expect(types.dollarBraceL);
      node.expressions.push(this$1.parseExpression());
      this$1.expect(types.braceR);
      node.quasis.push(curElt = this$1.parseTemplateElement({isTagged: isTagged}));
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };
  
  pp$3.isAsyncProp = function(prop) {
    return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
      (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types.star)) &&
      !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };
  
  
  pp$3.parseObj = function(isPattern, refDestructuringErrors) {
    var this$1 = this;
  
    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var prop = this$1.parseProperty(isPattern, refDestructuringErrors);
      if (!isPattern) { this$1.checkPropClash(prop, propHash, refDestructuringErrors); }
      node.properties.push(prop);
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };
  
  pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
    var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
    if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
      if (isPattern) {
        prop.argument = this.parseIdent(false);
        if (this.type === types.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        return this.finishNode(prop, "RestElement")
      }
      if (this.type === types.parenL && refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0) {
          refDestructuringErrors.parenthesizedAssign = this.start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = this.start;
        }
      }
      prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
      return this.finishNode(prop, "SpreadElement")
    }
    if (this.options.ecmaVersion >= 6) {
      prop.method = false;
      prop.shorthand = false;
      if (isPattern || refDestructuringErrors) {
        startPos = this.start;
        startLoc = this.startLoc;
      }
      if (!isPattern)
        { isGenerator = this.eat(types.star); }
    }
    var containsEsc = this.containsEsc;
    this.parsePropertyName(prop);
    if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      this.parsePropertyName(prop, refDestructuringErrors);
    } else {
      isAsync = false;
    }
    this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
    return this.finishNode(prop, "Property")
  };
  
  pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
    if ((isGenerator || isAsync) && this.type === types.colon)
      { this.unexpected(); }
  
    if (this.eat(types.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
      if (isPattern) { this.unexpected(); }
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator, isAsync);
    } else if (!isPattern && !containsEsc &&
               this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type !== types.comma && this.type !== types.braceR)) {
      if (isGenerator || isAsync) { this.unexpected(); }
      prop.kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get")
          { this.raiseRecoverable(start, "getter should have no params"); }
        else
          { this.raiseRecoverable(start, "setter should have exactly one param"); }
      } else {
        if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
          { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
      }
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      this.checkUnreserved(prop.key);
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else if (this.type === types.eq && refDestructuringErrors) {
        if (refDestructuringErrors.shorthandAssign < 0)
          { refDestructuringErrors.shorthandAssign = this.start; }
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else {
        prop.value = prop.key;
      }
      prop.shorthand = true;
    } else { this.unexpected(); }
  };
  
  pp$3.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(types.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(types.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(true)
  };
  
  
  pp$3.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) {
      node.generator = false;
      node.expression = false;
    }
    if (this.options.ecmaVersion >= 8)
      { node.async = false; }
  };
  
  
  pp$3.parseMethod = function(isGenerator, isAsync) {
    var node = this.startNode(), oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
  
    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      { node.generator = isGenerator; }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    this.inGenerator = node.generator;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
    this.enterFunctionScope();
  
    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
    this.parseFunctionBody(node, false);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, "FunctionExpression")
  };
  
  
  pp$3.parseArrowExpression = function(node, params, isAsync) {
    var oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
  
    this.enterFunctionScope();
    this.initFunction(node);
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    this.inGenerator = false;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
  
    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, "ArrowFunctionExpression")
  };
  
  
  pp$3.parseFunctionBody = function(node, isArrowFunction) {
    var isExpression = isArrowFunction && this.type !== types.braceL;
    var oldStrict = this.strict, useStrict = false;
  
    if (isExpression) {
      node.body = this.parseMaybeAssign();
      node.expression = true;
      this.checkParams(node, false);
    } else {
      var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
      if (!oldStrict || nonSimple) {
        useStrict = this.strictDirective(this.end);
        if (useStrict && nonSimple)
          { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
      }
      var oldLabels = this.labels;
      this.labels = [];
      if (useStrict) { this.strict = true; }
  
      this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && this.isSimpleParamList(node.params));
      node.body = this.parseBlock(false);
      node.expression = false;
      this.adaptDirectivePrologue(node.body.body);
      this.labels = oldLabels;
    }
    this.exitFunctionScope();
  
    if (this.strict && node.id) {
      this.checkLVal(node.id, "none");
    }
    this.strict = oldStrict;
  };
  
  pp$3.isSimpleParamList = function(params) {
    for (var i = 0, list = params; i < list.length; i += 1)
      {
      var param = list[i];
  
      if (param.type !== "Identifier") { return false
    } }
    return true
  };
  
  
  pp$3.checkParams = function(node, allowDuplicates) {
    var this$1 = this;
  
    var nameHash = {};
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];
  
      this$1.checkLVal(param, "var", allowDuplicates ? null : nameHash);
    }
  };
  
  
  pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var this$1 = this;
  
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this$1.expect(types.comma);
        if (allowTrailingComma && this$1.afterTrailingComma(close)) { break }
      } else { first = false; }
  
      var elt = (void 0);
      if (allowEmpty && this$1.type === types.comma)
        { elt = null; }
      else if (this$1.type === types.ellipsis) {
        elt = this$1.parseSpread(refDestructuringErrors);
        if (refDestructuringErrors && this$1.type === types.comma && refDestructuringErrors.trailingComma < 0)
          { refDestructuringErrors.trailingComma = this$1.start; }
      } else {
        elt = this$1.parseMaybeAssign(false, refDestructuringErrors);
      }
      elts.push(elt);
    }
    return elts
  };
  
  pp$3.checkUnreserved = function(ref) {
    var start = ref.start;
    var end = ref.end;
    var name = ref.name;
  
    if (this.inGenerator && name === "yield")
      { this.raiseRecoverable(start, "Can not use 'yield' as identifier inside a generator"); }
    if (this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Can not use 'await' as identifier inside an async function"); }
    if (this.isKeyword(name))
      { this.raise(start, ("Unexpected keyword '" + name + "'")); }
    if (this.options.ecmaVersion < 6 &&
      this.input.slice(start, end).indexOf("\\") !== -1) { return }
    var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
    if (re.test(name)) {
      if (!this.inAsync && name === "await")
        { this.raiseRecoverable(start, "Can not use keyword 'await' outside an async function"); }
      this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
    }
  };
  
  
  pp$3.parseIdent = function(liberal, isBinding) {
    var node = this.startNode();
    if (liberal && this.options.allowReserved === "never") { liberal = false; }
    if (this.type === types.name) {
      node.name = this.value;
    } else if (this.type.keyword) {
      node.name = this.type.keyword;
  
      if ((node.name === "class" || node.name === "function") &&
          (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
        this.context.pop();
      }
    } else {
      this.unexpected();
    }
    this.next();
    this.finishNode(node, "Identifier");
    if (!liberal) { this.checkUnreserved(node); }
    return node
  };
  
  
  pp$3.parseYield = function() {
    if (!this.yieldPos) { this.yieldPos = this.start; }
  
    var node = this.startNode();
    this.next();
    if (this.type === types.semi || this.canInsertSemicolon() || (this.type !== types.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(types.star);
      node.argument = this.parseMaybeAssign();
    }
    return this.finishNode(node, "YieldExpression")
  };
  
  pp$3.parseAwait = function() {
    if (!this.awaitPos) { this.awaitPos = this.start; }
  
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeUnary(null, true);
    return this.finishNode(node, "AwaitExpression")
  };
  
  var pp$4 = Parser.prototype;
  
  
  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };
  
  pp$4.raiseRecoverable = pp$4.raise;
  
  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };
  
  var pp$5 = Parser.prototype;
  
  var assign = Object.assign || function(target) {
    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];
  
    for (var i = 0, list = sources; i < list.length; i += 1) {
      var source = list[i];
  
      for (var key in source) {
        if (has(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target
  };
  
  
  pp$5.enterFunctionScope = function() {
    this.scopeStack.push({var: {}, lexical: {}, childVar: {}, parentLexical: {}});
  };
  
  pp$5.exitFunctionScope = function() {
    this.scopeStack.pop();
  };
  
  pp$5.enterLexicalScope = function() {
    var parentScope = this.scopeStack[this.scopeStack.length - 1];
    var childScope = {var: {}, lexical: {}, childVar: {}, parentLexical: {}};
  
    this.scopeStack.push(childScope);
    assign(childScope.parentLexical, parentScope.lexical, parentScope.parentLexical);
  };
  
  pp$5.exitLexicalScope = function() {
    var childScope = this.scopeStack.pop();
    var parentScope = this.scopeStack[this.scopeStack.length - 1];
  
    assign(parentScope.childVar, childScope.var, childScope.childVar);
  };
  
  pp$5.canDeclareVarName = function(name) {
    var currentScope = this.scopeStack[this.scopeStack.length - 1];
  
    return !has(currentScope.lexical, name) && !has(currentScope.parentLexical, name)
  };
  
  pp$5.canDeclareLexicalName = function(name) {
    var currentScope = this.scopeStack[this.scopeStack.length - 1];
  
    return !has(currentScope.lexical, name) && !has(currentScope.var, name) && !has(currentScope.childVar, name)
  };
  
  pp$5.declareVarName = function(name) {
    this.scopeStack[this.scopeStack.length - 1].var[name] = true;
  };
  
  pp$5.declareLexicalName = function(name) {
    this.scopeStack[this.scopeStack.length - 1].lexical[name] = true;
  };
  
  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      { this.loc = new SourceLocation(parser, loc); }
    if (parser.options.directSourceFile)
      { this.sourceFile = parser.options.directSourceFile; }
    if (parser.options.ranges)
      { this.range = [pos, 0]; }
  };
  
  
  var pp$6 = Parser.prototype;
  
  pp$6.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };
  
  pp$6.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };
  
  
  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      { node.loc.end = loc; }
    if (this.options.ranges)
      { node.range[1] = pos; }
    return node
  }
  
  pp$6.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };
  
  
  pp$6.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };
  
  
  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
    this.generator = !!generator;
  };
  
  var types$1 = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", false),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
    f_stat: new TokContext("function", false),
    f_expr: new TokContext("function", true),
    f_expr_gen: new TokContext("function", true, false, null, true),
    f_gen: new TokContext("function", false, false, null, true)
  };
  
  var pp$7 = Parser.prototype;
  
  pp$7.initialContext = function() {
    return [types$1.b_stat]
  };
  
  pp$7.braceIsBlock = function(prevType) {
    var parent = this.curContext();
    if (parent === types$1.f_expr || parent === types$1.f_stat)
      { return true }
    if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr))
      { return !parent.isExpr }
  
    if (prevType === types._return || prevType === types.name && this.exprAllowed)
      { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
    if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType === types.arrow)
      { return true }
    if (prevType === types.braceL)
      { return parent === types$1.b_stat }
    if (prevType === types._var || prevType === types.name)
      { return false }
    return !this.exprAllowed
  };
  
  pp$7.inGeneratorContext = function() {
    var this$1 = this;
  
    for (var i = this.context.length - 1; i >= 1; i--) {
      var context = this$1.context[i];
      if (context.token === "function")
        { return context.generator }
    }
    return false
  };
  
  pp$7.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType === types.dot)
      { this.exprAllowed = false; }
    else if (update = type.updateContext)
      { update.call(this, prevType); }
    else
      { this.exprAllowed = type.beforeExpr; }
  };
  
  
  types.parenR.updateContext = types.braceR.updateContext = function() {
    if (this.context.length === 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types$1.b_stat && this.curContext().token === "function") {
      out = this.context.pop();
    }
    this.exprAllowed = !out.isExpr;
  };
  
  types.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
    this.exprAllowed = true;
  };
  
  types.dollarBraceL.updateContext = function() {
    this.context.push(types$1.b_tmpl);
    this.exprAllowed = true;
  };
  
  types.parenL.updateContext = function(prevType) {
    var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
    this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
    this.exprAllowed = true;
  };
  
  types.incDec.updateContext = function() {
  };
  
  types._function.updateContext = types._class.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== types.semi && prevType !== types._else &&
        !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat))
      { this.context.push(types$1.f_expr); }
    else
      { this.context.push(types$1.f_stat); }
    this.exprAllowed = false;
  };
  
  types.backQuote.updateContext = function() {
    if (this.curContext() === types$1.q_tmpl)
      { this.context.pop(); }
    else
      { this.context.push(types$1.q_tmpl); }
    this.exprAllowed = false;
  };
  
  types.star.updateContext = function(prevType) {
    if (prevType === types._function) {
      var index = this.context.length - 1;
      if (this.context[index] === types$1.f_expr)
        { this.context[index] = types$1.f_expr_gen; }
      else
        { this.context[index] = types$1.f_gen; }
    }
    this.exprAllowed = true;
  };
  
  types.name.updateContext = function(prevType) {
    var allowed = false;
    if (this.options.ecmaVersion >= 6 && prevType !== types.dot) {
      if (this.value === "of" && !this.exprAllowed ||
          this.value === "yield" && this.inGeneratorContext())
        { allowed = true; }
    }
    this.exprAllowed = allowed;
  };
  
  var data = {
    "$LONE": [
      "ASCII",
      "ASCII_Hex_Digit",
      "AHex",
      "Alphabetic",
      "Alpha",
      "Any",
      "Assigned",
      "Bidi_Control",
      "Bidi_C",
      "Bidi_Mirrored",
      "Bidi_M",
      "Case_Ignorable",
      "CI",
      "Cased",
      "Changes_When_Casefolded",
      "CWCF",
      "Changes_When_Casemapped",
      "CWCM",
      "Changes_When_Lowercased",
      "CWL",
      "Changes_When_NFKC_Casefolded",
      "CWKCF",
      "Changes_When_Titlecased",
      "CWT",
      "Changes_When_Uppercased",
      "CWU",
      "Dash",
      "Default_Ignorable_Code_Point",
      "DI",
      "Deprecated",
      "Dep",
      "Diacritic",
      "Dia",
      "Emoji",
      "Emoji_Component",
      "Emoji_Modifier",
      "Emoji_Modifier_Base",
      "Emoji_Presentation",
      "Extender",
      "Ext",
      "Grapheme_Base",
      "Gr_Base",
      "Grapheme_Extend",
      "Gr_Ext",
      "Hex_Digit",
      "Hex",
      "IDS_Binary_Operator",
      "IDSB",
      "IDS_Trinary_Operator",
      "IDST",
      "ID_Continue",
      "IDC",
      "ID_Start",
      "IDS",
      "Ideographic",
      "Ideo",
      "Join_Control",
      "Join_C",
      "Logical_Order_Exception",
      "LOE",
      "Lowercase",
      "Lower",
      "Math",
      "Noncharacter_Code_Point",
      "NChar",
      "Pattern_Syntax",
      "Pat_Syn",
      "Pattern_White_Space",
      "Pat_WS",
      "Quotation_Mark",
      "QMark",
      "Radical",
      "Regional_Indicator",
      "RI",
      "Sentence_Terminal",
      "STerm",
      "Soft_Dotted",
      "SD",
      "Terminal_Punctuation",
      "Term",
      "Unified_Ideograph",
      "UIdeo",
      "Uppercase",
      "Upper",
      "Variation_Selector",
      "VS",
      "White_Space",
      "space",
      "XID_Continue",
      "XIDC",
      "XID_Start",
      "XIDS"
    ],
    "General_Category": [
      "Cased_Letter",
      "LC",
      "Close_Punctuation",
      "Pe",
      "Connector_Punctuation",
      "Pc",
      "Control",
      "Cc",
      "cntrl",
      "Currency_Symbol",
      "Sc",
      "Dash_Punctuation",
      "Pd",
      "Decimal_Number",
      "Nd",
      "digit",
      "Enclosing_Mark",
      "Me",
      "Final_Punctuation",
      "Pf",
      "Format",
      "Cf",
      "Initial_Punctuation",
      "Pi",
      "Letter",
      "L",
      "Letter_Number",
      "Nl",
      "Line_Separator",
      "Zl",
      "Lowercase_Letter",
      "Ll",
      "Mark",
      "M",
      "Combining_Mark",
      "Math_Symbol",
      "Sm",
      "Modifier_Letter",
      "Lm",
      "Modifier_Symbol",
      "Sk",
      "Nonspacing_Mark",
      "Mn",
      "Number",
      "N",
      "Open_Punctuation",
      "Ps",
      "Other",
      "C",
      "Other_Letter",
      "Lo",
      "Other_Number",
      "No",
      "Other_Punctuation",
      "Po",
      "Other_Symbol",
      "So",
      "Paragraph_Separator",
      "Zp",
      "Private_Use",
      "Co",
      "Punctuation",
      "P",
      "punct",
      "Separator",
      "Z",
      "Space_Separator",
      "Zs",
      "Spacing_Mark",
      "Mc",
      "Surrogate",
      "Cs",
      "Symbol",
      "S",
      "Titlecase_Letter",
      "Lt",
      "Unassigned",
      "Cn",
      "Uppercase_Letter",
      "Lu"
    ],
    "Script": [
      "Adlam",
      "Adlm",
      "Ahom",
      "Anatolian_Hieroglyphs",
      "Hluw",
      "Arabic",
      "Arab",
      "Armenian",
      "Armn",
      "Avestan",
      "Avst",
      "Balinese",
      "Bali",
      "Bamum",
      "Bamu",
      "Bassa_Vah",
      "Bass",
      "Batak",
      "Batk",
      "Bengali",
      "Beng",
      "Bhaiksuki",
      "Bhks",
      "Bopomofo",
      "Bopo",
      "Brahmi",
      "Brah",
      "Braille",
      "Brai",
      "Buginese",
      "Bugi",
      "Buhid",
      "Buhd",
      "Canadian_Aboriginal",
      "Cans",
      "Carian",
      "Cari",
      "Caucasian_Albanian",
      "Aghb",
      "Chakma",
      "Cakm",
      "Cham",
      "Cherokee",
      "Cher",
      "Common",
      "Zyyy",
      "Coptic",
      "Copt",
      "Qaac",
      "Cuneiform",
      "Xsux",
      "Cypriot",
      "Cprt",
      "Cyrillic",
      "Cyrl",
      "Deseret",
      "Dsrt",
      "Devanagari",
      "Deva",
      "Duployan",
      "Dupl",
      "Egyptian_Hieroglyphs",
      "Egyp",
      "Elbasan",
      "Elba",
      "Ethiopic",
      "Ethi",
      "Georgian",
      "Geor",
      "Glagolitic",
      "Glag",
      "Gothic",
      "Goth",
      "Grantha",
      "Gran",
      "Greek",
      "Grek",
      "Gujarati",
      "Gujr",
      "Gurmukhi",
      "Guru",
      "Han",
      "Hani",
      "Hangul",
      "Hang",
      "Hanunoo",
      "Hano",
      "Hatran",
      "Hatr",
      "Hebrew",
      "Hebr",
      "Hiragana",
      "Hira",
      "Imperial_Aramaic",
      "Armi",
      "Inherited",
      "Zinh",
      "Qaai",
      "Inscriptional_Pahlavi",
      "Phli",
      "Inscriptional_Parthian",
      "Prti",
      "Javanese",
      "Java",
      "Kaithi",
      "Kthi",
      "Kannada",
      "Knda",
      "Katakana",
      "Kana",
      "Kayah_Li",
      "Kali",
      "Kharoshthi",
      "Khar",
      "Khmer",
      "Khmr",
      "Khojki",
      "Khoj",
      "Khudawadi",
      "Sind",
      "Lao",
      "Laoo",
      "Latin",
      "Latn",
      "Lepcha",
      "Lepc",
      "Limbu",
      "Limb",
      "Linear_A",
      "Lina",
      "Linear_B",
      "Linb",
      "Lisu",
      "Lycian",
      "Lyci",
      "Lydian",
      "Lydi",
      "Mahajani",
      "Mahj",
      "Malayalam",
      "Mlym",
      "Mandaic",
      "Mand",
      "Manichaean",
      "Mani",
      "Marchen",
      "Marc",
      "Masaram_Gondi",
      "Gonm",
      "Meetei_Mayek",
      "Mtei",
      "Mende_Kikakui",
      "Mend",
      "Meroitic_Cursive",
      "Merc",
      "Meroitic_Hieroglyphs",
      "Mero",
      "Miao",
      "Plrd",
      "Modi",
      "Mongolian",
      "Mong",
      "Mro",
      "Mroo",
      "Multani",
      "Mult",
      "Myanmar",
      "Mymr",
      "Nabataean",
      "Nbat",
      "New_Tai_Lue",
      "Talu",
      "Newa",
      "Nko",
      "Nkoo",
      "Nushu",
      "Nshu",
      "Ogham",
      "Ogam",
      "Ol_Chiki",
      "Olck",
      "Old_Hungarian",
      "Hung",
      "Old_Italic",
      "Ital",
      "Old_North_Arabian",
      "Narb",
      "Old_Permic",
      "Perm",
      "Old_Persian",
      "Xpeo",
      "Old_South_Arabian",
      "Sarb",
      "Old_Turkic",
      "Orkh",
      "Oriya",
      "Orya",
      "Osage",
      "Osge",
      "Osmanya",
      "Osma",
      "Pahawh_Hmong",
      "Hmng",
      "Palmyrene",
      "Palm",
      "Pau_Cin_Hau",
      "Pauc",
      "Phags_Pa",
      "Phag",
      "Phoenician",
      "Phnx",
      "Psalter_Pahlavi",
      "Phlp",
      "Rejang",
      "Rjng",
      "Runic",
      "Runr",
      "Samaritan",
      "Samr",
      "Saurashtra",
      "Saur",
      "Sharada",
      "Shrd",
      "Shavian",
      "Shaw",
      "Siddham",
      "Sidd",
      "SignWriting",
      "Sgnw",
      "Sinhala",
      "Sinh",
      "Sora_Sompeng",
      "Sora",
      "Soyombo",
      "Soyo",
      "Sundanese",
      "Sund",
      "Syloti_Nagri",
      "Sylo",
      "Syriac",
      "Syrc",
      "Tagalog",
      "Tglg",
      "Tagbanwa",
      "Tagb",
      "Tai_Le",
      "Tale",
      "Tai_Tham",
      "Lana",
      "Tai_Viet",
      "Tavt",
      "Takri",
      "Takr",
      "Tamil",
      "Taml",
      "Tangut",
      "Tang",
      "Telugu",
      "Telu",
      "Thaana",
      "Thaa",
      "Thai",
      "Tibetan",
      "Tibt",
      "Tifinagh",
      "Tfng",
      "Tirhuta",
      "Tirh",
      "Ugaritic",
      "Ugar",
      "Vai",
      "Vaii",
      "Warang_Citi",
      "Wara",
      "Yi",
      "Yiii",
      "Zanabazar_Square",
      "Zanb"
    ]
  };
  Array.prototype.push.apply(data.$LONE, data.General_Category);
  data.gc = data.General_Category;
  data.sc = data.Script_Extensions = data.scx = data.Script;
  
  var pp$9 = Parser.prototype;
  
  var RegExpValidationState = function RegExpValidationState(parser) {
    this.parser = parser;
    this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "");
    this.source = "";
    this.flags = "";
    this.start = 0;
    this.switchU = false;
    this.switchN = false;
    this.pos = 0;
    this.lastIntValue = 0;
    this.lastStringValue = "";
    this.lastAssertionIsQuantifiable = false;
    this.numCapturingParens = 0;
    this.maxBackReference = 0;
    this.groupNames = [];
    this.backReferenceNames = [];
  };
  
  RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
    var unicode = flags.indexOf("u") !== -1;
    this.start = start | 0;
    this.source = pattern + "";
    this.flags = flags;
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  };
  
  RegExpValidationState.prototype.raise = function raise (message) {
    this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
  };
  
  RegExpValidationState.prototype.at = function at (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return -1
    }
    var c = s.charCodeAt(i);
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return c
    }
    return (c << 10) + s.charCodeAt(i + 1) - 0x35FDC00
  };
  
  RegExpValidationState.prototype.nextIndex = function nextIndex (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return l
    }
    var c = s.charCodeAt(i);
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return i + 1
    }
    return i + 2
  };
  
  RegExpValidationState.prototype.current = function current () {
    return this.at(this.pos)
  };
  
  RegExpValidationState.prototype.lookahead = function lookahead () {
    return this.at(this.nextIndex(this.pos))
  };
  
  RegExpValidationState.prototype.advance = function advance () {
    this.pos = this.nextIndex(this.pos);
  };
  
  RegExpValidationState.prototype.eat = function eat (ch) {
    if (this.current() === ch) {
      this.advance();
      return true
    }
    return false
  };
  
  function codePointToString$1(ch) {
    if (ch <= 0xFFFF) { return String.fromCharCode(ch) }
    ch -= 0x10000;
    return String.fromCharCode((ch >> 10) + 0xD800, (ch & 0x03FF) + 0xDC00)
  }
  
  pp$9.validateRegExpFlags = function(state) {
    var this$1 = this;
  
    var validFlags = state.validFlags;
    var flags = state.flags;
  
    for (var i = 0; i < flags.length; i++) {
      var flag = flags.charAt(i);
      if (validFlags.indexOf(flag) === -1) {
        this$1.raise(state.start, "Invalid regular expression flag");
      }
      if (flags.indexOf(flag, i + 1) > -1) {
        this$1.raise(state.start, "Duplicate regular expression flag");
      }
    }
  };
  
  pp$9.validateRegExpPattern = function(state) {
    this.regexp_pattern(state);
  
    if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
      state.switchN = true;
      this.regexp_pattern(state);
    }
  };
  
  pp$9.regexp_pattern = function(state) {
    state.pos = 0;
    state.lastIntValue = 0;
    state.lastStringValue = "";
    state.lastAssertionIsQuantifiable = false;
    state.numCapturingParens = 0;
    state.maxBackReference = 0;
    state.groupNames.length = 0;
    state.backReferenceNames.length = 0;
  
    this.regexp_disjunction(state);
  
    if (state.pos !== state.source.length) {
      if (state.eat(0x29 )) {
        state.raise("Unmatched ')'");
      }
      if (state.eat(0x5D ) || state.eat(0x7D )) {
        state.raise("Lone quantifier brackets");
      }
    }
    if (state.maxBackReference > state.numCapturingParens) {
      state.raise("Invalid escape");
    }
    for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
      var name = list[i];
  
      if (state.groupNames.indexOf(name) === -1) {
        state.raise("Invalid named capture referenced");
      }
    }
  };
  
  pp$9.regexp_disjunction = function(state) {
    var this$1 = this;
  
    this.regexp_alternative(state);
    while (state.eat(0x7C )) {
      this$1.regexp_alternative(state);
    }
  
    if (this.regexp_eatQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    if (state.eat(0x7B )) {
      state.raise("Lone quantifier brackets");
    }
  };
  
  pp$9.regexp_alternative = function(state) {
    while (state.pos < state.source.length && this.regexp_eatTerm(state))
      {  }
  };
  
  pp$9.regexp_eatTerm = function(state) {
    if (this.regexp_eatAssertion(state)) {
      if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
        if (state.switchU) {
          state.raise("Invalid quantifier");
        }
      }
      return true
    }
  
    if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
      this.regexp_eatQuantifier(state);
      return true
    }
  
    return false
  };
  
  pp$9.regexp_eatAssertion = function(state) {
    var start = state.pos;
    state.lastAssertionIsQuantifiable = false;
  
    if (state.eat(0x5E ) || state.eat(0x24 )) {
      return true
    }
  
    if (state.eat(0x5C )) {
      if (state.eat(0x42 ) || state.eat(0x62 )) {
        return true
      }
      state.pos = start;
    }
  
    if (state.eat(0x28 ) && state.eat(0x3F )) {
      var lookbehind = false;
      if (this.options.ecmaVersion >= 9) {
        lookbehind = state.eat(0x3C );
      }
      if (state.eat(0x3D ) || state.eat(0x21 )) {
        this.regexp_disjunction(state);
        if (!state.eat(0x29 )) {
          state.raise("Unterminated group");
        }
        state.lastAssertionIsQuantifiable = !lookbehind;
        return true
      }
    }
  
    state.pos = start;
    return false
  };
  
  pp$9.regexp_eatQuantifier = function(state, noError) {
    if ( noError === void 0 ) noError = false;
  
    if (this.regexp_eatQuantifierPrefix(state, noError)) {
      state.eat(0x3F );
      return true
    }
    return false
  };
  
  pp$9.regexp_eatQuantifierPrefix = function(state, noError) {
    return (
      state.eat(0x2A ) ||
      state.eat(0x2B ) ||
      state.eat(0x3F ) ||
      this.regexp_eatBracedQuantifier(state, noError)
    )
  };
  pp$9.regexp_eatBracedQuantifier = function(state, noError) {
    var start = state.pos;
    if (state.eat(0x7B )) {
      var min = 0, max = -1;
      if (this.regexp_eatDecimalDigits(state)) {
        min = state.lastIntValue;
        if (state.eat(0x2C ) && this.regexp_eatDecimalDigits(state)) {
          max = state.lastIntValue;
        }
        if (state.eat(0x7D )) {
          if (max !== -1 && max < min && !noError) {
            state.raise("numbers out of order in {} quantifier");
          }
          return true
        }
      }
      if (state.switchU && !noError) {
        state.raise("Incomplete quantifier");
      }
      state.pos = start;
    }
    return false
  };
  
  pp$9.regexp_eatAtom = function(state) {
    return (
      this.regexp_eatPatternCharacters(state) ||
      state.eat(0x2E ) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state)
    )
  };
  pp$9.regexp_eatReverseSolidusAtomEscape = function(state) {
    var start = state.pos;
    if (state.eat(0x5C )) {
      if (this.regexp_eatAtomEscape(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatUncapturingGroup = function(state) {
    var start = state.pos;
    if (state.eat(0x28 )) {
      if (state.eat(0x3F ) && state.eat(0x3A )) {
        this.regexp_disjunction(state);
        if (state.eat(0x29 )) {
          return true
        }
        state.raise("Unterminated group");
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatCapturingGroup = function(state) {
    if (state.eat(0x28 )) {
      if (this.options.ecmaVersion >= 9) {
        this.regexp_groupSpecifier(state);
      } else if (state.current() === 0x3F ) {
        state.raise("Invalid group");
      }
      this.regexp_disjunction(state);
      if (state.eat(0x29 )) {
        state.numCapturingParens += 1;
        return true
      }
      state.raise("Unterminated group");
    }
    return false
  };
  
  pp$9.regexp_eatExtendedAtom = function(state) {
    return (
      state.eat(0x2E ) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state) ||
      this.regexp_eatInvalidBracedQuantifier(state) ||
      this.regexp_eatExtendedPatternCharacter(state)
    )
  };
  
  pp$9.regexp_eatInvalidBracedQuantifier = function(state) {
    if (this.regexp_eatBracedQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    return false
  };
  
  pp$9.regexp_eatSyntaxCharacter = function(state) {
    var ch = state.current();
    if (isSyntaxCharacter(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };
  function isSyntaxCharacter(ch) {
    return (
      ch === 0x24  ||
      ch >= 0x28  && ch <= 0x2B  ||
      ch === 0x2E  ||
      ch === 0x3F  ||
      ch >= 0x5B  && ch <= 0x5E  ||
      ch >= 0x7B  && ch <= 0x7D 
    )
  }
  
  pp$9.regexp_eatPatternCharacters = function(state) {
    var start = state.pos;
    var ch = 0;
    while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
      state.advance();
    }
    return state.pos !== start
  };
  
  pp$9.regexp_eatExtendedPatternCharacter = function(state) {
    var ch = state.current();
    if (
      ch !== -1 &&
      ch !== 0x24  &&
      !(ch >= 0x28  && ch <= 0x2B ) &&
      ch !== 0x2E  &&
      ch !== 0x3F  &&
      ch !== 0x5B  &&
      ch !== 0x5E  &&
      ch !== 0x7C 
    ) {
      state.advance();
      return true
    }
    return false
  };
  
  pp$9.regexp_groupSpecifier = function(state) {
    if (state.eat(0x3F )) {
      if (this.regexp_eatGroupName(state)) {
        if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
          state.raise("Duplicate capture group name");
        }
        state.groupNames.push(state.lastStringValue);
        return
      }
      state.raise("Invalid group");
    }
  };
  
  pp$9.regexp_eatGroupName = function(state) {
    state.lastStringValue = "";
    if (state.eat(0x3C )) {
      if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E )) {
        return true
      }
      state.raise("Invalid capture group name");
    }
    return false
  };
  
  pp$9.regexp_eatRegExpIdentifierName = function(state) {
    state.lastStringValue = "";
    if (this.regexp_eatRegExpIdentifierStart(state)) {
      state.lastStringValue += codePointToString$1(state.lastIntValue);
      while (this.regexp_eatRegExpIdentifierPart(state)) {
        state.lastStringValue += codePointToString$1(state.lastIntValue);
      }
      return true
    }
    return false
  };
  
  pp$9.regexp_eatRegExpIdentifierStart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();
  
    if (ch === 0x5C  && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierStart(ch)) {
      state.lastIntValue = ch;
      return true
    }
  
    state.pos = start;
    return false
  };
  function isRegExpIdentifierStart(ch) {
    return isIdentifierStart(ch, true) || ch === 0x24  || ch === 0x5F 
  }
  
  pp$9.regexp_eatRegExpIdentifierPart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();
  
    if (ch === 0x5C  && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierPart(ch)) {
      state.lastIntValue = ch;
      return true
    }
  
    state.pos = start;
    return false
  };
  function isRegExpIdentifierPart(ch) {
    return isIdentifierChar(ch, true) || ch === 0x24  || ch === 0x5F  || ch === 0x200C  || ch === 0x200D 
  }
  
  pp$9.regexp_eatAtomEscape = function(state) {
    if (
      this.regexp_eatBackReference(state) ||
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state) ||
      (state.switchN && this.regexp_eatKGroupName(state))
    ) {
      return true
    }
    if (state.switchU) {
      if (state.current() === 0x63 ) {
        state.raise("Invalid unicode escape");
      }
      state.raise("Invalid escape");
    }
    return false
  };
  pp$9.regexp_eatBackReference = function(state) {
    var start = state.pos;
    if (this.regexp_eatDecimalEscape(state)) {
      var n = state.lastIntValue;
      if (state.switchU) {
        if (n > state.maxBackReference) {
          state.maxBackReference = n;
        }
        return true
      }
      if (n <= state.numCapturingParens) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatKGroupName = function(state) {
    if (state.eat(0x6B )) {
      if (this.regexp_eatGroupName(state)) {
        state.backReferenceNames.push(state.lastStringValue);
        return true
      }
      state.raise("Invalid named reference");
    }
    return false
  };
  
  pp$9.regexp_eatCharacterEscape = function(state) {
    return (
      this.regexp_eatControlEscape(state) ||
      this.regexp_eatCControlLetter(state) ||
      this.regexp_eatZero(state) ||
      this.regexp_eatHexEscapeSequence(state) ||
      this.regexp_eatRegExpUnicodeEscapeSequence(state) ||
      (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
      this.regexp_eatIdentityEscape(state)
    )
  };
  pp$9.regexp_eatCControlLetter = function(state) {
    var start = state.pos;
    if (state.eat(0x63 )) {
      if (this.regexp_eatControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatZero = function(state) {
    if (state.current() === 0x30  && !isDecimalDigit(state.lookahead())) {
      state.lastIntValue = 0;
      state.advance();
      return true
    }
    return false
  };
  
  pp$9.regexp_eatControlEscape = function(state) {
    var ch = state.current();
    if (ch === 0x74 ) {
      state.lastIntValue = 0x09; 
      state.advance();
      return true
    }
    if (ch === 0x6E ) {
      state.lastIntValue = 0x0A; 
      state.advance();
      return true
    }
    if (ch === 0x76 ) {
      state.lastIntValue = 0x0B; 
      state.advance();
      return true
    }
    if (ch === 0x66 ) {
      state.lastIntValue = 0x0C; 
      state.advance();
      return true
    }
    if (ch === 0x72 ) {
      state.lastIntValue = 0x0D; 
      state.advance();
      return true
    }
    return false
  };
  
  pp$9.regexp_eatControlLetter = function(state) {
    var ch = state.current();
    if (isControlLetter(ch)) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  function isControlLetter(ch) {
    return (
      (ch >= 0x41  && ch <= 0x5A ) ||
      (ch >= 0x61  && ch <= 0x7A )
    )
  }
  
  pp$9.regexp_eatRegExpUnicodeEscapeSequence = function(state) {
    var start = state.pos;
  
    if (state.eat(0x75 )) {
      if (this.regexp_eatFixedHexDigits(state, 4)) {
        var lead = state.lastIntValue;
        if (state.switchU && lead >= 0xD800 && lead <= 0xDBFF) {
          var leadSurrogateEnd = state.pos;
          if (state.eat(0x5C ) && state.eat(0x75 ) && this.regexp_eatFixedHexDigits(state, 4)) {
            var trail = state.lastIntValue;
            if (trail >= 0xDC00 && trail <= 0xDFFF) {
              state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
              return true
            }
          }
          state.pos = leadSurrogateEnd;
          state.lastIntValue = lead;
        }
        return true
      }
      if (
        state.switchU &&
        state.eat(0x7B ) &&
        this.regexp_eatHexDigits(state) &&
        state.eat(0x7D ) &&
        isValidUnicode(state.lastIntValue)
      ) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid unicode escape");
      }
      state.pos = start;
    }
  
    return false
  };
  function isValidUnicode(ch) {
    return ch >= 0 && ch <= 0x10FFFF
  }
  
  pp$9.regexp_eatIdentityEscape = function(state) {
    if (state.switchU) {
      if (this.regexp_eatSyntaxCharacter(state)) {
        return true
      }
      if (state.eat(0x2F )) {
        state.lastIntValue = 0x2F; 
        return true
      }
      return false
    }
  
    var ch = state.current();
    if (ch !== 0x63  && (!state.switchN || ch !== 0x6B )) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
  
    return false
  };
  
  pp$9.regexp_eatDecimalEscape = function(state) {
    state.lastIntValue = 0;
    var ch = state.current();
    if (ch >= 0x31  && ch <= 0x39 ) {
      do {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 );
        state.advance();
      } while ((ch = state.current()) >= 0x30  && ch <= 0x39 )
      return true
    }
    return false
  };
  
  pp$9.regexp_eatCharacterClassEscape = function(state) {
    var ch = state.current();
  
    if (isCharacterClassEscape(ch)) {
      state.lastIntValue = -1;
      state.advance();
      return true
    }
  
    if (
      state.switchU &&
      this.options.ecmaVersion >= 9 &&
      (ch === 0x50  || ch === 0x70 )
    ) {
      state.lastIntValue = -1;
      state.advance();
      if (
        state.eat(0x7B ) &&
        this.regexp_eatUnicodePropertyValueExpression(state) &&
        state.eat(0x7D )
      ) {
        return true
      }
      state.raise("Invalid property name");
    }
  
    return false
  };
  function isCharacterClassEscape(ch) {
    return (
      ch === 0x64  ||
      ch === 0x44  ||
      ch === 0x73  ||
      ch === 0x53  ||
      ch === 0x77  ||
      ch === 0x57 
    )
  }
  
  pp$9.regexp_eatUnicodePropertyValueExpression = function(state) {
    var start = state.pos;
  
    if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D )) {
      var name = state.lastStringValue;
      if (this.regexp_eatUnicodePropertyValue(state)) {
        var value = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
        return true
      }
    }
    state.pos = start;
  
    if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
      var nameOrValue = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      return true
    }
    return false
  };
  pp$9.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
    if (!data.hasOwnProperty(name) || data[name].indexOf(value) === -1) {
      state.raise("Invalid property name");
    }
  };
  pp$9.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
    if (data.$LONE.indexOf(nameOrValue) === -1) {
      state.raise("Invalid property name");
    }
  };
  
  pp$9.regexp_eatUnicodePropertyName = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyNameCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString$1(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyNameCharacter(ch) {
    return isControlLetter(ch) || ch === 0x5F 
  }
  
  pp$9.regexp_eatUnicodePropertyValue = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyValueCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString$1(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyValueCharacter(ch) {
    return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
  }
  
  pp$9.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
    return this.regexp_eatUnicodePropertyValue(state)
  };
  
  pp$9.regexp_eatCharacterClass = function(state) {
    if (state.eat(0x5B )) {
      state.eat(0x5E );
      this.regexp_classRanges(state);
      if (state.eat(0x5D )) {
        return true
      }
      state.raise("Unterminated character class");
    }
    return false
  };
  
  pp$9.regexp_classRanges = function(state) {
    var this$1 = this;
  
    while (this.regexp_eatClassAtom(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D ) && this$1.regexp_eatClassAtom(state)) {
        var right = state.lastIntValue;
        if (state.switchU && (left === -1 || right === -1)) {
          state.raise("Invalid character class");
        }
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
      }
    }
  };
  
  pp$9.regexp_eatClassAtom = function(state) {
    var start = state.pos;
  
    if (state.eat(0x5C )) {
      if (this.regexp_eatClassEscape(state)) {
        return true
      }
      if (state.switchU) {
        var ch$1 = state.current();
        if (ch$1 === 0x63  || isOctalDigit(ch$1)) {
          state.raise("Invalid class escape");
        }
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
  
    var ch = state.current();
    if (ch !== 0x5D ) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
  
    return false
  };
  
  pp$9.regexp_eatClassEscape = function(state) {
    var start = state.pos;
  
    if (state.eat(0x62 )) {
      state.lastIntValue = 0x08; 
      return true
    }
  
    if (state.switchU && state.eat(0x2D )) {
      state.lastIntValue = 0x2D; 
      return true
    }
  
    if (!state.switchU && state.eat(0x63 )) {
      if (this.regexp_eatClassControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
  
    return (
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state)
    )
  };
  
  pp$9.regexp_eatClassControlLetter = function(state) {
    var ch = state.current();
    if (isDecimalDigit(ch) || ch === 0x5F ) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  
  pp$9.regexp_eatHexEscapeSequence = function(state) {
    var start = state.pos;
    if (state.eat(0x78 )) {
      if (this.regexp_eatFixedHexDigits(state, 2)) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return false
  };
  
  pp$9.regexp_eatDecimalDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isDecimalDigit(ch = state.current())) {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 );
      state.advance();
    }
    return state.pos !== start
  };
  function isDecimalDigit(ch) {
    return ch >= 0x30  && ch <= 0x39 
  }
  
  pp$9.regexp_eatHexDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isHexDigit(ch = state.current())) {
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return state.pos !== start
  };
  function isHexDigit(ch) {
    return (
      (ch >= 0x30  && ch <= 0x39 ) ||
      (ch >= 0x41  && ch <= 0x46 ) ||
      (ch >= 0x61  && ch <= 0x66 )
    )
  }
  function hexToInt(ch) {
    if (ch >= 0x41  && ch <= 0x46 ) {
      return 10 + (ch - 0x41 )
    }
    if (ch >= 0x61  && ch <= 0x66 ) {
      return 10 + (ch - 0x61 )
    }
    return ch - 0x30 
  }
  
  pp$9.regexp_eatLegacyOctalEscapeSequence = function(state) {
    if (this.regexp_eatOctalDigit(state)) {
      var n1 = state.lastIntValue;
      if (this.regexp_eatOctalDigit(state)) {
        var n2 = state.lastIntValue;
        if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
          state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
        } else {
          state.lastIntValue = n1 * 8 + n2;
        }
      } else {
        state.lastIntValue = n1;
      }
      return true
    }
    return false
  };
  
  pp$9.regexp_eatOctalDigit = function(state) {
    var ch = state.current();
    if (isOctalDigit(ch)) {
      state.lastIntValue = ch - 0x30; 
      state.advance();
      return true
    }
    state.lastIntValue = 0;
    return false
  };
  function isOctalDigit(ch) {
    return ch >= 0x30  && ch <= 0x37 
  }
  
  pp$9.regexp_eatFixedHexDigits = function(state, length) {
    var start = state.pos;
    state.lastIntValue = 0;
    for (var i = 0; i < length; ++i) {
      var ch = state.current();
      if (!isHexDigit(ch)) {
        state.pos = start;
        return false
      }
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return true
  };
  
  
  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
    if (p.options.ranges)
      { this.range = [p.start, p.end]; }
  };
  
  
  var pp$8 = Parser.prototype;
  
  
  pp$8.next = function() {
    if (this.options.onToken)
      { this.options.onToken(new Token(this)); }
  
    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };
  
  pp$8.getToken = function() {
    this.next();
    return new Token(this)
  };
  
  if (typeof Symbol !== "undefined")
    { pp$8[Symbol.iterator] = function() {
      var this$1 = this;
  
      return {
        next: function () {
          var token = this$1.getToken();
          return {
            done: token.type === types.eof,
            value: token
          }
        }
      }
    }; }
  
  
  pp$8.curContext = function() {
    return this.context[this.context.length - 1]
  };
  
  
  pp$8.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }
  
    this.start = this.pos;
    if (this.options.locations) { this.startLoc = this.curPosition(); }
    if (this.pos >= this.input.length) { return this.finishToken(types.eof) }
  
    if (curContext.override) { return curContext.override(this) }
    else { this.readToken(this.fullCharCodeAtPos()); }
  };
  
  pp$8.readToken = function(code) {
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 )
      { return this.readWord() }
  
    return this.getTokenFromCode(code)
  };
  
  pp$8.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xe000) { return code }
    var next = this.input.charCodeAt(this.pos + 1);
    return (code << 10) + next - 0x35fdc00
  };
  
  pp$8.skipBlockComment = function() {
    var this$1 = this;
  
    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + 2;
    if (this.options.locations) {
      lineBreakG.lastIndex = start;
      var match;
      while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
        ++this$1.curLine;
        this$1.lineStart = match.index + match[0].length;
      }
    }
    if (this.options.onComment)
      { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition()); }
  };
  
  pp$8.skipLineComment = function(startSkip) {
    var this$1 = this;
  
    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos += startSkip);
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this$1.input.charCodeAt(++this$1.pos);
    }
    if (this.options.onComment)
      { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition()); }
  };
  
  
  pp$8.skipSpace = function() {
    var this$1 = this;
  
    loop: while (this.pos < this.input.length) {
      var ch = this$1.input.charCodeAt(this$1.pos);
      switch (ch) {
      case 32: case 160: 
        ++this$1.pos;
        break
      case 13:
        if (this$1.input.charCodeAt(this$1.pos + 1) === 10) {
          ++this$1.pos;
        }
      case 10: case 8232: case 8233:
        ++this$1.pos;
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        break
      case 47: 
        switch (this$1.input.charCodeAt(this$1.pos + 1)) {
        case 42: 
          this$1.skipBlockComment();
          break
        case 47:
          this$1.skipLineComment(2);
          break
        default:
          break loop
        }
        break
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this$1.pos;
        } else {
          break loop
        }
      }
    }
  };
  
  
  pp$8.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) { this.endLoc = this.curPosition(); }
    var prevType = this.type;
    this.type = type;
    this.value = val;
  
    this.updateContext(prevType);
  };
  
  
  pp$8.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) { return this.readNumber(true) }
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { 
      this.pos += 3;
      return this.finishToken(types.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(types.dot)
    }
  };
  
  pp$8.readToken_slash = function() { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.slash, 1)
  };
  
  pp$8.readToken_mult_modulo_exp = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? types.star : types.modulo;
  
    if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
      ++size;
      tokentype = types.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }
  
    if (next === 61) { return this.finishOp(types.assign, size + 1) }
    return this.finishOp(tokentype, size)
  };
  
  pp$8.readToken_pipe_amp = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) { return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2) }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1)
  };
  
  pp$8.readToken_caret = function() { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.bitwiseXOR, 1)
  };
  
  pp$8.readToken_plus_min = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
          (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(types.incDec, 2)
    }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.plusMin, 1)
  };
  
  pp$8.readToken_lt_gt = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types.assign, size + 1) }
      return this.finishOp(types.bitShift, size)
    }
    if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
        this.input.charCodeAt(this.pos + 3) === 45) {
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) { size = 2; }
    return this.finishOp(types.relational, size)
  };
  
  pp$8.readToken_eq_excl = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { 
      this.pos += 2;
      return this.finishToken(types.arrow)
    }
    return this.finishOp(code === 61 ? types.eq : types.prefix, 1)
  };
  
  pp$8.getTokenFromCode = function(code) {
    switch (code) {
    case 46: 
      return this.readToken_dot()
  
    case 40: ++this.pos; return this.finishToken(types.parenL)
    case 41: ++this.pos; return this.finishToken(types.parenR)
    case 59: ++this.pos; return this.finishToken(types.semi)
    case 44: ++this.pos; return this.finishToken(types.comma)
    case 91: ++this.pos; return this.finishToken(types.bracketL)
    case 93: ++this.pos; return this.finishToken(types.bracketR)
    case 123: ++this.pos; return this.finishToken(types.braceL)
    case 125: ++this.pos; return this.finishToken(types.braceR)
    case 58: ++this.pos; return this.finishToken(types.colon)
    case 63: ++this.pos; return this.finishToken(types.question)
  
    case 96: 
      if (this.options.ecmaVersion < 6) { break }
      ++this.pos;
      return this.finishToken(types.backQuote)
  
    case 48: 
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) { return this.readRadixNumber(16) } 
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) { return this.readRadixNumber(8) } 
        if (next === 98 || next === 66) { return this.readRadixNumber(2) } 
      }
  
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: 
      return this.readNumber(false)
  
    case 34: case 39: 
      return this.readString(code)
  
  
    case 47: 
      return this.readToken_slash()
  
    case 37: case 42: 
      return this.readToken_mult_modulo_exp(code)
  
    case 124: case 38: 
      return this.readToken_pipe_amp(code)
  
    case 94: 
      return this.readToken_caret()
  
    case 43: case 45: 
      return this.readToken_plus_min(code)
  
    case 60: case 62: 
      return this.readToken_lt_gt(code)
  
    case 61: case 33: 
      return this.readToken_eq_excl(code)
  
    case 126: 
      return this.finishOp(types.prefix, 1)
    }
  
    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };
  
  pp$8.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };
  
  pp$8.readRegexp = function() {
    var this$1 = this;
  
    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(start, "Unterminated regular expression"); }
      var ch = this$1.input.charAt(this$1.pos);
      if (lineBreak.test(ch)) { this$1.raise(start, "Unterminated regular expression"); }
      if (!escaped) {
        if (ch === "[") { inClass = true; }
        else if (ch === "]" && inClass) { inClass = false; }
        else if (ch === "/" && !inClass) { break }
        escaped = ch === "\\";
      } else { escaped = false; }
      ++this$1.pos;
    }
    var pattern = this.input.slice(start, this.pos);
    ++this.pos;
    var flagsStart = this.pos;
    var flags = this.readWord1();
    if (this.containsEsc) { this.unexpected(flagsStart); }
  
    var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
    state.reset(start, pattern, flags);
    this.validateRegExpFlags(state);
    this.validateRegExpPattern(state);
  
    var value = null;
    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
    }
  
    return this.finishToken(types.regexp, {pattern: pattern, flags: flags, value: value})
  };
  
  
  pp$8.readInt = function(radix, len) {
    var this$1 = this;
  
    var start = this.pos, total = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = this$1.input.charCodeAt(this$1.pos), val = (void 0);
      if (code >= 97) { val = code - 97 + 10; } 
      else if (code >= 65) { val = code - 65 + 10; } 
      else if (code >= 48 && code <= 57) { val = code - 48; } 
      else { val = Infinity; }
      if (val >= radix) { break }
      ++this$1.pos;
      total = total * radix + val;
    }
    if (this.pos === start || len != null && this.pos - start !== len) { return null }
  
    return total
  };
  
  pp$8.readRadixNumber = function(radix) {
    this.pos += 2; 
    var val = this.readInt(radix);
    if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types.num, val)
  };
  
  
  pp$8.readNumber = function(startsWithDot) {
    var start = this.pos;
    if (!startsWithDot && this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (octal && this.strict) { this.raise(start, "Invalid number"); }
    if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
    var next = this.input.charCodeAt(this.pos);
    if (next === 46 && !octal) { 
      ++this.pos;
      this.readInt(10);
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 69 || next === 101) && !octal) { 
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) { ++this.pos; } 
      if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
  
    var str = this.input.slice(start, this.pos);
    var val = octal ? parseInt(str, 8) : parseFloat(str);
    return this.finishToken(types.num, val)
  };
  
  
  pp$8.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;
  
    if (ch === 123) { 
      if (this.options.ecmaVersion < 6) { this.unexpected(); }
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
    } else {
      code = this.readHexChar(4);
    }
    return code
  };
  
  function codePointToString(code) {
    if (code <= 0xFFFF) { return String.fromCharCode(code) }
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }
  
  pp$8.readString = function(quote) {
    var this$1 = this;
  
    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(this$1.start, "Unterminated string constant"); }
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === quote) { break }
      if (ch === 92) { 
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(false);
        chunkStart = this$1.pos;
      } else {
        if (isNewLine(ch, this$1.options.ecmaVersion >= 10)) { this$1.raise(this$1.start, "Unterminated string constant"); }
        ++this$1.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(types.string, out)
  };
  
  
  var INVALID_TEMPLATE_ESCAPE_ERROR = {};
  
  pp$8.tryReadTemplateToken = function() {
    this.inTemplateElement = true;
    try {
      this.readTmplToken();
    } catch (err) {
      if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
        this.readInvalidTemplateToken();
      } else {
        throw err
      }
    }
  
    this.inTemplateElement = false;
  };
  
  pp$8.invalidStringToken = function(position, message) {
    if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
      throw INVALID_TEMPLATE_ESCAPE_ERROR
    } else {
      this.raise(position, message);
    }
  };
  
  pp$8.readTmplToken = function() {
    var this$1 = this;
  
    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(this$1.start, "Unterminated template"); }
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === 96 || ch === 36 && this$1.input.charCodeAt(this$1.pos + 1) === 123) { 
        if (this$1.pos === this$1.start && (this$1.type === types.template || this$1.type === types.invalidTemplate)) {
          if (ch === 36) {
            this$1.pos += 2;
            return this$1.finishToken(types.dollarBraceL)
          } else {
            ++this$1.pos;
            return this$1.finishToken(types.backQuote)
          }
        }
        out += this$1.input.slice(chunkStart, this$1.pos);
        return this$1.finishToken(types.template, out)
      }
      if (ch === 92) { 
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(true);
        chunkStart = this$1.pos;
      } else if (isNewLine(ch)) {
        out += this$1.input.slice(chunkStart, this$1.pos);
        ++this$1.pos;
        switch (ch) {
        case 13:
          if (this$1.input.charCodeAt(this$1.pos) === 10) { ++this$1.pos; }
        case 10:
          out += "\n";
          break
        default:
          out += String.fromCharCode(ch);
          break
        }
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        chunkStart = this$1.pos;
      } else {
        ++this$1.pos;
      }
    }
  };
  
  pp$8.readInvalidTemplateToken = function() {
    var this$1 = this;
  
    for (; this.pos < this.input.length; this.pos++) {
      switch (this$1.input[this$1.pos]) {
      case "\\":
        ++this$1.pos;
        break
  
      case "$":
        if (this$1.input[this$1.pos + 1] !== "{") {
          break
        }
  
      case "`":
        return this$1.finishToken(types.invalidTemplate, this$1.input.slice(this$1.start, this$1.pos))
  
      }
    }
    this.raise(this.start, "Unterminated template");
  };
  
  
  pp$8.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" 
    case 114: return "\r" 
    case 120: return String.fromCharCode(this.readHexChar(2)) 
    case 117: return codePointToString(this.readCodePoint()) 
    case 116: return "\t" 
    case 98: return "\b" 
    case 118: return "\u000b" 
    case 102: return "\f" 
    case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } 
    case 10: 
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate
              ? "Octal literal in template string"
              : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal)
      }
      return String.fromCharCode(ch)
    }
  };
  
  
  pp$8.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
    return n
  };
  
  
  pp$8.readWord1 = function() {
    var this$1 = this;
  
    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this$1.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this$1.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { 
        this$1.containsEsc = true;
        word += this$1.input.slice(chunkStart, this$1.pos);
        var escStart = this$1.pos;
        if (this$1.input.charCodeAt(++this$1.pos) !== 117) 
          { this$1.invalidStringToken(this$1.pos, "Expecting Unicode escape sequence \\uXXXX"); }
        ++this$1.pos;
        var esc = this$1.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          { this$1.invalidStringToken(escStart, "Invalid Unicode escape"); }
        word += codePointToString(esc);
        chunkStart = this$1.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };
  
  
  pp$8.readWord = function() {
    var word = this.readWord1();
    var type = types.name;
    if (this.keywords.test(word)) {
      if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword " + word); }
      type = keywords$1[word];
    }
    return this.finishToken(type, word)
  };
  
  
  var version = "5.7.3";
  
  
  function parse(input, options) {
    return new Parser(options, input).parse()
  }
  
  
  function parseExpressionAt(input, pos, options) {
    var p = new Parser(options, input, pos);
    p.nextToken();
    return p.parseExpression()
  }
  
  
  function tokenizer(input, options) {
    return new Parser(options, input)
  }
  
  function addLooseExports(parse, Parser$$1, plugins$$1) {
    exports.parse_dammit = parse; 
    exports.LooseParser = Parser$$1;
    exports.pluginsLoose = plugins$$1;
  }
  
  exports.version = version;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokenizer = tokenizer;
  exports.addLooseExports = addLooseExports;
  exports.Parser = Parser;
  exports.plugins = plugins;
  exports.defaultOptions = defaultOptions;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.getLineInfo = getLineInfo;
  exports.Node = Node;
  exports.TokenType = TokenType;
  exports.tokTypes = types;
  exports.keywordTypes = keywords$1;
  exports.TokContext = TokContext;
  exports.tokContexts = types$1;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.Token = Token;
  exports.isNewLine = isNewLine;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;
  exports.nonASCIIwhitespace = nonASCIIwhitespace;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  })));
  
  },{}],2:[function(require,module,exports){
  
  },{}],3:[function(require,module,exports){
  'use strict';
  
  function mock1D() {
    const row = [];
    for (let x = 0; x < this.output.x; x++) {
      this.thread.x = x;
      this.thread.y = 0;
      this.thread.z = 0;
      row.push(this._fn.apply(this, arguments));
    }
    return row;
  }
  
  function mock2D() {
    const matrix = [];
    for (let y = 0; y < this.output.y; y++) {
      const row = [];
      for (let x = 0; x < this.output.x; x++) {
        this.thread.x = x;
        this.thread.y = y;
        this.thread.z = 0;
        row.push(this._fn.apply(this, arguments));
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  function mock3D() {
    const cube = [];
    for (let z = 0; z < this.output.z; z++) {
      const matrix = [];
      for (let y = 0; y < this.output.y; y++) {
        const row = [];
        for (let x = 0; x < this.output.x; x++) {
          this.thread.x = x;
          this.thread.y = y;
          this.thread.z = z;
          row.push(this._fn.apply(this, arguments));
        }
        matrix.push(row);
      }
      cube.push(matrix);
    }
    return cube;
  }
  
  module.exports = function gpuMock(fn, options) {
    let contextOutput = null;
    if (options.output.length) {
      if (options.output.length === 3) {
        contextOutput = { x: options.output[0], y: options.output[1], z: options.output[2] };
      } else if (options.output.length === 2) {
        contextOutput = { x: options.output[0], y: options.output[1] };
      } else {
        contextOutput = { x: options.output[0] };
      }
    } else {
      contextOutput = options.output;
    }
  
    const context = {
      _fn: fn,
      constants: options.constants,
      output: contextOutput,
      thread: {
        x: 0,
        y: 0,
        z: 0
      }
    };
  
    if (contextOutput.z) {
      return mock3D.bind(context);
    } else if (contextOutput.y) {
      return mock2D.bind(context);
    } else {
      return mock1D.bind(context);
    }
  };
  
  },{}],4:[function(require,module,exports){
  const {
    utils
  } = require('./utils');
  
  function alias(name, source) {
    const fnString = source.toString();
    return new Function(`return function ${ name } (${ utils.getArgumentNamesFromString(fnString).join(', ') }) {
    ${ utils.getFunctionBodyFromString(fnString) }
  }`)();
  }
  
  module.exports = {
    alias
  };
  },{"./utils":29}],5:[function(require,module,exports){
  const {
    FunctionNode
  } = require('../function-node');
  
  class CPUFunctionNode extends FunctionNode {
    astFunctionExpression(ast, retArr) {
  
      if (!this.isRootKernel) {
        retArr.push('function');
        retArr.push(' ');
        retArr.push(this.name);
        retArr.push('(');
  
        for (let i = 0; i < this.argumentNames.length; ++i) {
          const argumentName = this.argumentNames[i];
  
          if (i > 0) {
            retArr.push(', ');
          }
          retArr.push('user_');
          retArr.push(argumentName);
        }
  
        retArr.push(') {\n');
      }
  
      for (let i = 0; i < ast.body.body.length; ++i) {
        this.astGeneric(ast.body.body[i], retArr);
        retArr.push('\n');
      }
  
      if (!this.isRootKernel) {
        retArr.push('}\n');
      }
      return retArr;
    }
  
    astReturnStatement(ast, retArr) {
      if (this.isRootKernel) {
        retArr.push('kernelResult = ');
        this.astGeneric(ast.argument, retArr);
        retArr.push(';');
      } else if (this.isSubKernel) {
        retArr.push(`subKernelResult_${ this.name } = `);
        this.astGeneric(ast.argument, retArr);
        retArr.push(';');
        retArr.push(`return subKernelResult_${ this.name };`);
      } else {
        retArr.push('return ');
        this.astGeneric(ast.argument, retArr);
        retArr.push(';');
      }
      return retArr;
    }
  
    astLiteral(ast, retArr) {
  
      if (isNaN(ast.value)) {
        throw this.astErrorOutput(
          'Non-numeric literal not supported : ' + ast.value,
          ast
        );
      }
  
      retArr.push(ast.value);
  
      return retArr;
    }
  
    astBinaryExpression(ast, retArr) {
      retArr.push('(');
      this.astGeneric(ast.left, retArr);
      retArr.push(ast.operator);
      this.astGeneric(ast.right, retArr);
      retArr.push(')');
      return retArr;
    }
  
    astIdentifierExpression(idtNode, retArr) {
      if (idtNode.type !== 'Identifier') {
        throw this.astErrorOutput(
          'IdentifierExpression - not an Identifier',
          idtNode
        );
      }
  
      switch (idtNode.name) {
        case 'Infinity':
          retArr.push('Infinity');
          break;
        default:
          if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
            retArr.push('constants_' + idtNode.name);
          } else {
            const name = this.getUserArgumentName(idtNode.name);
            const type = this.getType(idtNode);
            if (name && type && this.parent && type !== 'Number' && type !== 'Integer' && type !== 'LiteralInteger') {
              retArr.push('user_' + name);
            } else {
              retArr.push('user_' + idtNode.name);
            }
          }
      }
  
      return retArr;
    }
  
    astForStatement(forNode, retArr) {
      if (forNode.type !== 'ForStatement') {
        throw this.astErrorOutput('Invalid for statement', forNode);
      }
  
      const initArr = [];
      const testArr = [];
      const updateArr = [];
      const bodyArr = [];
      let isSafe = null;
  
      if (forNode.init) {
        this.pushState('in-for-loop-init');
        this.astGeneric(forNode.init, initArr);
        for (let i = 0; i < initArr.length; i++) {
          if (initArr[i].includes && initArr[i].includes(',')) {
            isSafe = false;
          }
        }
        this.popState('in-for-loop-init');
      } else {
        isSafe = false;
      }
  
      if (forNode.test) {
        this.astGeneric(forNode.test, testArr);
      } else {
        isSafe = false;
      }
  
      if (forNode.update) {
        this.astGeneric(forNode.update, updateArr);
      } else {
        isSafe = false;
      }
  
      if (forNode.body) {
        this.pushState('loop-body');
        this.astGeneric(forNode.body, bodyArr);
        this.popState('loop-body');
      }
  
      if (isSafe === null) {
        isSafe = this.isSafe(forNode.init) && this.isSafe(forNode.test);
      }
  
      if (isSafe) {
        retArr.push(`for (${initArr.join('')};${testArr.join('')};${updateArr.join('')}){\n`);
        retArr.push(bodyArr.join(''));
        retArr.push('}\n');
      } else {
        const iVariableName = this.getInternalVariableName('safeI');
        if (initArr.length > 0) {
          retArr.push(initArr.join(''), ';\n');
        }
        retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
        if (testArr.length > 0) {
          retArr.push(`if (!${testArr.join('')}) break;\n`);
        }
        retArr.push(bodyArr.join(''));
        retArr.push(`\n${updateArr.join('')};`);
        retArr.push('}\n');
      }
      return retArr;
    }
  
    astWhileStatement(whileNode, retArr) {
      if (whileNode.type !== 'WhileStatement') {
        throw this.astErrorOutput(
          'Invalid while statement',
          whileNode
        );
      }
  
      retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
      retArr.push('if (');
      this.astGeneric(whileNode.test, retArr);
      retArr.push(') {\n');
      this.astGeneric(whileNode.body, retArr);
      retArr.push('} else {\n');
      retArr.push('break;\n');
      retArr.push('}\n');
      retArr.push('}\n');
  
      return retArr;
    }
  
    astDoWhileStatement(doWhileNode, retArr) {
      if (doWhileNode.type !== 'DoWhileStatement') {
        throw this.astErrorOutput(
          'Invalid while statement',
          doWhileNode
        );
      }
  
      retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
      this.astGeneric(doWhileNode.body, retArr);
      retArr.push('if (!');
      this.astGeneric(doWhileNode.test, retArr);
      retArr.push(') {\n');
      retArr.push('break;\n');
      retArr.push('}\n');
      retArr.push('}\n');
  
      return retArr;
  
    }
  
    astAssignmentExpression(assNode, retArr) {
      this.astGeneric(assNode.left, retArr);
      retArr.push(assNode.operator);
      this.astGeneric(assNode.right, retArr);
      return retArr;
    }
  
    astBlockStatement(bNode, retArr) {
      if (!this.isState('loop-body')) {
        retArr.push('{\n');
      }
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      if (!this.isState('loop-body')) {
        retArr.push('}\n');
      }
      return retArr;
    }
  
    astVariableDeclaration(varDecNode, retArr) {
      if (varDecNode.kind === 'var') {
        this.varWarn();
      }
      retArr.push(`${varDecNode.kind} `);
      const firstDeclaration = varDecNode.declarations[0];
      const type = this.getType(firstDeclaration.init);
      for (let i = 0; i < varDecNode.declarations.length; i++) {
        this.declarations[varDecNode.declarations[i].id.name] = {
          type,
          dependencies: {
            constants: [],
            arguments: []
          },
          isUnsafe: false
        };
        if (i > 0) {
          retArr.push(',');
        }
        this.astGeneric(varDecNode.declarations[i], retArr);
      }
      if (!this.isState('in-for-loop-init')) {
        retArr.push(';');
      }
      return retArr;
    }
  
    astIfStatement(ifNode, retArr) {
      retArr.push('if (');
      this.astGeneric(ifNode.test, retArr);
      retArr.push(')');
      if (ifNode.consequent.type === 'BlockStatement') {
        this.astGeneric(ifNode.consequent, retArr);
      } else {
        retArr.push(' {\n');
        this.astGeneric(ifNode.consequent, retArr);
        retArr.push('\n}\n');
      }
  
      if (ifNode.alternate) {
        retArr.push('else ');
        if (ifNode.alternate.type === 'BlockStatement') {
          this.astGeneric(ifNode.alternate, retArr);
        } else {
          retArr.push(' {\n');
          this.astGeneric(ifNode.alternate, retArr);
          retArr.push('\n}\n');
        }
      }
      return retArr;
  
    }
  
    astThisExpression(tNode, retArr) {
      retArr.push('_this');
      return retArr;
    }
  
    astMemberExpression(mNode, retArr) {
      const {
        signature,
        type,
        property,
        xProperty,
        yProperty,
        zProperty,
        name,
        origin
      } = this.getMemberExpressionDetails(mNode);
      switch (signature) {
        case 'this.thread.value':
          retArr.push(`_this.thread.${ name }`);
          return retArr;
        case 'this.output.value':
          switch (name) {
            case 'x':
              retArr.push(this.output[0]);
              break;
            case 'y':
              retArr.push(this.output[1]);
              break;
            case 'z':
              retArr.push(this.output[2]);
              break;
            default:
              throw this.astErrorOutput('Unexpected expression', mNode);
          }
          return retArr;
        case 'value':
          throw this.astErrorOutput('Unexpected expression', mNode);
        case 'value[]':
        case 'value[][]':
        case 'value[][][]':
        case 'value.value':
          if (origin === 'Math') {
            retArr.push(Math[name]);
            return retArr;
          }
          switch (property) {
            case 'r':
              retArr.push(`user_${ name }[0]`);
              return retArr;
            case 'g':
              retArr.push(`user_${ name }[1]`);
              return retArr;
            case 'b':
              retArr.push(`user_${ name }[2]`);
              return retArr;
            case 'a':
              retArr.push(`user_${ name }[3]`);
              return retArr;
          }
          break;
        case 'this.constants.value':
        case 'this.constants.value[]':
        case 'this.constants.value[][]':
        case 'this.constants.value[][][]':
          break;
        case 'fn()[]':
          this.astGeneric(mNode.object, retArr);
          retArr.push('[');
          this.astGeneric(mNode.property, retArr);
          retArr.push(']');
          return retArr;
        default:
          throw this.astErrorOutput('Unexpected expression', mNode);
      }
  
      if (type === 'Number' || type === 'Integer') {
        retArr.push(`${origin}_${name}`);
        return retArr;
      }
  
      let synonymName;
      if (this.parent) {
        synonymName = this.getUserArgumentName(name);
      }
  
      const markupName = `${origin}_${synonymName || name}`;
  
      switch (type) {
        case 'Array(2)':
        case 'Array(3)':
        case 'Array(4)':
        case 'HTMLImageArray':
        case 'ArrayTexture(4)':
        case 'HTMLImage':
        default:
          const isInput = this.isInput(synonymName || name);
          retArr.push(`${ markupName }`);
          if (zProperty && yProperty) {
            if (isInput) {
              const size = this.argumentSizes[this.argumentNames.indexOf(name)];
              retArr.push('[(');
              this.astGeneric(zProperty, retArr);
              retArr.push(`*${ size[1] * size[0]})+(`);
              this.astGeneric(yProperty, retArr);
              retArr.push(`*${ size[0] })+`);
              this.astGeneric(xProperty, retArr);
              retArr.push(']');
            } else {
              retArr.push('[');
              this.astGeneric(zProperty, retArr);
              retArr.push(']');
              retArr.push('[');
              this.astGeneric(yProperty, retArr);
              retArr.push(']');
              retArr.push('[');
              this.astGeneric(xProperty, retArr);
              retArr.push(']');
            }
          } else if (yProperty) {
            if (isInput) {
              const size = this.argumentSizes[this.argumentNames.indexOf(name)];
              retArr.push('[(');
              this.astGeneric(yProperty, retArr);
              retArr.push(`*${ size[0] })+`);
              this.astGeneric(xProperty, retArr);
              retArr.push(']');
            } else {
              retArr.push('[');
              this.astGeneric(yProperty, retArr);
              retArr.push(']');
              retArr.push('[');
              this.astGeneric(xProperty, retArr);
              retArr.push(']');
            }
          } else {
            retArr.push('[');
            this.astGeneric(xProperty, retArr);
            retArr.push(']');
          }
      }
      return retArr;
    }
  
    astCallExpression(ast, retArr) {
      if (ast.callee) {
        let funcName = this.astMemberExpressionUnroll(ast.callee);
  
        if (this.calledFunctions.indexOf(funcName) < 0) {
          this.calledFunctions.push(funcName);
        }
        if (!this.calledFunctionsArguments[funcName]) {
          this.calledFunctionsArguments[funcName] = [];
        }
  
        const functionArguments = [];
        this.calledFunctionsArguments[funcName].push(functionArguments);
  
        retArr.push(funcName);
  
        retArr.push('(');
  
        for (let i = 0; i < ast.arguments.length; ++i) {
          const argument = ast.arguments[i];
          if (i > 0) {
            retArr.push(', ');
          }
          this.astGeneric(argument, retArr);
          const argumentType = this.getType(argument);
          if (argumentType) {
            functionArguments.push({
              name: argument.name || null,
              type: argumentType
            });
          } else {
            functionArguments.push(null);
          }
        }
  
        retArr.push(')');
  
        return retArr;
      }
  
      throw this.astErrorOutput(
        'Unknown CallExpression',
        ast
      );
    }
  
    astArrayExpression(arrNode, retArr) {
      const arrLen = arrNode.elements.length;
  
      retArr.push('[');
      for (let i = 0; i < arrLen; ++i) {
        if (i > 0) {
          retArr.push(', ');
        }
        const subNode = arrNode.elements[i];
        this.astGeneric(subNode, retArr)
      }
      retArr.push(']');
  
      return retArr;
    }
  
    astDebuggerStatement(arrNode, retArr) {
      retArr.push('debugger;');
      return retArr;
    }
  
    varWarn() {
      console.warn('var declarations are not supported, weird things happen.  Use const or let');
    }
  }
  
  module.exports = {
    CPUFunctionNode
  };
  },{"../function-node":9}],6:[function(require,module,exports){
  const {
    utils
  } = require('../../utils');
  const {
    kernelRunShortcut
  } = require('../../kernel-run-shortcut');
  
  function removeFnNoise(fn) {
    if (/^function /.test(fn)) {
      fn = fn.substring(9);
    }
    return fn.replace(/[_]typeof/g, 'typeof');
  }
  
  function removeNoise(str) {
    return str
      .replace(/^[A-Za-z]+/, 'function')
      .replace(/[_]typeof/g, 'typeof');
  }
  
  function cpuKernelString(cpuKernel, name) {
    return `() => {
      ${ kernelRunShortcut.toString() };
      const utils = {
        allPropertiesOf: ${ removeNoise(utils.allPropertiesOf.toString()) },
        clone: ${ removeNoise(utils.clone.toString()) },
      };
      let Input = function() {};
      class ${ name || 'Kernel' } {
        constructor() {        
          this.argumentsLength = 0;
          this.canvas = null;
          this.context = null;
          this.built = false;
          this.program = null;
          this.argumentNames = ${ JSON.stringify(cpuKernel.argumentNames) };
          this.argumentTypes = ${ JSON.stringify(cpuKernel.argumentTypes) };
          this.argumentSizes = ${ JSON.stringify(cpuKernel.argumentSizes) };
          this.output = ${ JSON.stringify(cpuKernel.output) };
          this._kernelString = \`${ cpuKernel._kernelString }\`;
          this.output = ${ JSON.stringify(cpuKernel.output) };
          this.run = function() {
            this.run = null;
            this.build(arguments);
            return this.run.apply(this, arguments);
          }.bind(this);
          this.thread = {
            x: 0,
            y: 0,
            z: 0
          };
        }
        setCanvas(canvas) { this.canvas = canvas; return this; }
        setContext(context) { this.context = context; return this; }
        setInput(Type) { Input = Type; }
        ${ removeFnNoise(cpuKernel.build.toString()) }
        setupArguments() {}
        ${ removeFnNoise(cpuKernel.setupConstants.toString()) }
        run () { ${ cpuKernel.kernelString } }
        getKernelString() { return this._kernelString; }
        ${ removeFnNoise(cpuKernel.validateSettings.toString()) }
        ${ removeFnNoise(cpuKernel.checkOutput.toString()) }
      };
      return kernelRunShortcut(new Kernel());
    };`;
  }
  
  module.exports = {
    cpuKernelString
  };
  },{"../../kernel-run-shortcut":26,"../../utils":29}],7:[function(require,module,exports){
  const {
    Kernel
  } = require('../kernel');
  const {
    FunctionBuilder
  } = require('../function-builder');
  const {
    CPUFunctionNode
  } = require('./function-node');
  const {
    utils
  } = require('../../utils');
  const {
    cpuKernelString
  } = require('./kernel-string');
  
  class CPUKernel extends Kernel {
    static getFeatures() {
      return this.features;
    }
    static get features() {
      return Object.freeze({
        kernelMap: true,
        isIntegerDivisionAccurate: true
      });
    }
    static get isSupported() {
      return true;
    }
    static isContextMatch(context) {
      return false;
    }
    static get mode() {
      return 'cpu';
    }
  
    constructor(source, settings) {
      super(source, settings);
  
      this.mergeSettings(source.settings || settings);
  
      this._imageData = null;
      this._colorData = null;
      this._kernelString = null;
      this.thread = {
        x: 0,
        y: 0,
        z: 0
      };
  
      this.run = function() { 
        this.run = null;
        this.build.apply(this, arguments);
        return this.run.apply(this, arguments);
      }.bind(this);
    }
  
    initCanvas() {
      if (typeof document !== 'undefined') {
        return document.createElement('canvas');
      } else if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(0, 0);
      }
    }
  
    initContext() {
      if (!this.canvas) return null;
      return this.canvas.getContext('2d');
    }
  
    initPlugins(settings) {
      return [];
    }
  
    validateSettings() {
      if (!this.output || this.output.length === 0) {
        if (arguments.length !== 1) {
          throw 'Auto dimensions only supported for kernels with only one input';
        }
  
        const argType = utils.getVariableType(arguments[0]);
        if (argType === 'Array') {
          this.output = utils.getDimensions(argType);
        } else if (argType === 'NumberTexture' || argType === 'ArrayTexture(4)') {
          this.output = arguments[0].output;
        } else {
          throw 'Auto dimensions not supported for input type: ' + argType;
        }
      }
  
      this.checkOutput();
    }
  
    build() {
      this.setupConstants();
      this.setupArguments(arguments);
      this.validateSettings();
  
      if (this.graphical) {
        const {
          canvas,
          output
        } = this;
        if (!canvas) {
          throw new Error('no canvas available for using graphical output');
        }
        const width = output[0];
        const height = output[1] || 1;
        canvas.width = width;
        canvas.height = height;
        this._imageData = this.context.createImageData(width, height);
        this._colorData = new Uint8ClampedArray(width * height * 4);
      }
  
      const kernelString = this.getKernelString();
      this.kernelString = kernelString;
  
      if (this.debug) {
        console.log('Function output:');
        console.log(kernelString);
      }
  
      try {
        this.run = new Function([], kernelString).bind(this)();
      } catch (e) {
        console.error('An error occurred compiling the javascript: ', e);
      }
    }
  
    color(r, g, b, a) {
      if (typeof a === 'undefined') {
        a = 1;
      }
  
      r = Math.floor(r * 255);
      g = Math.floor(g * 255);
      b = Math.floor(b * 255);
      a = Math.floor(a * 255);
  
      const width = this.output[0];
      const height = this.output[1];
  
      const x = this.thread.x;
      const y = height - this.thread.y - 1;
  
      const index = x + y * width;
  
      this._colorData[index * 4 + 0] = r;
      this._colorData[index * 4 + 1] = g;
      this._colorData[index * 4 + 2] = b;
      this._colorData[index * 4 + 3] = a;
    }
  
    getKernelString() {
      if (this._kernelString !== null) return this._kernelString;
  
      const functionBuilder = FunctionBuilder.fromKernel(this, CPUFunctionNode);
  
      let prototypes = functionBuilder.getPrototypes('kernel');
      let kernel = null;
      if (prototypes.length > 1) {
        prototypes = prototypes.filter(fn => {
          if (/^function/.test(fn)) return fn;
          kernel = fn;
          return false;
        })
      } else {
        kernel = prototypes.shift();
      }
      const kernelString = this._kernelString = `
      const LOOP_MAX = ${ this._getLoopMaxString() }
      const constants = this.constants;
      const _this = this;
      return function (${ this.argumentNames.map(argumentName => 'user_' + argumentName).join(', ') }) {
        ${ this._processConstants() }
        ${ this._processArguments() }
        ${ this._kernelLoop(kernel) }
        if (this.graphical) {
          this._imageData.data.set(this._colorData);
          this.context.putImageData(this._imageData, 0, 0);
          return;
        }
        ${ this._kernelOutput() }
        ${ prototypes.length > 0 ? prototypes.join('\n') : '' }
      }.bind(this);`;
      return kernelString;
    }
  
    toString() {
      return cpuKernelString(this);
    }
  
    _getLoopMaxString() {
      return (
        this.loopMaxIterations ?
        ` ${ parseInt(this.loopMaxIterations) };\n` :
        ' 1000;\n'
      );
    }
  
    _processConstants() {
      if (!this.constants) return '';
  
      const result = [];
      for (let p in this.constants) {
        const type = this.constantTypes[p];
        switch (type) {
          case 'HTMLImage':
            result.push(`  const constants_${p} = this._imageTo2DArray(this.constants.${p});`);
            break;
          case 'HTMLImageArray':
            result.push(`  const constants_${p} = this._imageTo3DArray(this.constants.${p});`);
            break;
          case 'Input':
            result.push(`  const constants_${p} = this.constants.${p}.value;`);
            break;
          default:
            result.push(`  const constants_${p} = this.constants.${p};`);
        }
      }
      return result.join('\n');
    }
  
    _processArguments() {
      const result = [];
      for (let i = 0; i < this.argumentTypes.length; i++) {
        switch (this.argumentTypes[i]) {
          case 'HTMLImage':
            result.push(`  user_${this.argumentNames[i]} = this._imageTo2DArray(user_${this.argumentNames[i]});`);
            break;
          case 'HTMLImageArray':
            result.push(`  user_${this.argumentNames[i]} = this._imageTo3DArray(user_${this.argumentNames[i]});`);
            break;
          case 'Input':
            result.push(`  user_${this.argumentNames[i]} = user_${this.argumentNames[i]}.value;`);
            break;
        }
      }
      return result.join(';\n');
    }
  
    _imageTo2DArray(image) {
      const canvas = this.canvas;
      if (canvas.width < image.width) {
        canvas.width = image.width;
      }
      if (canvas.height < image.height) {
        canvas.height = image.height;
      }
      const ctx = this.context;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const pixelsData = ctx.getImageData(0, 0, image.width, image.height).data;
      const imageArray = new Array(image.height);
      let index = 0;
      for (let y = image.height - 1; y >= 0; y--) {
        imageArray[y] = new Array(image.width);
        for (let x = 0; x < image.width; x++) {
          const r = pixelsData[index++] / 255;
          const g = pixelsData[index++] / 255;
          const b = pixelsData[index++] / 255;
          const a = pixelsData[index++] / 255;
          imageArray[y][x] = [r, g, b, a];
        }
      }
      return imageArray;
    }
  
    _imageTo3DArray(images) {
      const imagesArray = new Array(images.length);
      for (let i = 0; i < images.length; i++) {
        imagesArray[i] = this._imageTo2DArray(images[i]);
      }
      return imagesArray;
    }
  
    _kernelLoop(kernelString) {
      switch (this.output.length) {
        case 1:
          return this._kernel1DLoop(kernelString);
        case 2:
          return this._kernel2DLoop(kernelString);
        case 3:
          return this._kernel3DLoop(kernelString);
        default:
          throw new Error('unsupported size kernel');
      }
    }
  
    _kernel1DLoop(kernelString) {
      const {
        output
      } = this;
      return `const result = new Float32Array(${ output[0] });
      ${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };`).join('\n') }
      ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Float32Array(${ output[0] });\n`).join('') }
      for (let x = 0; x < ${ output[0] }; x++) {
        this.thread.x = x;
        this.thread.y = 0;
        this.thread.z = 0;
        let kernelResult;
        ${ kernelString }
        result[x] = kernelResult;
        ${ this._mapSubKernels(subKernel => `result_${ subKernel.name }[x] = subKernelResult_${ subKernel.name };\n`).join('') }
      }`;
    }
  
    _kernel2DLoop(kernelString) {
      const {
        output
      } = this;
      return `const result = new Array(${ output[1] });
      ${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };`).join('\n') }
      ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(${ output[1] });\n`).join('') }
      for (let y = 0; y < ${ output[1] }; y++) {
        this.thread.z = 0;
        this.thread.y = y;
        const resultX = result[y] = new Float32Array(${ output[0] });
        ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name }X = result_${subKernel.name}[y] = new Float32Array(${ output[0] });\n`).join('') }
        for (let x = 0; x < ${ output[0] }; x++) {
          this.thread.x = x;
          let kernelResult;
          ${ kernelString }
          resultX[x] = kernelResult;
          ${ this._mapSubKernels(subKernel => `result_${ subKernel.name }X[x] = subKernelResult_${ subKernel.name };\n`).join('') }
        }
      }`;
    }
  
    _kernel3DLoop(kernelString) {
      const {
        output
      } = this;
      return `const result = new Array(${ output[2] });
      ${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };`).join('\n') }
      ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(${ output[2] });\n`).join('') }
      for (let z = 0; z < ${ output[2] }; z++) {
        this.thread.z = z;
        const resultY = result[z] = new Array(${ output[1] });
        ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name }Y = result_${subKernel.name}[z] = new Array(${ output[1] });\n`).join('') }
        for (let y = 0; y < ${ output[1] }; y++) {
          this.thread.y = y;
          const resultX = resultY[y] = new Float32Array(${ output[0] });
          ${ this._mapSubKernels(subKernel => `const result_${ subKernel.name }X = result_${subKernel.name}Y[y] = new Float32Array(${ output[0] });\n`).join('') }
          for (let x = 0; x < ${ output[0] }; x++) {
            this.thread.x = x;
            let kernelResult;
            ${ kernelString }
            resultX[x] = kernelResult;
            ${ this._mapSubKernels(subKernel => `result_${ subKernel.name }X[x] = subKernelResult_${ subKernel.name };\n`).join('') }
          }
        }
      }`;
    }
  
    _kernelOutput() {
      if (!this.subKernels) {
        return 'return result;';
      }
      return `return {
        result: result,
        ${ this.subKernels.map(subKernel => `${ subKernel.property }: result_${ subKernel.name }`).join(',\n') }
      };`;
    }
  
    _mapSubKernels(fn) {
      return this.subKernels === null ? [''] :
        this.subKernels.map(fn);
    }
  
    destroy(removeCanvasReference) {
      if (removeCanvasReference) {
        delete this.canvas;
      }
    }
  
    static destroyContext(context) {}
  
    toJSON() {
      const json = super.toJSON();
      json.functionNodes = FunctionBuilder.fromKernel(this, CPUFunctionNode).toJSON();
      return json;
    }
  }
  
  module.exports = {
    CPUKernel
  };
  },{"../../utils":29,"../function-builder":8,"../kernel":12,"./function-node":5,"./kernel-string":6}],8:[function(require,module,exports){
  class FunctionBuilder {
    static fromKernel(kernel, FunctionNode, extraNodeOptions) {
      const {
        argumentNames,
        argumentTypes,
        argumentSizes,
        constants,
        constantTypes,
        debug,
        loopMaxIterations,
        nativeFunctions,
        output,
        plugins,
        source,
        subKernels,
        functions,
      } = kernel;
  
      const onNestedFunction = (fnString, returnType) => {
        functionBuilder.addFunctionNode(new FunctionNode(fnString, Object.assign({}, nodeOptions, {
          returnType
        })));
      };
  
      const lookupReturnType = (functionName) => {
        return functionBuilder.lookupReturnType(functionName);
      };
  
      const nodeOptions = Object.assign({
        isRootKernel: false,
        onNestedFunction,
        lookupReturnType,
        constants,
        constantTypes,
        debug,
        loopMaxIterations,
        output,
        plugins,
      }, extraNodeOptions || {});
  
      const rootNodeOptions = Object.assign({}, nodeOptions, {
        isRootKernel: true,
        name: 'kernel',
        argumentNames,
        argumentTypes,
        argumentSizes,
      });
  
      if (typeof source === 'object' && source.functionNodes) {
        return new FunctionBuilder().fromJSON(source.functionNodes, FunctionNode);
      }
  
      const rootNode = new FunctionNode(source, rootNodeOptions);
  
      let functionNodes = null;
      if (functions) {
        functionNodes = functions.map((fn) => new FunctionNode(fn.source, {
          returnType: fn.returnType,
          argumentTypes: fn.argumentTypes,
          output,
          plugins,
          constants,
          constantTypes,
        }));
      }
  
      let subKernelNodes = null;
      if (subKernels) {
        subKernelNodes = subKernels.map((subKernel) => {
          const {
            name,
            source
          } = subKernel;
          return new FunctionNode(source, Object.assign({}, nodeOptions, {
            name,
            isSubKernel: true,
            isRootKernel: false
          }));
        });
      }
  
      const functionBuilder = new FunctionBuilder({
        rootNode,
        functionNodes,
        nativeFunctions,
        subKernelNodes
      });
  
      return functionBuilder;
    }
  
    constructor(settings) {
      settings = settings || {};
      this.rootNode = settings.rootNode;
      this.functionNodes = settings.functionNodes || [];
      this.subKernelNodes = settings.subKernelNodes || [];
      this.nativeFunctions = settings.nativeFunctions || [];
      this.functionMap = {};
      this.nativeFunctionNames = [];
  
      if (this.rootNode) {
        this.functionMap['kernel'] = this.rootNode;
      }
  
      if (this.functionNodes) {
        for (let i = 0; i < this.functionNodes.length; i++) {
          this.functionMap[this.functionNodes[i].name] = this.functionNodes[i];
        }
      }
  
      if (this.subKernelNodes) {
        for (let i = 0; i < this.subKernelNodes.length; i++) {
          this.functionMap[this.subKernelNodes[i].name] = this.subKernelNodes[i];
        }
      }
  
      if (this.nativeFunctions) {
        for (let i = 0; i < this.nativeFunctions.length; i++) {
          this.nativeFunctionNames.push(this.nativeFunctions[i].name);
        }
      }
    }
  
    addFunctionNode(functionNode) {
      this.functionMap[functionNode.name] = functionNode;
      if (functionNode.isRootKernel) {
        this.rootNode = functionNode;
      }
    }
  
    traceFunctionCalls(functionName, retList, parent) {
      functionName = functionName || 'kernel';
      retList = retList || [];
  
      if (this.nativeFunctionNames.indexOf(functionName) > -1) {
        if (retList.indexOf(functionName) >= 0) {
        } else {
          retList.push(functionName);
        }
        return retList;
      }
  
      const functionNode = this.functionMap[functionName];
      if (functionNode) {
        const functionIndex = retList.indexOf(functionName);
        if (functionIndex === -1) {
          retList.push(functionName);
          if (parent) {
            functionNode.parent = parent;
          }
          functionNode.toString(); 
          for (let i = 0; i < functionNode.calledFunctions.length; ++i) {
            this.traceFunctionCalls(functionNode.calledFunctions[i], retList, functionNode);
          }
        } else {
          const dependantFunctionName = retList.splice(functionIndex, 1)[0];
          retList.push(dependantFunctionName);
        }
      }
  
      return retList;
    }
  
    getPrototypeString(functionName) {
      return this.getPrototypes(functionName).join('\n');
    }
  
    getPrototypes(functionName) {
      if (this.rootNode) {
        this.rootNode.toString();
      }
      if (functionName) {
        return this.getPrototypesFromFunctionNames(this.traceFunctionCalls(functionName, []).reverse());
      }
      return this.getPrototypesFromFunctionNames(Object.keys(this.functionMap));
    }
  
    getStringFromFunctionNames(functionList) {
      const ret = [];
      for (let i = 0; i < functionList.length; ++i) {
        const node = this.functionMap[functionList[i]];
        if (node) {
          ret.push(this.functionMap[functionList[i]].toString());
        }
      }
      return ret.join('\n');
    }
  
    getPrototypesFromFunctionNames(functionList) {
      const ret = [];
      for (let i = 0; i < functionList.length; ++i) {
        const functionName = functionList[i];
        const functionIndex = this.nativeFunctionNames.indexOf(functionName);
        if (functionIndex > -1) {
          ret.push(this.nativeFunctions[functionIndex].source);
          continue;
        }
        const node = this.functionMap[functionName];
        if (node) {
          ret.push(node.toString());
        }
      }
      return ret;
    }
  
    toJSON() {
      return this.traceFunctionCalls(this.rootNode.name).reverse().map(name => {
        if (this.nativeFunctions[name]) {
          return {
            name,
            source: this.nativeFunctions[name]
          };
        } else if (this.functionMap[name]) {
          return this.functionMap[name].toJSON();
        } else {
          throw new Error(`function ${ name } not found`);
        }
      });
    }
  
    fromJSON(jsonFunctionNodes, FunctionNode) {
      this.functionMap = {};
      for (let i = 0; i < jsonFunctionNodes.length; i++) {
        const jsonFunctionNode = jsonFunctionNodes[i];
        this.functionMap[jsonFunctionNode.settings.name] = new FunctionNode(jsonFunctionNode.ast, jsonFunctionNode.settings);
      }
      return this;
    }
  
    getString(functionName) {
      if (functionName) {
        return this.getStringFromFunctionNames(this.traceFunctionCalls(functionName).reverse());
      }
      return this.getStringFromFunctionNames(Object.keys(this.functionMap));
    }
  
    lookupReturnType(functionName) {
      const node = this.functionMap[functionName];
      if (node && node.returnType) {
        return node.returnType;
      }
      return null;
    }
  }
  
  module.exports = {
    FunctionBuilder
  };
  },{}],9:[function(require,module,exports){
  const {
    utils
  } = require('../utils');
  const acorn = require('acorn');
  
  class FunctionNode {
    constructor(source, settings) {
      if (!source) {
        throw new Error('source parameter is missing');
      }
      settings = settings || {};
  
      this.source = source;
      this.name = typeof source === 'string' ? settings.isRootKernel ?
        'kernel' :
        (settings.name || utils.getFunctionNameFromString(source)) : null;
      this.calledFunctions = [];
      this.calledFunctionsArguments = {};
      this.constants = {};
      this.constantTypes = {};
      this.isRootKernel = false;
      this.isSubKernel = false;
      this.parent = null;
      this.debug = null;
      this.declarations = {};
      this.states = [];
      this.lookupReturnType = null;
      this.onNestedFunction = null;
      this.loopMaxIterations = null;
      this.argumentNames = (typeof this.source === 'string' ? utils.getArgumentNamesFromString(this.source) : null);
      this.argumentTypes = [];
      this.argumentSizes = [];
      this.returnType = null;
      this.output = [];
      this.plugins = null;
  
      if (settings) {
        for (const p in settings) {
          if (!settings.hasOwnProperty(p)) continue;
          if (!this.hasOwnProperty(p)) continue;
          this[p] = settings[p];
        }
      }
  
      if (!this.returnType) {
        this.returnType = 'Number';
      }
  
      this.validate();
      this._string = null;
      this._internalVariableNames = {};
    }
  
    validate() {
      if (typeof this.source !== 'string') {
        throw new Error('this.source not a string');
      }
  
      if (!utils.isFunctionString(this.source)) {
        throw new Error('this.source not a function string');
      }
  
      if (!this.name) {
        throw new Error('this.name could not be set');
      }
  
      if (this.argumentTypes.length > 0 && this.argumentTypes.length !== this.argumentNames.length) {
        throw new Error(`argumentTypes count of ${ this.argumentTypes.length } exceeds ${ this.argumentNames.length }`);
      }
  
      if (this.output.length < 1) {
        throw new Error('this.output is not big enough');
      }
    }
  
    isIdentifierConstant(name) {
      if (!this.constants) return false;
      return this.constants.hasOwnProperty(name);
    }
  
    isInput(argumentName) {
      return this.argumentTypes[this.argumentNames.indexOf(argumentName)] === 'Input';
    }
  
    pushState(state) {
      this.states.push(state);
    }
  
    popState(state) {
      if (this.state !== state) {
        throw new Error(`Cannot popState ${ state } when in ${ this.state }`);
      }
      this.states.pop();
    }
  
    isState(state) {
      return this.state === state;
    }
  
    get state() {
      return this.states[this.states.length - 1];
    }
  
    astMemberExpressionUnroll(ast) {
      if (ast.type === 'Identifier') {
        return ast.name;
      } else if (ast.type === 'ThisExpression') {
        return 'this';
      }
  
      if (ast.type === 'MemberExpression') {
        if (ast.object && ast.property) {
          if (ast.object.hasOwnProperty('name') && ast.object.name[0] === '_') {
            return this.astMemberExpressionUnroll(ast.property);
          }
  
          return (
            this.astMemberExpressionUnroll(ast.object) +
            '.' +
            this.astMemberExpressionUnroll(ast.property)
          );
        }
      }
  
      if (ast.hasOwnProperty('expressions')) {
        const firstExpression = ast.expressions[0];
        if (firstExpression.type === 'Literal' && firstExpression.value === 0 && ast.expressions.length === 2) {
          return this.astMemberExpressionUnroll(ast.expressions[1]);
        }
      }
  
      throw this.astErrorOutput('Unknown astMemberExpressionUnroll', ast);
    }
  
    getJsAST(inParser) {
      if (typeof this.source === 'object') {
        return this.ast = this.source;
      }
  
      inParser = inParser || acorn;
      if (inParser === null) {
        throw 'Missing JS to AST parser';
      }
  
      const ast = Object.freeze(inParser.parse(`const parser_${ this.name } = ${ this.source };`, {
        locations: true
      }));
      const functionAST = ast.body[0].declarations[0].init;
      if (!ast) {
        throw new Error('Failed to parse JS code');
      }
  
      return this.ast = functionAST;
    }
  
    getVariableType(name) {
      let type = null;
      const argumentIndex = this.argumentNames.indexOf(name);
      if (argumentIndex === -1) {
        if (this.declarations[name]) {
          return this.declarations[name].type;
        }
      } else {
        const argumentType = this.argumentTypes[argumentIndex];
        if (argumentType) {
          type = argumentType;
        } else if (this.parent) {
          const calledFunctionArguments = this.parent.calledFunctionsArguments[this.name];
          for (let i = 0; i < calledFunctionArguments.length; i++) {
            const calledFunctionArgument = calledFunctionArguments[i];
            if (calledFunctionArgument[argumentIndex] !== null) {
              type = calledFunctionArgument[argumentIndex].type;
              this.argumentTypes[argumentIndex] = type;
              break;
            }
          }
        }
      }
      if (!type) {
      }
      return type;
    }
  
    getConstantType(constantName) {
      if (this.constantTypes[constantName]) {
        const type = this.constantTypes[constantName];
        if (type === 'Float') {
          return 'Number';
        } else {
          return type;
        }
      }
      return null;
    }
  
    getUserArgumentName(name) {
      const argumentIndex = this.argumentNames.indexOf(name);
      if (argumentIndex === -1) return null;
      if (!this.parent || this.isRootKernel) return null;
      const calledFunctionArguments = this.parent.calledFunctionsArguments[this.name];
      for (let i = 0; i < calledFunctionArguments.length; i++) {
        const calledFunctionArgument = calledFunctionArguments[i];
        const argument = calledFunctionArgument[argumentIndex];
        if (argument && argument.type !== 'Integer' && argument.type !== 'LiteralInteger' && argument.type !== 'Number') {
          return argument.name;
        }
      }
      return null;
    }
  
    toString() {
      if (this._string) return this._string;
      return this._string = this.astGeneric(this.getJsAST(), []).join('').trim();
    }
  
    toJSON() {
      const settings = {
        source: this.source,
        name: this.name,
        constants: this.constants,
        constantTypes: this.constantTypes,
        isRootKernel: this.isRootKernel,
        isSubKernel: this.isSubKernel,
        debug: this.debug,
        output: this.output,
        loopMaxIterations: this.loopMaxIterations,
        argumentNames: this.argumentNames,
        argumentTypes: this.argumentTypes,
        argumentSizes: this.argumentSizes,
        returnType: this.returnType
      };
  
      return {
        ast: this.ast,
        settings
      };
    }
  
    getType(ast) {
      if (Array.isArray(ast)) {
        return this.getType(ast[ast.length - 1]);
      }
      switch (ast.type) {
        case 'BlockStatement':
          return this.getType(ast.body);
        case 'ArrayExpression':
          return `Array(${ ast.elements.length })`;
        case 'Literal':
          if (Number.isInteger(ast.value)) {
            return 'LiteralInteger';
          } else {
            return 'Number';
          }
        case 'CallExpression':
          if (this.isAstMathFunction(ast)) {
            return 'Number';
          }
          return ast.callee && ast.callee.name && this.lookupReturnType ? this.lookupReturnType(ast.callee.name) : null;
        case 'BinaryExpression':
          if (ast.operator === '%') {
            return 'Number';
          } else if (ast.operator === '>' || ast.operator === '<') {
            return 'Boolean';
          }
          const type = this.getType(ast.left);
          return typeLookupMap[type] || type;
        case 'UpdateExpression':
          return this.getType(ast.argument);
        case 'UnaryExpression':
          return this.getType(ast.argument);
        case 'VariableDeclaration':
          return this.getType(ast.declarations[0]);
        case 'VariableDeclarator':
          return this.getType(ast.id);
        case 'Identifier':
          if (this.isAstVariable(ast)) {
            const signature = this.getVariableSignature(ast);
            if (signature === 'value') {
              if (this.argumentNames.indexOf(ast.name) > -1) {
                return this.getVariableType(ast.name);
              } else if (this.declarations[ast.name]) {
                return this.declarations[ast.name].type;
              }
            }
          }
          if (ast.name === 'Infinity') {
            return 'Integer';
          }
          return null;
        case 'ReturnStatement':
          return this.getType(ast.argument);
        case 'MemberExpression':
          if (this.isAstMathFunction(ast)) {
            switch (ast.property.name) {
              case 'ceil':
                return 'Integer';
              case 'floor':
                return 'Integer';
              case 'round':
                return 'Integer';
            }
            return 'Number';
          }
          if (this.isAstVariable(ast)) {
            const variableSignature = this.getVariableSignature(ast);
            switch (variableSignature) {
              case 'value[]':
                return typeLookupMap[this.getVariableType(ast.object.name)];
              case 'value[][]':
                return typeLookupMap[this.getVariableType(ast.object.object.name)];
              case 'value[][][]':
                return typeLookupMap[this.getVariableType(ast.object.object.object.name)];
              case 'this.thread.value':
                return 'Integer';
              case 'this.output.value':
                return 'Integer';
              case 'this.constants.value':
                return this.getConstantType(ast.property.name);
              case 'this.constants.value[]':
                return typeLookupMap[this.getConstantType(ast.object.property.name)];
              case 'this.constants.value[][]':
                return typeLookupMap[this.getConstantType(ast.object.object.property.name)];
              case 'this.constants.value[][][]':
                return typeLookupMap[this.getConstantType(ast.object.object.object.property.name)];
              case 'fn()[]':
                return typeLookupMap[this.getType(ast.object)];
              case 'fn()[][]':
                return typeLookupMap[this.getType(ast.object)];
              case 'fn()[][][]':
                return typeLookupMap[this.getType(ast.object)];
              case 'value.value':
                if (this.isAstMathVariable(ast)) {
                  return 'Number';
                }
                switch (ast.property.name) {
                  case 'r':
                    return typeLookupMap[this.getVariableType(ast.object.name)];
                  case 'g':
                    return typeLookupMap[this.getVariableType(ast.object.name)];
                  case 'b':
                    return typeLookupMap[this.getVariableType(ast.object.name)];
                  case 'a':
                    return typeLookupMap[this.getVariableType(ast.object.name)];
                }
            }
            throw this.astErrorOutput('Unhandled getType MemberExpression', ast);
          }
          throw this.astErrorOutput('Unhandled getType MemberExpression', ast);
        case 'FunctionDeclaration':
          return this.getType(ast.body);
        case 'ConditionalExpression':
          return this.getType(ast.consequent);
        default:
          throw this.astErrorOutput(`Unhandled getType Type "${ ast.type }"`, ast);
      }
    }
  
    isAstMathVariable(ast) {
      const mathProperties = [
        'E',
        'PI',
        'SQRT2',
        'SQRT1_2',
        'LN2',
        'LN10',
        'LOG2E',
        'LOG10E',
      ];
      return ast.type === 'MemberExpression' &&
        ast.object && ast.object.type === 'Identifier' &&
        ast.object.name === 'Math' &&
        ast.property &&
        ast.property.type === 'Identifier' &&
        mathProperties.indexOf(ast.property.name) > -1;
    }
  
    isAstMathFunction(ast) {
      const mathFunctions = [
        'abs',
        'acos',
        'asin',
        'atan',
        'atan2',
        'ceil',
        'cos',
        'exp',
        'floor',
        'log',
        'log2',
        'max',
        'min',
        'pow',
        'random',
        'round',
        'sign',
        'sin',
        'sqrt',
        'tan',
      ];
      return ast.type === 'CallExpression' &&
        ast.callee &&
        ast.callee.type === 'MemberExpression' &&
        ast.callee.object &&
        ast.callee.object.type === 'Identifier' &&
        ast.callee.object.name === 'Math' &&
        ast.callee.property &&
        ast.callee.property.type === 'Identifier' &&
        mathFunctions.indexOf(ast.callee.property.name) > -1;
    }
  
    isAstVariable(ast) {
      return ast.type === 'Identifier' || ast.type === 'MemberExpression';
    }
  
    isSafe(ast) {
      return this.isSafeDependencies(this.getDependencies(ast));
    }
  
    isSafeDependencies(dependencies) {
      return dependencies && dependencies.every ? dependencies.every(dependency => dependency.isSafe) : true;
    }
  
    getDependencies(ast, dependencies, isNotSafe) {
      if (!dependencies) {
        dependencies = [];
      }
      if (!ast) return null;
      if (Array.isArray(ast)) {
        for (let i = 0; i < ast.length; i++) {
          this.getDependencies(ast[i], dependencies, isNotSafe);
        }
        return dependencies;
      }
      switch (ast.type) {
        case 'Literal':
          dependencies.push({
            origin: 'literal',
            value: ast.value,
            isSafe: isNotSafe === true ? false : ast.value > -Infinity && ast.value < Infinity && !isNaN(ast.value)
          });
          break;
        case 'VariableDeclarator':
          return this.getDependencies(ast.init, dependencies, isNotSafe);
        case 'Identifier':
          if (this.declarations[ast.name]) {
            dependencies.push({
              name: ast.name,
              origin: 'declaration',
              isSafe: isNotSafe ? false : this.isSafeDependencies(this.declarations[ast.name].dependencies),
            });
          } else if (this.argumentNames.indexOf(ast.name) > -1) {
            dependencies.push({
              name: ast.name,
              origin: 'argument',
              isSafe: false,
            });
          }
          break;
        case 'FunctionDeclaration':
          return this.getDependencies(ast.body.body[ast.body.body.length - 1], dependencies, isNotSafe);
        case 'ReturnStatement':
          return this.getDependencies(ast.argument, dependencies);
        case 'BinaryExpression':
          isNotSafe = (ast.operator === '/' || ast.operator === '*');
          this.getDependencies(ast.left, dependencies, isNotSafe);
          this.getDependencies(ast.right, dependencies, isNotSafe);
          return dependencies;
        case 'UpdateExpression':
          return this.getDependencies(ast.argument, dependencies, isNotSafe);
        case 'VariableDeclaration':
          return this.getDependencies(ast.declarations, dependencies, isNotSafe);
        case 'ArrayExpression':
          dependencies.push({
            origin: 'declaration',
            isSafe: true,
          });
          return dependencies;
        case 'CallExpression':
          dependencies.push({
            origin: 'function',
            isSafe: true,
          });
          return dependencies;
        case 'MemberExpression':
          const details = this.getMemberExpressionDetails(ast);
          if (details) {
            return details.type;
          }
        default:
          throw this.astErrorOutput(`Unhandled type ${ ast.type } in getAllVariables`, ast);
      }
      return dependencies;
    }
  
    getVariableSignature(ast) {
      if (!this.isAstVariable(ast)) {
        throw new Error(`ast of type "${ ast.type }" is not a variable signature`);
      }
      if (ast.type === 'Identifier') {
        return 'value';
      }
      const signature = [];
      while (true) {
        if (!ast) break;
        if (ast.computed) {
          signature.push('[]');
        } else if (ast.type === 'ThisExpression') {
          signature.unshift('this');
        } else if (ast.property && ast.property.name) {
          if (
            ast.property.name === 'x' ||
            ast.property.name === 'y' ||
            ast.property.name === 'z'
          ) {
            signature.unshift('.value');
          } else if (
            ast.property.name === 'constants' ||
            ast.property.name === 'thread' ||
            ast.property.name === 'output'
          ) {
            signature.unshift('.' + ast.property.name);
          } else {
            signature.unshift('.value');
          }
        } else if (ast.name) {
          signature.unshift('value');
        } else if (ast.callee && ast.callee.name) {
          signature.unshift('fn()');
        } else {
          signature.unshift('unknown');
        }
        ast = ast.object;
      }
  
      const signatureString = signature.join('');
      const allowedExpressions = [
        'value',
        'value[]',
        'value[][]',
        'value[][][]',
        'value.value',
        'this.thread.value',
        'this.output.value',
        'this.constants.value',
        'this.constants.value[]',
        'this.constants.value[][]',
        'this.constants.value[][][]',
        'fn()[]',
        'fn()[][]',
        'fn()[][][]',
      ];
      if (allowedExpressions.indexOf(signatureString) > -1) {
        return signatureString;
      }
      return null;
    }
  
    build() {
      return this.toString().length > 0;
    }
  
    astGeneric(ast, retArr) {
      if (ast === null) {
        throw this.astErrorOutput('NULL ast', ast);
      } else {
        if (Array.isArray(ast)) {
          for (let i = 0; i < ast.length; i++) {
            this.astGeneric(ast[i], retArr);
          }
          return retArr;
        }
  
        switch (ast.type) {
          case 'FunctionDeclaration':
            return this.astFunctionDeclaration(ast, retArr);
          case 'FunctionExpression':
            return this.astFunctionExpression(ast, retArr);
          case 'ReturnStatement':
            return this.astReturnStatement(ast, retArr);
          case 'Literal':
            return this.astLiteral(ast, retArr);
          case 'BinaryExpression':
            return this.astBinaryExpression(ast, retArr);
          case 'Identifier':
            return this.astIdentifierExpression(ast, retArr);
          case 'AssignmentExpression':
            return this.astAssignmentExpression(ast, retArr);
          case 'ExpressionStatement':
            return this.astExpressionStatement(ast, retArr);
          case 'EmptyStatement':
            return this.astEmptyStatement(ast, retArr);
          case 'BlockStatement':
            return this.astBlockStatement(ast, retArr);
          case 'IfStatement':
            return this.astIfStatement(ast, retArr);
          case 'BreakStatement':
            return this.astBreakStatement(ast, retArr);
          case 'ContinueStatement':
            return this.astContinueStatement(ast, retArr);
          case 'ForStatement':
            return this.astForStatement(ast, retArr);
          case 'WhileStatement':
            return this.astWhileStatement(ast, retArr);
          case 'DoWhileStatement':
            return this.astDoWhileStatement(ast, retArr);
          case 'VariableDeclaration':
            return this.astVariableDeclaration(ast, retArr);
          case 'VariableDeclarator':
            return this.astVariableDeclarator(ast, retArr);
          case 'ThisExpression':
            return this.astThisExpression(ast, retArr);
          case 'SequenceExpression':
            return this.astSequenceExpression(ast, retArr);
          case 'UnaryExpression':
            return this.astUnaryExpression(ast, retArr);
          case 'UpdateExpression':
            return this.astUpdateExpression(ast, retArr);
          case 'LogicalExpression':
            return this.astLogicalExpression(ast, retArr);
          case 'MemberExpression':
            return this.astMemberExpression(ast, retArr);
          case 'CallExpression':
            return this.astCallExpression(ast, retArr);
          case 'ArrayExpression':
            return this.astArrayExpression(ast, retArr);
          case 'DebuggerStatement':
            return this.astDebuggerStatement(ast, retArr);
          case 'ConditionalExpression':
            return this.astConditionalExpression(ast, retArr);
        }
  
        throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast);
      }
    }
    astErrorOutput(error, ast) {
      if (typeof this.source !== 'string') {
        return new Error(error);
      }
  
      const debugString = utils.getAstString(this.source, ast);
      const leadingSource = this.source.substr(ast.start);
      const splitLines = leadingSource.split(/\n/);
      const lineBefore = splitLines.length > 0 ? splitLines[splitLines.length - 1] : 0;
      return new Error(`${error} on line ${ splitLines.length }, position ${ lineBefore.length }:\n ${ debugString }`);
    }
  
    astDebuggerStatement(arrNode, retArr) {
      return retArr;
    }
  
    astConditionalExpression(ast, retArr) {
      if (ast.type !== 'ConditionalExpression') {
        throw this.astErrorOutput('Not a conditional expression', ast);
      }
      retArr.push('(');
      this.astGeneric(ast.test, retArr);
      retArr.push('?');
      this.astGeneric(ast.consequent, retArr);
      retArr.push(':');
      this.astGeneric(ast.alternate, retArr);
      retArr.push(')');
      return retArr;
    }
    astFunctionDeclaration(ast, retArr) {
      if (this.onNestedFunction) {
        let returnType = this.getType(ast);
        if (returnType === 'LiteralInteger') {
          returnType = 'Number';
        }
        this.onNestedFunction(utils.getAstString(this.source, ast), returnType);
      }
      return retArr;
    }
    astFunctionExpression(ast, retArr) {
      return retArr;
    }
    astReturnStatement(ast, retArr) {
      return retArr;
    }
    astLiteral(ast, retArr) {
      return retArr;
    }
    astBinaryExpression(ast, retArr) {
      return retArr;
    }
    astIdentifierExpression(ast, retArr) {
      return retArr;
    }
    astAssignmentExpression(ast, retArr) {
      return retArr;
    }
    astExpressionStatement(esNode, retArr) {
      this.astGeneric(esNode.expression, retArr);
      retArr.push(';');
      return retArr;
    }
    astEmptyStatement(eNode, retArr) {
      return retArr;
    }
    astBlockStatement(ast, retArr) {
      return retArr;
    }
    astIfStatement(ast, retArr) {
      return retArr;
    }
    astBreakStatement(brNode, retArr) {
      retArr.push('break;');
      return retArr;
    }
    astContinueStatement(crNode, retArr) {
      retArr.push('continue;\n');
      return retArr;
    }
    astForStatement(ast, retArr) {
      return retArr;
    }
    astWhileStatement(ast, retArr) {
      return retArr;
    }
    astDoWhileStatement(ast, retArr) {
      return retArr;
    }
    astVariableDeclaration(varDecNode, retArr) {
      const declarations = varDecNode.declarations;
      if (!declarations || !declarations[0] || !declarations[0].init) {
        throw this.astErrorOutput('Unexpected expression', varDecNode);
      }
      const result = [];
      const firstDeclaration = declarations[0];
      const init = firstDeclaration.init;
      let type = this.isState('in-for-loop-init') ? 'Integer' : this.getType(init);
      if (type === 'LiteralInteger') {
        type = 'Number';
      }
      const markupType = typeMap[type];
      if (!markupType) {
        throw this.astErrorOutput(`Markup type ${ markupType } not handled`, varDecNode);
      }
      let dependencies = this.getDependencies(firstDeclaration.init);
      this.declarations[firstDeclaration.id.name] = Object.freeze({
        type,
        dependencies,
        isSafe: dependencies.every(dependency => dependency.isSafe)
      });
      const initResult = [`${type} user_${firstDeclaration.id.name}=`];
      this.astGeneric(init, initResult);
      result.push(initResult.join(''));
  
      for (let i = 1; i < declarations.length; i++) {
        const declaration = declarations[i];
        dependencies = this.getDependencies(declaration);
        this.declarations[declaration.id.name] = Object.freeze({
          type,
          dependencies,
          isSafe: false
        });
        this.astGeneric(declaration, result);
      }
  
      retArr.push(retArr, result.join(','));
      retArr.push(';');
      return retArr;
    }
    astVariableDeclarator(iVarDecNode, retArr) {
      this.astGeneric(iVarDecNode.id, retArr);
      if (iVarDecNode.init !== null) {
        retArr.push('=');
        this.astGeneric(iVarDecNode.init, retArr);
      }
      return retArr;
    }
    astThisExpression(ast, retArr) {
      return retArr;
    }
    astSequenceExpression(sNode, retArr) {
      for (let i = 0; i < sNode.expressions.length; i++) {
        if (i > 0) {
          retArr.push(',');
        }
        this.astGeneric(sNode.expressions, retArr);
      }
      return retArr;
    }
    astUnaryExpression(uNode, retArr) {
      if (uNode.prefix) {
        retArr.push(uNode.operator);
        this.astGeneric(uNode.argument, retArr);
      } else {
        this.astGeneric(uNode.argument, retArr);
        retArr.push(uNode.operator);
      }
  
      return retArr;
    }
    astUpdateExpression(uNode, retArr) {
      if (uNode.prefix) {
        retArr.push(uNode.operator);
        this.astGeneric(uNode.argument, retArr);
      } else {
        this.astGeneric(uNode.argument, retArr);
        retArr.push(uNode.operator);
      }
  
      return retArr;
    }
    astLogicalExpression(logNode, retArr) {
      retArr.push('(');
      this.astGeneric(logNode.left, retArr);
      retArr.push(logNode.operator);
      this.astGeneric(logNode.right, retArr);
      retArr.push(')');
      return retArr;
    }
    astMemberExpression(ast, retArr) {
      return retArr;
    }
    astCallExpression(ast, retArr) {
      return retArr;
    }
    astArrayExpression(ast, retArr) {
      return retArr;
    }
  
    getMemberExpressionDetails(ast) {
      if (ast.type !== 'MemberExpression') {
        throw this.astErrorOutput(`Expression ${ ast.type } not a MemberExpression`, ast);
      }
      let name = null;
      let type = null;
      const variableSignature = this.getVariableSignature(ast);
      switch (variableSignature) {
        case 'value':
          return null;
        case 'this.thread.value':
        case 'this.output.value':
          return {
            signature: variableSignature,
            type: 'Integer',
            name: ast.property.name
          };
        case 'value[]':
          if (typeof ast.object.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.name;
          return {
            name,
            origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(name),
            xProperty: ast.property
          };
        case 'value[][]':
          if (typeof ast.object.object.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.object.name;
          return {
            name,
            origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(name),
            yProperty: ast.object.property,
            xProperty: ast.property,
          };
        case 'value[][][]':
          if (typeof ast.object.object.object.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.object.object.name;
          return {
            name,
            origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(name),
            zProperty: ast.object.object.property,
            yProperty: ast.object.property,
            xProperty: ast.property,
          };
        case 'value.value':
          if (typeof ast.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          if (this.isAstMathVariable(ast)) {
            name = ast.property.name;
            return {
              name,
              origin: 'Math',
              type: 'Number',
              signature: variableSignature,
            };
          }
          switch (ast.property.name) {
            case 'r':
            case 'g':
            case 'b':
            case 'a':
              name = ast.object.name;
              return {
                name,
                property: ast.property.name,
                origin: 'user',
                signature: variableSignature,
                type: 'Number'
              };
            default:
              throw this.astErrorOutput('Unexpected expression', ast);
          }
        case 'this.constants.value':
          if (typeof ast.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
            signature: variableSignature,
          };
        case 'this.constants.value[]':
          if (typeof ast.object.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
            signature: variableSignature,
            xProperty: ast.property,
          };
        case 'this.constants.value[][]':
          {
            if (typeof ast.object.object.property.name !== 'string') {
              throw this.astErrorOutput('Unexpected expression', ast);
            }
            name = ast.object.object.property.name;
            type = this.getConstantType(name);
            if (!type) {
              throw this.astErrorOutput('Constant has no type', ast);
            }
            return {
              name,
              type,
              origin: 'constants',
              signature: variableSignature,
              yProperty: ast.object.property,
              xProperty: ast.property,
            };
          }
        case 'this.constants.value[][][]':
          {
            if (typeof ast.object.object.object.property.name !== 'string') {
              throw this.astErrorOutput('Unexpected expression', ast);
            }
            name = ast.object.object.object.property.name;
            type = this.getConstantType(name);
            if (!type) {
              throw this.astErrorOutput('Constant has no type', ast);
            }
            return {
              name,
              type,
              origin: 'constants',
              signature: variableSignature,
              zProperty: ast.object.object.property,
              yProperty: ast.object.property,
              xProperty: ast.property,
            };
          }
        case 'fn()[]':
          return {
            signature: variableSignature,
            property: ast.property
          };
        default:
          throw this.astErrorOutput('Unexpected expression', ast);
      }
    }
  
    getInternalVariableName(name) {
      if (!this._internalVariableNames.hasOwnProperty(name)) {
        this._internalVariableNames[name] = 0;
      }
      this._internalVariableNames[name]++;
      if (this._internalVariableNames[name] === 1) {
        return name;
      }
      return name + this._internalVariableNames[name];
    }
  }
  
  const typeLookupMap = {
    'Array': 'Number',
    'Array(2)': 'Number',
    'Array(3)': 'Number',
    'Array(4)': 'Number',
    'Array2D': 'Number',
    'Array3D': 'Number',
    'HTMLImage': 'Array(4)',
    'HTMLImageArray': 'Array(4)',
    'NumberTexture': 'Number',
    'ArrayTexture(4)': 'Array(4)',
  };
  
  module.exports = {
    FunctionNode
  };
  },{"../utils":29,"acorn":1}],10:[function(require,module,exports){
  const {
    Kernel
  } = require('./kernel');
  
  class GLKernel extends Kernel {
    static get mode() {
      return 'gpu';
    }
  
    static getIsFloatRead() {
      function kernelFunction() {
        return 1;
      }
      const kernel = new this(kernelFunction.toString(), {
        context: this.testContext,
        canvas: this.testCanvas,
        skipValidate: true,
        output: [2],
        floatTextures: true,
        floatOutput: true,
        floatOutputForce: true
      });
      const result = kernel.run();
      kernel.destroy(true);
      return result[0] === 1;
    }
  
    static getIsIntegerDivisionAccurate() {
      function kernelFunction(v1, v2) {
        return v1[this.thread.x] / v2[this.thread.x];
      }
      const kernel = new this(kernelFunction.toString(), {
        context: this.testContext,
        canvas: this.testCanvas,
        skipValidate: true,
        output: [2]
      });
      const result = kernel.run([6, 6030401], [3, 3991]);
      kernel.destroy(true);
      return result[0] === 2 && result[1] === 1511;
    }
  
    static get testCanvas() {
      throw new Error(`"testCanvas" not defined on ${ this.name }`);
    }
  
    static get testContext() {
      throw new Error(`"testContext" not defined on ${ this.name }`);
    }
  
    static get features() {
      throw new Error(`"features" not defined on ${ this.name }`);
    }
  
    static setupFeatureChecks() {
      throw new Error(`"setupFeatureChecks" not defined on ${ this.name }`);
    }
  
    setFixIntegerDivisionAccuracy(fix) {
      this.fixIntegerDivisionAccuracy = fix;
      return this;
    }
  
    setFloatOutput(flag) {
      this.floatOutput = flag;
      return this;
    }
  
    setFloatOutputForce(flag) {
      this.floatOutputForce = flag;
      return this;
    }
  
    setFloatTextures(flag) {
      this.floatTextures = flag;
      return this;
    }
  
    constructor(source, settings) {
      super(source, settings);
      this.texSize = null;
      this.floatTextures = null;
      this.floatOutput = null;
      this.floatOutputForce = null;
      this.fixIntegerDivisionAccuracy = null;
    }
  }
  
  module.exports = {
    GLKernel
  };
  },{"./kernel":12}],11:[function(require,module,exports){
  const getContext = require('gl');
  const {
    WebGLKernel
  } = require('../web-gl/kernel');
  
  let isSupported = null;
  let testCanvas = null;
  let testContext = null;
  let testExtensions = null;
  let features = null;
  
  class HeadlessGLKernel extends WebGLKernel {
    static get isSupported() {
      if (isSupported !== null) return isSupported;
      this.setupFeatureChecks();
      isSupported = testContext !== null;
      return isSupported;
    }
  
    static setupFeatureChecks() {
      testCanvas = null;
      testExtensions = null;
      if (typeof getContext !== 'function') return;
      testContext = getContext(2, 2, {
        preserveDrawingBuffer: true
      });
      testExtensions = {
        STACKGL_resize_drawingbuffer: testContext.getExtension('STACKGL_resize_drawingbuffer'),
        STACKGL_destroy_context: testContext.getExtension('STACKGL_destroy_context'),
        OES_texture_float: testContext.getExtension('OES_texture_float'),
        OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
        OES_element_index_uint: testContext.getExtension('OES_element_index_uint'),
      };
      features = this.getFeatures();
    }
  
    static isContextMatch(context) {
      try {
        return context.getParameter(context.RENDERER) === 'ANGLE';
      } catch (e) {
        return false;
      }
    }
  
    static getFeatures() {
      const isDrawBuffers = this.getIsDrawBuffers();
      return Object.freeze({
        isFloatRead: this.getIsFloatRead(),
        isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(),
        getIsTextureFloat: true,
        isDrawBuffers,
        kernelMap: isDrawBuffers
      });
    }
  
    static getIsDrawBuffers() {
      return Boolean(testExtensions.WEBGL_draw_buffers);
    }
  
    static get testCanvas() {
      return testCanvas;
    }
  
    static get testContext() {
      return testContext;
    }
  
    static get features() {
      return features;
    }
  
    initCanvas() {
      return {};
    }
  
    initContext() {
      const context = getContext(2, 2, {
        preserveDrawingBuffer: true
      });
      return context;
    }
  
    initExtensions() {
      this.extensions = {
        STACKGL_resize_drawingbuffer: this.context.getExtension('STACKGL_resize_drawingbuffer'),
        STACKGL_destroy_context: this.context.getExtension('STACKGL_destroy_context'),
        OES_texture_float: this.context.getExtension('OES_texture_float'),
        OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
        OES_element_index_uint: this.context.getExtension('OES_element_index_uint'),
      };
    }
  
    destroyExtensions() {
      this.extensions.STACKGL_resize_drawingbuffer = null;
      this.extensions.STACKGL_destroy_context = null;
      this.extensions.OES_texture_float = null;
      this.extensions.OES_texture_float_linear = null;
      this.extensions.OES_element_index_uint = null;
    }
  
    static destroyContext(context) {
      const extension = context.getExtension('STACKGL_destroy_context');
      if (extension && extension.destroy) {
        extension.destroy();
      }
    }
  }
  
  module.exports = {
    HeadlessGLKernel
  };
  },{"../web-gl/kernel":16,"gl":2}],12:[function(require,module,exports){
  const {
    utils
  } = require('../utils');
  const {
    Input
  } = require('../input');
  
  class Kernel {
    static get isSupported() {
      throw new Error(`"isSupported" not implemented on ${ this.name }`);
    }
  
    static isContextMatch(context) {
      throw new Error(`"isContextMatch" not implemented on ${ this.name }`);
    }
  
    static getFeatures() {
      throw new Error(`"getFeatures" not implemented on ${ this.name }`);
    }
  
    static destroyContext(context) {
      throw new Error(`"destroyContext" called on ${ this.name }`);
    }
  
    constructor(source, settings) {
      if (typeof source !== 'object') {
        if (typeof source !== 'string') {
          throw new Error('source not a string');
        }
        if (!utils.isFunctionString(source)) {
          throw new Error('source not a function string');
        }
      }
  
      this.argumentNames = typeof source === 'string' ? utils.getArgumentNamesFromString(source) : null;
      this.argumentTypes = null;
      this.argumentSizes = null;
  
      this.source = source;
  
      this.output = null;
  
      this.debug = false;
  
      this.graphical = false;
  
      this.loopMaxIterations = 0;
  
      this.constants = null;
      this.constantTypes = null;
      this.hardcodeConstants = null;
  
      this.canvas = null;
  
      this.context = null;
  
      this.functions = null;
  
      this.nativeFunctions = null;
  
      this.subKernels = null;
  
      this.skipValidate = false;
      this.wraparound = null;
  
      this.immutable = false;
  
      this.pipeline = false;
  
      this.plugins = null;
    }
  
    mergeSettings(settings) {
      for (let p in settings) {
        if (!settings.hasOwnProperty(p) || !this.hasOwnProperty(p)) continue;
        this[p] = settings[p];
      }
      if (settings.hasOwnProperty('output') && !Array.isArray(settings.output)) {
        this.setOutput(settings.output); 
      }
      if (!this.canvas) this.canvas = this.initCanvas();
      if (!this.context) this.context = this.initContext();
      if (!this.plugins) this.plugins = this.initPlugins(settings);
    }
    build() {
      throw new Error(`"build" not defined on ${ this.constructor.name }`);
    }
  
    run() {
      throw new Error(`"run" not defined on ${ this.constructor.name }`)
    }
  
    initCanvas() {
      throw new Error(`"initCanvas" not defined on ${ this.constructor.name }`);
    }
  
    initContext() {
      throw new Error(`"initContext" not defined on ${ this.constructor.name }`);
    }
  
    initPlugins(settings) {
      throw new Error(`"initPlugins" not defined on ${ this.constructor.name }`);
    }
  
    setupArguments(args) {
      this.argumentTypes = [];
      this.argumentSizes = [];
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const argType = utils.getVariableType(arg);
        this.argumentTypes.push(argType === 'Integer' ? 'Number' : argType);
        this.argumentSizes.push(arg.constructor === Input ? arg.size : null);
      }
  
      if (this.argumentNames.length !== args.length) {
        throw new Error(`arguments are miss-aligned`);
      }
    }
  
    setupConstants() {
      this.constantTypes = {};
      if (this.constants) {
        for (let p in this.constants) {
          this.constantTypes[p] = utils.getVariableType(this.constants[p]);
        }
      }
    }
  
    setOutput(output) {
      if (output.hasOwnProperty('x')) {
        if (output.hasOwnProperty('y')) {
          if (output.hasOwnProperty('z')) {
            this.output = [output.x, output.y, output.z];
          } else {
            this.output = [output.x, output.y];
          }
        } else {
          this.output = [output.x];
        }
      } else {
        this.output = output;
      }
      return this;
    }
  
    setDebug(flag) {
      this.debug = flag;
      return this;
    }
  
    setGraphical(flag) {
      this.graphical = flag;
      return this;
    }
  
    setLoopMaxIterations(max) {
      this.loopMaxIterations = max;
      return this;
    }
  
    setConstants(constants) {
      this.constants = constants;
      return this;
    }
  
    setPipeline(flag) {
      this.pipeline = flag;
      return this;
    }
  
    setImmutable(flag) {
      this.immutable = flag;
      return this;
    }
  
    setCanvas(canvas) {
      this.canvas = canvas;
      return this;
    }
  
    setContext(context) {
      this.context = context;
      return this;
    }
  
    setArgumentTypes(argumentTypes) {
      this.argumentTypes = argumentTypes;
      return this;
    }
  
    validateSettings() {
      throw new Error(`"validateSettings" not defined on ${ this.constructor.name }`);
    }
  
    exec() {
      const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
      return new Promise((accept, reject) => {
        try {
          accept(this.run.apply(this, args));
        } catch (e) {
          reject(e);
        }
      });
    }
  
    addSubKernel(subKernel) {
      if (this.subKernels === null) {
        this.subKernels = [];
      }
      if (!subKernel.source) throw new Error('subKernel missing "source" property');
      if (!subKernel.property && isNaN(subKernel.property)) throw new Error('subKernel missing "property" property');
      if (!subKernel.name) throw new Error('subKernel missing "name" property');
      this.subKernels.push(subKernel);
      return this;
    }
  
    destroy(removeCanvasReferences) {
      throw new Error(`"destroy" called on ${ this.constructor.name }`);
    }
  
    checkOutput() {
      if (!this.output || !Array.isArray(this.output)) throw new Error('kernel.output not an array');
      if (this.output.length < 1) throw new Error('kernel.output is empty, needs at least 1 value');
      for (let i = 0; i < this.output.length; i++) {
        if (isNaN(this.output[i]) || this.output[i] < 1) {
          throw new Error(`${ this.constructor.name }.output[${ i }] incorrectly defined as \`${ this.output[i] }\`, needs to be numeric, and greater than 0`);
        }
      }
    }
  
    toJSON() {
      const settings = {
        output: this.output,
        threadDim: this.threadDim,
        pipeline: this.pipeline,
        argumentNames: this.argumentNames,
        argumentsTypes: this.argumentTypes,
        argumentsLength: this.argumentsLength,
        constants: this.constants,
        constantsLength: this.constantsLength,
        pluginNames: this.plugins ? this.plugins.map(plugin => plugin.name) : null,
      };
      return {
        settings
      };
    }
  }
  
  module.exports = {
    Kernel
  };
  },{"../input":25,"../utils":29}],13:[function(require,module,exports){
  const fragmentShader = `__HEADER__;
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  
  const int LOOP_MAX = __LOOP_MAX__;
  
  __PLUGINS__;
  __CONSTANTS__;
  
  varying vec2 vTexCoord;
  
  vec4 round(vec4 x) {
    return floor(x + 0.5);
  }
  
  float round(float x) {
    return floor(x + 0.5);
  }
  
  vec2 integerMod(vec2 x, float y) {
    vec2 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  vec3 integerMod(vec3 x, float y) {
    vec3 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  vec4 integerMod(vec4 x, vec4 y) {
    vec4 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  float integerMod(float x, float y) {
    float res = floor(mod(x, y));
    return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
  }
  
  int integerMod(int x, int y) {
    return x - (y * int(x / y));
  }
  
  __DIVIDE_WITH_INTEGER_CHECK__;
  
  // Here be dragons!
  // DO NOT OPTIMIZE THIS CODE
  // YOU WILL BREAK SOMETHING ON SOMEBODY\'S MACHINE
  // LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
  const vec2 MAGIC_VEC = vec2(1.0, -256.0);
  const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
  const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
  float decode32(vec4 rgba) {
    __DECODE32_ENDIANNESS__;
    rgba *= 255.0;
    vec2 gte128;
    gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;
    gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;
    float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);
    float res = exp2(round(exponent));
    rgba.b = rgba.b - 128.0 * gte128.x;
    res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;
    res *= gte128.y * -2.0 + 1.0;
    return res;
  }
  
  vec4 encode32(float f) {
    float F = abs(f);
    float sign = f < 0.0 ? 1.0 : 0.0;
    float exponent = floor(log2(F));
    float mantissa = (exp2(-exponent) * F);
    // exponent += floor(log2(mantissa));
    vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
    rgba.rg = integerMod(rgba.rg, 256.0);
    rgba.b = integerMod(rgba.b, 128.0);
    rgba.a = exponent*0.5 + 63.5;
    rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
    rgba = floor(rgba);
    rgba *= 0.003921569; // 1/255
    __ENCODE32_ENDIANNESS__;
    return rgba;
  }
  // Dragons end here
  
  float decode(vec4 rgba, int x, int bitRatio) {
    if (bitRatio == 1) {
      return decode32(rgba);
    }
    __DECODE32_ENDIANNESS__;
    int channel = integerMod(x, bitRatio);
    if (bitRatio == 4) {
      if (channel == 0) return rgba.r * 255.0;
      if (channel == 1) return rgba.g * 255.0;
      if (channel == 2) return rgba.b * 255.0;
      if (channel == 3) return rgba.a * 255.0;
    }
    else {
      if (channel == 0) return rgba.r * 255.0 + rgba.g * 65280.0;
      if (channel == 1) return rgba.b * 255.0 + rgba.a * 65280.0;
    }
  }
  
  int index;
  ivec3 threadId;
  
  ivec3 indexTo3D(int idx, ivec3 texDim) {
    int z = int(idx / (texDim.x * texDim.y));
    idx -= z * int(texDim.x * texDim.y);
    int y = int(idx / texDim.x);
    int x = int(integerMod(idx, texDim.x));
    return ivec3(x, y, z);
  }
  
  float get(sampler2D tex, ivec2 texSize, ivec3 texDim, int bitRatio, int z, int y, int x) {
    ivec3 xyz = ivec3(x, y, z);
    __GET_WRAPAROUND__;
    int index = xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z);
    __GET_TEXTURE_CHANNEL__;
    int w = texSize.x;
    vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
    __GET_TEXTURE_INDEX__;
    vec4 texel = texture2D(tex, st / vec2(texSize));
    __GET_RESULT__;
  }
  
  vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
    ivec3 xyz = ivec3(x, y, z);
    __GET_WRAPAROUND__;
    int index = xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z);
    __GET_TEXTURE_CHANNEL__;
    int w = texSize.x;
    vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
    __GET_TEXTURE_INDEX__;
    return texture2D(tex, st / vec2(texSize));
  }
  
  vec4 actualColor;
  void color(float r, float g, float b, float a) {
    actualColor = vec4(r,g,b,a);
  }
  
  void color(float r, float g, float b) {
    color(r,g,b,1.0);
  }
  
  void color(sampler2D image) {
    actualColor = texture2D(image, vTexCoord);
  }
  
  __MAIN_CONSTANTS__;
  __MAIN_ARGUMENTS__;
  __KERNEL__;
  
  void main(void) {
    index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
    __MAIN_RESULT__;
  }`;
  
  module.exports = {
    fragmentShader
  };
  },{}],14:[function(require,module,exports){
  const {
    FunctionNode
  } = require('../function-node');
  const jsMathPrefix = 'Math.';
  const localPrefix = 'this.';
  
  class WebGLFunctionNode extends FunctionNode {
    constructor(source, settings) {
      super(source, settings);
      this.fixIntegerDivisionAccuracy = null;
      if (settings && settings.hasOwnProperty('fixIntegerDivisionAccuracy')) {
        this.fixIntegerDivisionAccuracy = settings.fixIntegerDivisionAccuracy;
      }
    }
  
    astFunctionExpression(ast, retArr) {
  
      if (this.isRootKernel) {
        retArr.push('void');
      } else {
        const {
          returnType
        } = this;
        const type = typeMap[returnType];
        if (!type) {
          throw new Error(`unknown type ${ returnType }`);
        }
        retArr.push(type);
      }
      retArr.push(' ');
      retArr.push(this.name);
      retArr.push('(');
  
      if (!this.isRootKernel) {
        for (let i = 0; i < this.argumentNames.length; ++i) {
          const argumentName = this.argumentNames[i];
  
          if (i > 0) {
            retArr.push(', ');
          }
          let argumentType = this.getVariableType(argumentName);
          if (!argumentType || argumentType === 'LiteralInteger') {
            argumentType = 'Number';
          }
          const type = typeMap[argumentType];
          if (!type) {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          retArr.push(type);
          retArr.push(' ');
          retArr.push('user_');
          retArr.push(argumentName);
        }
      }
  
      retArr.push(') {\n');
  
      for (let i = 0; i < ast.body.body.length; ++i) {
        this.astGeneric(ast.body.body[i], retArr);
        retArr.push('\n');
      }
  
      retArr.push('}\n');
      return retArr;
    }
  
    astReturnStatement(ast, retArr) {
      if (!ast.argument) throw this.astErrorOutput('Unexpected return statement', ast);
      const type = this.getType(ast.argument);
  
      const result = [];
  
      switch (this.returnType) {
        case 'Number':
        case 'Float':
          switch (type) {
            case 'Integer':
              result.push('float(');
              this.astGeneric(ast.argument, result);
              result.push(')');
              break;
            case 'LiteralInteger':
              this.pushState('casting-to-float');
              this.astGeneric(ast.argument, result);
              this.popState('casting-to-float');
              break;
            default:
              this.astGeneric(ast.argument, result);
          }
          break;
        case 'Integer':
          switch (type) {
            case 'Number':
              this.pushState('casting-to-integer');
              result.push('int(');
              this.astGeneric(ast.argument, result);
              result.push(')');
              this.popState('casting-to-integer');
              break;
            case 'LiteralInteger':
              this.pushState('casting-to-integer');
              this.astGeneric(ast.argument, result);
              this.popState('casting-to-integer');
              break;
            default:
              this.astGeneric(ast.argument, result);
          }
          break;
        case 'Array(4)':
        case 'Array(3)':
        case 'Array(2)':
          this.astGeneric(ast.argument, result);
          break;
        default:
          throw this.astErrorOutput('Unknown return handler', ast);
      }
  
      if (this.isRootKernel) {
        retArr.push(`kernelResult = ${ result.join('') };`);
        retArr.push('return;');
      } else if (this.isSubKernel) {
        retArr.push(`subKernelResult_${ this.name } = ${ result.join('') };`);
        retArr.push(`return subKernelResult_${ this.name };`);
      } else {
        retArr.push(`return ${ result.join('') };`);
      }
      return retArr;
    }
  
    astLiteral(ast, retArr) {
  
      if (isNaN(ast.value)) {
        throw this.astErrorOutput(
          'Non-numeric literal not supported : ' + ast.value,
          ast
        );
      }
  
      if (Number.isInteger(ast.value)) {
        if (this.isState('in-for-loop-init') || this.isState('casting-to-integer')) {
          retArr.push(`${ast.value}`);
        } else if (this.isState('casting-to-float')) {
          retArr.push(`${ast.value}.0`);
        } else {
          retArr.push(`${ast.value}.0`);
        }
      } else if (this.isState('casting-to-integer')) {
        retArr.push(parseInt(ast.raw));
      } else {
        retArr.push(`${ast.value}`);
      }
      return retArr;
    }
  
    astBinaryExpression(ast, retArr) {
      if (ast.operator === '%') {
        retArr.push('mod(');
  
        const leftType = this.getType(ast.left);
        if (leftType === 'Integer') {
          retArr.push('float(');
          this.astGeneric(ast.left, retArr);
          retArr.push(')');
        } else if (leftType === 'LiteralInteger') {
          this.pushState('casting-to-float');
          this.astGeneric(ast.left, retArr);
          this.popState('casting-to-float');
        } else {
          this.astGeneric(ast.left, retArr);
        }
  
        retArr.push(',');
        const rightType = this.getType(ast.right);
  
        if (rightType === 'Integer') {
          retArr.push('float(');
          this.astGeneric(ast.right, retArr);
          retArr.push(')');
        } else if (rightType === 'LiteralInteger') {
          this.pushState('casting-to-float');
          this.astGeneric(ast.right, retArr);
          this.popState('casting-to-float');
        } else {
          this.astGeneric(ast.right, retArr);
        }
        retArr.push(')');
        return retArr;
      }
  
      retArr.push('(');
      if (this.fixIntegerDivisionAccuracy && ast.operator === '/') {
        retArr.push('div_with_int_check(');
  
        if (this.getType(ast.left) !== 'Number') {
          retArr.push('int(');
          this.pushState('casting-to-float');
          this.astGeneric(ast.left, retArr);
          this.popState('casting-to-float');
          retArr.push(')');
        } else {
          this.astGeneric(ast.left, retArr);
        }
  
        retArr.push(', ');
  
        if (this.getType(ast.right) !== 'Number') {
          retArr.push('float(');
          this.pushState('casting-to-float');
          this.astGeneric(ast.right, retArr);
          this.popState('casting-to-float');
          retArr.push(')');
        } else {
          this.astGeneric(ast.right, retArr);
        }
        retArr.push(')');
      } else {
        const leftType = this.getType(ast.left) || 'Number';
        const rightType = this.getType(ast.right) || 'Number';
        if (!leftType || !rightType) {
          throw this.astErrorOutput(`Unhandled binary expression`, ast);
        }
        const key = leftType + ' & ' + rightType;
        switch (key) {
          case 'Integer & Integer':
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.astGeneric(ast.right, retArr);
            break;
          case 'Number & Float':
          case 'Float & Number':
          case 'Float & Float':
          case 'Number & Number':
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.astGeneric(ast.right, retArr);
            break;
          case 'LiteralInteger & LiteralInteger':
            this.pushState('casting-to-float');
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.astGeneric(ast.right, retArr);
            this.popState('casting-to-float');
            break;
  
          case 'Integer & Number':
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.pushState('casting-to-integer');
            retArr.push('int(');
            this.astGeneric(ast.right, retArr);
            retArr.push(')');
            this.popState('casting-to-integer');
            break;
          case 'Integer & LiteralInteger':
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.pushState('casting-to-integer');
            this.astGeneric(ast.right, retArr);
            this.popState('casting-to-integer');
            break;
  
          case 'Number & Integer':
            this.astGeneric(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.pushState('casting-to-float');
            retArr.push('float(');
            this.astGeneric(ast.right, retArr);
            retArr.push(')');
            this.popState('casting-to-float');
            break;
          case 'Float & LiteralInteger':
          case 'Number & LiteralInteger':
            if (this.isState('force-integer')) {
              retArr.push('int(');
              this.astGeneric(ast.left, retArr);
              retArr.push(')');
              retArr.push(operatorMap[ast.operator] || ast.operator);
              this.pushState('casting-to-integer');
              this.astGeneric(ast.right, retArr);
              this.popState('casting-to-integer');
            } else {
              this.astGeneric(ast.left, retArr);
              retArr.push(operatorMap[ast.operator] || ast.operator);
              this.pushState('casting-to-float');
              this.astGeneric(ast.right, retArr);
              this.popState('casting-to-float');
            }
            break;
          case 'LiteralInteger & Float':
          case 'LiteralInteger & Number':
            if (this.isState('force-integer') || this.isState('in-for-loop-init')) {
              this.pushState('casting-to-integer');
              this.astGeneric(ast.left, retArr);
              retArr.push(operatorMap[ast.operator] || ast.operator);
              retArr.push('int(');
              this.astGeneric(ast.right, retArr);
              retArr.push(')');
              this.popState('casting-to-integer');
            } else {
              this.astGeneric(ast.left, retArr);
              retArr.push(operatorMap[ast.operator] || ast.operator);
              this.pushState('casting-to-float');
              this.astGeneric(ast.right, retArr);
              this.popState('casting-to-float');
            }
            break;
          case 'LiteralInteger & Integer':
            this.pushState('casting-to-integer');
            this.astGeneric(ast.left, retArr);
            this.popState('casting-to-integer');
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.astGeneric(ast.right, retArr);
            break;
          default:
            throw this.astErrorOutput(`Unhandled binary expression between ${key}`, ast);
        }
      }
  
      retArr.push(')');
      return retArr;
    }
  
    astIdentifierExpression(idtNode, retArr) {
      if (idtNode.type !== 'Identifier') {
        throw this.astErrorOutput(
          'IdentifierExpression - not an Identifier',
          idtNode
        );
      }
  
      if (idtNode.name === 'Infinity') {
        retArr.push('3.402823466e+38');
      } else {
        const userArgumentName = this.getUserArgumentName(idtNode.name);
        if (userArgumentName) {
          retArr.push(`user_${userArgumentName}`);
        } else {
          retArr.push(`user_${idtNode.name}`);
        }
      }
  
      return retArr;
    }
  
    astForStatement(forNode, retArr) {
      if (forNode.type !== 'ForStatement') {
        throw this.astErrorOutput('Invalid for statement', forNode);
      }
  
      const initArr = [];
      const testArr = [];
      const updateArr = [];
      const bodyArr = [];
      let isSafe = null;
  
      if (forNode.init) {
        this.pushState('in-for-loop-init');
        this.astGeneric(forNode.init, initArr);
        for (let i = 0; i < initArr.length; i++) {
          if (initArr[i].includes && initArr[i].includes(',')) {
            isSafe = false;
          }
        }
        this.popState('in-for-loop-init');
      } else {
        isSafe = false;
      }
  
      if (forNode.test) {
        this.pushState('force-integer');
        this.astGeneric(forNode.test, testArr);
        this.popState('force-integer');
      } else {
        isSafe = false;
      }
  
      if (forNode.update) {
        this.astGeneric(forNode.update, updateArr);
      } else {
        isSafe = false;
      }
  
      if (forNode.body) {
        this.pushState('loop-body');
        this.astGeneric(forNode.body, bodyArr);
        this.popState('loop-body');
      }
  
      if (isSafe === null) {
        isSafe = this.isSafe(forNode.init) && this.isSafe(forNode.test);
      }
  
      if (isSafe) {
        retArr.push(`for (${initArr.join('')};${testArr.join('')};${updateArr.join('')}){\n`);
        retArr.push(bodyArr.join(''));
        retArr.push('}\n');
      } else {
        const iVariableName = this.getInternalVariableName('safeI');
        if (initArr.length > 0) {
          retArr.push(initArr.join(''), ';\n');
        }
        retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
        if (testArr.length > 0) {
          retArr.push(`if (!${testArr.join('')}) break;\n`);
        }
        retArr.push(bodyArr.join(''));
        retArr.push(`\n${updateArr.join('')};`);
        retArr.push('}\n');
      }
      return retArr;
    }
  
    astWhileStatement(whileNode, retArr) {
      if (whileNode.type !== 'WhileStatement') {
        throw this.astErrorOutput('Invalid while statement', whileNode);
      }
  
      const iVariableName = this.getInternalVariableName('safeI');
      retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
      retArr.push('if (!');
      this.astGeneric(whileNode.test, retArr);
      retArr.push(') break;\n');
      this.astGeneric(whileNode.body, retArr);
      retArr.push('}\n');
  
      return retArr;
    }
  
    astDoWhileStatement(doWhileNode, retArr) {
      if (doWhileNode.type !== 'DoWhileStatement') {
        throw this.astErrorOutput('Invalid while statement', doWhileNode);
      }
  
      const iVariableName = this.getInternalVariableName('safeI');
      retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
      this.astGeneric(doWhileNode.body, retArr);
      retArr.push('if (!');
      this.astGeneric(doWhileNode.test, retArr);
      retArr.push(') break;\n');
      retArr.push('}\n');
  
      return retArr;
    }
  
  
    astAssignmentExpression(assNode, retArr) {
      if (assNode.operator === '%=') {
        this.astGeneric(assNode.left, retArr);
        retArr.push('=');
        retArr.push('mod(');
        this.astGeneric(assNode.left, retArr);
        retArr.push(',');
        this.astGeneric(assNode.right, retArr);
        retArr.push(')');
      } else {
        const leftType = this.getType(assNode.left);
        const rightType = this.getType(assNode.right);
        this.astGeneric(assNode.left, retArr);
        retArr.push(assNode.operator);
        if (leftType !== 'Integer' && rightType === 'Integer') {
          retArr.push('float(');
          this.astGeneric(assNode.right, retArr);
          retArr.push(')');
        } else {
          this.astGeneric(assNode.right, retArr);
        }
        return retArr;
      }
    }
  
    astBlockStatement(bNode, retArr) {
      if (!this.isState('loop-body')) {
        retArr.push('{\n');
      }
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      if (!this.isState('loop-body')) {
        retArr.push('}\n');
      }
      return retArr;
    }
  
    astVariableDeclaration(varDecNode, retArr) {
      const declarations = varDecNode.declarations;
      if (!declarations || !declarations[0] || !declarations[0].init) {
        throw this.astErrorOutput('Unexpected expression', varDecNode);
      }
      const result = [];
      const firstDeclaration = declarations[0];
      const init = firstDeclaration.init;
      const actualType = this.getType(init);
      let type = this.isState('in-for-loop-init') ? 'Integer' : actualType;
      if (type === 'LiteralInteger') {
        type = 'Number';
      }
      const markupType = typeMap[type];
      if (!markupType) {
        throw this.astErrorOutput(`Markup type ${ markupType } not handled`, varDecNode);
      }
      let dependencies = this.getDependencies(firstDeclaration.init);
      this.declarations[firstDeclaration.id.name] = Object.freeze({
        type,
        dependencies,
        isSafe: this.isSafeDependencies(dependencies),
      });
      const initResult = [];
      initResult.push([`${markupType} `]);
      initResult.push(`user_${firstDeclaration.id.name}=`);
      if (actualType === 'Number' && type === 'Integer') {
        initResult.push('int(');
        this.astGeneric(init, initResult);
        initResult.push(')');
      } else {
        this.astGeneric(init, initResult);
      }
      result.push(initResult.join(''));
  
      for (let i = 1; i < declarations.length; i++) {
        const declaration = declarations[i];
        dependencies = this.getDependencies(declaration);
        this.declarations[declaration.id.name] = Object.freeze({
          type,
          dependencies: dependencies,
          isSafe: this.isSafeDependencies(dependencies),
        });
        this.astGeneric(declaration, result);
      }
  
      retArr.push(result.join(','));
      if (!this.isState('in-for-loop-init')) {
        retArr.push(';');
      }
      return retArr;
    }
  
    astIfStatement(ifNode, retArr) {
      retArr.push('if (');
      this.astGeneric(ifNode.test, retArr);
      retArr.push(')');
      if (ifNode.consequent.type === 'BlockStatement') {
        this.astGeneric(ifNode.consequent, retArr);
      } else {
        retArr.push(' {\n');
        this.astGeneric(ifNode.consequent, retArr);
        retArr.push('\n}\n');
      }
  
      if (ifNode.alternate) {
        retArr.push('else ');
        if (ifNode.alternate.type === 'BlockStatement') {
          this.astGeneric(ifNode.alternate, retArr);
        } else {
          retArr.push(' {\n');
          this.astGeneric(ifNode.alternate, retArr);
          retArr.push('\n}\n');
        }
      }
      return retArr;
    }
  
    astThisExpression(tNode, retArr) {
      retArr.push('this');
      return retArr;
    }
  
    astMemberExpression(mNode, retArr) {
      const {
        property,
        name,
        signature,
        origin,
        type,
        xProperty,
        yProperty,
        zProperty
      } = this.getMemberExpressionDetails(mNode);
      switch (signature) {
        case 'this.thread.value':
          retArr.push(`threadId.${ name }`);
          return retArr;
        case 'this.output.value':
          switch (name) {
            case 'x':
              retArr.push(this.output[0]);
              break;
            case 'y':
              retArr.push(this.output[1]);
              break;
            case 'z':
              retArr.push(this.output[2]);
              break;
            default:
              throw this.astErrorOutput('Unexpected expression', mNode);
          }
          return retArr;
        case 'value':
          throw this.astErrorOutput('Unexpected expression', mNode);
        case 'value[]':
        case 'value[][]':
        case 'value[][][]':
        case 'value.value':
          if (origin === 'Math') {
            retArr.push(Math[name]);
            return retArr;
          }
          switch (property) {
            case 'r':
              retArr.push(`user_${ name }.r`);
              return retArr;
            case 'g':
              retArr.push(`user_${ name }.g`);
              return retArr;
            case 'b':
              retArr.push(`user_${ name }.b`);
              return retArr;
            case 'a':
              retArr.push(`user_${ name }.a`);
              return retArr;
          }
          break;
        case 'this.constants.value':
        case 'this.constants.value[]':
        case 'this.constants.value[][]':
        case 'this.constants.value[][][]':
          break;
        case 'fn()[]':
          this.astCallExpression(mNode.object, retArr);
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(property));
          retArr.push(']');
          return retArr;
        default:
          throw this.astErrorOutput('Unexpected expression', mNode);
      }
  
      if (type === 'Number' || type === 'Integer') {
        retArr.push(`${ origin }_${ name}`);
        return retArr;
      }
  
      let synonymName;
      if (this.parent) {
        synonymName = this.getUserArgumentName(name);
      }
  
      const markupName = `${origin}_${synonymName || name}`;
  
      switch (type) {
        case 'Array(2)':
        case 'Array(3)':
        case 'Array(4)':
          this.astGeneric(mNode.object, retArr);
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(xProperty));
          retArr.push(']');
          break;
        case 'HTMLImageArray':
          retArr.push(`getImage3D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
          this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
          retArr.push(')');
          break;
        case 'ArrayTexture(4)':
        case 'HTMLImage':
          retArr.push(`getImage2D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
          this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
          retArr.push(')');
          break;
        default:
          retArr.push(`get(${ markupName }, ${ markupName }Size, ${ markupName }Dim, ${ markupName }BitRatio, `);
          this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
          retArr.push(')');
          break;
      }
      return retArr;
    }
  
    astCallExpression(ast, retArr) {
      if (ast.callee) {
        let funcName = this.astMemberExpressionUnroll(ast.callee);
  
        if (funcName.indexOf(jsMathPrefix) === 0) {
          funcName = funcName.slice(jsMathPrefix.length);
        }
  
        if (funcName.indexOf(localPrefix) === 0) {
          funcName = funcName.slice(localPrefix.length);
        }
  
        if (funcName === 'atan2') {
          funcName = 'atan';
        }
  
        if (this.calledFunctions.indexOf(funcName) < 0) {
          this.calledFunctions.push(funcName);
        }
        if (!this.calledFunctionsArguments[funcName]) {
          this.calledFunctionsArguments[funcName] = [];
        }
  
        const functionArguments = [];
        this.calledFunctionsArguments[funcName].push(functionArguments);
  
        if (funcName === 'random' && this.plugins) {
          for (let i = 0; i < this.plugins.length; i++) {
            const plugin = this.plugins[i];
            if (plugin.functionMatch === 'Math.random()' && plugin.functionReplace) {
              functionArguments.push(plugin.functionReturnType);
              retArr.push(plugin.functionReplace);
            }
          }
          return retArr;
        }
  
        retArr.push(funcName);
  
        retArr.push('(');
  
        for (let i = 0; i < ast.arguments.length; ++i) {
          const argument = ast.arguments[i];
          if (i > 0) {
            retArr.push(', ');
          }
          this.astGeneric(argument, retArr);
          const argumentType = this.getType(argument);
          if (argumentType) {
            functionArguments.push({
              name: argument.name || null,
              type: argumentType
            });
          } else {
            functionArguments.push(null);
          }
        }
  
        retArr.push(')');
  
        return retArr;
      }
  
      throw this.astErrorOutput(
        'Unknown CallExpression',
        ast
      );
    }
  
    astArrayExpression(arrNode, retArr) {
      const arrLen = arrNode.elements.length;
  
      retArr.push('vec' + arrLen + '(');
      for (let i = 0; i < arrLen; ++i) {
        if (i > 0) {
          retArr.push(', ');
        }
        const subNode = arrNode.elements[i];
        this.astGeneric(subNode, retArr)
      }
      retArr.push(')');
  
      return retArr;
    }
  
    memberExpressionXYZ(x, y, z, retArr) {
      if (z) {
        retArr.push(this.memberExpressionPropertyMarkup(z), ', ');
      } else {
        retArr.push('0, ');
      }
      if (y) {
        retArr.push(this.memberExpressionPropertyMarkup(y), ', ');
      } else {
        retArr.push('0, ');
      }
      retArr.push(this.memberExpressionPropertyMarkup(x));
      return retArr;
    }
  
    memberExpressionPropertyMarkup(property) {
      if (!property) {
        throw new Error('Property not set');
      }
      const type = this.getType(property);
      const result = [];
      if (type === 'Number') {
        this.pushState('casting-to-integer');
        result.push('int(');
        this.astGeneric(property, result);
        result.push(')');
        this.popState('casting-to-integer');
      } else if (type === 'LiteralInteger') {
        this.pushState('casting-to-integer');
        this.astGeneric(property, result);
        this.popState('casting-to-integer');
      } else {
        this.astGeneric(property, result);
      }
      return result.join('');
    }
  }
  
  const typeMap = {
    'Array': 'sampler2D',
    'Array(2)': 'vec2',
    'Array(3)': 'vec3',
    'Array(4)': 'vec4',
    'Array2D': 'sampler2D',
    'Array3D': 'sampler2D',
    'Float': 'float',
    'Input': 'sampler2D',
    'Integer': 'int',
    'Number': 'float',
    'NumberTexture': 'sampler2D',
    'ArrayTexture(4)': 'sampler2D'
  };
  
  const operatorMap = {
    '===': '==',
    '!==': '!='
  };
  
  module.exports = {
    WebGLFunctionNode
  };
  },{"../function-node":9}],15:[function(require,module,exports){
  const {
    utils
  } = require('../../utils');
  const {
    kernelRunShortcut
  } = require('../../kernel-run-shortcut');
  
  function removeFnNoise(fn) {
    if (/^function /.test(fn)) {
      fn = fn.substring(9);
    }
    return fn.replace(/[_]typeof/g, 'typeof');
  }
  
  function removeNoise(str) {
    return str
      .replace(/^[A-Za-z23]+/, 'function')
      .replace(/[_]typeof/g, 'typeof');
  }
  
  function boolToString(value) {
    if (value) {
      return 'true';
    } else if (value === false) {
      return 'false';
    }
    return 'null';
  }
  
  function webGLKernelString(gpuKernel, name) {
    return `() => {
      ${ kernelRunShortcut.toString() };
      const utils = {
        allPropertiesOf: ${ removeNoise(utils.allPropertiesOf.toString()) },
        clone: ${ removeNoise(utils.clone.toString()) },
        splitArray: ${ removeNoise(utils.splitArray.toString()) },
        getVariableType: ${ removeNoise(utils.getVariableType.toString()) },
        getDimensions: ${ removeNoise(utils.getDimensions.toString()) },
        dimToTexSize: ${ removeNoise(utils.dimToTexSize.toString()) },
        flattenTo: ${ removeNoise(utils.flattenTo.toString()) },
        flatten2dArrayTo: ${ removeNoise(utils.flatten2dArrayTo.toString()) },
        flatten3dArrayTo: ${ removeNoise(utils.flatten3dArrayTo.toString()) },
        systemEndianness: ${ removeNoise(utils.getSystemEndianness.toString()) },
        isArray: ${ removeNoise(utils.isArray.toString()) }
      };
      const canvases = [];
      const maxTexSizes = {};
      let Texture = function() {};
      let Input = function() {}; 
      class ${ name || 'Kernel' } {
        constructor() {
          this.maxTexSize = null;
          this.argumentsLength = 0;
          this.constantsLength = 0;
          this.canvas = null;
          this.context = null;
          this.program = null;
          this.subKernels = null;
          this.subKernelNames = null;
          this.wraparound = null;
          this.drawBuffersMap = ${ gpuKernel.drawBuffersMap ? JSON.stringify(gpuKernel.drawBuffersMap) : 'null' };
          this.endianness = '${ gpuKernel.endianness }';
          this.graphical = ${ boolToString(gpuKernel.graphical) };
          this.floatTextures = ${ boolToString(gpuKernel.floatTextures) };
          this.floatOutput = ${ boolToString(gpuKernel.floatOutput) };
          this.floatOutputForce = ${ boolToString(gpuKernel.floatOutputForce) };
          this.hardcodeConstants = ${ boolToString(gpuKernel.hardcodeConstants) };
          this.pipeline = ${ boolToString(gpuKernel.pipeline) };
          this.argumentNames = ${ JSON.stringify(gpuKernel.argumentNames) };
          this.argumentTypes = ${ JSON.stringify(gpuKernel.argumentTypes) };
          this.texSize = ${ JSON.stringify(gpuKernel.texSize) };
          this.output = ${ JSON.stringify(gpuKernel.output) };
          this.compiledFragmentShader = \`${ gpuKernel.compiledFragmentShader }\`;
          this.compiledVertexShader = \`${ gpuKernel.compiledVertexShader }\`;
          this.programUniformLocationCache = {};
          this.textureCache = {};
          this.subKernelOutputTextures = null;
          this.extensions = {};
          this.uniform1fCache = {};
          this.uniform1iCache = {};
          this.uniform2fCache = {};
          this.uniform2fvCache = {};
          this.uniform2ivCache = {};
          this.uniform3fvCache = {};
          this.uniform3ivCache = {};
        }
        getFragmentShader() { return this.compiledFragmentShader; }
        getVertexShader() { return this.compiledVertexShader; }
        validateSettings() {}
        initExtensions() {}
        setupArguments() {}
        setupConstants() {}
        setCanvas(canvas) { this.canvas = canvas; return this; }
        setContext(context) { this.context = context; return this; }
        setTexture(Type) { Texture = Type; }
        setInput(Type) { Input = Type; }
        ${ removeFnNoise(gpuKernel.getUniformLocation.toString()) }
        ${ removeFnNoise(gpuKernel.build.toString()) }
        ${ removeFnNoise(gpuKernel.run.toString()) }
        ${ removeFnNoise(gpuKernel._addArgument.toString()) }
        ${ removeFnNoise(gpuKernel._formatArrayTransfer.toString()) }
        ${ removeFnNoise(gpuKernel.checkOutput.toString()) }
        ${ removeFnNoise(gpuKernel.getArgumentTexture.toString()) }
        ${ removeFnNoise(gpuKernel.getTextureCache.toString()) }
        ${ removeFnNoise(gpuKernel.getOutputTexture.toString()) }
        ${ removeFnNoise(gpuKernel.renderOutput.toString()) }
        ${ removeFnNoise(gpuKernel.updateMaxTexSize.toString()) }
        ${ removeFnNoise(gpuKernel._setupOutputTexture.toString()) }
        ${ removeFnNoise(gpuKernel.detachTextureCache.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform1f.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform1i.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform2f.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform2fv.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform2iv.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform3fv.toString()) }
        ${ removeFnNoise(gpuKernel.setUniform3iv.toString()) }
      };
      return kernelRunShortcut(new ${ name || 'Kernel' }());
    };`;
  }
  
  module.exports = {
    webGLKernelString
  };
  },{"../../kernel-run-shortcut":26,"../../utils":29}],16:[function(require,module,exports){
  const {
    GLKernel
  } = require('../gl-kernel');
  const {
    FunctionBuilder
  } = require('../function-builder');
  const {
    WebGLFunctionNode
  } = require('./function-node');
  const {
    utils
  } = require('../../utils');
  const {
    Texture
  } = require('../../texture');
  const triangleNoise = require('../../plugins/triangle-noise');
  const {
    fragmentShader
  } = require('./fragment-shader');
  const {
    vertexShader
  } = require('./vertex-shader');
  const {
    webGLKernelString
  } = require('./kernel-string');
  
  let isSupported = null;
  let testCanvas = null;
  let testContext = null;
  let testExtensions = null;
  let features = null;
  
  const plugins = [triangleNoise];
  const canvases = [];
  const maxTexSizes = {};
  
  class WebGLKernel extends GLKernel {
    static get isSupported() {
      if (isSupported !== null) {
        return isSupported;
      }
      this.setupFeatureChecks();
      isSupported = this.isContextMatch(testContext);
      return isSupported;
    }
  
    static setupFeatureChecks() {
      if (typeof document !== 'undefined') {
        testCanvas = document.createElement('canvas');
      } else if (typeof OffscreenCanvas !== 'undefined') {
        testCanvas = new OffscreenCanvas(0, 0);
      }
  
      if (testCanvas) {
        testContext = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        testExtensions = {
          OES_texture_float: testContext.getExtension('OES_texture_float'),
          OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
          OES_element_index_uint: testContext.getExtension('OES_element_index_uint'),
          WEBGL_draw_buffers: testContext.getExtension('WEBGL_draw_buffers'),
        };
        features = this.getFeatures();
      }
    }
  
    static isContextMatch(context) {
      if (typeof WebGLRenderingContext !== 'undefined') {
        return context instanceof WebGLRenderingContext;
      }
      return false;
    }
  
    static getFeatures() {
      const isDrawBuffers = this.getIsDrawBuffers();
      return Object.freeze({
        isFloatRead: this.getIsFloatRead(),
        isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(),
        isTextureFloat: this.getIsTextureFloat(),
        isDrawBuffers,
        kernelMap: isDrawBuffers
      });
    }
  
    static getIsTextureFloat() {
      return Boolean(testExtensions.OES_texture_float);
    }
  
    static getIsDrawBuffers() {
      return Boolean(testExtensions.WEBGL_draw_buffers);
    }
  
    static get testCanvas() {
      return testCanvas;
    }
  
    static get testContext() {
      return testContext;
    }
  
    static get features() {
      return features;
    }
  
    static get fragmentShader() {
      return fragmentShader;
    }
  
    static get vertexShader() {
      return vertexShader;
    }
  
    constructor(source, settings) {
      super(source, settings);
      this.textureCache = {};
      this.threadDim = {};
      this.programUniformLocationCache = {};
      this.framebuffer = null;
  
      this.buffer = null;
      this.program = null;
      this.pipeline = settings.pipeline;
      this.endianness = utils.systemEndianness();
      this.extensions = {};
      this.subKernelOutputTextures = null;
      this.argumentsLength = 0;
      this.constantsLength = 0;
      this.compiledFragmentShader = null;
      this.compiledVertexShader = null;
      this.fragShader = null;
      this.vertShader = null;
      this.drawBuffersMap = null;
      this.outputTexture = null;
      this.maxTexSize = null;
      this.uniform1fCache = {};
      this.uniform1iCache = {};
      this.uniform2fCache = {};
      this.uniform2fvCache = {};
      this.uniform2ivCache = {};
      this.uniform3fvCache = {};
      this.uniform3ivCache = {};
  
      this.mergeSettings(source.settings || settings);
    }
  
    initCanvas() {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 2;
        return canvas;
      } else if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(0, 0);
      }
    }
  
    initContext() {
      const settings = {
        alpha: false,
        depth: false,
        antialias: false
      };
      const context = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);
      return context;
    }
  
    initPlugins(settings) {
      const pluginsToUse = [];
  
      if (typeof this.source === 'string') {
        for (let i = 0; i < plugins.length; i++) {
          const plugin = plugins[i];
          if (this.source.match(plugin.functionMatch)) {
            pluginsToUse.push(plugin);
          }
        }
      } else if (typeof this.source === 'object') {
        if (settings.pluginNames) {
          for (let i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            const usePlugin = settings.pluginNames.some(pluginName => pluginName === plugin.name);
            if (usePlugin) {
              pluginsToUse.push(plugin);
            }
          }
        }
      }
      return pluginsToUse;
    }
  
    initExtensions() {
      this.extensions = {
        OES_texture_float: this.context.getExtension('OES_texture_float'),
        OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
        OES_element_index_uint: this.context.getExtension('OES_element_index_uint'),
        WEBGL_draw_buffers: this.context.getExtension('WEBGL_draw_buffers'),
      };
    }
  
    validateSettings() {
      if (this.skipValidate) {
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
        return;
      }
  
      const features = this.constructor.features;
      if (this.floatTextures === true && !features.isTextureFloat) {
        throw new Error('Float textures are not supported');
      } else if (this.floatOutput === true && this.floatOutputForce !== true && !features.isFloatRead) {
        throw new Error('Float texture outputs are not supported');
      } else if (this.floatTextures === undefined && features.isTextureFloat) {
        this.floatTextures = true;
        this.floatOutput = features.isFloatRead;
      }
  
      if (this.subKernels && this.subKernels.length > 0 && !this.extensions.WEBGL_draw_buffers) {
        throw new Error('could not instantiate draw buffers extension');
      }
  
      if (this.fixIntegerDivisionAccuracy === null) {
        this.fixIntegerDivisionAccuracy = !features.isIntegerDivisionAccurate;
      } else if (this.fixIntegerDivisionAccuracy && features.isIntegerDivisionAccurate) {
        this.fixIntegerDivisionAccuracy = false;
      }
  
      this.checkOutput();
  
      if (!this.output || this.output.length === 0) {
        if (arguments.length !== 1) {
          throw new Error('Auto output only supported for kernels with only one input');
        }
  
        const argType = utils.getVariableType(arguments[0]);
        if (argType === 'Array') {
          this.output = utils.getDimensions(argType);
        } else if (argType === 'NumberTexture' || argType === 'ArrayTexture(4)') {
          this.output = arguments[0].output;
        } else {
          throw new Error('Auto output not supported for input type: ' + argType);
        }
      }
  
      this.texSize = utils.dimToTexSize({
        floatTextures: this.floatTextures,
        floatOutput: this.floatOutput
      }, this.output, true);
  
      if (this.graphical) {
        if (this.output.length !== 2) {
          throw new Error('Output must have 2 dimensions on graphical mode');
        }
  
        if (this.floatOutput) {
          this.floatOutput = false;
          console.warn('Cannot use graphical mode and float output at the same time');
        }
  
        this.texSize = utils.clone(this.output);
      } else if (this.floatOutput === undefined && features.isTextureFloat) {
        this.floatOutput = true;
      }
    }
  
    updateMaxTexSize() {
      const texSize = this.texSize;
      const canvas = this.canvas;
      if (this.maxTexSize === null) {
        let canvasIndex = canvases.indexOf(canvas);
        if (canvasIndex === -1) {
          canvasIndex = canvases.length;
          canvases.push(canvas);
          maxTexSizes[canvasIndex] = [texSize[0], texSize[1]];
        }
        this.maxTexSize = maxTexSizes[canvasIndex];
      }
      if (this.maxTexSize[0] < texSize[0]) {
        this.maxTexSize[0] = texSize[0];
      }
      if (this.maxTexSize[1] < texSize[1]) {
        this.maxTexSize[1] = texSize[1];
      }
    }
  
    build() {
      this.initExtensions();
      this.validateSettings();
      this.setupConstants();
      this.setupArguments(arguments);
      this.updateMaxTexSize();
      const texSize = this.texSize;
      const gl = this.context;
      const canvas = this.canvas;
      gl.enable(gl.SCISSOR_TEST);
      gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
      canvas.width = this.maxTexSize[0];
      canvas.height = this.maxTexSize[1];
      const threadDim = this.threadDim = utils.clone(this.output);
      while (threadDim.length < 3) {
        threadDim.push(1);
      }
  
      const compiledVertexShader = this.getVertexShader(arguments);
      const vertShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertShader, compiledVertexShader);
      gl.compileShader(vertShader);
      this.vertShader = vertShader;
  
      const compiledFragmentShader = this.getFragmentShader(arguments);
      const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragShader, compiledFragmentShader);
      gl.compileShader(fragShader);
      this.fragShader = fragShader;
  
      if (this.debug) {
        console.log('GLSL Shader Output:');
        console.log(compiledFragmentShader);
      }
  
      if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw new Error('Error compiling vertex shader: ' + gl.getShaderInfoLog(vertShader));
      }
      if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw new Error('Error compiling fragment shader: ' + gl.getShaderInfoLog(fragShader));
      }
  
      const program = this.program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      this.framebuffer = gl.createFramebuffer();
      this.framebuffer.width = texSize[0];
      this.framebuffer.height = texSize[1];
  
      const vertices = new Float32Array([-1, -1,
        1, -1, -1, 1,
        1, 1
      ]);
      const texCoords = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 1
      ]);
  
      const texCoordOffset = vertices.byteLength;
  
      let buffer = this.buffer;
      if (!buffer) {
        buffer = this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      }
  
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
      gl.bufferSubData(gl.ARRAY_BUFFER, texCoordOffset, texCoords);
  
      const aPosLoc = gl.getAttribLocation(this.program, 'aPos');
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);
      const aTexCoordLoc = gl.getAttribLocation(this.program, 'aTexCoord');
      gl.enableVertexAttribArray(aTexCoordLoc);
      gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 0, texCoordOffset);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  
      for (let p in this.constants) {
        const value = this.constants[p];
        const type = utils.getVariableType(value);
        if (type === 'Float' || type === 'Integer') {
          continue;
        }
        gl.useProgram(this.program);
        this._addConstant(this.constants[p], type, p);
      }
  
      if (!this.immutable) {
        this._setupOutputTexture();
        if (
          this.subKernels !== null &&
          this.subKernels.length > 0
        ) {
          this._setupSubOutputTextures(this.subKernels.length);
        }
      }
    }
  
    run() {
      if (this.program === null) {
        this.build.apply(this, arguments);
      }
      const argumentNames = this.argumentNames;
      const argumentTypes = this.argumentTypes;
      const texSize = this.texSize;
      const gl = this.context;
  
      gl.useProgram(this.program);
      gl.scissor(0, 0, texSize[0], texSize[1]);
  
      if (!this.hardcodeConstants) {
        this.setUniform3iv('uOutputDim', this.threadDim);
        this.setUniform2iv('uTexSize', texSize);
      }
  
      this.setUniform2f('ratio', texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);
  
      this.argumentsLength = 0;
      for (let texIndex = 0; texIndex < argumentNames.length; texIndex++) {
        this._addArgument(arguments[texIndex], argumentTypes[texIndex], argumentNames[texIndex]);
      }
  
      if (this.plugins) {
        for (let i = 0; i < this.plugins.length; i++) {
          const plugin = this.plugins[i];
          if (plugin.onBeforeRun) {
            plugin.onBeforeRun(this);
          }
        }
      }
  
      if (this.graphical) {
        if (this.pipeline) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
          if (!this.outputTexture || this.immutable) {
            this._setupOutputTexture();
          }
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          return new Texture(this.outputTexture, texSize, this.threadDim, this.output, this.context, 'ArrayTexture(4)');
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return;
      }
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      if (this.immutable) {
        this._setupOutputTexture();
      }
      const outputTexture = this.outputTexture;
  
      if (this.subKernels !== null) {
        if (this.immutable) {
          this.subKernelOutputTextures = [];
          this._setupSubOutputTextures(this.subKernels.length);
        }
        this.extensions.WEBGL_draw_buffers.drawBuffersWEBGL(this.drawBuffersMap);
      }
  
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
      if (this.subKernelOutputTextures !== null) {
        if (this.subKernels !== null) {
          const output = {
            result: this.renderOutput(outputTexture),
          };
          for (let i = 0; i < this.subKernels.length; i++) {
            output[this.subKernels[i].property] = new Texture(this.subKernelOutputTextures[i], texSize, this.threadDim, this.output, this.context);
          }
          return output;
        }
      }
  
      return this.renderOutput(outputTexture);
    }
  
    renderOutput(outputTexture) {
      const texSize = this.texSize;
      const gl = this.context;
      const threadDim = this.threadDim;
      const output = this.output;
      if (this.pipeline) {
        return new Texture(outputTexture, texSize, this.threadDim, output, this.context);
      } else {
        let result;
        if (this.floatOutput) {
          const w = texSize[0];
          const h = Math.ceil(texSize[1] / 4);
          result = new Float32Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
        } else {
          const bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
          gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
          result = new Float32Array(bytes.buffer);
        }
        result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);
  
        if (output.length === 1) {
          return result;
        } else if (output.length === 2) {
          return utils.splitArray(result, output[0]);
        } else if (output.length === 3) {
          const cube = utils.splitArray(result, output[0] * output[1]);
          return cube.map(function(x) {
            return utils.splitArray(x, output[0]);
          });
        }
      }
    }
  
    getOutputTexture() {
      return this.outputTexture;
    }
  
    _setupOutputTexture() {
      const gl = this.context;
      const texSize = this.texSize;
      const texture = this.outputTexture = this.context.createTexture();
      gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentNames.length);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      if (this.floatOutput) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
  
    _setupSubOutputTextures(length) {
      const gl = this.context;
      const texSize = this.texSize;
      const drawBuffersMap = this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
      const textures = this.subKernelOutputTextures = [];
      for (let i = 0; i < length; i++) {
        const texture = this.context.createTexture();
        textures.push(texture);
        drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
        gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentNames.length + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        if (this.floatOutput) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);
      }
    }
  
    getArgumentTexture(name) {
      return this.getTextureCache(`ARGUMENT_${name}`);
    }
  
    getTextureCache(name) {
      if (this.textureCache.hasOwnProperty(name)) {
        return this.textureCache[name];
      }
      return this.textureCache[name] = this.context.createTexture();
    }
  
    detachTextureCache(name) {
      delete this.textureCache[name];
    }
  
    setUniform1f(name, value) {
      if (this.uniform1fCache.hasOwnProperty(name)) {
        const cache = this.uniform1fCache[name];
        if (value === cache) {
          return;
        }
      }
      this.uniform1fCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform1f(loc, value);
    }
  
    setUniform1i(name, value) {
      if (this.uniform1iCache.hasOwnProperty(name)) {
        const cache = this.uniform1iCache[name];
        if (value === cache) {
          return;
        }
      }
      this.uniform1iCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform1i(loc, value);
    }
  
    setUniform2f(name, value1, value2) {
      if (this.uniform2fCache.hasOwnProperty(name)) {
        const cache = this.uniform2fCache[name];
        if (
          value1 === cache[0] &&
          value2 === cache[1]
        ) {
          return;
        }
      }
      this.uniform2fCache[name] = [value1, value2];
      const loc = this.getUniformLocation(name);
      this.context.uniform2f(loc, value1, value2);
    }
  
    setUniform2fv(name, value) {
      if (this.uniform2fvCache.hasOwnProperty(name)) {
        const cache = this.uniform2fvCache[name];
        if (
          value[0] === cache[0] &&
          value[1] === cache[1]
        ) {
          return;
        }
      }
      this.uniform2fvCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform2fv(loc, value);
    }
  
    setUniform2iv(name, value) {
      if (this.uniform2ivCache.hasOwnProperty(name)) {
        const cache = this.uniform2ivCache[name];
        if (
          value[0] === cache[0] &&
          value[1] === cache[1]
        ) {
          return;
        }
      }
      this.uniform2ivCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform2iv(loc, value);
    }
  
    setUniform3fv(name, value) {
      if (this.uniform3fvCache.hasOwnProperty(name)) {
        const cache = this.uniform3fvCache[name];
        if (
          value[0] === cache[0] &&
          value[1] === cache[1] &&
          value[2] === cache[2]
        ) {
          return;
        }
      }
      this.uniform3fvCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform3fv(loc, value);
    }
  
    setUniform3iv(name, value) {
      if (this.uniform3ivCache.hasOwnProperty(name)) {
        const cache = this.uniform3ivCache[name];
        if (
          value[0] === cache[0] &&
          value[1] === cache[1] &&
          value[2] === cache[2]
        ) {
          return;
        }
      }
      this.uniform3ivCache[name] = value;
      const loc = this.getUniformLocation(name);
      this.context.uniform3iv(loc, value);
    }
  
    getUniformLocation(name) {
      if (this.programUniformLocationCache.hasOwnProperty(name)) {
        return this.programUniformLocationCache[name];
      }
      return this.programUniformLocationCache[name] = this.context.getUniformLocation(this.program, name);
    }
  
    _getFragShaderArtifactMap(args) {
      return {
        HEADER: this._getHeaderString(),
        LOOP_MAX: this._getLoopMaxString(),
        PLUGINS: this._getPluginsString(),
        CONSTANTS: this._getConstantsString(),
        DECODE32_ENDIANNESS: this._getDecode32EndiannessString(),
        ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(),
        DIVIDE_WITH_INTEGER_CHECK: this._getDivideWithIntegerCheckString(),
        GET_WRAPAROUND: this._getGetWraparoundString(),
        GET_TEXTURE_CHANNEL: this._getGetTextureChannelString(),
        GET_TEXTURE_INDEX: this._getGetTextureIndexString(),
        GET_RESULT: this._getGetResultString(),
        MAIN_CONSTANTS: this._getMainConstantsString(),
        MAIN_ARGUMENTS: this._getMainArgumentsString(args),
        KERNEL: this._getKernelString(),
        MAIN_RESULT: this._getMainResultString()
      };
    }
  
    _addArgument(value, type, name) {
      const gl = this.context;
      const argumentTexture = this.getArgumentTexture(name);
      if (value instanceof Texture) {
        type = value.type;
      }
      switch (type) {
        case 'Array':
        case 'Array(2)':
        case 'Array(3)':
        case 'Array(4)':
        case 'Array2D':
        case 'Array3D':
          {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
  
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value, length);
  
            let buffer;
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
            } else {
              buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`user_${name}Dim`, dim);
              this.setUniform2iv(`user_${name}Size`, size);
            }
            this.setUniform1i(`user_${name}BitRatio`, bitRatio);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'Integer':
        case 'Float':
        case 'Number':
          {
            this.setUniform1f(`user_${name}`, value);
            break;
          }
        case 'Input':
          {
            const input = value;
            const dim = input.size;
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
  
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value.value, length);
  
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, input);
            } else {
              const buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`user_${name}Dim`, dim);
              this.setUniform2iv(`user_${name}Size`, size);
            }
            this.setUniform1i(`user_${name}BitRatio`, bitRatio);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'HTMLImage':
          {
            const inputImage = value;
            const dim = [inputImage.width, inputImage.height, 1];
            const size = [inputImage.width, inputImage.height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage2D(gl.TEXTURE_2D,
              mipLevel,
              internalFormat,
              srcFormat,
              srcType,
              inputImage);
            this.setUniform3iv(`user_${name}Dim`, dim);
            this.setUniform2iv(`user_${name}Size`, size);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'ArrayTexture(4)':
        case 'NumberTexture':
          {
            const inputTexture = value;
            if (inputTexture.context !== this.context) {
              throw new Error(`argument ${ name} (${ type }) must be from same context`);
            }
            const dim = inputTexture.dimensions;
            const size = inputTexture.size;
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
  
            this.setUniform3iv(`user_${name}Dim`, dim);
            this.setUniform2iv(`user_${name}Size`, size);
            this.setUniform1i(`user_${name}BitRatio`, 1); 
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        default:
          throw new Error('Input type not supported: ' + value);
      }
      this.argumentsLength++;
    }
  
    _addConstant(value, type, name) {
      const gl = this.context;
      const argumentTexture = this.getArgumentTexture(name);
      if (value instanceof Texture) {
        type = value.type;
      }
      switch (type) {
        case 'Array':
          {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
  
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value, length);
  
            let buffer;
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
            } else {
              buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`constants_${name}Dim`, dim);
              this.setUniform2iv(`constants_${name}Size`, size);
            }
            this.setUniform1i(`constants_${name}BitRatio`, bitRatio);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'Input':
          {
            const input = value;
            const dim = input.size;
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value.value, length);
  
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
            } else {
              const buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`constants_${name}Dim`, dim);
              this.setUniform2iv(`constants_${name}Size`, size);
            }
            this.setUniform1i(`constants_${name}BitRatio`, bitRatio);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'HTMLImage':
          {
            const inputImage = value;
            const dim = [inputImage.width, inputImage.height, 1];
            const size = [inputImage.width, inputImage.height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage2D(gl.TEXTURE_2D,
              mipLevel,
              internalFormat,
              srcFormat,
              srcType,
              inputImage);
            this.setUniform3iv(`constants_${name}Dim`, dim);
            this.setUniform2iv(`constants_${name}Size`, size);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'ArrayTexture(4)':
        case 'NumberTexture':
          {
            const inputTexture = value;
            if (inputTexture.context !== this.context) {
              throw new Error(`argument ${ name} (${ type }) must be from same context`);
            }
            const dim = inputTexture.dimensions;
            const size = inputTexture.size;
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
            this.setUniform3iv(`constants_${name}Dim`, dim);
            this.setUniform2iv(`constants_${name}Size`, size);
            this.setUniform1i(`constants_${name}BitRatio`, 1); 
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'Integer':
        case 'Float':
        default:
          throw new Error('Input type not supported: ' + value);
      }
      this.constantsLength++;
    }
  
    _formatArrayTransfer(value, length) {
      let bitRatio = 1; 
      let valuesFlat = value;
      if (utils.isArray(value[0]) || this.floatTextures) {
        valuesFlat = new Float32Array(length);
        utils.flattenTo(value, valuesFlat);
      } else {
  
        switch (value.constructor) {
          case Uint8Array:
          case Int8Array:
            bitRatio = 4;
            break;
          case Uint16Array:
          case Int16Array:
            bitRatio = 2;
          case Float32Array:
          case Int32Array:
            break;
  
          default:
            valuesFlat = new Float32Array(length);
            utils.flattenTo(value, valuesFlat);
        }
      }
      return {
        bitRatio,
        valuesFlat
      };
    }
  
    _getHeaderString() {
      return (
        this.subKernels !== null ?
        '#extension GL_EXT_draw_buffers : require\n' :
        ''
      );
    }
  
    _getLoopMaxString() {
      return (
        this.loopMaxIterations ?
        ` ${parseInt(this.loopMaxIterations)};\n` :
        ' 1000;\n'
      );
    }
  
    _getPluginsString() {
      if (!this.plugins) return '\n';
      return this.plugins.map(plugin => plugin.source && this.source.match(plugin.functionMatch) ? plugin.source : '').join('\n');
    }
  
    _getConstantsString() {
      const result = [];
      const threadDim = this.threadDim;
      const texSize = this.texSize;
      if (this.hardcodeConstants) {
        result.push(
          `ivec3 uOutputDim = ivec3(${threadDim[0]}, ${threadDim[1]}, ${threadDim[2]})`,
          `ivec2 uTexSize = ivec2(${texSize[0]}, ${texSize[1]})`
        );
      } else {
        result.push(
          'uniform ivec3 uOutputDim',
          'uniform ivec2 uTexSize'
        );
      }
  
      return this._linesToString(result);
    }
  
    _getTextureCoordinate() {
      const subKernels = this.subKernels;
      if (subKernels === null || subKernels.length < 1) {
        return 'varying vec2 vTexCoord;\n';
      } else {
        return 'out vec2 vTexCoord;\n';
      }
    }
  
    _getDecode32EndiannessString() {
      return (
        this.endianness === 'LE' ?
        '' :
        '  rgba.rgba = rgba.abgr;\n'
      );
    }
  
    _getEncode32EndiannessString() {
      return (
        this.endianness === 'LE' ?
        '' :
        '  rgba.rgba = rgba.abgr;\n'
      );
    }
  
    _getDivideWithIntegerCheckString() {
      return this.fixIntegerDivisionAccuracy ?
        `float div_with_int_check(float x, float y) {
    if (floor(x) == x && floor(y) == y && integerMod(x, y) == 0.0) {
      return float(int(x)/int(y));
    }
    return x / y;
  }` :
        '';
    }
  
    _getGetWraparoundString() {
      return (
        this.wraparound ?
        '  xyz = mod(xyz, texDim);\n' :
        ''
      );
    }
  
    _getGetTextureChannelString() {
      if (!this.floatTextures) return '';
  
      return this._linesToString([
        '  int channel = integerMod(index, 4)',
        '  index = index / 4'
      ]);
    }
  
    _getGetTextureIndexString() {
      return (
        this.floatTextures ?
        '  index = index / 4;\n' :
        ''
      );
    }
  
    _getGetResultString() {
      if (!this.floatTextures) {
        return '  return decode(texel, x, bitRatio);';
      }
      return this._linesToString([
        '  if (channel == 0) return texel.r',
        '  if (channel == 1) return texel.g',
        '  if (channel == 2) return texel.b',
        '  if (channel == 3) return texel.a'
      ]);
    }
  
    _getMainArgumentsString(args) {
      const result = [];
      const argumentTypes = this.argumentTypes;
      const argumentNames = this.argumentNames;
      for (let i = 0; i < argumentNames.length; i++) {
        const value = args[i];
        const name = argumentNames[i];
        const type = argumentTypes[i];
        if (this.hardcodeConstants) {
          if (type === 'Array' || type === 'NumberTexture' || type === 'ArrayTexture(4)') {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
  
            result.push(
              `uniform sampler2D user_${name}`,
              `ivec2 user_${name}Size = ivec2(${size[0]}, ${size[1]})`,
              `ivec3 user_${name}Dim = ivec3(${dim[0]}, ${dim[1]}, ${dim[2]})`,
              `uniform int user_${name}BitRatio`
            );
          } else if (type === 'Integer') {
            result.push(`float user_${name} = ${value}.0`);
          } else if (type === 'Float') {
            result.push(`float user_${name} = ${value}`);
          }
        } else {
          if (type === 'Array' || type === 'NumberTexture' || type === 'ArrayTexture(4)' || type === 'Input' || type === 'HTMLImage') {
            result.push(
              `uniform sampler2D user_${name}`,
              `uniform ivec2 user_${name}Size`,
              `uniform ivec3 user_${name}Dim`
            );
            if (type !== 'HTMLImage') {
              result.push(`uniform int user_${name}BitRatio`)
            }
          } else if (type === 'Integer' || type === 'Float' || type === 'Number') {
            result.push(`uniform float user_${name}`);
          } else {
            throw new Error(`Param type ${type} not supported in WebGL`);
          }
        }
      }
      return this._linesToString(result);
    }
  
    _getMainConstantsString() {
      const result = [];
      if (this.constants) {
        for (let name in this.constants) {
          if (!this.constants.hasOwnProperty(name)) continue;
          let value = this.constants[name];
          let type = utils.getVariableType(value);
          switch (type) {
            case 'Integer':
              result.push('const int constants_' + name + ' = ' + parseInt(value));
              break;
            case 'Float':
              result.push('const float constants_' + name + ' = ' + parseFloat(value));
              break;
            case 'Array':
            case 'Input':
            case 'HTMLImage':
            case 'NumberTexture':
            case 'ArrayTexture(4)':
              result.push(
                `uniform sampler2D constants_${name}`,
                `uniform ivec2 constants_${name}Size`,
                `uniform ivec3 constants_${name}Dim`,
                `uniform int constants_${name}BitRatio`
              );
              break;
            default:
              throw new Error(`Unsupported constant ${name} type ${type}`);
          }
        }
      }
      return this._linesToString(result);
    }
  
    _getKernelString() {
      const result = [];
      const subKernels = this.subKernels;
      if (subKernels !== null) {
        result.push('float kernelResult = 0.0');
        for (let i = 0; i < subKernels.length; i++) {
          result.push(
            `float subKernelResult_${subKernels[i].name} = 0.0`
          );
        }
      } else {
        result.push('float kernelResult = 0.0');
      }
  
      const functionBuilder = FunctionBuilder.fromKernel(this, WebGLFunctionNode, {
        fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy
      });
  
      return this._linesToString(result) + functionBuilder.getPrototypeString('kernel');
    }
  
    _getMainResultString() {
      const subKernels = this.subKernels;
      const result = [];
  
      if (this.floatOutput) {
        result.push('  index *= 4');
      }
  
      if (this.graphical) {
        result.push(
          '  threadId = indexTo3D(index, uOutputDim)',
          '  kernel()',
          '  gl_FragColor = actualColor'
        );
      } else if (this.floatOutput) {
        const channels = ['r', 'g', 'b', 'a'];
  
        for (let i = 0; i < channels.length; ++i) {
          result.push('  threadId = indexTo3D(index, uOutputDim)');
          result.push('  kernel()');
  
          if (subKernels) {
            result.push(`  gl_FragData[0].${channels[i]} = kernelResult`);
  
            for (let j = 0; j < subKernels.length; ++j) {
              result.push(`  gl_FragData[${j + 1}].${channels[i]} = subKernelResult_${subKernels[j].name}`);
            }
          } else {
            result.push(`  gl_FragColor.${channels[i]} = kernelResult`);
          }
  
          if (i < channels.length - 1) {
            result.push('  index += 1');
          }
        }
      } else if (subKernels !== null) {
        result.push('  threadId = indexTo3D(index, uOutputDim)');
        result.push('  kernel()');
        result.push('  gl_FragData[0] = encode32(kernelResult)');
        for (let i = 0; i < subKernels.length; i++) {
          result.push(`  gl_FragData[${i + 1}] = encode32(subKernelResult_${subKernels[i].name})`);
        }
      } else {
        result.push(
          '  threadId = indexTo3D(index, uOutputDim)',
          '  kernel()',
          '  gl_FragColor = encode32(kernelResult)'
        );
      }
  
      return this._linesToString(result);
    }
  
    _linesToString(lines) {
      if (lines.length > 0) {
        return lines.join(';\n') + ';\n';
      } else {
        return '\n';
      }
    }
  
    replaceArtifacts(src, map) {
      return src.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z])*)__;\n/g, (match, artifact) => {
        if (map.hasOwnProperty(artifact)) {
          return map[artifact];
        }
        throw `unhandled artifact ${artifact}`;
      });
    }
  
    getFragmentShader(args) {
      if (this.compiledFragmentShader !== null) {
        return this.compiledFragmentShader;
      }
      return this.compiledFragmentShader = this.replaceArtifacts(this.constructor.fragmentShader, this._getFragShaderArtifactMap(args));
    }
  
    getVertexShader(args) {
      if (this.compiledVertexShader !== null) {
        return this.compiledVertexShader;
      }
      return this.compiledVertexShader = this.constructor.vertexShader;
    }
  
    toString() {
      return webGLKernelString(this);
    }
  
    destroy(removeCanvasReferences) {
      if (this.outputTexture) {
        this.context.deleteTexture(this.outputTexture);
      }
      if (this.buffer) {
        this.context.deleteBuffer(this.buffer);
      }
      if (this.framebuffer) {
        this.context.deleteFramebuffer(this.framebuffer);
      }
      if (this.vertShader) {
        this.context.deleteShader(this.vertShader);
      }
      if (this.fragShader) {
        this.context.deleteShader(this.fragShader);
      }
      if (this.program) {
        this.context.deleteProgram(this.program);
      }
  
      const keys = Object.keys(this.textureCache);
  
      for (let i = 0; i < keys.length; i++) {
        const name = keys[i];
        this.context.deleteTexture(this.textureCache[name]);
      }
  
      if (this.subKernelOutputTextures) {
        for (let i = 0; i < this.subKernelOutputTextures.length; i++) {
          this.context.deleteTexture(this.subKernelOutputTextures[i]);
        }
      }
      if (removeCanvasReferences) {
        const idx = canvases.indexOf(this.canvas);
        if (idx >= 0) {
          canvases[idx] = null;
          maxTexSizes[idx] = null;
        }
      }
      this.destroyExtensions();
      delete this.context;
      delete this.canvas;
    }
  
    destroyExtensions() {
      this.extensions.OES_texture_float = null;
      this.extensions.OES_texture_float_linear = null;
      this.extensions.OES_element_index_uint = null;
    }
  
    static destroyContext(context) {
      const extension = context.getExtension('WEBGL_lose_context');
      if (extension) {
        extension.loseContext();
      }
    }
  
    toJSON() {
      const json = super.toJSON();
      json.functionNodes = FunctionBuilder.fromKernel(this, WebGLFunctionNode).toJSON();
      return json;
    }
  }
  
  module.exports = {
    WebGLKernel
  };
  },{"../../plugins/triangle-noise":27,"../../texture":28,"../../utils":29,"../function-builder":8,"../gl-kernel":10,"./fragment-shader":13,"./function-node":14,"./kernel-string":15,"./vertex-shader":17}],17:[function(require,module,exports){
  const vertexShader = `precision highp float;
  precision highp int;
  precision highp sampler2D;
  
  attribute vec2 aPos;
  attribute vec2 aTexCoord;
  
  varying vec2 vTexCoord;
  uniform vec2 ratio;
  
  void main(void) {
    gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
    vTexCoord = aTexCoord;
  }`;
  
  module.exports = {
    vertexShader
  };
  },{}],18:[function(require,module,exports){
  const fragmentShader = `#version 300 es
  __HEADER__;
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  
  const int LOOP_MAX = __LOOP_MAX__;
  
  __PLUGINS__;
  __CONSTANTS__;
  
  in vec2 vTexCoord;
  
  vec2 integerMod(vec2 x, float y) {
    vec2 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  vec3 integerMod(vec3 x, float y) {
    vec3 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  vec4 integerMod(vec4 x, vec4 y) {
    vec4 res = floor(mod(x, y));
    return res * step(1.0 - floor(y), -res);
  }
  
  float integerMod(float x, float y) {
    float res = floor(mod(x, y));
    return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
  }
  
  int integerMod(int x, int y) {
    return x - (y * int(x/y));
  }
  
  __DIVIDE_WITH_INTEGER_CHECK__;
  
  // Here be dragons!
  // DO NOT OPTIMIZE THIS CODE
  // YOU WILL BREAK SOMETHING ON SOMEBODY\'S MACHINE
  // LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
  const vec2 MAGIC_VEC = vec2(1.0, -256.0);
  const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
  const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
  float decode32(vec4 rgba) {
    __DECODE32_ENDIANNESS__;
    rgba *= 255.0;
    vec2 gte128;
    gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;
    gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;
    float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);
    float res = exp2(round(exponent));
    rgba.b = rgba.b - 128.0 * gte128.x;
    res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;
    res *= gte128.y * -2.0 + 1.0;
    return res;
  }
  
  vec4 encode32(float f) {
    float F = abs(f);
    float sign = f < 0.0 ? 1.0 : 0.0;
    float exponent = floor(log2(F));
    float mantissa = (exp2(-exponent) * F);
    // exponent += floor(log2(mantissa));
    vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
    rgba.rg = integerMod(rgba.rg, 256.0);
    rgba.b = integerMod(rgba.b, 128.0);
    rgba.a = exponent*0.5 + 63.5;
    rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
    rgba = floor(rgba);
    rgba *= 0.003921569; // 1/255
    __ENCODE32_ENDIANNESS__;
    return rgba;
  }
  // Dragons end here
  
  float decode(vec4 rgba, int x, int bitRatio) {
    if (bitRatio == 1) {
      return decode32(rgba);
    }
    __DECODE32_ENDIANNESS__;
    int channel = integerMod(x, bitRatio);
    if (bitRatio == 4) {
      return rgba[channel] * 255.0;
    }
    else {
      return rgba[channel*2] * 255.0 + rgba[channel*2 + 1] * 65280.0;
    }
  }
  
  int index;
  ivec3 threadId;
  
  ivec3 indexTo3D(int idx, ivec3 texDim) {
    int z = int(idx / (texDim.x * texDim.y));
    idx -= z * int(texDim.x * texDim.y);
    int y = int(idx / texDim.x);
    int x = int(integerMod(idx, texDim.x));
    return ivec3(x, y, z);
  }
  
  float get(sampler2D tex, ivec2 texSize, ivec3 texDim, int bitRatio, int z, int y, int x) {
    ivec3 xyz = ivec3(x, y, z);
    __GET_WRAPAROUND__;
    int index = xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z);
    __GET_TEXTURE_CHANNEL__;
    int w = texSize.x;
    vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
    __GET_TEXTURE_INDEX__;
    vec4 texel = texture(tex, st / vec2(texSize));
    __GET_RESULT__;
  }
  
  vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
    ivec3 xyz = ivec3(x, y, z);
    __GET_WRAPAROUND__;
    int index = xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z);
    __GET_TEXTURE_CHANNEL__;
    int w = texSize.x;
    vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
    __GET_TEXTURE_INDEX__;
    return texture(tex, st / vec2(texSize));
  }
  
  vec4 getImage3D(sampler2DArray tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
    ivec3 xyz = ivec3(x, y, z);
    __GET_WRAPAROUND__;
    int index = xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z);
    __GET_TEXTURE_CHANNEL__;
    int w = texSize.x;
    vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
    __GET_TEXTURE_INDEX__;
    return texture(tex, vec3(st / vec2(texSize), z));
  }
  
  vec4 actualColor;
  void color(float r, float g, float b, float a) {
    actualColor = vec4(r,g,b,a);
  }
  
  void color(float r, float g, float b) {
    color(r,g,b,1.0);
  }
  
  __MAIN_CONSTANTS__;
  __MAIN_ARGUMENTS__;
  __KERNEL__;
  
  void main(void) {
    index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
    __MAIN_RESULT__;
  }`;
  
  module.exports = {
    fragmentShader
  };
  },{}],19:[function(require,module,exports){
  const {
    WebGLFunctionNode
  } = require('../web-gl/function-node');
  
  class WebGL2FunctionNode extends WebGLFunctionNode {
  
    astIdentifierExpression(idtNode, retArr) {
      if (idtNode.type !== 'Identifier') {
        throw this.astErrorOutput(
          'IdentifierExpression - not an Identifier',
          idtNode
        );
      }
  
      switch (idtNode.name) {
        case 'Infinity':
          retArr.push('intBitsToFloat(2139095039)');
          break;
        default:
          const userArgumentName = this.getUserArgumentName(idtNode.name);
          if (userArgumentName) {
            retArr.push(`user_${userArgumentName}`);
          } else {
            retArr.push(`user_${idtNode.name}`);
          }
      }
  
      return retArr;
    }
  }
  
  module.exports = {
    WebGL2FunctionNode
  };
  },{"../web-gl/function-node":14}],20:[function(require,module,exports){
  const {
    WebGLKernel
  } = require('../web-gl/kernel');
  const {
    WebGL2FunctionNode
  } = require('./function-node');
  const {
    FunctionBuilder
  } = require('../function-builder');
  const {
    utils
  } = require('../../utils');
  const {
    Texture
  } = require('../../texture');
  const {
    fragmentShader
  } = require('./fragment-shader');
  const {
    vertexShader
  } = require('./vertex-shader');
  
  let isSupported = null;
  let testCanvas = null;
  let testContext = null;
  let testExtensions = null;
  let features = null;
  
  class WebGL2Kernel extends WebGLKernel {
    static get isSupported() {
      if (isSupported !== null) {
        return isSupported;
      }
      this.setupFeatureChecks();
      isSupported = this.isContextMatch(testContext);
      return isSupported;
    }
  
    static setupFeatureChecks() {
      if (typeof document !== 'undefined') {
        testCanvas = document.createElement('canvas');
      } else if (typeof OffscreenCanvas !== 'undefined') {
        testCanvas = new OffscreenCanvas(0, 0);
      }
  
      if (testCanvas) {
        testContext = testCanvas.getContext('webgl2');
        if (!testContext) return;
        testExtensions = {
          EXT_color_buffer_float: testContext.getExtension('EXT_color_buffer_float'),
          OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
        };
        features = this.getFeatures();
      }
    }
  
    static isContextMatch(context) {
      if (typeof WebGL2RenderingContext !== 'undefined') {
        return context instanceof WebGL2RenderingContext;
      }
      return false;
    }
  
    static getFeatures() {
      return Object.freeze({
        isFloatRead: this.getIsFloatRead(),
        isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(),
        kernelMap: true
      });
    }
  
    static getIsIntegerDivisionAccurate() {
      return super.getIsIntegerDivisionAccurate();
    }
  
    static get testCanvas() {
      return testCanvas;
    }
  
    static get testContext() {
      return testContext;
    }
  
    static get features() {
      return features;
    }
  
    static get fragmentShader() {
      return fragmentShader;
    }
    static get vertexShader() {
      return vertexShader;
    }
  
    initContext() {
      const settings = {
        alpha: false,
        depth: false,
        antialias: false
      };
      const context = this.canvas.getContext('webgl2', settings);
      return context;
    }
  
    initExtensions() {
      this.extensions = {
        EXT_color_buffer_float: this.context.getExtension('EXT_color_buffer_float'),
        OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
      };
    }
  
    validateSettings() {
      if (this.skipValidate) {
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
        return;
      }
  
      const features = this.constructor.features;
      if (this.floatOutput === true && this.floatOutputForce !== true && !features.isFloatRead) {
        throw new Error('Float texture outputs are not supported');
      } else if (this.floatTextures === undefined) {
        this.floatTextures = true;
        this.floatOutput = features.isFloatRead;
      }
  
      if (this.fixIntegerDivisionAccuracy === null) {
        this.fixIntegerDivisionAccuracy = !features.isIntegerDivisionAccurate;
      } else if (this.fixIntegerDivisionAccuracy && features.isIntegerDivisionAccurate) {
        this.fixIntegerDivisionAccuracy = false;
      }
  
      this.checkOutput();
  
      if (!this.output || this.output.length === 0) {
        if (arguments.length !== 1) {
          throw new Error('Auto output only supported for kernels with only one input');
        }
  
        const argType = utils.getVariableType(arguments[0]);
        if (argType === 'Array') {
          this.output = utils.getDimensions(argType);
        } else if (argType === 'NumberTexture' || argType === 'ArrayTexture(4)') {
          this.output = arguments[0].output;
        } else {
          throw new Error('Auto output not supported for input type: ' + argType);
        }
      }
  
      this.texSize = utils.dimToTexSize({
        floatTextures: this.floatTextures,
        floatOutput: this.floatOutput
      }, this.output, true);
  
      if (this.graphical) {
        if (this.output.length !== 2) {
          throw new Error('Output must have 2 dimensions on graphical mode');
        }
  
        if (this.floatOutput) {
          this.floatOutput = false;
          console.warn('Cannot use graphical mode and float output at the same time');
        }
  
        this.texSize = utils.clone(this.output);
      } else if (this.floatOutput === undefined) {
        this.floatOutput = true;
      }
  
      if (this.floatOutput || this.floatOutputForce) {
        this.context.getExtension('EXT_color_buffer_float');
      }
    }
  
    run() {
      if (this.program === null) {
        this.build.apply(this, arguments);
      }
      const argumentNames = this.argumentNames;
      const argumentTypes = this.argumentTypes;
      const texSize = this.texSize;
      const gl = this.context;
  
      gl.useProgram(this.program);
      gl.scissor(0, 0, texSize[0], texSize[1]);
  
      if (!this.hardcodeConstants) {
        this.setUniform3iv('uOutputDim', new Int32Array(this.threadDim));
        this.setUniform2iv('uTexSize', texSize);
      }
  
      this.setUniform2f('ratio', texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);
  
      this.argumentsLength = 0;
      for (let texIndex = 0; texIndex < argumentNames.length; texIndex++) {
        this._addArgument(arguments[texIndex], argumentTypes[texIndex], argumentNames[texIndex]);
      }
  
      if (this.plugins) {
        for (let i = 0; i < this.plugins.length; i++) {
          const plugin = this.plugins[i];
          if (plugin.onBeforeRun) {
            plugin.onBeforeRun(this);
          }
        }
      }
  
      if (this.graphical) {
        if (this.pipeline) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
          if (!this.outputTexture || this.immutable) {
            this._setupOutputTexture();
          }
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          return new Texture(this.outputTexture, texSize, this.threadDim, this.output, this.context, 'ArrayTexture(4)');
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return;
      }
  
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      if (this.immutable) {
        this._setupOutputTexture();
      }
      const outputTexture = this.outputTexture;
  
      if (this.subKernels !== null) {
        if (this.immutable) {
          this.subKernelOutputTextures = [];
          this._setupSubOutputTextures(this.subKernels.length);
        }
        gl.drawBuffers(this.drawBuffersMap);
      }
  
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
      if (this.subKernelOutputTextures !== null) {
        if (this.subKernels !== null) {
          const output = {
            result: this.renderOutput(outputTexture)
          };
          for (let i = 0; i < this.subKernels.length; i++) {
            output[this.subKernels[i].property] = new Texture(this.subKernelOutputTextures[i], texSize, this.threadDim, this.output, this.context);
          }
          return output;
        }
      }
  
      return this.renderOutput(outputTexture);
    }
  
    drawBuffers() {
      this.context.drawBuffers(this.drawBuffersMap);
    }
  
    getOutputTexture() {
      return this.outputTexture;
    }
  
    _setupOutputTexture() {
      const gl = this.context;
      const texSize = this.texSize;
      const texture = this.outputTexture = this.context.createTexture();
      gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentNames.length);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      if (this.floatOutput) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
  
    _setupSubOutputTextures(length) {
      const gl = this.context;
      const texSize = this.texSize;
      const drawBuffersMap = this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
      const textures = this.subKernelOutputTextures = [];
      for (let i = 0; i < length; i++) {
        const texture = this.context.createTexture();
        textures.push(texture);
        drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
        gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentNames.length + i);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        if (this.floatOutput) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);
      }
    }
  
  
    _addArgument(value, type, name) {
      const gl = this.context;
      const argumentTexture = this.getArgumentTexture(name);
      if (value instanceof Texture) {
        type = value.type;
      }
      switch (type) {
        case 'Array':
          {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
  
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value, length);
  
            let buffer;
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
            } else {
              buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`user_${name}Dim`, dim);
              this.setUniform2iv(`user_${name}Size`, size);
            }
            this.setUniform1i(`user_${name}BitRatio`, bitRatio);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'Integer':
        case 'Float':
        case 'Number':
          {
            this.setUniform1f(`user_${name}`, value);
            break;
          }
        case 'Input':
          {
            const input = value;
            const dim = input.size;
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value.value, length);
  
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size[0], size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
            } else {
              const buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`user_${name}Dim`, dim);
              this.setUniform2iv(`user_${name}Size`, size);
            }
            this.setUniform1i(`user_${name}BitRatio`, bitRatio);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'HTMLImage':
          {
            const inputImage = value;
            const dim = [inputImage.width, inputImage.height, 1];
            const size = [inputImage.width, inputImage.height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage2D(gl.TEXTURE_2D,
              mipLevel,
              internalFormat,
              srcFormat,
              srcType,
              inputImage);
            this.setUniform3iv(`user_${name}Dim`, dim);
            this.setUniform2iv(`user_${name}Size`, size);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'HTMLImageArray':
          {
            const inputImages = value;
            const dim = [inputImages[0].width, inputImages[0].height, inputImages.length];
            const size = [inputImages[0].width, inputImages[0].height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const width = inputImages[0].width;
            const height = inputImages[0].height;
            const textureDepth = inputImages.length;
            const border = 0;
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage3D(
              gl.TEXTURE_2D_ARRAY,
              mipLevel,
              internalFormat,
              width,
              height,
              textureDepth,
              border,
              srcFormat,
              srcType,
              null
            );
            for (let i = 0; i < inputImages.length; i++) {
              const xOffset = 0;
              const yOffset = 0;
              const imageDepth = 1;
              gl.texSubImage3D(
                gl.TEXTURE_2D_ARRAY,
                mipLevel,
                xOffset,
                yOffset,
                i,
                inputImages[i].width,
                inputImages[i].height,
                imageDepth,
                srcFormat,
                srcType,
                inputImages[i]
              );
            }
            this.setUniform3iv(`user_${name}Dim`, dim);
            this.setUniform2iv(`user_${name}Size`, size);
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        case 'ArrayTexture(4)':
        case 'NumberTexture':
          {
            const inputTexture = value;
            if (inputTexture.context !== this.context) {
              throw new Error(`argument ${ name} (${ type }) must be from same context`);
            }
            const dim = inputTexture.dimensions;
            const size = inputTexture.size;
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength + this.argumentsLength);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
  
            this.setUniform3iv(`user_${name}Dim`, dim);
            this.setUniform2iv(`user_${name}Size`, size);
            this.setUniform1i(`user_${name}BitRatio`, 1); 
            this.setUniform1i(`user_${name}`, this.argumentsLength);
            break;
          }
        default:
          throw new Error('Input type not supported: ' + value);
      }
      this.argumentsLength++;
    }
  
    _getMainConstantsString() {
      const result = [];
      if (this.constants) {
        for (let name in this.constants) {
          if (!this.constants.hasOwnProperty(name)) continue;
          let value = this.constants[name];
          let type = utils.getVariableType(value);
          switch (type) {
            case 'Integer':
              result.push('const int constants_' + name + ' = ' + parseInt(value));
              break;
            case 'Float':
              result.push('const float constants_' + name + ' = ' + parseFloat(value));
              break;
            case 'Array':
            case 'Input':
            case 'HTMLImage':
            case 'ArrayTexture(4)':
            case 'NumberTexture':
              result.push(
                `uniform highp sampler2D constants_${ name }`,
                `uniform highp ivec2 constants_${ name }Size`,
                `uniform highp ivec3 constants_${ name }Dim`,
                `uniform highp int constants_${ name }BitRatio`
              );
              break;
            case 'HTMLImageArray':
              result.push(
                `uniform highp sampler2DArray constants_${ name }`,
                `uniform highp ivec2 constants_${ name }Size`,
                `uniform highp ivec3 constants_${ name }Dim`,
                `uniform highp int constants_${ name }BitRatio`
              );
              break;
  
            default:
              throw new Error(`Unsupported constant ${ name } type ${ type }`);
          }
        }
      }
      return this._linesToString(result);
    }
  
    _addConstant(value, type, name) {
      const gl = this.context;
      const argumentTexture = this.getArgumentTexture(name);
      if (value instanceof Texture) {
        type = value.type;
      }
      switch (type) {
        case 'Array':
          {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
  
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value, length);
  
            let buffer;
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
            } else {
              buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`constants_${name}Dim`, dim);
              this.setUniform2iv(`constants_${name}Size`, size);
            }
            this.setUniform1i(`constants_${name}BitRatio`, bitRatio);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'Input':
          {
            const input = value;
            const dim = input.size;
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
            let length = size[0] * size[1];
            const {
              valuesFlat,
              bitRatio
            } = this._formatArrayTransfer(value.value, length);
  
            if (this.floatTextures) {
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size[0], size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
            } else {
              const buffer = new Uint8Array(valuesFlat.buffer);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0] / bitRatio, size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            }
  
            if (!this.hardcodeConstants) {
              this.setUniform3iv(`constants_${name}Dim`, dim);
              this.setUniform2iv(`constants_${name}Size`, size);
            }
            this.setUniform1i(`constants_${name}BitRatio`, bitRatio);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'HTMLImage':
          {
            const inputImage = value;
            const dim = [inputImage.width, inputImage.height, 1];
            const size = [inputImage.width, inputImage.height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage2D(gl.TEXTURE_2D,
              mipLevel,
              internalFormat,
              srcFormat,
              srcType,
              inputImage);
            this.setUniform3iv(`constants_${name}Dim`, dim);
            this.setUniform2iv(`constants_${name}Size`, size);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'HTMLImageArray':
          {
            const inputImages = value;
            const dim = [inputImages[0].width, inputImages[0].height, inputImages.length];
            const size = [inputImages[0].width, inputImages[0].height];
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, argumentTexture);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            const mipLevel = 0; 
            const internalFormat = gl.RGBA; 
            const width = inputImages[0].width;
            const height = inputImages[0].height;
            const textureDepth = inputImages.length;
            const border = 0;
            const srcFormat = gl.RGBA; 
            const srcType = gl.UNSIGNED_BYTE; 
            gl.texImage3D(
              gl.TEXTURE_2D_ARRAY,
              mipLevel,
              internalFormat,
              width,
              height,
              textureDepth,
              border,
              srcFormat,
              srcType,
              null
            );
            for (let i = 0; i < inputImages.length; i++) {
              const xOffset = 0;
              const yOffset = 0;
              const imageDepth = 1;
              gl.texSubImage3D(
                gl.TEXTURE_2D_ARRAY,
                mipLevel,
                xOffset,
                yOffset,
                i,
                inputImages[i].width,
                inputImages[i].height,
                imageDepth,
                srcFormat,
                srcType,
                inputImages[i]
              );
            }
            this.setUniform3iv(`constants_${name}Dim`, dim);
            this.setUniform2iv(`constants_${name}Size`, size);
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'ArrayTexture(4)':
        case 'NumberTexture':
          {
            const inputTexture = value;
            if (inputTexture.context !== this.context) {
              throw new Error(`argument ${ name} (${ type }) must be from same context`);
            }
            const dim = inputTexture.dimensions;
            const size = inputTexture.size;
  
            gl.activeTexture(gl.TEXTURE0 + this.constantsLength);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
  
            this.setUniform3iv(`constants_${name}Dim`, dim);
            this.setUniform2iv(`constants_${name}Size`, size);
            this.setUniform1i(`constants_${name}BitRatio`, 1); 
            this.setUniform1i(`constants_${name}`, this.constantsLength);
            break;
          }
        case 'Integer':
        case 'Float':
        default:
          throw new Error('Input type not supported: ' + value);
      }
      this.constantsLength++;
    }
    _getGetResultString() {
      if (!this.floatTextures) {
        return '  return decode(texel, x, bitRatio);';
      }
      return '  return texel[channel];';
    }
  
    _getHeaderString() {
      return '';
    }
  
    _getTextureCoordinate() {
      const subKernels = this.subKernels;
      if (subKernels === null || subKernels.length < 1) {
        return 'in highp vec2 vTexCoord;\n';
      } else {
        return 'out highp vec2 vTexCoord;\n';
      }
    }
  
    _getMainArgumentsString(args) {
      const result = [];
      const argumentTypes = this.argumentTypes;
      const argumentNames = this.argumentNames;
      for (let i = 0; i < argumentNames.length; i++) {
        const value = args[i];
        const name = argumentNames[i];
        const type = argumentTypes[i];
        if (this.hardcodeConstants) {
          if (type === 'Array' || type === 'NumberTexture' || type === 'ArrayTexture(4)') {
            const dim = utils.getDimensions(value, true);
            const size = utils.dimToTexSize({
              floatTextures: this.floatTextures,
              floatOutput: this.floatOutput
            }, dim);
  
            result.push(
              `uniform highp sampler2D user_${ name }`,
              `highp ivec2 user_${ name }Size = ivec2(${ size[0] }, ${ size[1] })`,
              `highp ivec3 user_${ name }Dim = ivec3(${ dim[0] }, ${ dim[1]}, ${ dim[2] })`,
              `uniform highp int user_${ name }BitRatio`
            );
          } else if (type === 'Integer') {
            result.push(`highp float user_${ name } = ${ value }.0`);
          } else if (type === 'Float') {
            result.push(`highp float user_${ name } = ${ value }`);
          }
        } else {
          if (type === 'Array' || type === 'NumberTexture' || type === 'ArrayTexture(4)' || type === 'Input' || type === 'HTMLImage') {
            result.push(
              `uniform highp sampler2D user_${ name }`,
              `uniform highp ivec2 user_${ name }Size`,
              `uniform highp ivec3 user_${ name }Dim`
            );
            if (type !== 'HTMLImage') {
              result.push(`uniform highp int user_${ name }BitRatio`)
            }
          } else if (type === 'HTMLImageArray') {
            result.push(
              `uniform highp sampler2DArray user_${ name }`,
              `uniform highp ivec2 user_${ name }Size`,
              `uniform highp ivec3 user_${ name }Dim`
            );
          } else if (type === 'Integer' || type === 'Float' || type === 'Number') {
            result.push(`uniform float user_${ name }`);
          } else {
            throw new Error(`Param type ${type} not supported in WebGL2`);
          }
        }
      }
      return this._linesToString(result);
    }
  
    _getKernelString() {
      const result = [];
      const subKernels = this.subKernels;
      if (subKernels !== null) {
        result.push('float kernelResult = 0.0');
        result.push('layout(location = 0) out vec4 data0');
        for (let i = 0; i < subKernels.length; i++) {
          result.push(
            `float subKernelResult_${ subKernels[i].name } = 0.0`,
            `layout(location = ${ i + 1 }) out vec4 data${ i + 1 }`
          );
        }
      } else {
        result.push('out vec4 data0');
        result.push('float kernelResult = 0.0');
      }
  
      const functionBuilder = FunctionBuilder.fromKernel(this, WebGL2FunctionNode, {
        fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy
      });
  
      return this._linesToString(result) + functionBuilder.getPrototypeString('kernel');
    }
  
    _getMainResultString() {
      const subKernels = this.subKernels;
      const result = [];
  
      if (this.floatOutput) {
        result.push('  index *= 4');
      }
  
      if (this.graphical) {
        result.push(
          '  threadId = indexTo3D(index, uOutputDim)',
          '  kernel()',
          '  data0 = actualColor'
        );
      } else if (this.floatOutput) {
        const channels = ['r', 'g', 'b', 'a'];
  
        for (let i = 0; i < channels.length; ++i) {
          result.push('  threadId = indexTo3D(index, uOutputDim)');
          result.push('  kernel()');
  
          if (subKernels) {
            result.push(`  data0.${channels[i]} = kernelResult`);
  
            for (let j = 0; j < subKernels.length; ++j) {
              result.push(`  data${ j + 1 }.${channels[i]} = subKernelResult_${ subKernels[j].name }`);
            }
          } else {
            result.push(`  data0.${channels[i]} = kernelResult`);
          }
  
          if (i < channels.length - 1) {
            result.push('  index += 1');
          }
        }
      } else if (subKernels !== null) {
        result.push('  threadId = indexTo3D(index, uOutputDim)');
        result.push('  kernel()');
        result.push('  data0 = encode32(kernelResult)');
        for (let i = 0; i < subKernels.length; i++) {
          result.push(`  data${ i + 1 } = encode32(subKernelResult_${ subKernels[i].name })`);
        }
      } else {
        result.push(
          '  threadId = indexTo3D(index, uOutputDim)',
          '  kernel()',
          '  data0 = encode32(kernelResult)'
        );
      }
  
      return this._linesToString(result);
    }
  
    getFragmentShader(args) {
      if (this.compiledFragmentShader !== null) {
        return this.compiledFragmentShader;
      }
      return this.compiledFragmentShader = this.replaceArtifacts(this.constructor.fragmentShader, this._getFragShaderArtifactMap(args));
    }
  
    getVertexShader(args) {
      if (this.compiledVertexShader !== null) {
        return this.compiledVertexShader;
      }
      return this.compiledVertexShader = this.constructor.vertexShader;
    }
  
    destroyExtensions() {
      this.extensions.EXT_color_buffer_float = null;
      this.extensions.OES_texture_float_linear = null;
    }
  
    toJSON() {
      const json = super.toJSON();
      json.functionNodes = FunctionBuilder.fromKernel(this, WebGL2FunctionNode).toJSON();
      return json;
    }
  }
  
  module.exports = {
    WebGL2Kernel
  };
  },{"../../texture":28,"../../utils":29,"../function-builder":8,"../web-gl/kernel":16,"./fragment-shader":18,"./function-node":19,"./vertex-shader":21}],21:[function(require,module,exports){
  const vertexShader = `#version 300 es
  precision highp float;
  precision highp int;
  precision highp sampler2D;
  
  in vec2 aPos;
  in vec2 aTexCoord;
  
  out vec2 vTexCoord;
  uniform vec2 ratio;
  
  void main(void) {
    gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
    vTexCoord = aTexCoord;
  }`;
  
  module.exports = {
    vertexShader
  };
  },{}],22:[function(require,module,exports){
  const lib = require('./index');
  const GPU = lib.GPU;
  for (const p in lib) {
    if (!lib.hasOwnProperty(p)) continue;
    if (p === 'GPU') continue; 
    GPU[p] = lib[p];
  }
  if (typeof module !== 'undefined') {
    module.exports = GPU;
  }
  if (typeof window !== 'undefined') {
    window.GPU = GPU;
  }
  if (typeof self !== 'undefined') {
    self.GPU = GPU;
  }
  },{"./index":24}],23:[function(require,module,exports){
  const gpuMock = require('gpu-mock.js');
  const {
    utils
  } = require('./utils');
  const {
    CPUKernel
  } = require('./backend/cpu/kernel');
  const {
    HeadlessGLKernel
  } = require('./backend/headless-gl/kernel');
  const {
    WebGL2Kernel
  } = require('./backend/web-gl2/kernel');
  const {
    WebGLKernel
  } = require('./backend/web-gl/kernel');
  const {
    kernelRunShortcut
  } = require('./kernel-run-shortcut');
  
  
  const kernelOrder = [HeadlessGLKernel, WebGL2Kernel, WebGLKernel];
  
  const kernelTypes = ['gpu', 'cpu'];
  
  const internalKernels = {
    'headlessgl': HeadlessGLKernel,
    'webgl2': WebGL2Kernel,
    'webgl': WebGLKernel,
  };
  
  class GPU {
    static get isGPUSupported() {
      return kernelOrder.some(Kernel => Kernel.isSupported);
    }
  
    static get isKernelMapSupported() {
      return kernelOrder.some(Kernel => Kernel.isSupported && Kernel.features.kernelMap);
    }
  
    static get isOffscreenCanvasSupported() {
      return (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') || typeof importScripts !== 'undefined';
    }
  
    static get isWebGLSupported() {
      return WebGLKernel.isSupported;
    }
  
    static get isWebGL2Supported() {
      return WebGL2Kernel.isSupported;
    }
  
    static get isHeadlessGLSupported() {
      return HeadlessGLKernel.isSupported;
    }
  
    static get isCanvasSupported() {
      return typeof HTMLCanvasElement !== 'undefined';
    }
  
    static get isGPUHTMLImageArraySupported() {
      return WebGL2Kernel.isSupported;
    }
  
    static get isFloatOutputSupported() {
      return kernelOrder.some(Kernel => Kernel.isSupported && Kernel.features.isFloatRead && Kernel.features.isTextureFloat);
    }
  
    constructor(settings) {
      settings = settings || {};
      this.canvas = settings.canvas || null;
      this.context = settings.context || null;
      this.mode = settings.mode;
      if (this.mode === 'dev') return;
      this.Kernel = null;
      this.kernels = [];
      this.functions = [];
      this.nativeFunctions = [];
  
      if (settings.functions) {
        for (let i = 0; i < settings.functions.length; i++) {
          this.addFunction(settings.functions[i]);
        }
      }
  
      if (settings.nativeFunctions) {
        for (const p in settings.nativeFunctions) {
          this.addNativeFunction(p, settings.nativeFunctions[p]);
        }
      }
  
      this.chooseKernel();
    }
  
    chooseKernel() {
      if (this.Kernel) return;
  
      let Kernel = null;
  
      if (this.context) {
        for (let i = 0; i < kernelOrder.length; i++) {
          const ExternalKernel = kernelOrder[i];
          if (ExternalKernel.isContextMatch(this.context)) {
            Kernel = ExternalKernel;
            break;
          }
        }
        if (Kernel === null) {
          throw new Error('unknown Context');
        }
      } else if (this.mode) {
        if (this.mode in internalKernels) {
          if (internalKernels[this.mode].isSupported) {
            Kernel = internalKernels[this.mode];
          }
        } else if (this.mode === 'gpu') {
          for (let i = 0; i < kernelOrder.length; i++) {
            if (kernelOrder[i].isSupported) {
              Kernel = kernelOrder[i];
              break;
            }
          }
        } else if (this.mode === 'cpu') {
          Kernel = CPUKernel;
        }
        if (!Kernel) {
          throw new Error(`A requested mode of "${this.mode}" and is not supported`);
        }
      } else {
        for (let i = 0; i < kernelOrder.length; i++) {
          if (kernelOrder[i].isSupported) {
            Kernel = kernelOrder[i];
            break;
          }
        }
        if (!Kernel) {
          Kernel = CPUKernel;
        }
      }
  
      if (!this.mode) {
        this.mode = Kernel.mode;
      }
      this.Kernel = Kernel;
    }
  
    createKernel(source, settings) {
      if (typeof source === 'undefined') {
        throw new Error('Missing source parameter');
      }
      if (typeof source !== 'object' && !utils.isFunction(source) && typeof source !== 'string') {
        throw new Error('source parameter not a function');
      }
  
      if (this.mode === 'dev') {
        return gpuMock(source, settings);
      }
  
      source = typeof source === 'function' ? source.toString() : source;
      const mergedSettings = Object.assign({
        context: this.context,
        canvas: this.canvas,
        functions: this.functions,
        nativeFunctions: this.nativeFunctions
      }, settings || {});
  
      const kernel = kernelRunShortcut(new this.Kernel(source, mergedSettings));
  
      if (!this.canvas) {
        this.canvas = kernel.canvas;
      }
  
      if (!this.context) {
        this.context = kernel.context;
      }
  
      this.kernels.push(kernel);
  
      return kernel;
    }
  
    createKernelMap() {
      let fn;
      let settings;
      if (typeof arguments[arguments.length - 2] === 'function') {
        fn = arguments[arguments.length - 2];
        settings = arguments[arguments.length - 1];
      } else {
        fn = arguments[arguments.length - 1];
      }
  
      if (!this.Kernel.isSupported || !this.Kernel.features.kernelMap) {
        if (this.mode && kernelTypes.indexOf(this.mode) < 0) {
          throw new Error(`kernelMap not supported on ${this.Kernel.name}`);
        }
      }
  
      const kernel = this.createKernel(fn, settings);
      if (Array.isArray(arguments[0])) {
        const functions = arguments[0];
        for (let i = 0; i < functions.length; i++) {
          const source = functions[i].toString();
          const name = utils.getFunctionNameFromString(source);
          kernel.addSubKernel({
            name,
            source,
            property: i,
          });
        }
      } else {
        const functions = arguments[0];
        for (let p in functions) {
          if (!functions.hasOwnProperty(p)) continue;
          const source = functions[p].toString();
          const name = utils.getFunctionNameFromString(source);
          kernel.addSubKernel({
            name: name || p,
            source,
            property: p,
          });
        }
      }
  
      return kernel;
    }
  
    combineKernels() {
      const lastKernel = arguments[arguments.length - 2];
      const combinedKernel = arguments[arguments.length - 1];
      if (this.mode === 'cpu') return combinedKernel;
  
      const canvas = arguments[0].canvas;
      let context = arguments[0].context;
  
      for (let i = 0; i < arguments.length - 1; i++) {
        arguments[i]
          .setCanvas(canvas)
          .setContext(context)
          .setPipeline(true);
      }
  
      return function() {
        combinedKernel.apply(null, arguments);
        const texSize = lastKernel.texSize;
        const gl = lastKernel.context;
        const threadDim = lastKernel.threadDim;
        let result;
        if (lastKernel.floatOutput) {
          const w = texSize[0];
          const h = Math.ceil(texSize[1] / 4);
          result = new Float32Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
        } else {
          const bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
          gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
          result = new Float32Array(bytes.buffer);
        }
  
        result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);
  
        if (lastKernel.output.length === 1) {
          return result;
        } else if (lastKernel.output.length === 2) {
          return utils.splitArray(result, lastKernel.output[0]);
        } else if (lastKernel.output.length === 3) {
          const cube = utils.splitArray(result, lastKernel.output[0] * lastKernel.output[1]);
          return cube.map(function(x) {
            return utils.splitArray(x, lastKernel.output[0]);
          });
        }
      };
    }
  
    addFunction(source, settings) {
      settings = settings || {};
      if (typeof source !== 'string' && typeof source !== 'function') throw new Error('source not a string or function');
      const sourceString = typeof source === 'string' ? source : source.toString();
  
      let argumentTypes = [];
  
      if (typeof settings.argumentTypes === 'object') {
        argumentTypes = utils.getArgumentNamesFromString(sourceString)
          .map(name => settings.argumentTypes[name]) || [];
      } else {
        argumentTypes = settings.argumentTypes || [];
      }
  
      this.functions.push({
        source: sourceString,
        argumentTypes,
        returnType: settings.returnType
      });
      return this;
    }
  
    addNativeFunction(name, source, settings) {
      if (this.kernels.length > 0) {
        throw new Error('Cannot call "addNativeFunction" after "createKernels" has been called.');
      }
      this.nativeFunctions.push({
        name,
        source,
        settings
      });
      return this;
    }
  
    destroy() {
      setTimeout(() => {
        for (let i = 0; i < this.kernels.length; i++) {
          this.kernels[i].destroy(true); 
        }
        this.kernels[0].kernel.constructor.destroyContext(this.context);
      }, 0);
    }
  }
  
  module.exports = {
    GPU,
    kernelOrder,
    kernelTypes
  };
  },{"./backend/cpu/kernel":7,"./backend/headless-gl/kernel":11,"./backend/web-gl/kernel":16,"./backend/web-gl2/kernel":20,"./kernel-run-shortcut":26,"./utils":29,"gpu-mock.js":3}],24:[function(require,module,exports){
  const {
    GPU
  } = require('./gpu');
  const {
    alias
  } = require('./alias');
  const {
    utils
  } = require('./utils');
  const {
    Input,
    input
  } = require('./input');
  const {
    Texture
  } = require('./texture');
  const {
    FunctionBuilder
  } = require('./backend/function-builder');
  const {
    FunctionNode
  } = require('./backend/function-node');
  const {
    CPUFunctionNode
  } = require('./backend/cpu/function-node');
  const {
    CPUKernel
  } = require('./backend/cpu/kernel');
  
  const {
    HeadlessGLKernel
  } = require('./backend/headless-gl/kernel');
  
  const {
    WebGLFunctionNode
  } = require('./backend/web-gl/function-node');
  const {
    WebGLKernel
  } = require('./backend/web-gl/kernel');
  
  const {
    WebGL2FunctionNode
  } = require('./backend/web-gl2/function-node');
  const {
    WebGL2Kernel
  } = require('./backend/web-gl2/kernel');
  
  module.exports = {
    alias,
    CPUFunctionNode,
    CPUKernel,
    GPU,
    FunctionBuilder,
    FunctionNode,
    HeadlessGLKernel,
    Input,
    input,
    Texture,
    utils,
    WebGL2FunctionNode,
    WebGL2Kernel,
    WebGLFunctionNode,
    WebGLKernel,
  };
  },{"./alias":4,"./backend/cpu/function-node":5,"./backend/cpu/kernel":7,"./backend/function-builder":8,"./backend/function-node":9,"./backend/headless-gl/kernel":11,"./backend/web-gl/function-node":14,"./backend/web-gl/kernel":16,"./backend/web-gl2/function-node":19,"./backend/web-gl2/kernel":20,"./gpu":23,"./input":25,"./texture":28,"./utils":29}],25:[function(require,module,exports){
  class Input {
    constructor(value, size) {
      this.value = value;
      if (Array.isArray(size)) {
        this.size = [];
        for (let i = 0; i < size.length; i++) {
          this.size[i] = size[i];
        }
        while (this.size.length < 3) {
          this.size.push(1);
        }
      } else {
        if (size.z) {
          this.size = [size.x, size.y, size.z];
        } else if (size.y) {
          this.size = [size.x, size.y, 1];
        } else {
          this.size = [size.x, 1, 1];
        }
      }
    }
  }
  
  function input(value, size) {
    return new Input(value, size);
  }
  
  module.exports = {
    Input,
    input
  };
  },{}],26:[function(require,module,exports){
  const {
    utils
  } = require('./utils');
  
  function kernelRunShortcut(kernel) {
    const shortcut = function() {
      return kernel.run.apply(kernel, arguments);
    };
  
    utils
      .allPropertiesOf(kernel)
      .forEach((key) => {
        if (key[0] === '_' && key[1] === '_') return;
        if (typeof kernel[key] === 'function') {
          if (key.substring(0, 3) === 'add' || key.substring(0, 3) === 'set') {
            shortcut[key] = function() {
              kernel[key].apply(kernel, arguments);
              return shortcut;
            };
          } else {
            shortcut[key] = kernel[key].bind(kernel);
          }
        } else {
          shortcut.__defineGetter__(key, () => {
            return kernel[key];
          });
          shortcut.__defineSetter__(key, (value) => {
            kernel[key] = value;
          });
        }
      });
  
    shortcut.kernel = kernel;
  
    return shortcut;
  }
  
  module.exports = {
    kernelRunShortcut
  };
  },{"./utils":29}],27:[function(require,module,exports){
  const source = `
  
  uniform highp float triangle_noise_seed;
  highp float triangle_noise_shift = 0.000001;
  
  //https://www.shadertoy.com/view/4t2SDh
  //note: uniformly distributed, normalized rand, [0;1[
  float nrand( vec2 n )
  {
    return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
  }
  //note: remaps v to [0;1] in interval [a;b]
  float remap( float a, float b, float v )
  {
    return clamp( (v-a) / (b-a), 0.0, 1.0 );
  }
  
  float n4rand( vec2 n )
  {
    float t = fract( triangle_noise_seed + triangle_noise_shift );
    float nrnd0 = nrand( n + 0.07*t );
    float nrnd1 = nrand( n + 0.11*t );	
    float nrnd2 = nrand( n + 0.13*t );
    float nrnd3 = nrand( n + 0.17*t );
    float result = (nrnd0+nrnd1+nrnd2+nrnd3) / 4.0;
    triangle_noise_shift = result + 0.000001;
    return result;
  }`;
  
  const name = 'triangle-noise-noise';
  
  const functionMatch = 'Math.random()';
  
  const functionReplace = 'n4rand(vTexCoord)';
  
  const functionReturnType = 'Number';
  
  const onBeforeRun = (kernel) => {
    kernel.setUniform1f('triangle_noise_seed', Math.random());
  };
  
  module.exports = {
    name,
    onBeforeRun,
    functionMatch,
    functionReplace,
    functionReturnType,
    source
  };
  },{}],28:[function(require,module,exports){
  class Texture {
    constructor(texture, size, dimensions, output, context, type = 'NumberTexture') {
      this.texture = texture;
      this.size = size;
      this.dimensions = dimensions;
      this.output = output;
      this.context = context;
      this.kernel = null;
      this.type = type;
    }
  
    toArray(gpu) {
      if (!gpu) throw new Error('You need to pass the GPU object for toArray to work.');
      if (this.kernel) return this.kernel(this);
  
      this.kernel = gpu.createKernel(function(x) {
        return x[this.thread.z][this.thread.y][this.thread.x];
      }).setOutput(this.output);
  
      return this.kernel(this);
    }
  
    delete() {
      return this.context.deleteTexture(this.texture);
    }
  }
  
  module.exports = {
    Texture
  };
  },{}],29:[function(require,module,exports){
  const {
    Input
  } = require('./input');
  const {
    Texture
  } = require('./texture');
  
  const FUNCTION_NAME = /function ([^(]*)/;
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  
  const utils = {
    systemEndianness() {
      return _systemEndianness;
    },
    getSystemEndianness() {
      const b = new ArrayBuffer(4);
      const a = new Uint32Array(b);
      const c = new Uint8Array(b);
      a[0] = 0xdeadbeef;
      if (c[0] === 0xef) return 'LE';
      if (c[0] === 0xde) return 'BE';
      throw new Error('unknown endianness');
    },
  
    isFunction(funcObj) {
      return typeof(funcObj) === 'function';
    },
  
    isFunctionString(fn) {
      if (typeof fn === 'string') {
        return (fn
          .slice(0, 'function'.length)
          .toLowerCase() === 'function');
      }
      return false;
    },
  
    getFunctionNameFromString(funcStr) {
      return FUNCTION_NAME.exec(funcStr)[1].trim();
    },
  
    getFunctionBodyFromString(funcStr) {
      return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
    },
  
    getArgumentNamesFromString(fn) {
      const fnStr = fn.replace(STRIP_COMMENTS, '');
      let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null) {
        result = [];
      }
      return result;
    },
  
    clone(obj) {
      if (obj === null || typeof obj !== 'object' || obj.hasOwnProperty('isActiveClone')) return obj;
  
      const temp = obj.constructor(); 
  
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj.isActiveClone = null;
          temp[key] = utils.clone(obj[key]);
          delete obj.isActiveClone;
        }
      }
  
      return temp;
    },
  
    isArray(array) {
      return !isNaN(array.length);
    },
  
    getVariableType(value) {
      if (utils.isArray(value)) {
        if (value[0].nodeName === 'IMG') {
          return 'HTMLImageArray';
        }
        return 'Array';
      } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          return 'Integer';
        }
        return 'Float';
      } else if (value instanceof Texture) {
        return value.type;
      } else if (value instanceof Input) {
        return 'Input';
      } else if (value.nodeName === 'IMG') {
        return 'HTMLImage';
      } else {
        return 'Unknown';
      }
    },
  
  
    dimToTexSize(opt, dimensions, output) {
      let numTexels = dimensions[0];
      let w = dimensions[0];
      let h = dimensions[1];
      for (let i = 1; i < dimensions.length; i++) {
        numTexels *= dimensions[i];
      }
  
      if (opt.floatTextures && (!output || opt.floatOutput)) {
        w = numTexels = Math.ceil(numTexels / 4);
      }
      if (h > 1 && w * h === numTexels) {
        return [w, h];
      }
      const sqrt = Math.sqrt(numTexels);
      let high = Math.ceil(sqrt);
      let low = Math.floor(sqrt);
      while (high * low > numTexels) {
        high--;
        low = Math.ceil(numTexels / high);
      }
      w = low;
      h = Math.ceil(numTexels / w);
      return [w, h];
    },
  
    getDimensions(x, pad) {
      let ret;
      if (utils.isArray(x)) {
        const dim = [];
        let temp = x;
        while (utils.isArray(temp)) {
          dim.push(temp.length);
          temp = temp[0];
        }
        ret = dim.reverse();
      } else if (x instanceof Texture) {
        ret = x.output;
      } else if (x instanceof Input) {
        ret = x.size;
      } else {
        throw new Error('Unknown dimensions of ' + x);
      }
  
      if (pad) {
        ret = utils.clone(ret);
        while (ret.length < 3) {
          ret.push(1);
        }
      }
  
      return new Int32Array(ret);
    },
  
    flatten2dArrayTo(array, target) {
      let offset = 0;
      for (let y = 0; y < array.length; y++) {
        target.set(array[y], offset);
        offset += array[y].length;
      }
    },
  
    flatten3dArrayTo(array, target) {
      let offset = 0;
      for (let z = 0; z < array.length; z++) {
        for (let y = 0; y < array[z].length; y++) {
          target.set(array[z][y], offset);
          offset += array[z][y].length;
        }
      }
    },
  
    flattenTo(array, target) {
      if (utils.isArray(array[0])) {
        if (utils.isArray(array[0][0])) {
          utils.flatten3dArrayTo(array, target);
        } else {
          utils.flatten2dArrayTo(array, target);
        }
      } else {
        target.set(array);
      }
    },
  
    splitArray(array, part) {
      const result = [];
      for (let i = 0; i < array.length; i += part) {
        result.push(new array.constructor(array.buffer, i * 4 + array.byteOffset, part));
      }
      return result;
    },
  
    getAstString(source, ast) {
      const lines = Array.isArray(source) ? source : source.split(/\r?\n/g);
      const start = ast.loc.start;
      const end = ast.loc.end;
      const result = [];
      result.push(lines[start.line - 1].slice(start.column));
      for (let i = start.line; i < end.line - 1; i++) {
        result.push(lines[i]);
      }
      result.push(lines[end.line - 1].slice(0, end.column));
      return result.join('\n');
    },
  
    allPropertiesOf(obj) {
      const props = [];
  
      do {
        props.push.apply(props, Object.getOwnPropertyNames(obj));
      } while (obj = Object.getPrototypeOf(obj));
  
      return props;
    }
  };
  
  const _systemEndianness = utils.getSystemEndianness();
  
  module.exports = {
    utils
  };
  },{"./input":25,"./texture":28}]},{},[22]);
  