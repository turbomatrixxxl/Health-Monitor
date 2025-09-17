"use client";

import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import "animate.css";

import clsx from "clsx";

import styles from "./Chart.module.css";

export default function Chart({ calories, steps, sleep, free, totalPercent }) {
  const theme = "dark";

  const balance = totalPercent;

  let cal = calories || 0;
  let st = steps || 0;
  let sl = sleep || 0;
  let fre = free || 0;

  if (cal >= 100) {
    cal = 100;
  }

  if (st >= 100) {
    st = 100;
  }

  if (sl >= 100) {
    sl = 100;
  }

  if (fre >= 100) {
    fre = 100;
  }

  const data = [
    cal > 0 && {
      name: "Daily Cal",
      value: cal,
      backgroundColor: calories > 100 || calories < 50 ? "orangered" : "orange",
      borderWidth: 0,
      hoverOffset: 5,
    },
    st > 0 && {
      name: "Steps",
      value: st,
      backgroundColor: "#37e673",
      borderWidth: 0,
      hoverOffset: 5,
    },
    sl > 0 && {
      name: "Sleep",
      value: sl,
      backgroundColor: sleep < 50 || sleep > 100 ? "crimson" : "blue",
      borderWidth: 0,
      hoverOffset: 5,
    },
    fre > 0 && {
      name: "Free",
      value: fre,
      backgroundColor: "var(--Gray-5)",
      borderWidth: 0,
      hoverOffset: 5,
    },
    {
      name: "There are no inputs for this period !",
      value: 0.0000000001,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      borderWidth: 0,
      hoverOffset: 5,
    },
  ];

  const sortedData = data.sort((a, b) => {
    let ap = Number(a.value);
    // console.log(ap);

    let bp = Number(b.value);
    // console.log(b);

    return ap - bp;
  });

  //   console.log(sortedData);

  const tooltipCondition = (name) => {
    return name === "Daily Cal"
      ? Number(calories)
      : name === "Steps"
      ? Number(steps)
      : name === "Sleep"
      ? Number(sleep)
      : name === "Free"
      ? Number(free)
      : Number(0);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      //   console.log(payload[0].payload.fill);

      return (
        <div
          className={clsx(
            styles.tooltipContainer,
            theme === "violet" && styles.violet
          )}
        >
          <p style={{ color: "white" }} className={styles.tooltipNameContainer}>
            {payload[0].name}
          </p>
          <div className={styles.tooltipSumContainer}>
            <div
              style={{
                background: `${payload[0].payload.fill}`,
                borderRadius: "2.5px",
              }}
            ></div>
            <span style={{ color: "white" }}>
              {tooltipCondition(payload[0].name)} %
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  const textAnimationClasses =
    "animate__animated  animate__zoomIn animate__slow";

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart fill="rgba(255, 255, 255, 0.6)">
          <Tooltip cursor={{ cursor: "pointer" }} content={CustomTooltip} />
          <Pie
            startOffset={0}
            className={styles.chart}
            data={sortedData}
            dataKey="value"
            outerRadius={105}
            innerRadius={85}
            fill="rgba(255, 255, 255, 0.6)"
          >
            {data.map((entry, index) => {
              //   console.log(entry.backgroundColor);
              // console.log(entry.name);

              return <Cell key={index} fill={entry.backgroundColor} />;
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className={clsx(styles.chartCont, textAnimationClasses)}>
        <p
          style={
            calories > 100 || calories < 50
              ? { color: "orangered" }
              : { color: "orange" }
          }
          className={clsx(
            styles.chartBalance,
            theme === "light" && styles.light,
            theme === "violet" && styles.violet
          )}
        >
          <span>Calories</span>
          {balance ? Number(calories) : Number(0)}
          <span>%</span>
        </p>
        <p
          style={{ color: "green" }}
          className={clsx(
            styles.chartBalance,
            theme === "light" && styles.light,
            theme === "violet" && styles.violet
          )}
        >
          <span>Steps</span>
          {balance ? Number(steps) : Number(0)}
          <span>%</span>
        </p>{" "}
        <p
          style={
            sleep > 100 || sleep < 50 ? { color: "crimson" } : { color: "blue" }
          }
          className={clsx(
            styles.chartBalance,
            theme === "light" && styles.light,
            theme === "violet" && styles.violet
          )}
        >
          <span>Sleep</span>
          {balance ? Number(sleep) : Number(0)}
          <span>%</span>
        </p>
      </div>
    </div>
  );
}
