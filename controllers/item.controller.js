const Validator = require("fastest-validator");
const v = new Validator();
const { Item } = require('../models')
const { response } = require('../helpers/response.formatter')

module.exports = {
    createItem: async (req, res, ) => {
        try {
            // ambil inputan (payload) : req.body
            const {name, stock} = req.body;
           
            //validasi
            const schema = {
                name: {type: "string", min: 3},
                stock: {type: "number", positive: true, integer: true},

            }

            //menyiapkan data yang akan divalidasi
            const data = {
                name: name, // field database: nama dari Req
                stock: Number(stock) // karena req.bdy json berupa string, jd stock diubah ke tipe data number pake Number
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                // jika hasil validate ada error
                return res.status(400).json(response(400, "Validasi Error", 
                    validate));

            }
            // cek jika image tidak diuupload 
            if (!req.file) {
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }
            //prossess menyimpan melalui
            const item = await Item.create({
                name: data.name, // ambil dari obejct data yang divalidasi sblmnya
                stock: data.stock,
                image: req.file.filename // ambil filename hasil dari middleware multer
            });
            return res.status(201).json(response(201, 'created', item));
        } catch (error) {
            //penanganan err kodingan di try
            // res: parameter func untuk memberikan response (hasil)
            return res.status(500).json(response(500, "Server Error", error.message ));
        }

        
    },
    getItem: async (req, res) => {
            try {
                const items = await Item.findAll();
                return res.status(200).json(response(200, "success", items));
            } catch (error) {
                return res.status(500).json(response(500, "Server Error", error.message))

            }
        },
}