const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom join endpoint: /bookings?_expand=user&_expand=homestay
server.get("/bookings", (req, res) => {
  const db = router.db; // lowdb instance
  const bookings = db.get("bookings").value();
  const users = db.get("users").value();
  const homestays = db.get("homestays").value();

  const result = bookings.map((b) => ({
    ...b,
    user: users.find((u) => u.id === b.user_id),
    homestay: homestays.find((h) => h.id === b.homestay_id),
  }));

  res.jsonp(result);
});
// Custom join endpoint: /homestays?_expand=user&_expand=homestay_images
server.get("/homestays", (req, res) => {
  const db = router.db; // lowdb instance
  const homestays = db.get("homestays").value();
  const users = db.get("users").value();
  const homestay_images = db.get("homestay_images").value();

  const result = homestays.map((h) => ({
    ...h,
    host: users.find((u) => u.id === h.user_id), // chủ homestay
    images: homestay_images
      .filter((img) => img.homestay_id === h.id)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        is_primary: img.is_primary,
      })),
  }));

  res.jsonp(result);
});

server.get("/homestays/:id", (req, res) => {
  const db = router.db;
  const id = Number(req.params.id);

  // Lấy dữ liệu từ các bảng
  const homestay = db.get("homestays").find({ id }).value();
  const users = db.get("users").value();
  const homestay_images = db.get("homestay_images").value();

  if (!homestay) {
    return res.status(404).json({ message: "Homestay không tồn tại" });
  }

  // Gộp dữ liệu
  const result = {
    ...homestay,
    host: users.find((u) => u.id === homestay.user_id) || null,
    images: homestay_images
      .filter((img) => img.homestay_id === homestay.id)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        is_primary: img.is_primary,
      })),
  };

  res.json(result);
});

server.use(router);
server.listen(3001, () => {
  console.log("✅ JSON Server mock API running on http://localhost:3001");
});
