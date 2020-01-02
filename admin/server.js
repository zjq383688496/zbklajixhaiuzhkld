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
/* harmony import */ var css_modules_require_hook_preset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! css-modules-require-hook/preset */ "css-modules-require-hook/preset");
/* harmony import */ var css_modules_require_hook_preset__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(css_modules_require_hook_preset__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/App */ "./src/shared/App.js");
/* harmony import */ var _shared_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/routes */ "./src/shared/routes.js");
// 处理css


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



 // import '@alifd/next/dist/next.css'

const app = express();
const PORT = 4190;
app.use(cors());
app.use(express.static('public'));
app.get('*', (req, res, next) => {
  const activeRoute = _shared_routes__WEBPACK_IMPORTED_MODULE_2__["default"].find(route => matchPath(req.url, route)) || {};
  console.log('url: ', req.url);
  const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req.path) : Promise.resolve();
  const route = {};

  if (activeRoute) {
    route.name = activeRoute.name;
    route.path = activeRoute.path;
  }

  promise.then(data => {
    const context = {
      data
    };
    const str = renderToString(React.createElement(StaticRouter, {
      location: req.url,
      context: context
    }, React.createElement(_shared_App__WEBPACK_IMPORTED_MODULE_1__["default"], null)));
    res.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>SSR with RR</title>
					<script>window.__INITIAL_DATA__ = ${serialize(data)} || {}</script>
					<script>window.__ROUTER_DATA__  = ${serialize(route)}</script>
					<script src="/bundle.js" defer></script>
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
/* harmony import */ var _alifd_next_dist_next_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @alifd/next/dist/next.css */ "@alifd/next/dist/next.css");
/* harmony import */ var _alifd_next_dist_next_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_alifd_next_dist_next_css__WEBPACK_IMPORTED_MODULE_5__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }








class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Navbar__WEBPACK_IMPORTED_MODULE_3__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Switch"], null, _routes__WEBPACK_IMPORTED_MODULE_1__["default"].map((_ref) => {
      let {
        name,
        path,
        exact,
        component: Component
      } = _ref,
          rest = _objectWithoutProperties(_ref, ["name", "path", "exact", "component"]);

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
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes */ "./src/shared/routes.js");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_3__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const {
  Item
} = _alifd_next__WEBPACK_IMPORTED_MODULE_3__["Nav"];
const header = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "fusion"
}, "FUSION");
const footer = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", null, "Login in");
class Navbar extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "routerChange", currentName => {
      this.setState({
        currentName
      });
    });

    this.state = {
      currentName: ''
    };
  }

  componentDidMount() {
    let currentName = 'home';

    if (false) {}

    this.setState({
      currentName
    });
  }

  render() {
    let {
      currentName
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_3__["Nav"], {
      className: "basic-nav",
      direction: "hoz",
      type: "primary",
      header: header,
      footer: footer,
      selectedKeys: currentName,
      selectedKeys: currentName,
      triggerType: "hover"
    }, _routes__WEBPACK_IMPORTED_MODULE_2__["default"].map(({
      name,
      path
    }) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Item, {
      key: name,
      onSelect: e => this.routerChange(name)
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["NavLink"], {
      to: path
    }, name))));
  }

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

/***/ "./src/shared/Video/channels.js":
/*!**************************************!*\
  !*** ./src/shared/Video/channels.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const channels = [{
  name: '电影',
  key: 1
}, {
  name: '电视剧',
  key: 2
}, {
  name: '动漫',
  key: 3
}, {
  name: '综艺',
  key: 4
}, {
  name: '直播',
  key: 5
}, {
  name: '体育',
  key: 6
}, {
  name: '少儿',
  key: 7
}, {
  name: '娱乐',
  key: 8
}, {
  name: '资讯',
  key: 9
}, {
  name: '搞笑',
  key: 10
}];
/* harmony default export */ __webpack_exports__["default"] = (channels);

/***/ }),

/***/ "./src/shared/Video/index.js":
/*!***********************************!*\
  !*** ./src/shared/Video/index.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Upload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Upload */ "./src/shared/Upload.js");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @alifd/next */ "@alifd/next");
/* harmony import */ var _alifd_next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_alifd_next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.less */ "./src/shared/Video/index.less");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _channels__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./channels */ "./src/shared/Video/channels.js");
/* harmony import */ var _tags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tags */ "./src/shared/Video/tags.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const {
  Item: FormItem,
  Error: FormError,
  Submit: FormSubmit,
  Reset: FormReset
} = _alifd_next__WEBPACK_IMPORTED_MODULE_2__["Form"];
const {
  Group: TagGroup,
  Closeable: CloseableTag,
  Selectable: SelectableTag
} = _alifd_next__WEBPACK_IMPORTED_MODULE_2__["Tag"];
const {
  Group: RadioGroup
} = _alifd_next__WEBPACK_IMPORTED_MODULE_2__["Radio"];
const {
  TextArea
} = _alifd_next__WEBPACK_IMPORTED_MODULE_2__["Input"];


const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

