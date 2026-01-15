const MemberDB = require('../database/members');

class MemberService {
    static async getAllMembers() {
        return await MemberDB.findAll();
    }

    static async getMemberById(id) {
        const member = await MemberDB.findById(id);
        if (!member) throw new Error('ไม่พบสมาชิกรายนี้');
        return member;
    }

    static async registerMember(memberData) {
        // ตรวจสอบอีเมลซ้ำ
        const existing = await MemberDB.findByEmail(memberData.email);
        if (existing) {
            throw new Error('อีเมลนี้ถูกใช้งานแล้วในระบบ');
        }
        return await MemberDB.create(memberData);
    }

    static async updateMember(id, memberData) {
        // 1. ตรวจสอบว่ามีสมาชิกรายนี้อยู่จริงไหม
        const existingMember = await MemberDB.findById(id);
        if (!existingMember) {
            throw new Error('Member not found');
        }

        // 2. ส่งข้อมูลไปอัปเดตที่ Database
        await MemberDB.update(id, memberData);

        // 3. ดึงข้อมูลที่อัปเดตแล้วกลับมาแสดงผล
        return await MemberDB.findById(id);
    }
}

module.exports = MemberService;