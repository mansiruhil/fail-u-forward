const express = require('express')
const app = express()
const port = 8000
const cors=require('cors')
const routes=require('./routes')


const corsOption={
    origin:"http://localhost:3000",
    method:"POST,GET,PUT,DELETE,PATCH,HEAD",
    credentials:true,
  }
app.use(cors(corsOption));
app.use(express.json())
app.use('/',routes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })