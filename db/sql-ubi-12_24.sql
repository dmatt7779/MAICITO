CREATE DATABASE  IF NOT EXISTS `ceipa_chatbot` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ceipa_chatbot`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ceipa_chatbot
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `introduction` text COLLATE utf8mb4_general_ci NOT NULL,
  `total_words` int NOT NULL,
  `path_public` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `name_files` text COLLATE utf8mb4_general_ci NOT NULL,
  `image_room` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `state` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (_binary 'nR\ËX\ƒ\ÔâYpµ\Ëqx\“','PROSPECTIVA DOS','PROSPECTIVA DOS',0,'66ba31d0317bf','1ra_problemica.pdf,2da_problemica.pdf,3ra_problemica.pdf,10c_como_fijar_precio_producto.pdf,ArticuloELE.pdf,Capitulo_1_Libro_Prospectiva.pdf,Competencia_del_nucleo_Prospectiva_2.pdf,Costos_Extrasalariales_en_Colombia.pdf,Estadistica_para_Gerentes_Francisco_Jaramillo.pdf,FundamentosDeLaProspectivaLaDisciplinaDelCambio.pdf,Herramientas_para_el_analisis_de_mercados.pdf,Libro_de_la_anticipacion_a_la_accion.pdf,MATEMATICAS_FINANCIERAS_DIGITAL.pdf,Material_AVA_Prospectiva_2.pdf,Preguntas_Frecuentes.pdf,REGIMEN_TARIFARIO.pdf,Resolucion_000114_de_21_12_2020.pdf,Rubricas.pdf,Semana_5_Distribuciones_Probabilidades.pdf,TRABAJO_DE_APLICACION_Journey_Map.pdf,VE17_1030.pdf,NORMAS_APA.pdf,ArticuloELE.pdf,Capitulo_1_Libro_Prospectiva.pdf,Costos_Extrasalariales_en_Colombia.pdf,FundamentosDeLaProspectivaLaDisciplinaDelCambio.pdf,Estadistica_para_Gerentes_Francisco_Jaramillo.pdf,Herramientas_para_el_analisis_de_mercados.pdf,Libro_de_la_anticipacion_a_la_accion.pdf,MATEMATICAS_FINANCIERAS_DIGITAL.pdf,10c_como_fijar_precio_producto.pdf,REGIMEN_TARIFARIO.pdf,Resolucion_000114_de_21_12_2020.pdf,Semana_5_Distribuciones_Probabilidades.pdf,VE17_1030.pdf,3ra_problemica.pdf,Competencia_del_nucleo_Prospectiva_2.pdf,Material_AVA_Prospectiva_2.pdf,Preguntas_Frecuentes.pdf,Rubricas.pdf,TRABAJO_DE_APLICACION_Journey_Map.pdf,1ra_problemica.pdf,2da_problemica.pdf','image.jpeg','ACTIVO','2024-08-12 11:01:20'),(_binary 'Otáj\Ô¥fÙkå\≈F\›','TEST','TEST',0,'6708752d4ef1a','1ra_problemica.pdf,2da_problemica.pdf,3ra_problemica.pdf,acuerdo-008-2020-pei.pdf,ArticuloELE.pdf,Capitulo_1_Libro_Prospectiva.pdf,costosextrasalarialesencolombia.pdf,de-la-anticipacion-a-la-accion.pdf,DialnetFundamentosDeLaProspectivaLaDisciplinaDe5262280.pdf,Estadistica_para_Gerentes_Francisco_Jaramillo.pdf,Herramientas_para_el_analisis_demercados.pdf,LIBRO_DIALOGOS_EMERGENTES_3_1_comprim.pdf,MATEMATICAS_FINANCIERAS_DIGITAL.pdf,no_10c_como_fijar_precio_producto.pdf,REGIMEN_TARIFARIO.pdf,Reglamento_estudiantil_vigente_2019.pdf,Semana_Distribuciones_de_Probabilidades.pdf,VE17.1030.pdf','otherImages.png','ACTIVO','2024-10-10 19:45:33'),(_binary '?J\„X®\ÔâYpµ\Ëqx\“','LABORATORIO DE IDEAS DOS','LABORATORIO DE IDEAS DOS',0,'66ba030f1a166','REGLAMENTO_ESTUDIANTIL.pdf,CALENDARIO_ACADEMICO_2024.pdf,NORMAS_APA.pdf,Material_AVA.pdf','image.jpeg','ACTIVO','2024-08-12 07:41:51'),(_binary '?æX˝äû\Ô¥fÙkå\≈F\›','PROSPECTIVA UNO','PROSPECTIVA UNO',0,'670dd51f074ab','acuerdo_encuentros_sincronicos.pdf,acuerdo-008-2020-pei.pdf,calendario-academico-2024.pdf,libro_dialogos_emergentes.pdf,pedagogia_tradicional.pdf,Reglamento-estudiantil-vigente-2019.pdf,0_Capitulo_1_Libro_Prospectiva.pdf,Material_AVA_en_pdf.pdf,Trabajo_de_aplicacion_Julio_2024.pdf,0_Libro_de_la_anticipacion_a_la_accion.pdf','image.jpeg','ACTIVO','2024-10-14 21:36:15'),(_binary 'AÒÖXß\ÔâYpµ\Ëqx\“','LABORATORIO DE IDEAS UNO','LABORATORIO DE IDEAS UNO',0,'66ba01649c792','Material_AVA.pdf,NORMAS_APA.pdf,CALENDARIO_ACADEMICO_2024.pdf,REGLAMENTO_ESTUDIANTIL.pdf','image.jpeg','ACTIVO','2024-08-12 07:34:44'),(_binary 'Nß\Ïù\\\Ôó-pµ\Ëqx\“','PRUEBA LABORATORIO','PRUEBA LABORATORIO 3',0,'66bfc432f2c57','2da_problemica.pdf,3ra_problemica.pdf,10c_como_fijar_precio_producto.pdf,ArticuloELE.pdf,Capitulo_1_Libro_Prospectiva.pdf,Competencia_del_nucleo_Prospectiva_2.pdf,Costos_Extrasalariales_en_Colombia.pdf,Estadistica_para_Gerentes_Francisco_Jaramillo.pdf,FundamentosDeLaProspectivaLaDisciplinaDelCambio.pdf,Herramientas_para_el_analisis_de_mercados.pdf','image.jpeg','ACTIVO','2024-08-16 16:27:15'),(_binary '£)ä¿äü\Ô¥fÙkå\≈F\›','PROSPECTIVA TRES','PROSPECTIVA TRES',0,'670dd77352b55','acuerdo_encuentros_sincronicos.pdf,acuerdo-008-2020-pei.pdf,calendario-academico-2024.pdf,libro_dialogos_emergentes.pdf,pedagogia_tradicional.pdf,Reglamento-estudiantil-vigente-2019.pdf,0_Capitulo_1_Libro_Prospectiva.pdf,0_LIBRO_DE_CASOS_EMPRESARIALES_DIGITAL.pdf,0_Libro_de_la_anticipacion_a_la_accion.pdf,0_VE17_1030.pdf,7s_mckinsey.pdf,aplicacion_modelo_de_lewin.pdf,ELARBOLDECOMPETENCIAS-1.pdf,Journey_Map_Trabajo_Aplicacion.pdf,Material_AVA_Prospectiva_3.pdf,Modelo_Kotter.pdf,naturaleza_del_cambio_planeado.pdf,OA1_AVA_P3.pdf,OA2_AVA_P3.pdf,OA3_AVA_P3.pdf','image.jpeg','ACTIVO','2024-10-14 21:46:11');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `token` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (_binary '©X{Ç\ÔßÙkå\≈F\›','lucia.castano@ceipa.edu.co','eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6Imx1Y2lhLmNhc3Rhbm9AY2VpcGEuZWR1LmNvIiwiaWF0IjoxNzI3Mjk4NTM3LCJleHAiOjE3MjczMDIxMzd9.YpbdPEAkK8m-uMcLepyObiqpjXMaHix9WopLqTyhG0Lt5KFFow2sQR_hJ4AdNiNvq2KPF-7b-C7JPHvzutTkezCgnC7wKBmW094VTMdk_JBVZsbpE__TfDqxj5_3qj5PmgwP-7XYrQymK4OgQFUHWQbr228Ulsm10Ar16w6zqznM-IdDj_0HvKLdqYuYvuhJr6m1Dlwexr_SMqceScvM0NJI088OhX38lex75-RcGOUMZBnFczDZP0dSdFnu_SBKS_2LssZ_Mz1jma6fgTNKE3m7GBWWwO4f6ks0Zdn1vwVjSCgXZXotpZ_tB0clJBfPj7u8QcMS09JmdtFuwMR780rCRVWd-gFtaBgHfwhiWKM89vo9LGzN9cTH4jNANJhfWiJwkwidII4SpKPY5bh8ydQjBn_Q0iuj_pR2WfLbQbq2U-B09_smGdrnSEe1yYHI07-CKVNvWslhI30Y4KC56UnIff7hc2iCeP4cB3ZIruX2ALiTJGO70UW4sHaVarFGYUNRLddValF8bvy8Cd0S7WHxQv1w1yjYDgc9mbPhrG71Z9-hKhYpkFdmp4JRm_CFRiCkPo8mJpKTT27QMbzvEu2X5-mP_ZzNHBarKYHrbdadWd0x_51jMq6E1hXAcLJ81o0GrmvuVogQMzBzsmVmk_vrXYriw_IdCtPQMFj-SGQ');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` blob NOT NULL,
  `token` text COLLATE utf8mb4_general_ci,
  `state` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '#õf1X\ÔâYpµ\Ëqx\“','LUCIA CASTANO MARIN','lucia.castano@ceipa.edu.co',_binary '$2y$10$v6ZTi2VJVAc72r27x02bfuqdIJQ.4hMN8bdxqQP1Ws7Lv6Ci0pp96','eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6IjIzOWI2NjMxLTU4MDUtMTFlZi04OTU5LTcwYjVlODcxNzhkMiIsIm5hbWUiOiJMVUNJQSBDQVNUQU5PIE1BUklOIiwiZW1haWwiOiJsdWNpYS5jYXN0YW5vQGNlaXBhLmVkdS5jbyJ9.GxdDoL7IeE1qt3ofi96N61F8LpVNuHjy-18NKglxx7ktYp-K_TnvZeVwTRKrB_pDPVDpxLyNcBAOqZHZuqZNjDCxbq0rkQ-vguJuQ4ohaQqkgs3lrH2dosz7gBXAVxNSdH9FS824QMjgbNL7AUg0SsWSEL7pMsYjElDdbGoOkcDDEjuhO-2aubHDCpQVvEfukY9T3FSEKCfbTrrlwgaQEyNxT7Ywis6LC_9tDR_oH9w6kN6w9DTckksDaUhdhV5ySnw1_89QNRzK_vMorpndi1wXSPK4b_iFjsoc_UjwfOmrDCPhRX0_qvxMo1tLrc4gL1SJH3sK0WNiTa3ulDgH223XL6zzGYEU_U3aJ12FdZ2mRIK0pJPhLje6LnIRqnBN8_dVUayA-O_bdkOp1pXut6nc670FKEV6lYQFhpGK9wDVCqEgRLFV0mp-V55aIq7_viQTkhQlekBm9ul0ELgypW5B5tgK_BzfazuOl_cjAIeaxLQyMeHWVrcDjNKrXWd5BgDTSViC58Q3bsJxG0rmTTRGffJbKXluJtBnJTNpqXgLCzWuc8idsO9b_LtY1fBmJogfN2XB9xVfJMZdLkq0RskrH3Bq2kwUgew42VeIlmsPpAXz1_AkfNaphqKMIpmKLSCIYi8GUROKeuLtEGKVbI8QbVXQWdWw71obOPINViA','ACTIVO','2024-08-11 12:14:16'),(_binary 'I\‚BÖ\"\«\ÔΩDpµ\Ëqx\“','ROBINSON GOMEZ NI√ëO','robinson.gomez.n@gmail.com',_binary '$2y$10$7wLBM42Cv0NA5r.Zy.VxU.jNv2QunD8J0tb3m.uFqnoC34FfRY8Ji','eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6IjQ5ZTI0Mjg1LTIyYzctMTFlZi1iZDQ0LTcwYjVlODcxNzhkMiIsIm5hbWUiOiJST0JJTlNPTiBHT01FWiBOSVx1MDBkMU8iLCJlbWFpbCI6InJvYmluc29uLmdvbWV6Lm5AZ21haWwuY29tIn0.fE1o3JCIi0OEQtyaN_ZXbsXp1gNVkQhtrw9wEICOjm74Mtvcg1eMoFwL9poGy5qAI7ta63Tw9QFb8SXthXttgL1GuFUxSorFshSYm-xc1sC_AbETtXRePKP8FJJEoH0E0776NCUFbC5q7R9Z1h3SzqgrVb-Wt6uSXug_1pdipHVX54hLk40kxUeFV3_QHmmuh8_Br5xv5jug98BGpKRO6dAlTQrR5UCGfguOhHXNrRqtKZ2ZwxYFWrLKk7qzjzwqA8YJPKMbbJaOmhR-P9GV9Szo4XPsuTZMX43TzI-90eO-yjaBvGeH6xySlqdKz6c7YuDTdTfP6PklU2EEHqJkKwKb2GMzqflxOtUj0XzIy1Ps2sdPYc234avpsgmyfVFk11NPA2mZvTLjRfjbw_i3gXZkY6GJgZYCrLeVKMxps-s-7Cku8jfR8k3vgF88V_JOO1_Az50A55FPGD2w16yP42ZhEfa3IaCnjmu38FlYy6aL14fnk7DQCD6BK0y-Z_iQxzWb3OrTk59WQ_Fn3Ucf8Lxwvv2ze0KVFi3CiT8fBGr9HMBzXi8vmD4_9iHmyaYN37bk-8KGq7Sivz8hWqnQJHancXLt1VobHv9rrBGluYh9GPxmnl-Jyba1OVrtiC3NZnh_ADa_qX-J9FUtE4rOF28c0sEBZ4fIVMFknUOtWeI','ACTIVO','2024-06-04 18:08:00'),(_binary 'Ä πX\ÔâYpµ\Ëqx\“','MARTA LUZ MAYA','it_admon@ceipa.edu.co',_binary '$2y$10$YbJszXYKmRvyfBZWl8I8aeEVMvGuqyS3H0UTKEJ.6/3KhRJLeSfka',NULL,'INACTIVO','2024-08-11 12:16:51'),(_binary '¡tY†X\ÔâYpµ\Ëqx\“','MARCELO ALVARENGA TAMAYO','marcelo_alvarengata@ceipa.edu.co',_binary '$2y$10$mJ5DJkLwyIizWFQjo19JD.TUz.58XSh.FhjIdgUySuTAKxAmyVH8a',NULL,'INACTIVO','2024-08-11 12:18:41');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ceipa_chatbot'
