# AI Project Bootstrap

APB là công cụ nhỏ để khởi tạo dự án phần mềm có AI agent hỗ trợ. Mục tiêu của APB là tạo sẵn cấu trúc làm việc chung: luật cho agent, kế hoạch, tài liệu, review, và nơi lưu tri thức dự án.

## APB hiện làm gì

Phiên bản v0.1 cố ý đơn giản:

- Sao chép bộ template vào dự án mới.
- Thay `{{PROJECT_NAME}}` bằng tên thư mục dự án.
- Tạo cấu trúc `.agent/` để agent và chủ dự án làm việc có kỷ luật.
- Cung cấp lệnh render tài liệu BA thành tóm tắt dự án.

APB chưa có manifest, hook, profile, blueprint, plugin, orchestration, hoặc tự động merge vào dự án đã có sẵn file.

## Yêu cầu

- Node.js 18 trở lên.
- npm.
- Một thư mục đích chưa tồn tại hoặc đang trống.

## Cài để dùng trên máy

Từ thư mục repo này:

```bash
cd apb
npm link
```

Sau khi link, máy sẽ có 2 lệnh:

```text
create-apb
apb-render-project-info
```

Kiểm tra:

```bash
which create-apb
which apb-render-project-info
```

Nếu không muốn dùng `npm link`, có thể chạy trực tiếp từ repo:

```bash
npm run create-apb -- ../my-project
npm run render-project-info -- ../my-project/input/ba-description.md ../my-project
```

## Tạo dự án mới

Dùng lệnh đã link:

```bash
create-apb ../my-project
```

Hoặc chạy trực tiếp:

```bash
node bin/create-apb.js ../my-project
```

Thư mục đích có thể chưa tồn tại hoặc đang trống. Nếu thư mục đã có file, APB sẽ dừng để tránh ghi đè hoặc merge sai.

Sau khi tạo xong, bắt đầu từ các file này:

```text
AGENTS.md
.agent/AGENTS.md
.agent/project-context.md
.agent/planning/00-bootstrap.md
.agent/planning/01-task-list.md
```

Prompt gợi ý cho coding agent:

```text
Read AGENTS.md and begin the APB bootstrap workflow for this project.
```

## Render tài liệu BA

Render một file BA thành thông tin dự án:

```bash
apb-render-project-info ../my-project/input/ba-description.md ../my-project
```

Hoặc truyền vào một thư mục chứa nhiều tài liệu:

```bash
apb-render-project-info ../my-project/input/docs ../my-project
```

Nếu chạy trực tiếp từ repo:

```bash
node bin/apb-render-project-info.js ../my-project/input/ba-description.md ../my-project
```

Kết quả được tạo ở:

```text
.agent/planning/02-project-summary.md
```

Renderer đọc `.md`, `.txt`, và `.docx`, trích các phần có thể nhận diện, và để lại câu hỏi mở cho phần còn thiếu. File không hỗ trợ sẽ được liệt kê trong summary thay vì làm hỏng toàn bộ quá trình.

APB không ghi đè `.agent/planning/02-project-summary.md` nếu file này đã tồn tại. Hãy review hoặc đổi tên file cũ trước khi render lại.

## Cấu trúc dự án được tạo

```text
README.md
AGENTS.md
CLAUDE.md
.agent/
  AGENTS.md
  business-rules.md
  naming-conventions.md
  project-context.md
  artifacts/
  architecture-decisions/
    README.md
    template.md
  docs/
    README.md
  planning/
    00-bootstrap.md
    01-task-list.md
  previews/
  review-history/
    README.md
  reviews/
```

Tài liệu dành cho agent nằm trong `.agent/`.

Root `AGENTS.md` và `CLAUDE.md` là file cầu nối mỏng về `.agent/AGENTS.md`. APB giữ `.agent/AGENTS.md` làm nguồn sự thật chung, còn `CLAUDE.md` tồn tại để Claude nhận đúng entry point.

## Quy trình làm việc

Dự án được tạo bởi APB dùng quy trình review-first:

```text
Planning
Planning Review
Freeze Planning
Implementation Design
Design Review
Freeze Design
Milestone Implementation
Code Review
Fix Feedback
Update Documentation
Update Agent Knowledge
```

`.agent/project-context.md` là project brief bền vững để agent mới hiểu dự án làm gì, phục vụ ai, phạm vi nào được làm, phạm vi nào không làm, workflow chính, thuật ngữ domain, constraint, và câu hỏi mở. Khi bootstrap lần đầu, agent hỏi mô tả dự án một lần để sinh file này; sau khi file đã có nội dung thì các lần sau chỉ đọc lại và cập nhật khi context thật sự thay đổi.

Template planning tách rõ yêu cầu đã xác nhận, giả định, câu hỏi mở, rủi ro, phạm vi không làm, và kế hoạch kiểm chứng khi task có độ mơ hồ, rủi ro, hoặc ảnh hưởng triển khai đáng kể. Với task known-known nhỏ như sửa typo, đổi text, hoặc thêm config đơn giản, agent chỉ cần nêu assumption, risk, hoặc validation note nếu chúng thật sự tồn tại.

## Dự án đã có sẵn

APB v0.1 chưa tự khởi tạo vào thư mục dự án đã có file.

Nếu thư mục đích không trống, `create-apb` sẽ dừng. Hiện tại hãy dùng APB với thư mục mới hoặc thư mục trống.

## Xử lý lỗi thường gặp

Nếu không tìm thấy `create-apb` sau khi `npm link`, kiểm tra npm global bin path:

```bash
npm bin -g
```

Nếu thư mục đích không trống, tạo thư mục mới hoặc chờ command hỗ trợ existing project trong phiên bản sau.

Nếu `apb-render-project-info` báo file output đã tồn tại, review `.agent/planning/02-project-summary.md` trước khi quyết định xoá, đổi tên, hoặc archive.

## README tiếng Anh

Nội dung hướng dẫn tiếng Anh trước đây đã được backup dạng bảng tại `README.en.md`.

## Trạng thái publish

Repo này đã sẵn sàng để public trên GitHub.

Package vẫn giữ `"private": true` vì APB v0.1 chưa chuẩn bị để publish lên npm registry. Public GitHub repo và publish npm package là 2 quyết định khác nhau.

## Giấy phép

MIT. Xem `LICENSE`.
