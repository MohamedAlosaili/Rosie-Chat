import { search } from "imgs"

function ChatList() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="dark:text-primary-200 text-2xl font-semibold">Chats</h1>
      <form className="relative">
        <input 
          type="search" 
          placeholder="Search..."
          className={`peer w-full focus:outline-none rounded-full px-4 pr-10 py-2 text-sm dark:bg-primary-800 dark:text-primary-200 transition-colors focus:placeholder:transition-colors
                      dark:focus:placeholder:text-primary-200 border-2 dark:border-primary-700 dark:focus:border-accent `
        }
        />
        <img 
          src={search} 
          alt="Search icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 invert-[0.7] peer-focus:invert-[0.9] w-4" 
        />
      </form>
      <ul>
        
      </ul>
    </section>
  );
}

export default ChatList;
