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
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data

router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) { // if no product found with that id
      return res.status(404).json({ message: 'No product found with that id!' }); // return 404 status client error
    }
    return res.status(200).json(productData); // return 200 status "ok"
  } catch (err) {
    return res.status(500).json(err); // return 500 status "internal server error"
  }

});

// // create new product

router.post('/', async (req, res) => {
  try {
    const productData = await Product.create({
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    });
  return res.status(200).json(productData);
  } catch (err) {
    return res.status(400).json(err);
  }
});
 
router.post('/', async (req, res) => {
  const productCreate = await Product.create(req.body);
  return res.status(200).json(productCreate);
});
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
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
     return res.status(400).json(err);
    });

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});


module.exports = router;
