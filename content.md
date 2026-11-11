# BỘ NỘI DUNG CHI TIẾT WEBSITE QUY TRÌNH BÁO GIÁ (`content.md`)

> **Tài liệu nguồn:** [Quy_Trinh.md](./Quy_Trinh.md)
> **Website mẫu tham chiếu giao diện:** `https://agent-6a6c90ea74be9b58--gleaming-rolypoly-980941.netlify.app/`
> **Phạm vi sản phẩm:** Website hiển thị và hỗ trợ theo dõi tiến độ thực hiện **duy nhất một quy trình báo giá**.
> **Nguyên tắc biên soạn bắt buộc:** Toàn bộ phần giao diện, điều hướng, hướng dẫn thao tác, theo dõi tiến độ và thông báo hệ thống được viết hoàn chỉnh để sử dụng ngay. Riêng các nội dung nghiệp vụ đặc thù (tên bước chính thức, số lượng và thứ tự bước, đơn vị chủ trì/phối hợp, chứng từ đầu vào/đầu ra, rủi ro và cách giải quyết, thông tin thương hiệu) **không tự suy đoán** mà giữ nguyên trạng thái **`Chưa được cung cấp`** hoặc **Placeholder minh họa** chờ tài liệu chính thức từ bên yêu cầu.

---

## MỤC LỤC

