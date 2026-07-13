============================================================
  CodeJudge – One‑Click Start for Your Mentor
============================================================

Thank you for reviewing my CodeJudge project!

This package is designed to run with a single double‑click.
You don't need IntelliJ, Java, PostgreSQL, or RabbitMQ
installed locally – everything runs inside Docker.

------------------------------------------------------------
  PREREQUISITES
------------------------------------------------------------

1. Install Docker Desktop:
   https://www.docker.com/products/docker-desktop/

2. Start Docker Desktop and wait for the whale icon to
   appear in your system tray (it means the daemon is ready).

------------------------------------------------------------
  HOW TO START
------------------------------------------------------------

1. Unzip this folder anywhere on your computer.

2. Double‑click START_CODEJUDGE.bat

3. Wait 3‑5 minutes for the first run (Docker is building
   the images). The browser will open automatically.

4. You're ready!

------------------------------------------------------------
  CREDENTIALS
------------------------------------------------------------

Admin account (created automatically):
  Username: admin
  Password: admin123

For normal users, click "create account" and register
with any username/email/password.

------------------------------------------------------------
  HOW TO STOP
------------------------------------------------------------

Double‑click STOP_CODEJUDGE.bat

------------------------------------------------------------
  WHAT'S INSIDE
------------------------------------------------------------

- 3 pre‑loaded demo problems with test cases
- Python, Java, and C++ support
- Submissions run inside isolated Docker containers
- Submission history is stored in your browser's localStorage

------------------------------------------------------------
  TROUBLESHOOTING
------------------------------------------------------------

If the browser doesn't open:
  → Manually open http://localhost:8081

If you see port conflicts:
  → Close other apps using ports 8080 or 8081

If submissions fail:
  → Check that Docker Desktop is running
  → Run docker compose logs backend to see errors

For any other issues, please contact me directly.

Enjoy!