const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");

dotenv.config();

/*
====================================================
CODEIT - UPDATE 100 CODING QUESTIONS
====================================================
Adds:
1. Test cases
2. JavaScript starter code
3. Python starter code
4. Java starter code
5. C++ starter code
6. Input
7. Expected output
====================================================
*/

const questionData = {

  /* =================================================
     EASY QUESTIONS
  ================================================= */

  "Two Sum": {
    description:
      "Given an array of integers and a target value, find two numbers whose sum is equal to the target.",

    input:
      "First line contains the array elements. Second line contains the target.",

    output:
      "Print the indices of the two numbers.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "2 7 11 15\n9",
        expectedOutput: "0 1",
      },
      {
        input: "3 2 4\n6",
        expectedOutput: "1 2",
      },
      {
        input: "3 3\n6",
        expectedOutput: "0 1",
      },
    ],
  },

  "Palindrome Number": {
    description:
      "Given an integer, determine whether it reads the same forward and backward.",

    input:
      "Enter an integer.",

    output:
      "Print true if the number is a palindrome, otherwise print false.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "121",
        expectedOutput: "true",
      },
      {
        input: "123",
        expectedOutput: "false",
      },
      {
        input: "1221",
        expectedOutput: "true",
      },
    ],
  },

  "Reverse String": {
    description:
      "Given a string, reverse the characters and print the reversed string.",

    input:
      "Enter a string.",

    output:
      "Print the reversed string.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "hello",
        expectedOutput: "olleh",
      },
      {
        input: "CodeIT",
        expectedOutput: "TIdoC",
      },
      {
        input: "abc",
        expectedOutput: "cba",
      },
    ],
  },

  "Find Maximum Element": {
    description:
      "Given an array of integers, find the maximum element.",

    input:
      "Enter array elements.",

    output:
      "Print the maximum element.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1 5 3 9 2",
        expectedOutput: "9",
      },
      {
        input: "10 20 30",
        expectedOutput: "30",
      },
      {
        input: "-5 -2 -10",
        expectedOutput: "-2",
      },
    ],
  },

  "Find Minimum Element": {
    description:
      "Given an array of integers, find the minimum element.",

    input:
      "Enter array elements.",

    output:
      "Print the minimum element.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1 5 3 9 2",
        expectedOutput: "1",
      },
      {
        input: "10 20 30",
        expectedOutput: "10",
      },
      {
        input: "-5 -2 -10",
        expectedOutput: "-10",
      },
    ],
  },

  "Sum of Array": {
    description:
      "Given an array of integers, calculate the sum of all elements.",

    input:
      "Enter array elements.",

    output:
      "Print the sum.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1 2 3 4 5",
        expectedOutput: "15",
      },
      {
        input: "10 20 30",
        expectedOutput: "60",
      },
      {
        input: "5 5 5",
        expectedOutput: "15",
      },
    ],
  },

  "Count Even Numbers": {
    description:
      "Given an array, count how many elements are even.",

    input:
      "Enter array elements.",

    output:
      "Print the count of even numbers.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1 2 3 4 5 6",
        expectedOutput: "3",
      },
      {
        input: "2 4 6 8",
        expectedOutput: "4",
      },
      {
        input: "1 3 5",
        expectedOutput: "0",
      },
    ],
  },

  "Count Odd Numbers": {
    description:
      "Given an array, count how many elements are odd.",

    input:
      "Enter array elements.",

    output:
      "Print the count of odd numbers.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1 2 3 4 5",
        expectedOutput: "3",
      },
      {
        input: "2 4 6",
        expectedOutput: "0",
      },
      {
        input: "1 3 5 7",
        expectedOutput: "4",
      },
    ],
  },

  "Factorial of Number": {
    description:
      "Calculate the factorial of a given positive integer.",

    input:
      "Enter an integer.",

    output:
      "Print the factorial.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "5",
        expectedOutput: "120",
      },
      {
        input: "3",
        expectedOutput: "6",
      },
      {
        input: "0",
        expectedOutput: "1",
      },
    ],
  },

  "Fibonacci Series": {
    description:
      "Print the first N numbers of the Fibonacci sequence.",

    input:
      "Enter N.",

    output:
      "Print the Fibonacci sequence.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "5",
        expectedOutput: "0 1 1 2 3",
      },
      {
        input: "7",
        expectedOutput: "0 1 1 2 3 5 8",
      },
      {
        input: "3",
        expectedOutput: "0 1 1",
      },
    ],
  },

  "Check Prime Number": {
    description:
      "Determine whether a given number is prime.",

    input:
      "Enter an integer.",

    output:
      "Print true if prime, otherwise false.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "7",
        expectedOutput: "true",
      },
      {
        input: "10",
        expectedOutput: "false",
      },
      {
        input: "13",
        expectedOutput: "true",
      },
    ],
  },

  "Count Vowels": {
    description:
      "Count the number of vowels in a given string.",

    input:
      "Enter a string.",

    output:
      "Print the number of vowels.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "hello",
        expectedOutput: "2",
      },
      {
        input: "programming",
        expectedOutput: "3",
      },
      {
        input: "aeiou",
        expectedOutput: "5",
      },
    ],
  },

  "Character Frequency": {
    description:
      "Find the frequency of a given character in a string.",

    input:
      "First line contains a string. Second line contains a character.",

    output:
      "Print the frequency.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "banana\na",
        expectedOutput: "3",
      },
      {
        input: "hello\nl",
        expectedOutput: "2",
      },
      {
        input: "apple\np",
        expectedOutput: "2",
      },
    ],
  },

  "Sum of Digits": {
    description:
      "Calculate the sum of digits of an integer.",

    input:
      "Enter an integer.",

    output:
      "Print the sum of digits.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1234",
        expectedOutput: "10",
      },
      {
        input: "999",
        expectedOutput: "27",
      },
      {
        input: "100",
        expectedOutput: "1",
      },
    ],
  },

  "Reverse Number": {
    description:
      "Reverse the digits of a given integer.",

    input:
      "Enter an integer.",

    output:
      "Print the reversed number.",

    difficulty: "Easy",
    marks: 1,

    testCases: [
      {
        input: "1234",
        expectedOutput: "4321",
      },
      {
        input: "100",
        expectedOutput: "1",
      },
      {
        input: "567",
        expectedOutput: "765",
      },
    ],
  },

  "Check Armstrong Number": {
    description:
      "Check whether a number is an Armstrong number.",

    input:
      "Enter an integer.",

    output:
      "Print true if Armstrong, otherwise false.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "153",
        expectedOutput: "true",
      },
      {
        input: "123",
        expectedOutput: "false",
      },
      {
        input: "370",
        expectedOutput: "true",
      },
    ],
  },

  "Check Anagram": {
    description:
      "Determine whether two strings are anagrams of each other.",

    input:
      "Enter two strings.",

    output:
      "Print true if they are anagrams.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "listen\nsilent",
        expectedOutput: "true",
      },
      {
        input: "hello\nworld",
        expectedOutput: "false",
      },
      {
        input: "earth\nheart",
        expectedOutput: "true",
      },
    ],
  },

  "Remove Duplicates": {
    description:
      "Remove duplicate values from an array.",

    input:
      "Enter array elements.",

    output:
      "Print the array without duplicates.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "1 2 2 3 3 4",
        expectedOutput: "1 2 3 4",
      },
      {
        input: "5 5 5",
        expectedOutput: "5",
      },
      {
        input: "1 2 3",
        expectedOutput: "1 2 3",
      },
    ],
  },

  "Second Largest Element": {
    description:
      "Find the second largest distinct element in an array.",

    input:
      "Enter array elements.",

    output:
      "Print the second largest element.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "10 5 8 20 15",
        expectedOutput: "15",
      },
      {
        input: "1 2 3",
        expectedOutput: "2",
      },
      {
        input: "10 10 8 5",
        expectedOutput: "8",
      },
    ],
  },

  "Linear Search": {
    description:
      "Search for a target element in an array using linear search.",

    input:
      "First line contains array elements. Second line contains target.",

    output:
      "Print the index of the target or -1.",

    difficulty: "Easy",
    marks: 2,

    testCases: [
      {
        input: "10 20 30 40\n30",
        expectedOutput: "2",
      },
      {
        input: "5 8 12\n10",
        expectedOutput: "-1",
      },
      {
        input: "4 7 9\n4",
        expectedOutput: "0",
      },
    ],
  },

  /* =================================================
     MEDIUM QUESTIONS
  ================================================= */

  "Binary Search": {
    description:
      "Search for a target value in a sorted array using binary search.",

    input:
      "First line contains sorted array elements. Second line contains target.",

    output:
      "Print the index of the target or -1.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 3 5 7 9\n7",
        expectedOutput: "3",
      },
      {
        input: "2 4 6 8 10\n5",
        expectedOutput: "-1",
      },
      {
        input: "1 2 3 4 5\n1",
        expectedOutput: "0",
      },
    ],
  },

  "Merge Sorted Arrays": {
    description:
      "Merge two sorted arrays into one sorted array.",

    input:
      "Enter two sorted arrays.",

    output:
      "Print the merged sorted array.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 3 5\n2 4 6",
        expectedOutput: "1 2 3 4 5 6",
      },
      {
        input: "1 2\n3 4",
        expectedOutput: "1 2 3 4",
      },
      {
        input: "2 5\n1 6",
        expectedOutput: "1 2 5 6",
      },
    ],
  },

  "Valid Parentheses": {
    description:
      "Determine whether a string containing brackets is valid.",

    input:
      "Enter a bracket string.",

    output:
      "Print true if valid, otherwise false.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "()[]{}",
        expectedOutput: "true",
      },
      {
        input: "([)]",
        expectedOutput: "false",
      },
      {
        input: "{[]}",
        expectedOutput: "true",
      },
    ],
  },

  "Maximum Subarray": {
    description:
      "Find the contiguous subarray with the largest sum.",

    input:
      "Enter an integer array.",

    output:
      "Print the maximum subarray sum.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "-2 1 -3 4 -1 2 1 -5 4",
        expectedOutput: "6",
      },
      {
        input: "1 2 3",
        expectedOutput: "6",
      },
      {
        input: "-5 -2 -8",
        expectedOutput: "-2",
      },
    ],
  },

  "Move Zeroes": {
    description:
      "Move all zeroes to the end while maintaining the order of non-zero elements.",

    input:
      "Enter an integer array.",

    output:
      "Print the modified array.",

    difficulty: "Medium",
    marks: 2,

    testCases: [
      {
        input: "0 1 0 3 12",
        expectedOutput: "1 3 12 0 0",
      },
      {
        input: "0 0 1",
        expectedOutput: "1 0 0",
      },
      {
        input: "1 2 3",
        expectedOutput: "1 2 3",
      },
    ],
  },

  "Rotate Array": {
    description:
      "Rotate an array to the right by K positions.",

    input:
      "First line contains array. Second line contains K.",

    output:
      "Print the rotated array.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 2 3 4 5\n2",
        expectedOutput: "4 5 1 2 3",
      },
      {
        input: "1 2 3\n1",
        expectedOutput: "3 1 2",
      },
      {
        input: "1 2 3 4\n4",
        expectedOutput: "1 2 3 4",
      },
    ],
  },

  "Majority Element": {
    description:
      "Find the element that appears more than half the length of the array.",

    input:
      "Enter an integer array.",

    output:
      "Print the majority element.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "3 2 3",
        expectedOutput: "3",
      },
      {
        input: "2 2 1 1 1 2 2",
        expectedOutput: "2",
      },
      {
        input: "5 5 5 2 3",
        expectedOutput: "5",
      },
    ],
  },

  "Product Except Self": {
    description:
      "Return an array where each element is the product of all other elements.",

    input:
      "Enter an integer array.",

    output:
      "Print the resulting array.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 2 3 4",
        expectedOutput: "24 12 8 6",
      },
      {
        input: "2 3 4",
        expectedOutput: "12 8 6",
      },
      {
        input: "1 1 2",
        expectedOutput: "2 2 1",
      },
    ],
  },

  "Longest Common Prefix": {
    description:
      "Find the longest common prefix among a group of strings.",

    input:
      "Enter strings.",

    output:
      "Print the longest common prefix.",

    difficulty: "Medium",
    marks: 2,

    testCases: [
      {
        input: "flower flow flight",
        expectedOutput: "fl",
      },
      {
        input: "dog racecar car",
        expectedOutput: "",
      },
      {
        input: "interview internet internal",
        expectedOutput: "inter",
      },
    ],
  },

  "Group Anagrams": {
    description:
      "Group strings that are anagrams of each other.",

    input:
      "Enter a list of strings.",

    output:
      "Print grouped anagrams.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "eat tea tan ate nat bat",
        expectedOutput: "ate eat tea | nat tan | bat",
      },
      {
        input: "abc bca cab dog",
        expectedOutput: "abc bca cab | dog",
      },
      {
        input: "listen silent hello",
        expectedOutput: "listen silent | hello",
      },
    ],
  },

  "Merge Intervals": {
    description:
      "Merge all overlapping intervals.",

    input:
      "Enter intervals.",

    output:
      "Print the merged intervals.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 3\n2 6\n8 10\n15 18",
        expectedOutput: "1 6\n8 10\n15 18",
      },
      {
        input: "1 4\n4 5",
        expectedOutput: "1 5",
      },
      {
        input: "1 2\n3 4",
        expectedOutput: "1 2\n3 4",
      },
    ],
  },

  "Climbing Stairs": {
    description:
      "Find the number of distinct ways to climb N stairs when you can take one or two steps.",

    input:
      "Enter N.",

    output:
      "Print the number of ways.",

    difficulty: "Medium",
    marks: 2,

    testCases: [
      {
        input: "2",
        expectedOutput: "2",
      },
      {
        input: "3",
        expectedOutput: "3",
      },
      {
        input: "5",
        expectedOutput: "8",
      },
    ],
  },

  "House Robber": {
    description:
      "Find the maximum amount of money that can be robbed without robbing adjacent houses.",

    input:
      "Enter the money in each house.",

    output:
      "Print the maximum amount.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 2 3 1",
        expectedOutput: "4",
      },
      {
        input: "2 7 9 3 1",
        expectedOutput: "12",
      },
      {
        input: "2 1 1 2",
        expectedOutput: "4",
      },
    ],
  },

  "Coin Change": {
    description:
      "Find the minimum number of coins required to make a target amount.",

    input:
      "First line contains coin values. Second line contains amount.",

    output:
      "Print the minimum number of coins.",

    difficulty: "Medium",
    marks: 3,

    testCases: [
      {
        input: "1 2 5\n11",
        expectedOutput: "3",
      },
      {
        input: "2\n3",
        expectedOutput: "-1",
      },
      {
        input: "1 2 5\n5",
        expectedOutput: "1",
      },
    ],
  },

  /* =================================================
     HARD QUESTIONS
  ================================================= */

  "Longest Increasing Subsequence": {
    description:
      "Find the length of the longest strictly increasing subsequence.",

    input:
      "Enter an integer array.",

    output:
      "Print the length of the longest increasing subsequence.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "10 9 2 5 3 7 101 18",
        expectedOutput: "4",
      },
      {
        input: "0 1 0 3 2 3",
        expectedOutput: "4",
      },
      {
        input: "7 7 7 7",
        expectedOutput: "1",
      },
    ],
  },

  "Edit Distance": {
    description:
      "Find the minimum number of insertions, deletions and replacements required to convert one string into another.",

    input:
      "Enter two strings.",

    output:
      "Print the minimum edit distance.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "horse\nros",
        expectedOutput: "3",
      },
      {
        input: "intention\nexecution",
        expectedOutput: "5",
      },
      {
        input: "abc\nabc",
        expectedOutput: "0",
      },
    ],
  },

  "Longest Palindromic Substring": {
    description:
      "Find the longest palindromic substring in a given string.",

    input:
      "Enter a string.",

    output:
      "Print the longest palindromic substring.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "babad",
        expectedOutput: "bab",
      },
      {
        input: "cbbd",
        expectedOutput: "bb",
      },
      {
        input: "racecar",
        expectedOutput: "racecar",
      },
    ],
  },

  "Word Break": {
    description:
      "Determine whether a string can be segmented into words from a given dictionary.",

    input:
      "First line contains string. Second line contains dictionary words.",

    output:
      "Print true or false.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "leetcode\nleet code",
        expectedOutput: "true",
      },
      {
        input: "applepenapple\napple pen",
        expectedOutput: "true",
      },
      {
        input: "catsandog\ncats dog sand and cat",
        expectedOutput: "false",
      },
    ],
  },

  "Trapping Rain Water": {
    description:
      "Given heights of bars, calculate how much rain water can be trapped.",

    input:
      "Enter the height array.",

    output:
      "Print the total trapped water.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "0 1 0 2 1 0 1 3 2 1 2 1",
        expectedOutput: "6",
      },
      {
        input: "4 2 0 3 2 5",
        expectedOutput: "9",
      },
      {
        input: "1 2 3 4",
        expectedOutput: "0",
      },
    ],
  },

  "Minimum Path Sum": {
    description:
      "Find the minimum sum path from the top-left to bottom-right of a grid.",

    input:
      "Enter a grid of positive integers.",

    output:
      "Print the minimum path sum.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "1 3 1\n1 5 1\n4 2 1",
        expectedOutput: "7",
      },
      {
        input: "1 2 3\n4 5 6",
        expectedOutput: "12",
      },
      {
        input: "1 2\n1 1",
        expectedOutput: "3",
      },
    ],
  },

  "Number of Islands": {
    description:
      "Count the number of connected groups of land in a grid.",

    input:
      "Enter a binary grid.",

    output:
      "Print the number of islands.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "1 1 0 0\n1 0 0 1\n0 0 1 1",
        expectedOutput: "3",
      },
      {
        input: "1 1\n1 1",
        expectedOutput: "1",
      },
      {
        input: "0 0\n0 0",
        expectedOutput: "0",
      },
    ],
  },

  "Course Schedule": {
    description:
      "Determine whether all courses can be completed given prerequisite relationships.",

    input:
      "Enter number of courses and prerequisite pairs.",

    output:
      "Print true if all courses can be completed.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "2\n1 0",
        expectedOutput: "true",
      },
      {
        input: "2\n1 0\n0 1",
        expectedOutput: "false",
      },
      {
        input: "3\n1 0\n2 1",
        expectedOutput: "true",
      },
    ],
  },

  "Word Ladder": {
    description:
      "Find the shortest transformation sequence between two words.",

    input:
      "Enter begin word, end word and dictionary.",

    output:
      "Print the shortest transformation length.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "hit cog\nhot dot dog lot log cog",
        expectedOutput: "5",
      },
      {
        input: "a c\na b c",
        expectedOutput: "2",
      },
      {
        input: "hit cog\nhot dot dog",
        expectedOutput: "0",
      },
    ],
  },

  "LRU Cache": {
    description:
      "Implement a Least Recently Used cache with get and put operations.",

    input:
      "Enter cache operations.",

    output:
      "Print the results of get operations.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input:
          "capacity 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2",
        expectedOutput: "1 -1",
      },
      {
        input:
          "capacity 2\nput 1 10\nget 1\nput 2 20\nget 2",
        expectedOutput: "10 20",
      },
    ],
  },

  "Median of Two Sorted Arrays": {
    description:
      "Find the median of two sorted arrays.",

    input:
      "Enter two sorted arrays.",

    output:
      "Print the median.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "1 3\n2",
        expectedOutput: "2",
      },
      {
        input: "1 2\n3 4",
        expectedOutput: "2.5",
      },
      {
        input: "0 0\n0 0",
        expectedOutput: "0",
      },
    ],
  },

  "Regular Expression Matching": {
    description:
      "Determine whether a string matches a pattern containing . and * operators.",

    input:
      "Enter string and pattern.",

    output:
      "Print true or false.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
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
  },

  "Serialize Binary Tree": {
    description:
      "Serialize and deserialize a binary tree.",

    input:
      "Enter binary tree nodes.",

    output:
      "Print the serialized representation.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "1 2 3 null null 4 5",
        expectedOutput: "1,2,3,null,null,4,5",
      },
      {
        input: "1",
        expectedOutput: "1",
      },
      {
        input: "null",
        expectedOutput: "null",
      },
    ],
  },

  "Binary Tree Maximum Path Sum": {
    description:
      "Find the maximum path sum in a binary tree.",

    input:
      "Enter binary tree nodes.",

    output:
      "Print the maximum path sum.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "1 2 3",
        expectedOutput: "6",
      },
      {
        input: "-10 9 20 null null 15 7",
        expectedOutput: "42",
      },
      {
        input: "5",
        expectedOutput: "5",
      },
    ],
  },

  "Alien Dictionary": {
    description:
      "Determine the order of characters from a sorted dictionary of an alien language.",

    input:
      "Enter words in alien dictionary order.",

    output:
      "Print a valid character order.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "wrt wrf er ett rftt",
        expectedOutput: "wertf",
      },
      {
        input: "z x",
        expectedOutput: "zx",
      },
      {
        input: "z x z",
        expectedOutput: "",
      },
    ],
  },

  "Network Delay Time": {
    description:
      "Find the time required for all nodes to receive a signal.",

    input:
      "Enter weighted directed edges and source node.",

    output:
      "Print the network delay time.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "2\n2 1 1\n1",
        expectedOutput: "1",
      },
      {
        input: "3\n2 1 1\n2 3 1\n1",
        expectedOutput: "2",
      },
      {
        input: "3\n1 2 1\n2",
        expectedOutput: "-1",
      },
    ],
  },

  "Critical Connections": {
    description:
      "Find all critical connections in a network.",

    input:
      "Enter an undirected graph.",

    output:
      "Print the critical connections.",

    difficulty: "Hard",
    marks: 5,

    testCases: [
      {
        input: "4\n0 1\n1 2\n2 0\n1 3",
        expectedOutput: "1 3",
      },
      {
        input: "3\n0 1\n1 2",
        expectedOutput: "0 1\n1 2",
      },
    ],
  },
};


