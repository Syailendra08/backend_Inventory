const { response } = require("express");

module.exports = {
    // response : nama key object yg akan dipanggil pas export/require di file lain
    response: (status, message, data) => {
        if (data) {
            //  kalau respons nya ada data
            return {
                status: status,
                message: message,
                data: data,
            }
        } else {
            // kalau response gak ada data (misal error) hasil di postman jangan kirim key data di json nya
            return {
                status: status,
                message: message,
            }
        }
    }
}