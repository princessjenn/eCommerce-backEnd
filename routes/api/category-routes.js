const router = require('express').Router();
const { Category } = require('../../models');

//GET ALL ROUTE
router.get('/', async (req, res) => {
  try {
    // find all categories
    const categoryData = await Category.findAll({
      include: [
        //its associated data, only the Category model (PK)
        { model: Category,}
      ],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ONE BY ID ROUTE
router.get('/:id', async (req, res) => {
  try {
   // find one category by its `id` value
    const categoryData = await Category.findByPk(req.params.id, {
      //retrieving a single category
      include: [
        { model: Category }
      ],
  });  
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with that id!' });
    return;
  }

    res.status(200).json(categoryData);
  } catch (err) {
  res.status(500).json(err);
  }
});

// POST/CREATE ROUTE
router.post('/category', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT/UPDATE NAME BY ID ROUTE
router.put('/:id', async (req, res) => {
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
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE BY ID ROUTE
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category id not found.' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
