# 📚 Library Management System API (Week 7 Lab)

ระบบบริหารจัดการห้องสมุดที่พัฒนาด้วย Node.js, Express และ SQLite3 เพื่อจัดการข้อมูลหนังสือ สมาชิก และการยืม-คืน

---

## 🛠️ ขั้นตอนที่ 1: Setup (การติดตั้ง)
รันคำสั่งเหล่านี้ใน Terminal เพื่อเตรียมสภาพแวดล้อม:

```bash
mkdir week7-lab
cd week7-lab
npm init -y
npm install express cors sqlite3
npm install --save-dev nodemon
ขั้นตอนที่ 2: สร้างโครงสร้าง
mkdir database services controllers routes
touch server.js README.md
```
API Endpoints 
ต้องมี 15 Endpoints:

## 🚀 API Endpoints (15 รายการ)

### Books API (5 endpoints)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/books` | ดึงหนังสือทั้งหมด |
| GET | `/api/books/:id` | ดึงหนังสือ 1 เล่ม |
| GET | `/api/books/search?q=` | ค้นหาหนังสือ |
| POST | `/api/books` | เพิ่มหนังสือ |
| PUT | `/api/books/:id` | แก้ไขหนังสือ |

### Borrowings API (6 endpoints)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/borrowings` | ดึงรายการยืมทั้งหมด |
| PUT | `/api/borrowings/:id/return` | คืนหนังสือ |
| GET | `/api/borrowings/overdue` | ดูรายการเกินกำหนด |
Test Case 1: Borrow Book (Success)
![Borrow Book (Success)](./assets/Test%20Case%201:%20Borrow%20Book%20(Success).png)
Test Case 2: Borrow Book (Fail - No copies)
![Borrow Book (Fail - No copies)](./assets/Test%20Case%202:%20Borrow%20Book%20(Fail%20-%20No%20copies).png)
Test Case 3: Return Book (With Fine)
![Return Book (With Fine)](./assets/Test%20Case%203:%20Return%20Book%20(With%20Fine).png)
ER Diagram (Draw.io หรือ dbdiagram.io)
```mermaid
erDiagram
    BOOKS ||--o{ BORROWINGS : "has"
    MEMBERS ||--o{ BORROWINGS : "performs"
    
    BOOKS {
        int id PK
        string title
        string author
        int available_copies
    }
    MEMBERS {
        int id PK
        string name
        string status
    }
    BORROWINGS {
        int id PK
        int book_id FK
        int member_id FK
        date borrow_date
        date due_date
        string status
    }
