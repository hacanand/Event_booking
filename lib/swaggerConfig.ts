import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs-extra";
import path from "path";
// Define a type for HTTP methods
type HttpMethod = "get" | "post" | "put" | "delete";

interface RouteMethod {
  summary: string;
  description: string;
  requestBody?: {
    content: {
      "application/json": {
        schema: { type: string };
      };
    };
  };
  responses: Record<number, { description: string }>;
}

// Define a type for API routes
type ApiRoutes = Record<string, Partial<Record<HttpMethod, RouteMethod>>>;

const getApiRoutes = (): ApiRoutes => {
  const routes: ApiRoutes = {};
  const apiDir = path.join(process.cwd(), "app/api");

  const walkDir = (dir: string, parentPath: string = "") => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(parentPath, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath, relativePath);
      } else if (file === "route.ts") {
        const routePath = `/${relativePath
          .replace(/\/route.ts$/, "")
          .replace(/\\/g, "/")}`;

        // Read the file to check for existing methods
        const fileContent = fs.readFileSync(fullPath, "utf-8");

        // Define allowed HTTP methods
        const methods: Partial<Record<HttpMethod, RouteMethod>> = {};

        if (/export\s+async\s+function\s+GET/.test(fileContent)) {
          methods.get = {
            summary: `GET ${routePath}`,
            description: `Auto-generated GET method for ${routePath}`,
            responses: { 200: { description: "Success" } },
          };
        }
        if (/export\s+async\s+function\s+POST/.test(fileContent)) {
          methods.post = {
            summary: `POST ${routePath}`,
            description: `Auto-generated POST method for ${routePath}`,
            requestBody: {
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            responses: { 201: { description: "Created" } },
          };
        }
        if (/export\s+async\s+function\s+PUT/.test(fileContent)) {
          methods.put = {
            summary: `PUT ${routePath}`,
            description: `Auto-generated PUT method for ${routePath}`,
            requestBody: {
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            responses: { 200: { description: "Updated" } },
          };
        }
        if (/export\s+async\s+function\s+DELETE/.test(fileContent)) {
          methods.delete = {
            summary: `DELETE ${routePath}`,
            description: `Auto-generated DELETE method for ${routePath}`,
            responses: { 204: { description: "Deleted" } },
          };
        }

        // Add to routes if methods exist
        if (Object.keys(methods).length > 0) {
          routes[routePath] = methods;
        }
      }
    });
  };

  walkDir(apiDir);
  return routes;
};

// Generate Swagger Spec
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js Dynamic API Docs",
      version: "1.0.0",
      description: "Auto-generated API documentation for Next.js App Router",
    },
    servers: [{ url: "http://localhost:3000" }],
    paths: getApiRoutes(), // Dynamically add API routes
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
