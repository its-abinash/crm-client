import routes from "../routes";

export const useRouteName = () => {
  let name = "";
  routes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = route.name;
    }
  });
  return name;
};
