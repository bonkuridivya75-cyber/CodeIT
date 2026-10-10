const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

/*
====================================================
CODEIT - 100 CODING QUESTIONS SEED FILE
====================================================
40 Easy
35 Medium
25 Hard
====================================================
*/

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


const createQuestion = (
  title,
  difficulty,
  description,
  input,
  output,
  testCases,
  marks = 1
) => ({
  title,
  type: "Coding",
  description,
  difficulty,
  input,
  output,
  marks,
  testCases,
  starterCode: starterCode(title),
});


const questions = [

  // ==================================================
  // EASY - 1 to 40
  // ==================================================

  createQuestion(
    "Two Sum",
    "Easy",
    "Given an array of integers and a target value, find two numbers whose sum is equal to the target.",
    "Enter array elements in the first line and target in the second line.",
    "Print the indices of the two numbers.",
    [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
    ],
    2
  ),

  createQuestion(
    "Palindrome Number",
    "Easy",
    "Check whether a given integer reads the same forward and backward.",
    "Enter an integer.",
    "Print true if the number is a palindrome, otherwise print false.",
    [
      { input: "121", expectedOutput: "true" },
      { input: "123", expectedOutput: "false" },
    ],
    2
  ),

  createQuestion(
    "Reverse String",
    "Easy",
    "Reverse the characters of a given string.",
    "Enter a string.",
    "Print the reversed string.",
    [
      { input: "hello", expectedOutput: "olleh" },
      { input: "CodeIT", expectedOutput: "TIdoC" },
    ]
  ),

  createQuestion(
    "Find Maximum Element",
    "Easy",
    "Find the largest element in an integer array.",
    "Enter array elements.",
    "Print the maximum element.",
    [
      { input: "1 5 3 9 2", expectedOutput: "9" },
      { input: "10 20 30", expectedOutput: "30" },
    ]
  ),

  createQuestion(
    "Find Minimum Element",
    "Easy",
    "Find the smallest element in an integer array.",
    "Enter array elements.",
    "Print the minimum element.",
    [
      { input: "1 5 3 9 2", expectedOutput: "1" },
      { input: "10 20 30", expectedOutput: "10" },
    ]
  ),

  createQuestion(
    "Sum of Array",
    "Easy",
    "Calculate the sum of all elements in an array.",
    "Enter array elements.",
    "Print the sum.",
    [
      { input: "1 2 3 4 5", expectedOutput: "15" },
      { input: "10 20 30", expectedOutput: "60" },
    ]
  ),

  createQuestion(
    "Count Even Numbers",
    "Easy",
    "Count the number of even elements in an array.",
    "Enter array elements.",
    "Print the count of even numbers.",
    [
      { input: "1 2 3 4 5 6", expectedOutput: "3" },
      { input: "2 4 6 8", expectedOutput: "4" },
    ]
  ),

  createQuestion(
    "Count Odd Numbers",
    "Easy",
    "Count the number of odd elements in an array.",
    "Enter array elements.",
    "Print the count of odd numbers.",
    [
      { input: "1 2 3 4 5", expectedOutput: "3" },
      { input: "2 4 6", expectedOutput: "0" },
    ]
  ),

  createQuestion(
    "Factorial of Number",
    "Easy",
    "Calculate the factorial of a given number.",
    "Enter an integer.",
    "Print the factorial.",
    [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
    ]
  ),

  createQuestion(
    "Fibonacci Series",
    "Easy",
    "Print the first N Fibonacci numbers.",
    "Enter N.",
    "Print the Fibonacci series.",
    [
      { input: "5", expectedOutput: "0 1 1 2 3" },
      { input: "7", expectedOutput: "0 1 1 2 3 5 8" },
    ],
    2
  ),

  createQuestion(
    "Check Prime Number",
    "Easy",
    "Check whether a given number is prime.",
    "Enter an integer.",
    "Print true if prime, otherwise false.",
    [
      { input: "7", expectedOutput: "true" },
      { input: "10", expectedOutput: "false" },
    ],
    2
  ),

  createQuestion(
    "Count Vowels",
    "Easy",
    "Count the number of vowels in a string.",
    "Enter a string.",
    "Print the number of vowels.",
    [
      { input: "hello", expectedOutput: "2" },
      { input: "programming", expectedOutput: "3" },
    ]
  ),

  createQuestion(
    "Sum of Digits",
    "Easy",
    "Find the sum of all digits of a number.",
    "Enter an integer.",
    "Print the sum of digits.",
    [
      { input: "1234", expectedOutput: "10" },
      { input: "999", expectedOutput: "27" },
    ]
  ),

  createQuestion(
    "Reverse Number",
    "Easy",
    "Reverse the digits of a given number.",
    "Enter an integer.",
    "Print the reversed number.",
    [
      { input: "1234", expectedOutput: "4321" },
      { input: "567", expectedOutput: "765" },
    ]
  ),

  createQuestion(
    "Check Armstrong Number",
    "Easy",
    "Check whether a number is an Armstrong number.",
    "Enter an integer.",
    "Print true if Armstrong, otherwise false.",
    [
      { input: "153", expectedOutput: "true" },
      { input: "123", expectedOutput: "false" },
    ],
    2
  ),

  createQuestion(
    "Check Anagram",
    "Easy",
    "Check whether two strings are anagrams.",
    "Enter two strings.",
    "Print true if they are anagrams.",
    [
      { input: "listen\nsilent", expectedOutput: "true" },
      { input: "hello\nworld", expectedOutput: "false" },
    ],
    2
  ),

  createQuestion(
    "Remove Duplicates",
    "Easy",
    "Remove duplicate values from an array.",
    "Enter array elements.",
    "Print the array without duplicate values.",
    [
      { input: "1 2 2 3 3 4", expectedOutput: "1 2 3 4" },
      { input: "5 5 5", expectedOutput: "5" },
    ],
    2
  ),

  createQuestion(
    "Second Largest Element",
    "Easy",
    "Find the second largest distinct element in an array.",
    "Enter array elements.",
    "Print the second largest element.",
    [
      { input: "10 5 8 20 15", expectedOutput: "15" },
      { input: "1 2 3", expectedOutput: "2" },
    ],
    2
  ),

  createQuestion(
    "Linear Search",
    "Easy",
    "Search for an element using linear search.",
    "First line contains array elements. Second line contains target.",
    "Print the index of the target or -1.",
    [
      { input: "10 20 30 40\n30", expectedOutput: "2" },
      { input: "5 8 12\n10", expectedOutput: "-1" },
    ],
    2
  ),

  createQuestion(
    "Count Positive Numbers",
    "Easy",
    "Count positive numbers in an array.",
    "Enter array elements.",
    "Print the count of positive numbers.",
    [
      { input: "-2 3 5 -1 7", expectedOutput: "3" },
      { input: "1 2 3", expectedOutput: "3" },
    ]
  ),

  createQuestion(
    "Count Negative Numbers",
    "Easy",
    "Count negative numbers in an array.",
    "Enter array elements.",
    "Print the count of negative numbers.",
    [
      { input: "-2 3 5 -1 7", expectedOutput: "2" },
      { input: "1 2 3", expectedOutput: "0" },
    ]
  ),

  createQuestion(
    "Average of Array",
    "Easy",
    "Calculate the average of array elements.",
    "Enter array elements.",
    "Print the average.",
    [
      { input: "10 20 30", expectedOutput: "20" },
      { input: "5 10", expectedOutput: "7.5" },
    ]
  ),

  createQuestion(
    "Swap Two Numbers",
    "Easy",
    "Swap two given numbers.",
    "Enter two integers.",
    "Print the numbers after swapping.",
    [
      { input: "10 20", expectedOutput: "20 10" },
      { input: "5 8", expectedOutput: "8 5" },
    ]
  ),

  createQuestion(
    "Even or Odd",
    "Easy",
    "Check whether a number is even or odd.",
    "Enter an integer.",
    "Print Even or Odd.",
    [
      { input: "10", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
    ]
  ),

  createQuestion(
    "Positive Negative Zero",
    "Easy",
    "Determine whether a number is positive, negative or zero.",
    "Enter an integer.",
    "Print Positive, Negative or Zero.",
    [
      { input: "5", expectedOutput: "Positive" },
      { input: "-3", expectedOutput: "Negative" },
    ]
  ),

  createQuestion(
    "Power of Number",
    "Easy",
    "Calculate the power of a number.",
    "Enter base and exponent.",
    "Print the result.",
    [
      { input: "2 5", expectedOutput: "32" },
      { input: "3 3", expectedOutput: "27" },
    ]
  ),

  createQuestion(
    "GCD of Two Numbers",
    "Easy",
    "Find the greatest common divisor of two numbers.",
    "Enter two integers.",
    "Print the GCD.",
    [
      { input: "12 18", expectedOutput: "6" },
      { input: "20 8", expectedOutput: "4" },
    ],
    2
  ),

  createQuestion(
    "LCM of Two Numbers",
    "Easy",
    "Find the least common multiple of two numbers.",
    "Enter two integers.",
    "Print the LCM.",
    [
      { input: "4 6", expectedOutput: "12" },
      { input: "5 10", expectedOutput: "10" },
    ],
    2
  ),

  createQuestion(
    "Decimal to Binary",
    "Easy",
    "Convert a decimal number into binary.",
    "Enter a decimal integer.",
    "Print its binary representation.",
    [
      { input: "10", expectedOutput: "1010" },
      { input: "5", expectedOutput: "101" },
    ]
  ),

  createQuestion(
    "Binary to Decimal",
    "Easy",
    "Convert a binary number into decimal.",
    "Enter a binary number.",
    "Print its decimal value.",
    [
      { input: "1010", expectedOutput: "10" },
      { input: "101", expectedOutput: "5" },
    ]
  ),

  createQuestion(
    "Count Digits",
    "Easy",
    "Count the number of digits in an integer.",
    "Enter an integer.",
    "Print the number of digits.",
    [
      { input: "12345", expectedOutput: "5" },
      { input: "100", expectedOutput: "3" },
    ]
  ),

  createQuestion(
    "Largest of Three Numbers",
    "Easy",
    "Find the largest among three numbers.",
    "Enter three integers.",
    "Print the largest number.",
    [
      { input: "10 20 15", expectedOutput: "20" },
      { input: "8 5 3", expectedOutput: "8" },
    ]
  ),

  createQuestion(
    "Smallest of Three Numbers",
    "Easy",
    "Find the smallest among three numbers.",
    "Enter three integers.",
    "Print the smallest number.",
    [
      { input: "10 20 15", expectedOutput: "10" },
      { input: "8 5 3", expectedOutput: "3" },
    ]
  ),

  createQuestion(
    "Sum of Natural Numbers",
    "Easy",
    "Calculate the sum of first N natural numbers.",
    "Enter N.",
    "Print the sum.",
    [
      { input: "5", expectedOutput: "15" },
      { input: "10", expectedOutput: "55" },
    ]
  ),

  createQuestion(
    "Multiplication Table",
    "Easy",
    "Print the multiplication table of a number from 1 to 10.",
    "Enter an integer.",
    "Print the multiplication table.",
    [
      {
        input: "5",
        expectedOutput:
          "5 10 15 20 25 30 35 40 45 50",
      },
    ]
  ),

  createQuestion(
    "Character Count",
    "Easy",
    "Count the number of characters in a string.",
    "Enter a string.",
    "Print the character count.",
    [
      { input: "hello", expectedOutput: "5" },
      { input: "CodeIT", expectedOutput: "6" },
    ]
  ),

  createQuestion(
    "Word Count",
    "Easy",
    "Count the number of words in a sentence.",
    "Enter a sentence.",
    "Print the number of words.",
    [
      { input: "hello world", expectedOutput: "2" },
      { input: "I love coding", expectedOutput: "3" },
    ]
  ),

  createQuestion(
    "Uppercase String",
    "Easy",
    "Convert a string to uppercase.",
    "Enter a string.",
    "Print the uppercase string.",
    [
      { input: "hello", expectedOutput: "HELLO" },
      { input: "CodeIT", expectedOutput: "CODEIT" },
    ]
  ),

  createQuestion(
    "Lowercase String",
    "Easy",
    "Convert a string to lowercase.",
    "Enter a string.",
    "Print the lowercase string.",
    [
      { input: "HELLO", expectedOutput: "hello" },
      { input: "CodeIT", expectedOutput: "codeit" },
    ]
  ),

  createQuestion(
    "First Non Repeating Character",
    "Easy",
    "Find the first character that occurs only once.",
    "Enter a string.",
    "Print the first non-repeating character.",
    [
      { input: "swiss", expectedOutput: "w" },
      { input: "aabbc", expectedOutput: "c" },
    ],
    2
  ),

  createQuestion(
    "Find Duplicate Element",
    "Easy",
    "Find the duplicate element in an array.",
    "Enter array elements.",
    "Print the duplicate element.",
    [
      { input: "1 3 4 2 2", expectedOutput: "2" },
      { input: "3 1 3 4 2", expectedOutput: "3" },
    ],
    2
  ),

  createQuestion(
    "Check Sorted Array",
    "Easy",
    "Check whether an array is sorted in ascending order.",
    "Enter array elements.",
    "Print true or false.",
    [
      { input: "1 2 3 4", expectedOutput: "true" },
      { input: "1 3 2 4", expectedOutput: "false" },
    ]
  ),

  // ==================================================
  // MEDIUM - 41 to 75
  // ==================================================

  createQuestion(
    "Binary Search",
    "Medium",
    "Search for a target value in a sorted array using binary search.",
    "First line contains sorted array. Second line contains target.",
    "Print the target index or -1.",
    [
      { input: "1 3 5 7 9\n7", expectedOutput: "3" },
      { input: "2 4 6 8\n5", expectedOutput: "-1" },
    ],
    3
  ),

  createQuestion(
    "Merge Sorted Arrays",
    "Medium",
    "Merge two sorted arrays into one sorted array.",
    "Enter two sorted arrays.",
    "Print the merged array.",
    [
      { input: "1 3 5\n2 4 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "1 2\n3 4", expectedOutput: "1 2 3 4" },
    ],
    3
  ),

  createQuestion(
    "Valid Parentheses",
    "Medium",
    "Check whether brackets in a string are correctly balanced.",
    "Enter a bracket string.",
    "Print true or false.",
    [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "([)]", expectedOutput: "false" },
    ],
    3
  ),

  createQuestion(
    "Maximum Subarray",
    "Medium",
    "Find the contiguous subarray with maximum sum.",
    "Enter an integer array.",
    "Print the maximum sum.",
    [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        expectedOutput: "6",
      },
      { input: "1 2 3", expectedOutput: "6" },
    ],
    3
  ),

  createQuestion(
    "Move Zeroes",
    "Medium",
    "Move all zeroes to the end while maintaining element order.",
    "Enter an integer array.",
    "Print the modified array.",
    [
      {
        input: "0 1 0 3 12",
        expectedOutput: "1 3 12 0 0",
      },
      {
        input: "0 0 1",
        expectedOutput: "1 0 0",
      },
    ],
    2
  ),

  createQuestion(
    "Rotate Array",
    "Medium",
    "Rotate an array to the right by K positions.",
    "First line contains array. Second line contains K.",
    "Print the rotated array.",
    [
      {
        input: "1 2 3 4 5\n2",
        expectedOutput: "4 5 1 2 3",
      },
      {
        input: "1 2 3\n1",
        expectedOutput: "3 1 2",
      },
    ],
    3
  ),

  createQuestion(
    "Majority Element",
    "Medium",
    "Find the element that appears more than half the time.",
    "Enter an integer array.",
    "Print the majority element.",
    [
      { input: "3 2 3", expectedOutput: "3" },
      {
        input: "2 2 1 1 1 2 2",
        expectedOutput: "2",
      },
    ],
    3
  ),

  createQuestion(
    "Product Except Self",
    "Medium",
    "Return the product of all elements except the current element.",
    "Enter an integer array.",
    "Print the resulting array.",
    [
      {
        input: "1 2 3 4",
        expectedOutput: "24 12 8 6",
      },
      {
        input: "2 3 4",
        expectedOutput: "12 8 6",
      },
    ],
    3
  ),

  createQuestion(
    "Longest Common Prefix",
    "Medium",
    "Find the longest common prefix of a list of strings.",
    "Enter strings separated by spaces.",
    "Print the longest common prefix.",
    [
      {
        input: "flower flow flight",
        expectedOutput: "fl",
      },
      {
        input: "dog racecar car",
        expectedOutput: "",
      },
    ],
    2
  ),

  createQuestion(
    "Group Anagrams",
    "Medium",
    "Group strings that are anagrams of each other.",
    "Enter a list of strings.",
    "Print the grouped anagrams.",
    [
      {
        input: "eat tea tan ate nat bat",
        expectedOutput: "ate eat tea | nat tan | bat",
      },
      {
        input: "abc bca cab dog",
        expectedOutput: "abc bca cab | dog",
      },
    ],
    3
  ),

  createQuestion(
    "Merge Intervals",
    "Medium",
    "Merge all overlapping intervals.",
    "Enter interval pairs.",
    "Print the merged intervals.",
    [
      {
        input: "1 3\n2 6\n8 10\n15 18",
        expectedOutput: "1 6\n8 10\n15 18",
      },
      {
        input: "1 4\n4 5",
        expectedOutput: "1 5",
      },
    ],
    3
  ),

  createQuestion(
    "Climbing Stairs",
    "Medium",
    "Find the number of ways to climb N stairs using one or two steps.",
    "Enter N.",
    "Print the number of ways.",
    [
      { input: "2", expectedOutput: "2" },
      { input: "5", expectedOutput: "8" },
    ],
    2
  ),

  createQuestion(
    "House Robber",
    "Medium",
    "Find the maximum amount that can be robbed without robbing adjacent houses.",
    "Enter money values of houses.",
    "Print the maximum amount.",
    [
      {
        input: "1 2 3 1",
        expectedOutput: "4",
      },
      {
        input: "2 7 9 3 1",
        expectedOutput: "12",
      },
    ],
    3
  ),

  createQuestion(
    "Coin Change",
    "Medium",
    "Find the minimum number of coins required to make an amount.",
    "First line contains coins. Second line contains amount.",
    "Print the minimum number of coins.",
    [
      {
        input: "1 2 5\n11",
        expectedOutput: "3",
      },
      {
        input: "2\n3",
        expectedOutput: "-1",
      },
    ],
    3
  ),

  createQuestion(
    "Subarray Sum Equals K",
    "Medium",
    "Count the number of continuous subarrays whose sum equals K.",
    "First line contains array. Second line contains K.",
    "Print the count.",
    [
      {
        input: "1 1 1\n2",
        expectedOutput: "2",
      },
      {
        input: "1 2 3\n3",
        expectedOutput: "2",
      },
    ],
    3
  ),

  createQuestion(
    "Longest Substring Without Repeating Characters",
    "Medium",
    "Find the length of the longest substring without repeating characters.",
    "Enter a string.",
    "Print the length.",
    [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
    ],
    3
  ),

  createQuestion(
    "Three Sum",
    "Medium",
    "Find all unique triplets whose sum is zero.",
    "Enter an integer array.",
    "Print the valid triplets.",
    [
      {
        input: "-1 0 1 2 -1 -4",
        expectedOutput: "-1 -1 2 | -1 0 1",
      },
      {
        input: "0 1 1",
        expectedOutput: "",
      },
    ],
    3
  ),

  createQuestion(
    "Sort Colors",
    "Medium",
    "Sort an array containing only 0, 1 and 2.",
    "Enter the array.",
    "Print the sorted array.",
    [
      {
        input: "2 0 2 1 1 0",
        expectedOutput: "0 0 1 1 2 2",
      },
      {
        input: "2 1 0",
        expectedOutput: "0 1 2",
      },
    ],
    3
  ),

  createQuestion(
    "Find Peak Element",
    "Medium",
    "Find an element that is greater than its neighbors.",
    "Enter an integer array.",
    "Print the index of a peak element.",
    [
      { input: "1 2 3 1", expectedOutput: "2" },
      { input: "1 2 1 3 5 6 4", expectedOutput: "5" },
    ],
    3
  ),

  createQuestion(
    "Spiral Matrix",
    "Medium",
    "Print the elements of a matrix in spiral order.",
    "Enter a matrix.",
    "Print elements in spiral order.",
    [
      {
        input: "1 2 3\n4 5 6\n7 8 9",
        expectedOutput: "1 2 3 6 9 8 7 4 5",
      },
      {
        input: "1 2\n3 4",
        expectedOutput: "1 2 4 3",
      },
    ],
    3
  ),

  createQuestion(
    "Set Matrix Zeroes",
    "Medium",
    "If an element is zero, set its entire row and column to zero.",
    "Enter a matrix.",
    "Print the modified matrix.",
    [
      {
        input: "1 1 1\n1 0 1\n1 1 1",
        expectedOutput: "1 0 1\n0 0 0\n1 0 1",
      },
    ],
    3
  ),

  createQuestion(
    "Search in Rotated Sorted Array",
    "Medium",
    "Search for a target in a rotated sorted array.",
    "First line contains array. Second line contains target.",
    "Print the index or -1.",
    [
      {
        input: "4 5 6 7 0 1 2\n0",
        expectedOutput: "4",
      },
      {
        input: "4 5 6 7 0 1 2\n3",
        expectedOutput: "-1",
      },
    ],
    3
  ),

  createQuestion(
    "Daily Temperatures",
    "Medium",
    "Find how many days one must wait for a warmer temperature.",
    "Enter daily temperatures.",
    "Print the waiting days array.",
    [
      {
        input: "73 74 75 71 69 72 76 73",
        expectedOutput: "1 1 4 2 1 1 0 0",
      },
    ],
    3
  ),

  createQuestion(
    "Evaluate Reverse Polish Notation",
    "Medium",
    "Evaluate an arithmetic expression written in Reverse Polish Notation.",
    "Enter tokens separated by spaces.",
    "Print the result.",
    [
      {
        input: "2 1 + 3 *",
        expectedOutput: "9",
      },
      {
        input: "4 13 5 / +",
        expectedOutput: "6",
      },
    ],
    3
  ),

  createQuestion(
    "Min Stack",
    "Medium",
    "Design a stack that supports retrieving the minimum element in constant time.",
    "Enter stack operations.",
    "Print results of minimum operations.",
    [
      {
        input: "push 5\npush 2\npush 8\nmin",
        expectedOutput: "2",
      },
      {
        input: "push 3\npush 1\nmin\npop\nmin",
        expectedOutput: "1\n3",
      },
    ],
    3
  ),

  createQuestion(
    "Intersection of Arrays",
    "Medium",
    "Find the intersection of two arrays.",
    "Enter two arrays.",
    "Print common elements.",
    [
      {
        input: "1 2 2 1\n2 2",
        expectedOutput: "2 2",
      },
      {
        input: "4 9 5\n9 4 9 8 4",
        expectedOutput: "4 9",
      },
    ],
    2
  ),

  createQuestion(
    "Top K Frequent Elements",
    "Medium",
    "Find the K most frequent elements.",
    "First line contains array. Second line contains K.",
    "Print the K frequent elements.",
    [
      {
        input: "1 1 1 2 2 3\n2",
        expectedOutput: "1 2",
      },
      {
        input: "1 2 2 3 3 3\n1",
        expectedOutput: "3",
      },
    ],
    3
  ),

  createQuestion(
    "Kth Largest Element",
    "Medium",
    "Find the Kth largest element in an array.",
    "First line contains array. Second line contains K.",
    "Print the Kth largest element.",
    [
      {
        input: "3 2 1 5 6 4\n2",
        expectedOutput: "5",
      },
      {
        input: "3 2 3 1 2 4 5 5 6\n4",
        expectedOutput: "4",
      },
    ],
    3
  ),

  createQuestion(
    "Partition Equal Subset Sum",
    "Medium",
    "Determine whether an array can be divided into two subsets with equal sum.",
    "Enter an integer array.",
    "Print true or false.",
    [
      {
        input: "1 5 11 5",
        expectedOutput: "true",
      },
      {
        input: "1 2 3 5",
        expectedOutput: "false",
      },
    ],
    3
  ),

  createQuestion(
    "Decode String",
    "Medium",
    "Decode a string containing encoded repetition patterns.",
    "Enter encoded string.",
    "Print the decoded string.",
    [
      {
        input: "3[a]2[bc]",
        expectedOutput: "aaabcbc",
      },
      {
        input: "3[a2[c]]",
        expectedOutput: "accaccacc",
      },
    ],
    3
  ),

  createQuestion(
    "Binary Tree Level Order",
    "Medium",
    "Print the nodes of a binary tree level by level.",
    "Enter binary tree nodes.",
    "Print level order traversal.",
    [
      {
        input: "3 9 20 null null 15 7",
        expectedOutput: "3 9 20 15 7",
      },
      {
        input: "1 2 3",
        expectedOutput: "1 2 3",
      },
    ],
    3
  ),

  createQuestion(
    "Number of Connected Components",
    "Medium",
    "Find the number of connected components in an undirected graph.",
    "Enter vertices and edges.",
    "Print the number of components.",
    [
      {
        input: "5\n0 1\n1 2\n3 4",
        expectedOutput: "2",
      },
      {
        input: "4\n0 1\n2 3",
        expectedOutput: "2",
      },
    ],
    3
  ),

  createQuestion(
    "Course Schedule Basic",
    "Medium",
    "Determine whether courses can be completed without a dependency cycle.",
    "Enter courses and prerequisites.",
    "Print true or false.",
    [
      {
        input: "2\n1 0",
        expectedOutput: "true",
      },
      {
        input: "2\n1 0\n0 1",
        expectedOutput: "false",
      },
    ],
    3
  ),

  createQuestion(
    "Jump Game",
    "Medium",
    "Determine whether the last index of an array can be reached.",
    "Enter an array of maximum jump lengths.",
    "Print true or false.",
    [
      {
        input: "2 3 1 1 4",
        expectedOutput: "true",
      },
      {
        input: "3 2 1 0 4",
        expectedOutput: "false",
      },
    ],
    3
  ),

  createQuestion(
    "Gas Station",
    "Medium",
    "Find the starting gas station from which a complete circuit can be made.",
    "Enter gas amounts followed by cost amounts.",
    "Print the starting index or -1.",
    [
      {
        input: "1 2 3 4 5\n3 4 5 1 2",
        expectedOutput: "3",
      },
      {
        input: "2 3 4\n3 4 3",
        expectedOutput: "-1",
      },
    ],
    3
  ),

  createQuestion(
    "Longest Consecutive Sequence",
    "Medium",
    "Find the length of the longest consecutive sequence.",
    "Enter an integer array.",
    "Print the length.",
    [
      {
        input: "100 4 200 1 3 2",
        expectedOutput: "4",
      },
      {
        input: "0 3 7 2 5 8 4 6 0 1",
        expectedOutput: "9",
      },
    ],
    3
  ),

  // ==================================================
  // HARD - 76 to 100
  // ==================================================

  createQuestion(
    "Longest Increasing Subsequence",
    "Hard",
    "Find the length of the longest strictly increasing subsequence.",
    "Enter an integer array.",
    "Print the length.",
    [
      {
        input: "10 9 2 5 3 7 101 18",
        expectedOutput: "4",
      },
      {
        input: "0 1 0 3 2 3",
        expectedOutput: "4",
      },
    ],
    5
  ),

  createQuestion(
    "Edit Distance",
    "Hard",
    "Find the minimum operations required to convert one string into another.",
    "Enter two strings.",
    "Print the minimum edit distance.",
    [
      {
        input: "horse\nros",
        expectedOutput: "3",
      },
      {
        input: "intention\nexecution",
        expectedOutput: "5",
      },
    ],
    5
  ),

  createQuestion(
    "Longest Palindromic Substring",
    "Hard",
    "Find the longest palindromic substring.",
    "Enter a string.",
    "Print the longest palindromic substring.",
    [
      {
        input: "babad",
        expectedOutput: "bab",
      },
      {
        input: "cbbd",
        expectedOutput: "bb",
      },
    ],
    5
  ),

  createQuestion(
    "Word Break",
    "Hard",
    "Determine whether a string can be segmented into dictionary words.",
    "Enter string followed by dictionary words.",
    "Print true or false.",
    [
      {
        input: "leetcode\nleet code",
        expectedOutput: "true",
      },
      {
        input: "applepenapple\napple pen",
        expectedOutput: "true",
      },
    ],
    5
  ),

  createQuestion(
    "Trapping Rain Water",
    "Hard",
    "Calculate how much rain water can be trapped between bars.",
    "Enter the height array.",
    "Print total trapped water.",
    [
      {
        input: "0 1 0 2 1 0 1 3 2 1 2 1",
        expectedOutput: "6",
      },
      {
        input: "4 2 0 3 2 5",
        expectedOutput: "9",
      },
    ],
    5
  ),

  createQuestion(
    "Minimum Path Sum",
    "Hard",
    "Find the minimum sum path from top-left to bottom-right.",
    "Enter a grid of positive integers.",
    "Print the minimum path sum.",
    [
      {
        input: "1 3 1\n1 5 1\n4 2 1",
        expectedOutput: "7",
      },
      {
        input: "1 2 3\n4 5 6",
        expectedOutput: "12",
      },
    ],
    5
  ),

  createQuestion(
    "Number of Islands",
    "Hard",
    "Count the number of connected islands in a binary grid.",
    "Enter a binary grid.",
    "Print the number of islands.",
    [
      {
        input: "1 1 0 0\n1 0 0 1\n0 0 1 1",
        expectedOutput: "3",
      },
      {
        input: "1 1\n1 1",
        expectedOutput: "1",
      },
    ],
    5
  ),

  createQuestion(
    "Course Schedule",
    "Hard",
    "Determine whether all courses can be completed without dependency cycles.",
    "Enter courses and prerequisite pairs.",
    "Print true or false.",
    [
      {
        input: "2\n1 0",
        expectedOutput: "true",
      },
      {
        input: "2\n1 0\n0 1",
        expectedOutput: "false",
      },
    ],
    5
  ),

  createQuestion(
    "Word Ladder",
    "Hard",
    "Find the shortest transformation sequence between two words.",
    "Enter begin word, end word and dictionary.",
    "Print the shortest transformation length.",
    [
      {
        input: "hit cog\nhot dot dog lot log cog",
        expectedOutput: "5",
      },
      {
        input: "hit cog\nhot dot dog",
        expectedOutput: "0",
      },
    ],
    5
  ),

  createQuestion(
    "LRU Cache",
    "Hard",
    "Design a Least Recently Used cache supporting get and put operations.",
    "Enter cache operations.",
    "Print the results of get operations.",
    [
      {
        input:
          "capacity 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2",
        expectedOutput: "1 -1",
      },
    ],
    5
  ),

  createQuestion(
    "Median of Two Sorted Arrays",
    "Hard",
    "Find the median of two sorted arrays.",
    "Enter two sorted arrays.",
    "Print the median.",
    [
      {
        input: "1 3\n2",
        expectedOutput: "2",
      },
      {
        input: "1 2\n3 4",
        expectedOutput: "2.5",
      },
    ],
    5
  ),

  createQuestion(
    "Regular Expression Matching",
    "Hard",
    "Check whether a string matches a pattern containing . and *.",
    "Enter string and pattern.",
    "Print true or false.",
    [
      {
        input: "aa\na",
        expectedOutput: "false",
      },
      {
        input: "aa\na*",
        expectedOutput: "true",
      },
      {
        input: "ab\n.*",
        expectedOutput: "true",
      },
    ],
    5
  ),

  createQuestion(
    "Binary Tree Maximum Path Sum",
    "Hard",
    "Find the maximum path sum in a binary tree.",
    "Enter binary tree nodes.",
    "Print the maximum path sum.",
    [
      {
        input: "1 2 3",
        expectedOutput: "6",
      },
      {
        input: "-10 9 20 null null 15 7",
        expectedOutput: "42",
      },
    ],
    5
  ),

  createQuestion(
    "Alien Dictionary",
    "Hard",
    "Determine the character order of an alien language.",
    "Enter words in alien dictionary order.",
    "Print a valid character ordering.",
    [
      {
        input: "wrt wrf er ett rftt",
        expectedOutput: "wertf",
      },
      {
        input: "z x",
        expectedOutput: "zx",
      },
    ],
    5
  ),

  createQuestion(
    "Network Delay Time",
    "Hard",
    "Find the time required for all nodes to receive a signal.",
    "Enter weighted directed graph edges.",
    "Print the network delay time.",
    [
      {
        input: "2\n2 1 1\n1",
        expectedOutput: "1",
      },
      {
        input: "3\n2 1 1\n2 3 1\n1",
        expectedOutput: "2",
      },
    ],
    5
  ),

  createQuestion(
    "Critical Connections",
    "Hard",
    "Find all bridges in an undirected network.",
    "Enter graph vertices and edges.",
    "Print the critical connections.",
    [
      {
        input: "4\n0 1\n1 2\n2 0\n1 3",
        expectedOutput: "1 3",
      },
    ],
    5
  ),

  createQuestion(
    "Serialize Binary Tree",
    "Hard",
    "Serialize a binary tree into a string representation.",
    "Enter binary tree nodes.",
    "Print the serialized tree.",
    [
      {
        input: "1 2 3 null null 4 5",
        expectedOutput: "1,2,3,null,null,4,5",
      },
      {
        input: "1",
        expectedOutput: "1",
      },
    ],
    5
  ),

  createQuestion(
    "Maximum Rectangle in Histogram",
    "Hard",
    "Find the largest rectangular area in a histogram.",
    "Enter histogram heights.",
    "Print the maximum rectangle area.",
    [
      {
        input: "2 1 5 6 2 3",
        expectedOutput: "10",
      },
      {
        input: "2 4",
        expectedOutput: "4",
      },
    ],
    5
  ),

  createQuestion(
    "Largest Rectangle in Matrix",
    "Hard",
    "Find the largest rectangle containing only 1s in a binary matrix.",
    "Enter a binary matrix.",
    "Print the largest rectangle area.",
    [
      {
        input: "1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
        expectedOutput: "6",
      },
    ],
    5
  ),

  createQuestion(
    "Palindrome Partitioning",
    "Hard",
    "Find the minimum number of cuts needed to partition a string into palindromes.",
    "Enter a string.",
    "Print the minimum number of cuts.",
    [
      {
        input: "aab",
        expectedOutput: "1",
      },
      {
        input: "a",
        expectedOutput: "0",
      },
    ],
    5
  ),

  createQuestion(
    "Minimum Window Substring",
    "Hard",
    "Find the smallest substring containing all characters of another string.",
    "Enter source string and target string.",
    "Print the minimum window.",
    [
      {
        input: "ADOBECODEBANC\nABC",
        expectedOutput: "BANC",
      },
      {
        input: "a\na",
        expectedOutput: "a",
      },
    ],
    5
  ),

  createQuestion(
    "Distinct Subsequences",
    "Hard",
    "Count how many distinct subsequences of one string equal another string.",
    "Enter two strings.",
    "Print the count.",
    [
      {
        input: "rabbbit\nrabbit",
        expectedOutput: "3",
      },
      {
        input: "babgbag\nbag",
        expectedOutput: "5",
      },
    ],
    5
  ),

  createQuestion(
    "Burst Balloons",
    "Hard",
    "Find the maximum coins that can be collected by bursting balloons in an optimal order.",
    "Enter balloon values.",
    "Print the maximum coins.",
    [
      {
        input: "3 1 5 8",
        expectedOutput: "167",
      },
      {
        input: "1 5",
        expectedOutput: "10",
      },
    ],
    5
  ),

  createQuestion(
    "Graph Bipartite Check",
    "Hard",
    "Determine whether an undirected graph can be divided into two sets.",
    "Enter graph edges.",
    "Print true or false.",
    [
      {
        input: "4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "true",
      },
      {
        input: "3\n0 1\n1 2\n2 0",
        expectedOutput: "false",
      },
    ],
    5
  ),

  createQuestion(
    "Shortest Path in Grid",
    "Hard",
    "Find the shortest path from the top-left cell to the bottom-right cell.",
    "Enter a binary grid.",
    "Print the shortest path length.",
    [
      {
        input: "0 1 0\n0 0 0\n1 1 0",
        expectedOutput: "4",
      },
      {
        input: "0 0\n0 0",
        expectedOutput: "2",
      },
    ],
    5
  ),

  createQuestion(
    "Floyd Warshall",
    "Hard",
    "Find shortest paths between every pair of vertices using Floyd Warshall algorithm.",
    "Enter a weighted adjacency matrix.",
    "Print the shortest path matrix.",
    [
      {
        input: "0 3 999\n3 0 1\n999 1 0",
        expectedOutput: "0 3 4\n3 0 1\n4 1 0",
      },
    ],
    5
  ),

  createQuestion(
    "Dijkstra Shortest Path",
    "Hard",
    "Find the shortest distances from a source vertex using Dijkstra's algorithm.",
    "Enter weighted graph edges and source.",
    "Print shortest distances.",
    [
      {
        input: "4\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n0",
        expectedOutput: "0 3 1 4",
      },
    ],
    5
  ),

  createQuestion(
    "Minimum Spanning Tree",
    "Hard",
    "Find the minimum total weight required to connect all vertices.",
    "Enter weighted undirected graph edges.",
    "Print the minimum spanning tree weight.",
    [
      {
        input: "4\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        expectedOutput: "19",
      },
    ],
    5
  ),

  createQuestion(
    "Topological Sort",
    "Hard",
    "Perform topological sorting on a directed acyclic graph.",
    "Enter directed graph edges.",
    "Print a valid topological ordering.",
    [
      {
        input: "4\n0 1\n0 2\n1 3\n2 3",
        expectedOutput: "0 1 2 3",
      },
    ],
    5
  ),

  createQuestion(
    "Strongly Connected Components",
    "Hard",
    "Find the number of strongly connected components in a directed graph.",
    "Enter directed graph edges.",
    "Print the number of components.",
    [
      {
        input: "5\n0 1\n1 2\n2 0\n1 3\n3 4",
        expectedOutput: "3",
      },
    ],
    5
  ),

  createQuestion(
    "N Queens",
    "Hard",
    "Find the number of possible solutions for the N Queens problem.",
    "Enter N.",
    "Print the number of solutions.",
    [
      { input: "4", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" },
    ],
    5
  ),

  createQuestion(
    "Sudoku Solver",
    "Hard",
    "Solve a given 9x9 Sudoku board.",
    "Enter a Sudoku board.",
    "Print the solved board.",
    [
      {
        input:
          "53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
        expectedOutput: "Solved Sudoku",
      },
    ],
    5
  ),

  createQuestion(
    "Traveling Salesman Problem",
    "Hard",
    "Find the minimum cost required to visit every city exactly once and return to the starting city.",
    "Enter a distance matrix.",
    "Print the minimum travel cost.",
    [
      {
        input: "0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0",
        expectedOutput: "80",
      },
    ],
    5
  ),

  createQuestion(
    "Knapsack 0/1",
    "Hard",
    "Find the maximum value that can be obtained without exceeding the weight capacity.",
    "Enter item weights, values and capacity.",
    "Print the maximum value.",
    [
      {
        input: "1 2 3\n6 10 12\n5",
        expectedOutput: "22",
      },
      {
        input: "2 3 4\n4 5 6\n5",
        expectedOutput: "9",
      },
    ],
    5
  ),

];


/*
====================================================
VERIFY QUESTION COUNT
====================================================
*/

const easyCount = questions.filter(
  (q) => q.difficulty === "Easy"
).length;

const mediumCount = questions.filter(
  (q) => q.difficulty === "Medium"
).length;

const hardCount = questions.filter(
  (q) => q.difficulty === "Hard"
).length;

console.log("================================");
console.log("CODEIT QUESTION COUNT");
console.log("================================");
console.log("Easy   :", easyCount);
console.log("Medium :", mediumCount);
console.log("Hard   :", hardCount);
console.log("Total  :", questions.length);
console.log("================================");


/*
====================================================
SEED DATABASE
====================================================
*/

async function seedQuestions() {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const existingCount =
      await Question.countDocuments({
        type: "Coding",
      });

    if (existingCount > 0) {

      console.log(
        `⚠️ ${existingCount} coding questions already exist.`
      );

      console.log(
        "Seed stopped to prevent duplicate questions."
      );

      await mongoose.disconnect();

      process.exit(0);
    }

    await Question.insertMany(questions);

    console.log("");
    console.log(
      `✅ ${questions.length} coding questions inserted successfully.`
    );

    console.log(`🟢 Easy: ${easyCount}`);
    console.log(`🟡 Medium: ${mediumCount}`);
    console.log(`🔴 Hard: ${hardCount}`);

    console.log("");
    console.log(
      "🎉 CodeIT coding question database is ready!"
    );

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ Seed error:",
      error.message
    );

    await mongoose.disconnect();

    process.exit(1);
  }
}


seedQuestions();