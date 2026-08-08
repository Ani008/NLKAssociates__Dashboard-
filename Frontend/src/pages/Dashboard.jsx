import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Briefcase,
  CalendarClock,
  FileStack,
  Landmark,
  TrendingUp,
  Database,
  FilePlus2,
} from "lucide-react";

import API from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const role = localStorage.getItem("role") || "senior";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setData(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        setLoadError(true);
      }
    };
    fetchStats();
  }, []);

  if (loadError) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        Couldn't load dashboard stats. Please refresh, or check that the
        backend is running.
      </div>
    );
  }

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const { stats, bankStats, transactionTypeStats, recentRecords } = data;
  const COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1"];

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header & Quick Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 28, color: "var(--navy)", margin: 0 }}>Overview</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() =>
              navigate("/dashboard/non-litigation/business-legal/tsr-initiation")
            }
            style={{
              background: "var(--navy)",
              color: "white",
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FilePlus2 size={16} />
            New TSR Initiation
          </button>
          {role === "admin" && (
            <button
              onClick={() => navigate("/dashboard/masterDB")}
              style={{
                background: "var(--navy)",
                color: "white",
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Database size={16} />
              Master Database
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards — all pulled live from TSR Initiation + Master DB, no mock data */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <StatCard
          title="Total TSR Records"
          value={stats.totalTSR}
          icon={<Briefcase size={20} color="#1e293b" />}
          subtitle="Initiation records in database"
          delay={0}
        />
        <StatCard
          title="Added Today"
          value={stats.addedToday}
          icon={<CalendarClock size={20} color="#1e293b" />}
          subtitle={`${stats.addedThisWeek} in the last 7 days`}
          delay={1}
        />
        <StatCard
          title="Documents Uploaded"
          value={stats.totalDocuments}
          icon={<FileStack size={20} color="#1e293b" />}
          subtitle="Across all TSR records"
          delay={2}
        />
        <StatCard
          title="Active Banks"
          value={stats.activeBanks}
          icon={<Landmark size={20} color="#1e293b" />}
          subtitle="Banks with at least one record"
          delay={3}
        />
        <StatCard
          title="Master DB Records"
          value={stats.totalMasterRecords}
          icon={<Database size={20} color="#1e293b" />}
          subtitle="Uploaded reference records"
          delay={4}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        <div
          className="animate-in-delay"
          style={{ "--i": 5, background: "white", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}
        >
          <h3 style={{ marginTop: 0, color: "var(--navy)", fontSize: 16 }}>TSR Records by Bank</h3>
          {bankStats.length === 0 ? (
            <EmptyChartState message="No records with a bank selected yet." />
          ) : (
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bankStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#475569" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="_id" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          className="animate-in-delay"
          style={{ "--i": 6, background: "white", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }}
        >
          <h3 style={{ marginTop: 0, color: "var(--navy)", fontSize: 16 }}>TSR Records by Transaction Type</h3>
          {transactionTypeStats.length === 0 ? (
            <EmptyChartState message="No records with a transaction type set yet." />
          ) : (
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionTypeStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {transactionTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: "none" }} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent TSR Records Table */}
      <div
        className="animate-in-delay"
        style={{ "--i": 7, background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "var(--navy)", fontSize: 16 }}>Recent TSR Initiation Records</h3>
          <button
            onClick={() => navigate("/dashboard/non-litigation/business-legal/tsr-initiation")}
            style={{
              background: "none",
              border: "none",
              color: "var(--navy)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View all →
          </button>
        </div>
        {recentRecords.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
            No TSR Initiation records yet. Create one to see it here.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc", color: "#475569", borderBottom: "1px solid var(--border)" }}>
                  <th style={thStyle}>Application ID</th>
                  <th style={thStyle}>Applicant</th>
                  <th style={thStyle}>Bank</th>
                  <th style={thStyle}>Transaction Type</th>
                  <th style={thStyle}>Ref No</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((r) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px 24px", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                        {r.appId || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#334155", fontWeight: 500 }}>{r.applicant || "—"}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{r.bank || "—"}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{r.transactionType || "—"}</td>
                    <td style={{ padding: "16px 24px", color: "#475569" }}>{r.refNo || "—"}</td>
                    <td style={{ padding: "16px 24px", color: "#64748b" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "16px 24px",
  fontWeight: 600,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

function EmptyChartState({ message }) {
  return (
    <div
      style={{
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 13,
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      {message}
    </div>
  );
}

function StatCard({ title, value, icon, subtitle, delay }) {
  return (
    <div
      className="animate-in-delay"
      style={{
        "--i": delay,
        background: "white",
        padding: "24px 28px",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02)",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>
          {title}
        </div>
        <div style={{ background: "#f1f5f9", padding: 8, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#0f172a", fontSize: 36, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
          {value}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingUp size={12} color="#94a3b8" />
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}