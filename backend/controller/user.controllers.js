import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // make sure this import exists

export const getCurrentUser = async (req, res) => {
  try {
    let id = req.userId;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Get Current User Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, userName, headline, location, gender } =
      req.body;

    // BUG 1: req.body.experien was a typo — should be req.body.experience
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : []; // fixed typo

    let profileImage;
    let coverImage;

    // BUG 2: req.files can be undefined if no files were uploaded — must guard it
    if (req.files?.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files?.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    // BUG 3: { new: true }.select("password") is wrong — .select() is a mongoose
    // method on the query, not on the options object. Also should be "-password"
    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        ...(profileImage && { profileImage: profileImage.secure_url }),
        ...(coverImage && { coverImage: coverImage.secure_url }),
      },
      { new: true }
    ).select("-password"); // fixed: chained correctly, excludes password

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Update Profile Error" });
  }
};
