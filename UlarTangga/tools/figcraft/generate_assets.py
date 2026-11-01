import os
import json
import subprocess

OUTPUT_DIR = "/root/Game/UlarTangga/public/img/assets"
TEMP_DIR = "/tmp/figcraft_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# SVG Icons
CROWN_PATH = "M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"
HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
FLAME_PATH = "M12 23c-4.97 0-9-4.03-9-9 0-4.5 3-7.5 5-11 1.5 2.5 3 4 3 6 1.5-1.5 2-3 2-4 3 3.5 5 6.5 5 9 0 4.97-4.03 9-9 9z"
DIAMOND_PATH = "M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 10v6.68L5.44 10H11zm2 0h5.56L13 16.68V10zm3.8-2h-2.55l-1.5-3h2.79l1.26 3zm-9.35 0L6.19 5h2.79l-1.5 3H7.45z"

# 1. Ayang Ganteng Badge
script_ganteng = [
    {
        "command": "frame.create",
        "params": {
            "name": "Avatar_Ayang_Ganteng",
            "width": 256,
            "height": 256,
            "x": 0,
            "y": 0,
            "props": {
                "fills": [{"type": "solid", "color": [0.08, 0.16, 0.32, 1.0]}],
                "cornerRadius": 64,
                "strokes": [{"type": "solid", "color": [0.38, 0.72, 1.0, 1.0]}],
                "strokeWeight": 6
            }
        }
    },
    {
        "command": "shape.rectangle",
        "params": {
            "parent": 2,
            "x": 16,
            "y": 16,
            "width": 224,
            "height": 224,
            "props": {
                "fills": [{"type": "solid", "color": [0.12, 0.24, 0.52, 0.5]}],
                "cornerRadius": 48
            }
        }
    },
    {
        "command": "vector.create",
        "params": {
            "parent": 2,
            "name": "CrownIcon",
            "path": CROWN_PATH,
            "x": 88,
            "y": 38,
            "width": 80,
            "height": 72,
            "props": {
                "fills": [{"type": "solid", "color": [1.0, 0.82, 0.1, 1.0]}],
                "strokes": [{"type": "solid", "color": [1.0, 0.95, 0.6, 1.0]}],
                "strokeWeight": 1.5
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "AYANG GANTENG",
            "x": 26,
            "y": 138,
            "props": {
                "fontSize": 20,
                "fills": [{"type": "solid", "color": [1.0, 1.0, 1.0, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "PEMAIN 1 💙",
            "x": 76,
            "y": 178,
            "props": {
                "fontSize": 15,
                "fills": [{"type": "solid", "color": [0.55, 0.85, 1.0, 1.0]}]
            }
        }
    }
]

# 2. Ayang Cantik Badge
script_cantik = [
    {
        "command": "frame.create",
        "params": {
            "name": "Avatar_Ayang_Cantik",
            "width": 256,
            "height": 256,
            "x": 0,
            "y": 0,
            "props": {
                "fills": [{"type": "solid", "color": [0.42, 0.08, 0.22, 1.0]}],
                "cornerRadius": 64,
                "strokes": [{"type": "solid", "color": [1.0, 0.55, 0.75, 1.0]}],
                "strokeWeight": 6
            }
        }
    },
    {
        "command": "shape.rectangle",
        "params": {
            "parent": 2,
            "x": 16,
            "y": 16,
            "width": 224,
            "height": 224,
            "props": {
                "fills": [{"type": "solid", "color": [0.65, 0.15, 0.38, 0.5]}],
                "cornerRadius": 48
            }
        }
    },
    {
        "command": "vector.create",
        "params": {
            "parent": 2,
            "name": "HeartIcon",
            "path": HEART_PATH,
            "x": 88,
            "y": 38,
            "width": 80,
            "height": 72,
            "props": {
                "fills": [{"type": "solid", "color": [1.0, 0.32, 0.58, 1.0]}],
                "strokes": [{"type": "solid", "color": [1.0, 0.85, 0.95, 1.0]}],
                "strokeWeight": 1.5
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "AYANG CANTIK",
            "x": 38,
            "y": 138,
            "props": {
                "fontSize": 20,
                "fills": [{"type": "solid", "color": [1.0, 1.0, 1.0, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "PEMAIN 2 💖",
            "x": 76,
            "y": 178,
            "props": {
                "fontSize": 15,
                "fills": [{"type": "solid", "color": [1.0, 0.8, 0.9, 1.0]}]
            }
        }
    }
]

# 3. Card Truth Couple
script_truth = [
    {
        "command": "frame.create",
        "params": {
            "name": "Card_Truth",
            "width": 320,
            "height": 460,
            "x": 0,
            "y": 0,
            "props": {
                "fills": [{"type": "solid", "color": [0.98, 0.96, 1.0, 1.0]}],
                "cornerRadius": 28,
                "strokes": [{"type": "solid", "color": [0.65, 0.32, 0.88, 1.0]}],
                "strokeWeight": 5
            }
        }
    },
    {
        "command": "shape.rectangle",
        "params": {
            "parent": 2,
            "x": 16,
            "y": 16,
            "width": 288,
            "height": 428,
            "props": {
                "fills": [{"type": "solid", "color": [0.94, 0.88, 1.0, 0.4]}],
                "cornerRadius": 20,
                "strokes": [{"type": "solid", "color": [0.75, 0.45, 0.95, 0.5]}],
                "strokeWeight": 2
            }
        }
    },
    {
        "command": "vector.create",
        "params": {
            "parent": 2,
            "name": "DiamondIcon",
            "path": DIAMOND_PATH,
            "x": 120,
            "y": 60,
            "width": 80,
            "height": 80,
            "props": {
                "fills": [{"type": "solid", "color": [0.62, 0.28, 0.85, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "TRUTH",
            "x": 88,
            "y": 170,
            "props": {
                "fontSize": 38,
                "fills": [{"type": "solid", "color": [0.45, 0.15, 0.68, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "KEJUJURAN HATI",
            "x": 78,
            "y": 230,
            "props": {
                "fontSize": 16,
                "fills": [{"type": "solid", "color": [0.6, 0.3, 0.8, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "Curhat & Rahasia Pasangan",
            "x": 55,
            "y": 360,
            "props": {
                "fontSize": 14,
                "fills": [{"type": "solid", "color": [0.5, 0.4, 0.6, 1.0]}]
            }
        }
    }
]

# 4. Card Dare Couple
script_dare = [
    {
        "command": "frame.create",
        "params": {
            "name": "Card_Dare",
            "width": 320,
            "height": 460,
            "x": 0,
            "y": 0,
            "props": {
                "fills": [{"type": "solid", "color": [1.0, 0.96, 0.97, 1.0]}],
                "cornerRadius": 28,
                "strokes": [{"type": "solid", "color": [0.92, 0.25, 0.42, 1.0]}],
                "strokeWeight": 5
            }
        }
    },
    {
        "command": "shape.rectangle",
        "params": {
            "parent": 2,
            "x": 16,
            "y": 16,
            "width": 288,
            "height": 428,
            "props": {
                "fills": [{"type": "solid", "color": [1.0, 0.88, 0.9, 0.4]}],
                "cornerRadius": 20,
                "strokes": [{"type": "solid", "color": [0.95, 0.45, 0.55, 0.5]}],
                "strokeWeight": 2
            }
        }
    },
    {
        "command": "vector.create",
        "params": {
            "parent": 2,
            "name": "FlameIcon",
            "path": FLAME_PATH,
            "x": 124,
            "y": 60,
            "width": 72,
            "height": 82,
            "props": {
                "fills": [{"type": "solid", "color": [0.95, 0.25, 0.35, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "DARE",
            "x": 105,
            "y": 170,
            "props": {
                "fontSize": 38,
                "fills": [{"type": "solid", "color": [0.85, 0.15, 0.28, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "TANTANGAN MESRA",
            "x": 72,
            "y": 230,
            "props": {
                "fontSize": 16,
                "fills": [{"type": "solid", "color": [0.85, 0.25, 0.38, 1.0]}]
            }
        }
    },
    {
        "command": "text.create",
        "params": {
            "parent": 2,
            "text": "Aksi Seru & Romantis",
            "x": 80,
            "y": 360,
            "props": {
                "fontSize": 14,
                "fills": [{"type": "solid", "color": [0.65, 0.35, 0.4, 1.0]}]
            }
        }
    }
]

assets = [
    ("avatar_ayang_ganteng", script_ganteng),
    ("avatar_ayang_cantik", script_cantik),
    ("card_truth_couple", script_truth),
    ("card_dare_couple", script_dare)
]

for name, script in assets:
    json_path = f"{TEMP_DIR}/{name}.json"
    fig_path = f"{TEMP_DIR}/{name}.figcraft"
    png_path = f"{OUTPUT_DIR}/{name}.png"
    svg_path = f"{OUTPUT_DIR}/{name}.svg"

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(script, f, indent=2)

    res = subprocess.run(["figcraft-cli", "run", json_path, "--out", fig_path], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error running {name}: {res.stderr}")
        continue

    subprocess.run(["figcraft-cli", "export", fig_path, "-o", png_path, "--scale", "2"], capture_output=True)
    subprocess.run(["figcraft-cli", "export", fig_path, "-o", svg_path, "--format", "svg"], capture_output=True)
    print(f"Generated: {name}.png & {name}.svg")

print("All FigCraft vector assets generated successfully!")