class Video extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    _defineProperty(this, "userExists", (rule, value) => {
      return new Promise((resolve, reject) => {
        if (!value) {
          resolve();
        } else {
          setTimeout(() => {
            if (value === 'frank') {
              reject([new Error('Sorry, this username is already exist.')]);
            } else {
              resolve();
            }
          }, 500);
        }
      });
    });

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
    if (loading) return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "LOADING");
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Form"], formItemLayout, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "\u9891\u9053"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RadioGroup, {
      name: "channel",
      defaultValue: 1
    }, _channels__WEBPACK_IMPORTED_MODULE_4__["default"].map(({
      name,
      key
    }) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Radio"], {
      key: key,
      value: key
    }, name)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "\u6807\u7B7E"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TagGroup, {
      name: "tag",
      defaultValue: 1
    }, _tags__WEBPACK_IMPORTED_MODULE_5__["default"].map(tag => {
      let {
        h,
        s,
        l,
        a
      } = randomColor(),
          color = `hsl(${h}, ${s}%, ${l}%)`,
          bColor = `hsla(${h}, ${s}%, ${l}%, .25)`;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SelectableTag, {
        key: tag,
        type: "normal",
        style: {
          backgroundColor: bColor,
          borderColor: color,
          color
        }
      }, tag);
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "\u89C6\u9891\u540D\u79F0:",
      hasFeedback: true,
      requiredTrigger: "onBlur",
      validator: this.userExists,
      help: ""
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Input"], {
      placeholder: "Input frank",
      name: "valUsername"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormError, {
      name: "valUsername"
    }, (errors, state) => state === 'loading' ? 'loading...' : errors)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "Email:",
      hasFeedback: true,
      required: true,
      requiredTrigger: "onBlur",
      format: "email"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Input"], {
      placeholder: "Both trigget onBlur and onChange",
      name: "valEmail"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "Password:",
      hasFeedback: true,
      required: true,
      requiredMessage: "Please enter password"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Input"], {
      htmlType: "password",
      name: "valPasswd"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "Gender:",
      hasFeedback: true,
      required: true,
      requiredMessage: "Please select your gender"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RadioGroup, {
      name: "valSex"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Radio"], {
      value: "male"
    }, "Male"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_alifd_next__WEBPACK_IMPORTED_MODULE_2__["Radio"], {
      value: "female"
    }, "Female"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      label: "Remarks:",
      required: true,
      requiredMessage: "Really do not intend to write anything?"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TextArea, {
      maxLength: 20,
      hasLimitHint: true,
      placeholder: "Everything is ok!",
      name: "valTextarea"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormItem, {
      wrapperCol: {
        offset: 6
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormSubmit, {
      validate: true,
      type: "primary",
      onClick: (v, e) => console.log(v, e),
      style: {
        marginRight: 10
      }
    }, "Submit"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FormReset, null, "Reset")));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Video);

function getCol(n) {
  return Math.random() * n >> 0;
}

function randomColor() {
  let h = getCol(360),
      s = (h > 40 && h < 200 ? 70 : 90) + getCol(10),
      l = 35 + getCol(15);
  return {
    h,
    s,
    l
  };
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      h,
      s,
      l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 100 >> 0, Math.round(s * 100), Math.round(l * 100)];
}

/***/ }),

/***/ "./src/shared/Video/index.less":
/*!*************************************!*\
  !*** ./src/shared/Video/index.less ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/shared/Video/tags.js":
/*!**********************************!*\
  !*** ./src/shared/Video/tags.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const tags = ['动漫', '青春', '偶像', '戏曲', '综艺', '体育', '特摄', '特效', '新闻', '沙雕', '雷人'];
/* harmony default export */ __webpack_exports__["default"] = (tags);

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
/* harmony import */ var _Video__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Video */ "./src/shared/Video/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "./src/shared/api.js");



