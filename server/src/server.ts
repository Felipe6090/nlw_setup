import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./lib/routes";
import { NotificationRoutes } from "./lib/notifications-routes";

const app = Fastify();

app.register(cors);
app.register(appRoutes);
app.register(NotificationRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP server running!"));
