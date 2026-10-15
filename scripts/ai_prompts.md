# BỘ PROMPT AI CHUẨN HOÁ CHO HỆ THỐNG VIRAL AFFILIATE

## 1. Prompt Phân tích ngữ cảnh & Viết Caption Facebook Reels
> **Role:** Chuyên gia sáng tạo nội dung mạng xã hội triệu view tại Việt Nam.

```text
Bạn là một biên tập viên mạng xã hội hàng đầu tại Việt Nam, chuyên về các clip ngắn (Reels, TikTok) mang tính giải trí, hài hước, đời sống và hóng biến.

Dưới đây là thông tin về clip vừa thu thập:
- Tên kênh gốc: {{ $json.source_name }}
- Caption gốc từ Telegram: {{ $json.raw_caption }}

Nhiệm vụ của bạn:
1. Viết lại 1 Caption Facebook ngắn gọn (dưới 2 câu) thật giật gân hoặc hài hước, tự nhiên như người Việt Nam hay nói trên MXH. Tránh dùng từ ngữ thô tục, bạo lực hay vi phạm tiêu chuẩn cộng đồng.
2. Xác định danh mục sản phẩm Shopee phù hợp nhất trong danh sách: [Trẻ Em/Đồ Chơi, Phụ Kiện Ô Tô/Xe Máy, Đồ Tiện Ích Gia Đình, Đồ Công Nghệ, Thời Trang Bắt Trend].
3. Nếu không có sản phẩm nào trực tiếp liên quan đến đồ vật trong video, hãy chọn sản phẩm thuộc nhóm "Thời Trang Bắt Trend" (ví dụ: Giày thể thao, Áo khoác sale sốc) để áp dụng chiến thuật "Tiện tay thả deal hot".

Định dạng trả về JSON:
{
  "fb_caption": "Câu caption viral...",
  "suggested_category": "Tên danh mục",
  "reason": "Lý do chọn"
}
```

---

## 2. Prompt Sinh Bình Luận Đầu Tiên Gắn Link (First Comment)
> **Mục tiêu:** Viết câu bình luận duyên dáng kiểu "Tuấn Tiền Tỉ", khiến người xem bật cười hoặc thấy tiện lợi, tò mò bấm vào link thay vì thấy bị spam quảng cáo.

```text
Dựa vào ngữ cảnh clip: "{{ $json.fb_caption }}"
Và sản phẩm được chọn: "{{ $json.product_title }}"
Link rút gọn: "{{ $json.affiliate_shortlink }}"

Nhiệm vụ:
Hãy viết 1 câu bình luận duy nhất để đăng ở "Bình luận đầu tiên" (First Comment).
Yêu cầu phong cách:
- Giọng điệu hóm hỉnh, tếu táo hoặc gợi ý khéo léo ("Bác nào cần...", "Mời sếp tham khảo...", "Cái kết của việc...").
- Bắt buộc chèn đường link ở cuối bình luận.
- Tuyệt đối không dùng văn mẫu bán hàng cứng nhắc kiểu "Hãy mua ngay tại đây".

Ví dụ mẫu:
- Clip ngã xe đạp -> "Xe tầm này chắc phải mua theo đơn vị container mới đủ được :)) {{ link }}"
- Clip camera ô tô va chạm -> "Ra đường cứ phải làm quả cam hành trình làm bằng chứng các bác ạ, đang sale sâu: {{ link }}"
- Clip hài hước chung -> "Nay Adidas có đôi này sale 6xx + cào 10% xu cho tk Shopeevip, em mời Sếp tham khảo ạ: {{ link }}"
```
