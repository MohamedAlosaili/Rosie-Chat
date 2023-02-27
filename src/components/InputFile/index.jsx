import { memo } from "react";
import PropTypes from "prop-types";

import { TbEdit } from "react-icons/tb";
import Image from "components/Image";

const InputFile = ({ changeFile, className, img, loading, isPreviewUrl }) => (
  <label
    className={`relative mt-2 aspect-square w-20 min-w-[5rem] cursor-pointer overflow-hidden rounded-full ${
      className ?? ""
    }`}
  >
    <input
      type="file"
      value=""
      disabled={loading}
      onChange={changeFile}
      className="hidden"
      accept="image/*"
    />
    {img?.url && <Image img={img} className="aspect-square w-full" />}
    {!isPreviewUrl && (
      <div className="absolute inset-0 grid place-items-center bg-black/50 transition-colors hover:bg-black/25">
        <TbEdit size={25} />
      </div>
    )}
  </label>
);

InputFile.propTypes = {
  changeFile: PropTypes.func,
  loading: PropTypes.bool,
  img: PropTypes.shape({
    photoURL: PropTypes.string,
    name: PropTypes.string,
  }),
  isPreviewUrl: PropTypes.bool,
};

export default memo(InputFile);
