import PropTypes from "prop-types"

import { send } from "imgs"

function Form() {
    return (
        <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center rounded-full border p-2 dark:bg-primary-900 dark:border-primary-700"
        >
            <input 
                type="text" 
                placeholder="Type a message"
                className="flex-1 text-primary-200 px-4 focus:outline-none bg-transparent"
            />
            <button className="w-10 aspect-square grid place-items-center rounded-50 bg-accent hover:bg-accent-600">
                <img src={send} className="invert" />
            </button>
        </form>
    )
}

Form.propTypes = {}

export default Form