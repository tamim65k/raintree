IP Terminal App

This project is a small Vite + React frontend and Express backend that displays a Windows-terminal-like UI and shows your IP in green. It prefers to run the local IP_Rover tool if you place it under `tools/IP_Rover` (see below). On Windows PowerShell.

Quick steps:

1. Clone or copy IP_Rover into this repository under `tools/IP_Rover`.
   - Example (PowerShell):

    git clone https://github.com/Cyber-Dioxide/IP_Rover tools/IP_Rover

2. Install root deps and client deps:

    cd 'C:\Users\mythz\Desktop\New folder'
    npm install
    cd client; npm install

3. Start the servers (runs both server and client concurrently):

    npm run dev

Notes:
- The backend will try to run `python tools/IP_Rover/ip_rover.py`. Ensure Python is installed and available in PATH or set the `PYTHON` env var.
- If IP_Rover is not present, the server falls back to calling a public IP API (api.ipify.org).
