import slugify from "slugify";

// Function to generate a unique slug
const generateUniqueSlug = async (name) => {
    let slug = slugify(name, { lower: true, strict: true });
   
  
    return slug;
  };

  export default generateUniqueSlug;
  