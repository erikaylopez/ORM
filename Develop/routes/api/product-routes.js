const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      return res.status(404).json({ message: 'No product found with that id!' });
    }
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// if there's product tags, we need to create pairings to bulk create in the ProductTag model
router.post('/', async (req, res) => {
  if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: productData.id,
        tag_id,
      };
    });
    return ProductTag.bulkCreate(productTagIdArr)
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      return res.status(404).json({ message: 'No product found with that id!' });
    }
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
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
  } catch (err) {
    // console.log(err);
    return res.status(400).json(err);
  }
});

try {
  // figure out which ones to remove
  const productTagsToRemove = productTags
    .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);
  // run both actions
  await Promise.all([
    ProductTag.destroy({ where: { id: productTagsToRemove } }),
    ProductTag.bulkCreate(ProductTag),
  ]);

  // delete product
  const productData = await Product.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!productData) {
    return res.status(404).json({ message: 'No product found with that id!' });
  }
  return res.status(200).json(productData);
} catch (err) {
  return res.status(500).json(err);
}

module.exports = router;


