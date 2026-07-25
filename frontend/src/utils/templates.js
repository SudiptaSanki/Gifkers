export const DEFAULT_STATIC_CODE = `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(6, 4))
plt.plot(x, y, color='#3b82f6', linewidth=2)
plt.title("Sine Wave", color='white')
plt.grid(True, alpha=0.2)
plt.gca().set_facecolor('none')
plt.gcf().patch.set_facecolor('none')
plt.tick_params(colors='white')
plt.show()
`;

export const DEFAULT_GIF_CODE = `from PIL import Image, ImageDraw, ImageFont
import random

# Canvas settings
WIDTH, HEIGHT = 600, 400
BG_COLOR = (10, 10, 20)
TEXT_COLOR = (255, 255, 255)

FRAMES = 30
FLASHES_PER_FRAME = 60

# Try loading a font
try:
    font = ImageFont.truetype("arial.ttf", 60)
except:
    font = ImageFont.load_default()

frames = []

for frame in range(FRAMES):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Draw flashing lights
    for _ in range(FLASHES_PER_FRAME):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        radius = random.randint(3, 10)
        color = (
            random.randint(180, 255),
            random.randint(180, 255),
            random.randint(180, 255),
        )
        draw.ellipse(
            (x - radius, y - radius, x + radius, y + radius),
            fill=color,
        )

    # Draw text centered
    text = "Welcome to Gifkers"

    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except AttributeError:
        # Fallback for older PIL versions
        text_width, text_height = draw.textsize(text, font=font)

    tx = (WIDTH - text_width) // 2
    ty = (HEIGHT - text_height) // 2

    # Optional glow
    for offset in range(6, 0, -1):
        draw.text((tx - offset, ty), text, font=font, fill=(80, 180, 255))
        draw.text((tx + offset, ty), text, font=font, fill=(80, 180, 255))

    # Main text
    draw.text((tx, ty), text, font=font, fill=TEXT_COLOR)
    frames.append(img)

# Save GIF
frames[0].save(
    "welcome_flash.gif",
    save_all=True,
    append_images=frames[1:],
    duration=80,
    loop=0
)
print("Saved as welcome_flash.gif")
`;
