import { useState } from "react";

import TSRBasicInfo from "../../../models/TSRBasicInfo";
import TSRInitiationModel from "../../../models/TSRInitiationModel";

export default function TSRInitiation() {
  const [activeTab, setActiveTab] = useState("basic");

  const [basicInfo, setBasicInfo] = useState({
    author: "Adv Narayan",
    refNo: "",
    appId: "",
    applicant: "",
    coApplicant: "",
    transactionType: "",
    bankBranch: "",
    village: "",
    municipalPropertyNo: "",
    district: "",
  });

  const [initiationData, setInitiationData] = useState({
    description1: "",
    description2: "",
    description3: "",
    description4: "",
    description5: "",
  });

  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInitiationChange = (e) => {
    const { name, value } = e.target;

    setInitiationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="animate-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "var(--black)",
            }}
          >
            TSR Scrutiny & Initiation
          </h1>

          <p
            style={{
              marginTop: 6,
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            Create a new TSR Initiation Report
          </p>
        </div>

        <span
          style={{
            background: "var(--black)",
            color: "white",
            padding: "7px 18px",
            borderRadius: 30,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          BUSINESS LEGAL
        </span>
      </div>

      {/* ================= MAIN CARD ================= */}

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* ================= TAB HEADER ================= */}

        <div
          style={{
            background: "var(--black)",
            padding: "18px 30px",
            display: "flex",
            gap: 24,
          }}
        >
          {[
            {
              key: "basic",
              label: "I. Basic Information",
            },
            {
              key: "initiation",
              label: "II. TSR Initiation",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,.5)",

                fontWeight: activeTab === tab.key ? 700 : 500,

                fontSize: 14,

                borderBottom:
                  activeTab === tab.key
                    ? "2px solid white"
                    : "2px solid transparent",

                paddingBottom: 6,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}

        <div
          style={{
            padding: 30,
          }}
        >
          {activeTab === "basic" && (
            <TSRBasicInfo form={basicInfo} handleChange={handleBasicChange} />
          )}

          {activeTab === "initiation" && (
            <TSRInitiationModel
              form={initiationData}
              handleChange={handleInitiationChange}
            />
          )}
          {/* ================= BOTTOM BUTTONS ================= */}

          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT BUTTON */}

            <button
              type="button"
              style={{
                background: "white",
                color: "#dc2626",
                border: "1px solid #dc2626",
                borderRadius: 8,
                padding: "12px 26px",
                fontWeight: 600,
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              Cancel Upload
            </button>

            {/* RIGHT BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                type="button"
                style={{
                  background: "white",
                  color: "#059669",
                  border: "1px solid #059669",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                Save Progress
              </button>

              {activeTab === "basic" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("initiation")}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 32px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Next Section →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    style={{
                      background: "var(--black)",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 28px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Save TSR Initiation
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    style={{
                      background: "white",
                      color: "var(--black)",
                      border: "1px solid var(--black)",
                      borderRadius: 8,
                      padding: "12px 26px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ← Previous
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
