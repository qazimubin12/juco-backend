const Banner = require("../Models/Banner");

exports.create = async (req, res) => {
  try {
    const { id, coach1, desc1, coach2, desc2, coach3, desc3 } = req.body;

    if (id) {
      const banner = await Banner.findById(id);
      banner.coach1 = coach1;
      banner.desc1 = desc1;
      banner.coach2 = coach2;
      banner.desc2 = desc2;
      banner.coach3 = coach3;
      banner.desc3 = desc3;
      await banner.save();
    } else {
      const banner = new Banner({
        coach1,
        desc1,
        coach2,
        desc2,
        coach3,
        desc3,
      });
      await banner.save();
    }
    await res.status(201).json({
      message: id ? "Banners Updated" : "Banner Saved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne()
      .lean()
      .populate({ path: "coach1 coach2 coach3", select: "email_address" });
    await res.status(200).json({
      banner,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
