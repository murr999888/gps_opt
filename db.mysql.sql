-- --------------------------------------------------------
-- Хост:                         10.10.1.10
-- Версия сервера:               5.1.73 - Source distribution
-- Операционная система:         redhat-linux-gnu
-- HeidiSQL Версия:              10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных gps_opt
CREATE DATABASE IF NOT EXISTS `gps_opt` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `gps_opt`;

-- Дамп структуры для таблица gps_opt.app_state
CREATE TABLE IF NOT EXISTS `app_state` (
  `state_user_id` varchar(45) NOT NULL,
  `state_key` varchar(45) NOT NULL,
  `state_value` varchar(4000) DEFAULT NULL,
  UNIQUE KEY `idState` (`state_user_id`,`state_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица gps_opt.autos
CREATE TABLE IF NOT EXISTS `autos` (
  `id` varchar(38) NOT NULL,
  `in_use` tinyint(4) DEFAULT '0',
  `parent_id` varchar(38) DEFAULT '0',
  `name` varchar(50) DEFAULT '0',
  `water` int(11) DEFAULT '0',
  `bottle` int(11) DEFAULT '0',
  `tank` tinyint(4) DEFAULT '0',
  `is_watercarrier` tinyint(4) DEFAULT '0',
  `is_template` tinyint(4) DEFAULT '0',
  `time_increase_k` float DEFAULT '0',
  `worktime_begin` int(11) DEFAULT '0',
  `worktime_end` int(11) DEFAULT '0',
  `route_begin_endtime` int(11) DEFAULT '0',
  `route_end_endtime` int(11) DEFAULT '0',
  `maximize_water` tinyint(4) DEFAULT '0',
  `maximize_bottle` tinyint(4) DEFAULT '0',
  `driver_id` varchar(38) DEFAULT '0',
  `driver_name` varchar(50) DEFAULT '0',
  `allowed_clientgroups` text NOT NULL,
  `load_max` int(11) NOT NULL DEFAULT '0',
  `load_norm` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `in_use` (`in_use`),
  KEY `parent_id` (`parent_id`),
  KEY `is_watercarrier` (`is_watercarrier`),
  KEY `is_template` (`is_template`),
  KEY `driver_id` (`driver_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица gps_opt.calc_log
CREATE TABLE IF NOT EXISTS `calc_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `calc_type` varchar(50) NOT NULL DEFAULT '0',
  `user_id` tinyint(4) NOT NULL,
  `time_limit` int(11) NOT NULL,
  `orders_date` varchar(50) NOT NULL,
  `host_name` varchar(50) NOT NULL,
  `host_addr` varchar(50) NOT NULL,
  `calc_begin` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `calc_end` datetime NOT NULL,
  `calc_time` varchar(50) NOT NULL,
  `autos_count` tinyint(4) NOT NULL DEFAULT '0',
  `orders_all_count` int(11) NOT NULL DEFAULT '0',
  `orders_routes_count` int(11) NOT NULL DEFAULT '0',
  `routes_count` int(11) NOT NULL DEFAULT '0',
  `dropped_orders_count` int(11) NOT NULL DEFAULT '0',
  `total_distance` int(11) NOT NULL DEFAULT '0',
  `total_duration` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `calc_type` (`calc_type`)
) ENGINE=MyISAM AUTO_INCREMENT=661 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица gps_opt.servers
CREATE TABLE IF NOT EXISTS `servers` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `registration` bit(1) NOT NULL DEFAULT b'1',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `zoom` int(11) NOT NULL DEFAULT '0',
  `readonly` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица gps_opt.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hash` varchar(50) NOT NULL,
  `isadmin` bit(1) NOT NULL DEFAULT b'0',
  `readonly` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
