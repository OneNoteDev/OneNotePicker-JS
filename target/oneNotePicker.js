/*
The MIT License (MIT)

Copyright (c) 2016 OneNoteDev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.OneNotePicker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../../typings/main/ambient/mithril/mithril.d.ts"/>
"use strict";
var KeyCode;
(function (KeyCode) {
    KeyCode.tab = 9;
    KeyCode.enter = 13;
})(KeyCode || (KeyCode = {}));
var ComponentBase = (function () {
    function ComponentBase(props) {
        this.props = props;
        this.state = this.getInitialState();
        this.refs = {};
    }
    ComponentBase.prototype.getInitialState = function () {
        return {};
    };
    // public methods
    ComponentBase.prototype.setState = function (newPartialState) {
        m.startComputation();
        for (var key in newPartialState) {
            if (newPartialState.hasOwnProperty(key)) {
                this.state[key] = newPartialState[key];
            }
        }
        m.endComputation();
    };
    ComponentBase.prototype.ref = function (name) {
        var _this = this;
        return {
            config: function (element) {
                _this.refs[name] = element;
            }
        };
    };
    ComponentBase.prototype.onElementDraw = function (handleMethod) {
        // because of the way mithril does the callbacks, we need to rescope it so that "this" points to the class
        handleMethod = handleMethod.bind(this);
        return {
            config: function (element, isInitialized) {
                handleMethod(element, !isInitialized);
            }
        };
    };
    ComponentBase.prototype.onElementFirstDraw = function (handleMethod) {
        // because of the way mithril does the callbacks, we need to rescope it so that "this" points to the class
        handleMethod = handleMethod.bind(this);
        return {
            config: function (element, isInitialized) {
                if (!isInitialized) {
                    handleMethod(element);
                }
            }
        };
    };
    /*
     * Helper which handles tabIndex, clicks, and keyboard navigation.
     *
     * Also hides the outline if they are using a mouse, but shows it if they are using the keyboard
     * (idea from http://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/)
     *
     * Example use:
     *      <a id="myCoolButton" {...this.enableInvoke(this.myButtonHandler, 0)}>Click Me</a>
     */
    ComponentBase.prototype.enableInvoke = function (handleMethod, tabIndex, args) {
        if (tabIndex === void 0) { tabIndex = 0; }
        // because of the way mithril does the callbacks, we need to rescope it so that "this" points to the class
        if (handleMethod) {
            handleMethod = handleMethod.bind(this, args);
        }
        return {
            onclick: function (e) {
                if (handleMethod) {
                    handleMethod(e);
                }
            },
            onkeyup: function (e) {
                var element = e.currentTarget;
                if (e.which === KeyCode.enter) {
                    // Hitting Enter on <a> tags that contains an href automatically fire the click event, so don't do it again
                    if (!(element.tagName === "A" && element.hasAttribute("href"))) {
                        if (handleMethod) {
                            handleMethod(e);
                        }
                    }
                }
                else if (e.which === KeyCode.tab) {
                    // Since they are using the keyboard, revert to the default value of the outline so it is visible
                    element.style.outlineStyle = "";
                }
            },
            onmousedown: function (e) {
                var element = e.currentTarget;
                element.style.outlineStyle = "none";
            },
            tabIndex: tabIndex
        };
    };
    // Note: currently all components NEED either a child or attribute to work with the MSX transformer.
    // This <MyButton/> won't work, but this <MyButton dummyProp /> will work.
    ComponentBase.componentize = function () {
        var _this = this;
        var returnValue = function () { };
        returnValue.controller = function (props) {
            // instantiate an instance of the inheriting class
            return new _this(props);
        };
        returnValue.view = function (controller, props) {
            controller.props = props;
            return controller.render();
        };
        return returnValue;
    };
    return ComponentBase;
}());
exports.ComponentBase = ComponentBase;

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var componentBase_1 = require("../componentBase");
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var CurrentlySelectedSectionClass = (function (_super) {
    __extends(CurrentlySelectedSectionClass, _super);
    function CurrentlySelectedSectionClass() {
        _super.apply(this, arguments);
    }
    CurrentlySelectedSectionClass.prototype.render = function () {
        return ({tag: "div", attrs: {id:constants_1.Constants.Ids.saveToLocationContainer, className:"SaveToLocationContainer"}, children: [
				{tag: "a", attrs: Object.assign({id:constants_1.Constants.Ids.sectionLocationContainer, role:"button", style:"outline-style: none;"},  this.enableInvoke(this.props.onSectionLocationContainerClicked, 50)), children: [
					{tag: "div", attrs: {className:"OpenSectionPickerArrow"}, children: [
						{tag: "img", attrs: {className:"arrowDown", src:utils_1.Utils.getImageResourceUrl("dropdown_arrow.png")}}
					]}, 
					{tag: "div", attrs: {className:"SectionLocation", title:this.props.textToDisplay}, children: [this.props.textToDisplay]}
				]}
			]});
    };
    ;
    return CurrentlySelectedSectionClass;
}(componentBase_1.ComponentBase));
;
var component = CurrentlySelectedSectionClass.componentize();
exports.CurrentlySelectedSectionComponent = component;

},{"../../constants":12,"../../utils":16,"../componentBase":1}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
var componentBase_1 = require("../componentBase");
var utils_1 = require("../../utils");
/**
 * Represents an expandable entity that can contain sections or additional expandable
 * entities as direct children. Render() is a template method that requires several
 * abstract method 'steps' to be defined.
 */
var ExpandableEntityComponentBase = (function (_super) {
    __extends(ExpandableEntityComponentBase, _super);
    function ExpandableEntityComponentBase() {
        _super.apply(this, arguments);
    }
    ExpandableEntityComponentBase.prototype.getInitialState = function () {
        return {
            isOpened: this.isPartOfCurSectionIdPath()
        };
    };
    ExpandableEntityComponentBase.prototype.isPartOfCurSectionIdPath = function () {
        if (this.props.curSectionIdPath) {
            if (this.props.curSectionIdPath[0] === this.getId()) {
                return true;
            }
        }
        return false;
    };
    ExpandableEntityComponentBase.prototype.onClicked = function () {
        this.setState({
            isOpened: !this.state.isOpened
        });
    };
    ExpandableEntityComponentBase.prototype.render = function () {
        var childRows = this.getDirectChildren();
        var openedClassName = this.state.isOpened ? "Opened" : "Closed";
        var className = this.getEntityClassName() + " " + openedClassName;
        var labelText = this.getLabel();
        return ({tag: "li", attrs: {className:className}, children: [
				{tag: "div", attrs: Object.assign({},  this.enableInvoke(this.onClicked.bind(this), 51, this.getId()),{className:"EntityImageAndNameContainer"}), children: [
					{tag: "div", attrs: {className:"ExpandCollapseContainer"}, children: [
						{tag: "div", attrs: {className:"Expand"}, children: [
							{tag: "img", attrs: {className:"ExpandImage", src:utils_1.Utils.getImageResourceUrl("arrow_right.png")}}
						]}, 
						{tag: "div", attrs: {className:"Collapse"}, children: [
							{tag: "img", attrs: {className:"CollapseImage", src:utils_1.Utils.getImageResourceUrl("arrow_down.png")}}
						]}
					]}, 
					{tag: "div", attrs: {className:"EntityImage"}, children: [
						{tag: "img", attrs: {className:this.getImageClassName(), src:this.getImagePath(), alt:labelText, title:labelText}}
					]}, 
					{tag: "div", attrs: {className:"EntityNameContainer"}, children: [
						{tag: "label", attrs: {className:"EntityName", alt:labelText, title:labelText}, children: [labelText]}
					]}
				]}, 
				{tag: "ul", attrs: {}, children: [
					childRows
				]}
			]});
    };
    return ExpandableEntityComponentBase;
}(componentBase_1.ComponentBase));
exports.ExpandableEntityComponentBase = ExpandableEntityComponentBase;

},{"../../utils":16,"../componentBase":1}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var componentBase_1 = require("../componentBase");
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var LoadingElementComponentClass = (function (_super) {
    __extends(LoadingElementComponentClass, _super);
    function LoadingElementComponentClass() {
        _super.apply(this, arguments);
    }
    LoadingElementComponentClass.prototype.render = function () {
        return ({tag: "img", attrs: {id:constants_1.Constants.Ids.loadingImage, src:utils_1.Utils.getImageResourceUrl("loading_circle.gif"), className:"SectionPickerState SectionPickerLoading"}});
    };
    ;
    return LoadingElementComponentClass;
}(componentBase_1.ComponentBase));
;
var component = LoadingElementComponentClass.componentize();
exports.LoadingElementComponent = component;

},{"../../constants":12,"../../utils":16,"../componentBase":1}],5:[function(require,module,exports){
/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expandableEntityComponentBase_1 = require("./expandableEntityComponentBase");
var sectionComponent_1 = require("./sectionComponent");
var sectionGroupComponent_1 = require("./sectionGroupComponent");
var utils_1 = require("../../utils");
var NotebookComponentClass = (function (_super) {
    __extends(NotebookComponentClass, _super);
    function NotebookComponentClass() {
        _super.apply(this, arguments);
    }
    NotebookComponentClass.prototype.getDirectChildren = function () {
        var directChildren = this.getChildSectionGroups();
        var childSections = this.getChildSections();
        childSections.forEach(function (section) {
            directChildren.push(section);
        });
        return directChildren;
    };
    NotebookComponentClass.prototype.getChildSectionGroups = function () {
        var _this = this;
        var sectionGroupRows = [];
        var sectionGroups = this.props.notebook.sectionGroups;
        if (sectionGroups) {
            sectionGroups.forEach(function (sectionGroup) {
                var path = _this.props.path + " > " + sectionGroup.name;
                var curSectionIdPath;
                if (_this.isPartOfCurSectionIdPath()) {
                    curSectionIdPath = _this.props.curSectionIdPath.splice(1);
                }
                sectionGroupRows.push(m.component(sectionGroupComponent_1.SectionGroupComponent, {curSectionId:_this.props.curSectionId, path:path, sectionGroup:sectionGroup, onSectionClicked:_this.props.onSectionClicked, curSectionIdPath:curSectionIdPath}));
            });
        }
        return sectionGroupRows;
    };
    NotebookComponentClass.prototype.getChildSections = function () {
        var _this = this;
        var sectionRows = [];
        var sections = this.props.notebook.sections;
        if (sections) {
            sections.forEach(function (section) {
                var path = _this.props.path + " > " + section.name;
                sectionRows.push(m.component(sectionComponent_1.SectionComponent, {section:section, curSectionId:_this.props.curSectionId, onSectionClicked:_this.props.onSectionClicked, path:path, parentId:_this.props.notebook.id}));
            });
        }
        return sectionRows;
    };
    NotebookComponentClass.prototype.getEntityClassName = function () {
        return "Notebook";
    };
    NotebookComponentClass.prototype.getId = function () {
        return this.props.notebook.id;
    };
    NotebookComponentClass.prototype.getImageClassName = function () {
        return "NotebookImage";
    };
    NotebookComponentClass.prototype.getImagePath = function () {
        return utils_1.Utils.getImageResourceUrl("notebook.png");
    };
    NotebookComponentClass.prototype.getLabel = function () {
        return this.props.notebook.name;
    };
    return NotebookComponentClass;
}(expandableEntityComponentBase_1.ExpandableEntityComponentBase));
;
var component = NotebookComponentClass.componentize();
exports.NotebookComponent = component;

},{"../../utils":16,"./expandableEntityComponentBase":3,"./sectionComponent":9,"./sectionGroupComponent":10}],6:[function(require,module,exports){
/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var notebookComponent_1 = require("./notebookComponent");
var componentBase_1 = require("../componentBase");
var constants_1 = require("../../constants");
;
var NotebookListComponentClass = (function (_super) {
    __extends(NotebookListComponentClass, _super);
    function NotebookListComponentClass() {
        _super.apply(this, arguments);
        this.hasScrolledIntoView = false;
    }
    NotebookListComponentClass.prototype.onSectionClicked = function (section) {
        this.props.onSectionClicked(section);
    };
    /**
     * Generates a list representing the path of entity ids to the section, where the
     * id at index 0 is the notebook id and the id at the last index is the section id.
     */
    NotebookListComponentClass.prototype.generateCurSectionIdPath = function () {
        var _this = this;
        var path = OneNoteApi.NotebookUtils.getPathFromNotebooksToSection(this.props.notebooks, function (s) { return s.id === _this.props.curSectionId; });
        return path ? path.map(function (elem) { return elem.id; }) : undefined;
    };
    NotebookListComponentClass.prototype.scrollToCurrentSection = function () {
        // We only want to call this the first time it is rendered into the view, not on state change
        if (this.props.curSectionId && !this.hasScrolledIntoView) {
            var currentSection = document.getElementById(this.props.curSectionId);
            if (currentSection && currentSection.scrollIntoView) {
                currentSection.scrollIntoView();
            }
            this.hasScrolledIntoView = true;
        }
    };
    NotebookListComponentClass.prototype.render = function () {
        var _this = this;
        var notebookRows = [];
        var curSectionIdPath = this.generateCurSectionIdPath();
        this.props.notebooks.forEach(function (notebook) {
            notebookRows.push(m.component(notebookComponent_1.NotebookComponent, {notebook:notebook, curSectionId:_this.props.curSectionId, path:notebook.name, onSectionClicked:_this.onSectionClicked.bind(_this), curSectionIdPath:curSectionIdPath}));
        });
        return ({tag: "ul", attrs: {id:constants_1.Constants.Ids.notebookList, className:"SectionPickerState SectionPicker", style:"display: block;", config:this.scrollToCurrentSection.bind(this)}, children: [
				notebookRows
			]});
    };
    return NotebookListComponentClass;
}(componentBase_1.ComponentBase));
var myComponent = NotebookListComponentClass.componentize();
exports.NotebookListComponent = myComponent;

},{"../../constants":12,"../componentBase":1,"./notebookComponent":5}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
var currentlySelectedSectionComponent_1 = require("./currentlySelectedSectionComponent");
var oneNotePickerPopupComponent_1 = require("./oneNotePickerPopupComponent");
var componentBase_1 = require("../componentBase");
var status_1 = require("../../status");
var OneNotePickerComponentClass = (function (_super) {
    __extends(OneNotePickerComponentClass, _super);
    function OneNotePickerComponentClass() {
        _super.apply(this, arguments);
    }
    OneNotePickerComponentClass.prototype.getInitialState = function () {
        return {
            popupVisible: false
        };
    };
    OneNotePickerComponentClass.prototype.onSectionLocationContainerClicked = function () {
        var newState = !this.state.popupVisible;
        this.setState({
            popupVisible: newState
        });
        this.props.onPopupToggle(newState);
    };
    OneNotePickerComponentClass.prototype.onSectionClicked = function (section) {
        this.setState({
            popupVisible: false
        });
        this.props.onSectionClicked(section);
        this.props.onPopupToggle(false);
    };
    OneNotePickerComponentClass.prototype.getStatusEnumFromString = function (statusAsString) {
        switch (statusAsString) {
            case "Succeeded":
                return status_1.Status.Succeeded;
            case "InProgress":
                return status_1.Status.InProgress;
            case "Failed":
                return status_1.Status.Failed;
            case "NotStarted":
                return status_1.Status.NotStarted;
            default:
                throw Error("Invalid status passed into OneNotePickerComponent: " + statusAsString);
        }
        ;
    };
    OneNotePickerComponentClass.prototype.getTextToDisplayFromStatus = function (status) {
        var textToDisplay;
        switch (status) {
            case status_1.Status.Succeeded:
                if (!this.props.textToDisplay) {
                    throw Error("Status is Succeeded but no text passed in to display to user");
                }
                textToDisplay = this.props.textToDisplay;
                break;
            case status_1.Status.InProgress:
            case status_1.Status.NotStarted:
                textToDisplay = this.props.localizedStrings.loadingNotebooks;
                break;
            case status_1.Status.Failed:
                textToDisplay = this.props.localizedStrings.defaultLocation;
                break;
            default:
                throw Error("Invalid status passed into getTextToDisplayFromStatus in OneNotePickerComponent: " + status);
        }
        return textToDisplay;
    };
    OneNotePickerComponentClass.prototype.render = function () {
        var status = this.getStatusEnumFromString(this.props.status);
        var textToDisplay = this.getTextToDisplayFromStatus(status);
        return ({tag: "div", attrs: {}, children: [
				m.component(currentlySelectedSectionComponent_1.CurrentlySelectedSectionComponent, {textToDisplay:textToDisplay, onSectionLocationContainerClicked:this.onSectionLocationContainerClicked.bind(this)}), 
				this.state.popupVisible
            ? (m.component(oneNotePickerPopupComponent_1.OneNotePickerPopupComponent, {notebooks:this.props.notebooks, status:status, onSectionClicked:this.onSectionClicked.bind(this), curSectionId:this.props.curSectionId, noNotebooksFound:this.props.localizedStrings.noNotebooksFound, notebookLoadFailureMessage:this.props.localizedStrings.notebookLoadFailureMessage}))
            : undefined
			]});
    };
    return OneNotePickerComponentClass;
}(componentBase_1.ComponentBase));
var myComponent = OneNotePickerComponentClass.componentize();
exports.OneNotePickerComponent = myComponent;

},{"../../status":15,"../componentBase":1,"./currentlySelectedSectionComponent":2,"./oneNotePickerPopupComponent":8}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var notebookListComponent_1 = require("./notebookListComponent");
var loadingElementComponent_1 = require("./loadingElementComponent");
var sectionPickerPopupMessageComponent_1 = require("./sectionPickerPopupMessageComponent");
var componentBase_1 = require("../componentBase");
var constants_1 = require("../../constants");
var status_1 = require("../../status");
var OneNotePickerPopupComponentClass = (function (_super) {
    __extends(OneNotePickerPopupComponentClass, _super);
    function OneNotePickerPopupComponentClass() {
        _super.apply(this, arguments);
    }
    // Retrieves the styling information from the CurrentlySelectedSection in order to anchor
    // the popup component in the correct place
    OneNotePickerPopupComponentClass.prototype.handlePopoverInsertion = function (element) {
        var saveToLocationContainer = document.getElementById(constants_1.Constants.Ids.saveToLocationContainer);
        if (saveToLocationContainer) {
            var boundingRect = saveToLocationContainer.getBoundingClientRect();
            element.style.width = boundingRect.width + "px";
        }
    };
    OneNotePickerPopupComponentClass.prototype.render = function () {
        var componentToRender;
        if (this.props.status === status_1.Status.InProgress || this.props.status === status_1.Status.NotStarted) {
            componentToRender = m.component(loadingElementComponent_1.LoadingElementComponent, {prop:true});
        }
        else if (this.props.status === status_1.Status.Failed) {
            componentToRender = m.component(sectionPickerPopupMessageComponent_1.SectionPickerPopupMessageComponent, {message:this.props.notebookLoadFailureMessage});
        }
        else if (!this.props.notebooks || this.props.notebooks.length === 0) {
            componentToRender = m.component(sectionPickerPopupMessageComponent_1.SectionPickerPopupMessageComponent, {message:this.props.noNotebooksFound});
        }
        else {
            componentToRender = m.component(notebookListComponent_1.NotebookListComponent, {curSectionId:this.props.curSectionId, onSectionClicked:this.props.onSectionClicked, notebooks:this.props.notebooks});
        }
        return ({tag: "div", attrs: Object.assign({className:"SectionPickerPopup"},  this.onElementDraw(this.handlePopoverInsertion)), children: [
				{tag: "div", attrs: {id:constants_1.Constants.Ids.sectionPickerContainer, className:"SectionPickerContainer"}, children: [
					componentToRender
				]}
			]});
    };
    return OneNotePickerPopupComponentClass;
}(componentBase_1.ComponentBase));
var myComponent = OneNotePickerPopupComponentClass.componentize();
exports.OneNotePickerPopupComponent = myComponent;

},{"../../constants":12,"../../status":15,"../componentBase":1,"./loadingElementComponent":4,"./notebookListComponent":6,"./sectionPickerPopupMessageComponent":11}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var componentBase_1 = require("../componentBase");
var utils_1 = require("../../utils");
var SectionComponentClass = (function (_super) {
    __extends(SectionComponentClass, _super);
    function SectionComponentClass() {
        _super.apply(this, arguments);
    }
    SectionComponentClass.prototype.render = function () {
        var isSelected = this.props.curSectionId === this.props.section.id;
        var className = "EntityImageAndNameContainer" + (isSelected ? " SelectedSection" : "");
        return ({tag: "li", attrs: {id:this.props.section.id, className:"Section"}, children: [
				{tag: "div", attrs: Object.assign({},  this.enableInvoke(this.props.onSectionClicked, 51, this.props),{className:className}), children: [
					{tag: "div", attrs: {className:"ExpandCollapseContainer"}, children: [
						{tag: "div", attrs: {className:"Expand"}, children: [
							{tag: "img", attrs: {className:"ExpandImage", src:utils_1.Utils.getImageResourceUrl("arrow_right.png")}}
						]}
					]}, 
					{tag: "div", attrs: {className:"EntityImage"}, children: [
						{tag: "img", attrs: {className:"SectionImage", src:utils_1.Utils.getImageResourceUrl("section.png")}}
						]}, 
					{tag: "div", attrs: {className:"EntityNameContainer"}, children: [
						{tag: "label", attrs: {className:"EntityName", alt:this.props.section.name, title:this.props.section.name}, children: [this.props.section.name]}
					]}
				]}
			]});
    };
    ;
    return SectionComponentClass;
}(componentBase_1.ComponentBase));
;
var component = SectionComponentClass.componentize();
exports.SectionComponent = component;

},{"../../utils":16,"../componentBase":1}],10:[function(require,module,exports){
/// <reference path="../../../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var expandableEntityComponentBase_1 = require("./expandableEntityComponentBase");
var sectionComponent_1 = require("./sectionComponent");
var sectionGroupComponent_1 = require("./sectionGroupComponent");
var utils_1 = require("../../utils");
var SectionGroupComponentClass = (function (_super) {
    __extends(SectionGroupComponentClass, _super);
    function SectionGroupComponentClass() {
        _super.apply(this, arguments);
    }
    SectionGroupComponentClass.prototype.getDirectChildren = function () {
        var directChildren = this.getChildSectionGroups();
        var childSections = this.getChildSections();
        childSections.forEach(function (section) {
            directChildren.push(section);
        });
        return directChildren;
    };
    SectionGroupComponentClass.prototype.getChildSectionGroups = function () {
        var _this = this;
        var sectionGroupRows = [];
        var sectionGroups = this.props.sectionGroup.sectionGroups;
        if (sectionGroups) {
            sectionGroups.forEach(function (sectionGroup) {
                var path = _this.props.path + " > " + sectionGroup.name;
                var curSectionIdPath;
                if (_this.isPartOfCurSectionIdPath()) {
                    curSectionIdPath = _this.props.curSectionIdPath.splice(1);
                }
                sectionGroupRows.push(m.component(sectionGroupComponent_1.SectionGroupComponent, {curSectionId:_this.props.curSectionId, path:path, sectionGroup:sectionGroup, onSectionClicked:_this.props.onSectionClicked, curSectionIdPath:curSectionIdPath}));
            });
        }
        return sectionGroupRows;
    };
    SectionGroupComponentClass.prototype.getChildSections = function () {
        var _this = this;
        var sectionRows = [];
        var sections = this.props.sectionGroup.sections;
        if (sections) {
            sections.forEach(function (section) {
                var path = _this.props.path + " > " + section.name;
                var curSectionIdPath;
                if (_this.isPartOfCurSectionIdPath()) {
                    curSectionIdPath = _this.props.curSectionIdPath.splice(1);
                }
                sectionRows.push(m.component(sectionComponent_1.SectionComponent, {section:section, curSectionId:_this.props.curSectionId, onSectionClicked:_this.props.onSectionClicked, path:path, parentId:_this.props.sectionGroup.id, curSectionIdPath:curSectionIdPath}));
            });
        }
        return sectionRows;
    };
    SectionGroupComponentClass.prototype.getEntityClassName = function () {
        return "SectionGroup";
    };
    SectionGroupComponentClass.prototype.getId = function () {
        return this.props.sectionGroup.id;
    };
    SectionGroupComponentClass.prototype.getImageClassName = function () {
        return "SectionGroupImage";
    };
    SectionGroupComponentClass.prototype.getImagePath = function () {
        return utils_1.Utils.getImageResourceUrl("section_group.png");
    };
    SectionGroupComponentClass.prototype.getLabel = function () {
        return this.props.sectionGroup.name;
    };
    return SectionGroupComponentClass;
}(expandableEntityComponentBase_1.ExpandableEntityComponentBase));
var component = SectionGroupComponentClass.componentize();
exports.SectionGroupComponent = component;

},{"../../utils":16,"./expandableEntityComponentBase":3,"./sectionComponent":9,"./sectionGroupComponent":10}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var componentBase_1 = require("../componentBase");
var constants_1 = require("../../constants");
;
var SectionPickerPopupMessageComponentClass = (function (_super) {
    __extends(SectionPickerPopupMessageComponentClass, _super);
    function SectionPickerPopupMessageComponentClass() {
        _super.apply(this, arguments);
    }
    SectionPickerPopupMessageComponentClass.prototype.render = function () {
        // Labels don't display two consecutive spaces so we only need to trim
        var messageToShow = this.props.message ? this.props.message.trim() : "";
        // We trust embedded html so we are able to embed links for actionable messages
        return ({tag: "label", attrs: {id:constants_1.Constants.Ids.sectionPickerPopupMessage, className:"SectionPickerState SectionPickerPopupMessage"}, children: [m.trust(messageToShow)]});
    };
    ;
    return SectionPickerPopupMessageComponentClass;
}(componentBase_1.ComponentBase));
;
var component = SectionPickerPopupMessageComponentClass.componentize();
exports.SectionPickerPopupMessageComponent = component;

},{"../../constants":12,"../componentBase":1}],12:[function(require,module,exports){
"use strict";
var Constants;
(function (Constants) {
    var Ids;
    (function (Ids) {
        // currentlySelectedSectionComponent
        Ids.saveToLocationContainer = "saveToLocationContainer";
        Ids.sectionLocationContainer = "sectionLocationContainer";
        // loadingElementComponent
        Ids.loadingImage = "loadingImage";
        // notebookListComponent
        Ids.notebookList = "notebookList";
        // oneNotePickerPopupComponent
        Ids.sectionPickerContainer = "sectionPickerContainer";
        // sectionPickerPopupMessageComponent
        Ids.sectionPickerPopupMessage = "sectionPickerPopupMessage";
    })(Ids = Constants.Ids || (Constants.Ids = {}));
})(Constants = exports.Constants || (exports.Constants = {}));

},{}],13:[function(require,module,exports){
"use strict";
var oneNotePickerComponent_1 = require("./UI/components/oneNotePickerComponent");
exports.OneNotePickerComponent = oneNotePickerComponent_1.OneNotePickerComponent;
var oneNotePickerDataSource_1 = require("./oneNotePickerDataSource");
exports.OneNotePickerDataSource = oneNotePickerDataSource_1.OneNotePickerDataSource;

},{"./UI/components/oneNotePickerComponent":7,"./oneNotePickerDataSource":14}],14:[function(require,module,exports){
/// <reference path="../../node_modules/onenoteapi/target/oneNoteApi.d.ts" />
"use strict";
var OneNotePickerDataSource = (function () {
    function OneNotePickerDataSource(authToken) {
        this.maxExpandedSections = 4;
        this.authToken = authToken;
    }
    OneNotePickerDataSource.prototype.getNotebooks = function (headers) {
        var _this = this;
        var api = new OneNoteApi.OneNoteApi(this.authToken, undefined /* timeout */, headers);
        return new Promise(function (resolve, reject) {
            api.getNotebooksWithExpandedSections(_this.maxExpandedSections).then(function (responsePackage) {
                var notebooks = responsePackage.parsedResponse.value;
                responsePackage.parsedResponse = notebooks;
                resolve(responsePackage);
            }, function (failure) {
                reject(failure);
            });
        });
    };
    return OneNotePickerDataSource;
}());
exports.OneNotePickerDataSource = OneNotePickerDataSource;

},{}],15:[function(require,module,exports){
"use strict";
(function (Status) {
    Status[Status["NotStarted"] = 0] = "NotStarted";
    Status[Status["InProgress"] = 1] = "InProgress";
    Status[Status["Succeeded"] = 2] = "Succeeded";
    Status[Status["Failed"] = 3] = "Failed";
})(exports.Status || (exports.Status = {}));
var Status = exports.Status;

},{}],16:[function(require,module,exports){
"use strict";
var Utils;
(function (Utils) {
    /*
     * Returns the relative path to the images directory.
     * Also, since Chromebook has case-sensitive urls, we always go with lowercase image names
     * (see the use of "lowerCasePathName" in gulpfile.js where the images names are lower-cased when copied)
     */
    function getImageResourceUrl(imageName) {
        return ("images/" + imageName).toLowerCase();
    }
    Utils.getImageResourceUrl = getImageResourceUrl;
})(Utils = exports.Utils || (exports.Utils = {}));

},{}]},{},[13])(13)
});