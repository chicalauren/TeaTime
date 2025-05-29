import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const beepSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

const teaOptions = [
  { type: 'Green Tea', temp: '175°F (80°C)', time: 120, color: '#88B04B' },
  { type: 'Black Tea', temp: '200°F (93°C)', time: 240, color: '#8B0000' },
  { type: 'Oolong Tea', temp: '185°F (85°C)', time: 180, color: '#FF8C00' },
  { type: 'White Tea', temp: '160°F (70°C)', time: 150, color: '#F5F5DD' },
  { type: 'Herbal Tea', temp: '212°F (100°C)', time: 300, color: '#6A5ACD' },
];

// 🔁 Replace this with the actual image URL you're using on Dashboard
const backgroundImageUrl = '/images/tea-background.jpg';

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
  }, [running, timeLeft]);

  useEffect(() => {
    setRunning(false);
    setProgress(100);
  }, [selectedTea]);

  const startTimer = () => {
    setTimeLeft(selectedTea.time);
    setProgress(0);
    setRunning(true);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '5rem',
      }}
    >
      <div className="card shadow p-4 text-center" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <h2 className="mb-4">Tea Timer ⏱️</h2>

        <div className="mb-3">
          <select
            className="form-select"
            value={selectedTea.type}
            onChange={(e) => {
              const tea = teaOptions.find((t) => t.type === e.target.value);
              if (tea) setSelectedTea(tea);
            }}
          >
            {teaOptions.map((tea) => (
              <option key={tea.type} value={tea.type}>
                {tea.type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p><strong>Recommended Temperature:</strong> {selectedTea.temp}</p>
          <p><strong>Recommended Steep Time:</strong> {Math.floor(selectedTea.time / 60)} minutes</p>
        </div>

        {running && (
          <div className="mx-auto mb-3" style={{ width: '200px', height: '200px' }}>
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
          <button className="btn btn-primary btn-lg" onClick={startTimer}>
            Start Timer
          </button>
        )}
      </div>
    </div>
  );
}

export default TeaTimer;
