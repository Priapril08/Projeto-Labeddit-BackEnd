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
  comments INTEGER DEFAULT(0) NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at TEXT DEFAULT(DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE comments_posts(
  id TEXT PRIMARY KEY UNIQUE NOT NULL, 
  creator_id TEXT NOT NULL,
  content TEXT NOT NULL, 
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL, 
  created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
  updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
  post_id TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
)

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
  FOREIGN KEY (comment_id) REFERENCES comments_posts (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE 
);

-- LEITURA TABELAS

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes

SELECT * FROM comments_posts


-- POPULANDO TABELAS
INSERT INTO users (id, name, email, password, role) 
VALUES ("u001", "Priscila", "priscila@email.com", "pri123456", "ADMIN"), --senha Priscila pri123456
("u002", "Dennis", "dennis@email.com", "denn123456", "NORMAL") -- senha Dennis denn123456 // Adriano adri123456 // Janaina jan123456

INSERT INTO posts (id, creator_id, content, comments, likes, dislikes)
VALUES("p001", "u001", "Hello, eu sou a Admin!", "", 0, 0 ),
("p002", "u002", "Oi, meu acesso é limitado!", "", 0, 0)


--DELETAR TABELAS

DROP TABLE users;

DROP TABLE posts;

DROP TABLE comments_posts;

DROP TABLE likes_dislikes;






