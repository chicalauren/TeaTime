import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Sound to play when tea is ready
const beepSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

const teaOptions = [
  { type: 'Green Tea', temp: '175°F (80°C)', time: 120, color: '#88B04B' },  // Light green
  { type: 'Black Tea', temp: '200°F (93°C)', time: 240, color: '#8B0000' },   // Dark red
  { type: 'Oolong Tea', temp: '185°F (85°C)', time: 180, color: '#FF8C00' },  // Orange
  { type: 'White Tea', temp: '160°F (70°C)', time: 150, color: '#F5F5DD' },   // Beige
  { type: 'Herbal Tea', temp: '212°F (100°C)', time: 300, color: '#6A5ACD' }, // Slate blue
];

function TeaTimer() {
  const [selectedTea, setSelectedTea] = useState(teaOptions[0]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        setProgress(((selectedTea.time - (timeLeft - 1)) / selectedTea.time) * 100);
      }, 1000);
    } else if (running && timeLeft === 0) {
      beepSound.play();
      alert('🍵 Tea is ready!');
      setRunning(false);
      setProgress(100);
    }
    return () => clearTimeout(timer);
  }, [running, timeLeft, selectedTea.time]);

  const startTimer = () => {
    setTimeLeft(selectedTea.time);
    setProgress(0);
    setRunning(true);
  };

  const currentBackground = selectedTea.color;

  return (
    <div
      className="timer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '2rem',
        backgroundColor: currentBackground,
        minHeight: '100vh',
        transition: 'background-color 0.5s ease',
      }}
    >
      <h2>Tea Timer ⏱️</h2>

      <select
        value={selectedTea.type}
        onChange={(e) => {
          const tea = teaOptions.find((t) => t.type === e.target.value);
          if (tea) setSelectedTea(tea);
        }}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      >
        {teaOptions.map((tea) => (
          <option key={tea.type} value={tea.type}>
            {tea.type}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '1rem', fontSize: '1.2rem', textAlign: 'center' }}>
        <p><strong>Recommended Temperature:</strong> {selectedTea.temp}</p>
        <p><strong>Recommended Steep Time:</strong> {Math.floor(selectedTea.time / 60)} minutes</p>
      </div>

      {running && (
        <div style={{ width: '200px', height: '200px' }}>
          <CircularProgressbar
            value={progress}
            text={`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
            styles={buildStyles({
              textColor: '#000',
              pathColor: '#000',
              trailColor: '#eee',
            })}
          />
        </div>
      )}

      {!running && (
        <button onClick={startTimer} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          Start Timer
        </button>
      )}
    </div>
  );
}

export default TeaTimer;

