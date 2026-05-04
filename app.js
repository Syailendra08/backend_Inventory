const express = require('express')
const app = express()
const port = 3000

const db = require("./models")
const methodOverride = require('method-override')
const itemRoutes = require('./routes/item.routes')
const loanRoutes = require('./routes/loan.routes')
// cek koneksi model - migraiton - proyek sequelize
db.sequelize.authenticate()
.then(() => console.log("Database (model) terkoneksi!"))
.catch((error) => console.error(error))

//app.use : mendaftarkan routing atau config header lain, urutannya 
app.use(express.json());
app.use(methodOverride("_method"));  // mengijinkan req.body format json
app.use('/uploads', express.static('uploads')); // agar gambar yg disimpan di folder uploads dibolehkan untuk diambil/dimunculkan di browser (FE)
app.use('/items', itemRoutes);
app.use('/loans', loanRoutes);  // mendaftarkan routes dan prefixnya 
// menggunaan _method PUT, PATCH, DELETE

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})