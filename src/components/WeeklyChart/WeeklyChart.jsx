import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import styles from "./WeeklyChart.module.css";

export default function WeeklyChart({ weeklyData, type, target }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%">
        <BarChart
          data={weeklyData}
          margin={{
            top: 15,
            right: 15,
            left: type === "steps" ? -10 : -25,
            bottom: 5,
          }}
          className={styles.barChart}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            contentStyle={{ color: "var(--brand-color)", fontWeight: "700" }}
          />
          <Bar
            dataKey={type === "sleep" ? "Total hours" : "Total steps"}
            radius={[6, 6, 0, 0]}
          >
            {weeklyData.map((entry, index) => {
              const value =
                type === "sleep" ? entry["Total hours"] : entry["Total steps"];

              const fillColor =
                (type === "sleep" &&
                  (value < target * 0.6 || value > target + 1)) ||
                (type === "steps" && value < target * 0.6)
                  ? "red"
                  : type === "steps" &&
                    value >= target * 0.6 &&
                    value <= target * 0.8
                  ? "var(--brand-color)"
                  : "#4cafef";
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
