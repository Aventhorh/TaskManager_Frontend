import React from "react";

const findSingleElement = (nums) => {
  let result = 0;

  for (const num of nums) {
    result ^= num;
  }

  return result;
};

const FindSingle = () => {
  const nums = [4, 1, 2, 1, 2, 2, 1];

  return <div>{findSingleElement(nums)}</div>;
};

export default FindSingle;
