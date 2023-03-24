import {useState} from 'react';
import Plot from 'react-plotly.js';
import './App.css';
import NumericInput from './NumericalInput';

interface ResultPoint {
  iteration: number
  num: number
  previousNum: number | null
  even: boolean
  equation: string
  tooltip: string
}

interface CalculateResult {
  nums: ResultPoint[];
  start: number;
  max: number;
  diff: number;
}

function resolveEquationString(num: number): string {
  if (num % 2 === 0) {
    return `Next Value = ${num.toLocaleString()} / 2 = ${(num / 2).toLocaleString()}`
  } else {
    return `Next Value = 3(${num.toLocaleString()}) + 1 = ${((3 * num) + 1).toLocaleString()}`
  }
}

function ResultDisplay(props: {res: CalculateResult}) {
  const {res} = props;
  return (
    <div>
      <h3>Results</h3>
      <table>
        <tr>
          <td>Starting</td>
          <td>{res.start}</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>{res.max}</td>
        </tr>
        <tr>
          <td>Difference</td>
          <td>{res.diff}</td>
        </tr>
      </table>
    </div>
  )
}

function calculateCollatzConjecture(num: number): CalculateResult {
  const originalNum = num;
  const nums: number[] = [originalNum];
  let max = num;
  while (num != 0 && num != 1) {
    if (num % 2 == 0) {
      num = num / 2;
      nums.push(num);
    } else {
      num = (3 * num) + 1;
      nums.push(num);
    }

    if (num > max) {
      max = num;
    }
  }
  const resPoints: ResultPoint[] = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const previousNum = i == 0 ? null : nums[i-1];
    const even = nums[i] % 2 === 0;
    const equation = resolveEquationString(num);
    resPoints.push(
      {
        iteration: i,
        num,
        previousNum,
        even,
        equation,
        tooltip: `
          <b>Iteration</b>: ${i}<br>
          <b>Value: </b>${nums[i].toLocaleString()}<br>
          <b>Previous Value: </b>${!previousNum ? "N/A" : previousNum.toLocaleString()}<br>
          Number is: <b>${even ? "Even" : "Odd"}</b><br>
          ${equation}
        `.replace(/\s{2,}/g, "")
      }
    )
  }

  const res = {
    nums: resPoints,
    start: originalNum,
    max,
    diff: max - originalNum,
  };
  console.log(res);
  return res;
}

export default function App() {
  const [num, setNum] = useState<number | null>(null);
  const [res, setRes] = useState<CalculateResult | null>(null);

  return (
    <main>
      <div className='content'>
        <h2>Collatz Conjecture Playground</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Enter Number: </label>
          <div>
            <NumericInput setValue={setNum} />
          </div>
          <button
            style={{ width: 'fit-content' }}
            disabled={num === null || num === 0}
            onClick={() => {
              if (num != null) {
                const res = calculateCollatzConjecture(num);
                setRes(res);
              }
            }}
          >
            Submit
          </button>
        </div>
        {res ? (
          <div>
            <ResultDisplay res={res} />
          </div>
        ) : null}
        {res ? (
          <div style={{width: "100%", height: "100%"}}>
            <Plot
              data={[
                {
                  x: [...Array(res.nums.length).keys()],
                  y: res.nums.map(r => r.num),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: 'black' },
                  customdata: res.nums as any[],
                  hovertemplate: `
                    %{customdata.tooltip}
                    <extra></extra>
                  `.replace(/\s{2,}/g, "")
                },
              ]}
              layout={{
                margin: {
                  l: 50, r: 50, b: 50, t: 30, pad: 0
                },
                xaxis: {
                  showticklabels: false,
                  showgrid: false
                },
                yaxis: {
                  showgrid: true
                },
                hovermode: "closest"
              }}
              config={{responsive: true}}
              style={{width: "100%", height: "100%"}}
              useResizeHandler
            />
          </div>
        ) : null} 
      </div>
    </main>
  );
}
