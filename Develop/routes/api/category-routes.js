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

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
