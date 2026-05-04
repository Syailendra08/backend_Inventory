const multer = require("multer")
//  path : agar bisa mengakses folder file di project
const path = require("path")

// proses upload multe disimpan di middleware karena :
//  middleware : penghubung/tengah proses (route - middleware - controller)
// sblm file di akses controller, oleh middleware di proses dlu agar siap digunakan

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file yg diupload akan disimpan di folder project ini bagian uploads
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // ngambil ekstensi dari nama asli file
    const ext = path.extname(file.originalname)
    // uniqueSuffix isinya nama file random, ext isinya .jpg jadi perlu digabung
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name)
  }
})

module.exports = multer({ storage: storage })