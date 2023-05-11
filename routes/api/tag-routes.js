const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//GET ALL ROUTE
router.get('/', async (req, res) => {
  try {
    // find all tags
    const tagData = await Tag.findAll({
      include: [
        //its associated Product data
        { model: Product, through: ProductTag }
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ONE BY ID ROUTE
router.get('/:id', async (req, res) => {
  try {
    // find a single tag by its `id`
    const productData = await Product.findByPk(req.params.id, {
      //retrieving a single tag with its associated Product Tag and Tag data, including the join table data stored in the ProductTag model.
      include: [
        { model: Tag, through: ProductTag },
        { model: ProductTag }
      ],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST/CREATE ROUTE  
router.post('/tags', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT/UPDATE NAME BY ID ROUTE
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(
      { tag_name: req.body.tag_name }, //requesting in the body where tag_name is
      { where: { id: req.params.id } }// further into where specfic id of tag is
    );
    if (!tagData[0]) { //checking 'tagData' array for tag data returned from db, and if it's empty, there is no tag specified
      res.status(404).json({ message: 'Tag id not found.' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE BY ID ROUTE
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'Tag id not found.' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
