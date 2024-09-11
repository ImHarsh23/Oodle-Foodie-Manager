import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const api = axios.create({
  baseURL: "https://oodle-foodie-manager-l366.vercel.app",
});

const alternateProfileImabge =
  "https://as2.ftcdn.net/v2/jpg/07/95/95/13/1000_F_795951374_QR1tADRPLjbh0NqrJqLPbzOTHJW5HjmY.jpg";

const Profile = () => {
  const { auth } = useSelector((state) => state.auth);
  const [isEditable, setIsEditable] = useState(false);
  const [userData, setUserData] = useState({
    name: auth.name,
    username: auth.username,
    email: auth.email,
    image: null,
    avatar: auth.avatar,
  });
  const image = useRef();

  const nameChangeHandler = (e) => {
    setUserData({ ...userData, name: e.target.value });
  };

  const usernameChangeHandler = (e) => {
    setUserData({ ...userData, username: e.target.value });
  };

  const editHandler = () => {
    setIsEditable(!isEditable);
  };

  const loadFile = function (event) {
    const link = URL.createObjectURL(event.target.files[0]);
    setUserData({ ...userData, image: event.target.files[0], avatar: link });
  };

  const submitHandler = async () => {
    const toastId = toast.loading("Updating...");
    try {
      let response = await api.post("/user/update", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success(response.data.message, { id: toastId });
      setIsEditable(false);
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
  };

  return (
    <div className="bg-white mt-10 rounded-2xl p-4 w-full">
      <div className="flex flex-col">
        <Button
          onClick={editHandler}
          className={`${isEditable && "opacity-0 invisible"} w-fit self-end`}
        >
          Edit Profile ✏️
        </Button>

        {/* <!-- Profile Image --> */}
        <div className="relative sm:w-[80%] xs:w-[90%] mx-auto flex mb-5">
          <input id="file" type="file" onChange={loadFile} className="hidden" />
          <img
            className="w-40 h-40 rounded-full "
            src={userData.avatar || alternateProfileImabge}
            ref={image}
            alt=""
          />
          <label
            htmlFor="file"
            className={`${
              !isEditable && "hidden"
            } w-40 h-40 group bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500`}
          >
            <img
              className="block w-12"
              src="https://www.svgrepo.com/show/33565/upload.svg"
              alt=""
            />
          </label>
        </div>

        <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
          {/* <!-- Detail --> */}
          <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
            <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
              <div className="w-full">
                <div className="flex flex-col pb-3">
                  <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                    Username
                  </dt>
                  <dd className="text-lg font-semibold">
                    <input
                      disabled={!isEditable}
                      value={userData.username}
                      onChange={usernameChangeHandler}
                      className={`${
                        isEditable &&
                        "border-[1px] rounded-2xl border-dashed px-2 border-black"
                      } bg-white `}
                    />
                  </dd>
                </div>
                <div className="flex flex-col py-3">
                  <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                    Name
                  </dt>
                  <dd className="text-lg font-semibold">
                    <input
                      disabled={!isEditable}
                      value={userData.name}
                      onChange={nameChangeHandler}
                      className={`${
                        isEditable &&
                        "border-[1px] rounded-2xl border-dashed px-2 border-black"
                      } bg-white capitalize`}
                    />
                  </dd>
                </div>
                <div className="flex flex-col py-3">
                  <p className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                    Email
                  </p>
                  <div className="text-lg font-semibold">
                    <input
                      disabled
                      value={userData.email}
                      className={`bg-white ${!isEditable && "w-full"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${
            !isEditable && " opacity-0 invisible"
          } flex justify-end gap-4`}
        >
          <Button onClick={editHandler} color="red">
            Cancel
          </Button>
          <Button onClick={submitHandler} color="blue">
            Save Change
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
