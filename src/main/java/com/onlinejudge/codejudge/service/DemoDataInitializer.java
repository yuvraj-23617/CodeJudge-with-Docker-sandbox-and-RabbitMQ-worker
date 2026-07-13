package com.onlinejudge.codejudge.service;

import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Profile("docker")
@Component
public class DemoDataInitializer implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    public DemoDataInitializer(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        if (problemRepository.count() > 0) {
            System.out.println("Demo data already present.");
            return;
        }

        // ============================================================
        // 1. ORIGINAL – Sum of Two Numbers
        // ============================================================
        Problem orig1 = new Problem();
        orig1.setTitle("Sum of Two Numbers");
        orig1.setDescription("Given two integers a and b, return their sum.");
        orig1.setDifficulty("Easy");
        orig1.setConstraints("1 ≤ a, b ≤ 10^9");
        orig1.setSampleInput("3 5");
        orig1.setSampleOutput("8");

        TestCase o1_t1 = new TestCase();
        o1_t1.setInput("3 5");
        o1_t1.setExpectedOutput("8");
        o1_t1.setHidden(false);
        o1_t1.setProblem(orig1);

        TestCase o1_t2 = new TestCase();
        o1_t2.setInput("10 7");
        o1_t2.setExpectedOutput("17");
        o1_t2.setHidden(false);
        o1_t2.setProblem(orig1);

        TestCase o1_t3 = new TestCase();
        o1_t3.setInput("0 0");
        o1_t3.setExpectedOutput("0");
        o1_t3.setHidden(false);
        o1_t3.setProblem(orig1);

        orig1.setTestCases(new ArrayList<>(List.of(o1_t1, o1_t2, o1_t3)));

        // ============================================================
        // 2. ORIGINAL – Even or Odd
        // ============================================================
        Problem orig2 = new Problem();
        orig2.setTitle("Even or Odd");
        orig2.setDescription("Given an integer n, print 'Even' if n is even, otherwise print 'Odd'.");
        orig2.setDifficulty("Easy");
        orig2.setConstraints("1 ≤ n ≤ 10^5");
        orig2.setSampleInput("4");
        orig2.setSampleOutput("Even");

        TestCase o2_t1 = new TestCase();
        o2_t1.setInput("4");
        o2_t1.setExpectedOutput("Even");
        o2_t1.setHidden(false);
        o2_t1.setProblem(orig2);

        TestCase o2_t2 = new TestCase();
        o2_t2.setInput("7");
        o2_t2.setExpectedOutput("Odd");
        o2_t2.setHidden(false);
        o2_t2.setProblem(orig2);

        TestCase o2_t3 = new TestCase();
        o2_t3.setInput("0");
        o2_t3.setExpectedOutput("Even");
        o2_t3.setHidden(false);
        o2_t3.setProblem(orig2);

        orig2.setTestCases(new ArrayList<>(List.of(o2_t1, o2_t2, o2_t3)));

        // ============================================================
        // 3. Two Sum Target (NEW)
        // ============================================================
        Problem p1 = new Problem();
        p1.setTitle("Two Sum Target");
        p1.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume exactly one solution.");
        p1.setDifficulty("Easy");
        p1.setConstraints("2 ≤ nums.length ≤ 10^4, -10^9 ≤ nums[i] ≤ 10^9, -10^9 ≤ target ≤ 10^9");
        p1.setSampleInput("4\n2 7 11 15\n9");
        p1.setSampleOutput("0 1");

        TestCase p1_t1 = new TestCase();
        p1_t1.setInput("4\n2 7 11 15\n9");
        p1_t1.setExpectedOutput("0 1");
        p1_t1.setHidden(false);
        p1_t1.setProblem(p1);

        TestCase p1_t2 = new TestCase();
        p1_t2.setInput("5\n3 2 4 8 1\n6");
        p1_t2.setExpectedOutput("1 2");
        p1_t2.setHidden(false);
        p1_t2.setProblem(p1);

        TestCase p1_t3 = new TestCase();
        p1_t3.setInput("6\n-3 4 3 90 10 -10\n0");
        p1_t3.setExpectedOutput("0 2");
        p1_t3.setHidden(true);
        p1_t3.setProblem(p1);

        TestCase p1_t4 = new TestCase();
        p1_t4.setInput("2\n1000000000 -1000000000\n0");
        p1_t4.setExpectedOutput("0 1");
        p1_t4.setHidden(true);
        p1_t4.setProblem(p1);

        p1.setTestCases(new ArrayList<>(List.of(p1_t1, p1_t2, p1_t3, p1_t4)));

        // ============================================================
        // 4. Valid Parentheses (NEW)
        // ============================================================
        Problem p2 = new Problem();
        p2.setTitle("Valid Parentheses");
        p2.setDescription("Given a string s containing just the characters '(', ')', '{', '}', '[', ']', determine if the input string is valid. Output YES if valid, else NO.");
        p2.setDifficulty("Easy");
        p2.setConstraints("1 ≤ s.length ≤ 10^4, s consists of parentheses only.");
        p2.setSampleInput("{[()]}");
        p2.setSampleOutput("YES");

        TestCase p2_t1 = new TestCase();
        p2_t1.setInput("{[()]}");
        p2_t1.setExpectedOutput("YES");
        p2_t1.setHidden(false);
        p2_t1.setProblem(p2);

        TestCase p2_t2 = new TestCase();
        p2_t2.setInput("([)]");
        p2_t2.setExpectedOutput("NO");
        p2_t2.setHidden(false);
        p2_t2.setProblem(p2);

        TestCase p2_t3 = new TestCase();
        p2_t3.setInput("(((((())))))");
        p2_t3.setExpectedOutput("YES");
        p2_t3.setHidden(true);
        p2_t3.setProblem(p2);

        TestCase p2_t4 = new TestCase();
        p2_t4.setInput("(");
        p2_t4.setExpectedOutput("NO");
        p2_t4.setHidden(true);
        p2_t4.setProblem(p2);

        p2.setTestCases(new ArrayList<>(List.of(p2_t1, p2_t2, p2_t3, p2_t4)));

        // ============================================================
        // 5. ORIGINAL – Factorial (MOVED HERE, below Valid Parentheses)
        // ============================================================
        Problem orig3 = new Problem();
        orig3.setTitle("Factorial");
        orig3.setDescription("Compute the factorial of a given non-negative integer n.");
        orig3.setDifficulty("Medium");
        orig3.setConstraints("0 ≤ n ≤ 12");
        orig3.setSampleInput("5");
        orig3.setSampleOutput("120");

        TestCase o3_t1 = new TestCase();
        o3_t1.setInput("5");
        o3_t1.setExpectedOutput("120");
        o3_t1.setHidden(false);
        o3_t1.setProblem(orig3);

        TestCase o3_t2 = new TestCase();
        o3_t2.setInput("0");
        o3_t2.setExpectedOutput("1");
        o3_t2.setHidden(false);
        o3_t2.setProblem(orig3);

        TestCase o3_t3 = new TestCase();
        o3_t3.setInput("3");
        o3_t3.setExpectedOutput("6");
        o3_t3.setHidden(false);
        o3_t3.setProblem(orig3);

        orig3.setTestCases(new ArrayList<>(List.of(o3_t1, o3_t2, o3_t3)));

        // ============================================================
        // 6. Longest Unique Substring (NEW)
        // ============================================================
        Problem p3 = new Problem();
        p3.setTitle("Longest Unique Substring");
        p3.setDescription("Given a string s, find the length of the longest substring without repeating characters.");
        p3.setDifficulty("Medium");
        p3.setConstraints("1 ≤ s.length ≤ 10^5, s consists of lowercase English letters.");
        p3.setSampleInput("abcabcbb");
        p3.setSampleOutput("3");

        TestCase p3_t1 = new TestCase();
        p3_t1.setInput("abcabcbb");
        p3_t1.setExpectedOutput("3");
        p3_t1.setHidden(false);
        p3_t1.setProblem(p3);

        TestCase p3_t2 = new TestCase();
        p3_t2.setInput("bbbbbb");
        p3_t2.setExpectedOutput("1");
        p3_t2.setHidden(false);
        p3_t2.setProblem(p3);

        TestCase p3_t3 = new TestCase();
        p3_t3.setInput("pwwkew");
        p3_t3.setExpectedOutput("3");
        p3_t3.setHidden(true);
        p3_t3.setProblem(p3);

        TestCase p3_t4 = new TestCase();
        p3_t4.setInput("abcdefghijklmnopqrstuvwxyz");
        p3_t4.setExpectedOutput("26");
        p3_t4.setHidden(true);
        p3_t4.setProblem(p3);

        p3.setTestCases(new ArrayList<>(List.of(p3_t1, p3_t2, p3_t3, p3_t4)));

        // ============================================================
        // 7. Kth Smallest Element (NEW)
        // ============================================================
        Problem p4 = new Problem();
        p4.setTitle("Kth Smallest Element");
        p4.setDescription("Given an array of integers and an integer k, find the kth smallest element in the array.");
        p4.setDifficulty("Medium");
        p4.setConstraints("1 ≤ k ≤ n ≤ 10^5, -10^9 ≤ arr[i] ≤ 10^9");
        p4.setSampleInput("6\n7 10 4 3 20 15\n3");
        p4.setSampleOutput("7");

        TestCase p4_t1 = new TestCase();
        p4_t1.setInput("6\n7 10 4 3 20 15\n3");
        p4_t1.setExpectedOutput("7");
        p4_t1.setHidden(false);
        p4_t1.setProblem(p4);

        TestCase p4_t2 = new TestCase();
        p4_t2.setInput("5\n5 4 3 2 1\n5");
        p4_t2.setExpectedOutput("5");
        p4_t2.setHidden(false);
        p4_t2.setProblem(p4);

        TestCase p4_t3 = new TestCase();
        p4_t3.setInput("7\n10 50 20 40 70 30 60\n1");
        p4_t3.setExpectedOutput("10");
        p4_t3.setHidden(true);
        p4_t3.setProblem(p4);

        TestCase p4_t4 = new TestCase();
        p4_t4.setInput("3\n100 50 200\n2");
        p4_t4.setExpectedOutput("100");
        p4_t4.setHidden(true);
        p4_t4.setProblem(p4);

        p4.setTestCases(new ArrayList<>(List.of(p4_t1, p4_t2, p4_t3, p4_t4)));

        // ============================================================
        // 8. Merge Intervals (NEW)
        // ============================================================
        Problem p5 = new Problem();
        p5.setTitle("Merge Intervals");
        p5.setDescription("Given a collection of intervals, merge all overlapping intervals. Output the number of merged intervals followed by each merged interval (space-separated).");
        p5.setDifficulty("Medium");
        p5.setConstraints("1 ≤ n ≤ 10^4, 0 ≤ start ≤ end ≤ 10^4");
        p5.setSampleInput("4\n1 3\n2 6\n8 10\n15 18");
        p5.setSampleOutput("3\n1 6\n8 10\n15 18");

        TestCase p5_t1 = new TestCase();
        p5_t1.setInput("4\n1 3\n2 6\n8 10\n15 18");
        p5_t1.setExpectedOutput("3\n1 6\n8 10\n15 18");
        p5_t1.setHidden(false);
        p5_t1.setProblem(p5);

        TestCase p5_t2 = new TestCase();
        p5_t2.setInput("3\n1 4\n4 5\n8 9");
        p5_t2.setExpectedOutput("2\n1 5\n8 9");
        p5_t2.setHidden(false);
        p5_t2.setProblem(p5);

        TestCase p5_t3 = new TestCase();
        p5_t3.setInput("2\n1 10\n2 3");
        p5_t3.setExpectedOutput("1\n1 10");
        p5_t3.setHidden(true);
        p5_t3.setProblem(p5);

        TestCase p5_t4 = new TestCase();
        p5_t4.setInput("5\n1 2\n3 4\n5 6\n7 8\n9 10");
        p5_t4.setExpectedOutput("5\n1 2\n3 4\n5 6\n7 8\n9 10");
        p5_t4.setHidden(true);
        p5_t4.setProblem(p5);

        p5.setTestCases(new ArrayList<>(List.of(p5_t1, p5_t2, p5_t3, p5_t4)));

        // ============================================================
        // 9. Binary Tree Height (NEW)
        // ============================================================
        Problem p6 = new Problem();
        p6.setTitle("Binary Tree Height");
        p6.setDescription("Given a binary tree represented in level order (with -1 for null), compute its height (number of nodes on the longest path from root to leaf). Return 0 for an empty tree.");
        p6.setDifficulty("Medium");
        p6.setConstraints("1 ≤ nodes ≤ 10^3");
        p6.setSampleInput("1 2 3 4 5 -1 -1");
        p6.setSampleOutput("3");

        TestCase p6_t1 = new TestCase();
        p6_t1.setInput("1 2 3 4 5 -1 -1");
        p6_t1.setExpectedOutput("3");
        p6_t1.setHidden(false);
        p6_t1.setProblem(p6);

        TestCase p6_t2 = new TestCase();
        p6_t2.setInput("1");
        p6_t2.setExpectedOutput("1");
        p6_t2.setHidden(false);
        p6_t2.setProblem(p6);

        TestCase p6_t3 = new TestCase();
        p6_t3.setInput("1 2 -1 3 -1 4 -1");
        p6_t3.setExpectedOutput("4");
        p6_t3.setHidden(true);
        p6_t3.setProblem(p6);

        TestCase p6_t4 = new TestCase();
        p6_t4.setInput("-1");
        p6_t4.setExpectedOutput("0");
        p6_t4.setHidden(true);
        p6_t4.setProblem(p6);

        p6.setTestCases(new ArrayList<>(List.of(p6_t1, p6_t2, p6_t3, p6_t4)));

        // ============================================================
        // 10. Minimum Coins (NEW)
        // ============================================================
        Problem p7 = new Problem();
        p7.setTitle("Minimum Coins");
        p7.setDescription("Given a set of coin denominations and an amount, find the minimum number of coins needed to make that amount. Return -1 if not possible.");
        p7.setDifficulty("Medium");
        p7.setConstraints("1 ≤ coins.length ≤ 10^4, amount ≤ 10^4");
        p7.setSampleInput("3\n1 2 5\n11");
        p7.setSampleOutput("3");

        TestCase p7_t1 = new TestCase();
        p7_t1.setInput("3\n1 2 5\n11");
        p7_t1.setExpectedOutput("3");
        p7_t1.setHidden(false);
        p7_t1.setProblem(p7);

        TestCase p7_t2 = new TestCase();
        p7_t2.setInput("2\n2 4\n7");
        p7_t2.setExpectedOutput("-1");
        p7_t2.setHidden(false);
        p7_t2.setProblem(p7);

        TestCase p7_t3 = new TestCase();
        p7_t3.setInput("4\n1 3 4 5\n7");
        p7_t3.setExpectedOutput("2");
        p7_t3.setHidden(true);
        p7_t3.setProblem(p7);

        TestCase p7_t4 = new TestCase();
        p7_t4.setInput("3\n5 10 20\n40");
        p7_t4.setExpectedOutput("2");
        p7_t4.setHidden(true);
        p7_t4.setProblem(p7);

        p7.setTestCases(new ArrayList<>(List.of(p7_t1, p7_t2, p7_t3, p7_t4)));

        // ============================================================
        // 11. Shortest Path in Unweighted Graph (NEW)
        // ============================================================
        Problem p8 = new Problem();
        p8.setTitle("Shortest Path in Unweighted Graph");
        p8.setDescription("Given an unweighted undirected graph with n nodes and m edges, find the length of the shortest path from node 1 to node n. Output -1 if no path exists.");
        p8.setDifficulty("Hard");
        p8.setConstraints("2 ≤ n ≤ 10^5, 0 ≤ m ≤ 10^5");
        p8.setSampleInput("5 5\n1 2\n2 3\n3 5\n1 4\n4 5");
        p8.setSampleOutput("2");

        TestCase p8_t1 = new TestCase();
        p8_t1.setInput("5 5\n1 2\n2 3\n3 5\n1 4\n4 5");
        p8_t1.setExpectedOutput("2");
        p8_t1.setHidden(false);
        p8_t1.setProblem(p8);

        TestCase p8_t2 = new TestCase();
        p8_t2.setInput("4 2\n1 2\n3 4");
        p8_t2.setExpectedOutput("-1");
        p8_t2.setHidden(false);
        p8_t2.setProblem(p8);

        TestCase p8_t3 = new TestCase();
        p8_t3.setInput("6 7\n1 2\n2 3\n3 6\n1 4\n4 5\n5 6\n2 5");
        p8_t3.setExpectedOutput("3");
        p8_t3.setHidden(true);
        p8_t3.setProblem(p8);

        TestCase p8_t4 = new TestCase();
        p8_t4.setInput("2 1\n1 2");
        p8_t4.setExpectedOutput("1");
        p8_t4.setHidden(true);
        p8_t4.setProblem(p8);

        p8.setTestCases(new ArrayList<>(List.of(p8_t1, p8_t2, p8_t3, p8_t4)));

        // ============================================================
        // 12. Search in Rotated Sorted Array (NEW)
        // ============================================================
        Problem p9 = new Problem();
        p9.setTitle("Search in Rotated Sorted Array");
        p9.setDescription("Given a rotated sorted array of unique elements and a target, return the index of target, or -1 if not found.");
        p9.setDifficulty("Hard");
        p9.setConstraints("1 ≤ n ≤ 10^5, -10^9 ≤ target ≤ 10^9");
        p9.setSampleInput("7\n4 5 6 7 0 1 2\n0");
        p9.setSampleOutput("4");

        TestCase p9_t1 = new TestCase();
        p9_t1.setInput("7\n4 5 6 7 0 1 2\n0");
        p9_t1.setExpectedOutput("4");
        p9_t1.setHidden(false);
        p9_t1.setProblem(p9);

        TestCase p9_t2 = new TestCase();
        p9_t2.setInput("7\n4 5 6 7 0 1 2\n3");
        p9_t2.setExpectedOutput("-1");
        p9_t2.setHidden(false);
        p9_t2.setProblem(p9);

        TestCase p9_t3 = new TestCase();
        p9_t3.setInput("1\n5\n5");
        p9_t3.setExpectedOutput("0");
        p9_t3.setHidden(true);
        p9_t3.setProblem(p9);

        TestCase p9_t4 = new TestCase();
        p9_t4.setInput("5\n6 7 1 2 4\n6");
        p9_t4.setExpectedOutput("0");
        p9_t4.setHidden(true);
        p9_t4.setProblem(p9);

        p9.setTestCases(new ArrayList<>(List.of(p9_t1, p9_t2, p9_t3, p9_t4)));

        // ============================================================
        // SAVE ALL 12 PROBLEMS IN THE NEW ORDER
        // ============================================================
        problemRepository.saveAll(List.of(
                orig1, orig2, p1, p2, orig3,
                p3, p4, p5, p6, p7, p8, p9
        ));

        System.out.println("✅ 12 demo problems inserted successfully!");
        System.out.println("   (Order: Sum, Even, TwoSum, ValidParens, Factorial, LongestUniq, Kth, Merge, TreeHeight, Coins, ShortestPath, Rotated)");
    }
}