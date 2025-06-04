import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const state = location.state as
    | { teaName?: string; teaType?: string }
    | undefined;

  // Use a function for initial state so it only runs once
  const [selectedTea, setSelectedTea] = useState(() => {
    const actualTeaName = state?.teaType + " Tea";
    if (state?.teaType && teaOptions.some((t) => t.type === actualTeaName)) {
      return teaOptions.find((t) => t.type === actualTeaName)!;
    }
    console.log(state?.teaType);
    return teaOptions[0];
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customMinutes, setCustomMinutes] = useState("");

  // Sync selectedTea with navigation state on every navigation
  useEffect(() => {
    if (state?.teaType && teaOptions.some((t) => t.type === state.teaType)) {
      setSelectedTea(teaOptions.find((t) => t.type === state.teaType)!);
      setRunning(false);
      setProgress(0);
      setTimeLeft(0);
    }
    // eslint-disable-next-line
  }, [location.key, state?.teaType]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
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
    // eslint-disable-next-line
  }, [running, paused, timeLeft]);

  const startTimer = () => {
    const minutes =
      selectedTea.type === "Custom" ? parseInt(customMinutes) : null;
    const time =
      selectedTea.type === "Custom" &&
      typeof minutes === "number" &&
      !isNaN(minutes)
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
      className="position-relative min-vh-100 d-flex justify-content-center align-items-start"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "5rem",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          zIndex: 0,
        }}
      />

      <div
        className="card shadow p-4 text-center"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.9)",
          zIndex: 1,
        }}
      >
        <h2 className="mb-4">Tea Timer ⏱️</h2>
        {state?.teaName && <h4 className="mb-3">Brewing: {state.teaName}</h4>}

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCustomMinutes(e.target.value)
              }
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
