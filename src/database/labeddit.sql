-- Active: 1692217513982@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL, 
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT NULL, 
  creator_id TEXT NOT NULL, /*ref: > users.id */
  content TEXT NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at TEXT DEFAULT(DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE comments (
   id TEXT PRIMARY KEY UNIQUE NOT NULL,
   creator_id TEXT NOT NULL, 
   content TEXT NOT NULL,   
   likes INTEGER NOT NULL,
   dislikes INTEGER NOT NULL,
   created_at TEXT DEFAULT(DATETIME()) NOT NULL,
   updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
   post_id TEXT NOT NULL,
   FOREIGN KEY (creator_id) REFERENCES users(id)
   ON UPDATE CASCADE
   ON DELETE CASCADE,
   FOREIGN KEY (post_id) REFERENCES post (id)
   ON UPDATE CASCADE
   ON DELETE CASCADE 
);

CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL, /*ref: <> users.id*/
  post_id TEXT NOT NULL, /*ref: <> posts.id*/ 
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE likes_dislikes_comments (
  user_id TEXT NOT NULL,  
  comment_id TEXT NOT NULL, 
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE 
);


-- LEITURA TABELAS

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM comments;

SELECT * FROM likes_dislikes

SELECT * FROM likes_dislikes_comments


-- POPULANDO TABELAS
INSERT INTO () VALUES ()



--DELETAR TABELAS

DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;