export async function isAdmin(req, res, next) {
  try {
    if (req.currentUser.role !== "ADMIN") {
      return res.status(401).json({ msg: "User unauthorized." });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}
