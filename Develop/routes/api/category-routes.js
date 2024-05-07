const router = require('express').Router();
const { Category, Product } = require('../../models');

// find all categories
// be sure to include its associated Products
// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    return res.status(404).json({ message: 'No categories found' });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// find one category by its `id` value
// be sure to include its associated Products
// The `/api/categories/:id` endpoint

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    if (!categoryData) {
      return res.status(404).json({ message: 'No category found with that id' });
    }
    return res.status(200).json(categoryData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// create a new category
// The `/api/categories` endpoint

router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    return res.status(200).json(categoryData);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// update a category by its `id` value
// The `/api/categories/:id` endpoint
router.put('/:id', async (req, res) => {
  try {
    const updatedData = await Category.update(
      {
        ...req.body,
      },{
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updatedData[0]) {
      return res.status(404).json({ message: 'No category found with that id' });
    }
    return res.status(200).json(updatedData);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// delete a category by its `id` value
// The `/api/categories/:id` endpoint

router.delete('/:id', async (req, res) => {
  try {
    const deletedData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedData) {
      return res.status(404).json({ message: 'No category found with that id' });
    }
    return res.status(200).json(deletedData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
