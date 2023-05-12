const router = require('express').Router();
const { Category, Product } = require('../../models')

//GET ALL ROUTE
router.get('/categories', async (req, res) => {
  try {
    // find all categories
    const categoryData = await Category.findAll({
      include: [
        // include any associated Products
        { model: Product }
      ],
    });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ONE BY ID ROUTE
router.get('/categories/:id', async (req, res) => {
  try {
    // find one category by its `id` value
    const categoryData = await Category.findByPk(req.params.id, {
      //retrieving a single category
      //eager loading, where you load the associated data with a single query rather than issuing separate queries for each associated model
      include: [Product],

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
router.post('/categories', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// PUT/UPDATE NAME BY ID ROUTE
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(
      { category_name: req.body.category_name }, //requesting in the body where category_name is
      { where: { id: req.params.id } }// further into where specfic id of category is
    );
    if (!categoryData[0]) { //checking 'categoryData' array for category data returned from db, and if it's empty, there is no category specified
      res.status(404).json({ message: 'Category id not found.' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE BY ID ROUTE
router.delete('/categories/:id', async (req, res) => {
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
