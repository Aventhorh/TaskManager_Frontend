import React, { useState, useEffect } from "react";

const TextGenerator = () => {
  const description =
    "Добро пожаловать в Систему управления задачами! Эффективно управляйте своими задачами.";
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (currentIndex < description.length) {
      const timeout = setTimeout(() => {
        setTypedText((prevText) => prevText + description[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      setCursorVisible(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prevCursorVisible) => !prevCursorVisible);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="py-20 pl-10 text-secondary rounded-lg  border-x-4 border-darkGray">
      <div className="w-[80%] min-h-[150px] overflow-hidden">
        <pre className="whitespace-pre-line text-6xl">
          {typedText}
          <span style={{ width: "1ch", opacity: cursorVisible ? 1 : 0 }}>
            |
          </span>
        </pre>
      </div>
    </div>
  );
};

export default TextGenerator;
