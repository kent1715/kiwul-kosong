@echo off
title Kiwul Qwen2509 EditPlus Proxy 9500
cd /d %~dp0

REM ---- Konfigurasi (override via env) ----
REM COMFYUI_URL       default http://127.0.0.1:8188
REM COMFYUI_INPUT_DIR default C:\ComfyUI\input
REM WORKFLOW_PATH     default ..\..\workflows\image_qwen_image_edit_2509.json

if not exist .venv (
    echo [setup] creating venv...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call .venv\Scripts\activate.bat
)

python -m uvicorn server:app --host 0.0.0.0 --port 9500
pause
