import React from 'react';
import ReactDOM from 'react-dom';
import { max_xy, board_size, directions } from './Config';
import './index.css';

class Circle extends React.Component {
  handleClick = () => {
    if (this.props.selectable) {
      this.props.addSelected(this.props.x, this.props.y);
    }
    else if (this.props.movable !== undefined) {
      console.log("Move me");
    }
    else {
      this.props.emptySelected();
    }
  }

  render() {
    const key=`${this.props.y}_${this.props.x}`
    const cx = this.props.x_indent + this.props.x * this.props.scale
    let clickable;
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
      fill = "url(#blackSelected)"
      clickable = true
    }
    else if (this.props.color === 'black' && !this.props.selected) {
      fill = "url(#black)"
      clickable = true
    }
    else if (this.props.color === 'white' && this.props.selected) {
      fill = "url(#whiteSelected)"
      clickable = true
    }
    else if (this.props.color === 'white' && !this.props.selected) {
      fill = "url(#white)"
      clickable = true
    }
    else {
      r = r*0.7
      fill='#b0b0b0'
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

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square">
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  movable = {};
  selectable = [];

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
      this.props.grid[head + dir] === null) {
      ret.push(dir);
    }
    else if (selected.length === 3 &&
      this.props.grid[head + dir] === this.props.oppPlayer &&
      this.props.grid[head + dir * 2] === this.props.oppPlayer &&
      this.props.grid[head + dir * 3] === null) {
      ret.push(dir);
    }
    return ret;
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
      console.log(dirs);
      for (var dir1 of dirs) {
        this.movable[head + dir1] = dir1;
      }
      head = selected[selected.length - 1];
      body = selected[selected.length - 2];
      dirs = this.calcMovablePoints(head, body, selected);
      console.log(dirs);
      for (var dir2 of dirs) {
        this.movable[head + dir2] = dir2;
      }
      // const horizCandidates = [];
      // const dir1 = selected[0] - selected[1];
      // console.log("selected[0]: %s", selected[0]);
      // // get horizCandidates first
      // const dir1Index = directions.indexOf(dir1);
      // horizCandidates.push(directions[(dir1Index + 1) % 6])
      // horizCandidates.push(directions[(dir1Index + 2) % 6])
      // horizCandidates.push(directions[(dir1Index + 4) % 6])
      // horizCandidates.push(directions[(dir1Index + 5) % 6])
      // for (var direction of horizCandidates) {
      //   let possible = true;
      //   for (var stone of selected) {
      //     if (stone + direction < 0 || stone + direction > max_xy * max_xy) {
      //       possible = false;
      //       break;
      //     }
      //     if (this.props.grid[stone + direction] !== null) {
      //       possible = false;
      //       break;
      //     }
      //   }
      //   if (possible) {
      //     this.movable.push(selected[0] + direction);
      //   }
      // }
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
    console.log("select: %s", xy2index(x, y));
    // const newState = {}
    // Object.assign(newState, this.state)
    // newState.selected = newSelected
    // newState.movable = 
    // this.setState(newState)
    // this.updateMovable(newSelected);
    // this.updateSelectable(newSelected);
    updateState(this, {
      "selected": newSelected,
    })
  }
  emptySelected() {
    // this.updateMovable([]);
    // this.updateSelectable([]);
    updateState(this, {
      "selected": [],
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
      movable={this.props.playerTurn ? this.movable[xy2index(x, y)] : undefined}
      selectable={this.props.playerTurn && this.selectable.includes(xy2index(x, y))}
      addSelected={(x, y) => this.addSelected(x, y)}
      emptySelected={() => this.emptySelected()}
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
      <div style={{ backgroundColor: 'yellow', width: '300px', height: '300px' }}>
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
        {/* <circle r="50" fill="blue" /> */}
        </svg>
      </div>
    )
  }
}

class Game extends React.Component {
  buildGrid() {
    const grid = Array(max_xy * max_xy).fill(null)
    return grid
  }
  constructor(props) {
    super(props);
    this.state = {
      currentGrid: null,
      history: [
        {
          grid: null
        }
      ],
      stepNumber: 0,
      blackIsNext: true
    };
    this.state.currentGrid = this.buildGrid();
    // this.state.history[this.state.stepNumber].grid = this.buildGrid()
    // this.state.history[this.state.stepNumber].grid[xy2index(0, 0)] = 'black'
    // this.state.history[this.state.stepNumber].grid[xy2index(1, 1)] = 'white'
    // this.state.history[this.state.stepNumber].grid[xy2index(1, 0)] = 'black'
    // this.state.history[this.state.stepNumber].grid[xy2index(2, 1)] = 'white'

    // Test
    // const ws = new WebSocket("ws://localhost:9000/mcts");
    const ws = new WebSocket("ws://localhost:9000/ab3");
    ws.onmessage = (evt) => {
      console.log(evt);
      // console.log(evt.data);
      let splitData = evt.data.split(":");
      let playerTurn = splitData[0];
      let board = splitData[1];
      let grid;
      if (playerTurn === "true") {
        playerTurn = true;
        grid = decodeGrid(board);
      }
      else {
        playerTurn = false;
        grid = decodeGrid(board);
      }
      updateState(this, {"currentGrid": grid});
      // console.log(board)
    };
    console.log("pppp: %s", this.state["blackIsNext"]);
    ws.onopen = () => {   // 연결!
      console.log("connected!!");
      ws.send("white:start");
    };
  }
  render() {
    const hello="hello world";
    return (
      <div className="game">
        <div className="game-board">
          <Board
            grid={this.state.currentGrid}
            player="black"
            oppPlayer="white"
            playerTurn={true}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function xy2index(x, y) {
  return y * max_xy + x;
}

function index2xy(idx) {
  const x = idx % max_xy;
  const y = Math.floor(idx / max_xy);
  return [x, y];
}

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

function updateState(obj, updateDict) {
  const newState = {};
  Object.assign(newState, obj.state);
  for (const [key, value] of Object.entries(updateDict)) {
    newState[key] = value;
  }
  obj.setState(newState);
}

function decodeGrid(grid) {
  const ret = Array(max_xy * max_xy).fill(null);
  for (var i = 0; i < grid.length; i++) {
    if (grid.charAt(i) === 'o') {
      ret[i] = 'black';
    }
    else if (grid.charAt(i) === 'x') {
      ret[i] = 'white';
    }
  }
  return ret;
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Game />
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
