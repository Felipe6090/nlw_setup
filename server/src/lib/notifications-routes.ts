import WebPush, { setVapidDetails } from "web-push";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const publicKey =
  "BKQtTvGlV3gCvYOX-wL05PsEkFSLVu6ItIKp8FIlVyksrvS1f18SXrLdKG5uuWMGbN0ws3x3UxPTtVppO6Cf6Sw";
const privateKey = "OLWxJFSWEmEudcOFZMhIApFyl1PWS4M_G0fXJNRAUak";

WebPush.setVapidDetails("http://localhost:3333", publicKey, privateKey);

export async function NotificationRoutes(app: FastifyInstance) {
  app.get("/push/public_key", () => publicKey);

  app.post("/push/register", (req, res) => {
    console.log(req.body);

    return res.status(201).send();
  });

  app.post("/push/send", (req, res) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(req.body);

    WebPush.sendNotification(subscription, "Hello do backend");

    return res.status(201).send();
  });
}
