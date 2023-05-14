const router = require('express').Router();
const { Category, Product } = require('../../models')

//GET ALL ROUTE
router.get('/', async (req, res) => {
  try {
    // find all categories
    const categoryData = await Category.findAll({
      include: [{
        // include any associated Products
         model: Product,
         attributes: ["id", "product_name", "price", "stock", "category_id"]
      }]
    });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ONE BY ID ROUTE
router.get('/:id', async (req, res) => {
  try {
    // find one category by its `id` value
    const categoryData = await Category.findByPk(req.params.id, {
      //retrieving a single category
      attributes: ["id", "category_name"],
          include: [{
            model: Product,
              attributes: ["id", "product_name", "price", "stock", "category_id"],
          }
        ],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST/CREATE ROUTE
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// PUT/UPDATE CATEGORY BY ID ROUTE
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body,
      { where: { id: req.params.id } }//into where specfic id of category is
    );
      if (categoryData === null || !categoryData[0]) { //checking 'categoryData' array for category data returned from db, and if it's empty, there is no category specified
      res.status(404).json({ message: 'Category id not found.' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE BY ID ROUTE
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category id not found.' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
