import React from "react";

export const UserInfo = ({ fullName, additionalText }) => {
  return (
    <div className="flex flex-col">
      <span className="text-lightGray">{fullName}</span>
      <span className="text-lightGray">{additionalText}</span>
    </div>
  );
};

export default UserInfo;
