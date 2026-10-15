# 🚀 OmniAffiliate Hub - Cỗ Máy Phân Phối Nội Dung & Affiliate Đa Kênh

Hệ thống tự động hóa toàn diện: **Cào video viral Telegram/Douyin $\rightarrow$ Lách bản quyền bằng FFmpeg $\rightarrow$ AI viết Caption & Match sản phẩm Shopee $\rightarrow$ Bắn bản nháp về Telegram cá nhân có nút bấm duyệt $\rightarrow$ Tự động phân phối đa kênh (Facebook Page, Threads, TikTok...) và thả First Comment gắn link Affiliate.**

---

## 📁 Cấu Trúc Khung Dự Án

```
cool-brahmagupta/
├── dashboard/                      # GIAO DIỆN WEB QUẢN TRỊ
│   └── index.html                  # Dashboard quản lý nguồn, kho Shopee, danh sách kênh
├── workflows/                      # KỊCH BẢN n8n SẴN SÀNG SỬ DỤNG
│   └── 01_telegram_to_draft.json   # Workflow n8n: Lắng nghe Telegram -> Gửi Bot duyệt -> Đăng Page
├── scripts/                        # SCRIPTS XỬ LÝ
│   ├── ffmpeg_hash_mutator.sh      # Lệnh FFmpeg bẻ hash video lách bản quyền
│   └── ai_prompts.md               # Bộ Prompt AI chuẩn hóa phong cách dí dỏm MXH Việt Nam
├── docker/                         # CẤU HÌNH TRIỂN KHAI VPS (DÙNG SAU NÀY)
│   ├── docker-compose.yml          # Chạy PostgreSQL + n8n + Nginx Web Dashboard
│   └── .env.example                # Khai báo các API keys
└── README.md                       # Tài liệu hướng dẫn
```

---

## 🖥️ Cách Xem Thử Giao Diện Web Dashboard Ngay Bây Giờ

Bạn không cần cài đặt gì phức tạp:
1. Mở thư mục `c:\Users\PC\Documents\antigravity\cool-brahmagupta\dashboard\` trên máy tính của bạn.
2. Click đúp chuột vào file `index.html` để mở trực tiếp trên trình duyệt (Chrome / Cốc Cốc / Edge).
3. Bạn sẽ thấy đầy đủ các tab chức năng:
   - **Hàng đợi duyệt bài (Queue):** Trải nghiệm cách AI match sản phẩm và nút duyệt đăng.
   - **Nguồn cào (Sources):** Quản lý các kênh Telegram/Douyin.
   - **Kho Shopee (Affiliate):** Quản lý link và từ khóa kích hoạt AI.
   - **Kênh phân phối (Channels):** Quản lý danh sách các Page Facebook, Threads, TikTok, Pinterest.

---

## 🔄 Luồng Vận Hành Của Hệ Thống

1. **Cào & Lọc:** n8n tự động lắng nghe Kênh Telegram công khai (hoặc Douyin). Chỉ lấy các tin có video và lọc bỏ từ khóa bạo lực/nhạy cảm.
2. **Xóa Hash:** Chạy script `ffmpeg_hash_mutator.sh` để lật gương, cắt viền và đổi âm tần nhẹ.
3. **AI Xử Lý:** Gemini đọc ngữ cảnh video, viết lại 1 caption hài hước và tự bốc sản phẩm Shopee tương ứng từ kho.
4. **Bắn về Telegram:** Bot gửi video kèm caption và 2 nút bấm `[🚀 Duyệt Đăng]` hoặc `[🗑️ Bỏ Qua]`.
5. **Đăng Bài:** Khi bạn bấm duyệt (trên điện thoại hoặc web):
   - n8n gọi Facebook Graph API đăng video lên Page.
   - n8n chờ 20 giây và tự động bình luận vào "First Comment" câu thoại duyên dáng kèm link Shopee.
