// import models
const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Categories have many Products (one-to-many)
Category.hasMany(Product, {
   foreignKey: 'category_id', 
});

// Products belongsTo Category (one-to-one)
Product.belongsTo(Category, {
   foreignKey: 'category_id',
});

// Products belongToMany Tags (through ProductTag) (one-to-many)
Product.belongsToMany(Tag, {
   through: ProductTag, 
   foreignKey: 'product_id',
});

// Tags belongToMany Products (through ProductTag) (one-to-many)
Tag.belongsToMany(Product, {
   through: ProductTag,
   foreignKey: 'tag_id'
});

//ProductTag belongsTo Product (one-to-one, join table)
ProductTag.belongsTo(Product, {
   foreignKey: 'product_id',
});
 
//Product Tag belongsTo Tag (one-to-one, join table)
 ProductTag.belongsTo(Tag, {
   foreignKey: 'tag_id',
});


module.exports = {
  Category,
  Product,
  Tag,
  ProductTag,
};
