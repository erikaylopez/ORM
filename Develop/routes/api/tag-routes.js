const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
 // find all tags

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    return res.status(200).json(tagData);
  }
  catch (err) {
    return res.status(500).json(err);
  }
});
      
  // create a new tag
  Tag.create;
    router.post('/', async (req, res) => {
      try {
        const tagData = await Tag.create(req.body);
        return res.status(200).json(tagData);
      }
      catch (err) {
        return res.status(400).json(err);
      }
    });

    // find a single tag by its `id`

  router.put ('/:id', async (req, res) => {
    try {
      const tagData = await Tag.findByPk(req.params.id, {
        include: [{ model: Product }],
      });
      if (!tagData) {
        return res.status(404).json({ message: 'No tag found with this id!' });
      }
      return res.status(200).json(tagData);
    }
    catch (err) {
      return res.status(500).json(err);
    }
  }
  );


  router.delete('/:id', async (req, res) => {
    try {
      const tagData = await Tag.destroy({
        where: {
          id: req.params.id
        }
      });
      if (!tagData) {
        return res.status(404).json({ message: 'No tag found with this id!' });
      }
      return res.status(200).json(tagData);
    }
    catch (err) {
      return res.status(500).json(err);
    }
  });


  module.exports = router;
