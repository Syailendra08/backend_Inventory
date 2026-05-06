const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan, Return } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require("sequelize");

module.exports = {
    createReturn: async (req, res) => {
        try {
            // nama di { bisa di samakan dengan mfield di modelnya}
            const { loan_id, total_item, notes, date } =req.body;

            const schema = {
                loan_id: {type: "number", positive: true, integer: true},
                total_item: {type: "number", positive: true, integer: true},
                notes: {type: "string"},
                date: {type: "date"},
            }

            const data = {
                loan_id: Number(loan_id),
                total_item: Number(total_item),
                // karena notes tidak wajib diisi, jd jika kosong definisikan sebagai "-"
                notes: notes ?? "-",
                date: new Date(date)
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const loan = await Loan.findByPk(loan_id, {include: Item}); // sekaligus mengambiil data itemnya, untuk digunakan stacknya akan dipdate (+)
            // kalau data peminjaman gaddaa
            if (!loan) {
                return res.status(400).json(response(400, "Validasi Error", "Data loan not found"));
            }
            // data total_item pengembalian {data} tidak boeh kuran dr peminjaman
            if (data.total_item > loan.total_item) {
                return res.status(400).json(response(400, "Validasi Error", "Total return item more than loan item"));
            }

            const returnData = await Return.create(data); //value untuk return sdh ada di comnst data semuanya
            // update stock: stock sblmya + total_item pengembalian
            const updateStock = await  Item.update({
                stock: loan.Item.stock + data.total_item
            }, {
                where: {id: loan.Item.id} // data id item adanya di relasi item dari data loan
            });
            // kembaliikan data item, peminjaman, pengembalian
            const loanWithItemReturn = await Loan.findByPk(loan_id, {include: [Item, Return]});
            return res.status(201).json(response(201, 'created', loanWithItemReturn))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}
