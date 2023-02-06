import { Img } from "./Img";
import { Div } from "./Div";

const Card = ({ isUser, isFriend }) => (
  <div
    className={`grid grid-cols-[auto_1fr_minmax(50px,_auto)] items-center gap-2 p-4`}
  >
    <Img width="3.5rem" height="3.5rem" borderRadius="50%" />
    <div>
      <Div width="75%" className="mb-4" />
      <Div width="75%" height="10px" />
    </div>
    {isUser ? (
      <div className="flex gap-2">
        <Div
          width="2rem"
          height="2rem"
          borderRadius="12px"
          className="ml-auto"
        />
        {isFriend && <Div width="2rem" height="2rem" borderRadius="12px" />}
      </div>
    ) : (
      <div>
        <Div height={10} className="mb-2" />
        <Div width={20} height={20} className="ml-auto" />
      </div>
    )}
  </div>
);

const Cards = ({ count, isUser, isFriend }) =>
  Array(count)
    .fill(0)
    .map((item, idx) => <Card key={idx} isUser={isUser} isFriend={isFriend} />);

Cards.defaultProps = {
  count: 5,
  isUser: false,
  isFriend: false,
};

export { Card, Cards };
