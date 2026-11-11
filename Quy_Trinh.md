# 🗺️ Quy Trình --- Xây dựng website quy trình báo giá

------------------------------------------------------------------------

## 1. ĐỀ BÀI --- *bài toán cần giải quyết*

Xây dựng một website hiển thị và hỗ trợ theo dõi **duy nhất một quy
trình báo giá**, dự kiến gồm khoảng 7 bước sơ bộ.

Website cần có giao diện tham khảo website mẫu do bên yêu cầu cung cấp.
Mục tiêu ưu tiên là **giống website mẫu về giao diện**; cách sử dụng và
tương tác có thể linh hoạt điều chỉnh để thuận tiện hơn cho người dùng.

Người dùng có thể xem tổng quan các bước trong quy trình, chọn một bước
để xem thông tin chi tiết và đánh dấu bước đó là đã hoàn thành. Website
nên lưu lại trạng thái đã đánh dấu để người dùng quay lại vẫn thấy tiến
độ trước đó. Đồng thời cần có nút **Clear All** để xóa toàn bộ dấu tick,
bắt đầu một lượt thực hiện mới.

**Lưu ý về nội dung nghiệp vụ:** Bên yêu cầu sẽ cung cấp quy trình báo
giá hoàn chỉnh. Vì vậy, trong giai đoạn này không tự tạo hoặc suy đoán
tên bước, thứ tự bước hay nội dung nghiệp vụ. Con số khoảng 7 bước chỉ
là số lượng sơ bộ, cần cập nhật theo tài liệu chính thức.

Khi người dùng nhấn vào một bước, website cần trình bày các thông tin: -
Nội dung/mô tả công việc của bước. - Người hoặc đơn vị chịu trách nhiệm
chính (chủ trì). - Đơn vị cần liên hệ hoặc phối hợp. - Chứng từ/tài liệu
đầu vào cần có. - Kết quả hoặc chứng từ đầu ra thu được. - Rủi ro có thể
phát sinh và cách giải quyết.

------------------------------------------------------------------------

## 2. Output --- *Cái đích đó gồm những phần nào? Liệt kê những output mà bạn mong muốn*

1.  **Trang tổng quan quy trình báo giá**
    -   Hiển thị tên quy trình và phần giới thiệu ngắn.
    -   Hiển thị danh sách/timeline các bước theo đúng thứ tự.
    -   Giao diện có phong cách và cách trình bày tương đồng với website
        mẫu.
    -   Có thể linh hoạt cải thiện cách tương tác nếu giúp người dùng dễ
        sử dụng hơn.
2.  **Thông tin tiến độ thực hiện**
    -   Hiển thị tổng số bước.
    -   Hiển thị số bước đã hoàn thành và chưa hoàn thành.
    -   Có thanh hoặc thành phần trực quan thể hiện tỷ lệ hoàn thành.
    -   Mỗi bước thể hiện rõ trạng thái đã hoàn thành/chưa hoàn thành.
3.  **Phần nội dung chi tiết của từng bước** Khi người dùng chọn một
    bước, hiển thị đầy đủ:
    -   Nội dung bước.
    -   Người/đơn vị chủ trì.
    -   Đơn vị liên hệ/phối hợp.
    -   Chứng từ/tài liệu đầu vào.
    -   Kết quả/chứng từ đầu ra.
    -   Rủi ro và cách giải quyết.
4.  **Chức năng đánh dấu hoàn thành và lưu trạng thái**
    -   Checkbox dùng để đánh dấu công việc của bước đã hoàn thành,
        không phải chỉ xác nhận đã đọc.
    -   Người dùng có thể đánh dấu hoặc bỏ đánh dấu từng bước.
    -   Trạng thái được lưu lại để khi quay lại website vẫn còn.
    -   Có nút **Clear All** để xóa toàn bộ dấu tick của lượt thực hiện
        trước.
    -   Nên có hộp thoại xác nhận trước khi Clear All để tránh xóa nhầm.
5.  **Website hoàn chỉnh, dễ cập nhật và bàn giao**
    -   Nội dung quy trình được tổ chức rõ ràng để dễ cập nhật khi bên
        yêu cầu cung cấp tài liệu chính thức.
    -   Giao diện dễ nhìn, dễ thao tác và hiển thị phù hợp trên các kích
        thước màn hình cần hỗ trợ.
    -   Source code có cấu trúc dễ bảo trì.
    -   Có hướng dẫn cơ bản để chạy và sử dụng website.

------------------------------------------------------------------------

## 3. Input --- *Thông tin CHỈ TÔI biết (thông tin, quyết định,...) mà Agent không tự biết*

### Thông tin đã được bên yêu cầu xác nhận

-   Website mẫu được cung cấp để tham khảo giao diện:
    https://agent-6a6c90ea74be9b58--gleaming-rolypoly-980941.netlify.app/
-   Mong muốn giống website mẫu về **giao diện**; cách sử dụng có thể
    linh hoạt.
