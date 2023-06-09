const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET ALL ROUTE
  router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.post("/", (req, res) => {
	/* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
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
			}else{
			// if no product tags, just respond
			res.status(200).json(product);
			}
		})
		.then((productTagIds) => res.status(200).json(productTagIds))
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
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
    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update product.' });
  }
});


//DELETE ONE BY ID ROUTE
router.delete('/:id', async (req, res) => {
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
