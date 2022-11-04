const express = require("express");
var cookieSession = require("cookie-session");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  cookieSession({
    name: "ufc-web-session",
    secret: "c293x8b6234z82n938246bc2938x4zb234",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.use((req, res, next) => {
  //console.log("== Session Log Middleware");
  //console.log(req.session);
  next();
});

// app.use((req, res, next) => {
//   // console.log("== Root Middleware");
//   if (req.path == "/") {
//     if (req.session.user) {
//       // console.log("Go home");
//       res.redirect("/home");
//     } else next();
//   } else next();
// });

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoRepository = require("./repository/mongo-repository");

app.get("/", (req, res) => {
  res.render("raiz/home");
});
app.get("/signin", (req, res) => {
  //console
  res.render("cadastro/home");
});
app.post("/form-login", (req, res) => {
  // console.log("post - /login");
  // console.log(req.body);
  mongoRepository.getUsers(req.body.login, req.body.pass).then((users) => {
    if (users.length > 0) {
      req.session.user = users[0];
      res.redirect("/loja");
      return;
    } else res.redirect("/");
  });
});

app.use((req, res, next) => {
  console.log("User Authenticator");
  console.log(req.session);
  if (req.session.user) {
    next();
  } else res.redirect("/");
});

app.use("/loja/*", (req, res, next) => {
  // console.log("== Student Area Middleware");
  console.log("req.session.user.role - ", req.session.user.role);
  if (req.session.user.role == "student") {
    next();
  } else res.redirect("/home");
});

app.get("/loja", async (req, res) => {
  const ListCars = await mongoRepository.getAllCars();
  console.log("req.session.user.role - >", req.session.user.role);
  console.log("Nome do usuario - >", req.session.user.username);

  res.render("loja/home", { user: req.session.user, cars: ListCars });
});

app.use("/admin/*", (req, res, next) => {
  // console.log("== Admin Area Middleware");
  // console.log(req.session);
  console.log("session.user.role - ", req.session.user.role);
  if (req.session.user.role == "admin") {
    next();
  } else res.redirect("/home");
});

app.get("/admin/home", (req, res) => {
  res.render("admin/home", { user: req.session.user });
});

app.get("/cars", async (req, res) => {
  const ListCars = await mongoRepository.getAllCars();
  console.log("carros", ListCars[0]);
  res.render("car/home", { cars: ListCars });
});

app.get("/signup", (req, res) => {
  //console
  res.render("login/home");
});

app.post("/form-cadastro-users", async (req, res) => {
  const { username, email, password, confirmPassword, genero, data } = req.body;
  console.log(username, email, password, confirmPassword, genero, data);
  // type UserData = {
  //   nome: String;
  //   email: String;
  //   senha: String;
  //   confirmacaoSenha: String;
  //   genero: String;
  //   data: String;
  // }
  const user = {
    username,
    email,
    password,
    confirmPassword,
    role: "student",
    genero,
    data,
  };
  const result = await mongoRepository.setUsers(user);
  console.log("Deu certo registrar = ", result);
  res.redirect("/home");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