-   Chỉ đưa lên website **một quy trình duy nhất là quy trình báo giá**.
-   Quy trình hiện được mô tả sơ bộ là khoảng **7 bước**.
-   Nội dung quy trình hoàn chỉnh sẽ do bên yêu cầu cung cấp.
-   Khi chọn một bước, người dùng cần xem:
    -   Nội dung bước.
    -   Người/đơn vị chủ trì.
    -   Đơn vị cần liên hệ/phối hợp.
    -   Chứng từ đầu vào.
    -   Kết quả/chứng từ đầu ra.
    -   Rủi ro và cách giải quyết.
-   Checkbox có chức năng đánh dấu công việc đã hoàn thành.
-   Mong muốn lưu lại trạng thái đã tick khi người dùng quay lại
    website.
-   Cần có nút **Clear All** để xóa các dấu tick trước đó và bắt đầu
    lượt thực hiện mới.

### Thông tin nghiệp vụ sẽ được cung cấp sau

Bên yêu cầu chịu trách nhiệm cung cấp quy trình báo giá hoàn chỉnh. Với
từng bước, cần sử dụng đúng thông tin trong tài liệu được bàn giao, bao
gồm: - Tên bước và thứ tự. - Nội dung công việc. - Người/đơn vị chủ
trì. - Đơn vị phối hợp. - Chứng từ/tài liệu đầu vào. - Kết quả/chứng từ
đầu ra. - Rủi ro có thể xảy ra. - Cách giải quyết rủi ro.

Không tự suy đoán hoặc tự điền nội dung nghiệp vụ khi chưa có tài liệu
chính thức. Nếu thiếu thông tin, ghi rõ **"Chưa được cung cấp"** hoặc để
chờ xác nhận.

### Những điểm chưa được xác nhận

-   Số lượng và tên chính thức của các bước (hiện chỉ biết khoảng 7 bước
    sơ bộ).
-   Trạng thái hoàn thành cần lưu riêng trên trình duyệt/thiết bị hay
    đồng bộ cho nhiều người dùng trên các thiết bị khác nhau.
-   Có cần đăng nhập, phân quyền hoặc ghi nhận người đã đánh dấu hoàn
    thành hay không.
-   Có cần lưu lịch sử các lần thực hiện quy trình hay không.
-   Có cần chức năng tải lên, tải xuống, in hoặc xuất tài liệu hay
    không.
-   Logo, màu sắc thương hiệu, tên miền và nơi triển khai website (nếu
    có yêu cầu riêng).

**Định hướng tạm thời nếu chưa có yêu cầu đồng bộ:** có thể dùng
LocalStorage để lưu trạng thái trên cùng trình duyệt/thiết bị. Cách này
không đồng bộ trạng thái giữa nhiều người hoặc nhiều thiết bị. Cần xác
nhận lại với bên yêu cầu trước khi xem đây là giải pháp cuối cùng.

------------------------------------------------------------------------

## 4. Các bước triển khai --- *Chia làm mấy bước, mỗi bước cần kiểm tra gì?*

### 1. Khảo sát website mẫu và xác định bố cục

-   Truy cập website mẫu, quan sát cách bố trí giao diện, màu sắc, kiểu
    chữ, khoảng cách, cách trình bày các bước và phần chi tiết.
-   Xác định những thành phần giao diện cần tái hiện.
-   Đề xuất cách tương tác phù hợp, không bắt buộc sao chép nguyên xi
    thao tác của website mẫu.
-   Xác định các màn hình/khu vực chính của website quy trình báo giá.

-\> **Check 1:** - Đã hiểu phong cách và bố cục chính của website mẫu. -
Phạm vi chỉ gồm một quy trình báo giá. - Có phương án bố trí danh sách
bước, chi tiết bước và tiến độ hoàn thành. - Không tự thêm các quy trình
hoặc chức năng nghiệp vụ ngoài phạm vi.

### 2. Thiết kế cấu trúc dữ liệu và khung website

-   Thiết kế cấu trúc dữ liệu cho một bước, gồm: thứ tự, tên bước, nội
    dung, chủ trì, phối hợp, đầu vào, đầu ra, rủi ro và cách giải quyết.
-   Tách dữ liệu quy trình khỏi phần component giao diện để dễ cập nhật.
-   Tạo khung trang tổng quan và khu vực hiển thị chi tiết bước.
-   Trong thời gian chưa có tài liệu chính thức, chỉ dùng dữ liệu
    placeholder được ghi rõ là minh họa; không trình bày dữ liệu giả
    định như thông tin thật.

-\> **Check 2:** - Cấu trúc dữ liệu đáp ứng đủ các trường thông tin đã
thống nhất. - Có thể thay đổi tên, thứ tự, số lượng bước mà không phải
sửa nhiều phần giao diện. - Nội dung nghiệp vụ không bị hard-code rải
rác trong các component.

### 3. Xây dựng giao diện quy trình và chi tiết từng bước

