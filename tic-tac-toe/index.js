import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//component is a part of the UI this can be class or function
function Square (props){
  /*there was a constructor here but as we want the parent class to handle the
  state of the game we have passed a function in to this class from parent
  which will keep track of the state of the squares and therefore the game.*/
  return (
    <button
      className="square"
      //although onClick was defined in Board the button element needs to have it too.
      onClick = {props.onClick} >
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        //passes the value for the square being rendered (from Game) as a prop to Square
        value = {this.props.squares[i]}
        //passes the handleClick method to the Square class as a prop, uses the props received from Game
        onClick = {() => this.props.onClick(i)}
        />);
  }

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

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history: [{
        //to track the state of the game an array with each button(square) can be used
        squares: Array(9).fill(null),
      }],
        stepNumber: 0,
        //tracks which player is next
        xIsNext: true,
    };
  }

  handleClick(i) {
    //get array of moves made that allows for going back "in time"
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //get latest move
    const current = history[history.length - 1];
    //create copy of array to work with - immutability is important! i.e. can allow undo/redo.
    const squares =  current.squares.slice();
    //ignore click if game over
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    //squares[i] comes from renderSquare(i)
    squares[i] = this.state.xIsNext? "X": "O";
    //update the board's state with the altered array and set xIsNext to opposite value
    this.setState({
      history: history.concat([{squares:squares,}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext});
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    //check if anyone has won
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, index)=> {
      //when initialised, the array has 1 object at index 0 (0 will return false)
      const desc = index?
        "Go to move #" + index :
        "Go to game start";
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    /*destructuring assignment sets a=0, b=1, c=2 for example, unpacks values
    from array or properties from objects into distinct variables.*/
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
