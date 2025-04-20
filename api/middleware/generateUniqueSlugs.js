import slugify from "slugify";

// Function to generate a unique slug
const generateUniqueSlug = async (name) => {
    let slug = slugify(name, { lower: true, strict: true });
   
  
    return slug;
  };

  export default generateUniqueSlug;
  
  // let exists = await Product.exists({ slug }); // Use `exists` for optimized querying
    // let counter = 1;
  
    // while (exists) {
    //   slug = `${slug}-${counter}`;
    //   exists = await Product.exists({ slug });
    //   counter++;
    // }