import React from 'react';
import { max_xy, board_size, directions } from './Config';
import useConfirm from './useConfirm';
import './index.css';
import { bot2difficulty, bot2port } from './gameBot';
import { getRecordRaw, recordDisconnected, recordLoss, recordWin } from './cookie';
import { Translation } from './lang/i18nHelper.tsx'
import i18next from "./lang/i18n";

class Circle extends React.Component {
  handleClick = () => {
    if (this.props.selectable) {
      this.props.addSelected(this.props.x, this.props.y);
    }
    else if (this.props.movable !== undefined) {
      this.props.sendMove(this.props.movable);
    }
    else {
      this.props.emptySelected();
    }
  }

  render() {
    const key=`${this.props.y}_${this.props.x}`
    const cx = this.props.x_indent + this.props.x * this.props.scale;
    let r = this.props.r;
    if (Math.abs(this.props.x - this.props.y) >= board_size) {
      return
    }

    let fill;
    let stroke;
    let strokeWidth=.3;
    let strokeDasharray=.5;

    // Set color
    if (this.props.color === 'black' && this.props.selected) {
      fill = "url(#blackSelected)";
    }
    else if (this.props.color === 'black' && !this.props.selected) {
      fill = "url(#black)";
      if (this.props.moved) {
        strokeDasharray=.1;
        stroke="#ED7D31";
      }
    }
    else if (this.props.color === 'white' && this.props.selected) {
      fill = "url(#whiteSelected)";
    }
    else if (this.props.color === 'white' && !this.props.selected) {
      fill = "url(#white)";
      if (this.props.moved) {
        strokeDasharray=.1;
        stroke="#ED7D31";
      }
    }
    else {
      r = r*0.7
      if (this.props.new_hole) {
        fill='#A3937B'
      }
      else {
        fill='#b0b0b0'
      }
    }

    // Set stroke
    // let stroke="black";
    // let strokeWidth=.3;
    // let strokeDasharray=.5;
    if (this.props.movable !== undefined) {
      stroke="black";
      r = this.props.r;
    }
    

    return (
      <circle
      key={key}
      cx={cx}
      cy={this.props.cy}
      r={r}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      fill={fill}
      onClick={this.handleClick}
      />
    )
  }
}

class Board extends React.Component {
  movable = {};
  selectable = [];

  sendMove(direction) {
    const selected = this.state.selected.join(",");
    this.props.sendMove(selected, direction);
    this.moveStones(this.state.selected, direction);
    
    this.setState({selected: []});
  }

  calcMovablePoints(head, body, selected) {
    const dir = head - body;
    const ret = [];

    // Calc horiz first
    const dir1Index = directions.indexOf(dir);
    const horizCandidates = [];
    horizCandidates.push(directions[(dir1Index + 1) % 6]);
    horizCandidates.push(directions[(dir1Index + 5) % 6]);
    for (var direction of horizCandidates) {
      let possible = true;
      for (var stone of selected) {
        if (this.props.grid[stone + direction] !== null) {
          possible = false;
          break;
        }
      }
      if (possible) {
        ret.push(direction);
      }
    }
    
    // Calc vertical move
    if (this.props.grid[head + dir] === null) {
      ret.push(dir);
    }
    else if (this.props.grid[head + dir] === this.props.oppPlayer &&
      (this.props.grid[head + dir * 2] === null || this.props.grid[head + dir * 2] === undefined)) {
      ret.push(dir);
    }
    else if (selected.length === 3 &&
      this.props.grid[head + dir] === this.props.oppPlayer &&
      this.props.grid[head + dir * 2] === this.props.oppPlayer &&
      (this.props.grid[head + dir * 3] === null || this.props.grid[head + dir * 3] === undefined)) {
      ret.push(dir);
    }
    return ret;
  }

  _moveStone(grid, stone, direction) {
    const old_value = grid[stone];
    const new_point = stone + direction;

    // Check whether the point is out of the board
    if (new_point < 0 || new_point > max_xy * max_xy) {
      return;
    }
    const xy = index2xy(new_point);
    if (Math.abs(xy[0] - xy[1]) > board_size) {
      return;
    }

    if (grid[new_point] === 'black' || 
        grid[new_point] === 'white') {
      this._moveStone(grid, new_point, direction);
    }
    grid[new_point] = old_value;
    grid[stone] = null;
  }

