import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const beepSound = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

const teaOptions = [
  { type: "Green Tea", temp: "175°F (80°C)", time: 120, color: "#88B04B" },
  { type: "Black Tea", temp: "200°F (93°C)", time: 240, color: "#8B0000" },
  { type: "Oolong Tea", temp: "185°F (85°C)", time: 180, color: "#FF8C00" },
  { type: "White Tea", temp: "160°F (70°C)", time: 150, color: "#F5F5DD" },
  { type: "Herbal Tea", temp: "212°F (100°C)", time: 300, color: "#6A5ACD" },
  { type: "Custom", temp: "", time: 0, color: "#808080" },
];

const backgroundImageUrl = "/images/tea-background.jpg";

function TeaTimer() {
  const [selectedTea, setSelectedTea] = useState(teaOptions[0]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customMinutes, setCustomMinutes] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && !paused && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        const baseTime =
          selectedTea.type === "Custom"
            ? parseInt(customMinutes) * 60
            : selectedTea.time;
        setProgress(((baseTime - (timeLeft - 1)) / baseTime) * 100);
      }, 1000);
    } else if (running && timeLeft === 0 && !paused) {
      beepSound.play();
      alert("🍵 Tea is ready!");
      setRunning(false);
      setProgress(100);
    }
    return () => clearTimeout(timer);
  }, [running, paused, timeLeft]);

  const startTimer = () => {
    const minutes =
      selectedTea.type === "Custom" ? parseInt(customMinutes) : null;
    const time =
      selectedTea.type === "Custom" && typeof minutes === "number" && !isNaN(minutes)
        ? minutes * 60
        : selectedTea.time;

    if (!time || isNaN(time)) {
      return alert("Please enter a valid custom time in minutes.");
    }

    setTimeLeft(time);
    setProgress(0);
    setRunning(true);
    setPaused(false);
  };

  const pauseResume = () => {
    setPaused((prev) => !prev);
  };

  const handleTeaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tea = teaOptions.find((t) => t.type === e.target.value);
    if (tea) {
      setSelectedTea(tea);
      setRunning(false);
      setProgress(0);
      setTimeLeft(0);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "5rem",
      }}
    >
      <div
        className="card shadow p-4 text-center"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <h2 className="mb-4">Tea Timer ⏱️</h2>

        <div className="mb-3">
          <select
            className="form-select"
            value={selectedTea.type}
            onChange={handleTeaChange}
          >
            {teaOptions.map((tea) => (
              <option key={tea.type} value={tea.type}>
                {tea.type}
              </option>
            ))}
          </select>
        </div>

        {selectedTea.type === "Custom" && (
          <div className="mb-3">
            <label className="form-label">Custom Steep Time (minutes):</label>
            <input
              type="number"
              className="form-control"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min="1"
            />
          </div>
        )}

        {selectedTea.type !== "Custom" && (
          <div className="mb-4">
            <p>
              <strong>Recommended Temperature:</strong> {selectedTea.temp}
            </p>
            <p>
              <strong>Recommended Steep Time:</strong>{" "}
              {Math.floor(selectedTea.time / 60)} minutes
            </p>
          </div>
        )}

        {running && (
          <div
            className="mx-auto mb-3"
            style={{ width: "200px", height: "200px" }}
          >
            <CircularProgressbar
              value={progress}
              text={`${Math.floor(timeLeft / 60)}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}
              styles={buildStyles({
                textColor: "#000",
                pathColor: "#000",
                trailColor: "#eee",
              })}
            />
          </div>
        )}

        {!running ? (
          <button className="btn btn-primary btn-lg" onClick={startTimer}>
            Start Timer
          </button>
        ) : (
          <button className="btn btn-secondary btn-lg" onClick={pauseResume}>
            {paused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}

export default TeaTimer;
