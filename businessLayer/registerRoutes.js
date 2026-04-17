import axios from "axios";

const DEFAULT_RETRY_DELAY_MS = 2000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const joinPaths = (basePath, routePath) => {
  const base = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const route = routePath === "/" ? "" : routePath;

  return `${base}${route}` || "/";
};

const getRoutesFromStack = (stack, basePath = "") => {
  const routes = [];

  stack.forEach((middleware) => {
    if (!middleware.route) return;

    const methods = Object.keys(middleware.route.methods);
    const path = joinPaths(basePath, middleware.route.path);

    methods.forEach((method) => {
      routes.push({
        method: method.toUpperCase(),
        path,
        target: "http://business:5001"
      });
    });
  });

  return routes;
};

export const registerWithGateway = async (mountedRoutes = []) => {
  const routes = mountedRoutes.flatMap(({ basePath, router }) =>
    getRoutesFromStack(router.stack ?? [], basePath)
  );

  if (!process.env.GATEWAY_URL) {
    console.error("❌ Failed to register routes: GATEWAY_URL is not configured");
    return;
  }

  const retryAttempts = Number(process.env.GATEWAY_REGISTER_RETRY_ATTEMPTS) || 0;
  const retryDelayMs =
    Number(process.env.GATEWAY_REGISTER_RETRY_DELAY_MS) || DEFAULT_RETRY_DELAY_MS;

  for (let attempt = 1; retryAttempts === 0 || attempt <= retryAttempts; attempt += 1) {
    try {
      await axios.post(`${process.env.GATEWAY_URL}/register`, routes, {
        timeout: 5000
      });
      console.log("✅ Routes auto-registered:", routes);
      return;
    } catch (err) {
      if (err.response) {
        console.error(
          `❌ Failed to register routes: gateway responded with ${err.response.status}`,
          err.response.data
        );
        return;
      }

      const isLastAttempt = retryAttempts > 0 && attempt === retryAttempts;
      const reason = err.code || err.name || "Unknown error";
      const message = err.message || "Gateway is not reachable";

      if (isLastAttempt) {
        console.error(`❌ Failed to register routes after ${retryAttempts} attempts:`, reason, message);
        return;
      }

      console.warn(
        `Gateway unavailable (${reason}). Retrying route registration in ${retryDelayMs}ms ` +
          (retryAttempts > 0 ? `(${attempt}/${retryAttempts})` : `(attempt ${attempt})`)
      );
      await wait(retryDelayMs);
    }
  }
};
