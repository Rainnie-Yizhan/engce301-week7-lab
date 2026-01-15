const MemberService = require('../services/member.service');

class MemberController {
    static async getAll(req, res, next) {
        try {
            const members = await MemberService.getAllMembers();
            res.json(members);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const member = await MemberService.getMemberById(req.params.id);
            res.json(member);
        } catch (error) {
            next(error);
        }
    }

    static async register(req, res, next) {
        try {
            const result = await MemberService.registerMember(req.body);
            res.status(201).json({ message: 'ลงทะเบียนสมาชิกสำเร็จ', id: result.id });
        } catch (error) {
            next(error);
        }
    }

    // controllers/members.controller.js
static async update(req, res) {
    try {
        const { id } = req.params;
        const result = await MemberService.updateMember(id, req.body);
        res.status(200).json({ success: true, message: "Member updated successfully", data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
}

module.exports = MemberController;