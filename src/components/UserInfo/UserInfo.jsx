import React from "react";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className="">
      <img className="" src={avatarUrl || "/noavatar.png"} alt={fullName} />
      <div className="">
        <span className="">{fullName}</span>
        <span className="">{additionalText}</span>
      </div>
    </div>
  );
};

export default UserInfo;
