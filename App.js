import React, { useEffect, useState } from "react";
import "./App.css";

const allCardImages = [
  { src: "/img/css.png", matched: false },
  { src: "/img/express.png", matched: false },
  { src: "/img/html.png", matched: false },
  { src: "/img/java.png", matched: false },
  { src: "/img/python.png", matched: false },
  { src: "/img/sql.png", matched: false },
  { src: "/img/react.png", matched: false },
  { src: "/img/mongo.png", matched: false },
  { src: "/img/node.png", matched: false },
];
const levels = {
  Easy: 5,
  Medium: 7,
  Hard: 10
};

function App() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [level, setLevel] = useState("Easy");
  const [gameCompleted, setGameCompleted] = useState(false);

  // Start new game
  const shuffleCards = (selectedLevel = level) => {
    const numPairs = levels[selectedLevel];
    const selectedImages = allCardImages.slice(0, numPairs);
    const shuffled = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setCards(shuffled);
    setFirstChoice(null);
    setSecondChoice(null);
    setScore(0);
    setTime(0);
    setTimerRunning(true);
    setGameCompleted(false);
    setLevel(selectedLevel);
  };

  // Start timer
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Compare choices
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards(prev =>
          prev.map(card =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
        setScore(prev => prev + 10);

        setTimeout(() => {
          const allMatched = cards.every(
            card => card.matched || card.src === firstChoice.src
          );
          if (allMatched) {
            setGameCompleted(true);
            setTimerRunning(false);
          }
          resetTurn();
        }, 500);
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  const handleChoice = (card) => {
    if (!disabled) {
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Start game on load
  useEffect(() => {
    shuffleCards("Easy");
  }, []);

  return (
    <div className="App">
      <h1> Memory Match Game</h1>

      <div className="controls">
        <div className="scoreboard">
          <p>Score: {score}</p>
          <p>Time: {time}s</p>
        </div>
        <div className="level-select">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            value={level}
            onChange={(e) => shuffleCards(e.target.value)}
          >
            {Object.keys(levels).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          <button onClick={() => shuffleCards(level)}>Restart</button>
        </div>
      </div>

      {gameCompleted && (
        <div className="congrats">
          <h2> Congratulations! 🎉 you won the game</h2>
          <p>Your Score: {score}</p>
          <p>Time: {time}s</p>
          <button onClick={() => shuffleCards(level)}>Play Again</button>
        </div>
      )}

      <div
        className="card-grid"
        style={{
          gridTemplateColumns: 'repeat(${Math.min(levels[level], 6)},100px)'
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice ||
              card === secondChoice ||
              card.matched
            }
          />
        ))}
      </div>
    </div>
  );
}
function Card({ card, handleChoice, flipped }) {
  const handleClick = () => {
    if (!flipped) {
      handleChoice(card);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        <img className="front" src={card.src} alt="card front" />
        <img className="back" src="/img/back.png" alt="card back" />
      </div>
    </div>
  );
}

export default App;