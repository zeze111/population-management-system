import express from "express";
import location from "./controllers/locations";

const router = express.Router();
router.post("/location", location.create);
router.put("/location/:locationId", location.update);
router.get("/locations", location.getAll);
router.delete("/location/:locationId", location.delete);

export default router;
