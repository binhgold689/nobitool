#!/usr/bin/env bash
# ==============================================================================
# SCRIPT BẺ HASH / LÁCH BẢN QUYỀN VIDEO TỰ ĐỘNG BẰNG FFMPEG
# Dùng để chạy trong Node Execute Command của n8n trên VPS Linux
# ==============================================================================

INPUT_FILE="$1"
OUTPUT_FILE="$2"

if [ -z "$INPUT_FILE" ] || [ -z "$OUTPUT_FILE" ]; then
    echo "Usage: ./ffmpeg_hash_mutator.sh <input_video.mp4> <output_video.mp4>"
    exit 1
fi

# Các kỹ thuật bẻ hash:
# 1. hflip: Lật ngang khung hình
# 2. crop=in_w*0.96:in_h*0.96: Cắt viền 4%
# 3. asetrate=44100*1.02,atempo=1/1.02: Đổi nhẹ tần số âm thanh (tai người không nhận ra nhưng bot quét bản quyền âm thanh không bắt được)
# 4. -map_metadata -1: Xóa toàn bộ thông tin nguồn (EXIF / camera tag)
# 5. -preset ultrafast: Tốc độ render cực nhanh, tốn ít CPU VPS

ffmpeg -y -i "$INPUT_FILE" \
    -vf "hflip,crop=in_w*0.96:in_h*0.96" \
    -af "asetrate=44100*1.02,atempo=0.9803" \
    -map_metadata -1 \
    -c:v libx264 -preset veryfast -crf 23 \
    -c:a aac -b:a 128k \
    "$OUTPUT_FILE"

echo "Bẻ hash hoàn tất: $OUTPUT_FILE"
