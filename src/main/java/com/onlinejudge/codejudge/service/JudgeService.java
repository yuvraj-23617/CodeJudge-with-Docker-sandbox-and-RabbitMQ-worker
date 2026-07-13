package com.onlinejudge.codejudge.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;

@Service
public class JudgeService {

    private static final String WORKSPACE_BASE = "/judge/workspace";
    private static final String VOLUME_NAME = "codejudge-judge-workspace";

    public String judge(String language, String code, String input,
                        String expectedOutput, Long submissionId, int testCaseIndex) {

        if ("python".equalsIgnoreCase(language)) {
            return judgePython(code, input, expectedOutput, submissionId, testCaseIndex);
        } else if ("java".equalsIgnoreCase(language)) {
            return judgeJava(code, input, expectedOutput, submissionId, testCaseIndex);
        } else if ("cpp".equalsIgnoreCase(language)) {
            return judgeCpp(code, input, expectedOutput, submissionId, testCaseIndex);
        }
        return "UNSUPPORTED_LANGUAGE";
    }

    private Path createSubmissionDir(Long submissionId, int testCaseIndex) throws IOException {
        Path base = Paths.get(WORKSPACE_BASE);
        if (!Files.exists(base)) {
            Files.createDirectories(base);
        }
        String dirName = "submission-" + submissionId + "-" + testCaseIndex + "-" + System.currentTimeMillis();
        Path subDir = base.resolve(dirName);
        Files.createDirectories(subDir);
        return subDir;
    }

    private void cleanupDir(Path dir) {
        if (dir == null || !Files.exists(dir)) return;
        try {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {}
                    });
        } catch (IOException ignored) {}
    }

    private String readProcessOutput(Process process) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString();
    }

    // ==================== PYTHON ====================
    private String judgePython(String code, String input, String expectedOutput,
                               Long submissionId, int testCaseIndex) {
        Path subDir = null;
        try {
            subDir = createSubmissionDir(submissionId, testCaseIndex);
            Path codeFile = subDir.resolve("solution.py");
            Files.writeString(codeFile, code);

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "-i", "--rm",
                    "--network=none",
                    "--memory=128m",
                    "--cpus=0.5",
                    "-v", VOLUME_NAME + ":" + WORKSPACE_BASE,
                    "python:3.11",
                    "python", WORKSPACE_BASE + "/" + subDir.getFileName() + "/solution.py"
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }

            boolean finished = process.waitFor(2, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();
            String output = readProcessOutput(process);

            if (exitCode != 0) {
                return "RUNTIME_ERROR";
            }

            return output.trim().equals(expectedOutput.trim()) ? "ACCEPTED" : "WRONG_ANSWER";

        } catch (Exception e) {
            return "RUNTIME_ERROR";
        } finally {
            cleanupDir(subDir);
        }
    }

    // ==================== JAVA ====================
    private String judgeJava(String code, String input, String expectedOutput,
                             Long submissionId, int testCaseIndex) {
        Path subDir = null;
        try {
            subDir = createSubmissionDir(submissionId, testCaseIndex);
            Path javaFile = subDir.resolve("Main.java");
            Files.writeString(javaFile, code);

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "-i", "--rm",
                    "--network=none",
                    "--memory=512m",
                    "--cpus=1.5",
                    "-v", VOLUME_NAME + ":" + WORKSPACE_BASE,
                    "eclipse-temurin:21",
                    "sh", "-c",
                    "cd " + WORKSPACE_BASE + "/" + subDir.getFileName() +
                            " && javac Main.java && java Main"
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();
            String output = readProcessOutput(process);

            if (exitCode != 0) {
                return "RUNTIME_ERROR";
            }

            return output.trim().equals(expectedOutput.trim()) ? "ACCEPTED" : "WRONG_ANSWER";

        } catch (Exception e) {
            return "RUNTIME_ERROR";
        } finally {
            cleanupDir(subDir);
        }
    }

    // ==================== C++ ====================
    private String judgeCpp(String code, String input, String expectedOutput,
                            Long submissionId, int testCaseIndex) {
        Path subDir = null;
        try {
            subDir = createSubmissionDir(submissionId, testCaseIndex);
            Path cppFile = subDir.resolve("main.cpp");
            Files.writeString(cppFile, code);

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run", "-i", "--rm",
                    "--network=none",
                    "--memory=512m",
                    "--cpus=1.5",
                    "-v", VOLUME_NAME + ":" + WORKSPACE_BASE,
                    "gcc:13",
                    "sh", "-c",
                    "cd " + WORKSPACE_BASE + "/" + subDir.getFileName() +
                            " && g++ main.cpp -o main && ./main"
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();
            String output = readProcessOutput(process);

            if (exitCode != 0) {
                return "RUNTIME_ERROR";
            }

            return output.trim().equals(expectedOutput.trim()) ? "ACCEPTED" : "WRONG_ANSWER";

        } catch (Exception e) {
            return "RUNTIME_ERROR";
        } finally {
            cleanupDir(subDir);
        }
    }
}