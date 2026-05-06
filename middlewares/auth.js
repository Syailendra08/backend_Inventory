const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')
const { auth_secret } = require('../config/base.config')

module.exports = {
    // next: parameter , untuk melajutkan req, kalo udah di cek middlewarenya melanjutkan ke controller pake next

    checkToken: async (req, res, next) => {
        // token diambil dari header
        const token = req.header("Authorization");
        if (!token) {
            // 401: err untuk pengguna yg blm login (unauthorized)
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));
        }

        try {
            // cek token aktif atau engga
            const check = jwt.verify(token, auth_secret);
            //karena nanti pengguna perlu data identitas engguna (userId atau yg lain), panggil payload yg dikirim jew.sign() di loginController. data pauyload tersimpan di const ceck (hasil Verify) ada {userId,name, email}
            req.user = check;
            next(); // lanjutkan prosses routing yg diatas
        } catch (error) {
            /// jika terjadi error, ini hubungannya dengan token. jd kasi 401 suru login lagi
            return res.status(401).json(response(401, "unauthorized", "Please login and try again!"));

        }

    }
}