import React, { useState, useEffect } from 'react';
import '../App.css';

const GRID_COLS = 6;
const FALLBACK_IMAGE = '/fallback.png';

const TriviaBoard = () => {
  const [triviaItems, setTriviaItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState({
    player1: { score: 0 },
    player2: { score: 0 },
  });
  const [playerAnswers, setPlayerAnswers] = useState({
    player1: '',
    player2: '',
  });
  const [timer, setTimer] = useState(null);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerReady, setPlayerReady] = useState({
    player1: false,
    player2: false,
  });

  // Load and shuffle trivia
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sources = [
          '/triviaData.json',
          '/stadiumData.json',
          '/gunData.json',
          '/gemstoneData.json',
          '/drinkData.json',
          '/dogData.json',
          '/carData.json',
        ];
        const allData = await Promise.all(sources.map((src) => fetch(src).then((res) => res.json())));
        const combined = allData.flat();
        const shuffled = combined.sort(() => Math.random() - 0.5).slice(0, 36);
        setTriviaItems(shuffled);
      } catch (err) {
        console.error('Error loading trivia:', err);
      }
    };
    fetchData();
  }, []);

  // Start game when both players are ready
  useEffect(() => {
    if (playerReady.player1 && playerReady.player2) {
      setGameStarted(true);
    }
  }, [playerReady]);

  // Set selected question on game start or index change
  useEffect(() => {
    if (gameStarted && triviaItems.length && currentQuestionIndex < triviaItems.length) {
      const item = triviaItems[currentQuestionIndex];
      setSelected(item);

      // Speak facts and wait for it to finish before starting timer
      if (item?.facts) {
        const utterance = new SpeechSynthesisUtterance(item.facts);
        speechSynthesis.cancel();
        utterance.onend = () => setTimer(8); // Start timer after speech
        speechSynthesis.speak(utterance);
      } else {
        setTimer(8); // If no facts, start immediately
      }
    }
  }, [gameStarted, currentQuestionIndex, triviaItems]);

  // Countdown timer
  useEffect(() => {
    if (!gameStarted || timer === null || isRoundOver) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          evaluateAnswers();

          if (currentQuestionIndex + 1 >= triviaItems.length) {
            setIsRoundOver(true);
          } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          }

          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, gameStarted]);

  const evaluateAnswers = () => {
    const correct = triviaItems[currentQuestionIndex]?.correctAnswer?.toLowerCase();
    const newScores = { ...playerScores };

    Object.entries(playerAnswers).forEach(([player, answer]) => {
      if (answer.trim().toLowerCase() === correct) {
        newScores[player].score += 10;
      }
    });

    setPlayerScores(newScores);
    setPlayerAnswers({ player1: '', player2: '' }); // reset answers
  };

  const handlePlayerReady = (player) => {
    setPlayerReady((prev) => ({ ...prev, [player]: true }));
  };

  return (
    <div className="board">
      {/* Player scores and Start buttons */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        {Object.keys(playerScores).map((playerId) => (
          <div key={playerId}>
            <p>{playerId}: {playerScores[playerId].score} points</p>
            {!playerReady[playerId] && (
              <button onClick={() => handlePlayerReady(playerId)}>
                Start Game ({playerId})
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Question Grid */}
      <div className="grid">
        {triviaItems.map((item, index) => (
          <div
            key={index}
            className={`cell ${index === currentQuestionIndex ? 'active-question' : ''}`}
          >
            <img
              src={item.imageUrl || FALLBACK_IMAGE}
              alt={`Trivia ${index}`}
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
          </div>
        ))}
      </div>

      {/* Active question modal */}
      {selected && gameStarted && !isRoundOver && (
        <div className="modal-overlay">
          <div className="modal">
            <img
              src={selected.imageUrl || FALLBACK_IMAGE}
              alt="Selected"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
            <h2>{selected.question}</h2>
            <p><strong>Time remaining:</strong> {timer !== null ? timer : 'Waiting...'}</p>

            <div>
              <label>Player 1 Answer:</label>
              <input
                type="text"
                value={playerAnswers.player1}
                onChange={(e) =>
                  setPlayerAnswers((prev) => ({ ...prev, player1: e.target.value }))
                }
                disabled={timer === null}
              />
            </div>
            <div>
              <label>Player 2 Answer:</label>
              <input
                type="text"
                value={playerAnswers.player2}
                onChange={(e) =>
                  setPlayerAnswers((prev) => ({ ...prev, player2: e.target.value }))
                }
                disabled={timer === null}
              />
            </div>
          </div>
        </div>
      )}

      {/* Game over screen */}
      {isRoundOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Scores:</p>
          {Object.keys(playerScores).map((playerId) => (
            <div key={playerId}>
              <p>{playerId}: {playerScores[playerId].score} points</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TriviaBoard;
