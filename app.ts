import express from "express";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import hpp from "hpp";
import helmet from "helmet";

import debatePostsRotuer from "@routes/debatePosts";
import userRotuer from "@routes/user";
import usersRotuer from "@routes/users";
import balanceDebatePostRotuer from "@routes/balanceDebatePost";
import balanceDebatePostsRotuer from "@routes/balanceDebatePosts";
import prosConsDebatePostRotuer from "@routes/prosConsDebatePost";
import prosConsDebatePostsRotuer from "@routes/prosConsDebatePosts";
import issueDebatePostRotuer from "@routes/issueDebatePost";
import issueDebatePostsRotuer from "@routes/issueDebatePosts";
import debateTopicPostRotuer from "@routes/debateTopicPost";
import debateTopicPostsRotuer from "@routes/debateTopicPosts";

import { sequelize } from "@models";
import passportConfig from "./src/passport";
import passport from "passport";
import dayjs from "dayjs";

const app = express();

dotenv.config();

passportConfig();

sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 관련 데이터처리
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://debatalk.kro.kr"
        : "http://localhost:3000",
    credentials: true, // 쿠키 공유
    maxAge: 3600,
  })
);

app.set("trust proxy", 1);
app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      expires: dayjs().add(1, "h").toDate(),
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? "debatalk.kro.kr" : "localhost",
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/balance-debate-post", balanceDebatePostRotuer);
app.use("/balance-debate-posts", balanceDebatePostsRotuer);
app.use("/issue-debate-post", issueDebatePostRotuer);
app.use("/issue-debate-posts", issueDebatePostsRotuer);
app.use("/proscons-debate-posts", prosConsDebatePostsRotuer);
app.use("/proscons-debate-post", prosConsDebatePostRotuer);
app.use("/debate-topic-post", debateTopicPostRotuer);
app.use("/debate-topic-posts", debateTopicPostsRotuer);
app.use("/debate-posts", debatePostsRotuer);
app.use("/user", userRotuer);
app.use("/users", usersRotuer);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
  app.listen(8080, () => {
    console.log("실 서버 실행중");
  });
} else {
  app.use(morgan("dev"));
  app.listen(3065, () => {
    console.log("개발 서버 실행중");
  });
}
