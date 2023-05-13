const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//GET ALL ROUTE
router.get('/', async (req, res) => {
  try {
    // find all tags
    const tagData = await Tag.findAll({
			attributes: ["id", "tag_name"],
			include: [{
				model: Product,
				attributes: ["id", "product_name", "price", "stock", "category_id"],
				through: "ProductTag",
			},
    ],
    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ONE BY ID ROUTE
router.get('/:id', async (req, res) => {
  try {
    // find a single tag by its `id`
    const tagData = await Tag.findByPk(req.params.id, {
      //retrieving a single tag with its associated Product Tag and Tag data, including the join table data stored in the ProductTag model.
			include: [{
				model: Product,
				attributes: ["id", "product_name", "price", "stock", "category_id"],
				through: "ProductTag",
			}],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST/CREATE ROUTE  
router.post('/', async (req, res) => {
  try {
    //new row in the tags table with the tag_name provided in the request body
    const tagData = await Tag.create({tag_name: req.body.tag_name});
    res.status(200).json(tagData);
  } catch (error) {
    res.status(400).json(error);
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
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE BY ID ROUTE
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {id: req.params.id}
    });

    if (!tagData) {
      res.status(404).json({ message: 'Tag id not found.' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
