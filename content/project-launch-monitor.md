---
npc: "The Range Hermit"
title: "DIY Camera/Radar Launch Monitor"
x: 650
y: 350
order: 3
sprite: 324
---

A homebrew launch monitor, built to track a 20-handicap golf game one range session at a time.

- Camera-based capture using the Arducam B0332 OV9281 120fps camera
- Python, OpenCV, and Pygame for the capture and analysis pipeline through to display on a rudimentry UI
- Feeds a longitudinal dataset used to spot swing patterns over time on a per-club basis

Building this project helped me to learn more about mapping co-ordinates in images, analysing image differences in a pipeline, and presenting and persisting outputs.
