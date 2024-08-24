const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler');
const { Operator, AircraftOPerator } = require("../models/Owners");
const Role = require("../models/role");
const OperatorService = require("../services/operator-service");
const { generateToken } = require("../config/jwtToken");

const { isValidEmail } = require('../regex/emailRegex');
const { isValidMobileNumber } = require('../regex/phoneNumberRegex');


exports.Register = asyncHandler(async (req, res) => {
  const {
    hotel_name, email_address, password, contact_number, country_name } =
    req.body;

  if (
    !hotel_name ||
    !email_address ||
    !password ||
    !contact_number ||
    !country_name
  ) {
    return res.status(400).json({
      success: false,
      msg: "hotel_name,email_address,password,contact_number,country_name are required",
    });
  } else if (
    typeof hotel_name !== "string" ||
    typeof email_address !== "string" ||
    typeof password !== "string" ||
    typeof contact_number !== "string" ||
    typeof country_name !== "string"
  ) {
    return res.status(400).json({
      error:
        "hotel_name,email_address,password,contact_number,country_name must be a string",
    });
  } else if (
    hotel_name === "" ||
    email_address === "" ||
    password === "" ||
    contact_number === "" ||
    country_name === ""
  ) {
    return res.status(400).json({
      success: false,
      msg: `hotel_name,email_address,password,contact_number,country_name cant take an empty string value i.e ''`,
    });
  } else if (!isValidMobileNumber(contact_number)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid contact_number",
    });
  } else if (!isValidEmail(email_address)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid email_address entered",
    });
  }
  const role = Role.OPERATOR;

  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const findOperator = await Operator.findOne({
      email_address: email_address,
    });
    if (!findOperator) {
      // create new operator
      const newUser = new Operator({
        hotel_name,
        email_address,
        contact_number,
        country_name,
        password: hashedPassword,
        role,
      });

      console.log("line 86 operator deatils", newUser);
      // res.json(newUser);

      await newUser.save();

      res.status(201).json({ message: "Operator register successfully", data: newUser, success: true, });
    } else {
      return res.status(201)({
        msg: 'User Already Exists',
        success: false,
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error Occurred while creating user', msg: error });
  }


})


