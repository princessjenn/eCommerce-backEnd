const express = require('express');
const router = express.Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET ALL ROUTE
  router.get('/products', async (req, res) => {
    try {
      const productData = await Product.findAll({
        include: [
          { model: Category },
          //second object to the 'include' array to associate the Tag model and the ProductTag model
          { model: Tag, through: ProductTag } 
        ]
    });
      res.status(200).json(productData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//GET ONE BY ID ROUTE
router.get('/products/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      //retrieving a single product with its associated Category and Tag data, including the join table data stored in the ProductTag model.
      include: [
        { model: Category },
        { model: Tag, through: ProductTag,
          attributes: ['id', 'tag_name']
        },
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST/CREATE ROUTE
router.post('/products', async (req, res) => {
  try {
    //values from the req body
    const productData = await Product.create(req.body);
   //responds OK with new product
    res.status(200).json(productData); 
  } catch (error) {
    console.error(error);
    //or if server error, responds w/ server error message
    res.status(500).json(err); 
  }
});

//BULK CREATE
//I created a route for Product.bulkCreate() method instead of Product.create()
router.post('/products', (req, res) => {
  const { product_name, price, stock, tagIds } = req.body;
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// PUT/UPDATE BY ID ROUTE
router.put('/products/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id:
             req.params.id,
             tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        //destroy = delete product tags
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        // create new product tags
        ProductTag.bulkCreate(newProductTags),
        // fetch updated product data with associated tags
        Product.findByPk(req.params.id, {
          include: [
            { model: Category },
            { model: Tag, through: ProductTag },
          ],
        }),
      ]);
    })
    .then(([destroyedProductTags, createdProductTags, updatedProductData]) => {
      // return updated product data
      res.json(updatedProductData);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//DELETE ONE BY ID ROUTE
router.delete('/products/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) { //if no product data retrieved
      res.status(404).json({ message: 'Product id not found.' }); //404 error
      return;
    }
    //product id located, and deleted
    res.status(200).json({ message: 'Product deleted successfully!' }); //200 OK
  } catch (err) {
    res.status(500).json(err); // or internal server error
  }
});

module.exports = router;