  moveStones(selected, direction) {
    const grid = this.props.grid.slice();
    const movedStones = selected.slice().map(x => x + direction);
    selected.sort(function(a, b) {
      return a - b;
    });
    const diff = selected[0] - selected[1];
    if (diff === direction || diff === -direction) {
      if (direction < 0) {
        selected.reverse();
      }
      this._moveStone(grid, selected[0], direction);
    }
    else {
      const selected_length = selected.length;
      for (var i = 0; i < selected_length; i++) {
        this._moveStone(grid, selected[i], direction);
      }
    }
    this.props.updateBoard(grid, movedStones);
  }

  updateMovable(selected) {
    this.movable = {};
    if (selected.length === 0) {
      // pass
    }
    else if (selected.length === 1) {
      const p = selected[0];
      for(var direction of directions) {
        if (this.props.grid[p + direction] === null) {
          this.movable[p + direction] = direction;
        }
      }
    }
    else if (selected.length <= 3) {
      let head, body, dirs;
      selected.sort((a, b) => a - b);
      head = selected[0];
      body = selected[1];
      dirs = this.calcMovablePoints(head, body, selected);
      for (var dir1 of dirs) {
        this.movable[head + dir1] = dir1;
      }
      head = selected[selected.length - 1];
      body = selected[selected.length - 2];
      dirs = this.calcMovablePoints(head, body, selected);
      for (var dir2 of dirs) {
        this.movable[head + dir2] = dir2;
      }
    }
  }
  updateSelectable(selected) {
    this.selectable = [];
    if (selected.length === 0) {
      for (let y = 0; y < max_xy; y++) {
        for (let x = 0; x < max_xy; x++) {
          const index = xy2index(x, y);
          if (this.props.grid[index] === this.props.player) {
            this.selectable.push(index);
          }
        }
      }
    }
    else if (selected.length === 1) {
      const p = selected[0];
      for(var direction of directions) {
        const index = p + direction;
        if (this.props.grid[index] === this.props.player) {
          this.selectable.push(index)
        }
      }
    }
    else if (selected.length === 2) {
      const p1 = selected[0], p2 = selected[1];
      const candidates = [p2 * 2 - p1, p1 * 2 - p2];
      for(var index of candidates) {
        if (this.props.grid[index] === this.props.player) {
          this.selectable.push(index);
        }
      }
    }
    else if (selected.length === 3) {
      // pass
    }
    else {
      console.log("Something wrong in getSelectable...");
    }
  }
  addSelected(x, y) {
    const newSelected = this.state.selected.slice();
    newSelected.push(xy2index(x, y));
    this.setState({
      selected: newSelected,
    })
  }
  emptySelected() {
    this.setState({
      selected: [],
    })
  }
  
  renderCircle(owner, idx) {
    const xy = index2xy(idx);
    const x = xy[0], y = xy[1];

    const scale = 4;
    const r = scale * 0.4;
    const indent = board_size - 1 - y;
    const x_indent = indent * 0.5 * scale + 4;
    const cy = (y * Math.sqrt(3) / 2) * scale + 6;
    const key=`${y}_${x}`
    return (
      <Circle
      key={key}
      x={x}
      y={y}
      color={owner}
      cy={cy}
      r={r}
      x_indent={x_indent}
      scale={scale}
      selected={this.state.selected.includes(xy2index(x, y))}
      moved={this.props.movedStones.includes(xy2index(x, y))}
      new_hole={this.props.newHoles.includes(xy2index(x, y))}
      movable={this.props.playerTurn ? this.movable[xy2index(x, y)] : undefined}
      selectable={this.props.playerTurn && this.selectable.includes(xy2index(x, y))}
      addSelected={(x, y) => this.addSelected(x, y)}
      emptySelected={() => this.emptySelected()}
      sendMove={(move) => this.sendMove(move)}
      />
    )
  }

  constructor(props) {
    super(props);
    // this.const = {
    //   directions: [max_xy*(-1)-1, max_xy*(-1), -1, 1, max_xy, max_xy+1]
    // }
    this.updateMovable([]);
    this.updateSelectable([]);
    this.state = {
      selected: [],
    };
  }

