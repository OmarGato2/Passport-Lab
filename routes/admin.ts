import express from "express";
import { ensureAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

function ensureAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).send("Forbidden");
}

router.get("/", ensureAuthenticated, ensureAdmin, (req: any, res: any) => {
  const store: any = req.sessionStore;

  store.all((err: any, sessions: any) => {
    if (err) {
      return res.status(500).send("Error fetching sessions");
    }

    const sessionList: { id: string; userId?: number }[] = [];

    if (Array.isArray(sessions)) {
      sessions.forEach((s: any) => {
        const parsed = s;
        sessionList.push({ id: parsed.id || parsed.sessionID || "", userId: (parsed.passport && parsed.passport.user) || undefined });
      });
    } 
    
    else {
      Object.keys(sessions).forEach((sid) => {
        const s = sessions[sid];
        let userId;
        try {
          userId = s && s.passport && s.passport.user;
        } 
        
        catch (e) {
          userId = undefined;
        }
        sessionList.push({ id: sid, userId });
      });
    }

    res.render("admin", { sessions: sessionList });
  });
});

router.post("/revoke/:sessionId", ensureAuthenticated, ensureAdmin, (req: any, res: any) => {
  const sessionId = req.params.sessionId;
  req.sessionStore.destroy(sessionId, (err: any) => {
    if (err) {
      console.error("Error destroying session", err);
      return res.status(500).send("Couldn't revoke session");
    }
    res.redirect("/admin");
  });
});

export default router;
