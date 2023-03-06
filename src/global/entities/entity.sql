-- Active: 1677140068456@@127.0.0.1@3306@sixpack
CREATE TABLE `users` (
	`id`	int	NOT NULL,
	`email`	varchar(100)	NOT NULL,
	`password`	varchar(100)	NOT NULL,
	`phone`	varchar(30)	NOT NULL,
	`nickname`	varchar(30)	NOT NULL,
	`membership`	varchar(30)	NULL
);

CREATE TABLE `busienssusers` (
	`id`	int	NOT NULL,
	`email`	varchar(100)	NOT NULL,
	`password`	varchar(100)	NOT NULL,
	`phone`	varchar(100)	NOT NULL,
	`name`	varchar(30)	NOT NULL
);

CREATE TABLE `payments` (
	`id`	int	NOT NULL,
	`id2`	int	NOT NULL,
	`imp_uid`	varchar(255)	NOT NULL,
	`merchant_uid`	varchar(100)	NOT NULL,
	`customer_uid`	varchar(100)	NOT NULL,
	`status`	varchar(255)	NOT NULL	COMMENT '0 = 취소 전
0 = 취소',
	`amount`	int	NOT NULL
);

CREATE TABLE `gym` (
	`id`	int	NOT NULL,
	`business_id`	int	NOT NULL,
	`name`	varchar(100)	NOT NULL,
	`phone`	varchar(100)	NOT NULL,
	`address`	varchar(100)	NOT NULL,
	`description`	varchar(255)	NOT NULL,
	`certification`	varchar(255)	NOT NULL,
	`isApprove`	tinyint	NOT NULL	DEFAULT 0	COMMENT '0 = 승인 전
1 = 승인 완료'
);

CREATE TABLE `feeds` (
	`id`	int	NOT NULL,
	`user_id`	int	NOT NULL,
	`content`	varchar(100)	NOT NULL
);

CREATE TABLE `comments` (
	`id`	int	NOT NULL,
	`feed_id`	int	NOT NULL,
	`user_id`	int	NOT NULL,
	`comment`	varchar(100)	NOT NULL
);

CREATE TABLE `user_gym` (
	`id`	int	NOT NULL,
	`gym_id`	int	NOT NULL,
	`user_id`	int	NOT NULL
);

CREATE TABLE `reviews` (
	`id`	int	NOT NULL,
	`user_gym_id`	int	NOT NULL,
	`review`	varchar(100)	NOT NULL,
	`star`	varchar(100)	NOT NULL,
	`img`	varchar(255)	NULL
);

CREATE TABLE `gym_img` (
	`id`	int	NOT NULL,
	`gym_id`	int	NOT NULL,
	`img`	varchar(255)	NOT NULL
);

CREATE TABLE `feeds_img` (
	`id`	int	NOT NULL,
	`feed_id`	int	NOT NULL,
	`image`	varchar(255)	NULL
);

ALTER TABLE `users` ADD CONSTRAINT `PK_USERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `busienssusers` ADD CONSTRAINT `PK_BUSIENSSUSERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `payments` ADD CONSTRAINT `PK_PAYMENTS` PRIMARY KEY (
	`id`,
	`id2`
);

ALTER TABLE `gym` ADD CONSTRAINT `PK_GYM` PRIMARY KEY (
	`id`,
	`business_id`
);

ALTER TABLE `feeds` ADD CONSTRAINT `PK_FEEDS` PRIMARY KEY (
	`id`,
	`user_id`
);

ALTER TABLE `comments` ADD CONSTRAINT `PK_COMMENTS` PRIMARY KEY (
	`id`,
	`feed_id`,
	`user_id`
);

ALTER TABLE `user_gym` ADD CONSTRAINT `PK_USER_GYM` PRIMARY KEY (
	`id`,
	`gym_id`,
	`user_id`
);

ALTER TABLE `reviews` ADD CONSTRAINT `PK_REVIEWS` PRIMARY KEY (
	`id`,
	`user_gym_id`
);

ALTER TABLE `gym_img` ADD CONSTRAINT `PK_GYM_IMG` PRIMARY KEY (
	`id`,
	`gym_id`
);

ALTER TABLE `feeds_img` ADD CONSTRAINT `PK_FEEDS_IMG` PRIMARY KEY (
	`id`,
	`feed_id`
);

ALTER TABLE `payments` ADD CONSTRAINT `FK_users_TO_payments_1` FOREIGN KEY (
	`id2`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `gym` ADD CONSTRAINT `FK_busienssusers_TO_gym_1` FOREIGN KEY (
	`business_id`
)
REFERENCES `busienssusers` (
	`id`
);

ALTER TABLE `feeds` ADD CONSTRAINT `FK_users_TO_feeds_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `comments` ADD CONSTRAINT `FK_feeds_TO_comments_1` FOREIGN KEY (
	`feed_id`
)
REFERENCES `feeds` (
	`id`
);

ALTER TABLE `comments` ADD CONSTRAINT `FK_feeds_TO_comments_2` FOREIGN KEY (
	`user_id`
)
REFERENCES `feeds` (
	`user_id`
);

ALTER TABLE `user_gym` ADD CONSTRAINT `FK_gym_TO_user_gym_1` FOREIGN KEY (
	`gym_id`
)
REFERENCES `gym` (
	`id`
);

ALTER TABLE `user_gym` ADD CONSTRAINT `FK_users_TO_user_gym_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
);

ALTER TABLE `reviews` ADD CONSTRAINT `FK_user_gym_TO_reviews_1` FOREIGN KEY (
	`user_gym_id`
)
REFERENCES `user_gym` (
	`id`
);

ALTER TABLE `gym_img` ADD CONSTRAINT `FK_gym_TO_gym_img_1` FOREIGN KEY (
	`gym_id`
)
REFERENCES `gym` (
	`id`
);

ALTER TABLE `feeds_img` ADD CONSTRAINT `FK_feeds_TO_feeds_img_1` FOREIGN KEY (
	`feed_id`
)
REFERENCES `feeds` (
	`id`
);