const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require("sequelize");

module.exports = {
    createLoan: async (req, res) => {
        try {
            const {item_id, name, total_item, date } = req.body;

            const schema = {
                item_id: {type: "number", positive: true, integer: true},
                total_item: {type: "number", positive:true, integer:true},
                name: {type: "string", min: 3},
                date: {type: "date"},
            }
            const data = {
                item_id: Number(item_id),
                total_item: Number(total_item),
                name: name,
                data: new Date(date), // string jadi date
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));

            }
            // ambil date item sesuai item_id pastikan id ada di table items
            const item = await Item.findByPk(item_id);
            if (!item) {
                return res.status(400).json(response(400, "Date Item is not found. Please check [item_id] value"));

            }
            // memastikan data total_item yang dipinjam kuerang dari stok, gabole lebih dari stok
            if (data.total_item > data.stock) {
                return res.status(400).json(response(400,  `Stock not available. Available only ${item.stock}` ));
            }

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}