CREATE SCHEMA IF NOT EXISTS `todolist` ;
USE `todolist` ;

-- -----------------------------------------------------
-- Table `todolist`.`login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `todolist`.`login` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todolist`.`list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `todolist`.`list` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idLogin` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`, `idLogin`),
  INDEX `fk_table1_1_idx` (`idLogin` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_table1_1`
    FOREIGN KEY (`idLogin`)
    REFERENCES `todolist`.`login` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;