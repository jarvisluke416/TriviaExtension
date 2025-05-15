import React, { useState, useEffect } from 'react';
import '../App.css'; // Make sure this path is correct

const GRID_COLS = 6;
const TOTAL_SQUARES = GRID_COLS * GRID_COLS;
const FALLBACK_IMAGE = '/fallback.png'; // Should be placed in `public/`

const TriviaBoard = () => {
  const [triviaItems, setTriviaItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchAllTrivia = async () => {
      try {
        const files = [
          'dogData.json',
          'gunData.json',
          'triviaData.json',
          'stadiumData.json',
          'carData.json',
          'gemstoneData.json',
          'fishData.json',
          'drinkData.json',
        ];

        const responses = await Promise.all(
          files.map((file) => fetch(`/${file}`).then((res) => res.json()))
        );

        const combined = responses.flat();
        const shuffled = combined
          .sort(() => Math.random() - 0.5)
          .slice(0, TOTAL_SQUARES);

        setTriviaItems(shuffled);
      } catch (error) {
        console.error('❌ Failed to fetch trivia data:', error);
      }
    };

    fetchAllTrivia();
  }, []);

  return (
    <div className="board">
      <div className="grid">
        {triviaItems.map((item, index) => (
          <div
            key={index}
            className="cell"
            onClick={() => {
              setSelected(item);
              setShowAnswer(false);
            }}
          >
            <img
              src={item.imageUrl || FALLBACK_IMAGE}
              alt={`Trivia ${item.id}`}
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.imageUrl || FALLBACK_IMAGE}
              alt="Selected Trivia"
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />
            <h3>{selected.question}</h3>
            <p>{selected.facts}</p>
            {showAnswer && <strong>Answer: {selected.correctAnswer}</strong>}
            <button onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaBoard;
