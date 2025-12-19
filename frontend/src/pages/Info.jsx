import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../style/info.css";

// taro gambar kamu di: src/assets/info-illustration.png
import illus from "../assets/info-illustration.png";

export default function Info() {
  const nav = useNavigate();

  return (
    <div className="infoPage">
      <Navbar />

      <main className="infoMain">
        <div className="infoCard">
          <div className="infoImageWrap">
            <img className="infoImage" src={illus} alt="Security illustration" />
          </div>

          <h1 className="infoH1">Your documents are safe with us</h1>
          <p className="infoP">
            We prioritize your privacy and security, employing top-notch encryption
            methods to keep your academic work secure and confidential.
          </p>

          <h2 className="infoH2">Save time with smart formatting</h2>
          <p className="infoP">
            Our tool simplifies the formatting process, allowing you to focus on
            your research while we handle the details.
          </p>

          <button className="infoBtn" onClick={() => nav("/upload")}>
            Try it out
          </button>

          <div className="infoFooter">
            © 2025 rapihin.ai by CodeInHealls All rights reserved
          </div>
        </div>
      </main>
    </div>
  );
}
