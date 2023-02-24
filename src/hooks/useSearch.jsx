import { useRef, useState } from "react";

function useSearch(list, type, currentUserId) {
  const [value, setValue] = useState("");
  const results = useRef([]);

  const changeValue = (e) => {
    results.current = [];

    const newSearchValue = e.target.value;
    setValue(newSearchValue);
    if (type === "chats") {
      setChatsResults(newSearchValue);
    } else {
      setUsersResults(newSearchValue);
    }
  };

  const setUsersResults = (newSearchValue) => {
    results.current = list.filter((item) =>
      item.displayName.toLowerCase().includes(newSearchValue.toLowerCase())
    );
  };

  const setChatsResults = (newSearchValue) => {
    results.current = list.filter((chat) => {
      if (chat.isGroup) {
        return chat.chatInfo.name
          .toLowerCase()
          .includes(newSearchValue.toLowerCase());
      } else {
        const chatInfo = chat.members.filter(
          (memberId) => memberId !== currentUserId
        )[0];
        return chat[chatInfo].name
          .toLowerCase()
          .includes(newSearchValue.toLowerCase());
      }
    });
  };

  return [value, changeValue, results.current];
}

export default useSearch;
