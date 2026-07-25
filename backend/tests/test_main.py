from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data

def test_generate_valid_matplotlib_code():
    code = """
import matplotlib.pyplot as plt
plt.figure()
plt.plot([1, 2], [3, 4])
plt.show()
"""
    response = client.post("/api/generate", json={"code": code})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["image_base64"] is not None
    assert data["mime_type"] == "image/png"

def test_generate_forbidden_import_security():
    code = "import subprocess\nsubprocess.run(['ls'])"
    response = client.post("/api/generate", json={"code": code})
    assert response.status_code == 400
    assert "Security Error" in response.json()["detail"]

def test_generate_invalid_syntax_error():
    code = "def broken_func("
    response = client.post("/api/generate", json={"code": code})
    assert response.status_code == 400
    assert "Execution Error" in response.json()["detail"]