--
/*!50003 DROP PROCEDURE IF EXISTS `deleteRoom` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteRoom`(
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
	
	DELETE FROM rooms WHERE id = UUID_TO_BIN(_Id);    
	SELECT 'success' AS Level;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `registerRoom` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `registerRoom`(
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
        SELECT 'success' AS Level;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `registerUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `registerUser`(
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
        SELECT 'success' AS Level;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `searchEmail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchEmail`(
	IN _Email VARCHAR(250)
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
        SELECT email
            FROM users
            WHERE email = _Email;
    COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `searchPathRoomByName` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchPathRoomByName`(
	IN _Name VARCHAR(250)
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
        SELECT path_public
            FROM rooms
            WHERE title = _Name;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `searchRoom` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchRoom`(
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
            WHERE id = UUID_TO_BIN(_id);
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `searchRoomByTitle` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchRoomByTitle`(
	IN _title VARCHAR(250)
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
        SELECT BIN_TO_UUID(id), title, total_words, path_public, DATE(date_created) as dateCreate, state, image_room
            FROM rooms
            WHERE title LIKE CONCAT(_title, '%');
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `searchRooms` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `searchRooms`()
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
        SELECT BIN_TO_UUID(id), title, total_words, path_public, DATE(date_created) as dateCreate, state, image_room
            FROM rooms;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `signIn` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `signIn`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updatePassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updatePassword`(
	IN _email VARCHAR(50),
	IN _password BLOB,
    IN _token TEXT
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
		SELECT COUNT(email)
			INTO @validateEmail
			FROM tokens
			WHERE email = _email
                AND token = _token;
    
		IF (@validateEmail = 0) THEN
			UPDATE users SET password = _password WHERE email = _email;
            INSERT INTO tokens (email, token) VALUES (_email, _token);
			SELECT 'success' AS Level;
		ELSE
			SELECT 'warning' AS Level;
        END IF;        
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateRoom` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateRoom`(
    IN _id VARCHAR(36),
	IN _title VARCHAR(250),
    IN _introduction TEXT,
    IN _words INT,
    IN _files TEXT,
    IN _image VARCHAR(250)
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
	UPDATE rooms SET title = _title, introduction = _introduction, total_words = _words WHERE id = UUID_TO_BIN(_id);

	IF (_image IS NOT NULL) THEN
		UPDATE rooms SET image_room = _image WHERE id = UUID_TO_BIN(_id);
    END IF;
    
    IF (_files IS NOT NULL) THEN
		UPDATE rooms SET name_files = _files WHERE id = UUID_TO_BIN(_id);
    END IF;
    COMMIT;
    
	SELECT 'success' AS Level;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateSignIn` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateSignIn`(
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
    SELECT 'success' AS Level;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateStateRoom` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateStateRoom`(
    IN _id VARCHAR(36),
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
	
	UPDATE rooms SET state = _state WHERE id = UUID_TO_BIN(_id);    
	SELECT 'success' AS Level;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09 18:39:54
