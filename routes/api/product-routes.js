const router = require('express').Router('/');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET ALL ROUTE
  router.get('/products', async (req, res) => {
    try {
      const productData = await Product.findAll({
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        include: [
          {
            model: Tag,
            attributes: ["id", "tag_name"],
            through: "ProductTag",
          },
          {
            model: Category,
            attributes: ["id", "category_name"],
          },
        ],
      });
      res.status(200).json(productData);
    } catch (error) {
      res.status(500).json(error);
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
  } catch (error) {
    res.status(500).json(error);
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
    res.status(500).json(error); 
  }
});

// PUT/UPDATE BY ID ROUTE
router.put("/:id", async (req, res) => {
  try {
    // update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id },
    });

    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update product.' });
  }
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
  } catch (error) {
    res.status(500).json(error); // or internal server error
  }
});

module.exports = router;
