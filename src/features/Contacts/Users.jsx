import { memo } from "react";
import PropTypes from "prop-types";

import { BsFillPersonPlusFill } from "react-icons/bs";

import UserCard from "./UserCard";
import SkeletonLoader from "components/SkeletonLoader";
import SearchForm from "components/SearchForm";
import Button from "components/Button";
import useSearch from "hooks/useSearch";

function Users({
  currentUser,
  updateDocument,
  results,
  contactTap,
  setContactTap,
}) {
  const users =
    contactTap === "friends"
      ? results.allUsers?.filter((user) =>
          currentUser.friends.includes(user.uid)
        )
      : results.allUsers;
  const [searchValue, setSearchValue, searchResults] = useSearch(
    "users",
    users,
    "displayName"
  );

  const usersElements = (searchValue ? searchResults : users)?.map((user) => (
    <UserCard
      key={user.uid}
      user={user}
      isFriend={currentUser.friends.includes(user.uid)}
      currentUser={currentUser}
      updateDocument={updateDocument}
    />
  ));

  return (
    <div className="flex flex-col gap-4">
      <SearchForm
        value={searchValue}
        setValue={setSearchValue}
        disabled={
          (usersElements?.length === 0 && searchValue === "") ||
          results.usersLoading ||
          results.usersError
        }
      />
      {results.usersError && (
        <div className="mt-4 flex items-center justify-center gap-2 dark:text-primary-200">
          <BsExclamationCircleFill size={20} className="text-red-800" />
          {usersError?.code ?? (
            <span className="text-sm">
              Something went wrong while loading users <br /> Please try again
              in a minute
            </span>
          )}
        </div>
      )}
      {results.usersLoading && (
        <SkeletonLoader.Cards
          isUser={true}
          isFriend={contactTap === "friends"}
        />
      )}
      {usersElements?.length > 0 ? (
        <ul>{usersElements}</ul>
      ) : (
        !results.usersLoading &&
        (searchValue === "" && contactTap === "friends" ? (
          <Button handleClick={() => setContactTap("allUsers")}>
            Add firends
            <BsFillPersonPlusFill size={20} />
          </Button>
        ) : (
          <div className="break-all text-center dark:text-primary-200">
            <p>
              Results for:{" "}
              <span className="italic dark:text-primary-400">
                {searchValue}
              </span>
            </p>
            <p>No user found.</p>
          </div>
        ))
      )}
    </div>
  );
}

Users.propTypes = {
  currentUser: PropTypes.object.isRequired,
  updateDocument: PropTypes.func,
  results: PropTypes.shape({
    allUsers: PropTypes.array,
    usersLoading: PropTypes.bool,
    usersError: PropTypes.oneOf([PropTypes.symbol, PropTypes.object]),
  }).isRequired,
  contactTap: PropTypes.string.isRequired,
  setContactTap: PropTypes.func,
};

export default memo(Users);
