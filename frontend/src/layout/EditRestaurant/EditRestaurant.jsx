import React from "react";
import GeneralInfoForm from "../../components/GeneralInfoForm/GeneralInfoForm.jsx";
import CusineInfoForm from "../../components/CusineInfoForm/CusineInfoForm.jsx";

const EditRestaurant = () => {
  return (
    <div className="px-8 mx-auto my-7 rounded-2xl py-10 bg-white sm:w-11/12">
      <GeneralInfoForm />
      <CusineInfoForm />
    </div>
  );
};

export default EditRestaurant;
