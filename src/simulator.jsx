import React, { useState } from "react";
import { generateRandomPriority, mapTo123 } from "./priority";
import {
  TableBody,
  TableHead,
  TableCell,
  Table,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const GanttChart = ({ ganttChartData }) => {
  return (
    <div>
      <h2>Gantt chart</h2>
      <div
        style={{
          display: "flex",
          margin: "2rem",
          justifyContent: "center",
          backgroundColor: "rgb(19, 34, 34)",
          color: "brown",
          fontSize: "16px",
        }}
      >
        {ganttChartData.map((entry, index) => {
          return (
            <div
              key={entry.id}
              style={{
                display: "flex",
                margin: "5px",
                alignItems: "center",
              }}
            >
              {entry.start}
              <div
                style={{
                  width: "4rem",
                  height: "2rem",
                  background: "rgb(154, 121, 73)",
                  color: "black",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                {entry.label}
              </div>
              {entry.end}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QueueSimulation = () => {
  const [arrivalRate, setArrivalRate] = useState("");
  const [serviceRate, setServiceRate] = useState("");
  const [randomNum, setRandomNum] = useState("");
  const [randomPriorities, setRandomPriorities] = useState([]);
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [serverUtilization, setServerUtilization] = useState("");

  const a = 1; // Lower bound
  const b = 3; // Upper bound
  const A = 55; // constant A
  const C = 9; // constant C
  const m = 1994;
  const seed = 10112166;

  const exponentialDistribution = (serviceRate) => {
    let num;
    do {
      num = -(1 / serviceRate) * Math.log(1 - Math.random());
    } while (num < 1);
    return num;
  };

  const poissonDistribution = (arrivalRate) => {
    const L = Math.exp(-arrivalRate);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  };

  const handleGenerateClick = () => {
    let arrivalTime = 0;
    let serviceTime = 0;
    let turnAroundTime = 0;
    let waitTime = 0;
    let responseTime = 0;
    let totalIntervalTime = 0;
    let totalServiceTime = 0;
    let simulationResults = [];
    let ganttChartData = [];

    const prioritiesLCG = generateRandomPriority(seed, randomNum, A, C, m);
    const priorities123 = mapTo123(prioritiesLCG, a, b);
    setRandomPriorities(priorities123);

    for (let i = 0; i < randomNum; i++) {
      const interArrivalTime = poissonDistribution(arrivalRate);
      const service = exponentialDistribution(serviceRate);

      const arrival = Math.round(arrivalTime + interArrivalTime);
      arrivalTime = arrival;

      serviceTime = Math.round(service);
      totalIntervalTime += interArrivalTime;
      totalServiceTime += serviceTime;

      const startTime = Math.max(
        arrival,
        ganttChartData.length > 0
          ? ganttChartData[ganttChartData.length - 1].end
          : arrival
      );
      const endTime = startTime + serviceTime;

      turnAroundTime = endTime - arrival;
      waitTime = turnAroundTime - serviceTime;
      responseTime = Math.round(startTime) - Math.round(arrivalTime);

      ganttChartData.push({
        id: i + 1,
        label: `C${i + 1}`,
        start: startTime,
        end: endTime,
      });

      simulationResults.push({
        arrivalTime,
        serviceTime,
        priority: priorities123[i],
        startTime,
        endTime,
        turnaroundTime: turnAroundTime,
        waitTime,
        responseTime,
      });
    }

    const utilization = arrivalRate / serviceRate;
    setServerUtilization((utilization * 100).toFixed(2));
    setResults(simulationResults);
    setGanttChart(ganttChartData);
  };

  return (
    <div>
      <h1>RANDOM NUMBER SIMULATOR</h1>
      <div style={{ flex: 1, marginBottom: "20px" }}>
        <h2>Simulation Parameters</h2>
        <div style={{ marginTop: "14px", fontSize: "18px" }}>
          <label>Arrival Rate:</label>
          <input
            style={{ marginLeft: "5px", padding: "8px" }}
            type="number"
            step="0.01"
            value={arrivalRate}
            onChange={(e) => setArrivalRate(parseFloat(e.target.value))}
          />
        </div>

        <div style={{ marginTop: "14px", fontSize: "18px" }}>
          <label>Service Rate:</label>
          <input
            style={{ marginLeft: "5px", padding: "8px" }}
            type="number"
            step="0.01"
            value={serviceRate}
            onChange={(e) => setServiceRate(parseFloat(e.target.value))}
          />
        </div>
        <div
          style={{ marginTop: "14px", marginBottom: "10px", fontSize: "18px" }}
        >
          <label>Random Numbers: </label>
          <input
            style={{ marginLeft: "5px", padding: "8px" }}
            type="number"
            value={randomNum}
            onChange={(e) => setRandomNum(parseInt(e.target.value, 10))}
          />
        </div>
        <button
          style={{ marginTop: "20px", marginBottom: "16px", width: "auto" }}
          onClick={handleGenerateClick}
        >
          Generate
        </button>
      </div>
      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "rgb(154, 121, 73)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Arrival Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Service Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Priority
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Start Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                End Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Turnaround Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Wait Time
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Response Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{result.arrivalTime}</TableCell>
                <TableCell align="center">{result.serviceTime}</TableCell>
                <TableCell align="center">{result.priority}</TableCell>
                <TableCell align="center">{result.startTime}</TableCell>
                <TableCell align="center">{result.endTime}</TableCell>
                <TableCell align="center">{result.turnaroundTime}</TableCell>
                <TableCell align="center">{result.waitTime}</TableCell>
                <TableCell align="center">{result.responseTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <GanttChart ganttChartData={ganttChart} />
      </div>
      <div style={{ fontSize: "20px", marginTop: "2em" }}>
        Server Utilization: {serverUtilization}%
      </div>
    </div>
  );
};

export default QueueSimulation;
