'use strict';
const {Item} = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // ambil data item semua, untuk akses idnya buat FK item_id
    const items = await Item.findAll();
    let dummyData =[];

    // loop sebanyak 20 data
    for (let index = 1; index <= 20; index++) {
      // mengambil secara acak id dari data item
      const itemId = items[Math.floor(Math.random()*items.length)];
      // math.random : menghasilkan angka 0-1 (termasuk desimal), items.length : itung jumlah item
      // contoh: hasil random 0.5 , length itemnya = 3
      // 0.5 * 3 = 1.5 kemudian di maht.floor diambil angka sblm koma = 1 jd item_id yg dipake 1 dst
      let data = {
        item_id: itemId.id, //itemId jadi isinya fulll data item yg indexnya antara 0-2, ambil bagian id
        name: `Peminjam ke ${index}`,
        total_item: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      dummyData.push(data); // simpan data ke array
    }
    // array diinsert
    await queryInterface.bulkInsert('Loans', dummyData);
  },

  async down (queryInterface, Sequelize) {
   // kosongkan data
   await queryInterface.bulkDelete('Loans', dummyData);
  }
};
