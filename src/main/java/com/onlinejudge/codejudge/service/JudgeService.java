package com.onlinejudge.codejudge.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
public class JudgeService {

    public String judge(
            String language,
            String code,
            String input,
            String expectedOutput) {

        if ("python".equalsIgnoreCase(language)) {
            return judgePython(code, input, expectedOutput);
        }

        if ("java".equalsIgnoreCase(language)) {
            return judgeJava(code, input, expectedOutput);
        }
        if ("cpp".equalsIgnoreCase(language)) {
            return judgeCpp(code, input, expectedOutput);
        }

        return "UNSUPPORTED_LANGUAGE";
    }

    public String executePython(String code) {

        try {

            Path tempFile = Files.createTempFile("solution", ".py");

            Files.writeString(tempFile, code);

            ProcessBuilder pb =
                    new ProcessBuilder(
                            "docker",
                            "run",
                            "-i",
                            "--rm",
                            "--network=none",
                            "--memory=128m",
                            "--cpus=0.5",
                            "-v",
                            tempFile.getParent().toString() + ":/code",
                            "python:3.11",
                            "python",
                            "/code/" + tempFile.getFileName()
                    );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            boolean finished =
                    process.waitFor(2, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            Files.deleteIfExists(tempFile);

            return output.toString();

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public String judgePython(
            String code,
            String input,
            String expectedOutput) {

        try {

            Path tempFile = Files.createTempFile("solution", ".py");

            Files.writeString(tempFile, code);

            ProcessBuilder pb =
                    new ProcessBuilder(
                            "docker",
                            "run",
                            "-i",
                            "--rm",
                            "--network=none",
                            "--memory=128m",
                            "--cpus=0.5",
                            "-v",
                            tempFile.getParent().toString() + ":/code",
                            "python:3.11",
                            "python",
                            "/code/" + tempFile.getFileName()
                    );

            pb.redirectErrorStream(true);

            Process process = pb.start();
            System.out.println("Docker started");

            BufferedWriter writer =
                    new BufferedWriter(
                            new OutputStreamWriter(process.getOutputStream()));

            writer.write(input);
            writer.flush();
            writer.close();

            boolean finished =
                    process.waitFor(2, TimeUnit.SECONDS);
            System.out.println("Finished = " + finished);

            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            if (exitCode != 0) {

                System.out.println("===== PYTHON ERROR =====");
                System.out.println(output.toString());
                System.out.println("========================");

                Files.deleteIfExists(tempFile);
                return "RUNTIME_ERROR";
            }

            String actualOutput = output.toString().trim();

            System.out.println("EXPECTED=[" + expectedOutput.trim() + "]");
            System.out.println("ACTUAL=[" + actualOutput + "]");
            System.out.println("EXIT CODE=" + exitCode);

            Files.deleteIfExists(tempFile);

            if (actualOutput.equals(expectedOutput.trim())) {
                return "ACCEPTED";
            }

            return "WRONG_ANSWER";

        } catch (Exception e) {
            e.printStackTrace();
            return "RUNTIME_ERROR";
        }
    }

    public String judgeJava(
            String code,
            String input,
            String expectedOutput) {

        try {

            Path tempDir = Files.createTempDirectory("java-solution");

            Path javaFile = tempDir.resolve("Main.java");

            Files.writeString(javaFile, code);

            ProcessBuilder pb =
                    new ProcessBuilder(
                            "docker",
                            "run",
                            "-i",
                            "--rm",
                            "--network=none",
                            "--memory=512m",
                            "--cpus=1.5",
                            "-v",
                            tempDir.toAbsolutePath() + ":/code",
                            "eclipse-temurin:21",
                            "sh",
                            "-c",
                            "cd /code && javac Main.java && java Main"
                    );

            pb.redirectErrorStream(true);

            Process process = pb.start();
            System.out.println("JAVA Docker started");

            BufferedWriter writer =
                    new BufferedWriter(
                            new OutputStreamWriter(
                                    process.getOutputStream()));

            writer.write(input);
            writer.flush();
            writer.close();

            boolean finished =
                    process.waitFor(30, TimeUnit.SECONDS);
            System.out.println("Finished = " + finished);

            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()));

            StringBuilder output =
                    new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            System.out.println("Exit Code = " + exitCode);
            System.out.println("Docker Output:");
            System.out.println(output.toString());
            System.out.println("JAVA Finished = " + finished);

            String actualOutput =
                    output.toString().trim();

            if (exitCode != 0) {
                return "RUNTIME_ERROR";
            }

            if (actualOutput.equals(
                    expectedOutput.trim())) {

                return "ACCEPTED";
            }

            return "WRONG_ANSWER";

        } catch (Exception e) {
            return "RUNTIME_ERROR";
        }
    }

    public String judgeCpp(
            String code,
            String input,
            String expectedOutput) {

        try {

            Path tempDir =
                    Files.createTempDirectory("cpp-solution");

            Path cppFile =
                    tempDir.resolve("main.cpp");

            Files.writeString(cppFile, code);

            ProcessBuilder pb =
                    new ProcessBuilder(
                            "docker",
                            "run",
                            "-i",
                            "--rm",
                            "--network=none",
                            "--memory=512m",
                            "--cpus=1.5",
                            "-v",
                            tempDir.toAbsolutePath() + ":/code",
                            "gcc:13",
                            "sh",
                            "-c",
                            "cd /code && g++ main.cpp -o main && ./main"
                    );

            pb.redirectErrorStream(true);

            Process process = pb.start();
            System.out.println("JAVA Docker started");

            BufferedWriter writer =
                    new BufferedWriter(
                            new OutputStreamWriter(
                                    process.getOutputStream()));

            writer.write(input);
            writer.flush();
            writer.close();

            boolean finished =
                    process.waitFor(30, TimeUnit.SECONDS);
            System.out.println("CPP Finished = " + finished);

            if (!finished) {
                process.destroyForcibly();
                return "TIME_LIMIT_EXCEEDED";
            }

            int exitCode = process.exitValue();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()));

            StringBuilder output =
                    new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            System.out.println("CPP Exit Code = " + exitCode);
            System.out.println("CPP Docker Output:");
            System.out.println(output.toString());

            String actualOutput =
                    output.toString().trim();

            if (exitCode != 0) {
                return "RUNTIME_ERROR";
            }

            if (actualOutput.equals(
                    expectedOutput.trim())) {

                return "ACCEPTED";
            }

            return "WRONG_ANSWER";

        } catch (Exception e) {
            return "RUNTIME_ERROR";
        }
    }
}