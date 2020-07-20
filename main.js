/*
 * @Author: your name
 * @Date: 2020-07-20 20:25:17
 * @LastEditTime: 2020-07-20 22:49:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /toy-react/main.js
 */ 
// require('./lib.js')
import  {ToyReact, Component} from "./ToyReact"
/*
class MyComponent {
}
let a = <MyComponent name='a'/>
*/
class MyComponent extends Component{
    render() {
        return <div>
            <span>hello</span>
            <span>world!</span>
            <div>
                {true}
                {this.children}
            </div>
        </div>
    }
}
/*
let a = <div name='a' id='ida'>
    <span>Hello</span>
    <span>World</span>
    <span>!</span>
    <span></span>
    </div>
*/
let a = <MyComponent name='a' id='ida'>
    <div>123</div>
    <div>456</div>
</MyComponent>
ToyReact.render(a, document.body)
// console.log('main')
// document.body.appendChild(a);