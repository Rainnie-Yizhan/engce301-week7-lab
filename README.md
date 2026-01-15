ขั้นตอนที่ 1: Setup
mkdir week7-lab
cd week7-lab
npm init -y
npm install express cors sqlite3
npm install --save-dev nodemon
ขั้นตอนที่ 2: สร้างโครงสร้าง
mkdir database services controllers routes
touch server.js README.md
API Endpoints 
ต้องมี 15 Endpoints:

Books API (5 endpoints)
GET    /api/books              # ดึงหนังสือทั้งหมด
GET    /api/books/:id          # ดึงหนังสือ 1 เล่ม
GET    /api/books/search?q=    # ค้นหาหนังสือ
POST   /api/books              # เพิ่มหนังสือ
PUT    /api/books/:id          # แก้ไขหนังสือ
Members API (4 endpoints)
GET    /api/members            # ดึงสมาชิกทั้งหมด
GET    /api/members/:id        # ดึงสมาชิก 1 คน
POST   /api/members            # เพิ่มสมาชิก
PUT    /api/members/:id        # แก้ไขสมาชิก
Borrowings API (6 endpoints)
GET    /api/borrowings                    # ดึงรายการยืมทั้งหมด
GET    /api/borrowings/:id                # ดึงรายการยืม 1 รายการ
GET    /api/borrowings/member/:memberId   # ดึงรายการยืมของสมาชิก
POST   /api/borrowings/borrow             # ยืมหนังสือ
PUT    /api/borrowings/:id/return         # คืนหนังสือ
GET    /api/borrowings/overdue            # ดูรายการเกินกำหนด
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