const routes = [{
  name: 'home',
  path: '/',
  exact: true,
  component: _Home__WEBPACK_IMPORTED_MODULE_0__["default"]
}, // {
// 	path: '/:id',
// 	component: Grid,
// 	fetchInitialData: (path = '') => fetchPopularRepos(path)
// }
{
  name: 'video',
  path: '/video',
  component: _Video__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetchInitialData: () => Object(_api__WEBPACK_IMPORTED_MODULE_2__["videoList"])()
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

/***/ "@alifd/next/dist/next.css":
/*!********************************************!*\
  !*** external "@alifd/next/dist/next.css" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@alifd/next/dist/next.css");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "css-modules-require-hook/preset":
/*!**************************************************!*\
  !*** external "css-modules-require-hook/preset" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("css-modules-require-hook/preset");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL0hvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9OYXZiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9Ob01hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvVXBsb2FkLmpzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvVmlkZW8vY2hhbm5lbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9WaWRlby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL1ZpZGVvL2luZGV4Lmxlc3M/NzlkNCIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL1ZpZGVvL3RhZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9yb3V0ZXMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQGFsaWZkL25leHRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYWxpZmQvbmV4dC9kaXN0L25leHQuY3NzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNzcy1tb2R1bGVzLXJlcXVpcmUtaG9vay9wcmVzZXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaXNvbW9ycGhpYy1mZXRjaFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LXJvdXRlci1kb21cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwiY29ycyIsIlJlYWN0IiwicmVuZGVyVG9TdHJpbmciLCJTdGF0aWNSb3V0ZXIiLCJtYXRjaFBhdGgiLCJzZXJpYWxpemUiLCJhcHAiLCJQT1JUIiwidXNlIiwic3RhdGljIiwiZ2V0IiwicmVxIiwicmVzIiwibmV4dCIsImFjdGl2ZVJvdXRlIiwicm91dGVzIiwiZmluZCIsInJvdXRlIiwidXJsIiwiY29uc29sZSIsImxvZyIsInByb21pc2UiLCJmZXRjaEluaXRpYWxEYXRhIiwicGF0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwibmFtZSIsInRoZW4iLCJkYXRhIiwiY29udGV4dCIsInN0ciIsInNlbmQiLCJjYXRjaCIsImxpc3RlbiIsIkFwcCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJyZW5kZXIiLCJtYXAiLCJleGFjdCIsImNvbXBvbmVudCIsInJlc3QiLCJIb21lIiwiSXRlbSIsIk5hdiIsImhlYWRlciIsImZvb3RlciIsIk5hdmJhciIsImN1cnJlbnROYW1lIiwic2V0U3RhdGUiLCJzdGF0ZSIsImNvbXBvbmVudERpZE1vdW50IiwiX19pc0Jyb3dzZXJfXyIsImUiLCJyb3V0ZXJDaGFuZ2UiLCJOb01hdGNoIiwiVXBsb2FkIiwidGFyZ2V0IiwiZmlsZXMiLCJmaWxlIiwidmlkZW9VcGxvYWQiLCJ2YWx1ZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsImZpbGVDaGFuZ2UiLCJjaGFubmVscyIsImtleSIsIkZvcm1JdGVtIiwiRXJyb3IiLCJGb3JtRXJyb3IiLCJTdWJtaXQiLCJGb3JtU3VibWl0IiwiUmVzZXQiLCJGb3JtUmVzZXQiLCJGb3JtIiwiR3JvdXAiLCJUYWdHcm91cCIsIkNsb3NlYWJsZSIsIkNsb3NlYWJsZVRhZyIsIlNlbGVjdGFibGUiLCJTZWxlY3RhYmxlVGFnIiwiVGFnIiwiUmFkaW9Hcm91cCIsIlJhZGlvIiwiVGV4dEFyZWEiLCJJbnB1dCIsImZvcm1JdGVtTGF5b3V0IiwibGFiZWxDb2wiLCJzcGFuIiwid3JhcHBlckNvbCIsIlZpZGVvIiwicnVsZSIsInJlamVjdCIsInNldFRpbWVvdXQiLCJyZXBvcyIsInN0YXRpY0NvbnRleHQiLCJsb2FkaW5nIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwidGFncyIsInRhZyIsImgiLCJzIiwibCIsImEiLCJyYW5kb21Db2xvciIsImNvbG9yIiwiYkNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJ1c2VyRXhpc3RzIiwiZXJyb3JzIiwib2Zmc2V0IiwidiIsIm1hcmdpblJpZ2h0IiwiZ2V0Q29sIiwibiIsIk1hdGgiLCJyYW5kb20iLCJoc2xUb1JnYiIsInIiLCJnIiwiYiIsImh1ZTJyZ2IiLCJwIiwicSIsInQiLCJyb3VuZCIsInJnYlRvSHNsIiwibWF4IiwibWluIiwiZCIsImZldGNoUG9wdWxhclJlcG9zIiwibGFuZ3VhZ2UiLCJlbmNvZGVkVVJJIiwiZW5jb2RlVVJJIiwiZmV0Y2giLCJqc29uIiwiaXRlbXMiLCJlcnJvciIsIndhcm4iLCJ2aWRlb0xpc3QiLCJvblByb2dyZXNzIiwicm9sIiwiZm9ybSIsIkZvcm1EYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsInJlc3BvbnNlVGV4dCIsImNvZGUiLCJtc2ciLCJKU09OIiwicGFyc2UiLCJhcHBlbmQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlE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O0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQSxNQUFNL0gsTUFBTSxHQUFJLENBQ2Y7QUFDQ1csTUFBSSxFQUFFLE1BRFA7QUFFQ0gsTUFBSSxFQUFFLEdBRlA7QUFHQ2lCLE9BQUssRUFBRSxJQUhSO0FBSUNDLFdBQVMsRUFBRUUsNkNBQUlBO0FBSmhCLENBRGUsRUFPZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQ2pCLE1BQUksRUFBRSxPQURQO0FBRUNILE1BQUksRUFBRSxRQUZQO0FBR0NrQixXQUFTLEVBQUVpRCw4Q0FIWjtBQUlDcEUsa0JBQWdCLEVBQUUsTUFBTXVILHNEQUFTO0FBSmxDLENBWmUsQ0FBaEI7QUFvQmU5SCxxRUFBZixFOzs7Ozs7Ozs7OztBQ3hCQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxzRDs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSw0RDs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSw2Qzs7Ozs7Ozs7Ozs7QUNBQSxpRCIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2VydmVyL2luZGV4LmpzXCIpO1xuIiwiLy8g5aSE55CGY3NzXG5pbXBvcnQgY3NzaG9vayBmcm9tICdjc3MtbW9kdWxlcy1yZXF1aXJlLWhvb2svcHJlc2V0J1xuXG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXG5jb25zdCBjb3JzID0gcmVxdWlyZSgnY29ycycpXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbmNvbnN0IHsgcmVuZGVyVG9TdHJpbmcgfSA9IHJlcXVpcmUoJ3JlYWN0LWRvbS9zZXJ2ZXInKVxuY29uc3QgeyBTdGF0aWNSb3V0ZXIsIG1hdGNoUGF0aCB9ID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyLWRvbScpXG5jb25zdCBzZXJpYWxpemUgPSByZXF1aXJlKCdzZXJpYWxpemUtamF2YXNjcmlwdCcpXG4vLyBpbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInXG4vLyBpbXBvcnQgeyBTdGF0aWNSb3V0ZXIsIG1hdGNoUGF0aCB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG4vLyBpbXBvcnQgc2VyaWFsaXplIGZyb20gJ3NlcmlhbGl6ZS1qYXZhc2NyaXB0J1xuaW1wb3J0IEFwcCBmcm9tICcuLi9zaGFyZWQvQXBwJ1xuaW1wb3J0IHJvdXRlcyBmcm9tICcuLi9zaGFyZWQvcm91dGVzJ1xuXG4vLyBpbXBvcnQgJ0BhbGlmZC9uZXh0L2Rpc3QvbmV4dC5jc3MnXG5cbmNvbnN0IGFwcCAgPSBleHByZXNzKClcbmNvbnN0IFBPUlQgPSA0MTkwXG5cbmFwcC51c2UoY29ycygpKVxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXG5cbmFwcC5nZXQoJyonLCAocmVxLCByZXMsIG5leHQpID0+IHtcblx0Y29uc3QgYWN0aXZlUm91dGUgPSByb3V0ZXMuZmluZChyb3V0ZSA9PiBtYXRjaFBhdGgocmVxLnVybCwgcm91dGUpKSB8fCB7fVxuXG5cdGNvbnNvbGUubG9nKCd1cmw6ICcsIHJlcS51cmwpXG5cdGNvbnN0IHByb21pc2UgPSBhY3RpdmVSb3V0ZS5mZXRjaEluaXRpYWxEYXRhPyBhY3RpdmVSb3V0ZS5mZXRjaEluaXRpYWxEYXRhKHJlcS5wYXRoKTogUHJvbWlzZS5yZXNvbHZlKClcblxuXHRjb25zdCByb3V0ZSA9IHt9XG5cblx0aWYgKGFjdGl2ZVJvdXRlKSB7XG5cdFx0cm91dGUubmFtZSA9IGFjdGl2ZVJvdXRlLm5hbWVcblx0XHRyb3V0ZS5wYXRoID0gYWN0aXZlUm91dGUucGF0aFxuXHR9XG5cblx0cHJvbWlzZS50aGVuKGRhdGEgPT4ge1xuXHRcdGNvbnN0IGNvbnRleHQgPSB7IGRhdGEgfVxuXG5cdFx0Y29uc3Qgc3RyID0gcmVuZGVyVG9TdHJpbmcoXG5cdFx0XHQ8U3RhdGljUm91dGVyIGxvY2F0aW9uPXtyZXEudXJsfSBjb250ZXh0PXtjb250ZXh0fT5cblx0XHRcdFx0PEFwcCAvPlxuXHRcdFx0PC9TdGF0aWNSb3V0ZXI+XG5cdFx0KVxuXHRcdHJlcy5zZW5kKGBcblx0XHRcdDwhRE9DVFlQRSBodG1sPlxuXHRcdFx0PGh0bWw+XG5cdFx0XHRcdDxoZWFkPlxuXHRcdFx0XHRcdDx0aXRsZT5TU1Igd2l0aCBSUjwvdGl0bGU+XG5cdFx0XHRcdFx0PHNjcmlwdD53aW5kb3cuX19JTklUSUFMX0RBVEFfXyA9ICR7c2VyaWFsaXplKGRhdGEpfSB8fCB7fTwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzY3JpcHQ+d2luZG93Ll9fUk9VVEVSX0RBVEFfXyAgPSAke3NlcmlhbGl6ZShyb3V0ZSl9PC9zY3JpcHQ+XG5cdFx0XHRcdFx0PHNjcmlwdCBzcmM9XCIvYnVuZGxlLmpzXCIgZGVmZXI+PC9zY3JpcHQ+XG5cdFx0XHRcdDwvaGVhZD5cblx0XHRcdFx0PGJvZHk+XG5cdFx0XHRcdFx0PGRpdiBpZD1cImFwcFwiPiR7c3RyfTwvZGl2PlxuXHRcdFx0XHQ8L2JvZHk+XG5cdFx0XHQ8L2h0bWw+XG5cdFx0YClcblx0fSkuY2F0Y2gobmV4dClcbn0pXG5cbmFwcC5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuXHRjb25zb2xlLmxvZyhg5bqU55So5ZCv5Yqo56uv5Y+jOiAke1BPUlR9YClcbn0pIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHJvdXRlcyBmcm9tICcuL3JvdXRlcydcbmltcG9ydCB7IFJvdXRlLCBTd2l0Y2ggfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJ1xuaW1wb3J0IE5hdmJhciBmcm9tICcuL05hdmJhcidcbmltcG9ydCBOb01hdGNoIGZyb20gJy4vTm9NYXRjaCdcblxuaW1wb3J0ICdAYWxpZmQvbmV4dC9kaXN0L25leHQuY3NzJ1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKVxuXHR9XG5cdHJlbmRlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PE5hdmJhciAvPlxuXG5cdFx0XHRcdDxTd2l0Y2g+XG5cdFx0XHRcdFx0e3JvdXRlcy5tYXAoKHsgbmFtZSwgcGF0aCwgZXhhY3QsIGNvbXBvbmVudDogQ29tcG9uZW50LCAuLi5yZXN0IH0pID0+IChcblx0XHRcdFx0XHRcdDxSb3V0ZSBrZXk9e3BhdGh9IHBhdGg9e3BhdGh9IGV4YWN0PXtleGFjdH0gcmVuZGVyPXtwcm9wcyA9PiA8Q29tcG9uZW50IHsuLi5wcm9wc30gey4uLnJlc3R9IC8+fSAvPlxuXHRcdFx0XHRcdCkpfVxuXHRcdFx0XHRcdDxSb3V0ZSByZW5kZXI9eyhwcm9wcykgPT4gPE5vTWF0Y2ggey4uLnByb3BzfSAvPiB9IC8+XG5cdFx0XHRcdDwvU3dpdGNoPlxuXHRcdFx0PC9kaXY+XG5cdFx0KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcCIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gSG9tZSAoKSB7XG5cdHJldHVybiA8ZGl2PlNlbGVjdCBhIExhbmd1YWdlPC9kaXY+XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTmF2TGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nXG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJ1xuaW1wb3J0IHsgTmF2IH0gZnJvbSAnQGFsaWZkL25leHQnXG5jb25zdCB7IEl0ZW0gfSA9IE5hdlxuY29uc3QgaGVhZGVyID0gPHNwYW4gY2xhc3NOYW1lPVwiZnVzaW9uXCI+RlVTSU9OPC9zcGFuPlxuY29uc3QgZm9vdGVyID0gPGE+TG9naW4gaW48L2E+XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdmJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpXG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0Y3VycmVudE5hbWU6ICcnXG5cdFx0fVxuXHR9XG5cdGNvbXBvbmVudERpZE1vdW50ICgpIHtcblx0XHRsZXQgY3VycmVudE5hbWUgPSAnaG9tZSdcblx0XHRpZiAoX19pc0Jyb3dzZXJfXyAmJiB3aW5kb3cuX19ST1VURVJfREFUQV9fKSB7XG5cdFx0XHRjdXJyZW50TmFtZSA9IHdpbmRvdy5fX1JPVVRFUl9EQVRBX18ubmFtZVxuXHRcdFx0ZGVsZXRlIHdpbmRvdy5fX1JPVVRFUl9EQVRBX19cblx0XHR9XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnROYW1lIH0pXG5cdH1cblx0cm91dGVyQ2hhbmdlID0gY3VycmVudE5hbWUgPT4ge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50TmFtZSB9KVxuXHR9XG5cdHJlbmRlcigpIHtcblx0XHRsZXQgeyBjdXJyZW50TmFtZSB9ID0gdGhpcy5zdGF0ZVxuXHRcdHJldHVybiAoXG5cdFx0XHQ8TmF2IGNsYXNzTmFtZT1cImJhc2ljLW5hdlwiIGRpcmVjdGlvbj1cImhvelwiIHR5cGU9XCJwcmltYXJ5XCIgaGVhZGVyPXtoZWFkZXJ9IGZvb3Rlcj17Zm9vdGVyfSBzZWxlY3RlZEtleXM9e2N1cnJlbnROYW1lfSBzZWxlY3RlZEtleXM9e2N1cnJlbnROYW1lfSB0cmlnZ2VyVHlwZT1cImhvdmVyXCI+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyb3V0ZXMubWFwKCh7IG5hbWUsIHBhdGggfSkgPT4gKFxuXHRcdFx0XHRcdFx0PEl0ZW0ga2V5PXtuYW1lfSBvblNlbGVjdD17ZSA9PiB0aGlzLnJvdXRlckNoYW5nZShuYW1lKX0+PE5hdkxpbmsgdG89e3BhdGh9PntuYW1lfTwvTmF2TGluaz48L0l0ZW0+XG5cdFx0XHRcdFx0KSlcblx0XHRcdFx0fVxuXHRcdFx0PC9OYXY+XG5cdFx0KVxuXHR9XG59IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBOb01hdGNoICgpIHtcblx0cmV0dXJuIDxkaXY+Rm91ciBPaCBGb3VyPC9kaXY+XG59IiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQnV0dG9uLCBUYWJsZSB9IGZyb20gJ0BhbGlmZC9uZXh0J1xuaW1wb3J0IHsgdmlkZW9VcGxvYWQgfSBmcm9tICcuL2FwaSdcblxuY2xhc3MgVXBsb2FkIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcylcblx0fVxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdH1cblx0Y29tcG9uZW50RGlkVXBkYXRlICgpIHtcblx0fVxuXHRmaWxlQ2hhbmdlID0gKHsgdGFyZ2V0IH0pID0+IHtcblx0XHRjb25zdCB7IGZpbGVzOiBbIGZpbGUgXSB9ID0gdGFyZ2V0XG5cdFx0dmlkZW9VcGxvYWQoZmlsZSkudGhlbihyZXMgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzKVxuXHRcdFx0dGFyZ2V0LnZhbHVlID0gJydcblx0XHR9KS5jYXRjaChlID0+IHtcblx0XHRcdHRhcmdldC52YWx1ZSA9ICcnXG5cdFx0fSlcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD17Jy5tcDQnfSBvbkNoYW5nZT17dGhpcy5maWxlQ2hhbmdlfSAvPlxuXHRcdClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBVcGxvYWQiLCJjb25zdCBjaGFubmVscyA9IFtcblx0eyBuYW1lOiAn55S15b2xJywgICBrZXk6IDEgfSxcblx0eyBuYW1lOiAn55S16KeG5YmnJywga2V5OiAyIH0sXG5cdHsgbmFtZTogJ+WKqOa8qycsICAga2V5OiAzIH0sXG5cdHsgbmFtZTogJ+e7vOiJuicsICAga2V5OiA0IH0sXG5cdHsgbmFtZTogJ+ebtOaSrScsICAga2V5OiA1IH0sXG5cdHsgbmFtZTogJ+S9k+iCsicsICAga2V5OiA2IH0sXG5cdHsgbmFtZTogJ+WwkeWEvycsICAga2V5OiA3IH0sXG5cdHsgbmFtZTogJ+WoseS5kCcsICAga2V5OiA4IH0sXG5cdHsgbmFtZTogJ+i1hOiurycsICAga2V5OiA5IH0sXG5cdHsgbmFtZTogJ+aQnueskScsICAga2V5OiAxMCB9LFxuXVxuXG5leHBvcnQgZGVmYXVsdCBjaGFubmVscyIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBVcGxvYWQgZnJvbSAnLi4vVXBsb2FkJ1xuaW1wb3J0IHsgQnV0dG9uLCBGb3JtLCBJbnB1dCwgUmFkaW8sIFRhZyB9IGZyb20gJ0BhbGlmZC9uZXh0J1xuXG5pbXBvcnQgJy4vaW5kZXgubGVzcydcblxuY29uc3Qge1xuXHRJdGVtOiAgIEZvcm1JdGVtLFxuXHRFcnJvcjogIEZvcm1FcnJvcixcblx0U3VibWl0OiBGb3JtU3VibWl0LFxuXHRSZXNldDogIEZvcm1SZXNldCxcbn0gPSBGb3JtXG5jb25zdCB7XG5cdEdyb3VwOiBUYWdHcm91cCxcblx0Q2xvc2VhYmxlOiBDbG9zZWFibGVUYWcsXG5cdFNlbGVjdGFibGU6IFNlbGVjdGFibGVUYWdcbn0gICA9IFRhZ1xuY29uc3QgeyBHcm91cDogUmFkaW9Hcm91cCB9ID0gUmFkaW9cbmNvbnN0IHsgVGV4dEFyZWEgfSA9IElucHV0XG5cblxuaW1wb3J0IGNoYW5uZWxzIGZyb20gJy4vY2hhbm5lbHMnXG5pbXBvcnQgdGFncyAgICAgZnJvbSAnLi90YWdzJ1xuXG5jb25zdCBmb3JtSXRlbUxheW91dCA9IHtcblx0bGFiZWxDb2w6IHtcblx0XHRzcGFuOiA2XG5cdH0sXG5cdHdyYXBwZXJDb2w6IHtcblx0XHRzcGFuOiAxNFxuXHR9XG59XG5cbmNsYXNzIFZpZGVvIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcylcblx0XHRcblx0XHRsZXQgcmVwb3Ncblx0XHRpZiAoX19pc0Jyb3dzZXJfXykge1xuXHRcdFx0aWYgKHdpbmRvdy5fX0lOSVRJQUxfREFUQV9fKSB7XG5cdFx0XHRcdHJlcG9zID0gd2luZG93Ll9fSU5JVElBTF9EQVRBX19cblx0XHRcdFx0ZGVsZXRlIHdpbmRvdy5fX0lOSVRJQUxfREFUQV9fXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcm9wcy5mZXRjaEluaXRpYWxEYXRhKCkudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRcdHJlcG9zID0gcmVzXG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHRyZXBvcyxcblx0XHRcdFx0XHRcdGxvYWRpbmc6ICFyZXBvcyxcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXBvcyA9IHRoaXMucHJvcHMuc3RhdGljQ29udGV4dC5kYXRhXG5cdFx0fVxuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdHJlcG9zLFxuXHRcdFx0bG9hZGluZzogIXJlcG9zLFxuXHRcdH1cblx0fVxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdH1cblx0Y29tcG9uZW50RGlkVXBkYXRlIChwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuXHR9XG5cdHVzZXJFeGlzdHMgPSAocnVsZSwgdmFsdWUpID0+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0XHRyZXNvbHZlKClcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gJ2ZyYW5rJykge1xuXHRcdFx0XHRcdFx0cmVqZWN0KFtuZXcgRXJyb3IoJ1NvcnJ5LCB0aGlzIHVzZXJuYW1lIGlzIGFscmVhZHkgZXhpc3QuJyldKVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIDUwMClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cdHJlbmRlcigpIHtcblx0XHRjb25zdCB7IGxvYWRpbmcsIHJlcG9zIH0gPSB0aGlzLnN0YXRlXG5cblx0XHRpZiAobG9hZGluZykgcmV0dXJuIDxwPkxPQURJTkc8L3A+XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PEZvcm0gey4uLmZvcm1JdGVtTGF5b3V0fT5cblx0XHRcdFx0PEZvcm1JdGVtIGxhYmVsPVwi6aKR6YGTXCI+XG5cdFx0XHRcdFx0PFJhZGlvR3JvdXAgbmFtZT1cImNoYW5uZWxcIiBkZWZhdWx0VmFsdWU9ezF9PlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjaGFubmVscy5tYXAoKHsgbmFtZSwga2V5IH0pID0+IDxSYWRpbyBrZXk9e2tleX0gdmFsdWU9e2tleX0+e25hbWV9PC9SYWRpbz4pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0PC9SYWRpb0dyb3VwPlxuXHRcdFx0XHQ8L0Zvcm1JdGVtPlxuXHRcdFx0XHQ8Rm9ybUl0ZW0gbGFiZWw9XCLmoIfnrb5cIj5cblx0XHRcdFx0XHQ8VGFnR3JvdXAgbmFtZT1cInRhZ1wiIGRlZmF1bHRWYWx1ZT17MX0+XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRhZ3MubWFwKHRhZyA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHsgaCwgcywgbCwgYSB9ID0gcmFuZG9tQ29sb3IoKSxcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yICA9IGBoc2woJHtofSwgJHtzfSUsICR7bH0lKWAsXG5cdFx0XHRcdFx0XHRcdFx0XHRiQ29sb3IgPSBgaHNsYSgke2h9LCAke3N9JSwgJHtsfSUsIC4yNSlgXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIDxTZWxlY3RhYmxlVGFnIGtleT17dGFnfSB0eXBlPVwibm9ybWFsXCIgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBiQ29sb3IsIGJvcmRlckNvbG9yOiBjb2xvciwgY29sb3IgfX0+e3RhZ308L1NlbGVjdGFibGVUYWc+XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0PC9UYWdHcm91cD5cblx0XHRcdFx0PC9Gb3JtSXRlbT5cblx0XHRcdFx0PEZvcm1JdGVtXG5cdFx0XHRcdFx0bGFiZWw9XCLop4bpopHlkI3np7A6XCJcblx0XHRcdFx0XHRoYXNGZWVkYmFja1xuXHRcdFx0XHRcdHJlcXVpcmVkVHJpZ2dlcj1cIm9uQmx1clwiXG5cdFx0XHRcdFx0dmFsaWRhdG9yPXt0aGlzLnVzZXJFeGlzdHN9XG5cdFx0XHRcdFx0aGVscD1cIlwiXG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8SW5wdXQgcGxhY2Vob2xkZXI9XCJJbnB1dCBmcmFua1wiIG5hbWU9XCJ2YWxVc2VybmFtZVwiIC8+XG5cdFx0XHRcdFx0PEZvcm1FcnJvciBuYW1lPVwidmFsVXNlcm5hbWVcIiA+XG5cdFx0XHRcdFx0XHR7IChlcnJvcnMsIHN0YXRlKSA9PiBzdGF0ZSA9PT0gJ2xvYWRpbmcnPyAnbG9hZGluZy4uLic6IGVycm9ycyB9XG5cdFx0XHRcdFx0PC9Gb3JtRXJyb3I+XG5cdFx0XHRcdDwvRm9ybUl0ZW0+XG5cdFx0XHRcdDxGb3JtSXRlbVxuXHRcdFx0XHRcdGxhYmVsPVwiRW1haWw6XCJcblx0XHRcdFx0XHRoYXNGZWVkYmFja1xuXHRcdFx0XHRcdHJlcXVpcmVkXG5cdFx0XHRcdFx0cmVxdWlyZWRUcmlnZ2VyPVwib25CbHVyXCJcblx0XHRcdFx0XHRmb3JtYXQ9XCJlbWFpbFwiXG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8SW5wdXQgcGxhY2Vob2xkZXI9XCJCb3RoIHRyaWdnZXQgb25CbHVyIGFuZCBvbkNoYW5nZVwiIG5hbWU9XCJ2YWxFbWFpbFwiIC8+XG5cdFx0XHRcdDwvRm9ybUl0ZW0+XG5cblx0XHRcdFx0PEZvcm1JdGVtXG5cdFx0XHRcdFx0bGFiZWw9XCJQYXNzd29yZDpcIlxuXHRcdFx0XHRcdGhhc0ZlZWRiYWNrXG5cdFx0XHRcdFx0cmVxdWlyZWRcblx0XHRcdFx0XHRyZXF1aXJlZE1lc3NhZ2U9XCJQbGVhc2UgZW50ZXIgcGFzc3dvcmRcIlxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PElucHV0IGh0bWxUeXBlPVwicGFzc3dvcmRcIiBuYW1lPVwidmFsUGFzc3dkXCIgLz5cblx0XHRcdFx0PC9Gb3JtSXRlbT5cblxuXHRcdFx0XHQ8Rm9ybUl0ZW1cblx0XHRcdFx0XHRsYWJlbD1cIkdlbmRlcjpcIlxuXHRcdFx0XHRcdGhhc0ZlZWRiYWNrXG5cdFx0XHRcdFx0cmVxdWlyZWRcblx0XHRcdFx0XHRyZXF1aXJlZE1lc3NhZ2U9XCJQbGVhc2Ugc2VsZWN0IHlvdXIgZ2VuZGVyXCJcblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxSYWRpb0dyb3VwIG5hbWU9XCJ2YWxTZXhcIiA+XG5cdFx0XHRcdFx0XHQ8UmFkaW8gdmFsdWU9XCJtYWxlXCI+TWFsZTwvUmFkaW8+XG5cdFx0XHRcdFx0XHQ8UmFkaW8gdmFsdWU9XCJmZW1hbGVcIj5GZW1hbGU8L1JhZGlvPlxuXHRcdFx0XHRcdDwvUmFkaW9Hcm91cD5cblx0XHRcdFx0PC9Gb3JtSXRlbT5cblxuXHRcdFx0XHQ8Rm9ybUl0ZW1cblx0XHRcdFx0XHRsYWJlbD1cIlJlbWFya3M6XCJcblx0XHRcdFx0XHRyZXF1aXJlZFxuXHRcdFx0XHRcdHJlcXVpcmVkTWVzc2FnZT1cIlJlYWxseSBkbyBub3QgaW50ZW5kIHRvIHdyaXRlIGFueXRoaW5nP1wiXG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8VGV4dEFyZWEgbWF4TGVuZ3RoPXsyMH0gaGFzTGltaXRIaW50IHBsYWNlaG9sZGVyPVwiRXZlcnl0aGluZyBpcyBvayFcIiBuYW1lPVwidmFsVGV4dGFyZWFcIiAvPlxuXHRcdFx0XHQ8L0Zvcm1JdGVtPlxuXG5cdFx0XHRcdDxGb3JtSXRlbSB3cmFwcGVyQ29sPXt7IG9mZnNldDogNiB9fSA+XG5cdFx0XHRcdFx0PEZvcm1TdWJtaXQgdmFsaWRhdGUgdHlwZT1cInByaW1hcnlcIiBvbkNsaWNrPXsodiwgZSkgPT4gY29uc29sZS5sb2codiwgZSl9IHN0eWxlPXt7bWFyZ2luUmlnaHQ6IDEwfX0+U3VibWl0PC9Gb3JtU3VibWl0PlxuXHRcdFx0XHRcdDxGb3JtUmVzZXQgPlJlc2V0PC9Gb3JtUmVzZXQ+XG5cdFx0XHRcdDwvRm9ybUl0ZW0+XG5cdFx0XHQ8L0Zvcm0+XG5cdFx0KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpZGVvXG5cbmZ1bmN0aW9uIGdldENvbChuKSB7XG5cdHJldHVybiBNYXRoLnJhbmRvbSgpICogbiA+PiAwXG59XG5mdW5jdGlvbiByYW5kb21Db2xvcigpIHtcblx0bGV0IGggICA9IGdldENvbCgzNjApLFxuXHRcdHMgICA9IChoID4gNDAgJiYgaCA8IDIwMD8gNzA6IDkwKSArIGdldENvbCgxMCksXG5cdFx0bCAgID0gMzUgKyBnZXRDb2woMTUpXG5cdHJldHVybiB7IGgsIHMsIGwgfVxufVxuXG5mdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG5cdGxldCByLCBnLCBiXG5cdGlmKHMgPT0gMCkge1xuXHRcdHIgPSBnID0gYiA9IGxcblx0fSBlbHNlIHtcblx0XHR2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCkge1xuXHRcdFx0aWYodCA8IDApIHQgKz0gMVxuXHRcdFx0aWYodCA+IDEpIHQgLT0gMVxuXHRcdFx0aWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHRcblx0XHRcdGlmKHQgPCAxLzIpIHJldHVybiBxXG5cdFx0XHRpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2XG5cdFx0XHRyZXR1cm4gcFxuXHRcdH1cblx0XHR2YXIgcSA9IGwgPCAwLjU/IGwgKiAoMSArIHMpOiBsICsgcyAtIGwgKiBzXG5cdFx0dmFyIHAgPSAyICogbCAtIHFcblx0XHRyID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKVxuXHRcdGcgPSBodWUycmdiKHAsIHEsIGgpXG5cdFx0YiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMylcblx0fVxuXG5cdHJldHVybiBbIE1hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSkgXVxuXG59XG5cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcblx0ciAvPSAyNTVcblx0ZyAvPSAyNTVcblx0YiAvPSAyNTVcblx0bGV0IG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuXHRcdG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuXHRcdGgsXG5cdFx0cyxcblx0XHRsID0gKG1heCArIG1pbikgLyAyXG5cdGlmKG1heCA9PSBtaW4pIHtcblx0XHRoID0gcyA9IDBcblx0fSBlbHNlIHtcblx0XHRsZXQgZCA9IG1heCAtIG1pblxuXHRcdHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKVxuXHRcdHN3aXRjaCAobWF4KSB7XG5cdFx0XHRjYXNlXG5cdFx0XHRcdHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKVxuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZVxuXHRcdFx0XHRnOiBoID0gKGIgLSByKSAvIGQgKyAyXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlXG5cdFx0XHRcdGI6IGggPSAociAtIGcpIC8gZCArIDRcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cdFx0aCAvPSA2XG5cdH1cblx0cmV0dXJuIFtoICogMTAwID4+IDAsIE1hdGgucm91bmQocyAqIDEwMCksIE1hdGgucm91bmQobCAqIDEwMCldXG59IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiY29uc3QgdGFncyA9IFtcblx0J+WKqOa8qycsXG5cdCfpnZLmmKUnLFxuXHQn5YG25YOPJyxcblx0J+aIj+absicsXG5cdCfnu7zoibonLFxuXHQn5L2T6IKyJyxcblx0J+eJueaRhCcsXG5cdCfnibnmlYgnLFxuXHQn5paw6Ze7Jyxcblx0J+aymemblScsXG5cdCfpm7fkuronXG5dXG5cbmV4cG9ydCBkZWZhdWx0IHRhZ3MiLCJpbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCdcblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUG9wdWxhclJlcG9zIChsYW5ndWFnZSA9ICdhbGwnKSB7XG5cdGNvbnN0IGVuY29kZWRVUkkgPSBlbmNvZGVVUkkoYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vc2VhcmNoL3JlcG9zaXRvcmllcz9xPXN0YXJzOj4xK2xhbmd1YWdlOiR7bGFuZ3VhZ2V9JnNvcnQ9c3RhcnMmb3JkZXI9ZGVzYyZ0eXBlPVJlcG9zaXRvcmllc2ApXG5cblx0cmV0dXJuIGZldGNoKGVuY29kZWRVUkkpXG5cdFx0LnRoZW4oZGF0YSA9PiBkYXRhLmpzb24oKSlcblx0XHQudGhlbihyZXBvcyA9PiByZXBvcy5pdGVtcylcblx0XHQuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS53YXJuKGVycm9yKVxuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR9KVxufVxuXG4vLyDop4bpopHliJfooahcbmV4cG9ydCBmdW5jdGlvbiB2aWRlb0xpc3QoKSB7XG5cdHJldHVybiBmZXRjaCgnaHR0cDovLzAuMC4wLjA6NDA5MC9hZG1pbi92aWRlb3MnKVxuXHRcdC50aGVuKGRhdGEgPT4gZGF0YS5qc29uKCkpXG5cdFx0LnRoZW4ocmVwb3MgPT4gcmVwb3MpXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUud2FybihlcnJvcilcblx0XHRcdHJldHVybiBudWxsXG5cdFx0fSlcbn1cblxuLy8g6KeG6aKR5LiK5LygXG5leHBvcnQgZnVuY3Rpb24gdmlkZW9VcGxvYWQoZmlsZSwgb25Qcm9ncmVzcykge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcm9sKSA9PiB7XG5cdFx0bGV0IGZvcm0gPSBuZXcgRm9ybURhdGEoKSxcblx0XHRcdHhociAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXHRcdHhoci5vcGVuKCdwdXQnLCAnaHR0cDovLzAuMC4wLjA6NDA5MC9hZG1pbi92aWRlb3MnICwgdHJ1ZSlcblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcblx0XHRcdFx0XHRsZXQgeyByZXNwb25zZVRleHQgfSA9IHRoaXMsXG5cdFx0XHRcdFx0XHR7IGNvZGUsIG1zZywgZGF0YSB9ID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0aWYgKGNvZGUgPT09ICcwMDAwJykgcmV0dXJuIHJlcyhkYXRhKVxuXHRcdFx0XHRcdGVsc2Ugcm9sKG1zZylcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyb2woKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0Zm9ybS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKVxuXHRcdHhoci5zZW5kKGZvcm0pXG5cdFx0aWYgKG9uUHJvZ3Jlc3MpIHhoci5vblByb2dyZXNzID0gb25Qcm9ncmVzc1xuXHR9KVxufSIsImltcG9ydCBIb21lIGZyb20gJy4vSG9tZSdcbmltcG9ydCBWaWRlbyBmcm9tICcuL1ZpZGVvJ1xuaW1wb3J0IHsgdmlkZW9MaXN0IH0gZnJvbSAnLi9hcGknXG5cbmNvbnN0IHJvdXRlcyA9ICBbXG5cdHtcblx0XHRuYW1lOiAnaG9tZScsXG5cdFx0cGF0aDogJy8nLFxuXHRcdGV4YWN0OiB0cnVlLFxuXHRcdGNvbXBvbmVudDogSG9tZSxcblx0fSxcblx0Ly8ge1xuXHQvLyBcdHBhdGg6ICcvOmlkJyxcblx0Ly8gXHRjb21wb25lbnQ6IEdyaWQsXG5cdC8vIFx0ZmV0Y2hJbml0aWFsRGF0YTogKHBhdGggPSAnJykgPT4gZmV0Y2hQb3B1bGFyUmVwb3MocGF0aClcblx0Ly8gfVxuXHR7XG5cdFx0bmFtZTogJ3ZpZGVvJyxcblx0XHRwYXRoOiAnL3ZpZGVvJyxcblx0XHRjb21wb25lbnQ6IFZpZGVvLFxuXHRcdGZldGNoSW5pdGlhbERhdGE6ICgpID0+IHZpZGVvTGlzdCgpXG5cdH1cbl1cblxuZXhwb3J0IGRlZmF1bHQgcm91dGVzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGFsaWZkL25leHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGFsaWZkL25leHQvZGlzdC9uZXh0LmNzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNzcy1tb2R1bGVzLXJlcXVpcmUtaG9vay9wcmVzZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpc29tb3JwaGljLWZldGNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LWRvbS9zZXJ2ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyLWRvbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiKTsiXSwic291cmNlUm9vdCI6IiJ9