/*
====================================================
STARTER CODE GENERATOR
====================================================
*/

function getStarterCode(title, language) {

  const templates = {

    JavaScript: {
      default: `// ${title}

function solve(input) {
  // Write your solution here

  return "";
}

const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();

console.log(solve(input));`,
    },

    Python: {
      default: `# ${title}

def solve(input_data):
    # Write your solution here

    return ""


import sys

input_data = sys.stdin.read().strip()

print(solve(input_data))`,
    },

    Java: {
      default: `import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your solution here
    }
}`,
    },

    "C++": {
      default: `#include <bits/stdc++.h>
using namespace std;

int main() {

    // Write your solution here

    return 0;
}`,
    },
  };

  return templates[language].default;
}


/*
====================================================
UPDATE FUNCTION
====================================================
*/

async function updateQuestions() {

  try {

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const questions = await Question.find({
      type: "Coding",
    });

    console.log(
      `Found ${questions.length} coding questions.`
    );

    if (questions.length === 0) {
      console.log(
        "❌ No coding questions found."
      );

      process.exit(0);
    }

    let updated = 0;
    let matched = 0;

    for (const question of questions) {

      const data = questionData[question.title];

      if (!data) {

        console.log(
          `⚠️ No detailed data found for: ${question.title}`
        );

        /*
        Still add starter code so the question
        has an editor.
        */

        question.starterCode = {
          JavaScript: getStarterCode(
            question.title,
            "JavaScript"
          ),

          Python: getStarterCode(
            question.title,
            "Python"
          ),

          Java: getStarterCode(
            question.title,
            "Java"
          ),

          "C++": getStarterCode(
            question.title,
            "C++"
          ),
        };

        await question.save();

        updated++;

        continue;
      }

      matched++;

      question.description =
        data.description;

      question.input =
        data.input;

      question.output =
        data.output;

      question.difficulty =
        data.difficulty;

      question.marks =
        data.marks;

      question.testCases =
        data.testCases;

      question.starterCode = {

        JavaScript:
          getStarterCode(
            question.title,
            "JavaScript"
          ),

        Python:
          getStarterCode(
            question.title,
            "Python"
          ),

        Java:
          getStarterCode(
            question.title,
            "Java"
          ),

        "C++":
          getStarterCode(
            question.title,
            "C++"
          ),
      };

      await question.save();

      updated++;

      console.log(
        `✅ Updated: ${question.title}`
      );
    }

    console.log("\n================================");
    console.log("CODEIT UPDATE COMPLETED");
    console.log("================================");

    console.log(
      `Total coding questions: ${questions.length}`
    );

    console.log(
      `Questions with detailed data: ${matched}`
    );

    console.log(
      `Questions updated: ${updated}`
    );

    console.log("================================");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ Update error:",
      error.message
    );

    await mongoose.disconnect();

    process.exit(1);
  }
}


updateQuestions();