  render() {
    this.updateMovable(this.state.selected);
    this.updateSelectable(this.state.selected);
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <svg
          viewBox="0 0 40 40"
          style={{ background: '#F4EEDD' }}
          onContextMenu={this.onRightClick}
        >
        <defs>
          <radialGradient id="black">
            <stop offset="50%"  stopColor="black"/>
            <stop offset="100%" stopColor="#a0a0a0"/>
          </radialGradient>
          <radialGradient id="white">
            <stop offset="50%"  stopColor="white"/>
            <stop offset="100%" stopColor="#808080"/>
          </radialGradient>
          <radialGradient id="blackSelected">
            <stop offset="30%"  stopColor="black"/>
            <stop offset="100%" stopColor="#C19F3F"/>
          </radialGradient>
          <radialGradient id="whiteSelected">
            <stop offset="50%"  stopColor="white"/>
            <stop offset="100%" stopColor="#74E8F4"/>
          </radialGradient>
        </defs>
        {
          this.props.grid.map((line, idx) => this.renderCircle(line, idx))
        }
        <text x="50%" y="7.5%" dominantBaseline="middle" textAnchor="middle" fontSize="4" fontFamily='Georgia, serif' strokeWidth="0.5" paintOrder="stroke" stroke="#F4B183">
          {this.props.winner}
        </text>
        </svg>
      </div>
    )
  }
}

class Game extends React.Component {
  appendLog(grid) {
    const history = this.state.history.splice(0, this.state.moveNumber);
    this.setState({history: history.concat([{grid: grid}]),
    moveNumber: this.state.moveNumber + 1});
  }
  updateBoardFromMsg(evt) {
    if (this.state.recorded === false) {
      if ((evt.data === "false:black_win" && this.props.color === 'black') ||
          (evt.data === "false:white_win" && this.props.color === 'white')) {
        recordWin(this.props.bot);
        this.setState({playerIsNext: false, winner: "You Win!!"});
        this.sendMsg("record:" + getRecordRaw());
        return;
      }
      else if ((evt.data === "false:black_win" && this.props.color === 'white') ||
               (evt.data === "false:white_win" && this.props.color === 'black')) {
        recordLoss(this.props.bot);
        this.setState({playerIsNext: false, winner: "You Lose!!"});
        this.sendMsg("record:" + getRecordRaw());
        return;
      }
    }
    let splitData = evt.data.split(":");
    let playerTurn = splitData[0];
    let board = splitData[1];
    let movedStones = splitData[2].split(",").map(x => parseInt(x));
    let newHoles = splitData[3].split(",").map(x => parseInt(x));
    const decoded = decodeGrid(board);
    const grid = decoded[0];
    if (playerTurn === "true") {
      playerTurn = true;
    }
    else {
      playerTurn = false;
    }
    this.appendLog(grid);
    const deadBlacks = decoded[1];
    const deadWhites = decoded[2];
    const statusMessage = "Black: " + deadWhites + " " + this.str_point + "       White: " + deadBlacks + " " + this.str_point;
    if (this.props.bot === 'self') {
      this.flipPlayer();
    }
    this.setState({currentGrid: grid, playerIsNext: playerTurn, statusMessage: statusMessage, movedStones: movedStones, newHoles: newHoles});
  }

  updateBoard(grid, movedStones) {
    var blackScore = 14;
    var whiteScore = 14;
    for (var i = 0; i < grid.length; i++) {
      const color = grid[i];
      if (color === 'black') {
        whiteScore--;
      }
      if (color === 'white') {
        blackScore--;
      }
    }
    const statusMessage = "Black: " + blackScore + " " + this.str_point + "       White: " + whiteScore + " " + this.str_point;
    this.setState({currentGrid: grid, statusMessage: statusMessage, movedStones: movedStones});
  }

  sendMove(selected, direction) {
    // Encode board
    let grid = "";
    for (const owner of this.state.currentGrid) {
      if (owner === 'black') {
        grid += 'o';
      }
      else if (owner === 'white') {
        grid += 'x';
      }
      else {
        grid += '.';
      }
    }
    this.sendMsg([this.player, grid, selected, direction].join(":"));
    this.setState({playerIsNext: false});
  }

  sendMsg(msg) {
    // const ws = new WebSocket(this.url, this.protocols, {rejectUnauthorized: false});
    const ws = new WebSocket(this.url);
    ws.onmessage = (evt) => this.updateBoardFromMsg(evt);
    ws.onclose = (e) => {
      // pass
    }
    ws.onopen = () => {   // ??????!
      ws.send("" + this.props.gameTag + ":" + msg);
    };
  }

  undo() {
    const curMoveNumber = this.state.moveNumber;
    if (curMoveNumber === 1) {
      return;
    }
    this.updateBoard(this.state.history[curMoveNumber - 2].grid, []);
    this.setState({moveNumber: curMoveNumber - 1});
  }

  redo() {
    const curMoveNumber = this.state.moveNumber;
    if (curMoveNumber === this.state.history.length) {
      return;
    }
    this.updateBoard(this.state.history[curMoveNumber].grid, []);
    this.setState({moveNumber: curMoveNumber + 1});
  }

