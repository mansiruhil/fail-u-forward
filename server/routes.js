const express=require('express')
const router=express.Router()
const authcontrollers =require('./authcontroller')

router.route('/feed').post(authcontrollers.validate);
router.route('/bot').post(authcontrollers.chatbot)
module.exports=router