/*
 * @Author: your name
 * @Date: 2020-07-20 20:42:56
 * @LastEditTime: 2020-07-23 01:27:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /toy-react/ToyReact.js
 */ 
let childrenSymbol = Symbol("children");
class ElementWrapper {
    constructor(type) {
        this.type = type;
        this.props = Object.create(null);
        this[childrenSymbol] = [];
        this.children = [];
        // this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        /*
        if(name.match(/^on([\s\S]+)$/)) {
            // eventName首字母小写
            let eventName = RegExp.$1.replace(/^[\s\S]/, s=>s.toLowerCase());
            // 事件监听器
            this.root.addEventListener(eventName, value);
        }
        // react类字段 -> html类字段
        if(name === 'className')
            name = 'class';
        this.root.setAttribute(name, value);
        */
        this.props[name] = value;
    }
    //get children() {
    //    return this[childrenSymbol].map(child => child.vdom)
    //}
    appendChild(vchild) {
        /*let range = document.createRange();
        if (this.root.children.length) {
            range.setStartAfter(this.root.lastChild)
            range.setEndAfter(this.root.lastChild)
        } else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        vchild.mountTo(range);*/
        // this.children.push(vchild);
        this[childrenSymbol].push(vchild)
        this.children.push(vchild.vdom)
    }
    get vdom() {
        /* return {
            type: this.type,
            props: this.props,
            children: this.children.map(child => child.vdom)
        } */
        return this
    }
    mountTo(range) {
        this.range = range;
        let placeholder = document.createComment('placeHolder');
        let endRange = document.createRange();
        endRange.setStart(range.endContainer, range.endOffset);
        endRange.setEnd(range.endContainer, range.endOffset);
        endRange.insertNode(placeholder)
        /*
        this.range.deleteContents();
        */

        range.deleteContents();
        let element = document.createElement(this.type);

        for(let name in this.props) {
            let value = this.props[name];
            if(name.match(/^on([\s\S]+)$/)) {
                // eventName首字母小写
                let eventName = RegExp.$1.replace(/^[\s\S]/, s=>s.toLowerCase());
                // 事件监听器
                element.addEventListener(eventName, value);
            }
            // react类字段 -> html类字段
            if(name === 'className')
                element.setAttribute('class', value);
            element.setAttribute(name, value);
        }
        for(let child of this.children) {
            let range = document.createRange()
            if (element.children.length) {
                range.setStartAfter(element.lastChild)
                range.setEndAfter(element.lastChild)
            } else {
                range.setStart(element, 0);
                range.setEnd(element, 0);
            }
            child.mountTo(range);
        }
        range.insertNode(element);
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = '#text';
        this.children = [];
        this.props = Object.create(null)
    }
    mountTo(range) {
        this.range = range;
        range.deleteContents();
        this.range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
    get vdom() {
        return this
        /* {
            type: '#text',
            props: this.props,
            children: []
        } */
    }
}
export class Component {
    constructor(){
        this.children = [];
        this.props = Object.create(null)
    }
    get type() {
        return this.constructor.type;
    }
    setAttribute(name, value) {
        /*if(name.match(/^on([\s\S]+)$/)) {
            console.log(RegExp.$1);
        }*/
        if (name === 'className'){
            name = 'class'
        }
        this.props[name] = value;
        this[name] = value
    }
    mountTo(range) {
        // range.deleteContents();
        this.range = range;
        this.update();
    }
    update(){
        /*
        let placeholder = document.createComment('placeHolder');
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder)
        this.range.deleteContents();
        */
        // let vdom = this.render();
        let vdom = this.vdom;
        if(this.oldvdom) {
            // update vdom
            let isSameNode = (node1, node2) => {
                if (node1.type !== node2.type)
                    return false
                if (node1.type === '#text') {
                    if (node1.root.data !== node2.root.data)
                        return false
                }
                if(Object.keys(node1.props).length !== Object.keys(node2.props).length)
                    return false;
                for(let name in node1.props) {
                    /* if (typeof node1.props[name] === 'fucntion' &&
                            typeof node2.props[name] === 'fucntion' &&
                            node1.props[name].toString() === node2.props[name].toString())
                        continue */
                    if (typeof node1.props[name] === 'object' &&
                        typeof node2.props[name] === 'object' &&
                        JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name]))
                        continue
                    if(node1.props[name] !== node2.props[name])
                        return false;
                }
                return true
            }
            let isSameTree = (node1, node2) => {
                if(!isSameNode(node1, node2))
                    return false;
                if(node1.children.length !== node2.children.length)
                    return false;
                for (let i = 0; i< node1.children.length; i ++)
                    if(!isSameTree(node1.children[i], node2.children[i]))
                        return false;
                return true;
            }
            let replace = (newTree, oldTree) => {
                if(isSameTree(newTree, oldTree)) {
                    console.log('all the same')
                    return
                }
                if(!isSameNode(newTree, oldTree)) {
                    console.log('not same node')
                    newTree.mountTo(oldTree.range);
                } else {
                    console.log('children not same')
                    if (newTree.children.length === oldTree.children.length) {
                        for(let i = 0; i < newTree.children.length; i++) {
                            replace(newTree.children[i], oldTree.children[i]);
                        }
                    } else {
                        newTree.mountTo(oldTree.range)
                    }
                }
            }
            replace(vdom, this.oldvdom);
            // console.log('new: ', vdom);
            // console.log('old: ', this.vdom);
        } else {
            vdom.mountTo(this.range);
        }
        this.oldvdom = vdom;
    }
    get vdom() {
        return this.render().vdom;
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        if (typeof state === 'undefined')
            return void 0
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if (typeof newState[p] === 'object' && newState[p] !== null) {
                    if (typeof oldState[p] !== 'objcet') {
                        if (newState[p] instanceof Array)
                            oldState[p] = []
                        else
                            oldState[p] = {};
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
            return oldState
        }
        if (!this.state)
            this.state = {};
        let oldState = JSON.parse(JSON.stringify(this.state))
        let newState = merge(this.state, state)
        const diff = (oldState, newState) => {
            return JSON.stringify(oldState) !== JSON.stringify(newState)
        }
        if(diff(oldState, newState)) {
            this.update()
        }
    }
}
export let ToyReact = {
    createElement(type, attributes, ...children) {
        let element;
        if(typeof type === 'string')
            element = new ElementWrapper(type);
        else
            element = new type;
        for (let name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
        let insertChildren = (children) => {
            for (let child of children) {
                if(Array.isArray(child)){
                    insertChildren(child)
                } else {
                    if (child === null || child === void 0)
                        child = '';
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWrapper)
                        && !(child instanceof TextWrapper))
                        child = child + '';
                    if (typeof child === 'string') 
                        child = new TextWrapper(child)
                    element.appendChild(child);
                }
            }
        }
        insertChildren(children)
        return element;
    },
    render(vdom, element) {
        /* mount to dom element
            :param vdom 
        */
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild)
            range.setEndAfter(element.lastChild)
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        vdom.mountTo(range)
    }
}
