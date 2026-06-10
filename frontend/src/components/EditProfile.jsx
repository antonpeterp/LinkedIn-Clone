import React, { useContext, useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { UserDataContext } from "../context/UserContext";
import avatar from "../assets/avatar.png";
import { LuTrash2 } from "react-icons/lu";
import { PiCameraBold } from "react-icons/pi";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

const EditProfile = () => {
  let { edit, setEdit, userData, setUserData } = useContext(UserDataContext);
  let [saving, setSaving] = useState(false);
  let { serverURL } = useContext(authDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkill, setNewSkill] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage || avatar
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage || null
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);

  const profileImageRef = useRef();
  const coverImageRef = useRef();

  function handleProfileImage(e) {
    let file = e.target.files[0];
    if (!file) return;
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    let file = e.target.files[0];
    if (!file) return;
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  function addSkill() {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill("");
  }

  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill));
  }

  function addEducation() {
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
      setNewEducation({ college: "", degree: "", fieldOfStudy: "" });
    }
  }

  function removeEducation(index) {
    setEducation(education.filter((_, i) => i !== index));
  }

  function addExperience() {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
      setNewExperience({ title: "", company: "", description: "" });
    }
  }

  function removeExperience(index) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }
      let result = await axios.put(
        serverURL + "/api/user/updateprofile",
        formdata,
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-start overflow-y-auto bg-black/55 py-5">
      {/* hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImageRef}
        onChange={handleProfileImage}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImageRef}
        onChange={handleCoverImage}
      />

      <div className="w-[90%] max-w-[552px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* sticky header */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-[20px] font-semibold text-gray-900">
            Edit intro
          </span>
          <button
            onClick={() => setEdit(false)}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            <RxCross1 className="w-[22px] h-[22px]" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto max-h-[80vh] px-6 pb-6">
          {/* cover + profile images */}
          <div className="relative mb-12">
            <div
              className="w-full h-[160px] bg-gray-300 rounded overflow-hidden cursor-pointer relative"
              onClick={() => coverImageRef.current.click()}
            >
              {frontendCoverImage ? (
                <img
                  src={frontendCoverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute bottom-2 right-2 bg-black/60 rounded-full w-[34px] h-[34px] flex items-center justify-center">
                <PiCameraBold className="text-white w-[18px] h-[18px]" />
              </div>
            </div>

            <div
              className="absolute -bottom-10 left-4 w-[80px] h-[80px] rounded-full border-[3px] border-white bg-gray-200 overflow-hidden cursor-pointer"
              onClick={() => profileImageRef.current.click()}
            >
              <img
                src={frontendProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[28px] bg-black/50 flex items-center justify-center">
                <PiCameraBold className="text-white w-[14px] h-[14px]" />
              </div>
            </div>
          </div>

          {/* basic info */}
          <div className="border-b border-gray-200 py-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-3">
              Basic info
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[12px] text-gray-500 block mb-1">
                  First name *
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
                />
              </div>
              <div>
                <label className="text-[12px] text-gray-500 block mb-1">
                  Last name *
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-[12px] text-gray-500 block mb-1">
                Username
              </label>
              <div className="flex items-center h-[40px] border border-gray-300 rounded overflow-hidden focus-within:border-[#0a66c2] transition">
                <span className="px-3 text-[14px] text-gray-400 bg-gray-100 h-full flex items-center border-r border-gray-200 whitespace-nowrap">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  placeholder="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 h-full px-3 text-[15px] outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-[12px] text-gray-500 block mb-1">
                Headline
              </label>
              <input
                type="text"
                placeholder="Software Engineer at Company"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-gray-500 block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
                />
              </div>
              <div>
                <label className="text-[12px] text-gray-500 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition bg-white"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* skills */}
          <div className="border-b border-gray-200 py-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-3">
              Skills
            </p>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-[14px] text-gray-700"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-gray-400 hover:text-gray-700 transition"
                    >
                      <RxCross1 className="w-[12px] h-[12px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. React, Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <button
                onClick={addSkill}
                className="h-[40px] px-4 border-[1.5px] border-[#0a66c2] rounded-full text-[#0a66c2] text-[14px] font-medium hover:bg-blue-50 transition whitespace-nowrap"
              >
                Add skill
              </button>
            </div>
          </div>

          {/* education */}
          <div className="border-b border-gray-200 py-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-3">
              Education
            </p>
            {education.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between bg-gray-50 rounded-lg px-3 py-2.5 gap-2"
                  >
                    <div>
                      <p className="text-[15px] font-medium text-gray-800">
                        {edu.college}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        {edu.degree} · {edu.fieldOfStudy}
                      </p>
                    </div>
                    <button
                      onClick={() => removeEducation(index)}
                      aria-label="Remove education"
                      className="text-gray-400 hover:text-red-500 transition flex-shrink-0 mt-0.5"
                    >
                      <LuTrash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2.5 p-3.5 border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="School / College"
                value={newEducation.college}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <input
                type="text"
                placeholder="Degree (e.g. Bachelor of Science)"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <input
                type="text"
                placeholder="Field of study"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <button
                onClick={addEducation}
                className="self-end h-[36px] px-4 border-[1.5px] border-[#0a66c2] rounded-full text-[#0a66c2] text-[14px] font-medium hover:bg-blue-50 transition"
              >
                Add education
              </button>
            </div>
          </div>

          {/* experience */}
          <div className="py-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-3">
              Experience
            </p>
            {experience.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between bg-gray-50 rounded-lg px-3 py-2.5 gap-2"
                  >
                    <div>
                      <p className="text-[15px] font-medium text-gray-800">
                        {exp.title} · {exp.company}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        {exp.description}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExperience(index)}
                      aria-label="Remove experience"
                      className="text-gray-400 hover:text-red-500 transition flex-shrink-0 mt-0.5"
                    >
                      <LuTrash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2.5 p-3.5 border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Title (e.g. Software Engineer)"
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="w-full h-[40px] border border-gray-300 rounded px-3 text-[15px] outline-none focus:border-[#0a66c2] transition"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-[15px] outline-none focus:border-[#0a66c2] transition resize-y font-sans"
              />
              <button
                onClick={addExperience}
                className="self-end h-[36px] px-4 border-[1.5px] border-[#0a66c2] rounded-full text-[#0a66c2] text-[14px] font-medium hover:bg-blue-50 transition"
              >
                Add experience
              </button>
            </div>
          </div>
        </div>

        {/* sticky footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setEdit(false)}
            className="h-[36px] px-5 border-[1.5px] border-gray-400 rounded-full text-gray-700 text-[15px] font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="h-[36px] px-5 bg-[#0a66c2] rounded-full text-white text-[15px] font-medium hover:bg-[#004182] transition"
            disable={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
