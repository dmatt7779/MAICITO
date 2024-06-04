****************************************************************************************************
* Create New DataBase ******************************************************************************
****************************************************************************************************
CREATE DATABASE IF NOT EXISTS ceipa_chatbot DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ceipa_chatbot;

****************************************************************************************************
* Register New User ********************************************************************************
****************************************************************************************************
CREATE TABLE IF NOT EXISTS users(
    id BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password BLOB NOT NULL,
    token TEXT NULL DEFAULT NULL,
    state VARCHAR(10) NOT NULL,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    UNIQUE(email)
) ENGINE=INNODB CHARACTER SET=utf8mb4, COLLATE=utf8mb4_general_ci;

DROP PROCEDURE IF EXISTS registerUser;
DELIMITER $$
CREATE PROCEDURE registerUser(
	IN _name VARCHAR(150),
    IN _email VARCHAR(50),
    IN _password BLOB,
    IN _state VARCHAR(10)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        INSERT INTO users (name, email, password, state) VALUES (_name, _email, _password, _state);
        SELECT 'Success' AS Level;
    COMMIT;
END $$
DELIMITER ;
****************************************************************************************************
* Sign In ******************************************************************************************
****************************************************************************************************
DROP PROCEDURE IF EXISTS signIn;
DELIMITER $$
CREATE PROCEDURE signIn(
    IN _email VARCHAR(50)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    SELECT BIN_TO_UUID(id), name, email, password, state, token
        FROM users
        WHERE email = _email;
END $$
DELIMITER ;
****************************************************************************************************
* Update Data After Login **************************************************************************
****************************************************************************************************
DROP PROCEDURE IF EXISTS updateSignIn;
DELIMITER $$
CREATE PROCEDURE updateSignIn(
    IN _id VARCHAR(50),
    IN _token TEXT,
    IN _state VARCHAR(10)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    UPDATE users SET
        token = _token,
        state = _state
    WHERE id =UUID_TO_BIN(_id);
    SELECT 'Success' AS Level;
END $$
DELIMITER ;
****************************************************************************************************
* Register New Room *****************************************************************************
****************************************************************************************************
CREATE TABLE IF NOT EXISTS rooms(
    id BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(250) NOT NULL,
    introduction TEXT NOT NULL, 
    total_words INT NOT NULL,
    path_public VARCHAR(16) NOT NULL,
    name_files TEXT NOT NULL,
    image_room VARCHAR(250) NOT NULL,
    state VARCHAR(10) NOT NULL,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    UNIQUE(title)
)  ENGINE=INNODB CHARACTER SET=utf8mb4, COLLATE=utf8mb4_general_ci;

DROP PROCEDURE IF EXISTS registerRoom;
DELIMITER $$
CREATE PROCEDURE registerRoom(
	IN _title VARCHAR(250),
    IN _introduction TEXT,
    IN _words INT,
    IN _pathPublic VARCHAR(16),
    IN _files TEXT,
    IN _Image VARCHAR(250),
    IN _state VARCHAR(10)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        INSERT INTO rooms (title, introduction, total_words, path_public, name_files, image_room, state) VALUES (_title, _introduction, _words, _pathPublic, _files, _Image, _state);
        SELECT 'Success' AS Level;
    COMMIT;
END $$
DELIMITER ;

****************************************************************************************************
* Search All Rooms *****************************************************************************
****************************************************************************************************
DROP PROCEDURE IF EXISTS searchRooms;
DELIMITER $$
CREATE PROCEDURE searchRooms()
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        SELECT BIN_TO_UUID(id), title, total_words, path_public, DATE(date_created)
            FROM rooms;
    COMMIT;
END $$
DELIMITER ;

****************************************************************************************************
* Search Specific Room *****************************************************************************
****************************************************************************************************
DROP PROCEDURE IF EXISTS searchRoom;
DELIMITER $$
CREATE PROCEDURE searchRoom(
    IN _Id VARCHAR(36)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
    
    START TRANSACTION;
        SELECT BIN_TO_UUID(id), title, introduction, total_words, path_public, name_files, image_room
            FROM rooms
            WHERE id = BIN_TO_UUID(_id);
    COMMIT;
END $$
DELIMITER ;
****************************************************************************************************
* Update New Room **********************************************************************************
****************************************************************************************************
DROP PROCEDURE IF EXISTS updateRoom;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateRoom`(
    IN _id VARCHAR(36),
	IN _title VARCHAR(250),
    IN _introduction TEXT,
    IN _words INT,
    IN _files TEXT,
    IN _image VARCHAR(250),
    IN _state VARCHAR(10)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END; 
    
    DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
		SHOW WARNINGS;
        ROLLBACK;
    END;
	
    START TRANSACTION;
	UPDATE rooms SET title = _title, introduction = _introduction, total_words = _words, state = _state WHERE id = UUID_TO_BIN(_id);

	IF (_image IS NOT NULL) THEN
		UPDATE rooms SET image_room = _image WHERE id = UUID_TO_BIN(_id);
    END IF;
    
    IF (_files IS NOT NULL) THEN
		UPDATE rooms SET name_files = _files WHERE id = UUID_TO_BIN(_id);
    END IF;
    COMMIT;
    
	SELECT 'Success' AS Level;
END $$
DELIMITER ;