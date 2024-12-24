-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "questions" (
	"question_id" bigint,
	"content_english" varchar(255),
	"content_german" varchar(255),
	"content_french" varchar(255),
	"content_spanish" varchar(255),
	"content_italian" varchar(255),
	"content_dutch" varchar(255),
	"content_portuguese" varchar(255),
	"content_french_canada" varchar(255),
	"choice1_english" varchar(255),
	"choice1_german" varchar(255),
	"choice1_french" varchar(255),
	"choice1_spanish" varchar(255),
	"choice1_italian" varchar(255),
	"choice1_dutch" varchar(255),
	"choice1_portuguese" varchar(255),
	"choice1_french_canada" varchar(255),
	"choice2_english" varchar(255),
	"choice2_german" varchar(255),
	"choice2_french" varchar(255),
	"choice2_spanish" varchar(255),
	"choice2_italian" varchar(255),
	"choice2_dutch" varchar(255),
	"choice2_portuguese" varchar(255),
	"choice2_french_canada" varchar(255),
	"type" varchar(1),
	"category" smallint,
	"date" date
);
--> statement-breakpoint
CREATE TABLE "suggestions" (
	"id" serial NOT NULL,
	"country_code" integer,
	"region_code" integer,
	"language_code" integer,
	"content" varchar,
	"choice1" varchar,
	"choice2" varchar,
	"wii_no" bigint
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100),
	"password_hash" varchar
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" bigint DEFAULT nextval('votes_new_column_seq'::regclass),
	"type_cd" smallint,
	"question_id" bigint,
	"wii_no" bigint,
	"country_id" smallint,
	"region_id" smallint,
	"ans_cnt" bigint,
	"new_column" serial NOT NULL
);

*/