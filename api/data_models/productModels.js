import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true, min: 0, default: 100 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: 
    {
      publicId: { type: String, required: true },
      imageUrl: { type: String, required: true },
    },
    quantity: { type: Number, required: true, min: 0, default: 100 },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        username: { type: String, required: true },
        rating: { type: Number, default: 0 },
        comment: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug before saving
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
