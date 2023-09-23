const Event = require("../Models/Event");

exports.addEvent = async (req, res) => {
  try {
    const { title, venue, desc, status, start_date, end_date } = req.body;
    const featured_image =
      req.files &&
      req.files.featured_image &&
      req.files.featured_image[0] &&
      req.files.featured_image[0].path;
    const event = new Event({
      title,
      venue,
      desc,
      status,
      start_date,
      end_date,
      featured_image,
    });
    await event.save();
    await res.status(201).json({
      message: "Event Saved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getEventsAdmin = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? { $text: { $search: req.query.searchString } }
      : {};
    const events = await Event.paginate(
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
      events,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    await res.status(200).json({
      event,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const {
      id,
      title,
      venue,
      desc,
      status,
      start_date,
      end_date,
      featured_image,
    } = req.body;
    const new_image =
      req.files &&
      req.files.featured_image &&
      req.files.featured_image[0] &&
      req.files.featured_image[0].path;
    const event = await Event.findById(id);
    event.title = title;
    event.venue = venue;
    event.desc = desc;
    event.status = status;
    event.start_date = start_date;
    event.end_date = end_date;
    event.featured_image = new_image ? new_image : featured_image;
    await event.save();
    await res.status(201).json({
      message: "Event Updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    });
  }
};
