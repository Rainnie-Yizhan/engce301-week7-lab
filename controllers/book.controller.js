const BookService = require('../services/book.service');

class BookController {
    static async getAll(req, res, next) {
        try {
            const books = await BookService.getAllBooks();
            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const book = await BookService.getBookById(req.params.id);
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    static async search(req, res, next) {
        try {
            const results = await BookService.searchBooks(req.query.q);
            res.json(results);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const result = await BookService.createBook(req.body);
            res.status(201).json({ message: 'เพิ่มหนังสือสำเร็จ', id: result.id });
        } catch (error) {
            next(error);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const bookData = req.body;
            
            // เรียกใช้ Service เพื่ออัปเดตข้อมูล
            const result = await BookService.updateBook(id, bookData);
            
            res.status(200).json({
                success: true,
                message: "Book updated successfully",
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = BookController;