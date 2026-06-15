# Electronics Store Backend

## Mục đích
Tài liệu này mô tả cấu trúc backend, công dụng từng phần và các API chính. Nó giúp người mới đọc nhanh và sử dụng server đúng cách.

## Cấu trúc thư mục

- `server.js` - entry point của ứng dụng, cấu hình middleware, register các routes và kết nối MongoDB.
- `config/db.js` - kết nối đến MongoDB qua Mongoose.
- `models/` - định nghĩa các schema Mongoose cho database.
- `controllers/` - xử lý logic nghiệp vụ, xác thực dữ liệu, tương tác với database.
- `routes/` - định nghĩa các đường dẫn API và ánh xạ đến controller tương ứng.
- `.env` - lưu cấu hình bảo mật như `DB_STRING`.

## Cài đặt và chạy

1. `cd backend`
2. `npm install`
3. Tạo file `.env` với `DB_STRING` đúng.
4. `npm start`

## Biến môi trường

- `DB_STRING` - chuỗi kết nối MongoDB.
- `PORT` - cổng chạy server (mặc định `8000`).

## API chính

### Người dùng (Users)
- `GET /users` - lấy danh sách user
- `POST /users` - tạo user mới

### Danh mục (Categories)
- `GET /categories` - lấy danh sách danh mục
- `POST /categories` - tạo danh mục mới

### Sản phẩm (Products)
- `GET /products` - lấy danh sách sản phẩm
- `POST /products` - tạo sản phẩm mới
- `PUT /products/:id` - cập nhật sản phẩm
- `DELETE /products/:id` - xóa sản phẩm

### Đơn hàng (Orders)
- `GET /orders` - lấy danh sách đơn hàng
- `POST /orders` - tạo đơn hàng mới
- `PUT /orders/:id/status` - cập nhật trạng thái đơn hàng

### Giỏ hàng (Cart)
- `GET /cart?user_id=<id>` - lấy giỏ hàng của user
- `POST /cart/add` - thêm sản phẩm vào giỏ hàng
- `POST /cart/remove` - xóa sản phẩm khỏi giỏ hàng

### Thanh toán (Payments)
- `GET /payments` - lấy danh sách thanh toán
- `POST /payments` - tạo bản ghi thanh toán

### Đánh giá (Reviews)
- `GET /reviews` - lấy danh sách đánh giá
- `POST /reviews` - tạo đánh giá mới

### Lịch sử đơn hàng (Order History)
- `GET /order-history?user_id=<id>` - lấy lịch sử đơn hàng của user
- `POST /order-history` - thêm bản ghi lịch sử đơn hàng

## Ghi chú

- Tất cả dữ liệu cần được gửi bằng `JSON`.
- Controller chịu trách nhiệm kiểm tra trường bắt buộc và trả lỗi 400 nếu thiếu dữ liệu.
- Mật khẩu người dùng được hash bằng bcrypt trước khi lưu.
