CREATE TABLE `faizan_db`.`users_logins` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(200) NULL,
  `added_on` DATETIME NULL,
  `is_freeze` INT(1) NULL DEFAULT 0,
  `status` INT(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`));


ALTER TABLE `faizan_db`.`users_logins` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `faizan_db`.`users_logins`   
	ADD COLUMN `user_id` INT(11) NOT NULL AFTER `id`;


CREATE TABLE `faizan_db`.`users_details` (  
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(200),
  `last_name` VARCHAR(200),
  `gender` VARCHAR(100),
  `dob` DATE,
  `email` VARCHAR(100),
  `mobile` VARCHAR(100),
  `address` VARCHAR(500),
  `added_on` TIMESTAMP,
  `status` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`) 
);