  flipPlayer() {
    const tmp = this.player;
    this.player = this.oppPlayer;
    this.oppPlayer = tmp;
  }

  constructor(props) {
    super(props);
    this.player = this.props.color;
    if (this.player === "black") {
      this.oppPlayer = "white";
    }
    else if (this.player === "white") {
      this.oppPlayer = "black";
    }
    else {
      console.log("Invalid player..");
    }
    if (this.props.bot === 'self') {
      this.flipPlayer();
    }

    this.url = "ws://"+window.location.hostname+":"+bot2port(this.props.bot)+"/"+this.props.bot;
    this.state = {
      currentGrid: null,
      stepNumber: 0,
      playerIsNext: true,
      winner: null,
      statusMessage: "",
      movedStones: [],
      newHoles: [],
      history: [],
      moveNumber: 0,
      recorded: false,
    };
    this.state.currentGrid = Array(max_xy * max_xy).fill(null);
    recordDisconnected(this.props.bot);
    if (this.props.options['flip_board']) {
      this.sendMsg(this.player+":start:flip_board");
    }
    else{
      this.sendMsg(this.player+":start");
    }

    if (i18next.language === "ko") {
      this.stop_message = "????????? ??????????????????????";
    }
    else {
      this.stop_message = "Do you want to stop this game?";
    }

    if (i18next.language === "ko") {
      this.str_point = "???";
    }
    else {
      this.str_point = "Points";
    }
  }
  render() {
    return (
      <div className="game">
        <div className="game-board" style={{ width: '95vmin', height: '95vmin' }}>
          <Board
            grid={this.state.currentGrid}
            updateBoard={(grid, movedStones) => this.updateBoard(grid, movedStones)}
            player={this.player}
            oppPlayer={this.oppPlayer}
            playerTurn={this.state.playerIsNext}
            sendMove={(selected, direction) => this.sendMove(selected, direction)}
            winner={this.state.winner}
            movedStones={this.state.movedStones}
            newHoles={this.state.newHoles}
          />
        </div>
        <div style={{ width: '95vmin', height: '10vmin', top: '50%', fontSize: '3rem', textAlign: 'center', backgroundColor: 'white', whiteSpace: 'pre' }}>
          <div className="textline">{this.state.statusMessage}</div>
        </div>
        <div style={{ width: '95vmin', height: '10vmin', top: '50%', fontSize: '3rem', textAlign: 'center', backgroundColor: 'white', whiteSpace: 'pre' }}>
          <div className="square" style={{ width: '80%', height: '100%', float: 'left', fontWeight: 'lighter'}}>
            <div className="textline"><Translation data="difficulty"/>: {bot2difficulty(this.props.bot)}</div>
          </div>
          <div className="square" style={{ width: '10%', height: '100%', float: 'left'}} onClick={() => this.undo()}>
            <div className="textline">&lt;&lt;</div>
          </div>
          <div className="square" style={{ width: '10%', height: '100%', float: 'left'}} onClick={() => this.redo()}>
            <div className="textline">&gt;&gt;</div>
          </div>
        </div>
        <div style={{ width: '95vmin', height: '10vmin', top: '50%', fontSize: '3rem', textAlign: 'center', backgroundColor: '#F4B183' }}
        onClick={() => useConfirm(this.stop_message, this.props.goBackHome, () => {})}>
          <div className="textline"><Translation data="back_home"/></div>
        </div>
      </div>
    );
  }
}

function xy2index(x, y) {
  return y * max_xy + x;
}

function index2xy(idx) {
  const x = idx % max_xy;
  const y = Math.floor(idx / max_xy);
  return [x, y];
}

// function updateState(obj, updateDict) {
//   const newState = {};
//   Object.assign(newState, obj.state);
//   for (const [key, value] of Object.entries(updateDict)) {
//     newState[key] = value;
//   }
//   obj.setState(newState);
// }

function decodeGrid(grid) {
  const ret = Array(max_xy * max_xy).fill(null);
  let blackCount = 0, whiteCount = 0;
  for (var i = 0; i < grid.length; i++) {
    if (grid.charAt(i) === 'o') {
      ret[i] = 'black';
      blackCount++;
    }
    else if (grid.charAt(i) === 'x') {
      ret[i] = 'white';
      whiteCount++;
    }
  }
  return [ret, 14 - blackCount, 14 - whiteCount];
}

export default Game;