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
  return res.status(200).json(categoryData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// find one category by its `id` value
// be sure to include its associated Products
// The`/api/categories/:id ` endpoint

router.get('/:id', async (req, res) => {
  try {
   // req.params.id = 1
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
// create new product
router.post('/', (req, res) => {
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

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
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
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
