import React from 'react';
import ReactDOM from 'react-dom/client';
import { max_xy, board_size, directions } from './Config';
import Game from './Game'
import './index.css';
import './modal.css';
import { setCookie, getCookie, recordWin, recordLoss, recordDisconnected, getRecordString } from './cookie'
import { confirmAlert } from 'react-confirm-alert';
import useConfirm from './useConfirm';
import alphabetaImage from './alphabeta.png';
import Popup from 'reactjs-popup';
import { bot2difficulty, bot2explanation } from './gameBot';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    var name = getCookie('userid');
    console.log("cookied name: " + name);
    if (name === undefined) {
      name = 'visitor';
      setCookie(name);
    }
    this.state = {value: name};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log("hello " + event.target.value);
    setCookie('userid', event.target.value);
  }

  render() {
    return (
      <label>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
    );
  }
}


function DifficultyButton(props) {
  return (
    <div className="square" style={{ backgroundColor: props.backgroundColor, width: props.width, height: '20%', boxShadow: "0 0 0 0.5px #ddd inset" }}
      onClick={props.onClick}>
        <div className="textline"> {props.text} </div>
    </div>
  )
}

function PrintDecription(props) {
  return bot2explanation(props.bot);
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bot: "ab3",
      color: "black"
    };
  }
  selectBot(bot) {
    this.setState((state) => {
      return {bot: bot}
    });
  }
  setColor(color) {
    this.setState((state) => {
      return {color: color}
    });
  }
  render() {
    return (
      <div id='home-root' style={{ width: '100%', height: '100%' }}>
        <div id='difficulty'>
          <div className="square" style={{ width: '15%', height: '64vmin', float: 'left'}}>
            <div className="textline">난이도</div>
          </div>
          <div className="square" style={{backgroundColor: '#ffef93', width: '85%', height: '64vmin', float: 'left'}}>
            <div className="centerdiv" style={{ width: '90%', height: '70%' }}>
              <DifficultyButton
                width="33.33%"
                text={bot2difficulty('ab3')}
                backgroundColor={this.state.bot === 'ab3' ? "#ddd" : "white"}
                onClick={() => this.selectBot('ab3')}
              />
              <DifficultyButton
                width="33.33%"
                text={bot2difficulty('mcts')}
                backgroundColor={this.state.bot === "mcts" ? "#ddd" : "white"}
                onClick={() => this.selectBot("mcts")}
              />
              <DifficultyButton
                width="33.33%"
                text="어려움 (만드는 중)"
                backgroundColor={this.state.bot === "hard" ? "#ddd" : "white"}
                // onClick={() => this.selectBot("hard")}
              />
              <div className="square" style={{ backgroundColor: '#ddd', width: '99.99%', height: '80%', boxShadow: "0 0 0 0.5px #ddd inset" }}>
                <div className="textline" style={{fontSize: "2rem", whiteSpace: "pre-wrap"}}>
                  <PrintDecription
                    bot={this.state.bot}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='player-color' style={{ float: 'top', height: '13vmin'}}>
          <div className="square" style={{ width: '15%', height: '100%', float: 'left'}}>
            <div className="textline">아이디</div>
          </div>
          <div className="square" style={{
              backgroundColor: "white",
              width: '75%',
              height: '100%',
              float: 'left'}}>
            <div className="textline">
              <NameForm/>
            </div>
          </div>
          <div className="square" style={{
              backgroundColor: "white",
              width: '10%',
              height: '100%',
              float: 'left'}}>
            <div className="textline">
            <Popup trigger={<button className="modal-button">전적</button>} modal nested>
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> 전적 </div>
                  <div className="content">
                    {' '}
                    {getRecordString()}
                  </div>
                  <div className="actions">
                    {/* <Popup
                      trigger={<button className="button"> Trigger </button>}
                      position="top center"
                      nested
                    >
                      <span>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                        magni omnis delectus nemo, maxime molestiae dolorem numquam
                        mollitia, voluptate ea, accusamus excepturi deleniti ratione
                        sapiente! Laudantium, aperiam doloribus. Odit, aut.
                      </span>
                    </Popup> */}
                    <button
                      className="button"
                      onClick={() => {
                        close();
                      }}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
            </Popup>
            </div>
          </div>
        </div>
        <div id='player-color' style={{ float: 'top', height: '13vmin'}}>
          <div className="square" style={{ width: '15%', height: '100%', float: 'left'}}>
            <div className="textline">내 색깔</div>
          </div>
          <div className="square" style={{
              backgroundColor: this.state.color === "black"? "#aaa" : "white",
              width: '42.5%',
              height: '100%',
              float: 'left'}}
              onClick={() => this.setColor('black')}>
            <div className="textline">검은색</div>
          </div>
          <div className="square" style={{
              backgroundColor: this.state.color === "white"? "#aaa" : "white",
              width: '42.5%',
              height: '100%',
              float: 'left'}}
              onClick={() => this.setColor('white')}>
            <div className="textline">흰색</div>
          </div>
        </div>
        <div className="square" style={{backgroundColor: '#ffaaaa', width: '100%', height: '10vmin', float: 'left'}}
          onClick={() => this.props.startGame(this.state.color, this.state.bot)}>
          <div className="textline">시작</div>
        </div>
      </div>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.color = "black";
    this.bot = "ab3";
    this.gameKey = 0;
    this.state = {
      now: "home",
    };
  }

  startGame(color, bot) {
    this.color = color;
    this.bot = bot;
    this.gameKey += 1;
    this.setState((state) => {
      return {
        now: "game",
      }
    });
  }

  Reset() {
    this.setState((state) => {
      return {
        now: "home",
      }
    });
  }

  render() {
    if (this.state.now === "home") {
    return (
      <div id='pageroot' style={{ width: '100%', height: '100%' }}>
        <Home
          startGame={(a, b) => this.startGame(a, b)}
        />
      </div>
    )
    }
    else if (this.state.now === "game") {
      return (
        // <div id='pageroot' style={{ width: '100vmin', height: '100vmin', overflowY: 'visible' }}>
        <div id='pageroot'>
          <Game
            key={this.gameKey}
            color={this.color}
            bot={this.bot}
            goBackHome={() => {this.Reset()}}
            gameTag={Math.random()}
          />
        </div>
      )
    }
  }
}

// ReactDOM.render(
//   <Main />,
//   document.getElementById('root')
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Main />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
