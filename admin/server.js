/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/App */ "./src/shared/App.js");
/* harmony import */ var _shared_routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/routes */ "./src/shared/routes.js");
const express = __webpack_require__(/*! express */ "express");

const cors = __webpack_require__(/*! cors */ "cors");

const React = __webpack_require__(/*! react */ "react");

const {
  renderToString
} = __webpack_require__(/*! react-dom/server */ "react-dom/server");

const {
  StaticRouter,
  matchPath
} = __webpack_require__(/*! react-router-dom */ "react-router-dom");

const serialize = __webpack_require__(/*! serialize-javascript */ "serialize-javascript"); // import { renderToString } from 'react-dom/server'
// import { StaticRouter, matchPath } from 'react-router-dom'
// import serialize from 'serialize-javascript'




const app = express();
const PORT = 4190;
app.use(cors());
app.use(express.static('public'));
app.get('*', (req, res, next) => {
  const activeRoute = _shared_routes__WEBPACK_IMPORTED_MODULE_1__["default"].find(route => matchPath(req.url, route)) || {};
  console.log('url: ', req.url);
  const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req.path) : Promise.resolve();
  promise.then(data => {
    const context = {
      data
    };
    const str = renderToString(React.createElement(StaticRouter, {
      location: req.url,
      context: context
    }, React.createElement(_shared_App__WEBPACK_IMPORTED_MODULE_0__["default"], null)));
    res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>SSR with RR</title>
					<script src="/bundle.js" defer></script>
					<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
				</head>
				<body>
					<div id="app">${str}</div>
				</body>
			</html>
		`);
  }).catch(next);
});
app.listen(PORT, () => {
  console.log(`应用启动端口: ${PORT}`);
});

/***/ }),

/***/ "./src/shared/App.js":
/*!***************************!*\
  !*** ./src/shared/App.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./routes */ "./src/shared/routes.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Navbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Navbar */ "./src/shared/Navbar.js");
/* harmony import */ var _NoMatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NoMatch */ "./src/shared/NoMatch.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }







class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Navbar__WEBPACK_IMPORTED_MODULE_3__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Switch"], null, _routes__WEBPACK_IMPORTED_MODULE_1__["default"].map((_ref) => {
      let {
        path,
        exact,
        component: Component
      } = _ref,
          rest = _objectWithoutProperties(_ref, ["path", "exact", "component"]);

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
        key: path,
        path: path,
        exact: exact,
        render: props => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Component, _extends({}, props, rest))
      });
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
      render: props => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_NoMatch__WEBPACK_IMPORTED_MODULE_4__["default"], props)
    })));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "./src/shared/Home.js":
/*!****************************!*\
  !*** ./src/shared/Home.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Home() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Select a Language");
}

/***/ }),

/***/ "./src/shared/List.js":
/*!****************************!*\
  !*** ./src/shared/List.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Upload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Upload */ "./src/shared/Upload.js");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_2__);




class List extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    let repos;

    if (false) {} else {
      repos = this.props.staticContext.data;
    }

    this.state = {
      repos,
      loading: !repos
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const {
      loading,
      repos
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Upload__WEBPACK_IMPORTED_MODULE_1__["default"], null);
    if (loading) return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "LOADING");
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      style: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    }, repos.map(({
      name,
      owner,
      stargazers_count,
      html_url
    }) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      key: name,
      style: {
        margin: 30
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: html_url
    }, name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, "@", owner.login), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, stargazers_count, " stars")))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (List);

/***/ }),

/***/ "./src/shared/Navbar.js":
/*!******************************!*\
  !*** ./src/shared/Navbar.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Navbar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);


const names = ['All', 'JavaScript', 'Ruby', 'Python', 'Java'];
const languages = names.map(name => ({
  name,
  param: name.toLocaleLowerCase()
}));
function Navbar() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, languages.map(({
    name,
    param
  }) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
    key: param
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["NavLink"], {
    activeStyle: {
      fontWeight: 'bold'
    },
    to: `/${param}`
  }, name))));
}

/***/ }),

/***/ "./src/shared/NoMatch.js":
/*!*******************************!*\
  !*** ./src/shared/NoMatch.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NoMatch; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function NoMatch() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Four Oh Four");
}

/***/ }),

/***/ "./src/shared/Upload.js":
/*!******************************!*\
  !*** ./src/shared/Upload.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "./src/shared/api.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Upload extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "fileChange", ({
      target
    }) => {
      const {
        files: [file]
      } = target;
      Object(_api__WEBPACK_IMPORTED_MODULE_2__["videoUpload"])(file).then(res => {
        console.log(res);
        target.value = '';
      }).catch(e => {
        target.value = '';
      });
    });
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "file",
      accept: '.mp4',
      onChange: this.fileChange
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Upload);

/***/ }),

/***/ "./src/shared/api.js":
/*!***************************!*\
  !*** ./src/shared/api.js ***!
  \***************************/
/*! exports provided: fetchPopularRepos, videoList, videoUpload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchPopularRepos", function() { return fetchPopularRepos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "videoList", function() { return videoList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "videoUpload", function() { return videoUpload; });
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-fetch */ "isomorphic-fetch");
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__);

function fetchPopularRepos(language = 'all') {
  const encodedURI = encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
  return isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()(encodedURI).then(data => data.json()).then(repos => repos.items).catch(error => {
    console.warn(error);
    return null;
  });
} // 视频列表

function videoList() {
  return isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()('http://0.0.0.0:4090/admin/videos').then(data => data.json()).then(repos => repos).catch(error => {
    console.warn(error);
    return null;
  });
} // 视频上传

function videoUpload(file, onProgress) {
  return new Promise((res, rol) => {
    let form = new FormData(),
        xhr = new XMLHttpRequest();
    xhr.open('put', 'http://0.0.0.0:4090/admin/videos', true);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (xhr.status == 200) {
          let {
            responseText
          } = this,
              {
            code,
            msg,
            data
          } = JSON.parse(responseText);
          if (code === '0000') return res(data);else rol(msg);
        } else {
          rol();
        }
      }
    };

    form.append('file', file);
    xhr.send(form);
    if (onProgress) xhr.onProgress = onProgress;
  });
}

/***/ }),

/***/ "./src/shared/routes.js":
/*!******************************!*\
  !*** ./src/shared/routes.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Home__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home */ "./src/shared/Home.js");
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./List */ "./src/shared/List.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "./src/shared/api.js");
 // import Grid from './Grid'



const routes = [{
  path: '/',
  exact: true,
  component: _Home__WEBPACK_IMPORTED_MODULE_0__["default"]
}, // {
// 	path: '/:id',
// 	component: Grid,
// 	fetchInitialData: (path = '') => fetchPopularRepos(path)
// }
{
  path: '/videos',
  component: _List__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetchInitialData: (path = '') => Object(_api__WEBPACK_IMPORTED_MODULE_2__["videoList"])()
}];
/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "@alifd/next":
/*!******************************!*\
  !*** external "@alifd/next" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@alifd/next");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "isomorphic-fetch":
/*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "serialize-javascript":
/*!***************************************!*\
  !*** external "serialize-javascript" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL0hvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9MaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvTmF2YmFyLmpzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvTm9NYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL1VwbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL3JvdXRlcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYWxpZmQvbmV4dFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaXNvbW9ycGhpYy1mZXRjaFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LXJvdXRlci1kb21cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwiY29ycyIsIlJlYWN0IiwicmVuZGVyVG9TdHJpbmciLCJTdGF0aWNSb3V0ZXIiLCJtYXRjaFBhdGgiLCJzZXJpYWxpemUiLCJhcHAiLCJQT1JUIiwidXNlIiwic3RhdGljIiwiZ2V0IiwicmVxIiwicmVzIiwibmV4dCIsImFjdGl2ZVJvdXRlIiwicm91dGVzIiwiZmluZCIsInJvdXRlIiwidXJsIiwiY29uc29sZSIsImxvZyIsInByb21pc2UiLCJmZXRjaEluaXRpYWxEYXRhIiwicGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsImRhdGEiLCJjb250ZXh0Iiwic3RyIiwic2VuZCIsImNhdGNoIiwibGlzdGVuIiwiQXBwIiwiQ29tcG9uZW50IiwicmVuZGVyIiwibWFwIiwiZXhhY3QiLCJjb21wb25lbnQiLCJyZXN0IiwicHJvcHMiLCJIb21lIiwiTGlzdCIsImNvbnN0cnVjdG9yIiwicmVwb3MiLCJfX2lzQnJvd3Nlcl9fIiwic3RhdGljQ29udGV4dCIsInN0YXRlIiwibG9hZGluZyIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwiZGlzcGxheSIsImZsZXhXcmFwIiwibmFtZSIsIm93bmVyIiwic3RhcmdhemVyc19jb3VudCIsImh0bWxfdXJsIiwibWFyZ2luIiwibG9naW4iLCJuYW1lcyIsImxhbmd1YWdlcyIsInBhcmFtIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJOYXZiYXIiLCJmb250V2VpZ2h0IiwiTm9NYXRjaCIsIlVwbG9hZCIsInRhcmdldCIsImZpbGVzIiwiZmlsZSIsInZpZGVvVXBsb2FkIiwidmFsdWUiLCJlIiwiZmlsZUNoYW5nZSIsImZldGNoUG9wdWxhclJlcG9zIiwibGFuZ3VhZ2UiLCJlbmNvZGVkVVJJIiwiZW5jb2RlVVJJIiwiZmV0Y2giLCJqc29uIiwiaXRlbXMiLCJlcnJvciIsIndhcm4iLCJ2aWRlb0xpc3QiLCJvblByb2dyZXNzIiwicm9sIiwiZm9ybSIsIkZvcm1EYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsInJlc3BvbnNlVGV4dCIsImNvZGUiLCJtc2ciLCJKU09OIiwicGFyc2UiLCJhcHBlbmQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFD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Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEsNkM7Ozs7Ozs7Ozs7O0FDQUEsaUQiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3NlcnZlci9pbmRleC5qc1wiKTtcbiIsImNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJylcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJylcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKVxuY29uc3QgeyByZW5kZXJUb1N0cmluZyB9ID0gcmVxdWlyZSgncmVhY3QtZG9tL3NlcnZlcicpXG5jb25zdCB7IFN0YXRpY1JvdXRlciwgbWF0Y2hQYXRoIH0gPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXItZG9tJylcbmNvbnN0IHNlcmlhbGl6ZSA9IHJlcXVpcmUoJ3NlcmlhbGl6ZS1qYXZhc2NyaXB0Jylcbi8vIGltcG9ydCB7IHJlbmRlclRvU3RyaW5nIH0gZnJvbSAncmVhY3QtZG9tL3NlcnZlcidcbi8vIGltcG9ydCB7IFN0YXRpY1JvdXRlciwgbWF0Y2hQYXRoIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcbi8vIGltcG9ydCBzZXJpYWxpemUgZnJvbSAnc2VyaWFsaXplLWphdmFzY3JpcHQnXG5pbXBvcnQgQXBwIGZyb20gJy4uL3NoYXJlZC9BcHAnXG5pbXBvcnQgcm91dGVzIGZyb20gJy4uL3NoYXJlZC9yb3V0ZXMnXG5cbmNvbnN0IGFwcCAgPSBleHByZXNzKClcbmNvbnN0IFBPUlQgPSA0MTkwXG5cbmFwcC51c2UoY29ycygpKVxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXG5cbmFwcC5nZXQoJyonLCAocmVxLCByZXMsIG5leHQpID0+IHtcblx0Y29uc3QgYWN0aXZlUm91dGUgPSByb3V0ZXMuZmluZChyb3V0ZSA9PiBtYXRjaFBhdGgocmVxLnVybCwgcm91dGUpKSB8fCB7fVxuXG5cdGNvbnNvbGUubG9nKCd1cmw6ICcsIHJlcS51cmwpXG5cdGNvbnN0IHByb21pc2UgPSBhY3RpdmVSb3V0ZS5mZXRjaEluaXRpYWxEYXRhPyBhY3RpdmVSb3V0ZS5mZXRjaEluaXRpYWxEYXRhKHJlcS5wYXRoKTogUHJvbWlzZS5yZXNvbHZlKClcblxuXHRwcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcblx0XHRjb25zdCBjb250ZXh0ID0geyBkYXRhIH1cblxuXHRcdGNvbnN0IHN0ciA9IHJlbmRlclRvU3RyaW5nKFxuXHRcdFx0PFN0YXRpY1JvdXRlciBsb2NhdGlvbj17cmVxLnVybH0gY29udGV4dD17Y29udGV4dH0+XG5cdFx0XHRcdDxBcHAgLz5cblx0XHRcdDwvU3RhdGljUm91dGVyPlxuXHRcdClcblx0XHRyZXMuc2VuZChgXG5cdFx0XHQ8IURPQ1RZUEUgaHRtbD5cblx0XHRcdDxodG1sPlxuXHRcdFx0XHQ8aGVhZD5cblx0XHRcdFx0XHQ8dGl0bGU+U1NSIHdpdGggUlI8L3RpdGxlPlxuXHRcdFx0XHRcdDxzY3JpcHQgc3JjPVwiL2J1bmRsZS5qc1wiIGRlZmVyPjwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzY3JpcHQ+d2luZG93Ll9fSU5JVElBTF9EQVRBX18gPSAke3NlcmlhbGl6ZShkYXRhKX08L3NjcmlwdD5cblx0XHRcdFx0PC9oZWFkPlxuXHRcdFx0XHQ8Ym9keT5cblx0XHRcdFx0XHQ8ZGl2IGlkPVwiYXBwXCI+JHtzdHJ9PC9kaXY+XG5cdFx0XHRcdDwvYm9keT5cblx0XHRcdDwvaHRtbD5cblx0XHRgKVxuXHR9KS5jYXRjaChuZXh0KVxufSlcblxuYXBwLmxpc3RlbihQT1JULCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKGDlupTnlKjlkK/liqjnq6/lj6M6ICR7UE9SVH1gKVxufSkiLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJ1xuaW1wb3J0IHsgUm91dGUsIFN3aXRjaCB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG5pbXBvcnQgTmF2YmFyIGZyb20gJy4vTmF2YmFyJ1xuaW1wb3J0IE5vTWF0Y2ggZnJvbSAnLi9Ob01hdGNoJ1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxOYXZiYXIgLz5cblxuXHRcdFx0XHQ8U3dpdGNoPlxuXHRcdFx0XHRcdHtyb3V0ZXMubWFwKCh7IHBhdGgsIGV4YWN0LCBjb21wb25lbnQ6IENvbXBvbmVudCwgLi4ucmVzdCB9KSA9PiAoXG5cdFx0XHRcdFx0XHQ8Um91dGUga2V5PXtwYXRofSBwYXRoPXtwYXRofSBleGFjdD17ZXhhY3R9IHJlbmRlcj17KHByb3BzKSA9PiAoXG5cdFx0XHRcdFx0XHRcdDxDb21wb25lbnQgey4uLnByb3BzfSB7Li4ucmVzdH0gLz5cblx0XHRcdFx0XHRcdCl9IC8+XG5cdFx0XHRcdFx0KSl9XG5cdFx0XHRcdFx0PFJvdXRlIHJlbmRlcj17KHByb3BzKSA9PiA8Tm9NYXRjaCB7Li4ucHJvcHN9IC8+IH0gLz5cblx0XHRcdFx0PC9Td2l0Y2g+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIb21lICgpIHtcblx0cmV0dXJuIDxkaXY+U2VsZWN0IGEgTGFuZ3VhZ2U8L2Rpdj5cbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVXBsb2FkIGZyb20gJy4vVXBsb2FkJ1xuaW1wb3J0IHsgQnV0dG9uLCBUYWJsZSB9IGZyb20gJ0BhbGlmZC9uZXh0J1xuXG5jbGFzcyBMaXN0IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcylcblxuXHRcdGxldCByZXBvc1xuXHRcdGlmIChfX2lzQnJvd3Nlcl9fKSB7XG5cdFx0XHRyZXBvcyA9IHdpbmRvdy5fX0lOSVRJQUxfREFUQV9fXG5cdFx0XHRkZWxldGUgd2luZG93Ll9fSU5JVElBTF9EQVRBX19cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVwb3MgPSB0aGlzLnByb3BzLnN0YXRpY0NvbnRleHQuZGF0YVxuXHRcdH1cblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHRyZXBvcyxcblx0XHRcdGxvYWRpbmc6ICFyZXBvcyxcblx0XHR9XG5cdH1cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHR9XG5cdGNvbXBvbmVudERpZFVwZGF0ZSAocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0Y29uc3QgeyBsb2FkaW5nLCByZXBvcyB9ID0gdGhpcy5zdGF0ZVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxVcGxvYWQgLz5cblx0XHQpXG5cdFx0aWYgKGxvYWRpbmcpIHJldHVybiA8cD5MT0FESU5HPC9wPlxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDx1bCBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywgZmxleFdyYXA6ICd3cmFwJ319PlxuXHRcdFx0XHR7cmVwb3MubWFwKCh7IG5hbWUsIG93bmVyLCBzdGFyZ2F6ZXJzX2NvdW50LCBodG1sX3VybCB9KSA9PiAoXG5cdFx0XHRcdFx0PGxpIGtleT17bmFtZX0gc3R5bGU9e3ttYXJnaW46IDMwfX0+XG5cdFx0XHRcdFx0XHQ8dWw+XG5cdFx0XHRcdFx0XHRcdDxsaT48YSBocmVmPXtodG1sX3VybH0+e25hbWV9PC9hPjwvbGk+XG5cdFx0XHRcdFx0XHRcdDxsaT5Ae293bmVyLmxvZ2lufTwvbGk+XG5cdFx0XHRcdFx0XHRcdDxsaT57c3RhcmdhemVyc19jb3VudH0gc3RhcnM8L2xpPlxuXHRcdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHQpKX1cblx0XHRcdDwvdWw+XG5cdFx0KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3QiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcblxuY29uc3QgbmFtZXMgPSBbJ0FsbCcsICdKYXZhU2NyaXB0JywgJ1J1YnknLCAnUHl0aG9uJywgJ0phdmEnXVxuY29uc3QgbGFuZ3VhZ2VzID0gbmFtZXMubWFwKG5hbWUgPT4gKHsgbmFtZSwgcGFyYW06IG5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSB9KSlcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2YmFyICgpIHtcblxuXHRyZXR1cm4gKFxuXHRcdDx1bD5cblx0XHRcdHtsYW5ndWFnZXMubWFwKCh7IG5hbWUsIHBhcmFtIH0pID0+IChcblx0XHRcdFx0PGxpIGtleT17cGFyYW19PlxuXHRcdFx0XHRcdDxOYXZMaW5rIGFjdGl2ZVN0eWxlPXt7Zm9udFdlaWdodDogJ2JvbGQnfX0gdG89e2AvJHtwYXJhbX1gfT5cblx0XHRcdFx0XHRcdHtuYW1lfVxuXHRcdFx0XHRcdDwvTmF2TGluaz5cblx0XHRcdFx0PC9saT5cblx0XHRcdCkpfVxuXHRcdDwvdWw+XG5cdClcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vTWF0Y2ggKCkge1xuXHRyZXR1cm4gPGRpdj5Gb3VyIE9oIEZvdXI8L2Rpdj5cbn0iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCdXR0b24sIFRhYmxlIH0gZnJvbSAnQGFsaWZkL25leHQnXG5pbXBvcnQgeyB2aWRlb1VwbG9hZCB9IGZyb20gJy4vYXBpJ1xuXG5jbGFzcyBVcGxvYWQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKVxuXHR9XG5cdGNvbXBvbmVudERpZE1vdW50ICgpIHtcblx0fVxuXHRjb21wb25lbnREaWRVcGRhdGUgKCkge1xuXHR9XG5cdGZpbGVDaGFuZ2UgPSAoeyB0YXJnZXQgfSkgPT4ge1xuXHRcdGNvbnN0IHsgZmlsZXM6IFsgZmlsZSBdIH0gPSB0YXJnZXRcblx0XHR2aWRlb1VwbG9hZChmaWxlKS50aGVuKHJlcyA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpXG5cdFx0XHR0YXJnZXQudmFsdWUgPSAnJ1xuXHRcdH0pLmNhdGNoKGUgPT4ge1xuXHRcdFx0dGFyZ2V0LnZhbHVlID0gJydcblx0XHR9KVxuXHR9XG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PXsnLm1wNCd9IG9uQ2hhbmdlPXt0aGlzLmZpbGVDaGFuZ2V9IC8+XG5cdFx0KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFVwbG9hZCIsImltcG9ydCBmZXRjaCBmcm9tICdpc29tb3JwaGljLWZldGNoJ1xuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQb3B1bGFyUmVwb3MgKGxhbmd1YWdlID0gJ2FsbCcpIHtcblx0Y29uc3QgZW5jb2RlZFVSSSA9IGVuY29kZVVSSShgaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvcmVwb3NpdG9yaWVzP3E9c3RhcnM6PjErbGFuZ3VhZ2U6JHtsYW5ndWFnZX0mc29ydD1zdGFycyZvcmRlcj1kZXNjJnR5cGU9UmVwb3NpdG9yaWVzYClcblxuXHRyZXR1cm4gZmV0Y2goZW5jb2RlZFVSSSlcblx0XHQudGhlbihkYXRhID0+IGRhdGEuanNvbigpKVxuXHRcdC50aGVuKHJlcG9zID0+IHJlcG9zLml0ZW1zKVxuXHRcdC5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oZXJyb3IpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdH0pXG59XG5cbi8vIOinhumikeWIl+ihqFxuZXhwb3J0IGZ1bmN0aW9uIHZpZGVvTGlzdCgpIHtcblx0cmV0dXJuIGZldGNoKCdodHRwOi8vMC4wLjAuMDo0MDkwL2FkbWluL3ZpZGVvcycpXG5cdFx0LnRoZW4oZGF0YSA9PiBkYXRhLmpzb24oKSlcblx0XHQudGhlbihyZXBvcyA9PiByZXBvcylcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGVycm9yKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9KVxufVxuXG4vLyDop4bpopHkuIrkvKBcbmV4cG9ydCBmdW5jdGlvbiB2aWRlb1VwbG9hZChmaWxlLCBvblByb2dyZXNzKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByb2wpID0+IHtcblx0XHRsZXQgZm9ybSA9IG5ldyBGb3JtRGF0YSgpLFxuXHRcdFx0eGhyICA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cdFx0eGhyLm9wZW4oJ3B1dCcsICdodHRwOi8vMC4wLjAuMDo0MDkwL2FkbWluL3ZpZGVvcycgLCB0cnVlKVxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xuXHRcdFx0XHRcdGxldCB7IHJlc3BvbnNlVGV4dCB9ID0gdGhpcyxcblx0XHRcdFx0XHRcdHsgY29kZSwgbXNnLCBkYXRhIH0gPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dClcblx0XHRcdFx0XHRpZiAoY29kZSA9PT0gJzAwMDAnKSByZXR1cm4gcmVzKGRhdGEpXG5cdFx0XHRcdFx0ZWxzZSByb2wobXNnKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJvbCgpXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0XHRmb3JtLmFwcGVuZCgnZmlsZScsIGZpbGUpXG5cdFx0eGhyLnNlbmQoZm9ybSlcblx0XHRpZiAob25Qcm9ncmVzcykgeGhyLm9uUHJvZ3Jlc3MgPSBvblByb2dyZXNzXG5cdH0pXG59IiwiaW1wb3J0IEhvbWUgZnJvbSAnLi9Ib21lJ1xuLy8gaW1wb3J0IEdyaWQgZnJvbSAnLi9HcmlkJ1xuaW1wb3J0IExpc3QgZnJvbSAnLi9MaXN0J1xuaW1wb3J0IHsgdmlkZW9MaXN0IH0gZnJvbSAnLi9hcGknXG5cbmNvbnN0IHJvdXRlcyA9ICBbXG5cdHtcblx0XHRwYXRoOiAnLycsXG5cdFx0ZXhhY3Q6IHRydWUsXG5cdFx0Y29tcG9uZW50OiBIb21lLFxuXHR9LFxuXHQvLyB7XG5cdC8vIFx0cGF0aDogJy86aWQnLFxuXHQvLyBcdGNvbXBvbmVudDogR3JpZCxcblx0Ly8gXHRmZXRjaEluaXRpYWxEYXRhOiAocGF0aCA9ICcnKSA9PiBmZXRjaFBvcHVsYXJSZXBvcyhwYXRoKVxuXHQvLyB9XG5cdHtcblx0XHRwYXRoOiAnL3ZpZGVvcycsXG5cdFx0Y29tcG9uZW50OiBMaXN0LFxuXHRcdGZldGNoSW5pdGlhbERhdGE6IChwYXRoID0gJycpID0+IHZpZGVvTGlzdCgpXG5cdH1cbl1cblxuZXhwb3J0IGRlZmF1bHQgcm91dGVzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGFsaWZkL25leHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlzb21vcnBoaWMtZmV0Y2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtZG9tL3NlcnZlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXItZG9tXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNlcmlhbGl6ZS1qYXZhc2NyaXB0XCIpOyJdLCJzb3VyY2VSb290IjoiIn0=