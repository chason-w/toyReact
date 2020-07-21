/*
 * @Author: your name
 * @Date: 2020-07-20 20:42:56
 * @LastEditTime: 2020-07-21 22:27:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /toy-react/ToyReact.js
 */ 
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
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
    }
    appendChild(vchild) {
        let range = document.createRange();
        if (this.root.children.length) {
            range.setStartAfter(this.root.lastChild)
            range.setEndAfter(this.root.lastChild)
        } else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        vchild.mountTo(range);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
}
export class Component {
    constructor(){
        this.children = [];
        this.props = Object.create(null)
    }
    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            console.log(RegExp.$1);
        }
        this.props[name] = value;
        this[name] = value
    }
    mountTo(range) {
        // console.log(range)
        // range.deleteContents();
        this.range = range;
        this.update();
    }
    update(){
        let placeholder = document.createComment('placeHolder');
        let range = document.createRange();
        console.log('this.range:', this.range)
        console.log(this.range.endContainer);
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder)
        this.range.deleteContents();
        let vdom = this.render();
        vdom.mountTo(this.range);
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if (typeof newState[p] === 'object') {
                    if (typeof oldState[p] !== 'objcet') {
                        oldState[p] = {};
                    }
                    merge(oldStte[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
        }
        if (!this.state && state)
            this.state = {};
        merge(this.state, state);
        console.log(this.state);
        this.update()
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
                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child)
                } else {
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWrapper)
                        && !(child instanceof TextWrapper))
                        child = String(child);
                    if (typeof child == 'string') 
                        child = new TextWrapper(child)
                    element.appendChild(child);
                }
            }
        }
        insertChildren(children)
        console.log(element)
        return element;
    },
    render(vdom, element) {
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild)
            range.setEndAfter(element.lastChild)
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        console.log('range in render: ', range)
        vdom.mountTo(range)
    }
}
