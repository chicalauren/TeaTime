import { useEffect, useState } from "react";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Eye } from "react-bootstrap-icons";

interface BrewLogEntry {
  tea: any;
  lastBrewed: string;
  timesBrewed: number;
}

function BrewLog() {
  const [brewLog, setBrewLog] = useState<BrewLogEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("brewLog");
    if (stored) {
      let logObj: Record<string, BrewLogEntry>;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          logObj = {};
          parsed.forEach((entry: any) => {
            if (entry.tea && entry.tea._id) {
              logObj[entry.tea._id] = {
                tea: entry.tea,
                lastBrewed: entry.lastBrewed || entry.brewedAt || new Date().toISOString(),
                timesBrewed: entry.timesBrewed ?? 1,
              };
            }
          });
          localStorage.setItem("brewLog", JSON.stringify(logObj));
        } else {
          logObj = parsed;
        }
      } catch {
        logObj = {};
      }
      Object.values(logObj).forEach((entry: any) => {
        if (entry.timesBrewed === undefined) entry.timesBrewed = 1;
        if (!entry.lastBrewed && entry.brewedAt) entry.lastBrewed = entry.brewedAt;
      });
      setBrewLog(Object.values(logObj));
    }
  }, []);

  return (
    <div
      className="position-relative min-vh-100 page-fill"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* White overlay */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <div className="container py-4" style={{ position: "relative", zIndex: 1 }}>
        <Card className="bg-light text-center mb-5 shadow-sm">
          <Card.Body>
            <h2 className="display-6 text-dark mb-0">Your Brew Log 🫖</h2>
          </Card.Body>
        </Card>
        {brewLog.length === 0 ? (
          <p className="text-muted">No brews logged yet.</p>
        ) : (
          <div className="row g-3 d-flex justify-content-center px-3">
            {brewLog
              .slice()
              .sort((a, b) => new Date(b.lastBrewed).getTime() - new Date(a.lastBrewed).getTime())
              .map((entry, idx) => (
                <div key={entry.tea._id || idx} className="col-md-4 col-sm-6">
                  <div className="card h-100 d-flex flex-column shadow-sm">
                    <img
                      src={entry.tea.imageUrl?.trim() || "/editTea.jpg"}
                      alt={entry.tea.name}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "250px" }}
                    />
                    <div className="card-body text-center flex-grow-0 p-2">
                      <h5 className="fs-6 text-truncate mb-0" title={entry.tea.name}>
                        {entry.tea.name}
                      </h5>
                      <div className="text-muted small">{entry.tea.type}</div>
                      <div className="text-muted small">
                        <strong>Last Brewed:</strong> {new Date(entry.lastBrewed).toLocaleString()}
                      </div>
                      <div className="text-muted small">
                        <strong>Times Brewed:</strong> {entry.timesBrewed ?? 1}
                      </div>
                      {entry.tea.tastingNotes && (
                        <div className="text-muted small mt-2">
                          <strong>Tasting Notes:</strong> {entry.tea.tastingNotes}
                        </div>
                      )}
                    </div>
                    <div className="card-footer d-flex justify-content-center align-items-center p-2">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-view-${entry.tea._id}`}>Tea Details</Tooltip>}
                      >
                        <Link to={`/teas/${entry.tea._id}`}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            aria-label="View Details"
                          >
                            <Eye />
                          </Button>
                        </Link>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrewLog;