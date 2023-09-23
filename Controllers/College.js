const College = require("../Models/College");

exports.addCollege = async (req, res) => {
  try {
    const {
      name,
      college_type,
      address,
      tution_in_state,
      tution_out_of_state,
      sports,
      desc,
      status,
    } = req.body;
    const college_image =
      req.files &&
      req.files.college_image &&
      req.files.college_image[0] &&
      req.files.college_image[0].path;

    const college = new College({
      name,
      college_type,
      address,
      tution_in_state,
      tution_out_of_state,
      sports,
      desc,
      status,
      college_image,
    });
    await college.save();
    await res.status(201).json({
      message: "College Saved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getCollegesAdmin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const colleges = await College.paginate(
      {
        ...searchParam,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
      }
    );
    await res.status(200).json({
      colleges,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).lean();
    await res.status(200).json({
      college,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editCollege = async (req, res) => {
  try {
    const {
      _id,
      name,
      college_type,
      address,
      tution_in_state,
      tution_out_of_state,
      sports,
      desc,
      status,
      college_image,
    } = req.body;
    const new_image =
      req.files &&
      req.files.college_image &&
      req.files.college_image[0] &&
      req.files.college_image[0].path;
    const image_to_store = new_image ? new_image : college_image;

    const college = await College.findById(_id);
    college.name = name;
    college.college_type = college_type;
    college.address = address;
    college.tution_in_state = tution_in_state;
    college.tution_out_of_state = tution_out_of_state;
    college.sports = sports;
    college.desc = desc;
    college.status = status;
    college.college_image = image_to_store;

    await college.save();
    await res.status(201).json({
      message: "College Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getMinifiedColleges = async (req, res) => {
  try {
    const colleges = await College.find({
      status: 1,
    })
      .select("name")
      .lean();
    await res.status(200).json({
      colleges,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
