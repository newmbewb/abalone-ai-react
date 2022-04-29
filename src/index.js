import React from 'react';
import ReactDOM from 'react-dom/client';
import { max_xy, board_size, directions } from './Config';
import Game from './Game'
import './index.css';
import { confirmAlert } from 'react-confirm-alert';
import useConfirm from './useConfirm';
import alphabetaImage from './alphabeta.png';

function DifficultyButton(props) {
  return (
    <div className="square" style={{ backgroundColor: props.backgroundColor, width: props.width, height: '20%', boxShadow: "0 0 0 0.5px #ddd inset" }}
      onClick={props.onClick}>
        <div className="textline"> {props.text} </div>
    </div>
  )
}

function PrintDecription(props) {
  if (props.difficulty === "easy") {
    return (
      "AlphaBeta Purning으로 만들어진 인공지능입니다.\n쉽게 이길 수 있습니다. 세 수 앞을 내다봅니다."
    )
  }
  if (props.difficulty === "normal") {
    return (
      "Monte Carlo Tree Search로 만들어진 인공지능입니다.\n아발론에 익숙한 유저만이 이길 수 있습니다. 강한 수읽기를 구사합니다."
    )
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: "easy",
      color: "black"
    };
  }
  selectDifficulty(difficulty) {
    this.setState((state) => {
      return {difficulty: difficulty}
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
          <div className="square" style={{ width: '15%', height: '75vmin', float: 'left'}}>
            <div className="textline">난이도</div>
          </div>
          <div className="square" style={{backgroundColor: '#ffef93', width: '85%', height: '75vmin', float: 'left'}}>
            <div className="centerdiv" style={{ width: '90%', height: '70%' }}>
              <DifficultyButton
                width="33.33%"
                text="쉬움"
                backgroundColor={this.state.difficulty === "easy" ? "#ddd" : "white"}
                onClick={() => this.selectDifficulty("easy")}
              />
              <DifficultyButton
                width="33.33%"
                text="보통"
                backgroundColor={this.state.difficulty === "normal" ? "#ddd" : "white"}
                onClick={() => this.selectDifficulty("normal")}
              />
              <DifficultyButton
                width="33.33%"
                text="어려움 (만드는 중)"
                backgroundColor={this.state.difficulty === "hard" ? "#ddd" : "white"}
                // onClick={() => this.selectDifficulty("hard")}
              />
              <div className="square" style={{ backgroundColor: '#ddd', width: '99.99%', height: '80%', boxShadow: "0 0 0 0.5px #ddd inset" }}>
                <div className="textline" style={{fontSize: "2rem", whiteSpace: "pre-wrap"}}>
                  <PrintDecription
                    difficulty={this.state.difficulty}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='player-color' style={{ float: 'top', height: '15vmin'}}>
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
          onClick={() => this.props.startGame(this.state.color, this.state.difficulty)}>
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
    this.difficulty = "easy";
    this.gameKey = 0;
    this.state = {
      now: "home",
    };
  }

  startGame(color, difficulty) {
    this.color = color;
    this.difficulty = difficulty;
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
            difficulty={this.difficulty}
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
