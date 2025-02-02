import { nanoid } from "nanoid";

const generateUniqueId = () => {
  return nanoid(6);
};

export default generateUniqueId;
