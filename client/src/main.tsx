//import './index.css';
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
//import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
document.body.style.backgroundImage = "url('/blacktea.jpg')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundAttachment = "fixed";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
  </React.StrictMode>
);
