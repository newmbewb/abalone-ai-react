import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './Game'
import './index.css';
import './modal.css';
import { setCookie, getCookie, recordWin, recordLoss, recordDisconnected, getRecordString } from './cookie'
import { confirmAlert } from 'react-confirm-alert';
import useConfirm from './useConfirm';
import alphabetaImage from './alphabeta.png';
import thumbnail from './thumbnail.jpg';
import { Translation } from './lang/i18nHelper.tsx'
import Popup from 'reactjs-popup';
import { bot2difficulty, bot2explanation } from './gameBot';
import { Helmet, HelmetProvider  } from 'react-helmet';
import i18next from "./lang/i18n";

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    var name = getCookie('userid');
    console.log("cookied name: " + name);
    if (name === undefined) {
      name = 'visitor';
      setCookie('userid', name);
    }
    this.state = {value: name};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
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
      bot: "network_naive",
      color: "black",
      options: {flip_board: false}
    };
  }
  flip_board() {
    const new_options = {};
    Object.assign(new_options, this.state.options);
    new_options['flip_board'] = !new_options['flip_board']
    this.setState({options: new_options});
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
            <div className="textline"><Translation data="difficulty"/></div>
          </div>
          <div className="square" style={{backgroundColor: '#ffef93', width: '85%', height: '64vmin', float: 'left'}}>
            <div className="centerdiv" style={{ width: '90%', height: '70%' }}>
              <DifficultyButton
                width="33.33%"
                text={bot2difficulty('network_naive')}
                backgroundColor={this.state.bot === 'network_naive' ? "#ddd" : "white"}
                onClick={() => this.selectBot('network_naive')}
              />
              <DifficultyButton
                width="33.33%"
                text={bot2difficulty('mcts_ac_r1000')}
                backgroundColor={this.state.bot === "mcts_ac_r1000" ? "#ddd" : "white"}
                onClick={() => this.selectBot("mcts_ac_r1000")}
              />
              <DifficultyButton
                width="33.33%"
                text={bot2difficulty('mcts_ac_r2000')}
                backgroundColor={this.state.bot === "mcts_ac_r2000" ? "#ddd" : "white"}
                onClick={() => this.selectBot("mcts_ac_r2000")}
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
            <div className="textline"><Translation data="id"/></div>
          </div>
          <div className="square" style={{
              backgroundColor: "white",
              width: '65%',
              height: '100%',
              float: 'left'}}>
            <div className="textline">
              <NameForm/>
            </div>
          </div>
          <div className="square" style={{
              backgroundColor: "white",
              width: '20%',
              height: '100%',
              float: 'left'}}>
            <div className="textline">
            <Popup trigger={<button className="modal-button"><Translation data="record"/></button>} modal nested>
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> <Translation data="record"/> </div>
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
                      <Translation data="close"/>
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
            <div className="textline"><Translation data="my_color"/></div>
          </div>
          <div className="square" style={{
              backgroundColor: this.state.color === "black"? "#aaa" : "white",
              width: '42.5%',
              height: '100%',
              float: 'left'}}
              onClick={() => this.setColor('black')}>
            <div className="textline"><Translation data="black"/></div>
          </div>
          <div className="square" style={{
              backgroundColor: this.state.color === "white"? "#aaa" : "white",
              width: '42.5%',
              height: '100%',
              float: 'left'}}
              onClick={() => this.setColor('white')}>
            <div className="textline"><Translation data="white"/></div>
          </div>
        </div>
        <div className="square" style={{backgroundColor: '#ffaaaa', width: '100%', height: '10vmin', float: 'left'}}
          onClick={() => this.props.startGame(this.state.color, this.state.bot, this.state.options)}>
          <div className="textline"><Translation data="start"/></div>
        </div>
        <div className="square" style={{
          backgroundColor: this.state.options['flip_board']? "#aaa" : "white",
          width: '100%',
          height: '10vmin',
          float: 'left'}}
          onClick={() => this.flip_board()}>
          <div className="textline"><Translation data="reverse_board"/></div>
        </div>
      </div>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.color = "black";
    this.bot = "network_naive";
    this.gameKey = 0;
    this.options = {};
    this.state = {
      now: "home",
    };

    if (navigator.language === "ko-KR" || navigator.language === "ko-kr" || navigator.language === "ko") {
      i18next.changeLanguage("ko");
    }
    else {
      i18next.changeLanguage("en");
    }
  }

  startGame(color, bot, options) {
    this.color = color;
    this.bot = bot;
    this.gameKey += 1;
    this.options = options;
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
          startGame={(a, b, c) => this.startGame(a, b, c)}
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
            options={this.options}
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
  // <Translation data="hello"/>
  <>
    <Helmet>
      <title>Abalone AI</title>
      {/* <meta property="og:image" content={thumbnail}/> */}
      <meta property="og:title" content="Abalone AI"/>
      <meta property="og:description" content="Abalone AI"/>
    </Helmet>
    <div>
      <Main />
      <div className="newmbewb">
      AI Code: <a href="https://github.com/newmbewb/abalone-ai"> Github </a> <br/>
      Developer: <a href="https://newmbewb.github.io/"> newmbewb </a> <br/>
      </div>
    </div>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
