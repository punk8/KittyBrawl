#!/usr/bin/env python3
"""Slice and chroma-key a fixed-grid pixel-art tileset.

Unlike the sprite animation processor, this keeps every tile at its original
cell size. It does not auto-crop, auto-center, or resize tile contents.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image


DEFAULT_TILE_INFO = [
    ("ground_center", "solid", "Default cracked stone floor with dirt fill."),
    ("floating_platform_short", "platform", "Short floating platform segment."),
    ("ground_left_corner", "solid", "Left ledge or vertical ground corner."),
    ("ground_right_corner", "solid", "Right ledge or vertical ground corner."),
    ("left_wall_corner", "solid", "Left wall and floor corner with dirt fill."),
    ("right_wall_corner", "solid", "Right wall and floor corner with dirt fill."),
    ("floating_platform_center", "platform", "Floating platform center segment."),
    ("floating_platform_variant", "platform", "Floating platform variant with drips."),
    ("stone_wall", "solid", "Plain stone wall face."),
    ("cracked_wall", "solid", "Cracked stone wall face with small crystal."),
    ("dirt_bone_fill", "solid", "Underground dirt/rubble fill with bone details."),
    ("slime_wall", "solid", "Mossy or slimy wall face."),
    ("crystal_wall", "solid", "Stone wall with purple crystal cluster."),
    ("bone_skull_fill", "solid", "Dirt fill with bones and skull."),
    ("crystal_rock_fill", "solid", "Rocky fill with embedded purple crystals."),
    ("dark_stone_fill", "solid", "Dark repeatable stone or dirt fill."),
]


def parse_hex_color(value: str) -> tuple[int, int, int]:
    text = value.strip().lstrip("#")
    if len(text) != 6:
        raise argparse.ArgumentTypeError("Expected a 6-digit hex color, like #FF00FF.")
    try:
        return tuple(int(text[index : index + 2], 16) for index in (0, 2, 4))
    except ValueError as exc:
        raise argparse.ArgumentTypeError("Expected a valid hex color.") from exc


def key_to_alpha(img: Image.Image, key: tuple[int, int, int], threshold: float) -> Image.Image:
    rgba = img.convert("RGBA")
    data = np.array(rgba)
    rgb = data[:, :, :3].astype(np.int32)
    key_arr = np.array(key, dtype=np.int32)
    dist = np.sqrt(np.sum((rgb - key_arr) ** 2, axis=2))
    mask = dist <= threshold
    data[mask, 0:3] = 0
    data[mask, 3] = 0
    return Image.fromarray(data, mode="RGBA")


def clean_key_fringe(
    img: Image.Image,
    key: tuple[int, int, int],
    threshold: float,
    passes: int,
) -> Image.Image:
    if passes <= 0:
        return img
    data = np.array(img.convert("RGBA"))
    key_arr = np.array(key, dtype=np.int32)
    for _ in range(passes):
        alpha = data[:, :, 3]
        visible = alpha > 0
        transparent = alpha == 0
        adjacent_transparent = np.zeros_like(transparent)
        adjacent_transparent[:-1, :] |= transparent[1:, :]
        adjacent_transparent[1:, :] |= transparent[:-1, :]
        adjacent_transparent[:, :-1] |= transparent[:, 1:]
        adjacent_transparent[:, 1:] |= transparent[:, :-1]
        adjacent_transparent[:-1, :-1] |= transparent[1:, 1:]
        adjacent_transparent[1:, 1:] |= transparent[:-1, :-1]
        adjacent_transparent[:-1, 1:] |= transparent[1:, :-1]
        adjacent_transparent[1:, :-1] |= transparent[:-1, 1:]

        rgb = data[:, :, :3].astype(np.int32)
        dist = np.sqrt(np.sum((rgb - key_arr) ** 2, axis=2))
        mask = visible & adjacent_transparent & (dist <= threshold)
        if not np.any(mask):
            break
        data[mask, 0:3] = 0
        data[mask, 3] = 0
    return Image.fromarray(data, mode="RGBA")


def make_checker(size: tuple[int, int], square: int = 16) -> Image.Image:
    width, height = size
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    pixels = img.load()
    a = (210, 210, 210, 255)
    b = (245, 245, 245, 255)
    for y in range(height):
        for x in range(width):
            pixels[x, y] = a if ((x // square) + (y // square)) % 2 == 0 else b
    return img


def alpha_stats(tile: Image.Image) -> dict[str, object]:
    alpha = np.array(tile.getchannel("A"))
    total = alpha.size
    transparent = int(np.count_nonzero(alpha == 0))
    opaque = int(np.count_nonzero(alpha == 255))
    visible = int(np.count_nonzero(alpha > 0))
    height, width = alpha.shape

    def edge_ratio(edge: np.ndarray) -> float:
        return round(float(np.count_nonzero(edge > 0) / max(1, edge.size)), 4)

    bbox = tile.getbbox()
    return {
        "transparent_ratio": round(transparent / total, 4),
        "opaque_ratio": round(opaque / total, 4),
        "visible_ratio": round(visible / total, 4),
        "alpha_min": int(alpha.min()),
        "alpha_max": int(alpha.max()),
        "bbox": list(bbox) if bbox else None,
        "edge_occupancy": {
            "top": edge_ratio(alpha[0, :]),
            "right": edge_ratio(alpha[:, width - 1]),
            "bottom": edge_ratio(alpha[height - 1, :]),
            "left": edge_ratio(alpha[:, 0]),
        },
    }


def compose_grid(tiles: list[Image.Image], rows: int, cols: int, tile_size: tuple[int, int]) -> Image.Image:
    tile_w, tile_h = tile_size
    sheet = Image.new("RGBA", (cols * tile_w, rows * tile_h), (0, 0, 0, 0))
    for index, tile in enumerate(tiles):
        row, col = divmod(index, cols)
        sheet.paste(tile, (col * tile_w, row * tile_h), tile)
    return sheet


def write_markdown_manifest(path: Path, payload: dict[str, object]) -> None:
    lines = [
        "# Processed Tileset Manifest",
        "",
        f"Source: `{payload['source']}`",
        f"Transparent sheet: `{payload['transparent_sheet']}`",
        f"Checker preview: `{payload['checker_preview']}`",
        "",
        f"Grid: {payload['cols']} columns x {payload['rows']} rows",
        f"Tile size: `{payload['tile_width']}x{payload['tile_height']}`",
        f"Chroma key: `{payload['key_color']}` with threshold `{payload['threshold']}`",
        f"Edge fringe cleanup: threshold `{payload['edge_fringe_threshold']}`, passes `{payload['edge_fringe_passes']}`",
        "",
        "## Tiles",
        "",
        "| Index | File | Name | Collision | Visible | Transparent | Notes |",
        "| ---: | --- | --- | --- | ---: | ---: | --- |",
    ]
    for tile in payload["tiles"]:
        lines.append(
            "| {index} | `{file}` | `{name}` | `{collision}` | {visible:.1%} | {transparent:.1%} | {notes} |".format(
                index=tile["index"],
                file=tile["file"],
                name=tile["name"],
                collision=tile["collision"],
                visible=tile["stats"]["visible_ratio"],
                transparent=tile["stats"]["transparent_ratio"],
                notes=tile["notes"],
            )
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def process_tileset(args: argparse.Namespace) -> None:
    out_dir = args.output_dir
    tiles_dir = out_dir / "tiles"
    tiles_dir.mkdir(parents=True, exist_ok=True)
    for stale_tile in tiles_dir.glob("*.png"):
        stale_tile.unlink()

    raw = Image.open(args.input).convert("RGBA")
    source_w, source_h = raw.size
    tile_w = source_w // args.cols
    tile_h = source_h // args.rows
    if tile_w <= 0 or tile_h <= 0:
        raise ValueError("Input image is too small for the requested grid.")

    grid_w = tile_w * args.cols
    grid_h = tile_h * args.rows
    crop_left = (source_w - grid_w) // 2
    crop_top = (source_h - grid_h) // 2
    raw_grid = raw.crop((crop_left, crop_top, crop_left + grid_w, crop_top + grid_h))
    keyed_grid = key_to_alpha(raw_grid, args.key_color, args.threshold)
    keyed_grid = clean_key_fringe(
        keyed_grid,
        args.key_color,
        args.edge_fringe_threshold,
        args.edge_fringe_passes,
    )

    tiles: list[Image.Image] = []
    tile_payloads: list[dict[str, object]] = []
    total_tiles = args.rows * args.cols
    for index in range(total_tiles):
        row, col = divmod(index, args.cols)
        box = (col * tile_w, row * tile_h, (col + 1) * tile_w, (row + 1) * tile_h)
        tile = keyed_grid.crop(box)
        tiles.append(tile)
        default_name, default_collision, default_notes = (
            DEFAULT_TILE_INFO[index] if index < len(DEFAULT_TILE_INFO) else (f"tile_{index + 1:02d}", "solid", "")
        )
        tile_name = f"{index + 1:02d}_{default_name}"
        tile_file = tiles_dir / f"{tile_name}.png"
        tile.save(tile_file)
        tile_payloads.append(
            {
                "index": index + 1,
                "row": row,
                "col": col,
                "name": default_name,
                "collision": default_collision,
                "notes": default_notes,
                "file": str(tile_file.relative_to(out_dir)),
                "stats": alpha_stats(tile),
            }
        )

    transparent_sheet = compose_grid(tiles, args.rows, args.cols, (tile_w, tile_h))
    transparent_sheet_path = out_dir / "tileset-transparent.png"
    transparent_sheet.save(transparent_sheet_path)

    checker = make_checker(transparent_sheet.size)
    checker.alpha_composite(transparent_sheet)
    checker_path = out_dir / "tileset-transparent-checker.png"
    checker.save(checker_path)

    payload = {
        "source": str(args.input),
        "source_width": source_w,
        "source_height": source_h,
        "source_crop": [crop_left, crop_top, crop_left + grid_w, crop_top + grid_h],
        "rows": args.rows,
        "cols": args.cols,
        "tile_width": tile_w,
        "tile_height": tile_h,
        "key_color": "#{:02X}{:02X}{:02X}".format(*args.key_color),
        "threshold": args.threshold,
        "edge_fringe_threshold": args.edge_fringe_threshold,
        "edge_fringe_passes": args.edge_fringe_passes,
        "transparent_sheet": str(transparent_sheet_path.relative_to(out_dir)),
        "checker_preview": str(checker_path.relative_to(out_dir)),
        "tiles": tile_payloads,
    }
    (out_dir / "tileset.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    write_markdown_manifest(out_dir / "tileset_manifest.md", payload)
    print(out_dir.resolve())


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--rows", type=int, default=4)
    parser.add_argument("--cols", type=int, default=4)
    parser.add_argument("--key-color", type=parse_hex_color, default=parse_hex_color("#FF00FF"))
    parser.add_argument("--threshold", type=float, default=48.0)
    parser.add_argument("--edge-fringe-threshold", type=float, default=0.0)
    parser.add_argument("--edge-fringe-passes", type=int, default=0)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    process_tileset(args)


if __name__ == "__main__":
    main()
