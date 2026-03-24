import pets from "../assets/icons/pets.png";
import homecare from "../assets/icons/homecare.png";
import housekeeping from "../assets/icons/housekeeping.png";
import childcare from "../assets/icons/childcare.png";
import diy from "../assets/icons/diy.png";
import transport from "../assets/icons/transport.png";
import personalCare from "../assets/icons/personal-care.png";
import support from "../assets/icons/support.png";
import gardening from "../assets/icons/gardening.png";

const ICON_MAP = {
  Pets: pets,
  Homecare: homecare,
  Housekeeping: housekeeping,
  Childcare: childcare,
  DIY: diy,
  Transport: transport,
  "Personal Care": personalCare,
  "Tech Support": support,
  Gardening: gardening,
};

export const renderIconsImage = (name) => {
  return ICON_MAP[name] || pets;
};
