const BookDB = require('../database/books');

class BookService {
    static async getAllBooks() {
        return await BookDB.findAll();
    }

    static async getBookById(id) {
        const book = await BookDB.findById(id);
        if (!book) throw new Error('ไม่พบข้อมูลหนังสือในระบบ');
        return book;
    }

    static async searchBooks(keyword) {
        if (!keyword) return await BookDB.findAll();
        return await BookDB.search(keyword);
    }

    static async createBook(bookData) {
        // ตรวจสอบข้อมูลเบื้องต้น
        if (!bookData.title || !bookData.isbn) {
            throw new Error('กรุณาระบุชื่อหนังสือและ ISBN');
        }
        return await BookDB.create(bookData);
    }
}

module.exports = BookService;