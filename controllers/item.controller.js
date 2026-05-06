const Validator = require("fastest-validator");
const v = new Validator();
const { Item } = require('../models')
const { response } = require('../helpers/response.formatter');

const { Op, where } = require("sequelize");
const fs = require('fs'); // file system , melakukan sesuai yan berhubungan dengan lokasi file
const path = require('path');

module.exports = {
    createItem: async (req, res,) => {
        try {
            // ambil inputan (payload) : req.body
            const { name, stock } = req.body;

            //validasi
            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true },

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
            return res.status(500).json(response(500, "Server Error", error.message));
        }


    },
    getItem: async (req, res) => {
        try {
            // req query: ambil params di postman / ambil data acuan untuk search/sort
            /// sortBy: ngurutin berdasarkan field apa
            //order: ASC/DESC, opsi pengurutnan
            const { name, sortBy, order, page, limit  } = req.query;
            const offset = (Number(page)-1) * Number(limit); 

            const {count, rows} = await Item.findAndCountAll({
                offset: Number(offset),
                limit: Number(limit),
                where: name ? {
                    name: {
                        [Op.like]: `%${name}%` // mencari yg mirip
                    }
                } : {}, 
                // kalau di params pastikan ada sortBy dan order, jalanin penurutan, klo gaada pake default, misal sortBy 'stock order 'DESC'
                order: sortBy && order ? [
                    [sortBy, order]
                ] : [] 
                // taro berdasarkan field name di db dari name req.query
            });

            const formatPagination = {
                data: rows, // data yang dimunculkan
                limit: limit,
                rows: (Number(offset)+1) + "-" + (Number(offset)+Number(rows.length)) ,
                // munculin angka 1-20 atau 21-30 sesuai yg diambil
                total: count,// jumlah data keseluruhan
                page: page, //sedang di halaman ke berapa
            }

            return res.status(200).json(response(200, "success", formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))

        }
    },
    showItem: async (req, res) => {
        try {
            // req.params :ambil path dinamis, /items/2 angka 2 (id)
            const { id } = req.params;
            // find by Pk : mencari berdasarkan primary key (id)
            const item = await Item.findByPk(id);
            // jika data yang dicari tidak ada di database (artinya angka idnya salah)
            if (!item) {
                return res.status(400).json(response(400, "Data [id] not found"));
            }
            return res.status(200).json(response(200, "success", item))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    updateItem: async (req, res) => {
        try {
            const { id } = req.params
            const { name, stock } = req.body;

            //validasi
            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true },

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
            // validasi stok gabole kurang dari stok sebelumnya
            const item = await Item.findByPk(id);
            if (!item) {
                return res.status(400).json(response(400, "Validasi Error ", "Data not found"));
            }
            // bandingnkan
            // kalau ada file baru, file lama dihapus
            if (req.file) {
                // karena imae udah diganti jadi link di getter model, jd ambil yang aslnya pake getDataValue
                const imageName = item.getDataValue('image');
                // dari image ke folder  uploads
                const filePath = path.join(__dirname, '../upload', imageName);
                // cek jika file ada di folder tsb
                if (fs.existsSync(filePath)) {
                    // hapus file
                    fs.unlinkSync(filePath);
                }
            }

            // hasil dari update orises haya true/false bukan data terbaru
            const updateProccess = await Item.update({
                name: data.name,
                stock: data.stock,
                image: req.file ? req.file.filename : item.getDataValue('image')
            }, {
                where: { id: id }
            });

            // ambil data terbaru setelah update
            const newItem = await Item.findByPk(id);

            return res.status(200).json(
                response(200, "success", newItem)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "Server Error", error.message)
            );
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
           // ambil data item untuk diambil gambar dan dihapus
           
                const item = await Item.findByPk(id);
                const imageName = item.getDataValue('image');
    
                const filePath = path.join(__dirname, '../upload', imageName);
               
                if (fs.existsSync(filePath)) {
                 
                    fs.unlinkSync(filePath);
                }
            const deleteProcess = await Item.destroy({
                where: {id: id}
            });
            return res.status(200).json(response(200, "deleted"));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}