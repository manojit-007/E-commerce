import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },

},{timestamps:true});
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;