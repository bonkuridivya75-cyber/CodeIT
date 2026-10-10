const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

/* =========================================
   STARTER CODE
========================================= */

const starterCode = (title) => ({
  JavaScript: `// ${title}

const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();

// Write your solution here
`,

  Python: `# ${title}

import sys

input_data = sys.stdin.read().strip()

# Write your solution here
`,

  Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Write your solution here

    }
}`,

  "C++": `#include <bits/stdc++.h>
using namespace std;

int main() {

    // Write your solution here

    return 0;
}`
});

/* =========================================
   TEST CASE HELPER
========================================= */

const tc = (input, expectedOutput) => ({
  input,
  expectedOutput
});

/* =========================================
   QUESTION CREATOR
========================================= */

const makeQuestion = (
  title,
  difficulty,
  description,
  input,
  output,
  testCases,
  marks
) => ({
  title,
  type: "Coding",
  description,
  input,
  output,
  difficulty,
  marks,
  testCases,
  starterCode: starterCode(title)
});

/* =========================================
   EASY - 40
========================================= */

const easy = [

  {
    title: "Two Sum",
    description:
      "Given an array and a target value, find two numbers whose sum equals the target.",
    input: "First line contains n. Second line contains n integers. Third line contains target.",
    output: "Print the indices of the two numbers.",
    testCases: [
      tc("4\n2 7 11 15\n9", "0 1"),
      tc("3\n3 2 4\n6", "1 2")
    ]
  },

  {
    title: "Palindrome Number",
    description: "Check whether a number reads the same forward and backward.",
    input: "Enter an integer.",
    output: "Print true if palindrome otherwise false.",
    testCases: [
      tc("121", "true"),
      tc("123", "false")
    ]
  },

  {
    title: "Reverse String",
    description: "Reverse the given string.",
    input: "Enter a string.",
    output: "Print the reversed string.",
    testCases: [
      tc("hello", "olleh"),
      tc("CodeIT", "TIdoC")
    ]
  },

  {
    title: "Find Maximum Element",
    description: "Find the maximum element in an array.",
    input: "First line n. Second line contains n integers.",
    output: "Print maximum element.",
    testCases: [
      tc("5\n1 8 3 9 2", "9"),
      tc("4\n10 4 7 2", "10")
    ]
  },

  {
    title: "Find Minimum Element",
    description: "Find the minimum element in an array.",
    input: "First line n. Second line contains n integers.",
    output: "Print minimum element.",
    testCases: [
      tc("5\n1 8 3 9 2", "1"),
      tc("4\n10 4 7 2", "2")
    ]
  },

  {
    title: "Sum of Array Elements",
    description: "Calculate the sum of all array elements.",
    input: "First line n. Second line contains n integers.",
    output: "Print the sum.",
    testCases: [
      tc("5\n1 2 3 4 5", "15"),
      tc("4\n10 20 30 40", "100")
    ]
  },

  {
    title: "Count Even Numbers",
    description: "Count the number of even elements in an array.",
    input: "First line n. Second line contains n integers.",
    output: "Print count of even numbers.",
    testCases: [
      tc("5\n1 2 3 4 6", "3"),
      tc("4\n2 4 6 8", "4")
    ]
  },

  {
    title: "Count Odd Numbers",
    description: "Count the number of odd elements in an array.",
    input: "First line n. Second line contains n integers.",
    output: "Print count of odd numbers.",
    testCases: [
      tc("5\n1 2 3 4 6", "2"),
      tc("4\n1 3 5 7", "4")
    ]
  },

  {
    title: "Check Prime Number",
    description: "Check whether the given number is prime.",
    input: "Enter an integer.",
    output: "Print true if prime otherwise false.",
    testCases: [
      tc("7", "true"),
      tc("10", "false")
    ]
  },

  {
    title: "Fibonacci Series",
    description: "Print the first n Fibonacci numbers.",
    input: "Enter n.",
    output: "Print n Fibonacci numbers separated by spaces.",
    testCases: [
      tc("5", "0 1 1 2 3"),
      tc("7", "0 1 1 2 3 5 8")
    ]
  },

  {
    title: "Factorial of a Number",
    description: "Find the factorial of a number.",
    input: "Enter n.",
    output: "Print factorial.",
    testCases: [
      tc("5", "120"),
      tc("6", "720")
    ]
  },

  {
    title: "Reverse a Number",
    description: "Reverse the digits of an integer.",
    input: "Enter an integer.",
    output: "Print reversed number.",
    testCases: [
      tc("12345", "54321"),
      tc("120", "21")
    ]
  },

  {
    title: "Sum of Digits",
    description: "Find the sum of digits of a number.",
    input: "Enter an integer.",
    output: "Print digit sum.",
    testCases: [
      tc("1234", "10"),
      tc("987", "24")
    ]
  },

  {
    title: "Count Digits",
    description: "Count the number of digits in an integer.",
    input: "Enter an integer.",
    output: "Print number of digits.",
    testCases: [
      tc("12345", "5"),
      tc("100", "3")
    ]
  },

  {
    title: "Armstrong Number",
    description: "Check whether a number is an Armstrong number.",
    input: "Enter an integer.",
    output: "Print true if Armstrong otherwise false.",
    testCases: [
      tc("153", "true"),
      tc("123", "false")
    ]
  },

  {
    title: "Leap Year Check",
    description: "Check whether the given year is a leap year.",
    input: "Enter year.",
    output: "Print true or false.",
    testCases: [
      tc("2024", "true"),
      tc("2023", "false")
    ]
  },

  {
    title: "Swap Two Numbers",
    description: "Swap two numbers.",
    input: "Enter two integers.",
    output: "Print the numbers after swapping.",
    testCases: [
      tc("10 20", "20 10"),
      tc("5 8", "8 5")
    ]
  },

  {
    title: "Largest of Three Numbers",
    description: "Find the largest among three numbers.",
    input: "Enter three integers.",
    output: "Print largest number.",
    testCases: [
      tc("10 20 15", "20"),
      tc("50 30 40", "50")
    ]
  },

  {
    title: "Smallest of Three Numbers",
    description: "Find the smallest among three numbers.",
    input: "Enter three integers.",
    output: "Print smallest number.",
    testCases: [
      tc("10 20 15", "10"),
      tc("50 30 40", "30")
    ]
  },

  {
    title: "Check Vowel",
    description: "Check whether a character is a vowel.",
    input: "Enter a character.",
    output: "Print true if vowel otherwise false.",
    testCases: [
      tc("a", "true"),
      tc("z", "false")
    ]
  },

  {
    title: "Count Vowels in String",
    description: "Count vowels in a string.",
    input: "Enter a string.",
    output: "Print vowel count.",
    testCases: [
      tc("hello", "2"),
      tc("education", "5")
    ]
  },

  {
    title: "Remove Spaces from String",
    description: "Remove all spaces from a string.",
    input: "Enter a string.",
    output: "Print string without spaces.",
    testCases: [
      tc("hello world", "helloworld"),
      tc("Code IT", "CodeIT")
    ]
  },

  {
    title: "Convert String to Uppercase",
    description: "Convert all characters to uppercase.",
    input: "Enter a string.",
    output: "Print uppercase string.",
    testCases: [
      tc("hello", "HELLO"),
      tc("CodeIT", "CODEIT")
    ]
  },

  {
    title: "Convert String to Lowercase",
    description: "Convert all characters to lowercase.",
    input: "Enter a string.",
    output: "Print lowercase string.",
    testCases: [
      tc("HELLO", "hello"),
      tc("CodeIT", "codeit")
    ]
  },

  {
    title: "Character Frequency",
    description: "Find the frequency of a given character.",
    input: "First line contains string. Second line contains character.",
    output: "Print frequency.",
    testCases: [
      tc("hello\nl", "2"),
      tc("banana\na", "3")
    ]
  },

  {
    title: "Check Anagram",
    description: "Check whether two strings are anagrams.",
    input: "Enter two strings.",
    output: "Print true if anagrams otherwise false.",
    testCases: [
      tc("listen\nsilent", "true"),
      tc("hello\nworld", "false")
    ]
  },

  {
    title: "First Non-Repeating Character",
    description: "Find the first character that occurs only once.",
    input: "Enter a string.",
    output: "Print the first non-repeating character.",
    testCases: [
      tc("swiss", "w"),
      tc("aabbc", "c")
    ]
  },

  {
    title: "Remove Duplicate Characters",
    description: "Remove duplicate characters while preserving order.",
    input: "Enter a string.",
    output: "Print string without duplicate characters.",
    testCases: [
      tc("programming", "progamin"),
      tc("banana", "ban")
    ]
  },

  {
    title: "Find Duplicate Elements",
    description: "Find duplicate elements in an array.",
    input: "First line n. Second line contains n integers.",
    output: "Print duplicate elements.",
    testCases: [
      tc("6\n1 2 3 2 4 1", "1 2"),
      tc("5\n1 2 3 4 2", "2")
    ]
  },

  {
    title: "Linear Search",
    description: "Search for a target element using linear search.",
    input: "First line n. Second line array. Third line target.",
    output: "Print index of target or -1.",
    testCases: [
      tc("5\n10 20 30 40 50\n30", "2"),
      tc("4\n5 8 2 9\n7", "-1")
    ]
  },

  {
    title: "Binary Search",
    description: "Search for a target in a sorted array.",
    input: "First line n. Second line sorted array. Third line target.",
    output: "Print index of target or -1.",
    testCases: [
      tc("5\n1 2 3 4 5\n4", "3"),
      tc("5\n1 2 3 4 5\n9", "-1")
    ]
  },

  {
    title: "Sort an Array",
    description: "Sort an array in ascending order.",
    input: "First line n. Second line contains n integers.",
    output: "Print sorted array.",
    testCases: [
      tc("5\n5 2 4 1 3", "1 2 3 4 5"),
      tc("4\n9 7 8 6", "6 7 8 9")
    ]
  },

  {
    title: "Second Largest Element",
    description: "Find the second largest distinct element.",
    input: "First line n. Second line contains n integers.",
    output: "Print second largest element.",
    testCases: [
      tc("5\n10 5 8 20 15", "15"),
      tc("4\n5 1 9 7", "7")
    ]
  },

  {
    title: "Average of Array",
    description: "Find the average of array elements.",
    input: "First line n. Second line contains n integers.",
    output: "Print average.",
    testCases: [
      tc("5\n1 2 3 4 5", "3"),
      tc("4\n10 20 30 40", "25")
    ]
  },

  {
    title: "Merge Two Arrays",
    description: "Merge two arrays into one array.",
    input: "First array followed by second array.",
    output: "Print merged array.",
    testCases: [
      tc("3\n1 2 3\n2\n4 5", "1 2 3 4 5"),
      tc("2\n10 20\n3\n30 40 50", "10 20 30 40 50")
    ]
  },

  {
    title: "Rotate Array by One",
    description: "Rotate an array to the right by one position.",
    input: "First line n. Second line contains array.",
    output: "Print rotated array.",
    testCases: [
      tc("5\n1 2 3 4 5", "5 1 2 3 4"),
      tc("4\n10 20 30 40", "40 10 20 30")
    ]
  },

  {
    title: "Check Sorted Array",
    description: "Check whether an array is sorted in ascending order.",
    input: "First line n. Second line contains array.",
    output: "Print true or false.",
    testCases: [
      tc("5\n1 2 3 4 5", "true"),
      tc("4\n1 3 2 4", "false")
    ]
  },

  {
    title: "Move Zeros to End",
    description: "Move all zeros to the end while preserving order.",
    input: "First line n. Second line contains array.",
    output: "Print modified array.",
    testCases: [
      tc("5\n0 1 0 3 12", "1 3 12 0 0"),
      tc("4\n1 0 2 0", "1 2 0 0")
    ]
  },

  {
    title: "Find Missing Number",
    description: "Find the missing number from 0 to n.",
    input: "First line n. Second line contains n numbers.",
    output: "Print missing number.",
    testCases: [
      tc("3\n0 1 3", "2"),
      tc("5\n0 1 2 4 5", "3")
    ]
  },

  {
    title: "Intersection of Two Arrays",
    description: "Find common elements between two arrays.",
    input: "Enter two arrays.",
    output: "Print intersection elements.",
    testCases: [
      tc("3\n1 2 3\n3\n2 3 4", "2 3"),
      tc("4\n1 2 2 3\n3\n2 3 5", "2 3")
    ]
  }
];

/* =========================================
   MEDIUM - 35
========================================= */

const medium = [
  ["Valid Parentheses", "()", "true"],
  ["Maximum Subarray", "5\n-2 1 -3 4 -1", "4"],
  ["Best Time to Buy and Sell Stock", "5\n7 1 5 3 6", "5"],
  ["Merge Intervals", "4\n1 3\n2 6\n8 10\n15 18", "1 6\n8 10\n15 18"],
  ["Product of Array Except Self", "4\n1 2 3 4", "24 12 8 6"],
  ["Majority Element", "5\n2 2 1 1 1", "1"],
  ["Top K Frequent Elements", "6\n1 1 1 2 2 3\n2", "1 2"],
  ["Group Anagrams", "6\ncat act dog tac god tca", "cat act tca\ndog god tac"],
  ["Longest Substring Without Repeating Characters", "abcabcbb", "3"],
  ["Longest Palindromic Substring", "babad", "bab"],
  ["Three Sum", "6\n-1 0 1 2 -1 -4", "-1 -1 2\n-1 0 1"],
  ["Container With Most Water", "9\n1 8 6 2 5 4 8 3 7", "49"],
  ["Search in Rotated Sorted Array", "7\n4 5 6 7 0 1 2\n0", "4"],
  ["Find Peak Element", "4\n1 2 3 1", "2"],
  ["Kth Largest Element", "6\n3 2 1 5 6 4\n2", "5"],
  ["Subarray Sum Equals K", "3\n1 1 1\n2", "2"],
  ["Spiral Matrix", "3 3\n1 2 3\n4 5 6\n7 8 9", "1 2 3 6 9 8 7 4 5"],
  ["Set Matrix Zeroes", "3 3\n1 1 1\n1 0 1\n1 1 1", "1 0 1\n0 0 0\n1 0 1"],
  ["Rotate Matrix", "2\n1 2\n3 4", "3 1\n4 2"],
  ["Word Search", "3 4\nABCE\nSFCS\nADEE\nABCCED", "true"],
  ["Number of Islands", "4 5\n11000\n11000\n00100\n00011", "3"],
  ["Flood Fill", "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 1 2", "2 2 2\n2 2 0\n2 0 1"],
  ["Climbing Stairs", "5", "8"],
  ["Coin Change", "3\n1 2 5\n11", "3"],
  ["House Robber", "4\n1 2 3 1", "4"],
  ["Unique Paths", "3 7", "28"],
  ["Partition Equal Subset Sum", "4\n1 5 11 5", "true"],
  ["Longest Increasing Subsequence", "8\n10 9 2 5 3 7 101 18", "4"],
  ["Decode Ways", "226", "3"],
  ["Jump Game", "5\n2 3 1 1 4", "true"],
  ["Daily Temperatures", "8\n73 74 75 71 69 72 76 73", "1 1 4 2 1 1 0 0"],
  ["Next Greater Element", "4\n4 1 2 3", "-1 2 3 4"],
  ["Evaluate Reverse Polish Notation", "5\n2 1 + 3 *", "9"],
  ["Min Stack", "5\npush 2\npush 1\nmin\npop\nmin", "1\n2"],
  ["Linked List Cycle", "3\n1 2 3\n1", "true"]
];

/* =========================================
   HARD - 25
========================================= */

const hard = [
  ["Trapping Rain Water", "6\n0 1 0 2 1 0", "1"],
  ["Edit Distance", "horse\nros", "3"],
  ["Longest Valid Parentheses", "(()", "2"],
  ["Minimum Window Substring", "ADOBECODEBANC\nABC", "BANC"],
  ["Word Ladder", "hit\ncog\n6\nhot dot dog lot log cog", "5"],
  ["Regular Expression Matching", "aab\na*b", "true"],
  ["Wildcard Matching", "adceb\n*a*b", "true"],
  ["N Queens", "4", "2"],
  ["Sudoku Solver", "9\n53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79", "solved"],
  ["Serialize and Deserialize Binary Tree", "1 2 3 null null 4 5", "1 2 3 null null 4 5"],
  ["Binary Tree Maximum Path Sum", "1 2 3", "6"],
  ["Course Schedule II", "2\n1\n1 0", "0 1"],
  ["Alien Dictionary", "3\nwrt\nwrf\ner\n", "wertf"],
  ["Word Break II", "catsanddog\n2\ncat\ncats", "cat sand dog"],
  ["Palindrome Partitioning II", "aab", "1"],
  ["Minimum Path Sum with Obstacles", "3 3\n0 0 0\n0 1 0\n0 0 0", "4"],
  ["Dijkstra Shortest Path", "4 4\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n0", "0 3 1 4"],
  ["Bellman Ford Algorithm", "5 8\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3\n0", "0 -1 2 -2 1"],
  ["Floyd Warshall Algorithm", "3\n0 5 999\n999 0 2\n3 999 0", "0 5 7\n5 0 2\n3 8 0"],
  ["Minimum Spanning Tree", "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4", "19"],
  ["0/1 Knapsack", "3\n10 20 30\n60 100 120\n50", "220"],
  ["Unbounded Knapsack", "3\n10 20 30\n60 100 120\n50", "300"],
  ["Matrix Chain Multiplication", "4\n10 20 30 40", "18000"],
  ["Longest Common Subsequence", "abcde\nace", "3"],
  ["Longest Common Substring", "abcdxyz\nxyzabcd", "4"]
];

/* =========================================
   CREATE MEDIUM QUESTIONS
========================================= */

const mediumQuestions = medium.map(
  ([title, input, expectedOutput]) =>
    makeQuestion(
      title,
      "Medium",
      `Solve the ${title} problem using an efficient algorithm.`,
      "Read the required input values from standard input.",
      "Print the required result.",
      [
        tc(input, expectedOutput)
      ],
      2
    )
);

/* =========================================
   CREATE HARD QUESTIONS
========================================= */

const hardQuestions = hard.map(
  ([title, input, expectedOutput]) =>
    makeQuestion(
      title,
      "Hard",
      `Solve the ${title} problem using an efficient algorithm.`,
      "Read the required input values from standard input.",
      "Print the required result.",
      [
        tc(input, expectedOutput)
      ],
      3
    )
);

/* =========================================
   CREATE EASY QUESTIONS
========================================= */

const easyQuestions = easy.map((q) =>
  makeQuestion(
    q.title,
    "Easy",
    q.description,
    q.input,
    q.output,
    q.testCases,
    1
  )
);

/* =========================================
   ALL QUESTIONS
========================================= */

const questions = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions
];

/* =========================================
   DATABASE SEED
========================================= */

async function seedCodingQuestions() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("======================================");
    console.log("✅ MongoDB connected");
    console.log("======================================");

    /* Delete old coding questions */

    const deleted = await Question.deleteMany({
      type: "Coding"
    });

    console.log(
      `🗑️ Old coding questions deleted: ${deleted.deletedCount}`
    );

    /* Insert new questions */

    await Question.insertMany(questions);

    const easyCount = questions.filter(
      (q) => q.difficulty === "Easy"
    ).length;

    const mediumCount = questions.filter(
      (q) => q.difficulty === "Medium"
    ).length;

    const hardCount = questions.filter(
      (q) => q.difficulty === "Hard"
    ).length;

    const testCaseCount = questions.reduce(
      (total, q) => total + q.testCases.length,
      0
    );

    console.log("");
    console.log("🎉 CODEIT CODING DATABASE COMPLETED");
    console.log("--------------------------------------");
    console.log(`🟢 Easy          : ${easyCount}`);
    console.log(`🟡 Medium        : ${mediumCount}`);
    console.log(`🔴 Hard          : ${hardCount}`);
    console.log(`📚 Total         : ${questions.length}`);
    console.log(`🧪 Test Cases    : ${testCaseCount}`);
    console.log("--------------------------------------");
    console.log("✅ Questions inserted successfully");
    console.log("======================================");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {

    console.error("");
    console.error("❌ SEED ERROR");
    console.error(error.message);

    try {
      await mongoose.disconnect();
    } catch (e) {}

    process.exit(1);
  }
}

seedCodingQuestions();