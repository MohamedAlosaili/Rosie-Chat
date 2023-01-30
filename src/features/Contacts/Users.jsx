import { memo, useContext } from "react"
import PropTypes from "prop-types"

import { BsFillPersonPlusFill } from "react-icons/bs"

import UserCard from "./UserCard"
import { SearchForm, Button } from "components"
import { useSearch } from "hooks"

function Users({ currentUserDoc, allUsers, contactTap, setContactTap }) {

    const users = contactTap === "friends" ? allUsers?.filter(user => currentUserDoc.friends.includes(user.uid)) : allUsers
    const [searchValue, setSearchValue, searchResults] = useSearch("users", users, "displayName")

    const usersElements = (searchValue ? searchResults : users)?.map(user => (
        <UserCard
            key={user.uid}
            user={user}
            isFriend={currentUserDoc.friends.includes(user.uid)}
            currentUserDoc={currentUserDoc}
        />
    ))

    return (
        <div className="flex flex-col gap-4">
            <SearchForm
                value={searchValue}
                setValue={setSearchValue}
                disabled={usersElements?.length === 0 && searchValue === ""}
            />
            {usersElements?.length > 0
                ? <ul>{usersElements}</ul>
                : (
                    (searchValue === "" && contactTap === "friends")
                        ? (
                            <Button handleClick={() => setContactTap("allUsers")}>
                                Add firends
                                <BsFillPersonPlusFill size={20} />
                            </Button>
                        )
                        : (
                            <div className="text-center dark:text-primary-200 break-all">
                                <p>Results for: <span className="italic dark:text-primary-400">{searchValue}</span></p>
                                <p>No user found.</p>
                            </div>
                        )
                )
            }
        </div>
    )
}

Users.propTypes = {
    currentUserDoc: PropTypes.object.isRequired,
    allUsers: PropTypes.array.isRequired,
    contactTap: PropTypes.string.isRequired,
    setContactTap: PropTypes.func
}

export default memo(Users)