const NewsletterSubscriber = require("../model/NewsletterSubscriber");
const {
  createAdminNotification,
} = require("../services/notification.service");

const subscribeToNewsletter = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const source = String(req.body.source || "website").trim();

    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        existingSubscriber.status = "subscribed";
        existingSubscriber.source = source;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();

        await createAdminNotification({
          type: "subscriber",
          category: "general",
          title: "Newsletter subscriber returned",
          message: `${existingSubscriber.email} subscribed again for supplement tips.`,
          entityId: existingSubscriber._id,
          metadata: {
            email: existingSubscriber.email,
            source: existingSubscriber.source,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "You are already subscribed to the Supplefied newsletter.",
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email,
      source,
    });

    await createAdminNotification({
      type: "subscriber",
      category: "general",
      title: "New supplement tips subscriber",
      message: `${subscriber.email} subscribed from ${subscriber.source}.`,
      entityId: subscriber._id,
      metadata: {
        email: subscriber.email,
        source: subscriber.source,
      },
    });

    res.status(201).json({
      success: true,
      message: "Thanks for subscribing to Supplefied.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.errors?.email?.message || "Please provide a valid email address",
      });
    }

    next(error);
  }
};

const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNewsletterSubscribers,
  subscribeToNewsletter,
};
