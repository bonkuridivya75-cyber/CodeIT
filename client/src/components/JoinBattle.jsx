import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinBattle.css";

function JoinBattle() {
  const navigate = useNavigate();

  const [battleId, setBattleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    const userId =
      localStorage.getItem("user-id") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id");

    const playerName =
      localStorage.getItem("user-name") ||
      localStorage.getItem("userName") ||
      "Student";

    const email = localStorage.getItem("user-email") || "";

    return {
      userId,
      playerName,
      email,
    };
  };

  const handleBattleIdChange = (event) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    setBattleId(value);
    setError("");
  };

  const handleJoinBattle = async (event) => {
    event.preventDefault();

    setError("");

    const cleanBattleId = battleId.trim().toUpperCase();

    if (!cleanBattleId) {
      setError("Please enter the Battle ID.");
      return;
    }

    if (cleanBattleId.length !== 6) {
      setError("Battle ID must contain exactly 6 characters.");
      return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser.userId) {
      setError("Student account information is missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/battles/${cleanBattleId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            playerName: currentUser.playerName,
            email: currentUser.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to join the battle."
        );
      }

      const joinedBattle =
        data.battle ||
        data.data?.battle ||
        data;

      const finalBattleId =
        joinedBattle?.battleId ||
        data.battleId ||
        cleanBattleId;

      localStorage.setItem(
        "current-battle-id",
        finalBattleId
      );

      /*
       * Both Student A and Student B use the same
       * BattleRoom page.
       */
      navigate(`/battle/${finalBattleId}`);
    } catch (err) {
      console.error("Join battle error:", err);

      setError(
        err.message ||
          "Unable to join battle. Please check the Battle ID."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="join-battle-page">

      <div className="join-battle-card">

        {/* LOGO */}
        <div className="join-logo-section">
          <div className="join-logo-icon">
            {"</>"}
          </div>

          <div className="join-logo-text">
            CODE<span>IT</span>
          </div>
        </div>

        {/* HEADER */}
        <div className="join-header">
          <h1>⚔️ Join Battle</h1>

          <p>
            Enter the Battle ID shared by another student
            and enter the live coding arena.
          </p>
        </div>

        {/* FEATURES */}
        <div className="join-feature-grid">

          <div className="join-feature">
            <div className="join-feature-icon">⚡</div>
            <div>
              <strong>Live Battle</strong>
              <span>Real-time competition</span>
            </div>
          </div>

          <div className="join-feature">
            <div className="join-feature-icon">💻</div>
            <div>
              <strong>Same Problem</strong>
              <span>Compete fairly</span>
            </div>
          </div>

          <div className="join-feature">
            <div className="join-feature-icon">🏆</div>
            <div>
              <strong>Win Fast</strong>
              <span>Pass test cases</span>
            </div>
          </div>

        </div>

        {/* FORM */}
        <form
          className="join-form"
          onSubmit={handleJoinBattle}
        >

          <div className="join-label-row">
            <label htmlFor="battle-id">
              Battle ID
            </label>

            <span className="join-required">
              REQUIRED
            </span>
          </div>

          <div className="join-input-wrapper">

            <span className="join-input-icon">
              ⚔
            </span>

            <input
              id="battle-id"
              type="text"
              value={battleId}
              onChange={handleBattleIdChange}
              placeholder="Enter 6-character Battle ID"
              maxLength={6}
              autoComplete="off"
              disabled={loading}
            />

          </div>

          <div className="join-helper">
            <span>●</span>
            Ask the battle creator for the 6-character Battle ID.
          </div>

          {/* ERROR */}
          {error && (
            <div className="join-error">

              <div className="join-error-icon">
                !
              </div>

              <div>
                <strong>Unable to join battle</strong>
                <p>{error}</p>
              </div>

            </div>
          )}

          {/* JOIN */}
          <button
            type="submit"
            className="join-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="join-spinner"></span>
                Joining Battle...
              </>
            ) : (
              <>
                ⚔️ Join Battle
                <span className="join-arrow">→</span>
              </>
            )}
          </button>

        </form>

        {/* BACK */}
        <button
          type="button"
          className="join-back-button"
          onClick={handleBack}
          disabled={loading}
        >
          <span>←</span>
          Back to Dashboard
        </button>

        {/* FOOTER */}
        <div className="join-footer">
          <span className="join-footer-dot"></span>
          CodeIT Battle Arena
          <span className="join-footer-separator">•</span>
          Secure live coding environment
        </div>

      </div>

    </div>
  );
}

export default JoinBattle;