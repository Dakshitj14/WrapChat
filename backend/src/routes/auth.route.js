import express from 'express';
import { checkAuth, signup, login, logout, updateProfile, upload } from '../controllers/auth.controller.js'; // ✅ Import `upload`
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ✅ Ensure `protectRoute` runs before file upload middleware
router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
