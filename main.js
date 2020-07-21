/*
 * @Author: your name
 * @Date: 2020-07-20 20:25:17
 * @LastEditTime: 2020-07-21 22:18:44
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
class Square extends Component {
    /*
    constructor(props) {
        super(props);
        */
    //构造函数, 初始化state属性
    constructor() {
        super();
        this.state = {
            value: null,
        };
    }
    render() {
        return (
            <button className="square" onClick={() => this.setState({value: 'X'})}>
                <span>
                    {this.state.value ? this.state.value : ''}
                </span>
            </button>
        );
    }
}
class Board extends Component {
    renderSquare(i) {
        return <Square value={i} />;
    };
    render() {
        return (
            <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
      }
}
/*
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
let a = <div name='a' id='ida'>
    <span>Hello</span>
    <span>World</span>
    <span>!</span>
    <span></span>
    </div>
let a = <MyComponent name='a' id='ida'>
    <div>123</div>
    <div>456</div>
</MyComponent>
*/
let a = <Board/>
ToyReact.render(a, document.body)
// console.log('main')
// document.body.appendChild(a);