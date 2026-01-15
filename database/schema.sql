-- ============================================
-- Library Management System Database Schema
-- ============================================

PRAGMA foreign_keys = ON;

-- ===== BOOKS TABLE =====
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK(total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK(available_copies >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== MEMBERS TABLE =====
-- สร้าง table members ตามโจทย์
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    membership_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Suspended', 'Expired'))
);

-- ===== BORROWINGS TABLE =====
-- สร้าง table borrowings พร้อม Foreign Keys
CREATE TABLE IF NOT EXISTS borrowings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT DEFAULT 'Borrowed' CHECK(status IN ('Borrowed', 'Returned', 'Overdue')),
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

-- สร้าง indexes สำหรับ members และ borrowings ตามโจทย์
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_borrowings_book_id ON borrowings(book_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_member_id ON borrowings(member_id);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);


-- ===== SAMPLE DATA: Books =====
INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 3, 3),
    ('Design Patterns', 'Gang of Four', '978-0201633610', 'Programming', 2, 2),
    ('The Pragmatic Programmer', 'Hunt & Thomas', '978-0135957059', 'Programming', 2, 1),
    ('Introduction to Algorithms', 'CLRS', '978-0262033848', 'Computer Science', 5, 5),
    ('Database System Concepts', 'Silberschatz', '978-0078022159', 'Database', 3, 2);

-- ===== SAMPLE DATA: Members =====
-- Insert สมาชิก 3 คน
INSERT INTO members (name, email, phone) VALUES
    ('สมชาย ใจดี', 'somchai@email.com', '081-234-5678'),
    ('John Doe', 'john.doe@example.com', '089-999-8888'),
    ('วิภาดา รักเรียน', 'wipada@email.com', '085-111-2222');

-- ===== SAMPLE DATA: Borrowings =====
-- Insert การยืม 3 รายการ
INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, return_date, status) VALUES
    (1, 1, '2026-01-01', '2026-01-08', '2026-01-07', 'Returned'), -- คืนแล้ว
    (3, 2, '2026-01-10', '2026-01-17', NULL, 'Borrowed'),         -- กำลังยืมอยู่
    (5, 3, '2026-01-12', '2026-01-19', NULL, 'Borrowed');         -- กำลังยืมอยู่