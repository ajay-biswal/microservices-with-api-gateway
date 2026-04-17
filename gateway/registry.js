const routes = [];

export const registerRoutes = (newRoutes) => {
  newRoutes.forEach((route) => {
    const registeredRoute = {
      method: route.method.toUpperCase(),
      path: route.path,
      target: route.target,
    };

    const existingRouteIndex = routes.findIndex(
      (existingRoute) =>
        existingRoute.method === registeredRoute.method &&
        existingRoute.path === registeredRoute.path
    );

    if (existingRouteIndex >= 0) {
      routes[existingRouteIndex] = registeredRoute;
      return;
    }

    routes.push(registeredRoute);
  });
};

// 🔥 Match dynamic routes like /tasks/:id
const matchPath = (routePath, requestPath) => {
  const regexPath = routePath.replace(/:[^/]+/g, "[^/]+");
  const regex = new RegExp(`^${regexPath}$`);
  return regex.test(requestPath);
};

export const getRoute = (method, requestPath) => {
  for (const route of routes) {
    if (route.method === method && matchPath(route.path, requestPath)) {
      return route.target;
    }
  }
  return null;
};