-   Xây dựng trang tổng quan theo phong cách website mẫu.
-   Hiển thị các bước theo thứ tự.
-   Cho phép người dùng chọn một bước để xem nội dung chi tiết.
-   Trình bày rõ ràng các nhóm thông tin: nội dung, chủ trì, phối hợp,
    chứng từ đầu vào, kết quả đầu ra, rủi ro và cách giải quyết.
-   Hiển thị trạng thái hoàn thành/chưa hoàn thành của từng bước.
-   Điều chỉnh bố cục để dễ sử dụng trên các kích thước màn hình cần hỗ
    trợ.

-\> **Check 3:** - Người dùng xem được danh sách các bước. - Chọn đúng
bước thì hiển thị đúng phần chi tiết tương ứng. - Các nhóm thông tin
được trình bày rõ ràng, không nhầm lẫn. - Giao diện giữ được phong cách
gần với website mẫu và không bị vỡ bố cục.

### 4. Xây dựng chức năng hoàn thành, lưu trạng thái và Clear All

-   Tạo checkbox để người dùng đánh dấu bước đã hoàn thành.
-   Khi trạng thái thay đổi, cập nhật trạng thái của bước và tiến độ
    tổng thể.
-   Tự động lưu trạng thái đã tick.
-   Khi người dùng quay lại website, khôi phục trạng thái đã lưu theo
    phạm vi lưu trữ đã thống nhất.
-   Tạo nút **Clear All**.
-   Yêu cầu xác nhận trước khi xóa toàn bộ trạng thái.
-   Clear All chỉ xóa trạng thái hoàn thành, không xóa nội dung quy
    trình.

-\> **Check 4:** - Có thể tick và bỏ tick từng bước. - Số bước hoàn
thành và tỷ lệ tiến độ được cập nhật chính xác. - Tải lại website vẫn
giữ trạng thái trên cùng môi trường lưu trữ. - Clear All đưa toàn bộ
bước về trạng thái chưa hoàn thành. - Nội dung quy trình vẫn được giữ
nguyên sau khi Clear All.

### 5. Nhập quy trình chính thức, kiểm thử và bàn giao

-   Tiếp nhận tài liệu quy trình báo giá hoàn chỉnh từ bên yêu cầu.
-   Cập nhật đúng số lượng, tên, thứ tự và nội dung từng bước theo tài
    liệu.
-   Điền đầy đủ thông tin chủ trì, phối hợp, đầu vào, đầu ra, rủi ro và
    giải pháp theo dữ liệu được cung cấp.
-   Kiểm tra nội dung hiển thị với tài liệu nguồn.
-   Kiểm thử thao tác xem bước, đánh dấu hoàn thành, lưu trạng thái và
    Clear All.
-   Kiểm tra giao diện trên các kích thước màn hình cần hỗ trợ.
-   Sửa lỗi và chuẩn bị source code cùng hướng dẫn chạy/bàn giao.

-\> **Check 5:** - Nội dung website khớp với quy trình chính thức do bên
yêu cầu cung cấp. - Không còn nội dung placeholder hoặc nghiệp vụ tự suy
đoán trong bản bàn giao. - Các chức năng chính hoạt động đúng. - Trạng
thái được lưu và xóa đúng theo yêu cầu đã thống nhất. - Website và
source code sẵn sàng bàn giao.

------------------------------------------------------------------------

## Ghi chú quan trọng cho Agent

-   Không tự tạo thêm bước nghiệp vụ cho quy trình báo giá.
-   Không tự đặt tên phòng ban, người chủ trì, chứng từ, rủi ro hoặc
    cách giải quyết.
-   Khoảng 7 bước chỉ là thông tin sơ bộ; tài liệu chính thức của bên
    yêu cầu là nguồn quyết định.
-   Checkbox biểu thị **công việc đã hoàn thành**.
-   Clear All chỉ xóa các dấu tick/trạng thái tiến độ, không xóa dữ liệu
    quy trình.
-   Nếu dùng LocalStorage, phải ghi rõ trạng thái chỉ lưu trên trình
    duyệt/thiết bị đó; không được mô tả là đồng bộ nhiều người.
-   Những yêu cầu chưa được xác nhận phải được ghi nhận là chưa rõ,
    không tự quyết định thay bên yêu cầu.

------------------------------------------------------------------------

> **Dùng quy trình này thế nào?**
>
> Điền và triển khai theo thứ tự từ ① đến ④. Những thông tin nghiệp vụ
> chưa có thì ghi rõ "Chưa được cung cấp", không tự suy diễn.
>
> Tài liệu này mô tả yêu cầu xây dựng website và kế hoạch triển khai.
> Nội dung chi tiết của quy trình báo giá sẽ được cập nhật sau khi bên
> yêu cầu cung cấp tài liệu hoàn chỉnh.
>
> **Nhìn rõ phạm vi rồi mới làm: ưu tiên đúng giao diện, đúng chức năng
> và dễ cập nhật nội dung.**
