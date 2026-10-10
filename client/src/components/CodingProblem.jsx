import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CodingProblem.css";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers and a target value, find two numbers whose sum is equal to the target.",
    input:
      "First line contains the number of elements.\nSecond line contains the array elements.\nThird line contains the target.",
    output:
      "Print the indices of the two numbers whose sum equals the target.",
    exampleInput: "4\n2 7 11 15\n9",
    exampleOutput: "0 1",
  },
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description:
      "Given an integer, determine whether the number is a palindrome.",
    input: "Enter an integer.",
    output:
      "Print true if the number is a palindrome, otherwise print false.",
    exampleInput: "121",
    exampleOutput: "true",
  },
  {
    id: 3,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Searching",
    description:
      "Given a sorted array and a target value, find the index of the target using binary search.",
    input:
      "Enter the array size, sorted array and target value.",
    output:
      "Print the index of the target element. Print -1 if it is not present.",
    exampleInput: "6\n-1 0 3 5 9 12\n9",
    exampleOutput: "4",
  },
  {
    id: 4,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Given a string, print the string in reverse order.",
    input: "Enter a string.",
    output: "Print the reversed string.",
    exampleInput: "hello",
    exampleOutput: "olleh",
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "Stack",
    description:
      "Given a string containing brackets, determine whether the brackets are correctly balanced.",
    input: "Enter a string containing brackets.",
    output:
      "Print true if the brackets are valid, otherwise print false.",
    exampleInput: "()[]{}",
    exampleOutput: "true",
  },
  {
    id: 6,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description:
      "Find the contiguous subarray that has the largest sum.",
    input: "Enter the array size followed by the array elements.",
    output: "Print the maximum subarray sum.",
    exampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
    exampleOutput: "6",
  },
  {
    id: 7,
    title: "Merge Two Sorted Lists",
    difficulty: "Medium",
    category: "Linked List",
    description:
      "Merge two sorted lists into one sorted list.",
    input: "Enter two sorted lists.",
    output: "Print the merged sorted list.",
    exampleInput: "1 2 4\n1 3 4",
    exampleOutput: "1 1 2 3 4 4",
  },
  {
    id: 8,
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "Calculate the nth Fibonacci number.",
    input: "Enter n.",
    output: "Print the nth Fibonacci number.",
    exampleInput: "5",
    exampleOutput: "5",
  },
];

const starterCode = {
  Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Write your solution here

    }
}`,

  Python: `def solve():
    # Write your solution here
    pass


solve()`,

  C: `#include <stdio.h>

int main() {

    // Write your solution here

    return 0;
}`,

  "C++": `#include <iostream>
using namespace std;

int main() {

    // Write your solution here

    return 0;
}`,

  JavaScript: `function solve() {

    // Write your solution here

}

solve();`,
};

function CodingProblem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [language, setLanguage] = useState("Java");

  const [code, setCode] = useState(
    starterCode.Java
  );

  const [input, setInput] = useState("");

  const [output, setOutput] = useState(
    "Output will appear here."
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const problem = problems.find(
    (item) => item.id === Number(id)
  );

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    setCode(starterCode[selectedLanguage]);

    setOutput("Output will appear here.");
    setMessage("");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setMessage("Please write some code first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setOutput("Running your code...");

    try {
      const response = await fetch(
        "/api/code/run",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            language,
            sourceCode: code,
            stdin: input,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code execution failed."
        );
      }

      setOutput(
        data.output ||
          data.stdout ||
          data.message ||
          "No output."
      );

    } catch (error) {
      setOutput(
        error.message ||
          "Unable to execute the code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setMessage("Please write your solution first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setOutput("Submitting solution...");

    try {
      const response = await fetch(
        "/api/coding-submissions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            problemId: Number(id),
            problemTitle: problem.title,
            language,
            sourceCode: code,
            stdin: input,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Submission failed."
        );
      }

      setOutput(
        data.output ||
          "Solution submitted successfully."
      );

      setMessage(
        data.message ||
          "Solution submitted successfully."
      );

    } catch (error) {
      setOutput(
        error.message ||
          "Unable to submit solution."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="classic-coding-page">
        <div className="problem-not-found">
          <h1>Problem Not Found</h1>

          <p>
            The requested coding problem does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/coding-practice")
            }
          >
            Back to Coding Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="classic-coding-page">

      {/* HEADER */}

      <header className="classic-header">

        <div className="classic-brand">
          <div className="classic-logo">
            &lt;/&gt;
          </div>

          <div>
            <h2>CodeIT</h2>
            <span>Coding Practice</span>
          </div>
        </div>

        <div className="classic-header-actions">

          <button
            onClick={() =>
              navigate("/coding-practice")
            }
          >
            ← Problems
          </button>

          <button
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="classic-main">

        {/* LEFT */}

        <section className="problem-panel">

          <div className="problem-heading">

            <div>

              <span className="problem-label">
                PROBLEM {problem.id}
              </span>

              <h1>{problem.title}</h1>

            </div>

            <div className="problem-meta">

              <span
                className={`difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>

              <span className="category">
                {problem.category}
              </span>

            </div>

          </div>

          <div className="classic-card">

            <h2>Description</h2>

            <p>
              {problem.description}
            </p>

          </div>

          <div className="classic-card">

            <h2>Input</h2>

            <p className="preserve">
              {problem.input}
            </p>

          </div>

          <div className="classic-card">

            <h2>Output</h2>

            <p className="preserve">
              {problem.output}
            </p>

          </div>

          <div className="classic-card">

            <h2>Example</h2>

            <div className="example-grid">

              <div>
                <h3>Input</h3>

                <pre>
                  {problem.exampleInput}
                </pre>
              </div>

              <div>
                <h3>Output</h3>

                <pre>
                  {problem.exampleOutput}
                </pre>
              </div>

            </div>

          </div>

          <div className="classic-card">

            <h2>Notes</h2>

            <ul>
              <li>
                Read the problem carefully.
              </li>

              <li>
                Test your program with different inputs.
              </li>

              <li>
                Check your time and space complexity.
              </li>
            </ul>

          </div>

        </section>

        {/* RIGHT */}

        <section className="editor-panel">

          <div className="editor-top">

            <strong>
              Code Editor
            </strong>

            <select
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="Java">
                Java
              </option>

              <option value="Python">
                Python
              </option>

              <option value="C">
                C
              </option>

              <option value="C++">
                C++
              </option>

              <option value="JavaScript">
                JavaScript
              </option>
            </select>

          </div>

          <textarea
            className="classic-editor"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            spellCheck="false"
          />

          <div className="input-section">

            <label>
              Custom Input
            </label>

            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Enter input for your program..."
            />

          </div>

          <div className="editor-actions">

            <button
              className="run-code"
              onClick={handleRunCode}
              disabled={loading}
            >
              {loading
                ? "Running..."
                : "▶ Run Code"}
            </button>

            <button
              className="submit-code"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : "✓ Submit"}
            </button>

          </div>

          {message && (
            <div className="submission-message">
              {message}
            </div>
          )}

          <div className="output-section">

            <div className="output-header">
              Output
            </div>

            <pre className="output-box">
              {output}
            </pre>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CodingProblem;