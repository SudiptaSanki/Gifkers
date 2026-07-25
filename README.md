# Gifkers - Python Code & Visual Sticker Generator

<p align="center">
  <img src="frontend/public/favicon.svg" width="100" height="100" alt="Gifkers Logo" />
</p>

<p align="center">
  <b>Turn Python code snippets and visual outputs into high-resolution framed stickers and animated GIFs.</b>
</p>

<p align="center">
  <a href="https://github.com/SudiptaSanki/Gifkers/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-v4.0+-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Hugging%20Face-Spaces-FFD21E?logo=huggingface&logoColor=black" alt="Hugging Face Spaces">
</p>

---

## 🚀 System Architecture

The application runs as a local monorepo connecting a modern React frontend with an isolated Python FastAPI execution sandbox backend.

```mermaid
graph TD
    User([User]) -->|Inputs Python Code| Editor[Monaco Code Editor]
    User -->|Selects Size / Preset| Controls[Control Panel Toolbar]
    
    Editor -->|POST /api/generate| Backend[FastAPI Server :8000]
    
    subgraph Execution Sandbox
        Backend --> AST[AST Security Analyzer]
        AST -->|Validates Imports| Sandbox[Isolated Temp Directory]
        Sandbox -->|Executes Code| CPython[CPython Runtime]
        CPython --> FontPatch[Cross-Platform Font Resolver]
        CPython --> Capture[Output Detector]
        Capture -->|Disk Files .gif, .png| Detect[Image & Frame Inspector]
        Capture -->|Matplotlib Plots| Detect
        Capture -->|PIL Image Objects| Detect
    end
    
    Detect -->|Base64 Data + Dimensions| Response[JSON API Response]
    Response -->|Base64 Image Payload| Preview[Frame Canvas Preview]
    
    Controls -->|Direct Download| Download[Export Generator]
    Download -->|Default| Raw[Raw Sticker / GIF File]
    Download -->|Optional| Card[Framed Mockup Card PNG/JPEG/SVG]
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`/frontend`)
| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI component framework |
| **Vite 6** | Fast development server & production bundler |
| **TailwindCSS v4** | Modern responsive dark theme styling |
| **Monaco Editor** | VS Code-powered interactive Python code editor |
| **Axios** | HTTP API client for backend communication |
| **html-to-image** | High-DPI DOM canvas rendering helper |
| **Lucide React** | Sleek UI icon set |

### Backend (`/backend`)
| Dependency | Purpose |
| :--- | :--- |
| **FastAPI & Uvicorn** | High-performance Python REST API server |
| **Pillow (PIL)** | Image creation, manipulation, and animated GIF compilation |
| **Matplotlib & Seaborn** | Data visualization plotting and chart rendering |
| **OpenCV (`opencv-python`)** | Image processing & computer vision code support |
| **NumPy** | Numerical array computations for procedural graphics |
| **Pytest** | Automated unit & integration testing suite |

---

## ⚡ Quick Start (Smart One-Click Launcher)

This repository includes a **Smart `run.bat` Script** designed for seamless local execution:

1. Clone the repository:
   ```bash
   git clone https://github.com/SudiptaSanki/Gifkers.git
   cd Gifkers
   ```
2. Double-click **`run.bat`**.

### How `run.bat` Works:
- **First Run**: Automatically detects missing dependencies, creates Python `.venv`, installs backend packages, and installs frontend `node_modules`.
- **Subsequent Runs**: Detects existing installations, **skips re-installation**, and launches both backend & frontend servers instantly in your default browser!

---

## 🧪 Testing

Run the automated backend test suite:
```bash
cd backend
python -m pytest -v --tb=short
```

---

## 🚀 Deployment Options

### Backend Hosting: Hugging Face Spaces (100% Free Docker)
The backend container is specified in `backend/Dockerfile`.

1. Create a free Space on [Hugging Face Spaces](https://huggingface.co/new-space) with **Docker** SDK (`app_port: 8000`).
2. Add your `HF_TOKEN` and `HF_SPACE` secrets to your GitHub repository.
3. Every push to `main` automatically deploys zero-downtime Docker instances via `.github/workflows/deploy-huggingface.yml`.

---

## 📄 License
This repository is licensed under the [MIT License](LICENSE).
