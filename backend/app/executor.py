import io
import os
import glob
import base64
import tempfile
import mimetypes
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server environment
import matplotlib.pyplot as plt
from PIL import Image, ImageFont
from app.security import analyze_code_security

# Patch ImageFont.truetype for cross-platform font resolution (e.g. Linux font paths on Windows/Docker)
_orig_truetype = ImageFont.truetype

def _safe_truetype(font, size=10, *args, **kwargs):
    try:
        return _orig_truetype(font, size, *args, **kwargs)
    except (OSError, IOError):
        fallbacks = [
            "arialbd.ttf",
            "arial.ttf",
            "calibri.ttf",
            "C:\\Windows\\Fonts\\arialbd.ttf",
            "C:\\Windows\\Fonts\\arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "DejaVuSans-Bold.ttf",
            "DejaVuSans.ttf"
        ]
        for fb in fallbacks:
            try:
                return _orig_truetype(fb, size, *args, **kwargs)
            except (OSError, IOError):
                continue
        return ImageFont.load_default()

ImageFont.truetype = _safe_truetype

# Legacy Pillow attribute compatibility
if not hasattr(Image, 'MEDIANCUT'):
    Image.MEDIANCUT = getattr(getattr(Image, 'Quantize', None), 'MEDIANCUT', 0)
if not hasattr(Image, 'NONE'):
    Image.NONE = getattr(getattr(Image, 'Dither', None), 'NONE', 0)
if not hasattr(Image, 'BILINEAR'):
    Image.BILINEAR = getattr(getattr(Image, 'Resampling', None), 'BILINEAR', 2)

def execute_python_code(code: str) -> dict:
    """
    Executes user Python code inside an isolated temporary working directory.
    Captures generated images/GIFs on disk, Matplotlib plots, or PIL Image variables.
    """
    # 1. Run security AST inspection
    analyze_code_security(code)

    plt.close('all')
    orig_cwd = os.getcwd()

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            os.chdir(temp_dir)
            
            # Unified execution scope so functions can reference each other smoothly
            exec_scope = {"__name__": "__main__"}
            exec(code, exec_scope)

            # A. Check for files written to disk (.gif, .png, .jpg, .jpeg, .webp)
            supported_exts = ['*.gif', '*.png', '*.jpg', '*.jpeg', '*.webp']
            output_files = []
            for ext in supported_exts:
                output_files.extend(glob.glob(os.path.join(temp_dir, ext)))
                output_files.extend(glob.glob(os.path.join(temp_dir, ext.upper())))

            if output_files:
                newest_file = max(output_files, key=os.path.getmtime)
                mime_type, _ = mimetypes.guess_type(newest_file)
                if not mime_type:
                    mime_type = "image/gif" if newest_file.endswith(".gif") else "image/png"

                det_w, det_h = 500, 500
                try:
                    with Image.open(newest_file) as test_img:
                        det_w, det_h = test_img.size
                except Exception:
                    pass

                with open(newest_file, "rb") as f:
                    img_str = base64.b64encode(f.read()).decode('utf-8')

                return {
                    "status": "success",
                    "type": "file",
                    "mime_type": mime_type,
                    "image_base64": img_str,
                    "width": det_w,
                    "height": det_h
                }

            # B. Check for Matplotlib plots
            fig = plt.gcf()
            if fig and fig.get_axes():
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight', dpi=300, transparent=True)
                buffer.seek(0)

                det_w, det_h = 800, 600
                try:
                    with Image.open(buffer) as test_img:
                        det_w, det_h = test_img.size
                except Exception:
                    pass
                buffer.seek(0)

                img_str = base64.b64encode(buffer.read()).decode('utf-8')
                plt.close('all')
                return {
                    "status": "success",
                    "type": "plot",
                    "mime_type": "image/png",
                    "image_base64": img_str,
                    "width": det_w,
                    "height": det_h
                }

            # C. Check for PIL Image or list of PIL Images in memory variables
            for var_name, var_val in exec_scope.items():
                if var_name.startswith("__"):
                    continue
                if isinstance(var_val, list) and len(var_val) > 0 and isinstance(var_val[0], Image.Image):
                    buffer = io.BytesIO()
                    var_val[0].save(buffer, format='GIF', save_all=True, append_images=var_val[1:], duration=80, loop=0)
                    buffer.seek(0)
                    img_str = base64.b64encode(buffer.read()).decode('utf-8')
                    return {
                        "status": "success",
                        "type": "pil_gif",
                        "mime_type": "image/gif",
                        "image_base64": img_str,
                        "width": var_val[0].width,
                        "height": var_val[0].height
                    }
                elif isinstance(var_val, Image.Image):
                    buffer = io.BytesIO()
                    var_val.save(buffer, format='PNG')
                    buffer.seek(0)
                    img_str = base64.b64encode(buffer.read()).decode('utf-8')
                    return {
                        "status": "success",
                        "type": "pil_image",
                        "mime_type": "image/png",
                        "image_base64": img_str,
                        "width": var_val.width,
                        "height": var_val.height
                    }

            return {"status": "success", "type": "code_only", "image_base64": None, "width": 800, "height": 800}

        finally:
            os.chdir(orig_cwd)