1. [Định hướng giọng văn & Quy chuẩn thuật ngữ (Tone, Voice & Glossary)](#1-định-hướng-giọng-văn--quy-chuẩn-thuật-ngữ)
2. [Bản đồ cấu trúc các phần của Website](#2-bản-đồ-cấu-trúc-các-phần-của-website)
3. [Phần 0: Metadata & Thẻ trình duyệt](#3-phần-0-metadata--thẻ-trình-duyệt)
4. [Phần 1: Đầu trang (Header / Masthead & Điều hướng)](#4-phần-1-đầu-trang-header--masthead--điều-hướng)
5. [Phần 2: Khu vực Theo dõi Tiến độ & Thanh Thao tác](#5-phần-2-khu-vực-theo-dõi-tiến-độ--thanh-thao-tác)
6. [Phần 3: Hộp thoại Xác nhận Clear All & Thông báo Hệ thống](#6-phần-3-hộp-thoại-xác-nhận-clear-all--thông-báo-hệ-thống)
7. [Phần 4: Khu vực Tổng quan Quy trình & Danh sách các bước](#7-phần-4-khu-vực-tổng-quan-quy-trình--danh-sách-các-bước)
8. [Phần 5: Khu vực Nội dung Chi tiết từng bước (Detail Panel)](#8-phần-5-khu-vực-nội-dung-chi-tiết-từng-bước-detail-panel)
9. [Phần 6: Khu vực Hướng dẫn sử dụng & Lưu ý vận hành](#9-phần-6-khu-vực-hướng-dẫn-sử-dụng--lưu-ý-vận-hành)
10. [Phần 7: Chân trang (Footer)](#10-phần-7-chân-trang-footer)
11. [Phần 8: Các hạng mục chờ xác nhận & Hướng dẫn điền dữ liệu chính thức](#11-phần-8-các-hạng-mục-chờ-xác-nhận--hướng-dẫn-điền-dữ-liệu-chính-thức)

---

## 1. Định hướng giọng văn & Quy chuẩn thuật ngữ

### 1.1. Giọng văn (Tone & Voice)
Đây là công cụ tác nghiệp nội bộ dùng trực tiếp trong quá trình lập và kiểm soát báo giá — nơi người dùng cần **nhìn nhanh, hiểu đúng, làm đủ, tránh sót việc**. Giọng văn cần đảm bảo 4 tiêu chí:
- **Rõ ràng & Trực diện:** Mỗi nhãn, nút bấm, tiêu đề chỉ mang một nghĩa duy nhất; không dùng khẩu hiệu chung chung hay từ ngữ văn hoa gây nhiễu.
- **Hướng dẫn hành động (Action-oriented):** Mở đầu câu mô tả thao tác bằng động từ rõ ràng (*Chọn, Kiểm tra, Đánh dấu, Đối chiếu, Bắt đầu lại*).
- **Chặt chẽ & Nhất quán:** Dùng đúng một thuật ngữ cho cùng một khái niệm xuyên suốt từ tổng quan đến chi tiết.
- **Minh bạch giới hạn hệ thống:** Không hứa hẹn sai chức năng (ví dụ: phải nêu rõ tiến độ chỉ lưu trên trình duyệt/thiết bị hiện tại nếu dùng `LocalStorage`; nêu rõ checkbox xác nhận **công việc đã hoàn thành**, không phải xác nhận đã đọc).

### 1.2. Bảng quy chuẩn thuật ngữ giao diện (UI Glossary)

| Khái niệm | Thuật ngữ chuẩn sử dụng trên Web | Không dùng |
| :--- | :--- | :--- |
| Quy trình chính | **Quy trình báo giá** | Chuỗi cung ứng, quy trình bán hàng tổng hợp |
| Từng mục trong quy trình | **Bước** (ví dụ: *Bước 01*, *Bước 02*) | Giai đoạn con, tác vụ lẻ, ticket |
| Đơn vị chịu trách nhiệm chính | **Người / Đơn vị chủ trì** | Bên làm chính, owner |
| Đơn vị hỗ trợ / tương tác | **Đơn vị liên hệ / phối hợp** | Bên liên quan chung chung |
| Hồ sơ trước khi thực hiện | **Chứng từ / Tài liệu đầu vào** | Đầu vào thô, dữ liệu nguồn |
| Sản phẩm sau khi thực hiện | **Kết quả / Chứng từ đầu ra** | Thành phẩm, deliverable |
| Vấn đề tiềm ẩn & xử lý | **Rủi ro phát sinh & Cách giải quyết** | Cảnh báo lỗi, note |
| Ô tick của từng bước | **Đánh dấu hoàn thành công việc** | Đã đọc, đã xem |
| Nút xóa toàn bộ dấu tick | **Clear All** | Reset hệ thống, xóa dữ liệu |

---

## 2. Bản đồ cấu trúc các phần của Website

Bảng đối chiếu dưới đây giúp đội thiết kế và lập trình ánh xạ đúng bố cục từ website mẫu sang website Quy trình Báo giá:

| STT | Khu vực giao diện | Kế thừa từ website mẫu | Điều chỉnh cho Website Quy trình Báo giá |
| :---: | :--- | :--- | :--- |
| **0** | **Tab trình duyệt (`<head>`)** | Tiêu đề trang súc tích | Đổi sang tên Quy trình báo giá |
| **1** | **Đầu trang (`Header / Masthead`)** | Eyebrow, `H1`, đoạn dẫn `Dek`, thanh chuyển chế độ xem & thanh nhảy nhanh | Thu gọn phạm vi vào duy nhất 1 quy trình báo giá; linh hoạt chế độ xem phù hợp danh sách ~7 bước |
| **2** | **Khu vực Tiến độ & Thanh Thao tác** | *Bổ sung mới theo yêu cầu* | Hiển thị tổng số bước, đã hoàn thành, chưa hoàn thành, thanh tỷ lệ `%`, thông báo lưu trữ cục bộ và nút **Clear All** |
| **3** | **Hộp thoại xác nhận & Toast** | *Bổ sung mới theo yêu cầu* | Hộp thoại xác nhận trước khi **Clear All** để tránh xóa nhầm |
| **4** | **Tổng quan / Danh sách các bước** | Dải bước theo thứ tự, trạng thái rõ ràng, chú thích đầu mục | Gắn checkbox đánh dấu hoàn thành công việc trực tiếp trên từng bước; đánh dấu trạng thái hoàn thành/chưa hoàn thành |
| **5** | **Bảng chi tiết bước (`Detail Panel`)** | Panel trượt bên phải (Desktop) / ngăn kéo toàn màn (Mobile) | Giữ bố cục panel chi tiết rõ ràng; hiển thị đúng 6 nhóm thông tin nghiệp vụ bắt buộc + checkbox hoàn thành đồng bộ |
| **6** | **Hướng dẫn sử dụng & Lưu ý** | Khu vực phụ lục & hộp lưu ý cuối trang (`Appendix` + `Note`) | Thay bảng pháp lý EPC của mẫu bằng **Hướng dẫn sử dụng & Quy ước theo dõi quy trình** |
| **7** | **Chân trang (`Footer`)** | 2 cột thông tin nguồn & ghi chú | Ghi nhận nguồn tài liệu quy trình báo giá và phạm vi lưu trữ dữ liệu cục bộ |

---

## 3. Phần 0: Metadata & Thẻ trình duyệt

- **Tiêu đề tab trình duyệt (`<title>`):**
  > `Quy trình báo giá — Tổng quan & Theo dõi tiến độ thực hiện`
- **Mô tả ngắn (`meta description`):**
  > `Trang tra cứu chi tiết từng bước và theo dõi tiến độ thực hiện quy trình báo giá: nội dung công việc, đơn vị chủ trì, phối hợp, chứng từ đầu vào/đầu ra, rủi ro và biện pháp xử lý.`

---

## 4. Phần 1: Đầu trang (Header / Masthead & Điều hướng)

### 4.1. Thanh định danh phía trên (Eyebrow)
Hiển thị dạng nhãn phân cách bằng dấu chấm giữa (`·`):
- **Nhãn 1 (Loại tài liệu):** `Quy trình nội bộ`
- **Nhãn 2 (Tên phân hệ):** `Quy trình báo giá`
- **Nhãn 3 (Quy mô hiện tại):** `Dự kiến ~7 bước sơ bộ` *(tự động cập nhật thành `Gồm [X] bước` khi có dữ liệu chính thức)*
- **Nhãn 4 (Phiên bản / Ngày hiệu lực):** `Phiên bản: Chưa được cung cấp`
- **Nhãn 5 (Logo / Tên đơn vị áp dụng):** `[Chưa được cung cấp — Chờ xác nhận từ bên yêu cầu]`

### 4.2. Tiêu đề chính (`H1`)
- **Bản hiển thị chính thức (dùng ngay):**
  > **Quy trình báo giá**
- **Dòng phụ đề mở rộng (nếu bên yêu cầu muốn tiêu đề mô tả đầu - cuối như website mẫu):**
  > *Quy trình báo giá — Từ [Bước đầu: Chưa được cung cấp] đến [Bước cuối: Chưa được cung cấp]*

### 4.3. Đoạn giới thiệu ngắn (`Dek`)
> Trang tổng hợp toàn bộ các bước trong **quy trình báo giá** theo đúng trình tự thực hiện. Chọn từng bước để xem chi tiết nội dung công việc, người hoặc đơn vị chủ trì, đơn vị cần phối hợp, chứng từ đầu vào, kết quả đầu ra cùng các rủi ro thường gặp và cách xử lý. Đánh dấu vào ô hoàn thành sau khi xử lý xong công việc của mỗi bước để theo dõi tiến độ cho lượt báo giá hiện tại.

### 4.4. Thanh chuyển chế độ xem (`Tabs`) — *Linh hoạt theo bố cục website mẫu*
Website mẫu sử dụng 2 tab ngay dưới phần giới thiệu. Tùy mức độ đơn giản hay mở rộng khi có dữ liệu chính thức, có thể áp dụng một trong hai phương án:

- **Phương án A (Giữ 2 tab tương đồng cao với website mẫu):**
  + **Tab 1:** `Tổng quan quy trình` — Nhãn phụ: `Danh sách theo thứ tự`
  + **Tab 2:** `Sơ đồ tiến trình` — Nhãn phụ: `Theo tuyến trách nhiệm` *(Lưu ý: tên các tuyến trách nhiệm / phòng ban hiện **Chưa được cung cấp**, chỉ kích hoạt đầy đủ khi bên yêu cầu bàn giao thông tin đơn vị chủ trì & phối hợp).*

- **Phương án B (Tinh gọn còn 1 chế độ xem chính để thao tác nhanh hơn):**
  + **Tab / Nhãn duy nhất:** `Danh sách các bước` — Nhãn phụ: `Theo dõi & Kiểm tra chi tiết`

### 4.5. Thanh điều hướng nhanh theo bước (`Step Rail` — tương ứng `phaserail` ở website mẫu)
- **Mục đích:** Giúp người dùng nhảy nhanh đến bất kỳ bước nào trong quy trình mà không phải cuộn trang dài.
- **Định dạng mỗi nút trên thanh:**
  + Số thứ tự: `01`, `02`, `03` ...
  + Tên bước: `[Tên bước — Chưa được cung cấp]`
  + Trạng thái nhỏ kèm theo: `Chưa xong` *(xám)* hoặc `Đã xong ✓` *(xanh)*

---

## 5. Phần 2: Khu vực Theo dõi Tiến độ & Thanh Thao tác

*(Khối chức năng cốt lõi đặt ngay đầu vùng nội dung chính, giúp người dùng vừa mở trang đã nắm được tiến độ lượt báo giá hiện tại.)*

### 5.1. Tiêu đề & Nhãn khối tiến độ
- **Tiêu đề khối:** `Tiến độ lượt thực hiện hiện tại`
- **Nhãn phụ:** `Đánh dấu vào từng bước sau khi hoàn thành công việc thực tế`

### 5.2. Các chỉ số thống kê tiến độ (Progress Metrics)

| Chỉ số | Nhãn hiển thị | Định dạng giá trị | Giá trị mặc định (chưa có dữ liệu chính thức) |
| :--- | :--- | :--- | :--- |
| **Tổng số bước** | `Tổng số bước` | `[N] bước` | `7 bước (sơ bộ)` |
| **Số bước đã hoàn thành** | `Đã hoàn thành` | `[K] bước` | `0 bước` |
| **Số bước chưa hoàn thành** | `Chưa hoàn thành` | `[N - K] bước` | `7 bước` |
| **Tỷ lệ hoàn thành** | `Tỷ lệ hoàn thành` | `[P]%` | `0%` |

- **Văn bản đọc kèm thanh tiến độ trực quan (`Progress Bar`):**
  > `Đã hoàn thành [K] / [N] bước ([P]%)`

### 5.3. Thông điệp trạng thái động theo tỷ lệ hoàn thành
Hiển thị ngay bên dưới thanh tiến độ tùy vào mức `%` hiện tại:

- **Khi `0%` (0 bước hoàn thành — Chưa bắt đầu):**
  > `Sẵn sàng cho lượt báo giá mới. Hãy chọn Bước 01 để xem hướng dẫn chi tiết và bắt đầu thực hiện.`
- **Khi `1% – 49%` (Đang thực hiện giai đoạn đầu):**
  > `Đang thực hiện quy trình ([K]/[N] bước đã xong). Tiếp tục kiểm tra các bước còn lại để đảm bảo đủ chứng từ và kiểm soát rủi ro.`
- **Khi `50% – 99%` (Đang hoàn thiện các bước cuối):**
  > `Đã qua hơn nửa chặng đường ([K]/[N] bước). Còn [N - K] bước chưa hoàn thành — vui lòng rà soát kỹ đầu ra trước khi kết thúc lượt báo giá.`
- **Khi `100%` (Hoàn tất toàn bộ các bước):**
  > `Hoàn tất 100% các bước trong quy trình báo giá. Khi cần thực hiện một báo giá mới, hãy nhấn "Clear All" để đặt lại toàn bộ dấu hoàn thành.`

### 5.4. Bộ lọc nhanh trạng thái bước (Filter Pills — Tùy chọn cải tiến thao tác)
- `Tất cả ([N])`
- `Chưa hoàn thành ([N - K])`
- `Đã hoàn thành ([K])`
- **Thông báo khi bộ lọc không có bước nào phù hợp:**
  + Khi lọc `Chưa hoàn thành` nhưng đã xong hết (`K = N`):
    > `Tất cả các bước trong lượt này đều đã được đánh dấu hoàn thành.`
  + Khi lọc `Đã hoàn thành` nhưng chưa tick bước nào (`K = 0`):
    > `Chưa có bước nào được đánh dấu hoàn thành. Hãy tick vào ô hoàn thành sau khi thực hiện xong công việc của một bước.`

### 5.5. Thông báo phạm vi lưu trữ trạng thái (`LocalStorage Disclosure`)
*(Tuân thủ nghiêm quy tắc: phải ghi rõ trạng thái chỉ lưu trên trình duyệt/thiết bị hiện tại, không mô tả là đồng bộ nhiều người.)*

- **Nhãn hiển thị cố định cạnh khối tiến độ (Microcopy):**
  > `Trạng thái lưu cục bộ:` *Tiến độ đánh dấu được lưu tự động trên trình duyệt và thiết bị này. Dữ liệu không đồng bộ sang thiết bị khác hoặc tài khoản của người khác.*
- **Thông báo dự phòng khi trình duyệt chặn lưu trữ (`LocalStorage` không khả dụng / chế độ ẩn danh):**
  > `Lưu ý: Trình duyệt hiện tại đang hạn chế lưu dữ liệu cục bộ. Các dấu hoàn thành vẫn hoạt động trong phiên làm việc này nhưng có thể không được giữ lại sau khi đóng trình duyệt.`

### 5.6. Nút `Clear All`
- **Nhãn nút:** `Clear All` *(hoặc `Clear All · Xóa dấu hoàn thành`)*
- **Tooltip khi rê chuột vào nút:**
  > `Xóa toàn bộ dấu tick hoàn thành để bắt đầu một lượt báo giá mới. Nội dung quy trình vẫn được giữ nguyên.`
- **Trạng thái nút khi chưa có bước nào được đánh dấu (`K = 0`):**
  + Trạng thái vô hiệu hóa (`disabled`) với tooltip: `Hiện chưa có bước nào được đánh dấu hoàn thành.`

---

## 6. Phần 3: Hộp thoại Xác nhận Clear All & Thông báo Hệ thống

### 6.1. Hộp thoại xác nhận Clear All (Confirmation Modal)
Xuất hiện khi người dùng bấm nút **Clear All** để tránh thao tác nhầm làm mất tiến độ đang theo dõi:

- **Tiêu đề hộp thoại:**
  > `Xác nhận xóa toàn bộ trạng thái hoàn thành?`
- **Nội dung cảnh báo:**
  > Thao tác này sẽ bỏ đánh dấu tất cả **[K] bước đã hoàn thành** để bạn bắt đầu một lượt thực hiện quy trình báo giá mới.
  >
  > **Lưu ý:** Lệnh **Clear All** chỉ đặt lại tiến độ về 0%, toàn bộ nội dung hướng dẫn của quy trình vẫn được giữ nguyên. Hành động này không thể hoàn tác.
- **Nhãn nút phụ (An toàn — mặc định focus):**
  > `Hủy, giữ nguyên tiến độ`
- **Nhãn nút chính (Xác nhận hành động):**
  > `Xác nhận Clear All`

### 6.2. Thông báo phản hồi thao tác (Toast / Live Status)
- **Khi đánh dấu hoàn thành 1 bước:**
  > `Đã đánh dấu hoàn thành [Mã/Tên bước]. Tiến độ hiện tại: [K]/[N] bước ([P]%).`
- **Khi bỏ đánh dấu 1 bước:**
  > `Đã chuyển [Mã/Tên bước] về trạng thái chưa hoàn thành.`
- **Khi hoàn thành bước cuối cùng (`K = N`):**
  > `Chúc mừng! Bạn đã đánh dấu hoàn thành toàn bộ [N] bước của quy trình báo giá.`
- **Khi thực hiện Clear All thành công:**
  > `Đã xóa toàn bộ dấu hoàn thành. Quy trình đã sẵn sàng cho lượt báo giá mới.`

---

## 7. Phần 4: Khu vực Tổng quan Quy trình & Danh sách các bước

### 7.1. Thanh chú thích đầu danh sách (`Overview Note / Legend`)
Hiển thị ngay phía trên danh sách các bước (tương ứng `.ovnote` ở website mẫu):

- **Mục 1 — Ý nghĩa Checkbox:**
  > `☐ / ☑ Đánh dấu hoàn thành:` Chỉ tick khi **công việc thực tế của bước đã hoàn thành**, không dùng để đánh dấu "đã đọc".
- **Mục 2 — Xem chi tiết:**
  > `▸ Nhấn vào tên bước:` Mở bảng thông tin chi tiết gồm nội dung công việc, chủ trì, phối hợp, đầu vào, đầu ra và rủi ro.
- **Mục 3 — Lượt thực hiện mới:**
  > `↺ Clear All:` Xóa toàn bộ dấu tick khi bắt đầu một bộ hồ sơ báo giá mới.

### 7.2. Cấu trúc nội dung trên một Thẻ Bước (Step Card Template)
Mỗi bước hiển thị trong danh sách tổng quan gồm các thành phần cố định sau:

1. **Ô đánh dấu hoàn thành (`Checkbox`):**
   - `aria-label`: `Đánh dấu hoàn thành công việc của Bước [XX]`
   - Nhãn ngắn hiển thị (nếu có): `Hoàn thành`
2. **Số thứ tự / Mã bước:**
   - Ví dụ: `Bước 01` *(hoặc kèm mã bước chính thức khi được cung cấp)*
3. **Tên bước:**
   - `[Tên bước chính thức — Chưa được cung cấp]`
4. **Tóm tắt nhanh (Metadata Pills — tối đa 2-3 thông tin quét nhanh):**
   - `Chủ trì: [Chưa được cung cấp]`
   - `Trạng thái:` `Chưa hoàn thành` *(nhãn trung tính)* / `Đã hoàn thành` *(nhãn xanh)*
   - Nhãn cảnh báo nếu bước có lưu ý rủi ro trọng yếu *(chỉ hiển thị khi tài liệu chính thức có dữ liệu rủi ro)*: `Có lưu ý rủi ro`
5. **Nút / Hành động mở chi tiết:**
   - `Xem chi tiết →` *(hoặc khi đang chọn bước này: `Đang xem chi tiết`)*

### 7.3. Khung dữ liệu ~7 bước sơ bộ (DỮ LIỆU PLACEHOLDER MINH HỌA)

> [!CAUTION]
> **CẢNH BÁO DỮ LIỆU CHƯA CHÍNH THỨC (PLACEHOLDER MINH HỌA)**
> Theo đúng quy định trong `Quy_Trinh.md`: hiện tại bên yêu cầu mới dự kiến sơ bộ quy trình gồm khoảng **7 bước** và chưa bàn giao tài liệu nghiệp vụ chính thức. Do đó, **tất cả các trường nghiệp vụ dưới đây đều phải ghi là `Chưa được cung cấp`** — tuyệt đối không tự đặt tên bước, tên phòng ban, chứng từ hay rủi ro giả định như thông tin thật. Khi nhận tài liệu chính thức, số lượng bước có thể tăng hoặc giảm tương ứng.

#### Khung dữ liệu Placeholder từ Bước 01 đến Bước 07:

- **Bước 01 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `01` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 02 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `02` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 03 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `03` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 04 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `04` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 05 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `05` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 06 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `06` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

- **Bước 07 — `[Placeholder minh họa — Chưa được cung cấp tên bước]`**
  + **Thứ tự:** `07` *(tạm thời theo khung 7 bước sơ bộ)*
  + **Trạng thái mặc định:** `Chưa hoàn thành`
  + **Nội dung / Mô tả công việc:** `Chưa được cung cấp`
  + **Người / Đơn vị chủ trì:** `Chưa được cung cấp`
  + **Đơn vị cần liên hệ / phối hợp:** `Chưa được cung cấp`
  + **Chứng từ / Tài liệu đầu vào:** `Chưa được cung cấp`
  + **Kết quả / Chứng từ đầu ra:** `Chưa được cung cấp`
  + **Rủi ro phát sinh & Cách giải quyết:** `Chưa được cung cấp`

---

## 8. Phần 5: Khu vực Nội dung Chi tiết từng bước (Detail Panel)

Khu vực này hiển thị dạng bảng trượt bên phải trên màn hình lớn (hoặc ngăn kéo/toàn màn hình trên thiết bị nhỏ), kế thừa trải nghiệm từ website mẫu.

### 8.1. Trạng thái rỗng (khi chưa chọn bước nào)
- **Biểu tượng:** `◇`
- **Nội dung hiển thị:**
  > `Chọn một bước trong quy trình báo giá để xem hướng dẫn công việc, đơn vị phối hợp, chứng từ đầu vào/đầu ra và cách xử lý rủi ro.`

### 8.2. Phần đầu bảng chi tiết (`Panel Header`)
- **Nhãn thứ tự:** `Bước [XX] / [Tổng số bước]`
- **Badge trạng thái hiện tại:** `Chưa hoàn thành` *(xám)* / `Đã hoàn thành` *(xanh)*
- **Tiêu đề bước (`H2`):** `[Tên bước chính thức — Chưa được cung cấp]`
- **Nút đóng panel:** `✕` *(aria-label: `Đóng bảng chi tiết bước`)*

### 8.3. Các khối thông tin chi tiết bắt buộc (6 mục theo `Quy_Trinh.md`)

Mỗi bước khi được chọn sẽ trình bày đầy đủ, rõ ràng 6 nhóm thông tin dưới đây. Nếu bất kỳ mục nào chưa có dữ liệu từ tài liệu chính thức, hiển thị thông báo dự phòng chuẩn: **`Chưa được cung cấp (đang chờ tài liệu chính thức).`**

#### Khối 1: Nội dung / Mô tả công việc của bước
- **Tiêu đề khối:** `NỘI DUNG CÔNG VIỆC`
- **Mô tả hướng dẫn hiển thị:** Trình bày chi tiết các đầu việc cần thực hiện tại bước này theo tài liệu quy trình chính thức.
- **Dữ liệu hiện tại:** `Chưa được cung cấp`

#### Khối 2 & 3: Trách nhiệm thực hiện & Phối hợp (tương ứng khối Phân vai trên website mẫu)
- **Tiêu đề khối:** `CHỦ TRÌ & PHỐI HỢP`
- **Trường 2 — Người / Đơn vị chịu trách nhiệm chính:**
  + **Nhãn:** `Chủ trì`
  + **Dữ liệu hiện tại:** `Chưa được cung cấp`
- **Trường 3 — Đơn vị cần liên hệ hoặc phối hợp:**
  + **Nhãn:** `Liên hệ / Phối hợp`
  + **Dữ liệu hiện tại:** `Chưa được cung cấp`

#### Khối 4 & 5: Chứng từ Đầu vào → Kết quả Đầu ra (tương ứng hộp I/O 2 phần trên website mẫu)
- **Tiêu đề khối:** `CHỨNG TỪ ĐẦU VÀO → KẾT QUẢ ĐẦU RA`
- **Hộp trái / trên — Đầu vào cần có:**
  + **Nhãn hộp:** `Chứng từ / Tài liệu đầu vào`
  + **Dữ liệu hiện tại:** `Chưa được cung cấp`
- **Hộp phải / dưới — Kết quả thu được:**
  + **Nhãn hộp:** `Kết quả / Chứng từ đầu ra`
  + **Dữ liệu hiện tại:** `Chưa được cung cấp`

#### Khối 6: Rủi ro có thể phát sinh và cách giải quyết
- **Tiêu đề khối:** `RỦI RO PHÁT SINH & CÁCH GIẢI QUYẾT`
- **Cấu trúc hiển thị cho mỗi rủi ro (kế thừa `.riskitem` của website mẫu):**
  + **Tên / Tình huống rủi ro:** `[Chưa được cung cấp]`
  + **Ảnh hưởng / Diễn giải (nếu có trong tài liệu):** `[Chưa được cung cấp]`
  + **Nhãn cố định giải pháp:** `Cách giải quyết:` `[Chưa được cung cấp]`
- **Dữ liệu hiện tại (khi chưa có tài liệu):** `Chưa được cung cấp`

### 8.4. Khối xác nhận hoàn thành & Điều hướng cuối Panel (`Panel Footer`)
Giúp người dùng thao tác liền mạch ngay sau khi đọc xong hướng dẫn chi tiết của bước:
- **Khung Checkbox đồng bộ:**
  + **Nhãn checkbox:** `Xác nhận đã hoàn thành công việc của bước này`
  + **Ghi chú nhỏ bên dưới:** `Chỉ đánh dấu khi toàn bộ công việc và chứng từ đầu ra của bước đã được thực hiện xong.`
- **Nút điều hướng bước liền kề:**
  + Nút trái: `← Bước trước` *(vô hiệu hóa ở Bước 01)*
  + Nút phải: `Bước tiếp theo →` *(khi ở bước cuối: `Đã ở bước cuối cùng`)*

---

## 9. Phần 6: Khu vực Hướng dẫn sử dụng & Lưu ý vận hành

*(Đặt ở phần dưới trang web, kế thừa cấu trúc `Appendix` + `Note` của website mẫu nhưng tập trung hoàn toàn vào hướng dẫn dùng website quy trình báo giá.)*

### 9.1. Tiêu đề & Giới thiệu phần Hướng dẫn
- **Tiêu đề (`H2`):** `Hướng dẫn sử dụng & Quy ước theo dõi`
- **Mô tả ngắn (`Dek`):** `Bốn thao tác cơ bản để tra cứu thông tin và kiểm soát tiến độ trong mỗi lượt thực hiện báo giá.`

### 9.2. Bảng hướng dẫn thao tác nhanh (4 bước sử dụng Website)

| Thao tác | Cách thực hiện trên website | Kết quả nhận được |
| :--- | :--- | :--- |
| **1. Xem tổng quan quy trình** | Theo dõi danh sách các bước được sắp xếp theo đúng thứ tự từ đầu đến cuối ngay tại màn hình chính. | Nắm toàn bộ trình tự báo giá và nhìn ngay những bước nào đã xong hoặc còn dang dở. |
| **2. Tra cứu chi tiết từng bước** | Nhấn trực tiếp vào một bước bất kỳ trong danh sách (hoặc trên thanh điều hướng nhanh). | Mở bảng thông tin chi tiết gồm 6 mục: nội dung công việc, chủ trì, phối hợp, đầu vào, đầu ra, rủi ro & cách giải quyết. |
| **3. Đánh dấu hoàn thành công việc** | Tick vào ô vuông tại bước vừa xử lý xong (trên thẻ bước hoặc trong bảng chi tiết). | Hệ thống cộng vào tiến độ chung, cập nhật thanh `%` và tự động lưu lại trên trình duyệt hiện tại. |
| **4. Bắt đầu lượt báo giá mới** | Nhấn nút **Clear All** ở thanh tiến độ và chọn **Xác nhận Clear All** trong hộp thoại hiện ra. | Toàn bộ dấu tick trở về trạng thái chưa hoàn thành (`0%`) để dùng lại cho bộ hồ sơ báo giá tiếp theo. |

### 9.3. Hộp Lưu ý quan trọng (`Callout Note`)
*(Kế thừa kiểu hộp `.note` nổi bật của website mẫu)*

> **Bốn điểm cần ghi nhớ khi sử dụng trang quy trình báo giá:**
> **(1) Checkbox dùng để xác nhận hoàn thành công việc thực tế**, không phải chỉ xác nhận bạn đã mở ra đọc. Hãy đảm bảo chứng từ đầu ra của bước đã đầy đủ trước khi đánh dấu.
> **(2) Trạng thái lưu cục bộ trên trình duyệt:** Tiến độ bạn đã đánh dấu được tự động lưu trên chính trình duyệt và thiết bị này (`LocalStorage`). Khi bạn tải lại trang hoặc quay lại sau đó trên cùng trình duyệt, tiến độ vẫn còn nguyên — nhưng **không tự động đồng bộ** sang máy tính khác, trình duyệt khác hay người dùng khác *(trừ khi được nâng cấp đồng bộ ở giai đoạn sau)*.
> **(3) Nút Clear All không làm mất nội dung quy trình:** Lệnh này chỉ xóa các dấu tick hoàn thành của lượt báo giá cũ để bạn bắt đầu một lượt mới. Hộp thoại xác nhận luôn xuất hiện trước khi xóa để tránh bấm nhầm.
> **(4) Nguồn nội dung nghiệp vụ:** Mọi tên bước, thứ tự, đơn vị thực hiện, chứng từ và phương án xử lý rủi ro chỉ được cập nhật theo tài liệu quy trình báo giá chính thức do bên yêu cầu bàn giao.

---

## 10. Phần 7: Chân trang (Footer)

Hiển thị thành 2 vế cân đối (kế thừa bố cục `.fin` ở website mẫu):
- **Vế trái (Nguồn tài liệu):**
  > `Nguồn nội dung nghiệp vụ: Tài liệu quy trình báo giá chính thức ([Tên tài liệu & Ngày ban hành — Chưa được cung cấp]).`
- **Vế phải (Ghi chú lưu trữ & Quản trị):**
  > `Tiến độ hoàn thành chỉ lưu cục bộ trên trình duyệt/thiết bị hiện tại · Đầu mối cập nhật quy trình: [Chưa được cung cấp].`

---

## 11. Phần 8: Các hạng mục chờ xác nhận & Hướng dẫn điền dữ liệu chính thức

*(Phần này phục vụ đội ngũ triển khai và bên yêu cầu đối chiếu trước khi đưa website vào vận hành chính thức; không hiển thị như nội dung nghiệp vụ thật cho người dùng cuối.)*

### 11.1. Bảng các điểm chưa được xác nhận từ bên yêu cầu (theo `Quy_Trinh.md`)

| Hạng mục | Trạng thái hiện tại | Nội dung cần bên yêu cầu chốt trước khi bàn giao cuối |
| :--- | :--- | :--- |
| **Số lượng, thứ tự & tên chính thức các bước** | `Chưa được cung cấp` *(tạm dự kiến ~7 bước)* | Cung cấp tài liệu quy trình báo giá hoàn chỉnh (tên bước, thứ tự, nội dung công việc, chủ trì, phối hợp, đầu vào, đầu ra, rủi ro, giải pháp). |
| **Phạm vi lưu trữ trạng thái** | `Tạm dùng LocalStorage (cục bộ 1 trình duyệt/thiết bị)` | Chốt chỉ cần lưu riêng theo từng thiết bị/trình duyệt hay cần đồng bộ nhiều người dùng trên nhiều thiết bị qua máy chủ/CSDL. |
| **Đăng nhập & Phân quyền** | `Chưa rõ` | Có cần đăng nhập tài khoản, phân quyền xem/tick hay ghi nhận tên người đã đánh dấu hoàn thành hay không. |
| **Lịch sử các lượt thực hiện** | `Chưa rõ` | Chỉ theo dõi 1 lượt hiện tại rồi **Clear All**, hay cần lưu nhật ký các lượt báo giá trước đây. |
| **Tải lên / Tải xuống / In / Xuất tài liệu** | `Chưa rõ` | Có cần đính kèm file báo giá, tải biểu mẫu hay xuất báo cáo/in trang quy trình hay không. |
| **Nhận diện thương hiệu & Tên miền** | `Chưa được cung cấp` | Logo, bộ màu thương hiệu (nếu thay đổi so với giao diện mẫu), tên đơn vị áp dụng, tên miền và nơi triển khai website. |

### 11.2. Hướng dẫn biên tập cho người nhập liệu khi có tài liệu chính thức
Khi bên yêu cầu bàn giao tài liệu quy trình báo giá hoàn chỉnh, người nhập nội dung vào nguồn dữ liệu tách biệt của website cần tuân thủ định dạng copy sau để giữ giao diện đồng đều, dễ đọc:
1. **Tên bước:** Ngắn gọn 5–10 từ, bắt đầu bằng danh từ hành động hoặc động từ (ví dụ theo đúng nguyên văn tài liệu chính thức).
2. **Nội dung công việc:** Chia ý ngắn, mỗi ý 1–2 câu rõ chủ ngữ hoặc động từ thao tác; tránh đoạn văn dài quá 4 dòng liên tục.
3. **Chủ trì & Phối hợp:** Ghi đúng nguyên văn tên chức danh hoặc tên phòng ban theo tài liệu chính thức.
4. **Đầu vào & Đầu ra:** Liệt kê dạng gạch đầu dòng (`bullet list`), mỗi dòng 1 loại chứng từ/kết quả cụ thể để người dùng dễ đối chiếu nhanh.
5. **Rủi ro & Cách giải quyết:** Luôn trình bày theo cặp 1-1: **[Rủi ro có thể phát sinh]** đi kèm ngay bên dưới là **[Cách giải quyết tương ứng]**. Nếu có nội dung nào tài liệu gốc chưa đề cập, tiếp tục giữ rõ dòng **`Chưa được cung cấp`**.