exports.Login = asyncHandler(async (req, res) => {
  const { email_address, password } = req.body;

  if (!email_address || !password) {
    return res.status(400).json({
      success: false,
      msg: "email_address,password are required",
    });
  } else if (!isValidEmail(email_address)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid emailAddress entered",
    });
  }
  try {
    const user = await Operator.findOne({ email_address });

    if (!user) {
      return res.json({ message: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({ message: "inCorrect password" });
    }
    if (user && passwordMatch) {
      res.json({
        id: user?._id,
        email_address,
        password,
        token: await (generateToken(user?._id)),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
})

exports.AircraftOPeratorHotel = asyncHandler(async (req, res) => {
  try {
    const {
      Hotel_type, Tail_sign, location, icao, country_name, charges_per_hour, rating, sr_no } =
      req.body;

    if (
      !Hotel_type ||
      !Tail_sign ||
      !location ||
      !icao ||
      !country_name ||
      !charges_per_hour ||
      !rating ||
      !sr_no) {
      return res.status(400).json({
        success: false,
        msg: "Hotel_type, Tail_sign,location,icao,country_name,charges_per_hour,rating are required",
      });
    } else if (
      typeof Hotel_type !== "string" ||
      typeof Tail_sign !== "string" ||
      typeof location !== "string" ||
      typeof icao !== "string" ||
      typeof country_name !== "string"
    ) {
      return res.status(400).json({
        error:
          "Hotel_type, Tail_sign,location,icao,country_name must be a string",
      });
    }
    else if (
      typeof charges_per_hour !== "number" ||
      typeof rating !== "number" ||
      typeof sr_no !== "number"

    ) {
      return res.status(400).json({
        error:
          "charges_per_hour,rating and sr_no must be a number",
      });
    } else if (
      Hotel_type === "" ||
      Tail_sign === "" ||
      location === "" ||
      icao === "" ||
      country_name === ""
    ) {
      return res.status(400).json({
        success: false,
        msg: `Hotel_type,Tail_sign,location,icao,country_name,charges_per_hour cant take an empty string value i.e ''`,
      });
    }
    else {
      // create new operator
      const newAircraftOPerator = new AircraftOPerator({
        Hotel_type,
        Tail_sign,
        location,
        icao,
        country_name,
        charges_per_hour,
        rating,
        sr_no
      });

      console.log("line 203 newAircraftOPerator deatils", newAircraftOPerator);
      // res.json(newUser);

      await newAircraftOPerator.save();

      // Find the corresponding Operator and update hotelOwner
      const operator = await Operator.findOne({ email_address: req.userOperator.email_address }); // Assuming you have user email in req.user

      if (!operator) {
        return res.status(404).json({
          success: false,
          msg: "Operator not found",
        });
      }

      operator.hotelOwner.push({
        aircraftOperator: newAircraftOPerator._id,
        Hotel_type,
        Tail_sign,
        location,
        icao,
        country_name,
        charges_per_hour,
        rating,
        sr_no,
      });
      await operator.save();
      res.status(201).json({ message: "newAircraftOPerator created added to hotelOwner successfully ", data: newAircraftOPerator, success: true, });
    }


  } catch (error) {
    res.status(500).json({ error: 'Error Occurred while creating newAircraftOPerator', msg: error });
  }
})

exports.GetAircraftOperatorHotelCreatedByMe = asyncHandler(async (req, res) => {
  try {
    if (!req.userOperator.id) {
      return res.status(400).json({
        success: false,
        msg: "Please log in first. Unknown user.",
      });
    }

    // Find all AircraftOPerator documents associated with my id
    const operator = await Operator.findOne({ _id: req.userOperator.id });
    if (!operator) {
      return res.status(404).json({
        success: false,
        msg: "Operator not found",
      });
    }
    const myHotelLists = operator?.hotelOwner
    console.log('myHotelLists', myHotelLists);

    if (myHotelLists.length < 1) {
      return res.status(404).json({
        success: false,
        msg: "No Aircraft Operator Hotels found for this user.",
      });
    }
    return res.status(200).json({
      success: true,
      data: myHotelLists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});


exports.EditAircraftOPeratorHotel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Hotel_type, Tail_sign, location, icao, country_name, charges_per_hour, rating, sr_no
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "aircraftOperatorHotelId is required",
      });
    }

    if (
      !Hotel_type || !Tail_sign || !location || !icao ||
      !country_name || typeof charges_per_hour !== "number" ||
      typeof rating !== "number" || typeof sr_no !== "number"
    ) {
      return res.status(400).json({
        success: false,
        msg: "Hotel_type, Tail_sign, location, icao, country_name, charges_per_hour, rating, and sr_no are required, and the numeric fields must be numbers.",
      });
    }

    const editedAircraftOperatorHotel = await AircraftOPerator.findByIdAndUpdate(
      id,
      { Hotel_type, Tail_sign, location, icao, country_name, charges_per_hour, rating, sr_no },
      { new: true }
    );

    if (!editedAircraftOperatorHotel) {
      return res.status(404).json({
        success: false,
        msg: "Aircraft Operator Hotel not found",
      });
    }

    await Operator.updateMany(
      { "hotelOwner.aircraftOperator": editedAircraftOperatorHotel._id },
      {
        $set: {
          "hotelOwner.$[elem].Hotel_type": Hotel_type,
          "hotelOwner.$[elem].Tail_sign": Tail_sign,
          "hotelOwner.$[elem].location": location,
          "hotelOwner.$[elem].icao": icao,
          "hotelOwner.$[elem].country_name": country_name,
          "hotelOwner.$[elem].charges_per_hour": charges_per_hour,
          "hotelOwner.$[elem].rating": rating,
          "hotelOwner.$[elem].sr_no": sr_no
        }
      },
      { arrayFilters: [{ "elem.aircraftOperator": editedAircraftOperatorHotel._id }] }
    );

    return res.status(200).json({
      success: true,
      data: editedAircraftOperatorHotel,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});


exports.DeleteAircraftOperatorHotel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "aircraftOperatorHotelId is required",
      });
    }
    else {

      const deletedAircraftOperatorHotel = await AircraftOPerator.findByIdAndDelete(id);

      if (!deletedAircraftOperatorHotel) {
        return res.status(404).json({
          success: false,
          msg: "Aircraft Operator Hotel not found",
        });
      }

      await Operator.updateMany(
        { "hotelOwner.aircraftOperator": deletedAircraftOperatorHotel._id },
        { $pull: { hotelOwner: { aircraftOperator: deletedAircraftOperatorHotel.id } } }
      );
      return res.status(200).json({
        success: true,
        data: deletedAircraftOperatorHotel,
      });
    }


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
})


exports.GetAllAvailableAircraftOperatorHotel = asyncHandler(async (req, res) => {
  try {
    if (!req.userOperator.id) {
      return res.status(400).json({
        success: false,
        msg: "Please log in first. Unknown user.",
      });
    }
    // Find all AircraftOPerator documents associated with my id
    const AllAircraftOPerator = await AircraftOPerator.find();

    if (AllAircraftOPerator.length < 1) {
      return res.status(404).json({
        success: false,
        msg: "No Aircraft Operator Hotels Have been created yet",
      });
    }
    return res.status(200).json({
      success: true,
      data: AllAircraftOPerator,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
})

