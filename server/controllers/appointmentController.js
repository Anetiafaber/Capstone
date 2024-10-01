const Appointment = require("../models/Appointment");

exports.getAppointmentRequests = async (req, res) => {
  try {
    const appointmentRequests = await Appointment.find({
      providerId: req._id,
      status: "Pending",
    })
      .populate("customerId", "firstName lastName email")
      .exec();

    const data = appointmentRequests.map((appointment) => ({
      _id: appointment._id,
      name: `${appointment.customerId.firstName} ${appointment.customerId.lastName}`,
      email: appointment.customerId.email,
      date: appointment.date.toLocaleDateString(),
      timeslot: `${appointment.startTime}-${appointment.endTime}`,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading appointment requests:", error);
    res.status(500).json({
      message: "Failed to read appointment requests",
      details: error.message,
    });
  }
};

exports.getUpcomingAppointments = async (req, res) => {
  try {
    const currentTime = new Date();

    const upcomingAppointments = await Appointment.find({
      providerId: req._id,
      date: { $gt: currentTime },
    })
      .populate("customerId", "firstName lastName email")
      .exec();

    const data = upcomingAppointments.map((appointment) => ({
      _id: appointment._id,
      name: `${appointment.customerId.firstName} ${appointment.customerId.lastName}`,
      email: appointment.customerId.email,
      date: appointment.date.toLocaleDateString(),
      timeslot: `${appointment.startTime}-${appointment.endTime}`,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error reading upcoming appointments:", error);
    res.status(500).json({
      message: "Failed to read upcoming appointments",
      details: error.message,
    });
  }
};

exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Accepted" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment accepted", appointment });
  } catch (error) {
    console.error("Error accepting the appointment:", error);
    res.status(500).json({
      message: "Failed to accept the appointment",
      details: error.message,
    });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Rejected" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment rejected", appointment });
  } catch (error) {
    console.error("Error rejecting the appointment:", error);
    res.status(500).json({
      message: "Failed to reject the appointment",
      details: error.message,
    });
  }
};
