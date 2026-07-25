from app.executor import execute_python_code

def test_executor_pil_image_creation():
    code = """
from PIL import Image, ImageDraw
img = Image.new('RGB', (100, 100), color='red')
"""
    result = execute_python_code(code)
    assert result["status"] == "success"
    assert result["type"] == "pil_image"
    assert result["image_base64"] is not None
    assert result["width"] == 100
    assert result["height"] == 100

def test_executor_file_saving_gif():
    code = """
from PIL import Image
f1 = Image.new('RGB', (50, 50), 'blue')
f2 = Image.new('RGB', (50, 50), 'green')
f1.save('test.gif', save_all=True, append_images=[f2], duration=100, loop=0)
"""
    result = execute_python_code(code)
    assert result["status"] == "success"
    assert result["type"] == "file"
    assert result["mime_type"] == "image/gif"
    assert result["width"] == 50
    assert result["height"] == 50
